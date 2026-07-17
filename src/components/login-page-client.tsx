"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { ArrowRight, Mail, ShieldCheck } from "lucide-react";
import { getAuthErrorMessage, signIn, signInWithGoogle, signInWithMagicLink } from "@/lib/auth";

export function LoginPageClient() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginForm />
    </Suspense>
  );
}

function LoginFallback() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 items-center px-4 py-12 md:px-6">
      <div className="grid w-full gap-6 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="skeleton h-80 rounded-[28px]" />
        <div className="skeleton h-[34rem] rounded-[28px]" />
      </div>
    </main>
  );
}

function getSafeRedirectTo(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/dashboard";
  }
  return value;
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = getSafeRedirectTo(searchParams.get("redirectTo"));
  const registerIntent = redirectTo.startsWith("/entrenadores/") ? "client" : "trainer";
  const registerHref = `/registro?intent=${registerIntent}&redirectTo=${encodeURIComponent(redirectTo)}`;
  const callbackError = searchParams.get("error");
  const [email, setEmail] = useState("");
  const [magicEmail, setMagicEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [magicSent, setMagicSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [magicLoading, setMagicLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function handleMagicLinkSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setMagicSent(false);
    setMagicLoading(true);

    const { error: authError } = await signInWithMagicLink(magicEmail, redirectTo);

    if (authError) {
      console.error("[auth/client/magic-link] signInWithOtp failed", authError);
      setError(getAuthErrorMessage(authError.message));
      setMagicLoading(false);
      return;
    }

    setMagicSent(true);
    setMagicLoading(false);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const { error: authError } = await signIn(email, password);

    if (authError) {
      setError(getAuthErrorMessage(authError.message));
      setLoading(false);
      return;
    }

    router.push(redirectTo);
    router.refresh();
  }

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 items-center px-4 py-12 md:px-6">
      <div className="grid w-full gap-6 lg:grid-cols-[0.92fr_1.08fr]">
        <section className="rounded-[28px] bg-[var(--panel-strong)] p-8 sm:p-10">
          <p className="app-kicker">Acceso seguro</p>
          <h1 className="app-title mt-4 text-4xl text-[var(--text)] sm:text-5xl">Habla con tu entrenador sin fricción.</h1>
          <p className="app-copy mt-4 max-w-md text-base">
            Accede a tus mensajes, desbloquea el contacto cuando corresponda y gestiona tu perfil desde una sola cuenta.
          </p>
          <div className="mt-8 grid gap-3">
            <div className="rounded-[16px] border border-[var(--line)] bg-[var(--surface)] px-4 py-4 text-sm text-[var(--text)]">
              <div className="flex items-center gap-2 font-semibold">
                <ShieldCheck size={16} className="text-[var(--accent)]" />
                Contacto protegido
              </div>
              <p className="app-copy mt-1 text-sm">Solo se muestra cuando el flujo del marketplace lo permite.</p>
            </div>
            <div className="rounded-[16px] border border-[var(--line)] bg-[var(--surface)] px-4 py-4 text-sm text-[var(--text)]">
              <div className="font-semibold">Mismos datos, misma sesión</div>
              <p className="app-copy mt-1 text-sm">Email, Google y callback de Supabase comparten el mismo destino seguro.</p>
            </div>
          </div>
        </section>

        <div className="rounded-[28px] border border-[var(--line)] bg-[var(--surface)] p-8 shadow-[var(--shadow-soft)]">
          <h2 className="app-title text-2xl text-[var(--text)]">Iniciar sesión</h2>
          <p className="app-copy mt-2 text-sm">
            ¿No tienes cuenta?{" "}
            <Link href={registerHref} className="font-semibold text-[var(--text)] hover:text-[var(--accent)]">
              Regístrate gratis
            </Link>
          </p>

          <button
            type="button"
            disabled={googleLoading}
            onClick={async () => {
              setGoogleLoading(true);
              await signInWithGoogle(redirectTo);
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
            <span className="text-xs text-[var(--muted)]">o recibe un enlace</span>
            <div className="h-px flex-1 bg-[var(--line)]" />
          </div>

          <form onSubmit={handleMagicLinkSubmit} className="mt-5 flex flex-col gap-4">
            <label className="flex flex-col gap-1.5 text-sm font-medium text-[var(--text)]">
              Email
              <input
                type="email"
                value={magicEmail}
                onChange={(e) => setMagicEmail(e.target.value)}
                autoComplete="email"
                required
                placeholder="tu@email.com"
                className="rounded-2xl border border-[var(--line)] bg-[var(--bg-soft)] px-4 py-3 text-sm outline-none focus-visible:border-[var(--accent)]"
              />
            </label>

            {magicSent ? (
              <p className="rounded-2xl bg-[var(--accent-soft)] px-4 py-3 text-sm text-[var(--accent)]">
                Te hemos enviado un enlace mágico. Ábrelo desde este dispositivo para entrar.
              </p>
            ) : null}

            <button
              type="submit"
              disabled={magicLoading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-white transition-colors hover:opacity-95 disabled:opacity-50"
            >
              <Mail size={15} />
              {magicLoading ? "Enviando enlace…" : "Entrar con magic link"}
            </button>
          </form>

          {callbackError ? (
            <p className="mt-4 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-700">
              No se pudo completar el acceso desde el enlace. Inténtalo de nuevo.
            </p>
          ) : null}

          {error ? <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p> : null}

          <div className="mt-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-[var(--line)]" />
            <span className="text-xs text-[var(--muted)]">o con contraseña</span>
            <div className="h-px flex-1 bg-[var(--line)]" />
          </div>

          <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
            <label className="flex flex-col gap-1.5 text-sm font-medium text-[var(--text)]">
              Email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                placeholder="tu@email.com"
                className="rounded-2xl border border-[var(--line)] bg-[var(--bg-soft)] px-4 py-3 text-sm outline-none focus-visible:border-[var(--accent)]"
              />
            </label>

            <label className="flex flex-col gap-1.5 text-sm font-medium text-[var(--text)]">
              Contraseña
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                placeholder="••••••••"
                className="rounded-2xl border border-[var(--line)] bg-[var(--bg-soft)] px-4 py-3 text-sm outline-none focus-visible:border-[var(--accent)]"
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-white transition-colors hover:opacity-95 disabled:opacity-50"
            >
              {loading ? "Entrando…" : "Iniciar sesión"}
              {!loading && <ArrowRight size={15} />}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
