
import React from "react";
import { Header } from "@/components/auth/Header";
import { LoginCard } from "@/components/auth/LoginCard";

const Index = () => {
  return (
    <>
      <div className="w-full min-h-screen bg-white font-sans">
        <Header />
        <LoginCard />
      </div>
    </>
  );
};

export default Index;
