import { useState, lazy, Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Map, AlertTriangle, Activity, Loader2 } from 'lucide-react';

interface DiseaseReport {
  id: string;
  disease_id: string;
  location_lat: number;
  location_lng: number;
  city: string | null;
  state: string | null;
  reported_at: string;
  diseases: {
    name: string;
    severity: string;
    is_communicable: boolean;
  } | null;
}

interface DiseaseMapProps {
  reports: DiseaseReport[];
  onRefresh?: () => void;
}

const severityColors: Record<string, string> = {
  mild: '#22c55e',
  moderate: '#eab308',
  severe: '#f97316',
  critical: '#ef4444'
};

// Lazy load the actual map component
const LeafletMap = lazy(() => import('./LeafletMap'));

export function DiseaseMap({ reports, onRefresh }: DiseaseMapProps) {
  const [filter, setFilter] = useState<string>('all');
  const [timeFilter, setTimeFilter] = useState<string>('7days');
  
  // Get unique diseases for filter
  const uniqueDiseases = Array.from(
    new Set(reports.map(r => r.diseases?.name).filter(Boolean))
  );
  
  // Filter reports
  const filteredReports = reports.filter(report => {
    // Disease filter
    if (filter !== 'all' && report.diseases?.name !== filter) {
      return false;
    }
    
    // Time filter
    const reportDate = new Date(report.reported_at);
    const now = new Date();
    const daysDiff = (now.getTime() - reportDate.getTime()) / (1000 * 60 * 60 * 24);
    
    switch (timeFilter) {
      case '24h':
        return daysDiff <= 1;
      case '7days':
        return daysDiff <= 7;
      case '30days':
        return daysDiff <= 30;
      default:
        return true;
    }
  });

  // Count cases by region
  const regionCounts = filteredReports.reduce((acc, report) => {
    const region = report.state || 'Unknown';
    acc[region] = (acc[region] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const hotspots = Object.entries(regionCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Map className="w-5 h-5 text-primary" />
            <CardTitle>Disease Map - India</CardTitle>
          </div>
          <Badge variant="outline" className="flex items-center gap-1">
            <Activity className="w-3 h-3" />
            {filteredReports.length} cases
          </Badge>
        </div>
        <CardDescription>
          Real-time disease case distribution across India
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex gap-2">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by disease" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Diseases</SelectItem>
              {uniqueDiseases.map((disease) => (
                <SelectItem key={disease} value={disease!}>
                  {disease}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 hours</SelectItem>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Map */}
        <div className="h-[400px] rounded-lg overflow-hidden border">
          <Suspense fallback={
            <div className="h-full w-full flex items-center justify-center bg-muted">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          }>
            <LeafletMap reports={filteredReports} severityColors={severityColors} />
          </Suspense>
        </div>

        {/* Hotspots */}
        {hotspots.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-orange-500" />
              Top Hotspots
            </p>
            <div className="flex flex-wrap gap-2">
              {hotspots.map(([region, count]) => (
                <Badge key={region} variant="secondary">
                  {region}: {count} cases
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="font-medium">Severity:</span>
          {Object.entries(severityColors).map(([severity, color]) => (
            <span key={severity} className="flex items-center gap-1">
              <span 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: color }}
              />
              {severity}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
