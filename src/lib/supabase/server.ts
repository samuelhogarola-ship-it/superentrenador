import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "@/lib/supabase/database.types";

function getEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) throw new Error("Faltan variables públicas de Supabase.");
  return { url, anonKey };
}

/** Anon client for ISR/public repository queries — no cookie session. */
export function getSupabaseServerClient() {
  const { url, anonKey } = getEnv();
  return createClient<Database>(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/**
 * Cookie-aware server client for Route Handlers and Server Actions that need
 * to read or write the user session (auth callback, middleware helper).
 * Must only be called from a context where `next/headers` cookies are available.
 */
export async function getSupabaseSessionServerClient() {
  const { url, anonKey } = getEnv();
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();

  return createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          cookieStore.set(name, value, options)
        );
      },
    },
  });
}
