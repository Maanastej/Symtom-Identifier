import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ExternalLink, CheckCircle2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FitnessApp {
  id: string;
  name: string;
  tagline: string;
  icon: string;
  exportFormat: string;
  exportSteps: string[];
  importSteps: string[];
  downloadUrl: string;
}

const fitnessApps: FitnessApp[] = [
  {
    id: 'mi-fitness',
    name: 'Mi Fitness',
    tagline: 'Xiaomi bands & watches',
    icon: '/placeholder.svg',
    exportFormat: 'CSV / JSON',
    exportSteps: [
      'Open Mi Fitness → "Me" → "Settings"',
      'Tap "Privacy" → "Export Health Data"',
      'Select date range, export as CSV',
      'Note down your values from the file',
    ],
    importSteps: [
      'Tap "Log Health Data" button above',
      'Enter values from your Mi Fitness export',
      'Heart Rate, SpO2, Sleep & Steps supported',
    ],
    downloadUrl: 'https://play.google.com/store/apps/details?id=com.xiaomi.wearable',
  },
  {
    id: 'google-fit',
    name: 'Google Fit',
    tagline: 'Android health tracking',
    icon: '/placeholder.svg',
    exportFormat: 'JSON (Takeout)',
    exportSteps: [
      'Visit takeout.google.com',
      'Select only "Fit" → click "Next step"',
      'Choose JSON format, create export',
      'Download archive and open activity files',
    ],
    importSteps: [
      'Open JSON files for heart rate, steps, sleep',
      'Tap "Log Health Data" and enter values',
    ],
    downloadUrl: 'https://www.google.com/fit/',
  },
  {
    id: 'apple-health',
    name: 'Apple Health',
    tagline: 'iPhone & Apple Watch',
    icon: '/placeholder.svg',
    exportFormat: 'XML',
    exportSteps: [
      'Health app → Profile → "Export All Health Data"',
      'Wait for export, share the ZIP file',
      'Unzip and open "export.xml"',
      'Search for HeartRate / SleepAnalysis entries',
    ],
    importSteps: [
      'Find values in export.xml for your dates',
      'Tap "Log Health Data" and enter metrics',
    ],
    downloadUrl: 'https://www.apple.com/ios/health/',
  },
  {
    id: 'fitbit',
    name: 'Fitbit',
    tagline: 'Fitbit & Pixel Watch',
    icon: '/placeholder.svg',
    exportFormat: 'CSV',
    exportSteps: [
      'Log in to fitbit.com → Settings',
      'Scroll to "Data Export" section',
      'Select date range and click "Export"',
      'Download ZIP with CSV files inside',
    ],
    importSteps: [
      'Open heart_rate, sleep, steps CSV files',
      'Note values for your dates',
      'Tap "Log Health Data" and fill the form',
    ],
    downloadUrl: 'https://www.fitbit.com/global/us/home',
  },
  {
    id: 'garmin',
    name: 'Garmin',
    tagline: 'GPS watches & trackers',
    icon: '/placeholder.svg',
    exportFormat: 'CSV / FIT',
    exportSteps: [
      'Log in to connect.garmin.com',
      'Account Settings → Data Management',
      'Click "Request Data Export"',
      'Download archive from email link',
    ],
    importSteps: [
      'Find health_snapshot or daily_summary CSVs',
      'Look for HR, SpO2, stress, sleep data',
      'Tap "Log Health Data" and enter values',
    ],
    downloadUrl: 'https://connect.garmin.com',
  },
  {
    id: 'samsung-health',
    name: 'Samsung Health',
    tagline: 'Galaxy Watch & phones',
    icon: '/placeholder.svg',
    exportFormat: 'CSV / JSON',
    exportSteps: [
      'Samsung Health → Profile → Settings',
      'Tap "Download personal data"',
      'Select categories and download ZIP',
      'Extract and open CSV files',
    ],
    importSteps: [
      'Find heart_rate, blood_oxygen, sleep files',
      'Look up values for desired dates',
      'Tap "Log Health Data" and fill the form',
    ],
    downloadUrl: 'https://www.samsung.com/us/mobile/galaxy-fit/',
  },
];

