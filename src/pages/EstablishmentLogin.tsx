
import React from "react";
import { Header } from "@/components/auth/Header";
import { EstablishmentLoginCard } from "@/components/auth/EstablishmentLoginCard";

const EstablishmentLogin = () => {
  return (
    <>
      <div className="w-full min-h-screen bg-white font-sans">
        <Header />
        <EstablishmentLoginCard />
      </div>
    </>
  );
};

export default EstablishmentLogin;
