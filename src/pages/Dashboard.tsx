import { useState, useEffect } from 'react';
import { isSupabaseReady } from '@/integrations/supabase/client';
import { Header } from '@/components/layout/Header';
import { SymptomInput } from '@/components/symptom-checker/SymptomInput';
import { PredictionResults, AIPrediction } from '@/components/symptom-checker/PredictionResults';
import { DiseaseMap } from '@/components/map/DiseaseMap';
import { EpidemicAlerts } from '@/components/epidemic/EpidemicAlerts';
import { ReportCaseDialog } from '@/components/report/ReportCaseDialog';
import { HealthChatbot } from '@/components/chat/HealthChatbot';
import { HealthMetricsForm } from '@/components/health/HealthMetricsForm';
import { HealthMetricsDisplay } from '@/components/health/HealthMetricsDisplay';
import { HealthTrendCharts } from '@/components/health/HealthTrendCharts';
import { HealthAlerts } from '@/components/health/HealthAlerts';
import { FitnessAppsIntegration } from '@/components/health/FitnessAppsIntegration';
import { WeeklyHealthSummary } from '@/components/health/WeeklyHealthSummary';
import { HealthProfileForm } from '@/components/health/HealthProfileForm';
import { useDiseases, useDiseaseReports, useEpidemicAlerts, useHealthMetrics } from '@/hooks/useDiseases';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Stethoscope, Map, Bell, Loader2, Activity, Heart, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';
import { computeAlertsFromReports } from '@/lib/utils';

