import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { messages } = await req.json()
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')
    const LOVABLE_AI_KEY = Deno.env.get('LOVABLE_AI_KEY')

    let apiUrl = 'https://api.lovable.dev/ai/chat'
    let headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${LOVABLE_AI_KEY || Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
    }
    let bodyPayload: any = {
      model: 'gemini-1.5-flash',
      messages: [
        {
          role: 'system',
          content: `You are an AI Health Assistant for "Medical Third Opinion", a platform that helps users identify symptoms and track their health.
          Your goals are:
          1. Provide helpful, accurate, and empathetic health and wellness advice.
          2. Explain medical terms in simple language.
          3. Encourage users to consult with real medical professionals for definitive diagnoses.
          4. Suggest using the platform's "Symptom Checker" or "Health Metrics" features when relevant.
          
          Strictly follow these rules:
          - DO NOT provide definitive prescriptions or dosages.
          - ALWAYS include a medical disclaimer if giving advice on symptoms.
          - If a user reports symptoms that sound like an emergency (chest pain, stroke signs, severe bleeding), urge them to CALL EMERGENCY SERVICES immediately.
          - Keep responses concise and use Markdown formatting for readability.`
        },
        ...messages
      ],
      stream: true,
    }

    // IF the user provided a direct Gemini API key, use the Google API instead
    if (GEMINI_API_KEY) {
      // Reformat payload for Google AI API
      apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:streamGenerateContent?alt=sse&key=${GEMINI_API_KEY}`
      headers = { 'Content-Type': 'application/json' }
      bodyPayload = {
        systemInstruction: {
          parts: [{
            text: `You are an AI Health Assistant for "Medical Third Opinion", a platform that helps users identify symptoms and track their health.
          Your goals are:
          1. Provide helpful, accurate, and empathetic health and wellness advice.
          2. Explain medical terms in simple language.
          3. Encourage users to consult with real medical professionals for definitive diagnoses.
          4. Suggest using the platform's "Symptom Checker" or "Health Metrics" features when relevant.
          
          Strictly follow these rules:
          - DO NOT provide definitive prescriptions or dosages.
          - ALWAYS include a medical disclaimer if giving advice on symptoms.
          - If a user reports symptoms that sound like an emergency (chest pain, stroke signs, severe bleeding), urge them to CALL EMERGENCY SERVICES immediately.
          - Keep responses concise and use Markdown formatting for readability.` }]
        },
        contents: messages.map((m: any) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }]
        })),
        generationConfig: {
          temperature: 0.7,
          topP: 0.8,
          topK: 40,
        }
      }
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(bodyPayload),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('AI Service Error:', errorData);
      throw new Error(errorData.error || 'Failed to connect to AI service');
    }

    // Proxy the response stream
    return new Response(response.body, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })

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
