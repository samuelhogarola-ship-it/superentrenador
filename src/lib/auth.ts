"use client";

import { useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export type AuthIntent = "client" | "trainer";

export interface CurrentUser {
  id: string;
  name: string;
  email: string | null;
}

function toCurrentUser(user: { id: string; email?: string | null; user_metadata?: Record<string, unknown> } | null | undefined): CurrentUser | null {
  if (!user) return null;
  return {
    id: user.id,
    name: (user.user_metadata?.full_name as string | undefined) ?? user.email ?? "Usuario",
    email: user.email ?? null,
  };
}

/** Tracks the logged-in user client-side so shared UI (header, nav) can react to auth state. */
export function useCurrentUser() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    supabase.auth.getUser().then(({ data }) => {
      setUser(toCurrentUser(data.user));
      setChecked(true);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(toCurrentUser(session?.user));
      setChecked(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { user, checked };
}

function getAuthCallbackUrl(redirectPath: string) {
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin;
  return `${origin}/auth/callback?next=${encodeURIComponent(redirectPath)}`;
}

export function getAuthErrorMessage(message: string) {
  const normalized = message.toLowerCase();

  if (normalized.includes("email rate limit")) {
    return "Hemos alcanzado el límite temporal de emails de acceso. Inténtalo de nuevo en unos minutos.";
  }
  if (normalized.includes("signups not allowed")) {
    return "No existe una cuenta con ese email. Crea una cuenta gratis primero.";
  }
  if (message === "Invalid login credentials") {
    return "Email o contraseña incorrectos.";
  }

  return message;
}

export async function signInWithGoogle(redirectPath = "/dashboard") {
  const supabase = getSupabaseBrowserClient();
  return supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: getAuthCallbackUrl(redirectPath),
    },
  });
}

export async function signInWithMagicLink(email: string, redirectPath = "/dashboard", captchaToken?: string) {
  const supabase = getSupabaseBrowserClient();
  return supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: getAuthCallbackUrl(redirectPath),
      shouldCreateUser: false,
      captchaToken,
    },
  });
}

export async function signUpWithMagicLink(
  email: string,
  redirectPath = "/dashboard",
  intent: AuthIntent = "client",
  captchaToken?: string,
) {
  const supabase = getSupabaseBrowserClient();
  return supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: getAuthCallbackUrl(redirectPath),
      shouldCreateUser: true,
      captchaToken,
      data: {
        intent,
      },
    },
  });
}

export async function signUp(email: string, password: string, captchaToken?: string) {
  const supabase = getSupabaseBrowserClient();
  return supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: getAuthCallbackUrl("/mi-perfil"),
      captchaToken,
    },
  });
}

export async function signIn(email: string, password: string, captchaToken?: string) {
  const supabase = getSupabaseBrowserClient();
  return supabase.auth.signInWithPassword({
    email,
    password,
    options: { captchaToken },
  });
}

export async function signOut() {
  const supabase = getSupabaseBrowserClient();
  await supabase.auth.signOut();

  return fetch("/auth/sign-out", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
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
