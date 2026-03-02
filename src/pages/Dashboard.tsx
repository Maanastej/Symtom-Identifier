import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { SymptomInput } from '@/components/symptom-checker/SymptomInput';
import { PredictionResults, AIPrediction } from '@/components/symptom-checker/PredictionResults';
import { DiseaseMap } from '@/components/map/DiseaseMap';
import { EpidemicAlerts } from '@/components/epidemic/EpidemicAlerts';
import { ReportCaseDialog } from '@/components/report/ReportCaseDialog';
import { useDiseases, useDiseaseReports, useEpidemicAlerts } from '@/hooks/useDiseases';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Stethoscope, Map, Bell, Loader2 } from 'lucide-react';
import { toast } from 'sonner';


export default function Dashboard() {
  const { data: diseases = [], isLoading: diseasesLoading, error: diseasesError } = useDiseases();
  const { data: reports = [], isLoading: reportsLoading, refetch: refetchReports, error: reportsError } = useDiseaseReports();
  const { data: alerts = [], error: alertsError } = useEpidemicAlerts();

  useEffect(() => {
    if (diseasesError) console.error('Dashboard: Diseases fetch error:', diseasesError);
    if (reportsError) console.error('Dashboard: Reports fetch error:', reportsError);
    if (alertsError) console.error('Dashboard: Alerts fetch error:', alertsError);
    console.log('Dashboard: State:', { diseasesLoading, reportsLoading, diseasesCount: diseases.length });
  }, [diseasesLoading, reportsLoading, diseasesError, reportsError, alertsError, diseases.length]);

  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [predictions, setPredictions] = useState<AIPrediction[]>([]);
  const [generalAdvice, setGeneralAdvice] = useState<string>('');
  const [urgency, setUrgency] = useState<string>('');
  const [predicting, setPredicting] = useState(false);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [selectedPrediction, setSelectedPrediction] = useState<AIPrediction | null>(null);

  // Subscribe to realtime updates
  useEffect(() => {
    const channel = supabase
      .channel('disease_reports_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'disease_reports'
        },
        () => {
          refetchReports();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetchReports]);

  const handlePredict = async () => {
    if (selectedSymptoms.length === 0) {
      toast.error('Please add at least one symptom');
      return;
    }

    setPredicting(true);
    setPredictions([]);
    setGeneralAdvice('');
    setUrgency('');

    try {
      const { data, error } = await supabase.functions.invoke('predict-disease', {
        body: { symptoms: selectedSymptoms }
      });

      if (error) throw error;

      if (data.error) {
        toast.error(data.error);
        return;
      }

      setPredictions(data.predictions || []);
      setGeneralAdvice(data.general_advice || '');
      setUrgency(data.urgency || 'medium');
    } catch (error) {
      console.error('Prediction error:', error);
      toast.error('Failed to get prediction. Please try again.');
    } finally {
      setPredicting(false);
    }
  };

  const handleReportCase = (result: AIPrediction) => {
    setSelectedPrediction(result);
    setReportDialogOpen(true);
  };

  if (diseasesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-6">
        <Tabs defaultValue="checker" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="checker" className="flex items-center gap-2">
              <Stethoscope className="w-4 h-4" />
              <span className="hidden sm:inline">Symptom Checker</span>
              <span className="sm:hidden">Check</span>
            </TabsTrigger>
            <TabsTrigger value="map" className="flex items-center gap-2">
              <Map className="w-4 h-4" />
              <span className="hidden sm:inline">Disease Map</span>
              <span className="sm:hidden">Map</span>
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              <span className="hidden sm:inline">Alerts</span>
              <span className="sm:hidden">Alerts</span>
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

          <TabsContent value="map">
            <DiseaseMap
              reports={reports}
              onRefresh={refetchReports}
            />
          </TabsContent>

          <TabsContent value="alerts">
            <div className="grid lg:grid-cols-2 gap-6">
              <EpidemicAlerts
                alerts={alerts}
                reports={reports}
              />
              <DiseaseMap
                reports={reports}
                onRefresh={refetchReports}
              />
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <ReportCaseDialog
        open={reportDialogOpen}
        onOpenChange={setReportDialogOpen}
        prediction={selectedPrediction}
        symptoms={selectedSymptoms}
        onSuccess={refetchReports}
      />
    </div>
  );
}
