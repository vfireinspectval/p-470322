import React from "react";
import { Header } from "@/components/auth/Header";
import { LoginCard } from "@/components/auth/LoginCard";

const Index = () => {
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <div className="w-full min-h-screen bg-white">
        <Header />
        <LoginCard />
      </div>
    </>
  );
};

export default Index;
