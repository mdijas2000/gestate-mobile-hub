import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Phone, MessageSquare, Navigation, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { MapView } from "@/components/MapView";

export default function ActiveService() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooking();
    
    // Subscribe to real-time updates
    const channel = supabase
      .channel(`booking-${id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "bookings",
          filter: `id=eq.${id}`,
        },
        (payload) => {
          setBooking(payload.new);
          if (payload.new.status === "completed") {
            toast.success("Service completed!");
            setTimeout(() => navigate(`/service/${id}/complete`), 1000);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  const fetchBooking = async () => {
    try {
      const { data, error } = await supabase
        .from("bookings")
        .select(`
          *,
          service_categories(name, category),
          provider_profiles!bookings_provider_id_fkey(
            rating,
            profiles(full_name, phone_number)
          ),
          profiles!bookings_customer_id_fkey(full_name, phone_number)
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      setBooking(data);
    } catch (error: any) {
      toast.error("Failed to load booking details");
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "text-yellow-500";
      case "accepted": return "text-blue-500";
      case "in_progress": return "text-green-500";
      case "completed": return "text-primary";
      case "cancelled": return "text-red-500";
      default: return "text-muted-foreground";
    }
  };

  const getStatusText = (status: string) => {
    return status.replace("_", " ").toUpperCase();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      <header className="bg-card border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold">Active Service</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        <MapView 
          pickup={{ 
            lat: booking.pickup_latitude || 0, 
            lng: booking.pickup_longitude || 0, 
            address: booking.pickup_address || "Pickup" 
          }}
          dropoff={booking.dropoff_address ? { 
            lat: booking.dropoff_latitude || 0, 
            lng: booking.dropoff_longitude || 0, 
            address: booking.dropoff_address 
          } : undefined}
          currentLocation={{ lat: 0, lng: 0 }}
          showRoute={true}
          height="300px"
        />

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">{booking.service_categories?.name}</h2>
            <span className={`font-semibold ${getStatusColor(booking.status)}`}>
              {getStatusText(booking.status)}
            </span>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-primary/5 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Pickup Location</p>
              <p className="font-medium">{booking.pickup_address}</p>
            </div>

            {booking.dropoff_address && (
              <div className="p-4 bg-primary/5 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Drop-off Location</p>
                <p className="font-medium">{booking.dropoff_address}</p>
              </div>
            )}

            {booking.provider_profiles && (
              <div className="p-4 bg-secondary/10 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">Service Provider</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{booking.provider_profiles.profiles?.full_name}</p>
                    <p className="text-sm text-muted-foreground">
                      Rating: ⭐ {booking.provider_profiles.rating || "N/A"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="icon" variant="outline">
                      <Phone className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="outline">
                      <MessageSquare className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {booking.special_instructions && (
              <div className="p-4 bg-accent/10 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Special Instructions</p>
                <p className="text-sm">{booking.special_instructions}</p>
              </div>
            )}
          </div>
        </Card>

        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" className="py-6" size="lg">
            <Navigation className="w-5 h-5 mr-2" />
            Navigate
          </Button>
          <Button variant="destructive" className="py-6" size="lg">
            <AlertCircle className="w-5 h-5 mr-2" />
            Emergency
          </Button>
        </div>
      </main>
    </div>
  );
}
