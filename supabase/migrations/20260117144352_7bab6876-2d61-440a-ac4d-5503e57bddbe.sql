-- Create diseases table with symptoms, precautions, medications
CREATE TABLE public.diseases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  symptoms TEXT[] NOT NULL DEFAULT '{}',
  precautions TEXT[] DEFAULT '{}',
  medications TEXT[] DEFAULT '{}',
  severity TEXT DEFAULT 'moderate' CHECK (severity IN ('mild', 'moderate', 'severe', 'critical')),
  is_communicable BOOLEAN DEFAULT false,
  transmission_rate DECIMAL(3,2) DEFAULT 0.0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT,
  phone TEXT,
  location_lat DECIMAL(10,8),
  location_lng DECIMAL(11,8),
  city TEXT,
  state TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create disease reports for epidemic tracking
CREATE TABLE public.disease_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  disease_id UUID REFERENCES public.diseases(id) ON DELETE CASCADE NOT NULL,
  symptoms_reported TEXT[] NOT NULL DEFAULT '{}',
  location_lat DECIMAL(10,8) NOT NULL,
  location_lng DECIMAL(11,8) NOT NULL,
  city TEXT,
  state TEXT,
  confidence_score DECIMAL(5,2) DEFAULT 0.0,
  status TEXT DEFAULT 'reported' CHECK (status IN ('reported', 'confirmed', 'recovered', 'false_positive')),
  reported_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create epidemic alerts table
CREATE TABLE public.epidemic_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  disease_id UUID REFERENCES public.diseases(id) ON DELETE CASCADE NOT NULL,
  region TEXT NOT NULL,
  case_count INTEGER NOT NULL DEFAULT 0,
  threshold_exceeded BOOLEAN DEFAULT false,
  alert_level TEXT DEFAULT 'low' CHECK (alert_level IN ('low', 'medium', 'high', 'critical')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.diseases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disease_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.epidemic_alerts ENABLE ROW LEVEL SECURITY;

-- Diseases are publicly readable
CREATE POLICY "Diseases are viewable by everyone" ON public.diseases FOR SELECT USING (true);

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- Disease reports policies
CREATE POLICY "Anyone can view disease reports" ON public.disease_reports FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create reports" ON public.disease_reports FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can update their own reports" ON public.disease_reports FOR UPDATE USING (auth.uid() = user_id);

-- Epidemic alerts are publicly readable
CREATE POLICY "Epidemic alerts are viewable by everyone" ON public.epidemic_alerts FOR SELECT USING (true);

-- Enable realtime for disease reports
ALTER PUBLICATION supabase_realtime ADD TABLE public.disease_reports;
ALTER PUBLICATION supabase_realtime ADD TABLE public.epidemic_alerts;

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Add triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_epidemic_alerts_updated_at BEFORE UPDATE ON public.epidemic_alerts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();