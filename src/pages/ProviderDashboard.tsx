import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/useAuth";
import { LogOut, User, DollarSign, TrendingUp } from "lucide-react";

export default function ProviderDashboard() {
  const [isOnline, setIsOnline] = useState(false);
  const { signOut } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary/10 via-background to-primary/10">
      <header className="bg-card border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold gradient-secondary bg-clip-text text-transparent">
            Deli-Ride Provider
          </h1>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <User className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={signOut}>
              <LogOut className="w-5 h-5" />
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
                  <p className="text-2xl font-bold">$0.00</p>
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
                  <p className="text-2xl font-bold">0</p>
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
                  <p className="text-2xl font-bold">0.00</p>
                </div>
              </div>
            </Card>
          </div>

          <Card className="p-8 text-center">
            <h3 className="text-xl font-semibold mb-2">No Active Requests</h3>
            <p className="text-muted-foreground">
              Turn online to start receiving service requests
            </p>
          </Card>
        </div>
      </main>
    </div>
  );
}
