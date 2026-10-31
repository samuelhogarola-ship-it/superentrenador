"use client";

import { useEffect, useState } from "react";
import { getSupabaseBrowserClient, hasSupabaseEnv } from "@/lib/supabase/client";

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
  const [checked, setChecked] = useState(() => !hasSupabaseEnv());

  useEffect(() => {
    if (!hasSupabaseEnv()) return;

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

export function buildAuthCallbackUrl(origin: string, redirectPath: string, intent?: AuthIntent) {
  const url = new URL("/auth/callback", origin);
  url.searchParams.set("next", redirectPath);
  if (intent) url.searchParams.set("intent", intent);
  return url.toString();
}

function getAuthCallbackUrl(redirectPath: string, intent?: AuthIntent) {
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin;
  return buildAuthCallbackUrl(origin, redirectPath, intent);
}

export function getAuthErrorMessage(message: string) {
  const normalized = message.toLowerCase();

  if (normalized.includes("email rate limit")) {
    return "Hemos alcanzado el límite temporal de emails de acceso. Inténtalo de nuevo en unos minutos.";
  }
  if (normalized.includes("signups not allowed")) {
    return "No se pudo completar el acceso con ese email. Inténtalo de nuevo o crea una cuenta.";
  }
  if (message === "Invalid login credentials") {
    return "Email o contraseña incorrectos.";
  }

  return message;
}

export function getMagicLinkFeedback(errorMessage: string | null, mode: "login" | "register") {
  const successText = mode === "register"
    ? "Te hemos enviado un enlace para confirmar tu cuenta."
    : "Si hay una cuenta asociada a ese email, recibirás un enlace mágico.";

  if (!errorMessage || (mode === "login" && errorMessage.toLowerCase().includes("signups not allowed"))) {
    return { tone: "success" as const, text: successText };
  }

  return { tone: "error" as const, text: getAuthErrorMessage(errorMessage) };
}

export async function runCaptchaProtectedRequest<T>(request: () => Promise<T>, onConsumed: () => void) {
  try {
    return await request();
  } finally {
    onConsumed();
  }
}

export function getPasswordLoginErrorMessage(message: string) {
  const normalized = message.toLowerCase();

  if (normalized.includes("invalid login")) {
    return "Email o contraseña incorrectos.";
  }
  if (normalized.includes("email not confirmed")) {
    return "Tu email todavía no está confirmado. Revisa tu correo.";
  }
  if (normalized.includes("fetch failed") || normalized.includes("network")) {
    return "No se pudo conectar con el servicio de acceso. Inténtalo de nuevo.";
  }

  return "No se pudo iniciar sesión. Inténtalo de nuevo.";
}

export function getPasswordRegistrationErrorMessage(message: string) {
  const normalized = message.toLowerCase();

  if (normalized.includes("already registered") || normalized.includes("already exists")) {
    return "Ya existe una cuenta con ese email. Inicia sesión.";
  }
  if (normalized.includes("password")) {
    return "La contraseña debe tener al menos 8 caracteres.";
  }
  if (normalized.includes("fetch failed") || normalized.includes("network")) {
    return "No se pudo conectar con el servicio de registro. Inténtalo de nuevo.";
  }

  return "No se pudo crear la cuenta. Inténtalo de nuevo.";
}

interface PasswordRegistrationAuth {
  signUp(input: {
    email: string;
    password: string;
    options: {
      emailRedirectTo: string;
      captchaToken?: string;
      data: { intent: AuthIntent };
    };
  }): Promise<{ data: { user: unknown; session: unknown }; error: { message: string } | null }>;
  signOut(input: { scope: "local" }): Promise<{ error: unknown }>;
}

export async function completePasswordRegistration(
  auth: PasswordRegistrationAuth,
  input: {
    email: string;
    password: string;
    intent: AuthIntent;
    emailRedirectTo: string;
    captchaToken?: string;
  },
) {
  const result = await auth.signUp({
    email: input.email.trim().toLowerCase(),
    password: input.password,
    options: {
      emailRedirectTo: input.emailRedirectTo,
      captchaToken: input.captchaToken,
      data: { intent: input.intent },
    },
  });

  if (result.data.session) {
    await auth.signOut({ scope: "local" });
  }

  return result;
}

export async function signInWithGoogle(redirectPath = "/dashboard", intent?: AuthIntent) {
  const supabase = getSupabaseBrowserClient();
  return supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: getAuthCallbackUrl(redirectPath, intent),
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

export async function signUp(
  email: string,
  password: string,
  intent: AuthIntent = "client",
  captchaToken?: string,
) {
  const supabase = getSupabaseBrowserClient();
  return completePasswordRegistration(supabase.auth, {
    email,
    password,
    intent,
    emailRedirectTo: getAuthCallbackUrl(intent === "trainer" ? "/mi-perfil" : "/dashboard"),
    captchaToken,
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
