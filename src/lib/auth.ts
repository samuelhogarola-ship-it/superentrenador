"use client";

import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export async function signInWithGoogle(redirectPath = "/mi-perfil") {
  const supabase = getSupabaseBrowserClient();
  return supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectPath)}`,
    },
  });
}

export async function signUp(email: string, password: string) {
  const supabase = getSupabaseBrowserClient();
  return supabase.auth.signUp({ email, password });
}

export async function signIn(email: string, password: string) {
  const supabase = getSupabaseBrowserClient();
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signOut() {
  const supabase = getSupabaseBrowserClient();
  return supabase.auth.signOut();
}

export async function getSession() {
  const supabase = getSupabaseBrowserClient();
  const { data } = await supabase.auth.getSession();
  return data.session;
}

export interface TrainerProfileRow {
  slug: string;
  display_name: string;
  city_slug: string;
  headline: string;
  short_bio: string;
  long_bio: string;
  specialties: string[];
  modalities: string[];
  languages: string[];
  years_experience: number;
  price_from: number;
  hidden_contact_hint: string;
  contact_info: string;
  photo_url: string | null;
  review_status: string;
}

export async function getTrainerProfile(): Promise<TrainerProfileRow | null> {
  const supabase = getSupabaseBrowserClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase.rpc("get_own_trainer_profile");

  return (data?.[0] as TrainerProfileRow | undefined) ?? null;
}
