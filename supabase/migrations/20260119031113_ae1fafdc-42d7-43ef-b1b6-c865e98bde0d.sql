-- Create health_metrics table for smartwatch data
CREATE TABLE public.health_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  heart_rate INTEGER,
  blood_oxygen INTEGER,
  sleep_hours NUMERIC(4,2),
  sleep_quality TEXT CHECK (sleep_quality IN ('poor', 'fair', 'good', 'excellent')),
  steps INTEGER,
  calories_burned INTEGER,
  stress_level INTEGER CHECK (stress_level >= 1 AND stress_level <= 10),
  body_temperature NUMERIC(4,1),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.health_metrics ENABLE ROW LEVEL SECURITY;

-- Users can view their own health metrics
CREATE POLICY "Users can view their own health metrics"
  ON public.health_metrics
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create their own health metrics
CREATE POLICY "Users can create their own health metrics"
  ON public.health_metrics
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own health metrics
CREATE POLICY "Users can update their own health metrics"
  ON public.health_metrics
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own health metrics
CREATE POLICY "Users can delete their own health metrics"
  ON public.health_metrics
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_health_metrics_user_id ON public.health_metrics(user_id);
CREATE INDEX idx_health_metrics_recorded_at ON public.health_metrics(recorded_at DESC);