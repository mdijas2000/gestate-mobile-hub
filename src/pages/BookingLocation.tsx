import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, MapPin } from "lucide-react";
import { toast } from "sonner";

export default function BookingLocation() {
  const { service } = useParams();
  const navigate = useNavigate();
  const [pickupAddress, setPickupAddress] = useState("");
  const [dropoffAddress, setDropoffAddress] = useState("");

  const handleContinue = () => {
    if (!pickupAddress) {
      toast.error("Please enter pickup location");
      return;
    }

    navigate(`/book/${service}/details`, {
      state: { pickupAddress, dropoffAddress },
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

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-card p-8 rounded-xl border space-y-6">
          <div className="space-y-2">
            <Label htmlFor="pickup">Pickup Location *</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <Input
                id="pickup"
                placeholder="Enter pickup address"
                value={pickupAddress}
                onChange={(e) => setPickupAddress(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dropoff">Drop-off Location {service !== "errands" && "*"}</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <Input
                id="dropoff"
                placeholder="Enter drop-off address"
                value={dropoffAddress}
                onChange={(e) => setDropoffAddress(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

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
