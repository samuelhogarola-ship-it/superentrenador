"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, CheckCircle } from "lucide-react";
import { signInWithGoogle, signUp } from "@/lib/auth";

export default function RegistroPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setLoading(true);
    const { error: authError, data } = await signUp(email, password);

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    if (data.session) {
      router.push("/mi-perfil");
      router.refresh();
    } else {
      setDone(true);
    }
  }

  if (done) {
    return (
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-12 md:px-0">
        <div className="app-surface rounded-[32px] p-8 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10">
            <CheckCircle size={24} className="text-emerald-600" />
          </span>
          <h1 className="app-title mt-5 text-2xl text-[var(--text)]">Revisa tu email</h1>
          <p className="app-copy mx-auto mt-3 max-w-xs text-sm">
            Te hemos enviado un enlace de confirmación a <strong>{email}</strong>. Haz clic en él y vuelve a iniciar sesión.
          </p>
          <Link
            href="/login"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-[var(--text)] px-6 py-3 text-sm font-semibold text-white"
          >
            Ir al login
            <ArrowRight size={15} />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-12 md:px-0">
      <div className="app-surface rounded-[32px] p-8">
        <h1 className="app-title text-2xl text-[var(--text)]">Crear cuenta</h1>
        <p className="app-copy mt-2 text-sm">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="font-semibold text-[var(--text)] hover:text-[var(--accent)]">
            Inicia sesión
          </Link>
        </p>

        <button
          type="button"
          disabled={googleLoading}
          onClick={async () => { setGoogleLoading(true); await signInWithGoogle(); }}
          className="mt-6 inline-flex w-full items-center justify-center gap-3 rounded-full border border-[var(--line)] bg-white px-4 py-3 text-sm font-semibold text-[var(--text)] transition-transform hover:-translate-y-0.5 disabled:opacity-50"
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
              placeholder="Mínimo 6 caracteres"
              className="rounded-full border border-[var(--line)] bg-[var(--bg-soft)] px-4 py-3 text-sm outline-none focus-visible:border-[var(--accent)]"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm font-medium text-[var(--text)]">
            Confirmar contraseña
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              placeholder="Repite la contraseña"
              className="rounded-full border border-[var(--line)] bg-[var(--bg-soft)] px-4 py-3 text-sm outline-none focus-visible:border-[var(--accent)]"
            />
          </label>

          {error ? (
            <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--text)] px-4 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 disabled:opacity-50"
          >
            {loading ? "Creando cuenta…" : "Crear cuenta gratis"}
            {!loading && <ArrowRight size={15} />}
          </button>

          <p className="text-center text-xs text-[var(--muted)]">
            Al registrarte aceptas que tu información sea pública en el marketplace.
          </p>
        </form>
      </div>
    </main>
  );
}
