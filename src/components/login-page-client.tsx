"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { getPasswordLoginErrorMessage, signIn } from "@/lib/auth";
import { getSafeInternalPath } from "@/lib/safe-navigation";
import { TurnstileWidget } from "@/components/turnstile-widget";

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

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = getSafeInternalPath(searchParams.get("redirectTo"));
  const registerIntent = redirectTo.startsWith("/entrenadores/") ? "client" : "trainer";
  const registerHref = `/registro?intent=${registerIntent}&redirectTo=${encodeURIComponent(redirectTo)}`;
  const callbackError = searchParams.get("error");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [passwordCaptchaToken, setPasswordCaptchaToken] = useState<string | null>(null);
  const [passwordCaptchaResetKey, setPasswordCaptchaResetKey] = useState(0);
  const turnstileEnabled = Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error: authError } = await signIn(
        email.trim().toLowerCase(),
        password,
        passwordCaptchaToken ?? undefined,
      );

      if (authError) {
        setError(getPasswordLoginErrorMessage(authError.message));
        return;
      }

      router.push(redirectTo);
      router.refresh();
    } catch {
      setError(getPasswordLoginErrorMessage("network error"));
    } finally {
      setPasswordCaptchaResetKey((value) => value + 1);
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 items-center px-4 py-12 md:px-6">
      <div className="grid w-full gap-6 lg:grid-cols-[0.92fr_1.08fr]">
        <section className="rounded-[28px] bg-[var(--panel-strong)] p-8 sm:p-10">
          <p className="app-kicker">Acceso seguro</p>
          <h1 className="app-title mt-4 text-4xl text-[var(--text)] sm:text-5xl">Tus entrenadores y mensajes, en un solo lugar.</h1>
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
              <div className="font-semibold">Acceso sencillo</div>
              <p className="app-copy mt-1 text-sm">Entra con el email y la contraseña de tu cuenta.</p>
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

          {callbackError ? (
            <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
              No se pudo completar el acceso desde el enlace. Inténtalo de nuevo.
            </p>
          ) : null}

          {error ? <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p> : null}

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
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

            <TurnstileWidget
              action="password_login"
              onToken={setPasswordCaptchaToken}
              resetKey={passwordCaptchaResetKey}
            />

            <button
              type="submit"
              disabled={loading || (turnstileEnabled && !passwordCaptchaToken)}
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-[var(--ink)] transition-colors hover:opacity-95 disabled:opacity-50"
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
