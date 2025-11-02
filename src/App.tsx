import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider, useAuth } from "@/hooks/useAuth";

import Welcome from "@/pages/Welcome";
import Login from "@/pages/Login";
import VerifyOTP from "@/pages/VerifyOTP";
import UserTypeSelection from "@/pages/UserTypeSelection";
import ProfileSetup from "@/pages/ProfileSetup";
import Dashboard from "@/pages/Dashboard";
import ProviderDashboard from "@/pages/ProviderDashboard";
import ProviderRequests from "@/pages/ProviderRequests";
import ProviderActiveService from "@/pages/ProviderActiveService";
import ServiceSelection from "@/pages/ServiceSelection";
import BookingLocation from "@/pages/BookingLocation";
import BookingDetails from "@/pages/BookingDetails";
import ActiveService from "@/pages/ActiveService";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Welcome />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/verify-otp" element={<VerifyOTP />} />
      <Route
        path="/user-type"
        element={
          <ProtectedRoute>
            <UserTypeSelection />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile-setup"
        element={
          <ProtectedRoute>
            <ProfileSetup />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/provider/dashboard"
        element={
          <ProtectedRoute>
            <ProviderDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/provider/requests"
        element={
          <ProtectedRoute>
            <ProviderRequests />
          </ProtectedRoute>
        }
      />
      <Route
        path="/provider/service/:id"
        element={
          <ProtectedRoute>
            <ProviderActiveService />
          </ProtectedRoute>
        }
      />
      <Route
        path="/service/:category"
        element={
          <ProtectedRoute>
            <ServiceSelection />
          </ProtectedRoute>
        }
      />
      <Route
        path="/book/:service/location"
        element={
          <ProtectedRoute>
            <BookingLocation />
          </ProtectedRoute>
        }
      />
      <Route
        path="/book/:service/details"
        element={
          <ProtectedRoute>
            <BookingDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/service/:id/active"
        element={
          <ProtectedRoute>
            <ActiveService />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
          <Toaster />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
