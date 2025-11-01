import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Bike, Package, ShoppingCart, Truck } from "lucide-react";

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-md space-y-8 text-center">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold gradient-primary bg-clip-text text-transparent">
              Deli-Ride
            </h1>
            <p className="text-xl text-muted-foreground">
              Your all-in-one service platform
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 py-8">
            <div className="p-4 bg-card rounded-xl border shadow-sm">
              <Bike className="w-8 h-8 mx-auto mb-2 text-primary" />
              <p className="text-sm font-medium">Rides</p>
            </div>
            <div className="p-4 bg-card rounded-xl border shadow-sm">
              <Package className="w-8 h-8 mx-auto mb-2 text-secondary" />
              <p className="text-sm font-medium">Delivery</p>
            </div>
            <div className="p-4 bg-card rounded-xl border shadow-sm">
              <ShoppingCart className="w-8 h-8 mx-auto mb-2 text-accent" />
              <p className="text-sm font-medium">Errands</p>
            </div>
            <div className="p-4 bg-card rounded-xl border shadow-sm">
              <Truck className="w-8 h-8 mx-auto mb-2 text-primary" />
              <p className="text-sm font-medium">Moving</p>
            </div>
          </div>

          <div className="space-y-4">
            <Button
              onClick={() => navigate('/login')}
              className="w-full gradient-primary text-white font-semibold py-6 text-lg"
              size="lg"
            >
              Get Started
            </Button>
            
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <button
                onClick={() => navigate('/login')}
                className="text-primary font-semibold hover:underline"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
