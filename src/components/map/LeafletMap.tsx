import { useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import { Badge } from '@/components/ui/badge';
import 'leaflet/dist/leaflet.css';

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

interface LeafletMapProps {
  reports: DiseaseReport[];
  severityColors: Record<string, string>;
}

// India center coordinates
const INDIA_CENTER: [number, number] = [20.5937, 78.9629];
const INDIA_ZOOM = 5;

function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [map, center, zoom]);
  
  return null;
}

function LeafletMap({ reports, severityColors }: LeafletMapProps) {
  return (
    <MapContainer
      center={INDIA_CENTER}
      zoom={INDIA_ZOOM}
      style={{ height: '100%', width: '100%' }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapController center={INDIA_CENTER} zoom={INDIA_ZOOM} />
      
      {reports.map((report) => (
        <CircleMarker
          key={report.id}
          center={[Number(report.location_lat), Number(report.location_lng)]}
          radius={8}
          fillColor={severityColors[report.diseases?.severity || 'moderate']}
          color={severityColors[report.diseases?.severity || 'moderate']}
          weight={2}
          opacity={0.8}
          fillOpacity={0.6}
        >
          <Popup>
            <div className="space-y-1">
              <p className="font-semibold">{report.diseases?.name}</p>
              <p className="text-sm text-muted-foreground">
                {report.city}, {report.state}
              </p>
              <p className="text-xs text-muted-foreground">
                Reported: {new Date(report.reported_at).toLocaleDateString()}
              </p>
              <Badge 
                variant="outline" 
                className="text-xs"
                style={{ 
                  backgroundColor: `${severityColors[report.diseases?.severity || 'moderate']}20`,
                  color: severityColors[report.diseases?.severity || 'moderate']
                }}
              >
                {report.diseases?.severity}
              </Badge>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}

export default LeafletMap;
