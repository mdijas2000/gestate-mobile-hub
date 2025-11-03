import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { usePendingBookings, useProviderBookings } from "@/hooks/useBookings";
import { LogOut, User, DollarSign, TrendingUp, Clock, Wallet } from "lucide-react";

export default function ProviderDashboard() {
  const [isOnline, setIsOnline] = useState(false);
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { data: pendingBookings } = usePendingBookings();
  const { data: bookings } = useProviderBookings();

  const todayEarnings = bookings?.filter((b: any) => {
    const today = new Date().toDateString();
    return new Date(b.completed_at || b.created_at).toDateString() === today && b.status === "completed";
  }).reduce((sum: number, b: any) => sum + (Number(b.final_price) || 0), 0) || 0;

  const totalTrips = bookings?.filter((b: any) => b.status === "completed").length || 0;
  const avgRating = 4.8; // Placeholder - would calculate from ratings table

  const activeBooking = bookings?.find((b: any) => 
    b.status === "accepted" || b.status === "in_progress"
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary/10 via-background to-primary/10">
      <header className="bg-card border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold gradient-secondary bg-clip-text text-transparent">
            Deli-Ride Provider
          </h1>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/provider/earnings")}>
              <Wallet className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => navigate("/profile")}>
              <User className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold mb-2">Provider Dashboard</h2>
              <p className="text-muted-foreground">Manage your services and earnings</p>
            </div>
            <div className="flex items-center gap-3 bg-card p-4 rounded-xl border">
              <span className="font-medium">
                {isOnline ? 'Online' : 'Offline'}
              </span>
              <Switch checked={isOnline} onCheckedChange={setIsOnline} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-secondary/10 rounded-lg">
                  <DollarSign className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Today's Earnings</p>
                  <p className="text-2xl font-bold">${todayEarnings.toFixed(2)}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Trips</p>
                  <p className="text-2xl font-bold">{totalTrips}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-accent/10 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Rating</p>
                  <p className="text-2xl font-bold">⭐ {avgRating}</p>
                </div>
              </div>
            </Card>
          </div>

          {activeBooking ? (
            <Card className="p-6 mb-6">
              <h3 className="text-xl font-semibold mb-4">Active Service</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Service</span>
                  <span className="font-medium">{activeBooking.service_categories?.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Status</span>
                  <span className="font-medium capitalize">{activeBooking.status.replace("_", " ")}</span>
                </div>
                <Button
                  onClick={() => navigate(`/provider/service/${activeBooking.id}`)}
                  className="w-full gradient-primary text-white mt-4"
                >
                  View Details
                </Button>
              </div>
            </Card>
          ) : null}

          {isOnline && pendingBookings && pendingBookings.length > 0 ? (
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Available Requests</h3>
                <span className="px-3 py-1 bg-secondary/20 text-secondary rounded-full text-sm font-medium">
                  {pendingBookings.length} new
                </span>
              </div>
              <Button
                onClick={() => navigate("/provider/requests")}
                className="w-full gradient-secondary text-white"
              >
                <Clock className="w-5 h-5 mr-2" />
                View Requests
              </Button>
            </Card>
          ) : (
            <Card className="p-8 text-center">
              <h3 className="text-xl font-semibold mb-2">
                {isOnline ? "No Active Requests" : "You're Offline"}
              </h3>
              <p className="text-muted-foreground">
                {isOnline
                  ? "New service requests will appear here"
                  : "Turn online to start receiving service requests"}
              </p>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
