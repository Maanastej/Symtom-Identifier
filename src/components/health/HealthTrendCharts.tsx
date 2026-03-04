import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
import { TrendingUp, Heart, Moon, Footprints, Thermometer } from 'lucide-react';
import { format, subDays, startOfDay, isAfter } from 'date-fns';

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

interface HealthTrendChartsProps {
  metrics: HealthMetric[];
}

export function HealthTrendCharts({ metrics }: HealthTrendChartsProps) {
  const chartData = useMemo(() => {
    const sevenDaysAgo = startOfDay(subDays(new Date(), 7));
    const recent = metrics
      .filter(m => isAfter(new Date(m.recorded_at), sevenDaysAgo))
      .sort((a, b) => new Date(a.recorded_at).getTime() - new Date(b.recorded_at).getTime());

    return recent.map(m => ({
      date: format(new Date(m.recorded_at), 'MMM d'),
      time: format(new Date(m.recorded_at), 'h:mm a'),
      heartRate: m.heart_rate,
      spo2: m.blood_oxygen,
      sleep: m.sleep_hours ? Number(m.sleep_hours) : null,
      steps: m.steps,
      stress: m.stress_level,
      temp: m.body_temperature ? Number(m.body_temperature) : null,
      calories: m.calories_burned,
    }));
  }, [metrics]);

  if (chartData.length < 2) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            7-Day Trends
          </CardTitle>
          <CardDescription>Log at least 2 entries to see trends</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const hasData = (key: keyof typeof chartData[0]) => chartData.some(d => d[key] != null);

  const tooltipStyle = {
    contentStyle: {
      borderRadius: '0.75rem',
      border: '1px solid hsl(var(--border))',
      backgroundColor: 'hsl(var(--card))',
      color: 'hsl(var(--card-foreground))',
      fontSize: '0.75rem',
    },
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {hasData('heartRate') && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Heart className="w-4 h-4 text-red-500" />
              Heart Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="hrGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(0 80% 58%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(0 80% 58%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} domain={['dataMin - 5', 'dataMax + 5']} />
                <Tooltip {...tooltipStyle} />
                <Area type="monotone" dataKey="heartRate" stroke="hsl(0 80% 58%)" fill="url(#hrGrad)" strokeWidth={2} name="BPM" connectNulls />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {hasData('sleep') && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Moon className="w-4 h-4 text-indigo-500" />
              Sleep Hours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} domain={[0, 12]} />
                <Tooltip {...tooltipStyle} />
                <Bar dataKey="sleep" fill="hsl(240 60% 60%)" radius={[4, 4, 0, 0]} name="Hours" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {hasData('steps') && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Footprints className="w-4 h-4 text-green-500" />
              Steps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="stepsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(140 60% 45%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(140 60% 45%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip {...tooltipStyle} />
                <Area type="monotone" dataKey="steps" stroke="hsl(140 60% 45%)" fill="url(#stepsGrad)" strokeWidth={2} name="Steps" connectNulls />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {hasData('temp') && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-orange-500" />
              Body Temperature
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} domain={[35, 40]} />
                <Tooltip {...tooltipStyle} />
                <Line type="monotone" dataKey="temp" stroke="hsl(25 90% 55%)" strokeWidth={2} dot={{ r: 3 }} name="°C" connectNulls />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
