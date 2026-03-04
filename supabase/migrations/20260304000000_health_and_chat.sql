-- Add health profile fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS age integer,
ADD COLUMN IF NOT EXISTS height_cm numeric,
ADD COLUMN IF NOT EXISTS weight_kg numeric,
ADD COLUMN IF NOT EXISTS blood_group text,
ADD COLUMN IF NOT EXISTS resting_bpm integer,
ADD COLUMN IF NOT EXISTS blood_pressure_systolic integer,
ADD COLUMN IF NOT EXISTS blood_pressure_diastolic integer,
ADD COLUMN IF NOT EXISTS avg_spo2 integer,
ADD COLUMN IF NOT EXISTS avg_sleep_hours numeric,
ADD COLUMN IF NOT EXISTS is_admin boolean DEFAULT false;

-- Create health_metrics table for smartwatch data
CREATE TABLE IF NOT EXISTS public.health_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
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

-- Enable RLS for health_metrics
ALTER TABLE public.health_metrics ENABLE ROW LEVEL SECURITY;

-- health_metrics policies
DO $$ BEGIN
  CREATE POLICY "Users can view their own health metrics" ON public.health_metrics FOR SELECT USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Users can create their own health metrics" ON public.health_metrics FOR INSERT WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Users can update their own health metrics" ON public.health_metrics FOR UPDATE USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Users can delete their own health metrics" ON public.health_metrics FOR DELETE USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Create indices for health_metrics
CREATE INDEX IF NOT EXISTS idx_health_metrics_user_id ON public.health_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_health_metrics_recorded_at ON public.health_metrics(recorded_at DESC);

-- Create chat messages table
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for chat_messages
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- chat_messages policies
DO $$ BEGIN
  CREATE POLICY "Users can view their own chat messages" ON public.chat_messages FOR SELECT USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Users can insert their own chat messages" ON public.chat_messages FOR INSERT WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Users can delete their own chat messages" ON public.chat_messages FOR DELETE USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Index for chat_messages
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_created ON public.chat_messages (user_id, created_at);
