
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

// Mock pending registrations
const mockPendingUsers = [
  {
    id: "p1",
    first_name: "John",
    middle_name: "A",
    last_name: "Doe",
    email: "john.doe@example.com",
    businesses: [
      { name: "JD Restaurant", dti_number: "DTI-12345" },
      { name: "JD Cafe", dti_number: "DTI-67890" }
    ],
    created_at: new Date().toISOString()
  },
  {
    id: "p2",
    first_name: "Jane",
    middle_name: "",
    last_name: "Smith",
    email: "jane.smith@example.com",
    businesses: [
      { name: "JS Boutique", dti_number: "DTI-54321" }
    ],
    created_at: new Date().toISOString()
  }
];

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [pendingUsers, setPendingUsers] = useState(mockPendingUsers);

  const handleApprove = (userId: string) => {
    // In a real app, this would create a user in Supabase, send an email, etc.
    setPendingUsers(prev => prev.filter(user => user.id !== userId));
    toast({
      title: "User Approved",
      description: "User has been approved and notification email sent",
    });
  };

  const handleReject = (userId: string) => {
    // In a real app, this would delete the pending registration
    setPendingUsers(prev => prev.filter(user => user.id !== userId));
    toast({
      title: "User Rejected",
      description: "Registration request has been rejected",
    });
  };

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
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="pending">Pending Registrations</TabsTrigger>
            <TabsTrigger value="approved">Approved Establishments</TabsTrigger>
            <TabsTrigger value="inspections">Inspections</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-6">
            <h2 className="text-2xl font-semibold mb-4">Pending Registrations</h2>
            
            {pendingUsers.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-gray-500">No pending registrations</p>
                </CardContent>
              </Card>
            ) : (
              pendingUsers.map((pendingUser) => (
                <Card key={pendingUser.id} className="shadow-sm">
                  <CardHeader>
                    <CardTitle>
                      {pendingUser.first_name} {pendingUser.middle_name && pendingUser.middle_name + " "}
                      {pendingUser.last_name}
                    </CardTitle>
                    <CardDescription>{pendingUser.email}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <h4 className="font-semibold mb-2">Businesses:</h4>
                      <ul className="space-y-2">
                        {pendingUser.businesses.map((business, index) => (
                          <li key={index} className="pl-4 border-l-2 border-[#FE623F]">
                            <span className="font-medium">{business.name}</span>
                            <span className="ml-2 text-sm text-gray-500">
                              DTI: {business.dti_number}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex justify-end space-x-3 mt-4">
                      <Button
                        variant="outline"
                        className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                        onClick={() => handleReject(pendingUser.id)}
                      >
                        Reject
                      </Button>
                      <Button
                        className="bg-[#FE623F] hover:bg-[#e5563a]"
                        onClick={() => handleApprove(pendingUser.id)}
                      >
                        Approve
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="approved">
            <h2 className="text-2xl font-semibold mb-4">Approved Establishments</h2>
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-gray-500">No approved establishments yet</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inspections">
            <h2 className="text-2xl font-semibold mb-4">Inspections</h2>
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-gray-500">No inspections data available</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
