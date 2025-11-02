import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePendingBookings } from "@/hooks/useBookings";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export default function ProviderRequests() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: bookings, isLoading, refetch } = usePendingBookings();

  const handleAccept = async (bookingId: string) => {
    try {
      const { error } = await supabase
        .from("bookings")
        .update({
          provider_id: user?.id,
          status: "accepted",
        })
        .eq("id", bookingId);

      if (error) throw error;

      toast.success("Booking accepted!");
      refetch();
      navigate(`/provider/service/${bookingId}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to accept booking");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary/10 via-background to-primary/10">
      <header className="bg-card border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/provider/dashboard")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold">Available Requests</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : bookings && bookings.length > 0 ? (
          <div className="space-y-4">
            {bookings.map((booking: any) => (
              <Card key={booking.id} className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-semibold mb-1">
                        {booking.service_categories?.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {booking.profiles?.full_name}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-secondary font-bold text-xl">
                        <DollarSign className="w-5 h-5" />
                        {booking.estimated_price}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-primary mt-1" />
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">Pickup</p>
                        <p className="font-medium">{booking.pickup_address}</p>
                      </div>
                    </div>

                    {booking.dropoff_address && (
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-secondary mt-1" />
                        <div className="flex-1">
                          <p className="text-sm text-muted-foreground">Drop-off</p>
                          <p className="font-medium">{booking.dropoff_address}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button
                      onClick={() => handleAccept(booking.id)}
                      className="flex-1 gradient-primary text-white"
                    >
                      Accept
                    </Button>
                    <Button variant="outline" className="flex-1">
                      Decline
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <h3 className="text-xl font-semibold mb-2">No Requests Available</h3>
            <p className="text-muted-foreground">
              New service requests will appear here when customers book
            </p>
          </Card>
        )}
      </main>
    </div>
  );
}
