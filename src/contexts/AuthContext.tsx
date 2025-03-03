
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// User types
export interface User {
  id: string;
  email: string;
  role: "admin" | "establishment_owner";
  first_login?: boolean;
  password_changed?: boolean;
}

// Auth context type
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAdmin: () => boolean;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Check for authenticated session on load
  useEffect(() => {
    const checkSession = async () => {
      setLoading(true);
      
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Determine if user is admin or establishment owner
          const isAdmin = session.user.email === "vfireinspectval@gmail.com";
          
          let userWithRole: User = {
            id: session.user.id,
            email: session.user.email!,
            role: isAdmin ? "admin" : "establishment_owner",
          };
          
          // If not admin, fetch establishment owner data
          if (!isAdmin) {
            const { data: establishmentOwner } = await supabase
              .from("establishment_owners")
              .select("*")
              .eq("id", session.user.id)
              .single();
              
            if (establishmentOwner) {
              userWithRole.password_changed = establishmentOwner.password_changed;
            }
          }
          
          setUser(userWithRole);
        }
      } catch (error) {
        console.error("Session check error:", error);
      } finally {
        setLoading(false);
      }
    };
    
    checkSession();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        const isAdmin = session.user.email === "vfireinspectval@gmail.com";
        
        let userWithRole: User = {
          id: session.user.id,
          email: session.user.email!,
          role: isAdmin ? "admin" : "establishment_owner",
        };
        
        // If not admin, fetch establishment owner data
        if (!isAdmin) {
          const { data: establishmentOwner } = await supabase
            .from("establishment_owners")
            .select("*")
            .eq("id", session.user.id)
            .single();
            
          if (establishmentOwner) {
            userWithRole.password_changed = establishmentOwner.password_changed;
          }
        }
        
        setUser(userWithRole);
      } else if (event === "SIGNED_OUT") {
        setUser(null);
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive",
        });
        setLoading(false);
        return false;
      }
      
      // Check if user is admin or establishment owner
      const isAdmin = email === "vfireinspectval@gmail.com";
      
      if (isAdmin) {
        // If on establishment login page, redirect to admin login
        if (location.pathname === "/establishment-login") {
          navigate("/");
          toast({
            title: "Login Redirect",
            description: "Admin should use the admin login page.",
            variant: "destructive",
          });
          await supabase.auth.signOut();
          setLoading(false);
          return false;
        }
        navigate("/admin-dashboard");
      } else {
        // If on admin login page, redirect to establishment login
        if (location.pathname === "/") {
          navigate("/establishment-login");
          toast({
            title: "Login Redirect",
            description: "Establishments should use the establishment login page.",
            variant: "destructive",
          });
          await supabase.auth.signOut();
          setLoading(false);
          return false;
        }
        
        // Check if user needs to change password
        const { data: establishmentOwner } = await supabase
          .from("establishment_owners")
          .select("password_changed")
          .eq("id", data.user.id)
          .single();
          
        if (establishmentOwner && !establishmentOwner.password_changed) {
          navigate("/change-password");
        } else {
          navigate("/establishment-dashboard");
        }
      }
      
      setLoading(false);
      return true;
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: "An error occurred during login",
        variant: "destructive",
      });
      setLoading(false);
      return false;
    }
  };

  // Logout function
  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    
    // Redirect based on role
    if (user?.role === "admin") {
      navigate("/");
    } else {
      navigate("/establishment-login");
    }
  };

  // Helper to check if user is admin
  const isAdmin = () => {
    return user?.role === "admin";
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
