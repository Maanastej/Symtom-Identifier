import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { symptoms } = await req.json();
    
    if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
      return new Response(
        JSON.stringify({ error: "Please provide symptoms as an array" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Fetch diseases from database for context
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: diseases } = await supabase
      .from("diseases")
      .select("*");

    const diseaseContext = diseases?.map(d => 
      `- ${d.name}: symptoms: [${d.symptoms?.join(", ")}], severity: ${d.severity}, communicable: ${d.is_communicable}, precautions: [${d.precautions?.join(", ")}], medications: [${d.medications?.join(", ")}]`
    ).join("\n") || "No diseases in database";

    const systemPrompt = `You are a medical AI assistant that helps predict possible diseases based on symptoms. You have access to a disease database.

DISEASE DATABASE:
${diseaseContext}

IMPORTANT RULES:
1. Only suggest diseases from the database above
2. Provide confidence scores (0-100) based on symptom match
3. Always include a disclaimer that this is not a medical diagnosis
4. Be helpful but cautious - recommend seeing a doctor for serious symptoms
5. Return your response as valid JSON

OUTPUT FORMAT (strict JSON):
{
  "predictions": [
    {
      "disease_name": "string",
      "confidence": number (0-100),
      "matched_symptoms": ["symptom1", "symptom2"],
      "severity": "mild|moderate|severe|critical",
      "is_communicable": boolean,
      "precautions": ["precaution1", "precaution2"],
      "medications": ["med1", "med2"],
      "reasoning": "Brief explanation of why this disease matches"
    }
  ],
  "general_advice": "string with general health advice",
  "urgency": "low|medium|high|emergency"
}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `I am experiencing the following symptoms: ${symptoms.join(", ")}. Please analyze these symptoms and predict possible diseases from your database.` }
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded, please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required, please add credits." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    // Parse JSON from response
    let predictions;
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        predictions = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      predictions = {
        predictions: [],
        general_advice: content,
        urgency: "medium"
      };
    }

    return new Response(
      JSON.stringify(predictions),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("predict-disease error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
