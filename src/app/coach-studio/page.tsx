"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, Dumbbell, Salad, Users, ExternalLink, Loader2, Sparkles } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

const FEATURES = [
  {
    icon: Dumbbell,
    title: "Rutinas personalizadas",
    desc: "Crea y asigna programas de entrenamiento completos a cada cliente.",
  },
  {
    icon: Salad,
    title: "Planes de nutrición",
    desc: "Diseña dietas adaptadas a los objetivos y preferencias de tus clientes.",
  },
  {
    icon: Users,
    title: "Gestión de clientes",
    desc: "Ficha completa por cliente, historial de progreso y seguimiento en tiempo real.",
  },
];

type Status = "loading" | "unauthenticated" | "no-profile" | "inactive" | "active";

export default function CoachStudioPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto flex w-full max-w-3xl flex-1 items-center justify-center px-4 py-20">
          <Loader2 size={28} className="animate-spin text-[var(--muted)]" />
        </main>
      }
    >
      <CoachStudioContent />
    </Suspense>
  );
}

function CoachStudioContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<Status>("loading");
  const [paying, setPaying] = useState(false);

  const isSuccess = searchParams.get("success") === "1";

  useEffect(() => {
    if (isSuccess) {
      return;
    }

    async function load() {
      const supabase = getSupabaseBrowserClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setStatus("unauthenticated");
        return;
      }

      const { data } = await supabase
        .from("trainer_profiles")
        .select("subscription_status")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!data) {
        setStatus("no-profile");
        return;
      }

      setStatus(data.subscription_status === "active" ? "active" : "inactive");
    }

    load();
  }, [isSuccess]);

  async function handleSubscribe() {
    setPaying(true);
    const supabase = getSupabaseBrowserClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      router.push("/login");
      return;
    }

    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accessToken: session.access_token }),
    });

    const { url, error } = await res.json();
    if (error || !url) {
      setPaying(false);
      alert("Error al iniciar el pago. Inténtalo de nuevo.");
      return;
    }

    window.location.href = url;
  }

  if (isSuccess) {
    return (
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-5 px-4 py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
          <CheckCircle size={32} className="text-emerald-500" />
        </div>
        <h1 className="font-heading text-2xl text-[var(--text)]">¡Pago completado!</h1>
        <p className="app-copy max-w-md">
          Estamos activando tu acceso a Coach Studio. En unos segundos ya podrás entrar.
        </p>
        <button
          onClick={() => router.push("/coach-studio")}
          className="rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-[var(--ink)]"
        >
          Comprobar acceso
        </button>
      </main>
    );
  }

  if (status === "loading") {
    return (
      <main className="mx-auto flex w-full max-w-3xl flex-1 items-center justify-center px-4 py-20">
        <Loader2 size={28} className="animate-spin text-[var(--muted)]" />
      </main>
    );
  }

  if (status === "unauthenticated") {
    return (
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-4 px-4 py-20 text-center">
        <p className="app-copy">Necesitas iniciar sesión para acceder a Coach Studio.</p>
        <button
          onClick={() => router.push("/login")}
          className="rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-[var(--ink)]"
        >
          Iniciar sesión
        </button>
      </main>
    );
  }

  if (status === "no-profile") {
    return (
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-4 px-4 py-20 text-center">
        <p className="app-copy">
          Primero completa tu perfil de entrenador para acceder a Coach Studio.
        </p>
        <button
          onClick={() => router.push("/mi-perfil")}
          className="rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-[var(--ink)]"
        >
          Completar perfil
        </button>
      </main>
    );
  }

  if (status === "active") {
    return (
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-4 py-12 md:px-6">
        <div>
          <p className="app-kicker">Tu suscripción</p>
          <h1 className="app-title mt-1 text-3xl text-[var(--text)]">Coach Studio</h1>
          <p className="app-copy mt-2 text-sm">Suscripción activa — accede a tu área de trabajo.</p>
        </div>

        <div className="app-surface flex flex-col gap-5 rounded-[28px] p-6 sm:flex-row sm:items-center sm:gap-8">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--accent)] shadow-[var(--shadow-soft)]">
            <Sparkles size={26} className="text-[var(--ink)]" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-heading text-lg text-[var(--text)]">Acceder a Coach Studio</h2>
            <p className="mt-0.5 text-sm text-[var(--muted)]">
              Rutinas, dietas y gestión de clientes en un solo lugar.
            </p>
          </div>
          <a
            href={process.env.NEXT_PUBLIC_COACH_STUDIO_URL ?? "#"}
            target="_blank"
            rel="noreferrer"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-[var(--ink)] transition-transform hover:-translate-y-0.5"
          >
            Ir a Coach Studio
            <ExternalLink size={14} />
          </a>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="app-surface rounded-[20px] p-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--accent-soft)]">
                <Icon size={18} className="text-[var(--accent)]" />
              </div>
              <h3 className="mt-3 text-sm font-semibold text-[var(--text)]">{title}</h3>
              <p className="mt-1 text-xs text-[var(--muted)]">{desc}</p>
            </div>
          ))}
        </div>
      </main>
    );
  }

  // inactive — paywall
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-10 px-4 py-12 md:px-6">
      <div className="text-center">
        <p className="app-kicker">Para entrenadores</p>
        <h1 className="app-title mt-2 text-3xl text-[var(--text)]">Coach Studio</h1>
        <p className="app-copy mx-auto mt-3 max-w-lg text-base">
          Tu área de trabajo profesional. Crea rutinas, planes de nutrición y gestiona a todos tus clientes desde un único panel.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {FEATURES.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="app-surface rounded-[20px] p-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--accent-soft)]">
              <Icon size={18} className="text-[var(--accent)]" />
            </div>
            <h3 className="mt-3 text-sm font-semibold text-[var(--text)]">{title}</h3>
            <p className="mt-1 text-xs text-[var(--muted)]">{desc}</p>
          </div>
        ))}
      </div>

      <div className="app-surface mx-auto flex w-full max-w-sm flex-col items-center gap-6 rounded-[28px] p-8 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--accent)] shadow-[var(--shadow-soft)]">
          <Sparkles size={26} className="text-[var(--ink)]" />
        </div>

        <div>
          <p className="text-4xl font-heading text-[var(--text)]">
            49<span className="text-xl">€</span>
            <span className="text-lg font-normal text-[var(--muted)]">/mes</span>
          </p>
          <p className="mt-1 text-xs text-[var(--muted)]">Sin permanencia. Cancela cuando quieras.</p>
        </div>

        <ul className="flex w-full flex-col gap-2 text-left">
          {["Rutinas personalizadas ilimitadas", "Planes de nutrición", "Gestión de clientes", "Soporte prioritario"].map((item) => (
            <li key={item} className="flex items-center gap-2.5 text-sm text-[var(--text)]">
              <CheckCircle size={15} className="shrink-0 text-emerald-500" />
              {item}
            </li>
          ))}
        </ul>

        <button
          onClick={handleSubscribe}
          disabled={paying}
          className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-6 py-3.5 text-sm font-semibold text-[var(--ink)] transition-transform hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {paying ? <Loader2 size={16} className="animate-spin" /> : null}
          {paying ? "Redirigiendo…" : "Suscribirse ahora"}
        </button>

        <p className="text-xs text-[var(--muted)]">
          Pago seguro con Stripe. Recibirás un email de confirmación.
        </p>
      </div>
    </main>
  );
}
