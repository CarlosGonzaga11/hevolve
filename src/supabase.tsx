import { createClient } from "@supabase/supabase-js";

const supabaseURl = import.meta.env.VITE_API_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY


export const supabase = createClient(supabaseURl, supabaseKey);
