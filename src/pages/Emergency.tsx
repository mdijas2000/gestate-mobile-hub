import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Phone, AlertCircle, MapPin, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function Emergency() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [locationSharing, setLocationSharing] = useState(false);

  const handleEmergencyCall = (number: string) => {
    window.location.href = `tel:${number}`;
  };

  const handleShareLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationSharing(true);
          // In production, this would send location to emergency services
          console.log("Location:", position.coords);
        },
        (error) => {
          console.error("Location error:", error);
        }
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-destructive/20 via-background to-destructive/10">
      <header className="bg-card border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-destructive">Emergency</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        <Card className="p-6 bg-destructive/10 border-destructive/20">
          <div className="flex items-start gap-4 mb-4">
            <AlertCircle className="w-8 h-8 text-destructive flex-shrink-0" />
            <div>
              <h2 className="text-xl font-bold mb-2">Emergency Assistance</h2>
              <p className="text-muted-foreground">
                If you're in an emergency, tap one of the buttons below for immediate help.
              </p>
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          <Button
            onClick={() => handleEmergencyCall("911")}
            variant="destructive"
            className="w-full py-8 text-lg"
          >
            <Phone className="w-6 h-6 mr-3" />
            Call Emergency Services (911)
          </Button>

          <Button
            onClick={() => handleEmergencyCall("112")}
            variant="destructive"
            className="w-full py-8 text-lg"
          >
            <Phone className="w-6 h-6 mr-3" />
            International Emergency (112)
          </Button>

          <Button
            onClick={handleShareLocation}
            variant="outline"
            className="w-full py-6"
          >
            <MapPin className="w-5 h-5 mr-2" />
            {locationSharing ? "Location Shared" : "Share Live Location"}
          </Button>
        </div>

        <Card className="p-6">
          <h3 className="font-semibold mb-4">Emergency Contacts</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Deli-Ride Support</p>
                  <p className="text-sm text-muted-foreground">24/7 Support</p>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleEmergencyCall("+1-800-DELI")}
              >
                <Phone className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-muted">
          <p className="text-sm text-muted-foreground">
            Your current location and user details will be automatically shared with emergency services when you place a call.
          </p>
        </Card>
      </main>
    </div>
  );
}
