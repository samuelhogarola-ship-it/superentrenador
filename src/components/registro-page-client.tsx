"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, CheckCircle, Mail, Sparkles } from "lucide-react";
import { getAuthErrorMessage, signInWithGoogle, signUpWithMagicLink } from "@/lib/auth";

export function RegistroPageClient() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    const { error: authError } = await signUpWithMagicLink(email, "/mi-perfil");

    if (authError) {
      console.error("[auth/client/register] signInWithOtp failed", authError);
      setError(getAuthErrorMessage(authError.message));
      setLoading(false);
      return;
    }

    setDone(true);
    setLoading(false);
  }

  if (done) {
    return (
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-12 md:px-0">
        <div className="rounded-[28px] border border-[var(--line)] bg-[var(--surface)] p-8 text-center shadow-[var(--shadow-soft)]">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10">
            <CheckCircle size={24} className="text-emerald-600" />
          </span>
          <h1 className="app-title mt-5 text-2xl text-[var(--text)]">Revisa tu email</h1>
          <p className="app-copy mx-auto mt-3 max-w-xs text-sm">
            Te hemos enviado un enlace mágico a <strong>{email}</strong>. Haz clic en él para entrar y completar tu perfil.
          </p>
          <Link
            href="/mi-perfil"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white"
          >
            Ir a mi perfil
            <ArrowRight size={15} />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 items-center px-4 py-12 md:px-6">
      <div className="grid w-full gap-6 lg:grid-cols-[1.02fr_0.98fr]">
        <section className="rounded-[28px] bg-[var(--panel-strong)] p-8 sm:p-10">
          <p className="app-kicker">Para entrenadores</p>
          <h1 className="app-title mt-4 text-4xl text-[var(--text)] sm:text-5xl">Publica tu perfil y capta demanda local.</h1>
          <p className="app-copy mt-4 max-w-md text-base">
            Crea una cuenta para aparecer en tu ciudad, mostrar tu especialidad y responder desde un flujo de contacto ordenado.
          </p>
          <div className="mt-8 rounded-[20px] border border-[var(--line)] bg-[var(--surface)] p-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text)]">
              <Sparkles size={16} className="text-[var(--accent)]" />
              Qué consigues con tu cuenta
            </div>
            <ul className="mt-4 grid gap-2 text-sm text-[var(--muted)]">
              <li>Perfil público con especialidad, experiencia y precio.</li>
              <li>Mensajería integrada para leads interesados.</li>
              <li>Acceso posterior a Coach Studio si activas la parte premium.</li>
            </ul>
          </div>
        </section>

        <div className="rounded-[28px] border border-[var(--line)] bg-[var(--surface)] p-8 shadow-[var(--shadow-soft)]">
          <h2 className="app-title text-2xl text-[var(--text)]">Crear cuenta</h2>
          <p className="app-copy mt-2 text-sm">
            ¿Ya tienes cuenta?{" "}
            <Link href="/login" className="font-semibold text-[var(--text)] hover:text-[var(--accent)]">
              Inicia sesión
            </Link>
          </p>

          <button
            type="button"
            disabled={googleLoading}
            onClick={async () => {
              setGoogleLoading(true);
              await signInWithGoogle();
            }}
            className="mt-6 inline-flex w-full items-center justify-center gap-3 rounded-full border border-[var(--line-strong)] bg-[var(--surface)] px-4 py-3 text-sm font-semibold text-[var(--text)] transition-colors hover:border-[var(--accent)] disabled:opacity-50"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
              <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" />
              <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" />
              <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" />
              <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58Z" />
            </svg>
            {googleLoading ? "Redirigiendo…" : "Continuar con Google"}
          </button>

          <div className="mt-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-[var(--line)]" />
            <span className="text-xs text-[var(--muted)]">o con magic link</span>
            <div className="h-px flex-1 bg-[var(--line)]" />
          </div>

          <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
            <label className="flex flex-col gap-1.5 text-sm font-medium text-[var(--text)]">
              Email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="tu@email.com"
                className="rounded-2xl border border-[var(--line)] bg-[var(--bg-soft)] px-4 py-3 text-sm outline-none focus-visible:border-[var(--accent)]"
              />
            </label>

            {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p> : null}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-white transition-colors hover:opacity-95 disabled:opacity-50"
            >
              <Mail size={15} />
              {loading ? "Enviando enlace…" : "Crear cuenta con magic link"}
            </button>

            <p className="text-center text-xs text-[var(--muted)]">
              Al registrarte aceptas que tu información sea pública en el marketplace.
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}
