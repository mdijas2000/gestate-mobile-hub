import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { LocationPicker } from "@/components/LocationPicker";
import { MapView } from "@/components/MapView";

export default function BookingLocation() {
  const { service } = useParams();
  const navigate = useNavigate();
  const [pickup, setPickup] = useState({ address: "", coords: { lat: 0, lng: 0 } });
  const [dropoff, setDropoff] = useState({ address: "", coords: { lat: 0, lng: 0 } });

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
        dropoffCoords: dropoff.coords
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
