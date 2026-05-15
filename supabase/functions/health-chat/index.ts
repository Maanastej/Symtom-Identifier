import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Tool definitions for Groq
const tools = [
  {
    function_declarations: [
      {
        name: "getUserProfile",
        description: "Retrieves the user's health profile including age, blood group, height, and weight.",
        parameters: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "getLatestHealthMetrics",
        description: "Fetches the most recent health metrics for the user, such as heart rate, body temperature, and blood oxygen levels.",
        parameters: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "searchDiseases",
        description: "Searches the disease database based on symptoms to find potential condition matches, descriptions, and precautions.",
        parameters: {
          type: "object",
          properties: {
            symptoms: {
              type: "array",
              items: { type: "string" },
              description: "List of symptoms to search for."
            }
          },
          required: ["symptoms"]
        },
      },
      {
        name: "reportDiseaseCase",
        description: "Reports a suspected disease case to the platform for tracking. Should only be called after a likely condition is identified.",
        parameters: {
          type: "object",
          properties: {
            disease_id: { type: "string", description: "The UUID of the disease to report." },
            symptoms: { type: "array", items: { type: "string" }, description: "The symptoms reported by the user." },
            city: { type: "string", description: "User's city." },
            state: { type: "string", description: "User's state." }
          },
          required: ["disease_id", "symptoms"]
        },
      }
    ]
  }
];

const SYSTEM_PROMPT = `You are an AI Health Assistant for "Medical Third Opinion", a platform that helps users identify symptoms and track their health.
Your goal is to be an "Agentic AI":
1. **Be Inquisitive**: Do not jump to conclusions. If a user mentions a symptom, ask clarifying questions (e.g., "When did it start?", "Is it persistent?", "Are there other symptoms?").
2. **Use Tools**: You have access to the user's profile and latest health metrics. Use them to provide personalized advice.
3. **Analyze Data**: Cross-reference reported symptoms with the user's vitals (e.g., if they say they have a fever, check their latest body temperature metric).
4. **Encourage Action**: Suggest using the "Symptom Checker" or reporting a case if a likely match is found.

Strictly follow these rules:
- ALWAYS include a medical disclaimer.
- DO NOT provide definitive prescriptions or dosages.
- URGENTLY advise calling emergency services for life-threatening symptoms (chest pain, etc.).
- Keep responses concise and use Markdown.`;

serve(async (req: Request) => {
  console.log("Health Chatbot Edge Function - Groq Agentic AI Version Initiated");
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { messages } = await req.json()
    const authHeader = req.headers.get('Authorization')!
    const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY')
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get user from token
    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''))
    if (authError || !user) throw new Error("Unauthorized")

    const apiUrl = `https://api.groq.com/openai/v1/chat/completions`
    
    const groqTools = tools[0].function_declarations.map(f => ({
      type: "function",
      function: f
    }));

    const groqMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages
    ];

    const bodyPayload = {
      model: "llama-3.3-70b-versatile",
      messages: groqMessages,
      tools: groqTools,
      tool_choice: "auto",
      temperature: 0.7,
    };

    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify(bodyPayload),
    })

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error?.message || 'Failed to connect to Groq service');
    }

    const data = await res.json();
    const message = data.choices?.[0]?.message;
    let responseText = message?.content || "";
    const toolCalls = message?.tool_calls;

    if (toolCalls && toolCalls.length > 0) {
      console.log("Handling tool calls:", toolCalls.length);
      const toolResults = [...groqMessages, message];

      for (const call of toolCalls) {
        const { name, arguments: argsString } = call.function;
        const args = JSON.parse(argsString);
        let result;

        try {
          if (name === "getUserProfile") {
            const { data } = await supabase.from('profiles').select('*').eq('user_id', user.id).single();
            result = data || { error: "Profile not found" };
          } else if (name === "getLatestHealthMetrics") {
            const { data } = await supabase.from('health_metrics').select('*').eq('user_id', user.id).order('recorded_at', { ascending: false }).limit(1);
            result = data?.[0] || { error: "No metrics found" };
          } else if (name === "searchDiseases") {
            const { data } = await supabase.from('diseases').select('*');
            const searchResults = data?.filter(d => 
              args.symptoms.some((s: string) => d.symptoms.some((ds: string) => ds.toLowerCase().includes(s.toLowerCase())))
            ).slice(0, 3);
            result = searchResults || [];
          } else if (name === "reportDiseaseCase") {
            const { data, error } = await supabase.from('disease_reports').insert({
              user_id: user.id,
              disease_id: args.disease_id,
              symptoms_reported: args.symptoms,
              city: args.city,
              state: args.state,
              location_lat: 0,
              location_lng: 0
            }).select().single();
            result = error ? { error: error.message } : { success: true, report: data };
          }
        } catch (err: any) {
          result = { error: err.message };
        }

        toolResults.push({
          tool_call_id: call.id,
          role: "tool",
          name: name,
          content: JSON.stringify(result),
        });
      }

      // Call Groq again with the results
      const finalRes = await fetch(apiUrl, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: bodyPayload.model,
          messages: toolResults,
        }),
      });

      const finalData = await finalRes.json();
      responseText = finalData.choices?.[0]?.message?.content || "I processed your request but couldn't generate a text response.";
    }

    // Return as stream for compatibility
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ choices: [{ delta: { content: responseText } }] })}\n\n`));
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error: any) {
    console.error('Function Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})


