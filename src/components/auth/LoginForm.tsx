
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface LoginFormData {
  email: string;
  password: string;
}

export const LoginForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();
  const { login, loading } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    try {
      const success = await login(data.email, data.password);
      if (!success) {
        toast({
          title: "Login Failed",
          description: "Please check your credentials and try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <div className="mb-6">
        <label className="text-black text-xl font-bold block ml-14 mb-1.5 max-sm:text-lg max-sm:ml-[5%]">
          E-mail:
        </label>
        <div className="w-[498px] h-16 flex items-center relative bg-[#E2E2E2] mx-auto rounded-[20px] max-md:w-[90%] max-sm:h-14">
          <div className="absolute left-4">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/bb75a0c80c993a6a1a4e3dcea8cac3d773f93c92"
              alt="Email Icon"
              className="w-8 h-8"
            />
          </div>
          <Input
            {...register("email", { 
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              }
            })}
            type="email"
            placeholder="Enter your E-mail"
            className="border-none bg-transparent pl-14 h-full text-xl font-bold placeholder:text-[#9B9B9B] focus-visible:ring-0"
          />
        </div>
        {errors.email && (
          <p className="text-red-500 text-sm mt-1 ml-14 max-sm:ml-[5%]">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="mb-6">
        <label className="text-black text-xl font-bold block ml-14 mb-1.5 max-sm:text-lg max-sm:ml-[5%]">
          Password:
        </label>
        <div className="w-[498px] h-16 flex items-center relative bg-[#E2E2E2] mx-auto rounded-[20px] max-md:w-[90%] max-sm:h-14">
          <div className="absolute left-4">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/64da3df5875be6a0f4c466434f8f11592a3e6b65"
              alt="Password Icon"
              className="w-8 h-8"
            />
          </div>
          <Input
            {...register("password", { required: "Password is required" })}
            type={showPassword ? "text" : "password"}
            placeholder="Enter your Password"
            className="border-none bg-transparent pl-14 h-full text-xl font-bold placeholder:text-[#9B9B9B] focus-visible:ring-0"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4"
          >
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/53101a4b8d9e90343971771b8ed800546628408a"
              alt="Show Password"
              className="w-[30px] h-[30px] opacity-50"
            />
          </button>
        </div>
        {errors.password && (
          <p className="text-red-500 text-sm mt-1 ml-14 max-sm:ml-[5%]">
            {errors.password.message}
          </p>
        )}
      </div>

      <div className="text-black text-base italic font-medium ml-[57px] mt-1.5">
        <a href="#" className="hover:text-[#FE623F] transition-colors">
          Forgot Password?
        </a>
      </div>

      <div className="flex justify-between items-center px-14 mt-6 max-sm:px-[5%]">
        <a 
          href="/register" 
          className="text-[#FE623F] hover:text-[#e5563a] transition-colors text-base font-medium"
        >
          Register Establishment
        </a>
        
        <Button
          type="submit"
          disabled={isSubmitting || loading}
          className="w-40 h-[54px] text-white text-xl font-bold bg-[#FE623F] hover:bg-[#e5563a] mx-auto block rounded-[20px] max-sm:w-[140px] max-sm:h-12 max-sm:text-lg"
        >
          {isSubmitting || loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading...
            </span>
          ) : (
            "LOG IN"
          )}
        </Button>
      </div>
    </form>
  );
};
