import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Calendar, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCustomerBookings } from "@/hooks/useBookings";
import { format } from "date-fns";

export default function ServiceHistory() {
  const navigate = useNavigate();
  const { data: bookings, isLoading } = useCustomerBookings();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-secondary/10 text-secondary";
      case "in_progress":
        return "bg-primary/10 text-primary";
      case "cancelled":
        return "bg-destructive/10 text-destructive";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const filterByStatus = (status?: string) => {
    if (!bookings) return [];
    if (!status) return bookings;
    return bookings.filter((b: any) => b.status === status);
  };

  const BookingCard = ({ booking }: { booking: any }) => (
    <Card className="p-6 hover:shadow-md transition-shadow">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-1">
              {booking.service_categories?.name}
            </h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              {format(new Date(booking.created_at), "MMM dd, yyyy • hh:mm a")}
            </div>
          </div>
          <Badge className={getStatusColor(booking.status)}>
            {booking.status.replace("_", " ")}
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-primary mt-1" />
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Pickup</p>
              <p className="font-medium">{booking.pickup_address}</p>
            </div>
          </div>

          {booking.dropoff_address && (
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-secondary mt-1" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Drop-off</p>
                <p className="font-medium">{booking.dropoff_address}</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-1 text-lg font-bold text-secondary">
            <DollarSign className="w-5 h-5" />
            {booking.final_price || booking.estimated_price}
          </div>
          {booking.provider_profiles?.profiles?.full_name && (
            <p className="text-sm text-muted-foreground">
              Provider: {booking.provider_profiles.profiles.full_name}
            </p>
          )}
        </div>

        {booking.status === "completed" && (
          <Button variant="outline" className="w-full">
            Book Again
          </Button>
        )}
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary/10 via-background to-primary/10">
      <header className="bg-card border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold">Service History</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="in_progress">In Progress</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : filterByStatus().length > 0 ? (
              filterByStatus().map((booking: any) => (
                <BookingCard key={booking.id} booking={booking} />
              ))
            ) : (
              <Card className="p-12 text-center">
                <h3 className="text-xl font-semibold mb-2">No Bookings Yet</h3>
                <p className="text-muted-foreground mb-6">
                  Start by booking your first service
                </p>
                <Button onClick={() => navigate("/dashboard")}>
                  Browse Services
                </Button>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {filterByStatus("completed").length > 0 ? (
              filterByStatus("completed").map((booking: any) => (
                <BookingCard key={booking.id} booking={booking} />
              ))
            ) : (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground">No completed bookings</p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="in_progress" className="space-y-4">
            {filterByStatus("in_progress").length > 0 ? (
              filterByStatus("in_progress").map((booking: any) => (
                <BookingCard key={booking.id} booking={booking} />
              ))
            ) : (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground">No active bookings</p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="cancelled" className="space-y-4">
            {filterByStatus("cancelled").length > 0 ? (
              filterByStatus("cancelled").map((booking: any) => (
                <BookingCard key={booking.id} booking={booking} />
              ))
            ) : (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground">No cancelled bookings</p>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
