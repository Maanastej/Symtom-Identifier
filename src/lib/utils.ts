import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Derive simple epidemic alerts based on raw disease reports when
// the server-side `epidemic_alerts` table is empty. The threshold and
// alert levels are arbitrary and can be adjusted.
import type { EpidemicAlert, DiseaseReport } from './types';

export function computeAlertsFromReports(
  reports: DiseaseReport[],
  threshold: number = 10
): EpidemicAlert[] {
  const map: Record<string, { count: number; severity: string; diseaseName: string }> = {};

  reports.forEach((r) => {
    const region = r.state || r.city || 'Unknown';
    const disease = r.diseases?.name || 'Unknown';
    const key = `${region}::${disease}`;
    if (!map[key]) {
      map[key] = { count: 0, severity: r.diseases?.severity || 'moderate', diseaseName: disease };
    }
    map[key].count += 1;
  });

  return Object.entries(map)
    .filter(([_, v]) => v.count >= threshold)
    .map(([key, v]) => {
      const [region, disease] = key.split('::');
      let level: EpidemicAlert['alert_level'] = 'low';
      if (v.count >= 100) level = 'critical';
      else if (v.count >= 50) level = 'high';
      else if (v.count >= 20) level = 'medium';

      return {
        id: `${region}-${disease}`,
        region,
        case_count: v.count,
        alert_level: level,
        threshold_exceeded: true,
        updated_at: new Date().toISOString(),
        diseases: {
          name: v.diseaseName,
          severity: v.severity,
        },
      };
    });
}
