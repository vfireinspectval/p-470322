
import React from "react";
import { LoginForm } from "./LoginForm";

export const EstablishmentLoginCard: React.FC = () => {
  return (
    <main className="flex justify-center pt-[159px]">
      <div className="w-[605px] h-[564px] border relative bg-neutral-100 rounded-[20px] border-solid border-[#524F4F] max-md:w-[90%] max-md:max-w-[605px] max-sm:h-auto max-sm:pt-5 max-sm:pb-10 max-sm:px-0">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/3498d51df3ff7e2a1f563eb8e42a91003b0e7ced"
          className="w-[88px] h-[131px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] absolute -translate-x-2/4 rounded-[20px] left-2/4 top-3.5 max-sm:w-[70px] max-sm:h-[104px]"
          alt="Establishment Logo"
        />
        <h2 className="text-[#F00] text-[40px] font-bold text-center mt-[116px] max-sm:text-[32px] max-sm:mt-[100px]">
          ESTABLISHMENT LOG IN
        </h2>
        <LoginForm />
      </div>
    </main>
  );
};
