import { useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useServiceCategories } from "@/hooks/useServiceCategories";
import { toast } from "sonner";

export default function BookingDetails() {
  const { service } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { data: services } = useServiceCategories();
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [loading, setLoading] = useState(false);

  const { pickupAddress, dropoffAddress } = location.state || {};
  const selectedService = services?.find((s) => s.category === service);

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
        pickup_latitude: 0,
        pickup_longitude: 0,
        dropoff_latitude: dropoffAddress ? 0 : null,
        dropoff_longitude: dropoffAddress ? 0 : null,
        special_instructions: specialInstructions || null,
        estimated_price: selectedService.base_price,
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

          <div className="p-4 bg-secondary/10 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium">Estimated Price</span>
              <span className="text-2xl font-bold">${selectedService?.base_price}</span>
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
