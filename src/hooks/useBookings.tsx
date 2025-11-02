import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export function useCustomerBookings() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["customer-bookings", user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from("bookings")
        .select(`
          *,
          service_categories(name, category),
          provider_profiles!bookings_provider_id_fkey(
            user_id,
            rating,
            profiles(full_name, phone_number)
          )
        `)
        .eq("customer_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}

export function useProviderBookings() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["provider-bookings", user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from("bookings")
        .select(`
          *,
          service_categories(name, category),
          profiles!bookings_customer_id_fkey(full_name, phone_number)
        `)
        .eq("provider_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}

export function usePendingBookings() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["pending-bookings", user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from("bookings")
        .select(`
          *,
          service_categories(name, category),
          profiles!bookings_customer_id_fkey(full_name, phone_number, address)
        `)
        .eq("status", "pending")
        .is("provider_id", null)
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;
      return data;
    },
    enabled: !!user,
    refetchInterval: 5000, // Poll every 5 seconds for new bookings
  });
}
