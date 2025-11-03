import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, DollarSign, TrendingUp, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useProviderBookings } from "@/hooks/useBookings";
import { useMemo } from "react";
import { format, startOfWeek, startOfMonth, isWithinInterval } from "date-fns";

export default function ProviderEarnings() {
  const navigate = useNavigate();
  const { data: bookings, isLoading } = useProviderBookings();

  const earnings = useMemo(() => {
    if (!bookings) return { daily: 0, weekly: 0, monthly: 0, total: 0 };

    const now = new Date();
    const weekStart = startOfWeek(now);
    const monthStart = startOfMonth(now);
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    let daily = 0;
    let weekly = 0;
    let monthly = 0;
    let total = 0;

    bookings.forEach((booking: any) => {
      if (booking.status === "completed" && booking.final_price) {
        const amount = parseFloat(booking.final_price);
        total += amount;

        const bookingDate = new Date(booking.completed_at || booking.created_at);

        if (bookingDate >= todayStart) {
          daily += amount;
        }
        if (isWithinInterval(bookingDate, { start: weekStart, end: now })) {
          weekly += amount;
        }
        if (isWithinInterval(bookingDate, { start: monthStart, end: now })) {
          monthly += amount;
        }
      }
    });

    return { daily, weekly, monthly, total };
  }, [bookings]);

  const completedBookings = useMemo(() => {
    if (!bookings) return [];
    return bookings.filter((b: any) => b.status === "completed");
  }, [bookings]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary/10 via-background to-primary/10">
      <header className="bg-card border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/provider/dashboard")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold">Earnings</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Earnings Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-6">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">Today</span>
            </div>
            <div className="flex items-center gap-1 text-2xl font-bold text-secondary">
              <DollarSign className="w-6 h-6" />
              {earnings.daily.toFixed(2)}
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm">This Week</span>
            </div>
            <div className="flex items-center gap-1 text-2xl font-bold text-secondary">
              <DollarSign className="w-6 h-6" />
              {earnings.weekly.toFixed(2)}
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">This Month</span>
            </div>
            <div className="flex items-center gap-1 text-2xl font-bold text-secondary">
              <DollarSign className="w-6 h-6" />
              {earnings.monthly.toFixed(2)}
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm">Total Earned</span>
            </div>
            <div className="flex items-center gap-1 text-2xl font-bold text-primary">
              <DollarSign className="w-6 h-6" />
              {earnings.total.toFixed(2)}
            </div>
          </Card>
        </div>

        {/* Withdrawal Section */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Available Balance</h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-3xl font-bold text-secondary">
              <DollarSign className="w-8 h-8" />
              {earnings.total.toFixed(2)}
            </div>
            <Button className="gradient-primary text-white">
              Withdraw Funds
            </Button>
          </div>
        </Card>

        {/* Transaction History */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : completedBookings.length > 0 ? (
            <div className="space-y-3">
              {completedBookings.map((booking: any) => (
                <div key={booking.id} className="flex items-center justify-between py-3 border-b last:border-0">
                  <div>
                    <p className="font-medium">{booking.service_categories?.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(booking.completed_at || booking.created_at), "MMM dd, yyyy • hh:mm a")}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-lg font-bold text-secondary">
                    <DollarSign className="w-5 h-5" />
                    {booking.final_price}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No completed bookings yet
            </p>
          )}
        </Card>
      </main>
    </div>
  );
}
