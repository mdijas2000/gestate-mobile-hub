import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, Clock } from "lucide-react";
import { toast } from "sonner";
import { LocationPicker } from "@/components/LocationPicker";
import { MapView } from "@/components/MapView";
import { calculateRoute } from "@/lib/maps";
import { Card } from "@/components/ui/card";

export default function BookingLocation() {
  const { service } = useParams();
  const navigate = useNavigate();
  const [pickup, setPickup] = useState({ address: "", coords: { lat: 0, lng: 0 } });
  const [dropoff, setDropoff] = useState({ address: "", coords: { lat: 0, lng: 0 } });
  const [routeInfo, setRouteInfo] = useState<{ distance: number; duration: number; distanceText: string; durationText: string } | null>(null);
  const [calculating, setCalculating] = useState(false);

  useEffect(() => {
    const calculateRouteInfo = async () => {
      if (pickup.coords.lat !== 0 && dropoff.coords.lat !== 0) {
        setCalculating(true);
        const info = await calculateRoute(pickup.coords, dropoff.coords);
        setRouteInfo(info);
        setCalculating(false);
      } else {
        setRouteInfo(null);
      }
    };

    calculateRouteInfo();
  }, [pickup.coords, dropoff.coords]);

  const handleContinue = () => {
    if (!pickup.address) {
      toast.error("Please enter pickup location");
      return;
    }

    navigate(`/book/${service}/details`, {
      state: { 
        pickupAddress: pickup.address,
        pickupCoords: pickup.coords,
        dropoffAddress: dropoff.address,
        dropoffCoords: dropoff.coords,
        distance: routeInfo?.distance || 0,
        duration: routeInfo?.duration || 0
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      <header className="bg-card border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold">Select Location</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        <MapView 
          pickup={pickup.coords.lat !== 0 ? { ...pickup.coords, address: pickup.address } : undefined}
          dropoff={dropoff.coords.lat !== 0 ? { ...dropoff.coords, address: dropoff.address } : undefined}
          showRoute={!!pickup.address && !!dropoff.address}
        />

        <div className="bg-card p-8 rounded-xl border space-y-6">
          <LocationPicker
            label="Pickup Location *"
            value={pickup.address}
            onChange={(address, coords) => setPickup({ address, coords })}
            placeholder="Enter pickup address"
          />

          <LocationPicker
            label={`Drop-off Location ${service !== "errands" ? "*" : ""}`}
            value={dropoff.address}
            onChange={(address, coords) => setDropoff({ address, coords })}
            placeholder="Enter drop-off address"
          />

          {routeInfo && !calculating && (
            <Card className="p-4 bg-secondary/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Distance</p>
                    <p className="font-semibold">{routeInfo.distanceText}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">ETA</p>
                    <p className="font-semibold">{routeInfo.durationText}</p>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {calculating && (
            <Card className="p-4 bg-secondary/10">
              <p className="text-sm text-muted-foreground text-center">Calculating route...</p>
            </Card>
          )}

          <Button
            onClick={handleContinue}
            className="w-full gradient-primary text-white font-semibold py-6"
          >
            Continue
          </Button>
        </div>
      </main>
    </div>
  );
}
