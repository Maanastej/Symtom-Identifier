import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, CheckCircle2, XCircle, Heart, Activity, Moon, Thermometer, Brain, Footprints } from 'lucide-react';

interface HealthMetric {
  heart_rate: number | null;
  blood_oxygen: number | null;
  sleep_hours: number | null;
  steps: number | null;
  calories_burned: number | null;
  stress_level: number | null;
  body_temperature: number | null;
  blood_pressure_systolic?: number | null;
  blood_pressure_diastolic?: number | null;
}

interface AlertItem {
  id: string;
  level: 'critical' | 'warning' | 'info';
  metric: string;
  value: string;
  message: string;
  recommendation: string;
  icon: React.ReactNode;
}

function generateAlerts(metric: HealthMetric): AlertItem[] {
  const alerts: AlertItem[] = [];

  if (metric.heart_rate !== null && metric.heart_rate !== undefined) {
    const hr = metric.heart_rate;
    if (hr < 40) {
      alerts.push({
        id: 'hr-critical-low',
        level: 'critical',
        metric: 'Heart Rate',
        value: `${hr} BPM`,
        message: 'Dangerously low heart rate (Bradycardia)',
        recommendation: 'Seek immediate medical attention.',
        icon: <Heart className="w-4 h-4" />,
      });
    } else if (hr < 60) {
      alerts.push({
        id: 'hr-low',
        level: 'warning',
        metric: 'Heart Rate',
        value: `${hr} BPM`,
        message: 'Low heart rate (Bradycardia)',
        recommendation: 'If you feel dizzy or short of breath, consult a doctor.',
        icon: <Heart className="w-4 h-4" />,
      });
    } else if (hr > 120) {
      alerts.push({
        id: 'hr-critical-high',
        level: 'critical',
        metric: 'Heart Rate',
        value: `${hr} BPM`,
        message: 'Critically high heart rate (Tachycardia)',
        recommendation: 'Rest immediately and seek medical attention if it persists.',
        icon: <Heart className="w-4 h-4" />,
      });
    } else if (hr > 100) {
      alerts.push({
        id: 'hr-high',
        level: 'warning',
        metric: 'Heart Rate',
        value: `${hr} BPM`,
        message: 'Elevated heart rate (Tachycardia)',
        recommendation: 'Rest, stay hydrated, and avoid caffeine.',
        icon: <Heart className="w-4 h-4" />,
      });
    }
  }

  if (metric.blood_oxygen !== null && metric.blood_oxygen !== undefined) {
    const spo2 = metric.blood_oxygen;
    if (spo2 < 90) {
      alerts.push({
        id: 'spo2-critical',
        level: 'critical',
        metric: 'Blood Oxygen (SpO2)',
        value: `${spo2}%`,
        message: 'Critically low blood oxygen level',
        recommendation: 'Seek emergency medical attention immediately.',
        icon: <Activity className="w-4 h-4" />,
      });
    } else if (spo2 < 95) {
      alerts.push({
        id: 'spo2-low',
        level: 'warning',
        metric: 'Blood Oxygen (SpO2)',
        value: `${spo2}%`,
        message: 'Low blood oxygen — possible hypoxia',
        recommendation: 'Get fresh air, breathe deeply, and consult a doctor if persistent.',
        icon: <Activity className="w-4 h-4" />,
      });
    }
  }

  if (metric.body_temperature !== null && metric.body_temperature !== undefined) {
    const temp = metric.body_temperature;
    if (temp >= 39.5) {
      alerts.push({
        id: 'temp-critical',
        level: 'critical',
        metric: 'Body Temperature',
        value: `${temp}°C`,
        message: 'High fever — temperature dangerously elevated',
        recommendation: 'Seek medical attention immediately. Use a fever reducer.',
        icon: <Thermometer className="w-4 h-4" />,
      });
    } else if (temp >= 37.5) {
      alerts.push({
        id: 'temp-high',
        level: 'warning',
        metric: 'Body Temperature',
        value: `${temp}°C`,
        message: 'Elevated body temperature (mild fever)',
        recommendation: 'Rest, stay hydrated, and monitor closely.',
        icon: <Thermometer className="w-4 h-4" />,
      });
    } else if (temp < 36.0) {
      alerts.push({
        id: 'temp-low',
        level: 'warning',
        metric: 'Body Temperature',
        value: `${temp}°C`,
        message: 'Low body temperature (Hypothermia risk)',
        recommendation: 'Warm up and consult a doctor if below 35°C.',
        icon: <Thermometer className="w-4 h-4" />,
      });
    }
  }

  if (metric.stress_level !== null && metric.stress_level !== undefined) {
    const stress = metric.stress_level;
    if (stress >= 9) {
      alerts.push({
        id: 'stress-critical',
        level: 'critical',
        metric: 'Stress Level',
        value: `${stress}/10`,
        message: 'Extreme stress detected',
        recommendation: 'Take immediate breaks, consider meditation or speaking to a professional.',
        icon: <Brain className="w-4 h-4" />,
      });
    } else if (stress >= 7) {
      alerts.push({
        id: 'stress-high',
        level: 'warning',
        metric: 'Stress Level',
        value: `${stress}/10`,
        message: 'High stress level',
        recommendation: 'Practice deep breathing, exercise, or relaxation techniques.',
        icon: <Brain className="w-4 h-4" />,
      });
    }
  }

  if (metric.sleep_hours !== null && metric.sleep_hours !== undefined) {
    const sleep = Number(metric.sleep_hours);
    if (sleep < 4) {
      alerts.push({
        id: 'sleep-critical',
        level: 'critical',
        metric: 'Sleep',
        value: `${sleep} hrs`,
        message: 'Severely insufficient sleep',
        recommendation: 'Prioritize sleep. Chronic sleep deprivation can be dangerous.',
        icon: <Moon className="w-4 h-4" />,
      });
    } else if (sleep < 6) {
      alerts.push({
        id: 'sleep-low',
        level: 'warning',
        metric: 'Sleep',
        value: `${sleep} hrs`,
        message: 'Insufficient sleep (less than 6 hours)',
        recommendation: 'Aim for 7–9 hours of sleep for optimal health.',
        icon: <Moon className="w-4 h-4" />,
      });
    }
  }

  if (metric.steps !== null && metric.steps !== undefined && metric.steps < 2000) {
    alerts.push({
      id: 'steps-low',
      level: 'info',
      metric: 'Activity (Steps)',
      value: `${metric.steps.toLocaleString()} steps`,
      message: 'Very low physical activity today',
      recommendation: 'Try to walk at least 5,000–10,000 steps daily for cardiovascular health.',
      icon: <Footprints className="w-4 h-4" />,
    });
  }

  return alerts;
}

