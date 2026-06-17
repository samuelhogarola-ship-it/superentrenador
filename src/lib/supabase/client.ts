import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

let browserClient: ReturnType<typeof createClient<Database>> | null = null;

function getSupabaseUrl() {
  return process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
}

function getSupabaseAnonKey() {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
}

export function hasSupabaseEnv() {
  return Boolean(getSupabaseUrl() && getSupabaseAnonKey());
}

export function getSupabaseBrowserClient() {
  if (!hasSupabaseEnv()) {
    throw new Error("Faltan NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY.");
  }

  if (!browserClient) {
    browserClient = createClient<Database>(getSupabaseUrl(), getSupabaseAnonKey());
  }

  return browserClient;
}
