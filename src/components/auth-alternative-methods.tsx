"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import {
  getAuthErrorMessage,
  getMagicLinkFeedback,
  runCaptchaProtectedRequest,
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
  onCaptchaConsumed?: () => void;
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
  onCaptchaConsumed,
}: AuthAlternativeMethodsProps) {
  const [loading, setLoading] = useState<"google" | "magic" | null>(null);
  const [feedback, setFeedback] = useState<{ tone: "error" | "success"; text: string } | null>(null);
  const isRegistration = mode === "register";

  async function handleGoogle() {
    setFeedback(null);
    setLoading("google");

    try {
      const { error } = await signInWithGoogle(redirectPath, isRegistration ? intent : undefined);
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
      const result = await runCaptchaProtectedRequest(
        () => isRegistration
          ? signUpWithMagicLink(normalizedEmail, redirectPath, intent, captchaToken ?? undefined)
          : signInWithMagicLink(normalizedEmail, redirectPath, captchaToken ?? undefined),
        () => onCaptchaConsumed?.(),
      );

      setFeedback(getMagicLinkFeedback(result.error?.message ?? null, mode));
    } catch {
      setFeedback({ tone: "error", text: "No se pudo enviar el enlace. Inténtalo de nuevo." });
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="mt-4 grid gap-3" aria-label="Métodos de acceso">
      <button
        type="button"
        onClick={handleMagicLink}
        disabled={loading !== null || (captchaRequired && !captchaToken)}
        className="inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-full bg-[#ff6268] px-5 py-3.5 text-sm font-extrabold text-white transition-transform hover:-translate-y-0.5 hover:bg-[#ef565c] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Mail size={18} />
        {loading === "magic"
          ? "Enviando enlace…"
          : isRegistration
            ? "Inscripción vía email"
            : "Acceder vía email"}
      </button>

      <div className="flex items-center gap-3 py-1 text-xs font-semibold text-[#a09da3]">
        <span className="h-px flex-1 bg-[#e8e7e9]" />
        <span>o</span>
        <span className="h-px flex-1 bg-[#e8e7e9]" />
      </div>

      <button
        type="button"
        onClick={handleGoogle}
        disabled={loading !== null}
        className="inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-full border border-[#e7e6e8] bg-white px-5 py-3.5 text-sm font-extrabold text-[#3f3d42] transition-transform hover:-translate-y-0.5 hover:bg-[#fafafa] disabled:opacity-50"
      >
        <GoogleIcon />
        {loading === "google"
          ? "Conectando con Google…"
          : isRegistration
            ? "Inscripción con Google"
            : "Continuar con Google"}
      </button>

      {feedback ? (
        <p
          role="status"
          className={`rounded-2xl px-4 py-3 text-sm font-medium ${
            feedback.tone === "success" ? "bg-blue-50 text-blue-800" : "bg-red-50 text-red-600"
          }`}
        >
          {feedback.text}
        </p>
      ) : null}
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="h-[19px] w-[19px] shrink-0">
      <path fill="#4285F4" d="M21.6 12.23c0-.71-.06-1.4-.18-2.07H12v3.92h5.38a4.6 4.6 0 0 1-2 3.02v2.54h3.24c1.9-1.75 2.98-4.33 2.98-7.41Z" />
      <path fill="#34A853" d="M12 22c2.7 0 4.98-.9 6.63-2.42l-3.24-2.54c-.9.6-2.05.96-3.39.96-2.61 0-4.83-1.76-5.62-4.14H3.03v2.62A10 10 0 0 0 12 22Z" />
      <path fill="#FBBC05" d="M6.38 13.86A6 6 0 0 1 6.07 12c0-.65.11-1.28.31-1.86V7.52H3.03A10 10 0 0 0 2 12c0 1.61.38 3.14 1.03 4.48l3.35-2.62Z" />
      <path fill="#EA4335" d="M12 6c1.47 0 2.79.5 3.83 1.5l2.87-2.87A9.64 9.64 0 0 0 12 2a10 10 0 0 0-8.97 5.52l3.35 2.62C7.17 7.76 9.39 6 12 6Z" />
    </svg>
  );
}
