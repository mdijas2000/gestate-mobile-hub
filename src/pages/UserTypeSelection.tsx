import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { User, Bike } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function UserTypeSelection() {
  const [selectedType, setSelectedType] = useState<'customer' | 'service_provider' | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleContinue = async () => {
    if (!selectedType || !user) {
      toast.error("Please select a user type");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('user_roles')
        .insert({
          user_id: user.id,
          role: selectedType,
        });

      if (error) throw error;

      toast.success("Account setup successful!");
      
      if (selectedType === 'service_provider') {
        navigate('/profile-setup', { state: { userType: selectedType } });
      } else {
        navigate('/profile-setup', { state: { userType: selectedType } });
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to set user type");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Choose Your Role</h1>
          <p className="text-muted-foreground">
            How do you want to use Deli-Ride?
          </p>
        </div>

        <div className="grid gap-4">
          <Card
            className={`p-6 cursor-pointer transition-all ${
              selectedType === 'customer'
                ? 'border-primary ring-2 ring-primary'
                : 'hover:border-primary/50'
            }`}
            onClick={() => setSelectedType('customer')}
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <User className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">Customer</h3>
                <p className="text-sm text-muted-foreground">
                  Book rides, deliveries, errands, and moving services
                </p>
              </div>
            </div>
          </Card>

          <Card
            className={`p-6 cursor-pointer transition-all ${
              selectedType === 'service_provider'
                ? 'border-secondary ring-2 ring-secondary'
                : 'hover:border-secondary/50'
            }`}
            onClick={() => setSelectedType('service_provider')}
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-secondary/10 rounded-lg">
                <Bike className="w-6 h-6 text-secondary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">Service Provider</h3>
                <p className="text-sm text-muted-foreground">
                  Earn by providing rides, deliveries, and other services
                </p>
              </div>
            </div>
          </Card>
        </div>

        <Button
          onClick={handleContinue}
          className="w-full gradient-primary text-white font-semibold py-6"
          disabled={!selectedType || loading}
        >
          {loading ? "Setting up..." : "Continue"}
        </Button>
      </div>
    </div>
  );
}
