import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
    import.meta.env.VITE_URL_SUPABASE,
    import.meta.env.VITE_API_KEY_SUPABASE
  );