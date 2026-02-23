import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AIPrediction } from '@/components/symptom-checker/PredictionResults';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useDiseases } from '@/hooks/useDiseases';
import { toast } from 'sonner';
import { Loader2, MapPin } from 'lucide-react';

interface ReportCaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prediction: AIPrediction | null;
  symptoms: string[];
  onSuccess: () => void;
}

// Indian cities with coordinates for fallback
const indianCities: Record<string, { lat: number; lng: number; state: string }> = {
  'Mumbai': { lat: 19.0760, lng: 72.8777, state: 'Maharashtra' },
  'Delhi': { lat: 28.7041, lng: 77.1025, state: 'Delhi' },
  'Bangalore': { lat: 12.9716, lng: 77.5946, state: 'Karnataka' },
  'Chennai': { lat: 13.0827, lng: 80.2707, state: 'Tamil Nadu' },
  'Kolkata': { lat: 22.5726, lng: 88.3639, state: 'West Bengal' },
  'Hyderabad': { lat: 17.3850, lng: 78.4867, state: 'Telangana' },
  'Pune': { lat: 18.5204, lng: 73.8567, state: 'Maharashtra' },
  'Ahmedabad': { lat: 23.0225, lng: 72.5714, state: 'Gujarat' },
  'Jaipur': { lat: 26.9124, lng: 75.7873, state: 'Rajasthan' },
  'Lucknow': { lat: 26.8467, lng: 80.9462, state: 'Uttar Pradesh' },
};

export function ReportCaseDialog({ 
  open, 
  onOpenChange, 
  prediction, 
  symptoms,
  onSuccess 
}: ReportCaseDialogProps) {
  const { user } = useAuth();
  const { data: diseases = [] } = useDiseases();
  const [loading, setLoading] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);

  // Find disease ID from name
  const getDiseaseId = () => {
    if (!prediction) return null;
    const disease = diseases.find(d => 
      d.name.toLowerCase() === prediction.disease_name.toLowerCase()
    );
    return disease?.id || null;
  };

  // Try to get user's location
  useEffect(() => {
    if (open && !lat) {
      getLocation();
    }
  }, [open]);

  const getLocation = () => {
    setGettingLocation(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLat(position.coords.latitude);
          setLng(position.coords.longitude);
          setGettingLocation(false);
        },
        (error) => {
          console.log('Geolocation error:', error);
          // Default to Delhi if location not available
          setLat(28.7041);
          setLng(77.1025);
          setCity('Delhi');
          setState('Delhi');
          setGettingLocation(false);
        }
      );
    } else {
      // Default fallback
      setLat(28.7041);
      setLng(77.1025);
      setCity('Delhi');
      setState('Delhi');
      setGettingLocation(false);
    }
  };

  const handleCitySelect = (selectedCity: string) => {
    const cityData = indianCities[selectedCity];
    if (cityData) {
      setCity(selectedCity);
      setState(cityData.state);
      setLat(cityData.lat);
      setLng(cityData.lng);
    }
  };

  const handleSubmit = async () => {
    const diseaseId = getDiseaseId();
    
    if (!prediction || !lat || !lng || !user) {
      toast.error('Missing required information');
      return;
    }

    if (!diseaseId) {
      toast.error('Disease not found in database');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('disease_reports')
        .insert({
          user_id: user.id,
          disease_id: diseaseId,
          symptoms_reported: symptoms,
          location_lat: lat,
          location_lng: lng,
          city: city || null,
          state: state || null,
          confidence_score: prediction.confidence,
          status: 'reported'
        });

      if (error) throw error;

      toast.success('Case reported successfully!');
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to report case');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Report Disease Case</DialogTitle>
          <DialogDescription>
            Your anonymous report helps track disease outbreaks in India
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Disease info */}
          {prediction && (
            <div className="p-3 rounded-lg bg-muted">
              <p className="font-medium">{prediction.disease_name}</p>
              <p className="text-sm text-muted-foreground">
                Confidence: {prediction.confidence}%
              </p>
            </div>
          )}

          {/* Location */}
          <div className="space-y-2">
            <Label>Location</Label>
            {gettingLocation ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                Getting your location...
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                  <Input
                    placeholder="State"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                  />
                </div>
                <div className="flex flex-wrap gap-1">
                  {Object.keys(indianCities).slice(0, 6).map((c) => (
                    <Button
                      key={c}
                      type="button"
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => handleCitySelect(c)}
                    >
                      {c}
                    </Button>
                  ))}
                </div>
                {lat && lng && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {lat.toFixed(4)}, {lng.toFixed(4)}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Symptoms */}
          <div className="space-y-2">
            <Label>Reported Symptoms</Label>
            <p className="text-sm text-muted-foreground">
              {symptoms.join(', ')}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading || !lat || !lng}>
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Submit Report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
