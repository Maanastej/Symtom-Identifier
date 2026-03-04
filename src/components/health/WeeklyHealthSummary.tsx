import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Droplets, Moon, Footprints, Flame, Thermometer, TrendingUp, TrendingDown, Minus, CalendarDays } from 'lucide-react';
import { subDays, startOfDay, isAfter } from 'date-fns';

interface HealthMetric {
  id: string;
  recorded_at: string;
  heart_rate: number | null;
  blood_oxygen: number | null;
  sleep_hours: number | null;
  steps: number | null;
  stress_level: number | null;
  body_temperature: number | null;
  calories_burned: number | null;
}

interface WeeklyHealthSummaryProps {
  metrics: HealthMetric[];
}

function avg(values: number[]): number {
  return values.length ? Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10) / 10 : 0;
}

function trend(values: number[]): 'up' | 'down' | 'stable' {
  if (values.length < 2) return 'stable';
  const mid = Math.floor(values.length / 2);
  const first = avg(values.slice(0, mid));
  const second = avg(values.slice(mid));
  const diff = ((second - first) / (first || 1)) * 100;
  if (diff > 3) return 'up';
  if (diff < -3) return 'down';
  return 'stable';
}

const TrendIcon = ({ dir }: { dir: 'up' | 'down' | 'stable' }) => {
  if (dir === 'up') return <TrendingUp className="w-3.5 h-3.5 text-green-500" />;
  if (dir === 'down') return <TrendingDown className="w-3.5 h-3.5 text-red-500" />;
  return <Minus className="w-3.5 h-3.5 text-muted-foreground" />;
};

export function WeeklyHealthSummary({ metrics }: WeeklyHealthSummaryProps) {
  const summary = useMemo(() => {
    const sevenDaysAgo = startOfDay(subDays(new Date(), 7));
    const recent = metrics.filter(m => isAfter(new Date(m.recorded_at), sevenDaysAgo));

    const hrs = recent.map(m => m.heart_rate).filter((v): v is number => v != null);
    const spo2s = recent.map(m => m.blood_oxygen).filter((v): v is number => v != null);
    const sleeps = recent.map(m => m.sleep_hours).filter((v): v is number => v != null);
    const steps = recent.map(m => m.steps).filter((v): v is number => v != null);
    const cals = recent.map(m => m.calories_burned).filter((v): v is number => v != null);
    const temps = recent.map(m => m.body_temperature).filter((v): v is number => v != null);

    return {
      entries: recent.length,
      heartRate: { avg: avg(hrs), max: hrs.length ? Math.max(...hrs) : null, min: hrs.length ? Math.min(...hrs) : null, trend: trend(hrs) },
      spo2: { avg: avg(spo2s), min: spo2s.length ? Math.min(...spo2s) : null },
      sleep: { avg: avg(sleeps), total: sleeps.reduce((a, b) => a + b, 0), trend: trend(sleeps) },
      steps: { avg: Math.round(avg(steps)), total: steps.reduce((a, b) => a + b, 0), trend: trend(steps) },
      calories: { avg: Math.round(avg(cals)), total: cals.reduce((a, b) => a + b, 0) },
      temp: { avg: avg(temps), max: temps.length ? Math.max(...temps) : null },
    };
  }, [metrics]);

  if (summary.entries === 0) return null;

  const statCards = [
    { icon: Heart, color: 'text-red-500', label: 'Avg Heart Rate', value: `${summary.heartRate.avg} BPM`, sub: summary.heartRate.min != null ? `${summary.heartRate.min}–${summary.heartRate.max}` : null, trend: summary.heartRate.trend },
    { icon: Droplets, color: 'text-blue-500', label: 'Avg SpO2', value: `${summary.spo2.avg}%`, sub: summary.spo2.min != null ? `Min: ${summary.spo2.min}%` : null },
    { icon: Moon, color: 'text-indigo-500', label: 'Avg Sleep', value: `${summary.sleep.avg} hrs`, sub: `Total: ${Math.round(summary.sleep.total * 10) / 10} hrs`, trend: summary.sleep.trend },
    { icon: Footprints, color: 'text-green-500', label: 'Avg Steps', value: summary.steps.avg.toLocaleString(), sub: `Total: ${summary.steps.total.toLocaleString()}`, trend: summary.steps.trend },
    { icon: Flame, color: 'text-orange-500', label: 'Avg Calories', value: summary.calories.avg.toLocaleString(), sub: `Total: ${summary.calories.total.toLocaleString()}` },
    { icon: Thermometer, color: 'text-amber-500', label: 'Avg Temp', value: `${summary.temp.avg}°C`, sub: summary.temp.max != null ? `Peak: ${summary.temp.max}°C` : null },
  ].filter(c => c.value !== '0 BPM' && c.value !== '0%' && c.value !== '0 hrs' && c.value !== '0' && c.value !== '0°C');

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-primary" />
            Weekly Health Summary
          </CardTitle>
          <Badge variant="secondary" className="text-xs font-normal">
            {summary.entries} entries · last 7 days
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {statCards.map((s) => (
            <div key={s.label} className="rounded-xl border border-border/50 bg-muted/30 p-3 space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <s.icon className={`w-3.5 h-3.5 ${s.color}`} />
                {s.label}
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-semibold">{s.value}</span>
                {s.trend && <TrendIcon dir={s.trend} />}
              </div>
              {s.sub && <p className="text-[11px] text-muted-foreground">{s.sub}</p>}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
