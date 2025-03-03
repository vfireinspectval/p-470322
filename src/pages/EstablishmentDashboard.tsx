
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const EstablishmentDashboard: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="w-full h-[116px] flex justify-between items-center bg-white px-[41px] py-0 border-2 border-solid border-black max-sm:h-20 max-sm:px-5 max-sm:py-0">
        <div className="flex items-center">
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
        </div>
        
        <div className="flex items-center gap-4">
          <span className="text-black font-medium">
            Welcome, {user?.email}
          </span>
          <Button 
            variant="outline" 
            className="text-[#FE623F] border-[#FE623F] hover:bg-[#FE623F] hover:text-white"
            onClick={logout}
          >
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-8">Establishment Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="shadow-sm">
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-2">Your Establishments</h3>
              <p className="text-gray-500 mb-4">View and manage your registered establishments</p>
              <Button className="w-full bg-[#FE623F] hover:bg-[#e5563a]">
                View Establishments
              </Button>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm">
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-2">Inspection Reports</h3>
              <p className="text-gray-500 mb-4">View your latest inspection reports and status</p>
              <Button className="w-full bg-[#FE623F] hover:bg-[#e5563a]">
                View Reports
              </Button>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm">
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-2">Account Settings</h3>
              <p className="text-gray-500 mb-4">Update your account information and preferences</p>
              <Button className="w-full bg-[#FE623F] hover:bg-[#e5563a]">
                Update Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default EstablishmentDashboard;
