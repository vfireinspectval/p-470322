// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://pgmwucdvenmbikxkjujv.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnbXd1Y2R2ZW5tYmlreGtqdWp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA5NzM0MzIsImV4cCI6MjA1NjU0OTQzMn0.LdZIGo9yu30j3ePZVTrRYNdpzSyA8-lfYTeaCs_UBKU";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);