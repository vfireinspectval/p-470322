import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface LoginFormData {
  email: string;
  password: string;
}

export const LoginForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit } = useForm<LoginFormData>();

  const onSubmit = (data: LoginFormData) => {
    console.log("Form submitted:", data);
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
            {...register("email")}
            type="email"
            placeholder="Enter your E-mail"
            className="border-none bg-transparent pl-14 h-full text-xl font-bold placeholder:text-[#9B9B9B] focus-visible:ring-0"
          />
        </div>
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
            {...register("password")}
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
      </div>

      <div className="text-black text-base italic font-medium ml-[57px] mt-1.5">
        <a href="#" className="hover:text-[#FE623F] transition-colors">
          Forgot Password?
        </a>
      </div>

      <Button
        type="submit"
        className="w-40 h-[54px] text-white text-xl font-bold bg-[#FE623F] hover:bg-[#e5563a] mt-6 mb-0 mx-auto block rounded-[20px] max-sm:w-[140px] max-sm:h-12 max-sm:text-lg"
      >
        LOG IN
      </Button>
    </form>
  );
};
