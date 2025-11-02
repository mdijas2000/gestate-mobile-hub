import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Phone, MessageSquare, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function ProviderActiveService() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooking();
  }, [id]);

  const fetchBooking = async () => {
    try {
      const { data, error } = await supabase
        .from("bookings")
        .select(`
          *,
          service_categories(name, category),
          profiles!bookings_customer_id_fkey(full_name, phone_number, address)
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      setBooking(data);
    } catch (error: any) {
      toast.error("Failed to load booking details");
      navigate("/provider/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      const updates: any = { status: newStatus };
      
      if (newStatus === "in_progress") {
        updates.started_at = new Date().toISOString();
      } else if (newStatus === "completed") {
        updates.completed_at = new Date().toISOString();
        updates.final_price = booking.estimated_price;
      }

      const { error } = await supabase
        .from("bookings")
        .update(updates)
        .eq("id", id);

      if (error) throw error;

      toast.success(`Status updated to ${newStatus.replace("_", " ")}`);
      
      if (newStatus === "completed") {
        navigate("/provider/dashboard");
      } else {
        fetchBooking();
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update status");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary/10 via-background to-primary/10">
      <header className="bg-card border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/provider/dashboard")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold">Active Service</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">{booking.service_categories?.name}</h2>

          <div className="space-y-4 mb-6">
            <div className="p-4 bg-primary/5 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Customer</p>
              <div className="flex items-center justify-between">
                <p className="font-semibold">{booking.profiles?.full_name}</p>
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

            {booking.special_instructions && (
              <div className="p-4 bg-accent/10 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Special Instructions</p>
                <p className="text-sm">{booking.special_instructions}</p>
              </div>
            )}

            <div className="p-4 bg-secondary/10 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">Earnings</span>
                <span className="text-2xl font-bold text-secondary">
                  ${booking.estimated_price}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {booking.status === "accepted" && (
              <Button
                onClick={() => handleStatusUpdate("in_progress")}
                className="w-full gradient-primary text-white py-6"
              >
                Start Service
              </Button>
            )}

            {booking.status === "in_progress" && (
              <Button
                onClick={() => handleStatusUpdate("completed")}
                className="w-full gradient-secondary text-white py-6"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Complete Service
              </Button>
            )}
          </div>
        </Card>
      </main>
    </div>
  );
}
