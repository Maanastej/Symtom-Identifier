import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Disease } from '@/lib/knn';
import { useAuth } from './useAuth';

export function useDiseases() {
  return useQuery({
    queryKey: ['diseases'],
    queryFn: async (): Promise<Disease[]> => {
      const { data, error } = await supabase
        .from('diseases')
        .select('*')
        .order('name');

      if (error) throw error;

      return (data || []).map(d => ({
        id: d.id,
        name: d.name,
        description: d.description,
        symptoms: d.symptoms || [],
        precautions: d.precautions || [],
        medications: d.medications || [],
        severity: d.severity || 'moderate',
        is_communicable: d.is_communicable || false,
        transmission_rate: Number(d.transmission_rate) || 0
      }));
    }
  });
}

export function useDiseaseReports() {
  return useQuery({
    queryKey: ['disease_reports'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('disease_reports')
        .select(`
          *,
          diseases (name, severity, is_communicable)
        `)
        .order('reported_at', { ascending: false });

      if (error) throw error;
      return data || [];
    }
  });
}

export function useEpidemicAlerts() {
  return useQuery({
    queryKey: ['epidemic_alerts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('epidemic_alerts')
        .select(`
          *,
          diseases (name, severity)
        `)
        .eq('threshold_exceeded', true)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data || [];
    }
  });
}

export function useHealthMetrics() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['health_metrics', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('health_metrics')
        .select('*')
        .eq('user_id', user.id)
        .order('recorded_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data || [];
    },
    enabled: !!user
  });
}

export function useHealthProfile() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['health_profile', user?.id],
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('age, height_cm, weight_kg, blood_group, resting_bpm, blood_pressure_systolic, blood_pressure_diastolic, avg_spo2, avg_sleep_hours')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!user
  });
}

