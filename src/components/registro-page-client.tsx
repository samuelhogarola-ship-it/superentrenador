"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { BadgeEuro, CalendarDays, Dumbbell, MapPinned, MessageCircleMore, Search } from "lucide-react";
import { AuthAlternativeMethods } from "@/components/auth-alternative-methods";
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
    <main className="flex min-h-[calc(100svh-72px)] flex-1 items-center bg-[#fff8e8] px-4 py-10 md:px-8">
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
    <main className="relative flex min-h-[calc(100svh-72px)] flex-1 items-center overflow-hidden bg-[#fff8e8] px-4 py-10 text-[#17171b] md:px-8 lg:py-16">
      <div aria-hidden className="absolute -right-32 -top-40 h-[36rem] w-[36rem] rounded-full bg-[#ffc84a] opacity-95" />
      <div aria-hidden className="absolute -bottom-56 -left-36 h-[30rem] w-[30rem] rounded-full bg-[#e11931]/8" />

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-20">
        <section className="max-w-2xl px-2 py-4 sm:px-6 lg:py-12">
          <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#e11931]">
            {isTrainer ? "Para entrenadores" : "Para alumnos"}
          </p>
          <h1 className="mt-5 font-heading text-4xl font-extrabold leading-[1.05] tracking-[-0.05em] text-[#17171b] sm:text-5xl lg:text-6xl">
            {isTrainer ? "Convierte tu experiencia en nuevos clientes." : "Empieza a entrenar a tu manera."}
          </h1>
          <p className="mt-6 max-w-xl text-lg font-medium leading-8 text-[#57545b]">
            {isTrainer
              ? "Date de alta hoy y empieza a captar clientes con un perfil profesional hecho para entrenadores personales."
              : "Crea tu cuenta para contactar con profesionales, guardar tus conversaciones y encontrar el entrenamiento que necesitas."}
          </p>

          {isTrainer ? (
            <ul className="mt-8 grid gap-4 text-base font-bold text-[#29272d] sm:grid-cols-2">
              <li className="flex items-center gap-3"><CalendarDays size={21} className="text-[#0094ff]" /> Organiza tu agenda</li>
              <li className="flex items-center gap-3"><MapPinned size={21} className="text-[#e11931]" /> Presencial o en línea</li>
              <li className="flex items-center gap-3"><BadgeEuro size={21} className="text-[#f5a623]" /> Pon tus propios precios</li>
              <li className="flex items-center gap-3"><Dumbbell size={21} className="text-[#0094ff]" /> Ofrece tus servicios</li>
            </ul>
          ) : (
            <ul className="mt-8 grid gap-4 text-base font-bold text-[#29272d] sm:grid-cols-2">
              <li className="flex items-center gap-3"><Search size={21} className="text-[#0094ff]" /> Encuentra entrenadores</li>
              <li className="flex items-center gap-3"><MessageCircleMore size={21} className="text-[#e11931]" /> Contacta fácilmente</li>
            </ul>
          )}
        </section>

        <section className="relative min-w-0 rounded-[32px] bg-white p-6 shadow-[0_28px_80px_rgba(57,45,20,0.18)] sm:p-10">
          <h2 className="font-heading text-3xl font-extrabold tracking-[-0.04em] text-[#17171b]">
            {isTrainer ? "Crea tu perfil" : "Crea tu cuenta"}
          </h2>
          <p className="mt-2 text-sm font-medium text-[#77737b]">Gratis, rápido y sin pasos innecesarios.</p>

          <div className="mt-7">
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
            <Link href="/login" className="font-extrabold text-[#17171b] hover:text-[#e11931]">Conexión</Link>
          </p>
          <p className="mt-5 text-center text-xs leading-5 text-[#9b989e]">
            Al registrarte aceptas nuestros{" "}
            <Link href="/terminos" className="underline hover:text-[#17171b]">términos</Link>{" "}
            y la{" "}
            <Link href="/politica-privacidad" className="underline hover:text-[#17171b]">política de privacidad</Link>.
          </p>
        </section>
      </div>
    </main>
  );
}
