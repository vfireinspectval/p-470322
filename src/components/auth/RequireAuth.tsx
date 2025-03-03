
import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth, User } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface RequireAuthProps {
  children: React.ReactNode;
  requireRole?: "admin" | "establishment_owner";
}

const RequireAuth: React.FC<RequireAuthProps> = ({ children, requireRole }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Fetch the establishment owner data to check password_changed status
  useEffect(() => {
    const checkPasswordChanged = async () => {
      if (user && user.role === "establishment_owner") {
        const { data } = await supabase
          .from("establishment_owners")
          .select("password_changed")
          .eq("id", user.id)
          .single();
          
        if (data && !data.password_changed && location.pathname !== "/change-password") {
          window.location.href = "/change-password";
        }
      }
    };
    
    if (!loading && user) {
      checkPasswordChanged();
    }
  }, [user, loading, location.pathname]);

  // Check if user is authenticated and has the required role
  const isAuthorized = (): boolean => {
    if (!user) return false;
    if (!requireRole) return true;
    return user.role === requireRole;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-[#FE623F]" />
      </div>
    );
  }

  if (!user) {
    // Redirect based on the required role
    if (requireRole === "admin") {
      return <Navigate to="/" state={{ from: location }} replace />;
    } else {
      return <Navigate to="/establishment-login" state={{ from: location }} replace />;
    }
  }

  if (!isAuthorized()) {
    // Redirect to appropriate dashboard based on role
    const redirectPath = user.role === "admin" 
      ? "/admin-dashboard" 
      : "/establishment-dashboard";
    
    return <Navigate to={redirectPath} replace />;
  }

  // If user is an establishment owner and hasn't changed their password on first login
  if (user.role === "establishment_owner" && !user.password_changed && location.pathname !== "/change-password") {
    return <Navigate to="/change-password" replace />;
  }

  return <>{children}</>;
};

export default RequireAuth;
