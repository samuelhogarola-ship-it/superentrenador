"use client";

import { useState } from "react";
import { Globe2, Mail } from "lucide-react";
import {
  getAuthErrorMessage,
  signInWithGoogle,
  signInWithMagicLink,
  signUpWithMagicLink,
  type AuthIntent,
} from "@/lib/auth";

interface AuthAlternativeMethodsProps {
  email: string;
  redirectPath: string;
  mode: "login" | "register";
  intent?: AuthIntent;
  captchaToken?: string | null;
  captchaRequired?: boolean;
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function AuthAlternativeMethods({
  email,
  redirectPath,
  mode,
  intent = "client",
  captchaToken,
  captchaRequired = false,
}: AuthAlternativeMethodsProps) {
  const [loading, setLoading] = useState<"google" | "magic" | null>(null);
  const [feedback, setFeedback] = useState<{ tone: "error" | "success"; text: string } | null>(null);
  const isRegistration = mode === "register";

  async function handleGoogle() {
    setFeedback(null);
    setLoading("google");

    try {
      const { error } = await signInWithGoogle(redirectPath);
      if (error) {
        setFeedback({ tone: "error", text: getAuthErrorMessage(error.message) });
      }
    } catch {
      setFeedback({ tone: "error", text: "No se pudo conectar con Google. Inténtalo de nuevo." });
    } finally {
      setLoading(null);
    }
  }

  async function handleMagicLink() {
    const normalizedEmail = email.trim().toLowerCase();
    setFeedback(null);

    if (!isValidEmail(normalizedEmail)) {
      setFeedback({ tone: "error", text: "Introduce un email válido para recibir el enlace." });
      return;
    }
    if (captchaRequired && !captchaToken) {
      setFeedback({ tone: "error", text: "Completa la verificación de seguridad para continuar." });
      return;
    }

    setLoading("magic");

    try {
      const result = isRegistration
        ? await signUpWithMagicLink(normalizedEmail, redirectPath, intent, captchaToken ?? undefined)
        : await signInWithMagicLink(normalizedEmail, redirectPath, captchaToken ?? undefined);

      if (result.error) {
        setFeedback({ tone: "error", text: getAuthErrorMessage(result.error.message) });
      } else {
        setFeedback({
          tone: "success",
          text: isRegistration
            ? "Te hemos enviado un enlace para confirmar tu cuenta."
            : "Te hemos enviado un enlace mágico.",
        });
      }
    } catch {
      setFeedback({ tone: "error", text: "No se pudo enviar el enlace. Inténtalo de nuevo." });
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="mt-5 grid gap-3" aria-label="Métodos alternativos de acceso">
      <button
        type="button"
        onClick={handleGoogle}
        disabled={loading !== null}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-sm font-semibold text-[var(--text)] transition-colors hover:border-[var(--accent)] disabled:opacity-50"
      >
        <Globe2 size={16} />
        {loading === "google" ? "Conectando con Google…" : "Continuar con Google"}
      </button>

      <button
        type="button"
        onClick={handleMagicLink}
        disabled={loading !== null || (captchaRequired && !captchaToken)}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[var(--line)] bg-[var(--bg-soft)] px-4 py-3 text-sm font-semibold text-[var(--text)] transition-colors hover:border-[var(--accent)] disabled:opacity-50"
      >
        <Mail size={16} />
        {loading === "magic"
          ? "Enviando enlace…"
          : isRegistration
            ? "Crear cuenta con magic link"
            : "Entrar con magic link"}
      </button>

      {feedback ? (
        <p
          role="status"
          className={`rounded-2xl px-4 py-3 text-sm ${
            feedback.tone === "success" ? "bg-[var(--accent-soft)] text-[var(--text)]" : "bg-red-50 text-red-600"
          }`}
        >
          {feedback.text}
        </p>
      ) : null}
    </div>
  );
}
