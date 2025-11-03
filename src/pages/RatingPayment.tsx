import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

export default function RatingPayment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [review, setReview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: booking } = useQuery({
    queryKey: ["booking", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select(`
          *,
          service_categories(name)
        `)
        .eq("id", id)
        .single();

      if (error) throw error;

      // Get provider info separately
      if (data.provider_id) {
        const { data: providerData } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", data.provider_id)
          .single();

        return { ...data, provider_name: providerData?.full_name };
      }

      return data;
    },
  });

  const handleSubmitRating = async () => {
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("ratings").insert({
        booking_id: id,
        rated_by: user?.id,
        rated_user: booking?.provider_id,
        rating,
        review: review.trim() || null,
      });

      if (error) throw error;

      toast.success("Thank you for your feedback!");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Failed to submit rating");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <header className="bg-card border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold">Service Complete</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-8 space-y-6">
        {/* Service Summary */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Service Summary</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Service</span>
              <span className="font-medium">{booking?.service_categories?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Provider</span>
              <span className="font-medium">{(booking as any)?.provider_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Distance</span>
              <span className="font-medium">{booking?.distance_km} km</span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>Total Amount</span>
              <span className="text-secondary">${booking?.final_price || booking?.estimated_price}</span>
            </div>
          </div>
        </Card>

        {/* Rating Section */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Rate Your Experience</h2>
          
          <div className="space-y-4">
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-12 h-12 ${
                      star <= (hoveredRating || rating)
                        ? "fill-accent text-accent"
                        : "text-muted-foreground"
                    }`}
                  />
                </button>
              ))}
            </div>

            <Textarea
              placeholder="Share your experience (optional)"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>
        </Card>

        {/* Payment Section */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Payment</h2>
          <p className="text-muted-foreground mb-4">
            Payment was processed successfully
          </p>
          <Button variant="outline" className="w-full">
            <Download className="w-4 h-4 mr-2" />
            Download Receipt
          </Button>
        </Card>

        {/* Actions */}
        <div className="space-y-3">
          <Button
            onClick={handleSubmitRating}
            disabled={isSubmitting || rating === 0}
            className="w-full gradient-primary text-white"
          >
            {isSubmitting ? "Submitting..." : "Submit Rating & Continue"}
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/dashboard")}
            className="w-full"
          >
            Skip & Go to Dashboard
          </Button>
        </div>
      </main>
    </div>
  );
}
