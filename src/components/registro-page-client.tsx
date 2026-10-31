"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { BadgeEuro, CalendarDays, MapPinned, MessageCircleMore, Search } from "lucide-react";
import { AuthAlternativeMethods } from "@/components/auth-alternative-methods";
import { AuthPageBackdrop } from "@/components/auth-page-backdrop";
import { TurnstileWidget } from "@/components/turnstile-widget";
import { getSafeInternalPath } from "@/lib/safe-navigation";
import type { AuthIntent } from "@/lib/auth";

export function RegistroPageClient() {
  return (
    <Suspense fallback={<RegistroFallback />}>
      <RegistroForm />
    </Suspense>
  );
}

function RegistroFallback() {
  return (
    <main className="flex min-h-[calc(100svh-72px)] flex-1 items-center bg-[#f1f2f4] px-4 py-10 md:px-8">
      <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[1.08fr_0.92fr]">
        <div className="h-96 animate-pulse rounded-[32px] bg-white/45" />
        <div className="h-[34rem] animate-pulse rounded-[32px] bg-white/80" />
      </div>
    </main>
  );
}

function getIntent(value: string | null): AuthIntent {
  return value === "trainer" ? "trainer" : "client";
}

function RegistroForm() {
  const searchParams = useSearchParams();
  const redirectTo = getSafeInternalPath(searchParams.get("redirectTo"));
  const intent = getIntent(searchParams.get("intent"));
  const isTrainer = intent === "trainer";
  const [email, setEmail] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaResetKey, setCaptchaResetKey] = useState(0);
  const turnstileEnabled = Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);

  return (
    <main className="relative flex min-h-[calc(100svh-72px)] flex-1 items-center overflow-hidden bg-[#f1f2f4] px-4 py-9 text-[#17171b] md:px-8 lg:py-14">
      <AuthPageBackdrop />

      <div className="relative mx-auto grid w-full max-w-6xl items-start gap-7 lg:grid-cols-[1.05fr_0.95fr] lg:gap-x-20 lg:gap-y-8">
        <section className="max-w-2xl px-1 pt-2 sm:px-6 lg:pt-12">
          <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#e11931]">
            {isTrainer ? "Para entrenadores" : "Para alumnos"}
          </p>
          <h1 className="mt-3 font-heading text-4xl font-extrabold leading-[1.08] tracking-[-0.045em] text-[#17171b] sm:text-5xl">
            {isTrainer ? "Crea tu perfil" : "Crea tu cuenta"}
          </h1>
          <p className="mt-3 text-base font-semibold text-[#74777d] sm:text-lg">
            Gratis, rápido y sin pasos innecesarios.
          </p>
        </section>

        <section className="relative min-w-0 rounded-[28px] border border-white/80 bg-white/95 p-6 shadow-[0_24px_70px_rgba(30,34,42,0.13)] sm:p-9 lg:row-span-2 lg:mt-4">
          <h2 className="sr-only">Elige cómo quieres registrarte</h2>
          <div>
            <label htmlFor="registration-email" className="sr-only">Email</label>
            <input
              id="registration-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
              placeholder="E-mail"
              className="w-full rounded-[22px] border border-transparent bg-[#f5f5f6] px-5 py-4 text-base font-semibold text-[#17171b] outline-none placeholder:text-[#9b989e] focus-visible:border-[#0094ff]"
            />

            <TurnstileWidget
              action="registration"
              onToken={setCaptchaToken}
              resetKey={captchaResetKey}
              appearance="interaction-only"
            />

            <AuthAlternativeMethods
              email={email}
              redirectPath={isTrainer ? "/mi-perfil" : redirectTo}
              mode="register"
              intent={intent}
              captchaToken={captchaToken}
              captchaRequired={turnstileEnabled}
              onCaptchaConsumed={() => setCaptchaResetKey((value) => value + 1)}
            />
          </div>

          <p className="mt-7 text-center text-sm font-semibold text-[#8a878d]">
            ¿Ya tienes una cuenta?{" "}
            <Link href="/login" className="font-extrabold text-[#17171b] hover:text-[#e11931]">Conéctate</Link>
          </p>
          <p className="mt-5 text-center text-xs leading-5 text-[#9b989e]">
            Al registrarte aceptas nuestros{" "}
            <Link href="/terminos" className="underline hover:text-[#17171b]">términos</Link>{" "}
            y la{" "}
            <Link href="/politica-privacidad" className="underline hover:text-[#17171b]">política de privacidad</Link>.
          </p>
        </section>

        <section className="max-w-2xl px-1 pb-3 sm:px-6 lg:pb-10">
          <p className="max-w-xl text-base font-semibold leading-7 text-[#555960]">
            {isTrainer
              ? "Date de alta hoy y empieza a captar clientes con un perfil profesional de Super Entrenador."
              : "Encuentra al profesional adecuado y mantén tus conversaciones en un único lugar."}
          </p>
          {isTrainer ? (
            <ul className="mt-6 grid gap-4 text-base font-bold text-[#292d33]">
              <li className="flex items-center gap-3"><CalendarDays size={21} className="text-[#0094ff]" /> Organiza tu agenda</li>
              <li className="flex items-center gap-3"><MapPinned size={21} className="text-[#e11931]" /> Ofrece tus servicios presencial o en línea</li>
              <li className="flex items-center gap-3"><BadgeEuro size={21} className="text-[#f5a623]" /> Tú pones los precios</li>
            </ul>
          ) : (
            <ul className="mt-6 grid gap-4 text-base font-bold text-[#292d33]">
              <li className="flex items-center gap-3"><Search size={21} className="text-[#0094ff]" /> Encuentra entrenadores</li>
              <li className="flex items-center gap-3"><MessageCircleMore size={21} className="text-[#e11931]" /> Contacta fácilmente</li>
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
