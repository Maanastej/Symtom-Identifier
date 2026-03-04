// Shared types used across the application

export interface EpidemicAlert {
  id: string;
  region: string;
  case_count: number;
  alert_level: string;
  threshold_exceeded: boolean;
  updated_at: string;
  diseases: {
    name: string;
    severity: string;
  } | null;
}

export interface DiseaseReport {
  id: string;
  disease_id: string;
  location_lat: number;
  location_lng: number;
  city: string | null;
  state: string | null;
  reported_at: string;
  diseases: {
    name: string;
    severity: string;
    is_communicable: boolean;
  } | null;
}

// other shared types can be added here as needed
