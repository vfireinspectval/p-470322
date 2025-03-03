
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Eye, EyeOff } from "lucide-react";

interface ChangePasswordFormData {
  newPassword: string;
  confirmPassword: string;
}

const ChangePassword: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm<ChangePasswordFormData>();
  
  const onSubmit = async (data: ChangePasswordFormData) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would update the password in Supabase
      // and set the password_changed flag to true
      
      toast({
        title: "Password Updated",
        description: "Your password has been successfully updated!",
      });
      
      // In a real app, we would update the user state
      // For now, we'll just redirect to the dashboard
      navigate(user?.role === "admin" ? "/admin-dashboard" : "/establishment-dashboard");
    } catch (error) {
      console.error("Change password error:", error);
      toast({
        title: "Error",
        description: "Failed to update password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="w-full h-[116px] flex items-center bg-white px-[41px] py-0 border-2 border-solid border-black max-sm:h-20 max-sm:px-5 max-sm:py-0">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/692531a09f3d8f46fa6184a126a551c58ac31298"
          className="w-[65px] h-[86px] max-sm:w-[45px] max-sm:h-[60px]"
          alt="V-Fire Logo"
        />
        <div className="ml-[21px]">
          <h1 className="text-[#F00] text-4xl font-bold max-sm:text-[28px]">
            V-FIRE
          </h1>
          <div className="text-black text-xl font-bold -mt-1.5 max-sm:text-base">
            INSPECT
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="text-2xl font-bold text-center mb-6">Change Your Password</h1>
            <p className="text-gray-600 mb-6 text-center">
              Please create a new password for your account. You must change your password before continuing.
            </p>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    className="pr-10"
                    {...register("newPassword", {
                      required: "New password is required",
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters long"
                      },
                      pattern: {
                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                        message: "Password must include uppercase, lowercase, number and special character"
                      }
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.newPassword.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    className="pr-10"
                    {...register("confirmPassword", {
                      required: "Please confirm your password",
                      validate: value => 
                        value === watch("newPassword") || "Passwords do not match"
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
                )}
              </div>
              
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#FE623F] hover:bg-[#e5563a] h-12 text-lg"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Updating...
                  </span>
                ) : (
                  "Update Password"
                )}
              </Button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChangePassword;
