// K-Nearest Neighbors algorithm for disease prediction

export interface Disease {
  id: string;
  name: string;
  description: string | null;
  symptoms: string[];
  precautions: string[];
  medications: string[];
  severity: string;
  is_communicable: boolean;
  transmission_rate: number;
}

export interface PredictionResult {
  disease: Disease;
  matchScore: number;
  matchedSymptoms: string[];
  confidence: number;
}

// Normalize symptom text for comparison
function normalizeSymptom(symptom: string): string {
  return symptom.toLowerCase().trim().replace(/[^a-z\s]/g, '');
}

// Calculate Jaccard similarity between two symptom sets
function jaccardSimilarity(set1: string[], set2: string[]): number {
  const normalized1 = new Set(set1.map(normalizeSymptom));
  const normalized2 = new Set(set2.map(normalizeSymptom));
  
  const intersection = new Set([...normalized1].filter(x => normalized2.has(x)));
  const union = new Set([...normalized1, ...normalized2]);
  
  if (union.size === 0) return 0;
  return intersection.size / union.size;
}

// Calculate weighted match score
function calculateMatchScore(userSymptoms: string[], diseaseSymptoms: string[]): {
  score: number;
  matched: string[];
} {
  const normalizedUser = userSymptoms.map(normalizeSymptom);
  const normalizedDisease = diseaseSymptoms.map(normalizeSymptom);
  
  const matched: string[] = [];
  
  normalizedUser.forEach((userSymptom, index) => {
    for (const diseaseSymptom of normalizedDisease) {
      // Check for exact match or partial match
      if (diseaseSymptom === userSymptom || 
          diseaseSymptom.includes(userSymptom) || 
          userSymptom.includes(diseaseSymptom)) {
        matched.push(userSymptoms[index]);
        break;
      }
    }
  });
  
  // Score based on: 
  // 1. Percentage of user symptoms matched in disease
  // 2. Percentage of disease symptoms covered by user
  const userMatchRatio = matched.length / userSymptoms.length;
  const diseaseMatchRatio = matched.length / diseaseSymptoms.length;
  
  // Weighted combination - favor matching more user symptoms
  const score = (userMatchRatio * 0.7) + (diseaseMatchRatio * 0.3);
  
  return { score, matched };
}

// Fuzzy symptom matching for partial matches
function fuzzyMatch(userSymptom: string, diseaseSymptom: string): boolean {
  const user = normalizeSymptom(userSymptom);
  const disease = normalizeSymptom(diseaseSymptom);
  
  // Direct match
  if (user === disease) return true;
  
  // Partial match
  if (user.includes(disease) || disease.includes(user)) return true;
  
  // Word-level match
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

// Advanced match score with fuzzy matching
function advancedMatchScore(userSymptoms: string[], diseaseSymptoms: string[]): {
  score: number;
  matched: string[];
} {
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
  
  // Score calculation
  const score = (userMatchRatio * 0.6) + (diseaseMatchRatio * 0.4);
  
  return { score, matched };
}

// KNN prediction function
export function predictDisease(
  userSymptoms: string[],
  diseases: Disease[],
  k: number = 5
): PredictionResult[] {
  if (userSymptoms.length === 0 || diseases.length === 0) {
    return [];
  }
  
  // Calculate match scores for all diseases
  const scores = diseases.map(disease => {
    const { score, matched } = advancedMatchScore(userSymptoms, disease.symptoms);
    
    // Calculate confidence based on multiple factors
    const confidence = Math.min(100, Math.round(
      score * 100 * 
      (matched.length >= 3 ? 1.2 : matched.length >= 2 ? 1.0 : 0.8)
    ));
    
    return {
      disease,
      matchScore: score,
      matchedSymptoms: matched,
      confidence
    };
  });
  
  // Sort by match score (descending)
  scores.sort((a, b) => b.matchScore - a.matchScore);
  
  // Return top K results with score > 0
  return scores.filter(s => s.matchScore > 0).slice(0, k);
}

// Get all unique symptoms from disease database
export function getAllSymptoms(diseases: Disease[]): string[] {
  const symptomSet = new Set<string>();
  
  diseases.forEach(disease => {
    disease.symptoms.forEach(symptom => {
      symptomSet.add(symptom.toLowerCase().trim());
    });
  });
  
  return Array.from(symptomSet).sort();
}

// Calculate epidemic risk based on disease reports
export function calculateEpidemicRisk(
  reports: { disease_id: string; location_lat: number; location_lng: number; reported_at: string }[],
  diseases: Disease[],
  regionRadiusKm: number = 50,
  timeWindowDays: number = 14
): Map<string, { count: number; risk: 'low' | 'medium' | 'high' | 'critical' }> {
  const now = new Date();
  const timeWindow = timeWindowDays * 24 * 60 * 60 * 1000;
  
  // Filter recent reports
  const recentReports = reports.filter(r => {
    const reportDate = new Date(r.reported_at);
    return now.getTime() - reportDate.getTime() <= timeWindow;
  });
  
  // Count by disease
  const diseaseCounts = new Map<string, number>();
  recentReports.forEach(r => {
    const count = diseaseCounts.get(r.disease_id) || 0;
    diseaseCounts.set(r.disease_id, count + 1);
  });
  
  // Calculate risk levels
  const riskMap = new Map<string, { count: number; risk: 'low' | 'medium' | 'high' | 'critical' }>();
  
  diseaseCounts.forEach((count, diseaseId) => {
    const disease = diseases.find(d => d.id === diseaseId);
    const transmissionRate = disease?.transmission_rate || 0;
    const isCommunicable = disease?.is_communicable || false;
    
    let risk: 'low' | 'medium' | 'high' | 'critical' = 'low';
    
    if (isCommunicable) {
      const adjustedCount = count * (1 + transmissionRate);
      if (adjustedCount >= 100) risk = 'critical';
      else if (adjustedCount >= 50) risk = 'high';
      else if (adjustedCount >= 20) risk = 'medium';
    } else {
      if (count >= 50) risk = 'high';
      else if (count >= 20) risk = 'medium';
    }
    
    riskMap.set(diseaseId, { count, risk });
  });
  
  return riskMap;
}
