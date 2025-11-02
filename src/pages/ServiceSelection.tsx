import { useNavigate, useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Bike, Package, ShoppingBag, Truck } from "lucide-react";
import { useServiceCategories } from "@/hooks/useServiceCategories";

const categoryIcons: Record<string, any> = {
  ride: Bike,
  delivery: Package,
  errands: ShoppingBag,
  moving: Truck,
};

export default function ServiceSelection() {
  const { category } = useParams();
  const navigate = useNavigate();
  const { data: services, isLoading } = useServiceCategories();

  const selectedService = services?.find((s) => s.category === category);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const handleBookNow = () => {
    navigate(`/book/${category}/location`);
  };

  const Icon = categoryIcons[category || ""] || Package;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      <header className="bg-card border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold">Select Service</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {selectedService && (
          <Card className="p-8">
            <div className="flex items-start gap-6 mb-6">
              <div className="p-4 bg-primary/10 rounded-xl">
                <Icon className="w-12 h-12 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold mb-2">{selectedService.name}</h2>
                <p className="text-muted-foreground text-lg">{selectedService.description}</p>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center p-4 bg-secondary/10 rounded-lg">
                <span className="font-medium">Base Price</span>
                <span className="text-xl font-bold">${selectedService.base_price}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-secondary/10 rounded-lg">
                <span className="font-medium">Price per km</span>
                <span className="text-xl font-bold">${selectedService.price_per_km}/km</span>
              </div>
            </div>

            <Button
              onClick={handleBookNow}
              className="w-full gradient-primary text-white font-semibold py-6 text-lg"
            >
              Book Now
            </Button>
          </Card>
        )}
      </main>
    </div>
  );
}
