import { useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { MapPin } from "lucide-react";

interface MapViewProps {
  pickup?: { lat: number; lng: number; address: string };
  dropoff?: { lat: number; lng: number; address: string };
  currentLocation?: { lat: number; lng: number };
  showRoute?: boolean;
  height?: string;
}

export function MapView({ pickup, dropoff, currentLocation, showRoute, height = "400px" }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // TODO: Initialize Google Maps when API key is added
    // This is a placeholder for the actual map integration
    console.log("Map would initialize here with:", { pickup, dropoff, currentLocation, showRoute });
  }, [pickup, dropoff, currentLocation, showRoute]);

  return (
    <Card className="relative overflow-hidden" style={{ height }}>
      <div 
        ref={mapRef} 
        className="w-full h-full bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center"
      >
        <div className="text-center space-y-4">
          <MapPin className="w-16 h-16 mx-auto text-primary/40" />
          <div className="text-sm text-muted-foreground">
            <p>Map will load here</p>
            <p className="text-xs mt-1">Google Maps API key needed</p>
          </div>
          {pickup && (
            <div className="text-xs space-y-1">
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span>{pickup.address}</span>
              </div>
              {dropoff && (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-destructive" />
                  <span>{dropoff.address}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