const brandColors: Record<string, string> = {
  'mi-fitness': 'hsl(var(--destructive))',
  'google-fit': 'hsl(var(--primary))',
  'apple-health': 'hsl(var(--foreground))',
  'fitbit': 'hsl(var(--accent-foreground))',
  'garmin': 'hsl(var(--primary))',
  'samsung-health': 'hsl(var(--primary))',
};

export function FitnessAppsIntegration() {
  const [selectedApp, setSelectedApp] = useState<FitnessApp | null>(null);
  const [activeTab, setActiveTab] = useState<'export' | 'import'>('export');

  return (
    <>
      <Card className="overflow-hidden">
        <div className="p-5 pb-2">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-semibold text-foreground tracking-tight">Connect Your Device</h3>
            <Badge variant="secondary" className="text-[10px] font-medium px-2 py-0.5 rounded-md">
              Manual Sync
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            Import health data from your favourite app
          </p>
        </div>

        <CardContent className="p-3 pt-2">
          <div className="space-y-1">
            {fitnessApps.map((app, i) => (
              <motion.button
                key={app.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04, duration: 0.3 }}
                onClick={() => { setSelectedApp(app); setActiveTab('export'); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors hover:bg-muted/60 group"
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
                  style={{
                    background: `${brandColors[app.id]}15`,
                    color: brandColors[app.id],
                  }}
                >
                  {app.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{app.name}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{app.tagline}</p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/40 group-hover:text-foreground group-hover:translate-x-0.5 transition-all shrink-0" />
              </motion.button>
            ))}
          </div>
        </CardContent>
      </Card>

      <AnimatePresence>
        {selectedApp && (
          <Dialog open={!!selectedApp} onOpenChange={(open) => !open && setSelectedApp(null)}>
            <DialogContent className="sm:max-w-[440px] p-0 gap-0 overflow-hidden rounded-2xl">
              <div className="px-6 pt-6 pb-4">
                <DialogHeader className="space-y-1">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold"
                      style={{
                        background: `${brandColors[selectedApp.id]}12`,
                        color: brandColors[selectedApp.id],
                      }}
                    >
                      {selectedApp.name.charAt(0)}
                    </div>
                    <div>
                      <DialogTitle className="text-base">{selectedApp.name}</DialogTitle>
                      <DialogDescription className="text-xs">{selectedApp.tagline}</DialogDescription>
                    </div>
                    <Badge variant="outline" className="ml-auto text-[10px] rounded-md">
                      {selectedApp.exportFormat}
                    </Badge>
                  </div>
                </DialogHeader>
              </div>

              <div className="px-6">
                <div className="flex rounded-lg bg-muted/60 p-0.5 gap-0.5">
                  {(['export', 'import'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 py-1.5 px-3 rounded-md text-xs font-medium transition-all ${activeTab === tab
                          ? 'bg-background shadow-sm text-foreground'
                          : 'text-muted-foreground hover:text-foreground'
                        }`}
                    >
                      {tab === 'export' ? 'Export from App' : 'Log to Medical Third Opinion'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="px-6 py-5 space-y-3 max-h-[45vh] overflow-y-auto">
                {(activeTab === 'export' ? selectedApp.exportSteps : selectedApp.importSteps).map((step, i) => (
                  <motion.div
                    key={`${activeTab}-${i}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06, duration: 0.25 }}
                    className="flex gap-3 items-start"
                  >
                    <span className="shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] flex items-center justify-center font-semibold mt-0.5">
                      {i + 1}
                    </span>
                    <p className="text-[13px] text-foreground leading-relaxed">{step}</p>
                  </motion.div>
                ))}
              </div>

              <div className="px-6 pb-6 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-1.5 rounded-xl text-xs h-9"
                  onClick={() => window.open(selectedApp.downloadUrl, '_blank')}
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Open {selectedApp.name}
                </Button>
                <Button
                  size="sm"
                  className="flex-1 gap-1.5 rounded-xl text-xs h-9"
                  onClick={() => setSelectedApp(null)}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Done
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </>
  );
}
