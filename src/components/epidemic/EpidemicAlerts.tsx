import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Bell, AlertTriangle, TrendingUp, Shield } from 'lucide-react';

interface EpidemicAlert {
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

interface DiseaseReport {
  disease_id: string;
  diseases: {
    name: string;
    is_communicable: boolean;
  } | null;
  reported_at: string;
}

interface EpidemicAlertsProps {
  alerts: EpidemicAlert[];
  reports: DiseaseReport[];
}

const alertLevelColors = {
  low: 'bg-green-500/10 text-green-700 border-green-200',
  medium: 'bg-yellow-500/10 text-yellow-700 border-yellow-200',
  high: 'bg-orange-500/10 text-orange-700 border-orange-200',
  critical: 'bg-red-500/10 text-red-700 border-red-200'
};

const alertLevelIcons = {
  low: Shield,
  medium: TrendingUp,
  high: AlertTriangle,
  critical: Bell
};

export function EpidemicAlerts({ alerts, reports }: EpidemicAlertsProps) {
  // Calculate real-time stats from reports
  const now = new Date();
  const last7Days = reports.filter(r => {
    const diff = now.getTime() - new Date(r.reported_at).getTime();
    return diff <= 7 * 24 * 60 * 60 * 1000;
  });

  const communicableCases = last7Days.filter(r => r.diseases?.is_communicable);
  
  // Group by disease
  const diseaseCounts = last7Days.reduce((acc, r) => {
    const name = r.diseases?.name || 'Unknown';
    acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topDiseases = Object.entries(diseaseCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Calculate potential alerts based on thresholds
  const potentialAlerts = topDiseases.filter(([_, count]) => count >= 10);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-primary" />
          <CardTitle>Epidemic Detection</CardTitle>
        </div>
        <CardDescription>
          Real-time monitoring of disease outbreaks
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-3 rounded-lg bg-muted">
            <p className="text-2xl font-bold">{last7Days.length}</p>
            <p className="text-xs text-muted-foreground">Cases (7 days)</p>
          </div>
          <div className="p-3 rounded-lg bg-muted">
            <p className="text-2xl font-bold">{communicableCases.length}</p>
            <p className="text-xs text-muted-foreground">Communicable</p>
          </div>
          <div className="p-3 rounded-lg bg-muted">
            <p className="text-2xl font-bold">{topDiseases.length}</p>
            <p className="text-xs text-muted-foreground">Active Diseases</p>
          </div>
        </div>

        {/* Active alerts */}
        {alerts.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Active Alerts</p>
            {alerts.map((alert) => {
              const Icon = alertLevelIcons[alert.alert_level as keyof typeof alertLevelIcons] || AlertTriangle;
              return (
                <Alert 
                  key={alert.id}
                  className={alertLevelColors[alert.alert_level as keyof typeof alertLevelColors]}
                >
                  <Icon className="h-4 w-4" />
                  <AlertTitle className="flex items-center gap-2">
                    {alert.diseases?.name}
                    <Badge variant="outline" className="text-xs">
                      {alert.alert_level.toUpperCase()}
                    </Badge>
                  </AlertTitle>
                  <AlertDescription>
                    {alert.case_count} cases reported in {alert.region}
                  </AlertDescription>
                </Alert>
              );
            })}
          </div>
        )}

        {/* Potential alerts */}
        {potentialAlerts.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-orange-500" />
              Trending Diseases
            </p>
            <div className="space-y-2">
              {potentialAlerts.map(([disease, count]) => (
                <div 
                  key={disease}
                  className="flex items-center justify-between p-2 rounded-lg bg-orange-500/10"
                >
                  <span className="text-sm font-medium">{disease}</span>
                  <Badge variant="outline" className="bg-orange-500/20 text-orange-700">
                    {count} cases
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Top diseases chart */}
        {topDiseases.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Disease Distribution (Last 7 Days)</p>
            <div className="space-y-2">
              {topDiseases.map(([disease, count]) => {
                const percentage = (count / last7Days.length) * 100;
                return (
                  <div key={disease} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{disease}</span>
                      <span className="text-muted-foreground">{count}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {topDiseases.length === 0 && alerts.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Shield className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No active alerts</p>
            <p className="text-sm">The system is monitoring for outbreaks</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
