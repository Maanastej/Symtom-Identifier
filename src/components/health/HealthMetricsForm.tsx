import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Loader2, Watch, Heart, Moon, Footprints, Flame, Brain, Thermometer, Activity, Bell } from 'lucide-react';
import { getCriticalAlerts, fireCriticalNotifications, requestNotificationPermission } from '@/lib/healthNotifications';

interface HealthMetricsFormProps {
  onSuccess: () => void;
}

export function HealthMetricsForm({ onSuccess }: HealthMetricsFormProps) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notifPermission, setNotifPermission] = useState<NotificationPermission>(
    'Notification' in window ? Notification.permission : 'denied'
  );

  const [heartRate, setHeartRate] = useState('');
  const [bloodOxygen, setBloodOxygen] = useState('');
  const [sleepHours, setSleepHours] = useState('');
  const [sleepQuality, setSleepQuality] = useState('');
  const [steps, setSteps] = useState('');
  const [caloriesBurned, setCaloriesBurned] = useState('');
  const [stressLevel, setStressLevel] = useState([5]);
  const [bodyTemperature, setBodyTemperature] = useState('');
  const [notes, setNotes] = useState('');

  const resetForm = () => {
    setHeartRate('');
    setBloodOxygen('');
    setSleepHours('');
    setSleepQuality('');
    setSteps('');
    setCaloriesBurned('');
    setStressLevel([5]);
    setBodyTemperature('');
    setNotes('');
  };

  const handleEnableNotifications = async () => {
    const granted = await requestNotificationPermission();
    setNotifPermission(granted ? 'granted' : 'denied');
    if (granted) {
      toast.success('Browser notifications enabled! You\'ll be alerted for critical readings.');
    } else {
      toast.error('Notifications blocked. Please enable them in your browser settings.');
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error('Please sign in to save health data');
      return;
    }

    setLoading(true);

    try {
      const metricsPayload = {
        user_id: user.id,
        heart_rate: heartRate ? parseInt(heartRate) : null,
        blood_oxygen: bloodOxygen ? parseInt(bloodOxygen) : null,
        sleep_hours: sleepHours ? parseFloat(sleepHours) : null,
        sleep_quality: sleepQuality || null,
        steps: steps ? parseInt(steps) : null,
        calories_burned: caloriesBurned ? parseInt(caloriesBurned) : null,
        stress_level: stressLevel[0],
        body_temperature: bodyTemperature ? parseFloat(bodyTemperature) : null,
        notes: notes || null
      };

      const { error } = await supabase.from('health_metrics').insert(metricsPayload);
      if (error) throw error;

      // Fire browser notifications for any critical readings
      const criticalAlerts = getCriticalAlerts(metricsPayload);
      if (criticalAlerts.length > 0) {
        await fireCriticalNotifications(criticalAlerts);
        toast.warning(`⚠️ ${criticalAlerts.length} critical alert${criticalAlerts.length > 1 ? 's' : ''} detected — check your health tab.`);
      } else {
        toast.success('Health data saved successfully!');
      }

      resetForm();
      setOpen(false);
      onSuccess();
    } catch (error: any) {
      console.error('Error saving health metrics:', error);
      toast.error(error.message || 'Failed to save health data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Watch className="w-4 h-4" />
          Log Health Data
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Log Smartwatch Data
          </DialogTitle>
          <DialogDescription>
            Enter your health metrics from your fitness tracker
          </DialogDescription>
        </DialogHeader>

        {'Notification' in window && notifPermission !== 'granted' && (
          <div className="flex items-center justify-between gap-3 p-3 rounded-lg bg-muted/60 border border-border">
            <div className="flex items-center gap-2 min-w-0">
              <Bell className="w-4 h-4 text-primary shrink-0" />
              <p className="text-xs text-muted-foreground">
                {notifPermission === 'denied'
                  ? 'Notifications blocked — enable in browser settings to get critical alerts.'
                  : 'Enable alerts for critical readings (high heart rate, low SpO2, etc.)'}
              </p>
            </div>
            {notifPermission === 'default' && (
              <Button size="sm" variant="outline" className="shrink-0 text-xs h-7" onClick={handleEnableNotifications}>
                Enable
              </Button>
            )}
          </div>
        )}

        {'Notification' in window && notifPermission === 'granted' && (
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-primary/10 border border-primary/20">
            <Bell className="w-4 h-4 text-primary shrink-0" />
            <p className="text-xs text-primary">Browser notifications active — you'll be alerted for critical readings.</p>
          </div>
        )}

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="heartRate" className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-500" />
                Heart Rate (BPM)
              </Label>
              <Input
                id="heartRate"
                type="number"
                placeholder="72"
                value={heartRate}
                onChange={(e) => setHeartRate(e.target.value)}
                min={30}
                max={220}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bloodOxygen" className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-500" />
                Blood Oxygen (%)
              </Label>
              <Input
                id="bloodOxygen"
                type="number"
                placeholder="98"
                value={bloodOxygen}
                onChange={(e) => setBloodOxygen(e.target.value)}
                min={70}
                max={100}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sleepHours" className="flex items-center gap-2">
                <Moon className="w-4 h-4 text-indigo-500" />
                Sleep (hours)
              </Label>
              <Input
                id="sleepHours"
                type="number"
                step="0.5"
                placeholder="7.5"
                value={sleepHours}
                onChange={(e) => setSleepHours(e.target.value)}
                min={0}
                max={24}
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Moon className="w-4 h-4 text-indigo-500" />
                Sleep Quality
              </Label>
              <Select value={sleepQuality} onValueChange={setSleepQuality}>
                <SelectTrigger>
                  <SelectValue placeholder="Select quality" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="poor">Poor</SelectItem>
                  <SelectItem value="fair">Fair</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="excellent">Excellent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="steps" className="flex items-center gap-2">
                <Footprints className="w-4 h-4 text-green-500" />
                Steps
              </Label>
              <Input
                id="steps"
                type="number"
                placeholder="10000"
                value={steps}
                onChange={(e) => setSteps(e.target.value)}
                min={0}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="calories" className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-500" />
                Calories Burned
              </Label>
              <Input
                id="calories"
                type="number"
                placeholder="500"
                value={caloriesBurned}
                onChange={(e) => setCaloriesBurned(e.target.value)}
                min={0}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="temperature" className="flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-red-400" />
              Body Temperature (°C)
            </Label>
            <Input
              id="temperature"
              type="number"
              step="0.1"
              placeholder="36.6"
              value={bodyTemperature}
              onChange={(e) => setBodyTemperature(e.target.value)}
              min={35}
              max={42}
            />
          </div>

          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-purple-500" />
              Stress Level: {stressLevel[0]}/10
            </Label>
            <Slider
              value={stressLevel}
              onValueChange={setStressLevel}
              min={1}
              max={10}
              step={1}
              className="py-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Relaxed</span>
              <span>Very Stressed</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any additional notes about how you're feeling..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Save Data
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
