import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Heart, Moon, Footprints, Flame, Brain, Thermometer, Activity, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface HealthMetric {
  id: string;
  user_id: string;
  recorded_at: string;
  heart_rate: number | null;
  blood_oxygen: number | null;
  sleep_hours: number | null;
  sleep_quality: string | null;
  steps: number | null;
  calories_burned: number | null;
  stress_level: number | null;
  body_temperature: number | null;
  notes: string | null;
}

interface HealthMetricsDisplayProps {
  metrics: HealthMetric[];
  loading?: boolean;
}

const sleepQualityColors = {
  poor: 'bg-red-500/10 text-red-700 border-red-200',
  fair: 'bg-yellow-500/10 text-yellow-700 border-yellow-200',
  good: 'bg-green-500/10 text-green-700 border-green-200',
  excellent: 'bg-emerald-500/10 text-emerald-700 border-emerald-200'
};

function getHeartRateStatus(hr: number) {
  if (hr < 60) return { label: 'Low', color: 'text-blue-500' };
  if (hr <= 100) return { label: 'Normal', color: 'text-green-500' };
  return { label: 'High', color: 'text-red-500' };
}

function getStressStatus(level: number) {
  if (level <= 3) return { label: 'Low', color: 'text-green-500' };
  if (level <= 6) return { label: 'Moderate', color: 'text-yellow-500' };
  return { label: 'High', color: 'text-red-500' };
}

export function HealthMetricsDisplay({ metrics, loading }: HealthMetricsDisplayProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Health Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (metrics.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Health Metrics
          </CardTitle>
          <CardDescription>
            Track your vitals from your smartwatch
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No health data logged yet</p>
            <p className="text-sm">Click "Log Health Data" to add your first entry</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const latest = metrics[0];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          Health Metrics
        </CardTitle>
        <CardDescription>
          Your recent health data from smartwatch
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {latest.heart_rate && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-100">
              <div className="flex items-center gap-2 text-red-600 mb-1">
                <Heart className="w-4 h-4" />
                <span className="text-xs font-medium">Heart Rate</span>
              </div>
              <p className="text-2xl font-bold text-red-700">{latest.heart_rate}</p>
              <p className={`text-xs ${getHeartRateStatus(latest.heart_rate).color}`}>
                {getHeartRateStatus(latest.heart_rate).label} BPM
              </p>
            </div>
          )}

          {latest.blood_oxygen && (
            <div className="p-3 rounded-lg bg-blue-50 border border-blue-100">
              <div className="flex items-center gap-2 text-blue-600 mb-1">
                <Activity className="w-4 h-4" />
                <span className="text-xs font-medium">SpO2</span>
              </div>
              <p className="text-2xl font-bold text-blue-700">{latest.blood_oxygen}%</p>
              <p className={`text-xs ${latest.blood_oxygen >= 95 ? 'text-green-500' : 'text-yellow-500'}`}>
                {latest.blood_oxygen >= 95 ? 'Normal' : 'Low'}
              </p>
            </div>
          )}

          {latest.sleep_hours && (
            <div className="p-3 rounded-lg bg-indigo-50 border border-indigo-100">
              <div className="flex items-center gap-2 text-indigo-600 mb-1">
                <Moon className="w-4 h-4" />
                <span className="text-xs font-medium">Sleep</span>
              </div>
              <p className="text-2xl font-bold text-indigo-700">{latest.sleep_hours}h</p>
              {latest.sleep_quality && (
                <p className="text-xs capitalize text-indigo-500">{latest.sleep_quality}</p>
              )}
            </div>
          )}

          {latest.steps && (
            <div className="p-3 rounded-lg bg-green-50 border border-green-100">
              <div className="flex items-center gap-2 text-green-600 mb-1">
                <Footprints className="w-4 h-4" />
                <span className="text-xs font-medium">Steps</span>
              </div>
              <p className="text-2xl font-bold text-green-700">{latest.steps.toLocaleString()}</p>
              <p className={`text-xs ${latest.steps >= 10000 ? 'text-green-500' : 'text-yellow-500'}`}>
                {latest.steps >= 10000 ? 'Goal reached!' : `${Math.round(latest.steps / 100)}% of 10k`}
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-3">
          {latest.calories_burned && (
            <div className="flex items-center gap-2 p-2 rounded bg-orange-50">
              <Flame className="w-4 h-4 text-orange-500" />
              <div>
                <p className="text-sm font-medium">{latest.calories_burned}</p>
                <p className="text-xs text-muted-foreground">Calories</p>
              </div>
            </div>
          )}

          {latest.stress_level && (
            <div className="flex items-center gap-2 p-2 rounded bg-purple-50">
              <Brain className="w-4 h-4 text-purple-500" />
              <div>
                <p className="text-sm font-medium">{latest.stress_level}/10</p>
                <p className={`text-xs ${getStressStatus(latest.stress_level).color}`}>
                  {getStressStatus(latest.stress_level).label} Stress
                </p>
              </div>
            </div>
          )}

          {latest.body_temperature && (
            <div className="flex items-center gap-2 p-2 rounded bg-red-50">
              <Thermometer className="w-4 h-4 text-red-400" />
              <div>
                <p className="text-sm font-medium">{latest.body_temperature}°C</p>
                <p className={`text-xs ${latest.body_temperature <= 37.5 ? 'text-green-500' : 'text-red-500'}`}>
                  {latest.body_temperature <= 37.5 ? 'Normal' : 'Elevated'}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Recent History
          </p>
          <ScrollArea className="h-[200px]">
            <div className="space-y-2">
              {metrics.slice(0, 10).map((metric) => (
                <div
                  key={metric.id}
                  className="p-3 rounded-lg border bg-card text-card-foreground"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium">
                      {format(new Date(metric.recorded_at), 'MMM d, yyyy h:mm a')}
                    </p>
                    {metric.sleep_quality && (
                      <Badge
                        variant="outline"
                        className={sleepQualityColors[metric.sleep_quality as keyof typeof sleepQualityColors]}
                      >
                        {metric.sleep_quality} sleep
                      </Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                    {metric.heart_rate && (
                      <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3 text-red-400" />
                        {metric.heart_rate} bpm
                      </span>
                    )}
                    {metric.steps && (
                      <span className="flex items-center gap-1">
                        <Footprints className="w-3 h-3 text-green-400" />
                        {metric.steps.toLocaleString()}
                      </span>
                    )}
                    {metric.sleep_hours && (
                      <span className="flex items-center gap-1">
                        <Moon className="w-3 h-3 text-indigo-400" />
                        {metric.sleep_hours}h
                      </span>
                    )}
                    {metric.calories_burned && (
                      <span className="flex items-center gap-1">
                        <Flame className="w-3 h-3 text-orange-400" />
                        {metric.calories_burned} cal
                      </span>
                    )}
                  </div>
                  {metric.notes && (
                    <p className="text-xs text-muted-foreground mt-2 italic">
                      "{metric.notes}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}