const levelConfig = {
  critical: {
    bg: 'bg-red-50 border-red-200',
    badge: 'bg-red-100 text-red-700 border-red-200',
    icon: <XCircle className="w-4 h-4 text-red-600" />,
    title: 'text-red-800',
    text: 'text-red-700',
  },
  warning: {
    bg: 'bg-yellow-50 border-yellow-200',
    badge: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    icon: <AlertTriangle className="w-4 h-4 text-yellow-600" />,
    title: 'text-yellow-800',
    text: 'text-yellow-700',
  },
  info: {
    bg: 'bg-blue-50 border-blue-200',
    badge: 'bg-blue-100 text-blue-700 border-blue-200',
    icon: <AlertTriangle className="w-4 h-4 text-blue-600" />,
    title: 'text-blue-800',
    text: 'text-blue-700',
  },
};

interface HealthAlertsProps {
  metrics: HealthMetric[];
}

export function HealthAlerts({ metrics }: HealthAlertsProps) {
  if (!metrics || metrics.length === 0) return null;

  const latest = metrics[0];
  const alerts = generateAlerts(latest);

  if (alerts.length === 0) {
    return (
      <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
        <CheckCircle2 className="w-4 h-4 shrink-0" />
        <span>All your latest metrics are within normal ranges. Keep it up!</span>
      </div>
    );
  }

  const criticalCount = alerts.filter(a => a.level === 'critical').length;
  const warningCount = alerts.filter(a => a.level === 'warning').length;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 flex-wrap">
        <p className="text-sm font-semibold text-foreground">Health Alerts</p>
        {criticalCount > 0 && (
          <Badge variant="outline" className="bg-red-100 text-red-700 border-red-200 text-xs">
            {criticalCount} Critical
          </Badge>
        )}
        {warningCount > 0 && (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border-yellow-200 text-xs">
            {warningCount} Warning
          </Badge>
        )}
      </div>

      <div className="space-y-2">
        {alerts.map((alert) => {
          const config = levelConfig[alert.level];
          return (
            <div
              key={alert.id}
              className={`flex gap-3 p-3 rounded-lg border ${config.bg}`}
            >
              <div className="mt-0.5 shrink-0">{config.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <span className={`text-sm font-medium ${config.title}`}>{alert.metric}</span>
                  <Badge variant="outline" className={`text-xs ${config.badge}`}>
                    {alert.icon}
                    <span className="ml-1">{alert.value}</span>
                  </Badge>
                </div>
                <p className={`text-sm ${config.title}`}>{alert.message}</p>
                <p className={`text-xs mt-0.5 ${config.text}`}>💡 {alert.recommendation}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
