
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

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

// Mock users - This would be replaced with Supabase in a real implementation
const mockUsers: User[] = [
  {
    id: "1",
    email: "vfireinspectval@gmail.com",
    role: "admin",
    password_changed: true,
  },
  {
    id: "2", 
    email: "owner@example.com",
    role: "establishment_owner",
    password_changed: false,
    first_login: true,
  }
];

// Password map - In a real app, you'd use hashed passwords in Supabase
const passwords: Record<string, string> = {
  "vfireinspectval@gmail.com": "vfireinspectval2025",
  "owner@example.com": "temp123",
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check if there's a logged-in user in session storage
  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const foundUser = mockUsers.find(u => u.email === email);
      
      if (!foundUser || passwords[email] !== password) {
        toast({
          title: "Login failed",
          description: "Invalid email or password",
          variant: "destructive",
        });
        setLoading(false);
        return false;
      }
      
      // Successful login
      setUser(foundUser);
      sessionStorage.setItem("user", JSON.stringify(foundUser));
      
      // Check if user needs to change password
      if (foundUser.role === "establishment_owner" && !foundUser.password_changed) {
        navigate("/change-password");
      } else if (foundUser.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/establishment-dashboard");
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
  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("user");
    navigate("/");
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
