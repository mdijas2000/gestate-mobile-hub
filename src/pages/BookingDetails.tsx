import { useState, useMemo } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, MapPin, Clock, DollarSign } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useServiceCategories } from "@/hooks/useServiceCategories";
import { toast } from "sonner";
import { calculateDynamicPrice } from "@/lib/maps";
import { Card } from "@/components/ui/card";

export default function BookingDetails() {
  const { service } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { data: services } = useServiceCategories();
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [loading, setLoading] = useState(false);

  const { pickupAddress, pickupCoords, dropoffAddress, dropoffCoords, distance, duration } = location.state || {};
  const selectedService = services?.find((s) => s.category === service);

  const dynamicPrice = useMemo(() => {
    if (!selectedService || !distance) return selectedService?.base_price || 0;
    return calculateDynamicPrice(
      Number(selectedService.base_price),
      Number(selectedService.price_per_km || 0),
      distance
    );
  }, [selectedService, distance]);

  const handleCreateBooking = async () => {
    if (!user || !selectedService) {
      toast.error("Please log in to continue");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.from("bookings").insert({
        customer_id: user.id,
        service_category_id: selectedService.id,
        pickup_address: pickupAddress,
        dropoff_address: dropoffAddress || null,
        pickup_latitude: pickupCoords?.lat || 0,
        pickup_longitude: pickupCoords?.lng || 0,
        dropoff_latitude: dropoffCoords?.lat || null,
        dropoff_longitude: dropoffCoords?.lng || null,
        special_instructions: specialInstructions || null,
        estimated_price: dynamicPrice,
        distance_km: distance || null,
      });

      if (error) throw error;

      toast.success("Booking created! Finding a provider...");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Failed to create booking");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      <header className="bg-card border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold">Booking Details</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-card p-8 rounded-xl border space-y-6">
          <div className="space-y-4">
            <div className="p-4 bg-primary/5 rounded-lg">
              <p className="text-sm text-muted-foreground">Pickup</p>
              <p className="font-medium">{pickupAddress}</p>
            </div>

            {dropoffAddress && (
              <div className="p-4 bg-primary/5 rounded-lg">
                <p className="text-sm text-muted-foreground">Drop-off</p>
                <p className="font-medium">{dropoffAddress}</p>
              </div>
            )}
          </div>

          {distance && duration && (
            <Card className="p-4 bg-secondary/10">
              <h3 className="font-semibold mb-3">Route Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Distance</p>
                    <p className="font-medium">{distance.toFixed(1)} km</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">ETA</p>
                    <p className="font-medium">{duration} mins</p>
                  </div>
                </div>
              </div>
            </Card>
          )}

          <div className="space-y-2">
            <Label htmlFor="instructions">Special Instructions (Optional)</Label>
            <Textarea
              id="instructions"
              placeholder="Add any special instructions for the provider..."
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              rows={4}
            />
          </div>

          <div className="p-4 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg border border-primary/20">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Base Price</span>
                <span>${selectedService?.base_price}</span>
              </div>
              {distance && selectedService?.price_per_km && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Distance Charge ({distance.toFixed(1)} km × ${selectedService.price_per_km}/km)</span>
                  <span>${(distance * Number(selectedService.price_per_km)).toFixed(2)}</span>
                </div>
              )}
              <div className="pt-2 border-t flex justify-between items-center">
                <span className="font-semibold flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Total Price
                </span>
                <span className="text-2xl font-bold text-primary">${dynamicPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <Button
            onClick={handleCreateBooking}
            disabled={loading}
            className="w-full gradient-primary text-white font-semibold py-6"
          >
            {loading ? "Creating Booking..." : "Confirm Booking"}
          </Button>
        </div>
      </main>
    </div>
  );
}
