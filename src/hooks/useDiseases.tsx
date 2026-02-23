import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Disease } from '@/lib/knn';

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
