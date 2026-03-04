import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Loader2, User, Heart, Activity, Moon, Droplets } from 'lucide-react';

interface HealthProfileFormProps {
  onSuccess: () => void;
}

export function HealthProfileForm({ onSuccess }: HealthProfileFormProps) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  const [age, setAge] = useState('');
  const [heightCm, setHeightCm] = useState('');
  const [weightKg, setWeightKg] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [restingBpm, setRestingBpm] = useState('');
  const [bpSystolic, setBpSystolic] = useState('');
  const [bpDiastolic, setBpDiastolic] = useState('');
  const [avgSpo2, setAvgSpo2] = useState('');
  const [avgSleepHours, setAvgSleepHours] = useState('');

  useEffect(() => {
    if (open && user) {
      fetchProfile();
    }
  }, [open, user]);

  const fetchProfile = async () => {
    if (!user) return;
    setFetching(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('age, height_cm, weight_kg, blood_group, resting_bpm, blood_pressure_systolic, blood_pressure_diastolic, avg_spo2, avg_sleep_hours')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setAge(data.age?.toString() || '');
        setHeightCm(data.height_cm?.toString() || '');
        setWeightKg(data.weight_kg?.toString() || '');
        setBloodGroup(data.blood_group || '');
        setRestingBpm(data.resting_bpm?.toString() || '');
        setBpSystolic(data.blood_pressure_systolic?.toString() || '');
        setBpDiastolic(data.blood_pressure_diastolic?.toString() || '');
        setAvgSpo2(data.avg_spo2?.toString() || '');
        setAvgSleepHours(data.avg_sleep_hours?.toString() || '');
      }
    } catch (error: any) {
      console.error('Error fetching profile:', error);
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error('Please sign in to save health profile');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          age: age ? parseInt(age) : null,
          height_cm: heightCm ? parseFloat(heightCm) : null,
          weight_kg: weightKg ? parseFloat(weightKg) : null,
          blood_group: bloodGroup || null,
          resting_bpm: restingBpm ? parseInt(restingBpm) : null,
          blood_pressure_systolic: bpSystolic ? parseInt(bpSystolic) : null,
          blood_pressure_diastolic: bpDiastolic ? parseInt(bpDiastolic) : null,
          avg_spo2: avgSpo2 ? parseInt(avgSpo2) : null,
          avg_sleep_hours: avgSleepHours ? parseFloat(avgSleepHours) : null,
        })
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success('Health profile saved successfully!');
      setOpen(false);
      onSuccess();
    } catch (error: any) {
      console.error('Error saving health profile:', error);
      toast.error(error.message || 'Failed to save health profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <User className="w-4 h-4" />
          Health Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Your Health Profile
          </DialogTitle>
          <DialogDescription>
            Enter your baseline health metrics for better disease predictions
          </DialogDescription>
        </DialogHeader>

        {fetching ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="25"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  min={1}
                  max={120}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  placeholder="170"
                  value={heightCm}
                  onChange={(e) => setHeightCm(e.target.value)}
                  min={50}
                  max={250}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="70"
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value)}
                  min={20}
                  max={300}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-red-500" />
                Blood Group
              </Label>
              <Select value={bloodGroup} onValueChange={setBloodGroup}>
                <SelectTrigger>
                  <SelectValue placeholder="Select blood group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A+">A+</SelectItem>
                  <SelectItem value="A-">A-</SelectItem>
                  <SelectItem value="B+">B+</SelectItem>
                  <SelectItem value="B-">B-</SelectItem>
                  <SelectItem value="AB+">AB+</SelectItem>
                  <SelectItem value="AB-">AB-</SelectItem>
                  <SelectItem value="O+">O+</SelectItem>
                  <SelectItem value="O-">O-</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="restingBpm" className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-red-500" />
                  Resting BPM
                </Label>
                <Input
                  id="restingBpm"
                  type="number"
                  placeholder="72"
                  value={restingBpm}
                  onChange={(e) => setRestingBpm(e.target.value)}
                  min={40}
                  max={200}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="avgSpo2" className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-500" />
                  Avg SpO2 (%)
                </Label>
                <Input
                  id="avgSpo2"
                  type="number"
                  placeholder="98"
                  value={avgSpo2}
                  onChange={(e) => setAvgSpo2(e.target.value)}
                  min={80}
                  max={100}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-purple-500" />
                Blood Pressure (mmHg)
              </Label>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="number"
                  placeholder="Systolic (120)"
                  value={bpSystolic}
                  onChange={(e) => setBpSystolic(e.target.value)}
                  min={70}
                  max={200}
                />
                <Input
                  type="number"
                  placeholder="Diastolic (80)"
                  value={bpDiastolic}
                  onChange={(e) => setBpDiastolic(e.target.value)}
                  min={40}
                  max={130}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="avgSleep" className="flex items-center gap-2">
                <Moon className="w-4 h-4 text-indigo-500" />
                Avg Sleep (hours)
              </Label>
              <Input
                id="avgSleep"
                type="number"
                step="0.5"
                placeholder="7.5"
                value={avgSleepHours}
                onChange={(e) => setAvgSleepHours(e.target.value)}
                min={0}
                max={24}
              />
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading || fetching}>
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Save Profile
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
