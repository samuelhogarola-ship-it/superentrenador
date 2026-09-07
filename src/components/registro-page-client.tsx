"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { CheckCircle, LockKeyhole, Sparkles, UserRound, Dumbbell } from "lucide-react";
import { getPasswordRegistrationErrorMessage, signUp, type AuthIntent } from "@/lib/auth";
import { getSafeInternalPath } from "@/lib/safe-navigation";
import { TurnstileWidget } from "@/components/turnstile-widget";

export function RegistroPageClient() {
  return (
    <Suspense fallback={<RegistroFallback />}>
      <RegistroForm />
    </Suspense>
  );
}

function RegistroFallback() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 items-center px-4 py-12 md:px-6">
      <div className="grid w-full gap-6 lg:grid-cols-[1.02fr_0.98fr]">
        <div className="skeleton h-80 rounded-[28px]" />
        <div className="skeleton h-96 rounded-[28px]" />
      </div>
    </main>
  );
}

function getInitialIntent(value: string | null, redirectTo: string): AuthIntent {
  if (value === "client" || value === "trainer") return value;
  return redirectTo.startsWith("/entrenadores/") ? "client" : "trainer";
}

function RegistroForm() {
  const searchParams = useSearchParams();
  const redirectTo = getSafeInternalPath(searchParams.get("redirectTo"));
  const [intent, setIntent] = useState<AuthIntent>(() => getInitialIntent(searchParams.get("intent"), redirectTo));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaResetKey, setCaptchaResetKey] = useState(0);
  const turnstileEnabled = Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);
  const isTrainer = intent === "trainer";

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    if (password !== passwordConfirmation) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);

    try {
      const { error: authError } = await signUp(email, password, intent, captchaToken ?? undefined);

      if (authError) {
        console.error("[auth/client/register] signUp failed", authError);
        setError(getPasswordRegistrationErrorMessage(authError.message));
        return;
      }

      setDone(true);
    } catch {
      setError(getPasswordRegistrationErrorMessage("network error"));
    } finally {
      setCaptchaResetKey((value) => value + 1);
      setLoading(false);
    }
  }

  if (done) {
    return (
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-12 md:px-0">
        <div className="rounded-[28px] border border-[var(--line)] bg-[var(--surface)] p-8 text-center shadow-[var(--shadow-soft)]">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--accent-soft)]">
            <CheckCircle size={24} className="text-[var(--accent)]" />
          </span>
          <h1 className="app-title mt-5 text-2xl text-[var(--text)]">Cuenta creada</h1>
          <p className="app-copy mx-auto mt-3 max-w-xs text-sm">
            Revisa <strong>{email}</strong> para confirmar tu cuenta. Después inicia sesión con tu
            contraseña{isTrainer ? " y completa tu perfil de entrenador." : "."}
          </p>
          <Link
            href="/login"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-[var(--ink)]"
          >
            Ir a iniciar sesión
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 items-center px-4 py-12 md:px-6">
      <div className="grid w-full gap-6 lg:grid-cols-[1.02fr_0.98fr]">
        <section className="rounded-[28px] bg-[var(--panel-strong)] p-8 sm:p-10">
          <p className="app-kicker">{isTrainer ? "Para entrenadores" : "Para clientes"}</p>
          <h1 className="app-title mt-4 text-4xl text-[var(--text)] sm:text-5xl">
            {isTrainer ? "Publica tu perfil y recibe nuevos clientes." : "Encuentra y contacta con tu entrenador."}
          </h1>
          <p className="app-copy mt-4 max-w-md text-base">
            {isTrainer
              ? "Crea una cuenta para aparecer en tu ciudad, mostrar tu especialidad y responder desde un flujo de contacto ordenado."
              : "Crea una cuenta para guardar tu sesión, contactar desde perfiles públicos y seguir tus mensajes desde el panel."}
          </p>
          <div className="mt-8 rounded-[20px] border border-[var(--line)] bg-[var(--surface)] p-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text)]">
              <Sparkles size={16} className="text-[var(--accent)]" />
              {isTrainer ? "Qué consigues con tu cuenta" : "Qué desbloquea tu cuenta"}
            </div>
            <ul className="mt-4 grid gap-2 text-sm text-[var(--muted)]">
              {isTrainer ? (
                <>
                  <li>Perfil público con especialidad, experiencia y precio.</li>
                  <li>Mensajería integrada para leads interesados.</li>
                  <li>Acceso posterior a Coach Studio si activas la parte premium.</li>
                </>
              ) : (
                <>
                  <li>Contacto protegido con entrenadores publicados.</li>
                  <li>Panel con tus mensajes enviados.</li>
                  <li>Acceso independiente con tu email y contraseña.</li>
                </>
              )}
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

          <div className="mt-6 grid gap-2 rounded-[22px] border border-[var(--line)] bg-[var(--bg-soft)] p-2 sm:grid-cols-2">
            <button
              type="button"
              aria-pressed={intent === "client"}
              onClick={() => setIntent("client")}
              className={`inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition-colors ${
                intent === "client" ? "bg-[var(--surface)] text-[var(--text)] shadow-[var(--shadow-soft)]" : "text-[var(--muted)]"
              }`}
            >
              <UserRound size={15} />
              Quiero contactar
            </button>
            <button
              type="button"
              aria-pressed={intent === "trainer"}
              onClick={() => setIntent("trainer")}
              className={`inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition-colors ${
                intent === "trainer" ? "bg-[var(--surface)] text-[var(--text)] shadow-[var(--shadow-soft)]" : "text-[var(--muted)]"
              }`}
            >
              <Dumbbell size={15} />
              Soy entrenador
            </button>
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
                autoComplete="new-password"
                required
                minLength={8}
                placeholder="Mínimo 8 caracteres"
                className="rounded-2xl border border-[var(--line)] bg-[var(--bg-soft)] px-4 py-3 text-sm outline-none focus-visible:border-[var(--accent)]"
              />
            </label>

            <label className="flex flex-col gap-1.5 text-sm font-medium text-[var(--text)]">
              Repite la contraseña
              <input
                type="password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                autoComplete="new-password"
                required
                minLength={8}
                placeholder="Repite tu contraseña"
                className="rounded-2xl border border-[var(--line)] bg-[var(--bg-soft)] px-4 py-3 text-sm outline-none focus-visible:border-[var(--accent)]"
              />
            </label>

            {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p> : null}

            <TurnstileWidget
              action="registration"
              onToken={setCaptchaToken}
              resetKey={captchaResetKey}
            />

            <button
              type="submit"
              disabled={loading || (turnstileEnabled && !captchaToken)}
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-[var(--ink)] transition-colors hover:opacity-95 disabled:opacity-50"
            >
              <LockKeyhole size={15} />
              {loading ? "Creando cuenta…" : "Crear cuenta"}
            </button>

            <p className="text-center text-xs text-[var(--muted)]">
              Al registrarte aceptas los{" "}
              <Link href="/terminos" className="font-semibold text-[var(--text)] hover:text-[var(--accent)]">
                términos
              </Link>
              {" "}y la{" "}
              <Link href="/politica-privacidad" className="font-semibold text-[var(--text)] hover:text-[var(--accent)]">
                política de privacidad
              </Link>
              . {isTrainer
                ? "Tu perfil enviado puede revisarse antes de publicarse."
                : "Usaremos tu email para mantener tu sesión y tus mensajes."}
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}
