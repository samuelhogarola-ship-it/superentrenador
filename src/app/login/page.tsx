"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { ArrowRight } from "lucide-react";
import { signIn, signInWithGoogle } from "@/lib/auth";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function getSafeRedirectTo(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/mi-perfil";
  }
  return value;
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = getSafeRedirectTo(searchParams.get("redirectTo"));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const { error: authError } = await signIn(email, password);

    if (authError) {
      setError(authError.message === "Invalid login credentials"
        ? "Email o contraseña incorrectos."
        : authError.message);
      setLoading(false);
      return;
    }

    router.push(redirectTo);
    router.refresh();
  }

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-12 md:px-0">
      <div className="app-surface rounded-[32px] p-8">
        <h1 className="app-title text-2xl text-[var(--text)]">Iniciar sesión</h1>
        <p className="app-copy mt-2 text-sm">
          ¿No tienes cuenta?{" "}
          <Link href="/registro" className="font-semibold text-[var(--text)] hover:text-[var(--accent)]">
            Regístrate gratis
          </Link>
        </p>

        <button
          type="button"
          disabled={googleLoading}
          onClick={async () => { setGoogleLoading(true); await signInWithGoogle(redirectTo); }}
          className="mt-6 inline-flex w-full items-center justify-center gap-3 rounded-full border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-sm font-semibold text-[var(--text)] transition-transform hover:-translate-y-0.5 disabled:opacity-50"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
            <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z"/>
            <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"/>
            <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z"/>
            <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58Z"/>
          </svg>
          {googleLoading ? "Redirigiendo…" : "Continuar con Google"}
        </button>

        <div className="mt-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-[var(--line)]" />
          <span className="text-xs text-[var(--muted)]">o con email</span>
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
              className="rounded-full border border-[var(--line)] bg-[var(--bg-soft)] px-4 py-3 text-sm outline-none focus-visible:border-[var(--accent)]"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm font-medium text-[var(--text)]">
            Contraseña
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="rounded-full border border-[var(--line)] bg-[var(--bg-soft)] px-4 py-3 text-sm outline-none focus-visible:border-[var(--accent)]"
            />
          </label>

          {error ? (
            <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-[var(--ink)] transition-transform hover:-translate-y-0.5 disabled:opacity-50"
          >
            {loading ? "Entrando…" : "Iniciar sesión"}
            {!loading && <ArrowRight size={15} />}
          </button>
        </form>
      </div>
    </main>
  );
}
