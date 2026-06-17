import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

export function getSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error("Faltan variables públicas de Supabase para el cliente de servidor.");
  }

  return createClient<Database>(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
