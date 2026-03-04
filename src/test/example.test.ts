import { describe, it, expect } from "vitest";

import { describe, it, expect } from "vitest";
import { computeAlertsFromReports } from "../lib/utils";
import type { DiseaseReport } from "../lib/types";

describe("computeAlertsFromReports", () => {
  it("returns empty array when no reports", () => {
    expect(computeAlertsFromReports([])).toEqual([]);
  });

  it("creates alerts when reports exceed threshold", () => {
    const reports: DiseaseReport[] = [];
    for (let i = 0; i < 12; i++) {
      reports.push({
        id: `r${i}`,
        disease_id: "d1",
        location_lat: 0,
        location_lng: 0,
        city: null,
        state: "StateA",
        reported_at: new Date().toISOString(),
        diseases: { name: "Flu", severity: "moderate", is_communicable: true }
      });
    }
    const alerts = computeAlertsFromReports(reports, 10);
    expect(alerts.length).toBe(1);
    expect(alerts[0].region).toBe("StateA");
    expect(alerts[0].diseases?.name).toBe("Flu");
    expect(alerts[0].case_count).toBe(12);
    expect(alerts[0].alert_level).toBe("low"); // threshold default 10 yields low
  });

  it("calculates alert_level correctly based on count", () => {
    const makeReports = (count: number) =>
      Array.from({ length: count }).map((_, i) => ({
        id: `r${i}`,
        disease_id: "d2",
        location_lat: 0,
        location_lng: 0,
        city: null,
        state: "StateB",
        reported_at: new Date().toISOString(),
        diseases: { name: "Cold", severity: "mild", is_communicable: false }
      }));

    expect(computeAlertsFromReports(makeReports(15), 10)[0].alert_level).toBe("low");
    expect(computeAlertsFromReports(makeReports(25), 10)[0].alert_level).toBe("medium");
    expect(computeAlertsFromReports(makeReports(55), 10)[0].alert_level).toBe("high");
    expect(computeAlertsFromReports(makeReports(105), 10)[0].alert_level).toBe("critical");
  });
});
