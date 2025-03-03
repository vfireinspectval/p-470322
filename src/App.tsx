
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./contexts/AuthContext";
import AdminDashboard from "./pages/AdminDashboard";
import EstablishmentDashboard from "./pages/EstablishmentDashboard";
import ChangePassword from "./pages/ChangePassword";
import RegisterEstablishment from "./pages/RegisterEstablishment";
import RequireAuth from "./components/auth/RequireAuth";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/register" element={<RegisterEstablishment />} />
            <Route path="/change-password" element={<ChangePassword />} />
            
            {/* Protected Routes */}
            <Route path="/admin-dashboard" element={
              <RequireAuth requireRole="admin">
                <AdminDashboard />
              </RequireAuth>
            } />
            
            <Route path="/establishment-dashboard" element={
              <RequireAuth requireRole="establishment_owner">
                <EstablishmentDashboard />
              </RequireAuth>
            } />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
