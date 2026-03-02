import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// --- Prediction Logic Start ---

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
      if (uw.length > 3 && dw.length > 3 && (uw.includes(dw) || dw.includes(uw))) {
        return true;
      }
    }
  }
  
  return false;
}

function calculatePrediction(userSymptoms: string[], diseaseSymptoms: string[]) {
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
  
  const userMatchRatio = matched.length / userSymptoms.length;
  const diseaseMatchRatio = matchedDiseaseSymptoms.size / diseaseSymptoms.length;
  
  // Weighted score favor matching user symptoms
  const score = (userMatchRatio * 0.6) + (diseaseMatchRatio * 0.4);
  
  return { score, matched };
}

// --- Prediction Logic End ---

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

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch diseases from database
    const { data: diseases, error: fetchError } = await supabase
      .from("diseases")
      .select("*");

    if (fetchError) throw fetchError;

    if (!diseases || diseases.length === 0) {
      return new Response(
        JSON.stringify({ error: "Disease database is empty" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Run prediction model
    const predictionsList = diseases.map(disease => {
      const { score, matched } = calculatePrediction(symptoms, disease.symptoms || []);
      
      // Calculate confidence (0-100)
      const confidence = Math.min(100, Math.round(
        score * 100 * 
        (matched.length >= 3 ? 1.2 : matched.length >= 2 ? 1.0 : 0.8)
      ));
      
      return {
        disease_name: disease.name,
        confidence: confidence,
        matched_symptoms: matched,
        severity: disease.severity || "moderate",
        is_communicable: disease.is_communicable || false,
        precautions: disease.precautions || [],
        medications: disease.medications || [],
        reasoning: `Matched ${matched.length} symptoms: ${matched.join(", ")}. This provides a match score of ${Math.round(score * 100)}%.`,
        score: score
      };
    });

    // Sort by score and take top 5
    const topPredictions = predictionsList
      .filter(p => p.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    // Determine overall urgency
    let maxUrgency = "low";
    const severities = topPredictions.map(p => p.severity);
    if (severities.includes("critical")) maxUrgency = "emergency";
    else if (severities.includes("severe")) maxUrgency = "high";
    else if (severities.includes("moderate")) maxUrgency = "medium";

    const response = {
      predictions: topPredictions,
      general_advice: topPredictions.length > 0 
        ? `Based on your symptoms (${symptoms.join(", ")}), the local model predicts ${topPredictions[0].disease_name} as the most likely condition. Please consult a doctor for a definitive diagnosis.`
        : "No matching diseases found in our database for these symptoms.",
      urgency: maxUrgency
    };

    return new Response(
      JSON.stringify(response),
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

