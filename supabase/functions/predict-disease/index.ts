import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// --- Local Prediction Logic (Fallback) ---
function normalizeSymptom(symptom: string): string {
  return symptom.toLowerCase().trim().replace(/[^a-z\s]/g, '');
}

function fuzzyMatch(userSymptom: string, diseaseSymptom: string): boolean {
  const user = normalizeSymptom(userSymptom);
  const disease = normalizeSymptom(diseaseSymptom);
  if (user === disease) return true;
  if (user.includes(disease) || disease.includes(user)) return true;
  const userWords = user.split(' ');
  const diseaseWords = disease.split(' ');
  for (const uw of userWords) {
    for (const dw of diseaseWords) {
      if (uw.length > 3 && dw.length > 3 && (uw.includes(dw) || dw.includes(uw))) return true;
    }
  }
  return false;
}

function calculateLocalPrediction(userSymptoms: string[], diseaseSymptoms: string[]) {
  const matched: string[] = [];
  const matchedDiseaseSymptoms = new Set<string>();
  for (const userSymptom of userSymptoms) {
    for (const diseaseSymptom of diseaseSymptoms) {
      if (!matchedDiseaseSymptoms.has(diseaseSymptom) && fuzzyMatch(userSymptom, diseaseSymptom)) {
        matched.push(userSymptom);
        matchedDiseaseSymptoms.add(diseaseSymptom);
        break;
      }
    }
  }
  if (userSymptoms.length === 0) return { score: 0, matched: [] };
  const score = (matched.length / userSymptoms.length * 0.6) + (matchedDiseaseSymptoms.size / diseaseSymptoms.length * 0.4);
  return { score, matched };
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { symptoms } = await req.json();
    if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
      return new Response(JSON.stringify({ error: "Please provide symptoms" }), { status: 400, headers: corsHeaders });
    }

    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { data: diseases, error: fetchError } = await supabase.from("diseases").select("*");
    if (fetchError) throw fetchError;

    const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY');
    
    if (GROQ_API_KEY) {
      console.log("Using Groq AI for prediction...");
      const apiUrl = `https://api.groq.com/openai/v1/chat/completions`;
      
      const prompt = `You are a medical diagnostic assistant. Analyze these symptoms: ${symptoms.join(", ")}.
Here is a database of known diseases and their typical symptoms:
${JSON.stringify(diseases.map(d => ({ name: d.name, symptoms: d.symptoms, id: d.id })))}

Based ON ONLY THE DATABASE PROVIDED, identify the top 3 most likely conditions.
Return your response as a valid JSON object with this structure:
{
  "predictions": [
    {
      "disease_name": "string",
      "confidence": number (0-100),
      "matched_symptoms": ["string"],
      "reasoning": "string",
      "severity": "low|moderate|severe|critical"
    }
  ],
  "follow_up_questions": ["string"],
  "general_advice": "string",
  "urgency": "low|medium|high|emergency"
}
Important: Be conservative with confidence scores. If the symptoms are vague or could match multiple conditions, generate 2-3 specific "follow_up_questions" that would help you narrow down the diagnosis. 
CRITICAL RULE: The input may contain statements starting with "Patient clarified:". You MUST read these carefully. Do NOT ask questions that have already been answered in the clarifications. If the clarifications resolve the ambiguity, or if you are highly confident in your prediction, leave "follow_up_questions" completely empty.`;

      const aiRes = await fetch(apiUrl, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`
        },
        body: JSON.stringify({ 
          model: "llama-3.3-70b-versatile",
          messages: [{ role: "user", content: prompt }],
          response_format: { type: "json_object" }
        }),
      });

      if (aiRes.ok) {
        const aiData = await aiRes.json();
        const responseText = aiData.choices?.[0]?.message?.content;
        if (responseText) {
          const parsed = JSON.parse(responseText);
          // Enrich with database info (precautions, medications)
          parsed.predictions = parsed.predictions.map((p: any) => {
            const dbMatch = diseases.find(d => d.name.toLowerCase() === p.disease_name.toLowerCase());
            return {
              ...p,
              precautions: dbMatch?.precautions || [],
              medications: dbMatch?.medications || [],
              is_communicable: dbMatch?.is_communicable || false
            };
          });
          return new Response(JSON.stringify(parsed), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
        }
      }
      console.warn("AI Prediction failed or returned empty, falling back to local logic");
    }

    // Local Fallback Logic
    console.log("Running local prediction fallback...");
    const predictionsList = diseases.map(disease => {
      const { score, matched } = calculateLocalPrediction(symptoms, disease.symptoms || []);
      const confidence = Math.min(100, Math.round(score * 100 * (matched.length >= 3 ? 1.2 : 1.0)));
      return {
        disease_name: disease.name,
        confidence,
        matched_symptoms: matched,
        severity: disease.severity || "moderate",
        is_communicable: disease.is_communicable || false,
        precautions: disease.precautions || [],
        medications: disease.medications || [],
        reasoning: `Matched ${matched.length} symptoms via fuzzy matching.`,
        score
      };
    });

    const topPredictions = predictionsList.filter(p => p.score > 0).sort((a, b) => b.score - a.score).slice(0, 5);
    const urgency = topPredictions.some(p => p.severity === "critical" || p.severity === "severe") ? "high" : "medium";

    return new Response(JSON.stringify({
      predictions: topPredictions,
      general_advice: topPredictions.length > 0 ? "Predictions based on local matching logic." : "No matches found.",
      urgency
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders });
  }
});


