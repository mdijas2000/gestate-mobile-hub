import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useCustomerBookings } from "@/hooks/useBookings";
import { Bike, Package, ShoppingCart, Truck, LogOut, User, History } from "lucide-react";

interface ServiceCategory {
  id: string;
  name: string;
  category: string;
  description: string;
  base_price: number;
  price_per_km: number;
}

export default function Dashboard() {
  const [services, setServices] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { data: bookings } = useCustomerBookings();

  const activeBooking = bookings?.find(
    (b: any) => b.status === "in_progress" || b.status === "accepted"
  );

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('service_categories')
        .select('*')
        .eq('is_active', true)
        .order('category');

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (category: string) => {
    switch (category) {
      case 'ride': return <Bike className="w-8 h-8" />;
      case 'delivery': return <Package className="w-8 h-8" />;
      case 'errands': return <ShoppingCart className="w-8 h-8" />;
      case 'moving': return <Truck className="w-8 h-8" />;
      default: return <Bike className="w-8 h-8" />;
    }
  };

  const getColor = (category: string) => {
    switch (category) {
      case 'ride': return 'text-primary bg-primary/10';
      case 'delivery': return 'text-secondary bg-secondary/10';
      case 'errands': return 'text-accent bg-accent/10';
      case 'moving': return 'text-primary bg-primary/10';
      default: return 'text-primary bg-primary/10';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      <header className="bg-card border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">
            Deli-Ride
          </h1>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/history")}>
              <History className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => navigate("/profile")}>
              <User className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {activeBooking && (
          <Card className="p-6 gradient-primary text-white">
            <h2 className="text-xl font-semibold mb-3">Active Service</h2>
            <p className="mb-4">{activeBooking.service_categories?.name}</p>
            <Button
              variant="outline"
              className="bg-white text-primary hover:bg-white/90"
              onClick={() => navigate(`/service/${activeBooking.id}/active`)}
            >
              View Details
            </Button>
          </Card>
        )}

        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Welcome Back!</h2>
          <p className="text-muted-foreground">What service do you need today?</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="p-6 animate-pulse">
                <div className="h-20 bg-muted rounded" />
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service) => (
              <Card
                key={service.id}
                className="p-6 cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1"
                onClick={() => navigate(`/service/${service.category}`)}
              >
                <div className={`p-4 rounded-xl mb-4 ${getColor(service.category)}`}>
                  {getIcon(service.category)}
                </div>
                <h3 className="font-semibold text-lg mb-2">{service.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {service.description}
                </p>
                <div className="text-sm font-medium text-primary">
                  From ${service.base_price}
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
