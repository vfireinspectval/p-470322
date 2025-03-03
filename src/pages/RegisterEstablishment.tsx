
import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface BusinessDetails {
  name: string;
  dti_number: string;
}

interface RegistrationFormData {
  first_name: string;
  middle_name: string;
  last_name: string;
  email: string;
  businesses: BusinessDetails[];
}

const RegisterEstablishment: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { 
    register, 
    control, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<RegistrationFormData>({
    defaultValues: {
      first_name: "",
      middle_name: "",
      last_name: "",
      email: "",
      businesses: [{ name: "", dti_number: "" }]
    }
  });
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: "businesses"
  });
  
  const onSubmit = async (data: RegistrationFormData) => {
    setIsSubmitting(true);
    
    try {
      // Check if email already exists in pending_registrations
      const { data: existingPending } = await supabase
        .from("pending_registrations")
        .select("email")
        .eq("email", data.email)
        .maybeSingle();
      
      if (existingPending) {
        toast({
          title: "Registration Failed",
          description: "This email is already pending approval.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
      
      // Check if email already exists in auth users
      // We cannot use admin API from client, so we'll check establishment_owners instead
      const { data: existingOwner } = await supabase
        .from("establishment_owners")
        .select("email")
        .eq("email", data.email)
        .maybeSingle();
        
      if (existingOwner) {
        toast({
          title: "Registration Failed",
          description: "This email is already registered.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
      
      // Insert into pending_registrations
      const { error } = await supabase
        .from("pending_registrations")
        .insert({
          first_name: data.first_name,
          middle_name: data.middle_name,
          last_name: data.last_name,
          email: data.email,
          businesses: data.businesses
        });
      
      if (error) {
        console.error("Registration error:", error);
        throw error;
      }
      
      toast({
        title: "Registration Submitted",
        description: "Your registration has been submitted for approval. You will be notified via email once it's approved.",
      });
      
      navigate("/");
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration Failed",
        description: "An error occurred while submitting your registration. Please try again.",
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

      <main className="container mx-auto py-10 px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-center mb-2">Register Your Establishment</h1>
          <p className="text-gray-600 text-center mb-8">
            Complete this form to register your establishment. An administrator will review your application.
          </p>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name*
                </label>
                <Input
                  id="first_name"
                  {...register("first_name", { required: "First name is required" })}
                  placeholder="First Name"
                />
                {errors.first_name && (
                  <p className="text-red-500 text-sm mt-1">{errors.first_name.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="middle_name" className="block text-sm font-medium text-gray-700 mb-1">
                  Middle Name
                </label>
                <Input
                  id="middle_name"
                  {...register("middle_name")}
                  placeholder="Middle Name (Optional)"
                />
              </div>
              
              <div>
                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name*
                </label>
                <Input
                  id="last_name"
                  {...register("last_name", { required: "Last name is required" })}
                  placeholder="Last Name"
                />
                {errors.last_name && (
                  <p className="text-red-500 text-sm mt-1">{errors.last_name.message}</p>
                )}
              </div>
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address*
              </label>
              <Input
                id="email"
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address"
                  }
                })}
                placeholder="Your Email Address"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Business Details*
                </label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ name: "", dti_number: "" })}
                  className="flex items-center text-[#FE623F]"
                >
                  <Plus size={16} className="mr-1" /> Add Business
                </Button>
              </div>
              
              {fields.map((field, index) => (
                <div key={field.id} className="p-4 border rounded-md mb-4 bg-gray-50">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium">Business #{index + 1}</h4>
                    {index > 0 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(index)}
                        className="text-red-500 h-8 w-8 p-0"
                      >
                        <X size={16} />
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Business Name*
                      </label>
                      <Input
                        {...register(`businesses.${index}.name` as const, {
                          required: "Business name is required"
                        })}
                        placeholder="Business Name"
                      />
                      {errors.businesses?.[index]?.name && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.businesses[index]?.name?.message}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        DTI Certificate No.*
                      </label>
                      <Input
                        {...register(`businesses.${index}.dti_number` as const, {
                          required: "DTI number is required"
                        })}
                        placeholder="DTI Certificate Number"
                      />
                      {errors.businesses?.[index]?.dti_number && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.businesses[index]?.dti_number?.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-6">
                By submitting this form, you confirm that all information provided is accurate. 
                After submission, an administrator will review your application. 
                Upon approval, you will receive a temporary password via email.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <Link to="/">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full sm:w-auto"
                  >
                    Back to Login
                  </Button>
                </Link>
                
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto bg-[#FE623F] hover:bg-[#e5563a]"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Submitting...
                    </span>
                  ) : (
                    "Submit Registration"
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default RegisterEstablishment;
