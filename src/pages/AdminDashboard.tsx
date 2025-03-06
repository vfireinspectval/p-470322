import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface PendingUser {
  id: string;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  email: string;
  contact_number: string;
  password: string;
  businesses: Array<{ name: string; dti_number: string }>;
  created_at: string;
}

interface ApprovedUser {
  id: string;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  email: string;
  contact_number: string;
  businesses: Array<{ name: string; dti_number: string }>;
  password_changed: boolean;
  created_at: string;
}

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [approvedUsers, setApprovedUsers] = useState<ApprovedUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [isSetupComplete, setIsSetupComplete] = useState(false);

  useEffect(() => {
    const setupAdmin = async () => {
      try {
        const response = await supabase.functions.invoke('setup-admin');
        console.log('Setup admin response:', response);
        if (response.data.success) {
          setIsSetupComplete(true);
        }
      } catch (error) {
        console.error('Error setting up admin:', error);
      }
    };

    setupAdmin();

    const fetchPendingUsers = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("pending_registrations")
          .select("*")
          .order("created_at", { ascending: false });
        
        if (error) throw error;
        setPendingUsers(data as PendingUser[]);
        
        const { data: approvedData, error: approvedError } = await supabase
          .from("establishment_owners")
          .select("*")
          .order("created_at", { ascending: false });
          
        if (approvedError) throw approvedError;
        setApprovedUsers(approvedData as ApprovedUser[]);
        
      } catch (error) {
        console.error("Error fetching pending users:", error);
        toast({
          title: "Error",
          description: "Failed to load pending registrations",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPendingUsers();
    
    const pendingSubscription = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'pending_registrations'
        },
        () => {
          fetchPendingUsers();
        }
      )
      .subscribe();
      
    const ownersSubscription = supabase
      .channel('owners-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'establishment_owners'
        },
        () => {
          fetchPendingUsers();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(pendingSubscription);
      supabase.removeChannel(ownersSubscription);
    };
  }, [toast]);

  const handleApprove = async (pendingUser: PendingUser) => {
    setIsProcessing(pendingUser.id);
    try {
      console.log("Approving user:", pendingUser);
      
      const { data: userData, error: userError } = await supabase.auth.admin.createUser({
        email: pendingUser.email,
        password: pendingUser.password,
        email_confirm: true
      });
      
      if (userError) {
        console.error("Error creating user:", userError);
        throw userError;
      }
      
      console.log("User created in Auth:", userData);
      
      const { error: ownerError } = await supabase
        .from("establishment_owners")
        .insert({
          id: userData.user.id,
          first_name: pendingUser.first_name,
          middle_name: pendingUser.middle_name,
          last_name: pendingUser.last_name,
          email: pendingUser.email,
          contact_number: pendingUser.contact_number,
          businesses: pendingUser.businesses,
          password_changed: false
        });
      
      if (ownerError) {
        console.error("Error adding to establishment_owners:", ownerError);
        throw ownerError;
      }
      
      const { error: deleteError } = await supabase
        .from("pending_registrations")
        .delete()
        .eq("id", pendingUser.id);
      
      if (deleteError) {
        console.error("Error deleting from pending_registrations:", deleteError);
        throw deleteError;
      }
      
      toast({
        title: "User Approved",
        description: `${pendingUser.first_name} ${pendingUser.last_name} has been approved and can now login`,
      });
      
    } catch (error) {
      console.error("Error approving user:", error);
      toast({
        title: "Approval Failed",
        description: error.message || "Failed to approve user",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(null);
    }
  };

  const handleReject = async (userId: string) => {
    setIsProcessing(userId);
    try {
      const { error } = await supabase
        .from("pending_registrations")
        .delete()
        .eq("id", userId);
      
      if (error) throw error;
      
      toast({
        title: "User Rejected",
        description: "Registration request has been rejected",
      });
      
    } catch (error) {
      console.error("Error rejecting user:", error);
      toast({
        title: "Rejection Failed",
        description: "Failed to reject user",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(null);
    }
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
            
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-[#FE623F]" />
              </div>
            ) : pendingUsers.length === 0 ? (
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
                    <CardDescription>
                      Email: {pendingUser.email} | Contact: {pendingUser.contact_number}
                    </CardDescription>
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
                        disabled={isProcessing === pendingUser.id}
                      >
                        {isProcessing === pendingUser.id ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : null}
                        Reject
                      </Button>
                      <Button
                        className="bg-[#FE623F] hover:bg-[#e5563a]"
                        onClick={() => handleApprove(pendingUser)}
                        disabled={isProcessing === pendingUser.id}
                      >
                        {isProcessing === pendingUser.id ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : null}
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
            
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-[#FE623F]" />
              </div>
            ) : approvedUsers.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-gray-500">No approved establishments yet</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {approvedUsers.map((owner) => (
                  <Card key={owner.id} className="shadow-sm">
                    <CardHeader>
                      <CardTitle>
                        {owner.first_name} {owner.middle_name && owner.middle_name + " "}
                        {owner.last_name}
                      </CardTitle>
                      <CardDescription>
                        Email: {owner.email} | Contact: {owner.contact_number}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <h4 className="font-semibold mb-2">Businesses:</h4>
                        <ul className="space-y-2">
                          {owner.businesses.map((business, index) => (
                            <li key={index} className="pl-4 border-l-2 border-[#FE623F]">
                              <span className="font-medium">{business.name}</span>
                              <span className="ml-2 text-sm text-gray-500">
                                DTI: {business.dti_number}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="mt-2 text-sm text-gray-500">
                        <span className="font-medium mr-2">Password Status:</span>
                        <span className={owner.password_changed ? "text-green-500" : "text-orange-500"}>
                          {owner.password_changed ? "Password Changed" : "Default Password"}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
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
