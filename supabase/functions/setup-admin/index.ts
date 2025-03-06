
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Create a Supabase client with the Admin key
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase environment variables');
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Check if admin user already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('auth.users')
      .select('id')
      .eq('email', 'vfireinspectval@gmail.com')
      .maybeSingle();
      
    if (checkError) {
      console.error('Error checking existing user:', checkError);
    }
    
    // If admin user already exists, return success
    if (existingUser) {
      return new Response(
        JSON.stringify({ success: true, message: 'Admin user already exists' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Create admin user
    const { data, error } = await supabase.auth.admin.createUser({
      email: 'vfireinspectval@gmail.com',
      password: 'vfireinspect2025',
      email_confirm: true
    });
    
    if (error) {
      throw error;
    }
    
    console.log('Admin user created successfully:', data);
    
    return new Response(
      JSON.stringify({ success: true, message: 'Admin user created successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error setting up admin user:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: 'Failed to set up admin user', 
        error: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
})
