import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export function ProviderNotifications() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    // Subscribe to new booking insertions
    const channel = supabase
      .channel("new-bookings")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "bookings",
          filter: `status=eq.pending`,
        },
        (payload) => {
          // Show notification to provider
          toast.info("New booking request available!", {
            action: {
              label: "View",
              onClick: () => navigate("/provider/requests"),
            },
            duration: 10000,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, navigate]);

  return null;
}
