"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { MessageCircleMore, Search, Sparkles } from "lucide-react";
import { AuthAlternativeMethods } from "@/components/auth-alternative-methods";
import { AuthPageBackdrop } from "@/components/auth-page-backdrop";
import { TurnstileWidget } from "@/components/turnstile-widget";
import { getSafeInternalPath } from "@/lib/safe-navigation";

export function LoginPageClient() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginForm />
    </Suspense>
  );
}

function LoginFallback() {
  return (
    <main className="flex min-h-[calc(100svh-72px)] flex-1 items-center bg-[#f1f2f4] px-4 py-10 md:px-8">
      <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="h-72 animate-pulse rounded-[32px] bg-white/45" />
        <div className="h-[31rem] animate-pulse rounded-[32px] bg-white/80" />
      </div>
    </main>
  );
}

function LoginForm() {
  const searchParams = useSearchParams();
  const redirectTo = getSafeInternalPath(searchParams.get("redirectTo"));
  const registerHref = `/registro?intent=client&redirectTo=${encodeURIComponent(redirectTo)}`;
  const callbackError = searchParams.get("error");
  const [email, setEmail] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaResetKey, setCaptchaResetKey] = useState(0);
  const turnstileEnabled = Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);

  return (
    <main className="relative flex min-h-[calc(100svh-72px)] flex-1 items-center overflow-hidden bg-[#f1f2f4] px-4 py-9 text-[#17171b] md:px-8 lg:py-14">
      <AuthPageBackdrop />

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
        <section className="order-2 max-w-xl px-2 py-4 sm:px-6 lg:order-1 lg:py-12">
          <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#e11931]">Tu espacio de entrenamiento</p>
          <h1 className="mt-5 font-heading text-4xl font-extrabold leading-[1.05] tracking-[-0.05em] text-[#17171b] sm:text-5xl lg:text-6xl">
            Encuentra, contacta y avanza.
          </h1>
          <p className="mt-6 max-w-lg text-lg font-medium leading-8 text-[#57545b]">
            Accede a tus conversaciones y continúa donde lo dejaste con tus entrenadores.
          </p>
          <ul className="mt-8 grid gap-4 text-base font-bold text-[#29272d] sm:grid-cols-3 lg:grid-cols-1">
            <li className="flex items-center gap-3"><Search size={20} className="text-[#0094ff]" /> Busca profesionales</li>
            <li className="flex items-center gap-3"><MessageCircleMore size={20} className="text-[#e11931]" /> Recupera tus mensajes</li>
            <li className="flex items-center gap-3"><Sparkles size={20} className="text-[#f5a623]" /> Organiza tu experiencia</li>
          </ul>
        </section>

        <section className="relative order-1 min-w-0 rounded-[28px] border border-white/80 bg-white/95 p-6 shadow-[0_24px_70px_rgba(30,34,42,0.13)] sm:p-10 lg:order-2">
          <h2 className="font-heading text-3xl font-extrabold tracking-[-0.04em] text-[#17171b]">Iniciar sesión</h2>
          <p className="mt-2 text-sm font-medium text-[#77737b]">Introduce tu email o continúa con Google.</p>

          {callbackError ? (
            <p className="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              No se pudo completar el acceso desde el enlace. Inténtalo de nuevo.
            </p>
          ) : null}

          <div className="mt-7">
            <label htmlFor="login-email" className="sr-only">Email</label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
              placeholder="E-mail"
              className="w-full rounded-[22px] border border-transparent bg-[#f5f5f6] px-5 py-4 text-base font-semibold text-[#17171b] outline-none placeholder:text-[#9b989e] focus-visible:border-[#0094ff]"
            />

            <TurnstileWidget
              action="magic_link_login"
              onToken={setCaptchaToken}
              resetKey={captchaResetKey}
              appearance="interaction-only"
            />

            <AuthAlternativeMethods
              email={email}
              redirectPath={redirectTo}
              mode="login"
              captchaToken={captchaToken}
              captchaRequired={turnstileEnabled}
              onCaptchaConsumed={() => setCaptchaResetKey((value) => value + 1)}
            />
          </div>

          <p className="mt-7 text-center text-sm font-semibold text-[#8a878d]">
            ¿Todavía no tienes una cuenta?{" "}
            <Link href={registerHref} className="font-extrabold text-[#17171b] hover:text-[#e11931]">Regístrate</Link>
          </p>
          <p className="mt-5 text-center text-xs leading-5 text-[#9b989e]">
            Al continuar aceptas nuestros{" "}
            <Link href="/terminos" className="underline hover:text-[#17171b]">términos</Link>{" "}
            y la{" "}
            <Link href="/politica-privacidad" className="underline hover:text-[#17171b]">política de privacidad</Link>.
          </p>
        </section>
      </div>
    </main>
  );
}