export default function Dashboard() {
  const supabaseOk = isSupabaseReady();
  const { data: diseases = [], isLoading: diseasesLoading, error: diseasesError } = useDiseases();
  const { data: reports = [], isLoading: reportsLoading, refetch: refetchReports, error: reportsError } = useDiseaseReports();
  const { data: alerts = [], error: alertsError, refetch: refetchAlerts } = useEpidemicAlerts();
  const { data: healthMetrics = [], isLoading: healthLoading, refetch: refetchHealth } = useHealthMetrics();

  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [predictions, setPredictions] = useState<AIPrediction[]>([]);
  const [generalAdvice, setGeneralAdvice] = useState<string>('');
  const [urgency, setUrgency] = useState<string>('');
  const [predicting, setPredicting] = useState(false);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [selectedPrediction, setSelectedPrediction] = useState<AIPrediction | null>(null);

  // Compute derived alerts for the map & epidemic tab
  const derivedAlerts = computeAlertsFromReports(reports);
  const combinedAlerts = alerts.length > 0 ? alerts : derivedAlerts;

  useEffect(() => {
    if (derivedAlerts.length === 0) return;
    const upsert = async () => {
      try {
        const rows = derivedAlerts.map(a => {
          const match = reports.find(
            r => (r.state || r.city || 'Unknown') === a.region && r.diseases?.name === a.diseases?.name
          );
          return {
            id: a.id,
            disease_id: match?.disease_id || '',
            region: a.region,
            case_count: a.case_count,
            alert_level: a.alert_level,
            threshold_exceeded: a.threshold_exceeded,
            updated_at: a.updated_at,
          };
        });
        await supabase.from('epidemic_alerts').upsert(rows, { onConflict: ['id'] });
      } catch (e) {
        console.error('Failed to upsert derived alerts', e);
      }
    };
    upsert();
  }, [derivedAlerts, reports]);

  useEffect(() => {
    const channel = supabase
      .channel('realtime_updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'disease_reports' }, () => refetchReports())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'epidemic_alerts' }, () => refetchAlerts())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'health_metrics' }, () => refetchHealth())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [refetchReports, refetchAlerts, refetchHealth]);

  const handlePredict = async () => {
    if (selectedSymptoms.length === 0) {
      toast.error('Please add at least one symptom');
      return;
    }
    setPredicting(true);
    try {
      const { data, error } = await supabase.functions.invoke('predict-disease', {
        body: { symptoms: selectedSymptoms }
      });
      if (error) throw error;
      setPredictions(data.predictions || []);
      setGeneralAdvice(data.general_advice || '');
      setUrgency(data.urgency || 'medium');
    } catch (error) {
      console.error('Prediction error:', error);
      toast.error('Failed to get prediction');
    } finally {
      setPredicting(false);
    }
  };

  const handleReportCase = (result: AIPrediction) => {
    setSelectedPrediction(result);
    setReportDialogOpen(true);
  };

  if (!supabaseOk) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">Supabase config missing. Check your .env file.</p>
      </div>
    );
  }

  if (diseasesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="container py-6">
        <Tabs defaultValue="checker" className="space-y-6">
          <TabsList className="grid w-full max-w-2xl grid-cols-4 gradient-card p-1 rounded-2xl shadow-soft border border-border/40">
            <TabsTrigger value="checker" className="flex items-center gap-2 rounded-xl py-2.5">
              <Stethoscope className="w-4 h-4" />
              <span className="hidden sm:inline">Checker</span>
            </TabsTrigger>
            <TabsTrigger value="health" className="flex items-center gap-2 rounded-xl py-2.5">
              <Activity className="w-4 h-4" />
              <span className="hidden sm:inline">Health</span>
            </TabsTrigger>
            <TabsTrigger value="map" className="flex items-center gap-2 rounded-xl py-2.5">
              <Map className="w-4 h-4" />
              <span className="hidden sm:inline">Tracking</span>
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex items-center gap-2 rounded-xl py-2.5">
              <Bell className="w-4 h-4" />
              <span className="hidden sm:inline">Alerts</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="checker" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <SymptomInput
                diseases={diseases}
                selectedSymptoms={selectedSymptoms}
                onSymptomsChange={setSelectedSymptoms}
                onPredict={handlePredict}
                loading={predicting}
              />
              <PredictionResults
                results={predictions}
                generalAdvice={generalAdvice}
                urgency={urgency}
                onReportCase={handleReportCase}
              />
            </div>
          </TabsContent>

          <TabsContent value="health" className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Your Health Dashboard</h2>
                <p className="text-muted-foreground">Monitor vitals and smartwatch data in real-time</p>
              </div>
              <div className="flex gap-2">
                <HealthProfileForm onSuccess={refetchHealth} />
                <HealthMetricsForm onSuccess={refetchHealth} />
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <HealthAlerts metrics={healthMetrics} />
                <WeeklyHealthSummary metrics={healthMetrics} />
                <HealthTrendCharts metrics={healthMetrics} />
              </div>
              <div className="space-y-6">
                <HealthMetricsDisplay metrics={healthMetrics} loading={healthLoading} />
                <FitnessAppsIntegration />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="map">
            <DiseaseMap
              reports={reports}
              onRefresh={refetchReports}
            />
          </TabsContent>

          <TabsContent value="alerts">
            <div className="grid lg:grid-cols-2 gap-6">
              <EpidemicAlerts
                alerts={combinedAlerts}
                reports={reports}
              />
              <div className="space-y-6">
                <div className="rounded-2xl overflow-hidden shadow-card border border-border/50">
                  <DiseaseMap
                    reports={reports}
                    alerts={combinedAlerts}
                    onRefresh={refetchReports}
                  />
                </div>
                <Card className="gradient-card border border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-primary">
                      <ShieldAlert className="w-5 h-5" />
                      About epidemic alerts
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-primary/80 leading-relaxed">
                    Our system triggers alerts when disease reporting density in a specific city or state exceeds
                    calculated thresholds. We analyze severity, transmission rates, and time windows to generate
                    real-time warnings for community safety.
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <HealthChatbot />

      <ReportCaseDialog
        open={reportDialogOpen}
        onOpenChange={setReportDialogOpen}
        prediction={selectedPrediction}
        symptoms={selectedSymptoms}
        onSuccess={() => {
          refetchReports();
          refetchAlerts();
        }}
      />
    </div>
  );
}

