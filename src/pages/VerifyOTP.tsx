import { useState } from "react";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

export default function VerifyOTP() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const phoneNumber = location.state?.phoneNumber || "";

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone: phoneNumber,
        token: otp,
        type: 'sms',
      });

      if (error) throw error;

      // Check if user has a role already
      const { data: roles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', data.user?.id);

      if (roles && roles.length > 0) {
        // User has roles, redirect to appropriate dashboard
        const hasCustomerRole = roles.some(r => r.role === 'customer');
        const hasProviderRole = roles.some(r => r.role === 'service_provider');
        
        if (hasProviderRole) {
          navigate('/provider/dashboard');
        } else if (hasCustomerRole) {
          navigate('/dashboard');
        }
      } else {
        // New user, redirect to user type selection
        navigate('/user-type');
      }

      toast.success("Verification successful!");
    } catch (error: any) {
      toast.error(error.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex flex-col">
      <div className="p-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/login')}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">Enter OTP</h1>
            <p className="text-muted-foreground">
              We sent a code to {phoneNumber}
            </p>
          </div>

          <div className="flex flex-col items-center space-y-6">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={setOtp}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>

            <Button
              onClick={handleVerifyOTP}
              className="w-full gradient-primary text-white font-semibold py-6"
              disabled={loading || otp.length !== 6}
            >
              {loading ? "Verifying..." : "Verify"}
            </Button>

            <button
              onClick={() => navigate('/login')}
              className="text-sm text-primary font-semibold hover:underline"
            >
              Resend OTP
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
