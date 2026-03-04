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

    if (GEMINI_API_KEY) {
      // Reformat payload for Google AI API
      // Using v1 endpoint which is more stable across regions
      apiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:streamGenerateContent?alt=sse&key=${GEMINI_API_KEY}`
      headers = { 'Content-Type': 'application/json' }

      const systemPrompt = `You are an AI Health Assistant for "Medical Third Opinion", a platform that helps users identify symptoms and track their health.
Your goals are:
1. Provide helpful, accurate, and empathetic health and wellness advice.
2. Explain medical terms in simple language.
3. Encourage users to consult with real medical professionals for definitive diagnoses.
4. Suggest using the platform's "Symptom Checker" or "Health Metrics" features when relevant.

Strictly follow these rules:
- DO NOT provide definitive prescriptions or dosages.
- ALWAYS include a medical disclaimer if giving advice on symptoms.
- If a user reports symptoms that sound like an emergency (chest pain, stroke signs, severe bleeding), urge them to CALL EMERGENCY SERVICES immediately.
- Keep responses concise and use Markdown formatting for readability.`;

      bodyPayload = {
        contents: [
          {
            role: 'user',
            parts: [{ text: `SYSTEM INSTRUCTION: ${systemPrompt}\n\nPlease help the user with the following conversation.` }]
          },
          {
            role: 'model',
            parts: [{ text: 'Understood. I will act as a helpful and safe AI Health Assistant according to those instructions.' }]
          },
          ...messages.map((m: any) => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }]
          }))
        ],
        generationConfig: {
          temperature: 0.7,
          topP: 0.8,
          topK: 40,
        }
      }
    }

    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(bodyPayload),
    })

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error('AI Service Error:', errorData);
      const errorMessage = typeof errorData.error === 'string'
        ? errorData.error
        : (errorData.error?.message || 'Failed to connect to AI service');
      throw new Error(errorMessage);
    }

    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();
    const reader = res.body!.getReader();
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    (async () => {
      try {
        let buffer = '';
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          if (GEMINI_API_KEY) {
            // Google API Format: data: {"candidates":[{"content":{"parts":[{"text":"..."}]}}]}
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const jsonStr = line.slice(6).trim();
                try {
                  const json = JSON.parse(jsonStr);
                  const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
                  if (text) {
                    writer.write(encoder.encode(`data: ${JSON.stringify({ choices: [{ delta: { content: text } }] })}\n\n`));
                  }
                } catch (e) {
                  // Partial JSON, keep in buffer
                }
              }
            }
          } else {
            // Lovable/OpenAI Format: Already correct, just pass through or split by lines to be safe
            writer.write(encoder.encode(buffer));
            buffer = '';
          }
        }
      } catch (err) {
        console.error('Stream error:', err);
      } finally {
        writer.write(encoder.encode('data: [DONE]\n\n'));
        writer.close();
      }
    })();

    return new Response(readable, {
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
