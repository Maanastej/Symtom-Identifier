export interface CriticalAlert {
  title: string;
  body: string;
  icon?: string;
}

/**
 * Evaluate submitted metrics and return any critical-level alerts.
 * Thresholds mirror those in HealthAlerts.tsx (critical tier only).
 */
export function getCriticalAlerts(metrics: {
  heart_rate?: number | null;
  blood_oxygen?: number | null;
  body_temperature?: number | null;
  stress_level?: number | null;
  sleep_hours?: number | null;
}): CriticalAlert[] {
  const alerts: CriticalAlert[] = [];

  if (metrics.heart_rate != null) {
    const hr = metrics.heart_rate;
    if (hr < 40) {
      alerts.push({
        title: '🚨 Dangerously Low Heart Rate',
        body: `Your heart rate is ${hr} BPM (Bradycardia). Seek immediate medical attention.`,
      });
    } else if (hr > 120) {
      alerts.push({
        title: '🚨 Critically High Heart Rate',
        body: `Your heart rate is ${hr} BPM (Tachycardia). Rest immediately and seek medical attention if it persists.`,
      });
    }
  }

  if (metrics.blood_oxygen != null) {
    const spo2 = metrics.blood_oxygen;
    if (spo2 < 90) {
      alerts.push({
        title: '🚨 Critically Low Blood Oxygen',
        body: `Your SpO2 is ${spo2}%. Seek emergency medical attention immediately.`,
      });
    } else if (spo2 < 95) {
      alerts.push({
        title: '⚠️ Low Blood Oxygen Detected',
        body: `Your SpO2 is ${spo2}%. Get fresh air, breathe deeply, and consult a doctor if persistent.`,
      });
    }
  }

  if (metrics.body_temperature != null) {
    const temp = metrics.body_temperature;
    if (temp >= 39.5) {
      alerts.push({
        title: '🚨 High Fever Detected',
        body: `Your temperature is ${temp}°C. Seek medical attention immediately.`,
      });
    }
  }

  if (metrics.stress_level != null && metrics.stress_level >= 9) {
    alerts.push({
      title: '🚨 Extreme Stress Detected',
      body: `Your stress level is ${metrics.stress_level}/10. Take immediate breaks and consider speaking to a professional.`,
    });
  }

  if (metrics.sleep_hours != null && Number(metrics.sleep_hours) < 4) {
    alerts.push({
      title: '🚨 Severely Insufficient Sleep',
      body: `You slept only ${metrics.sleep_hours} hours. Chronic sleep deprivation can be dangerous.`,
    });
  }

  return alerts;
}

/** Request notification permission if not already granted. Returns true if granted. */
export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;
  const result = await Notification.requestPermission();
  return result === 'granted';
}

/** Fire a browser notification for each critical alert. */
export async function fireCriticalNotifications(alerts: CriticalAlert[]): Promise<void> {
  if (alerts.length === 0) return;
  const granted = await requestNotificationPermission();
  if (!granted) return;

  alerts.forEach((alert) => {
    new Notification(alert.title, {
      body: alert.body,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: alert.title, // deduplicates identical alerts
      requireInteraction: true, // keeps notification visible until dismissed
    });
  });
}
