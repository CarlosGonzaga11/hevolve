import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://yfovgsudfqweqjvlgvjf.supabase.co";
const supabaseKey = "sb_publishable_UvzrsaVBMrMvAI8hHq8rrw_9pUkWPSb";

export const supabase = createClient(supabaseUrl, supabaseKey);
