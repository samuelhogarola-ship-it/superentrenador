"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, Dumbbell, ExternalLink, Loader2, Salad, Sparkles, Users } from "lucide-react";
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
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    async function load() {
      const supabase = getSupabaseBrowserClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

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
  }, []);

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
          <div className="min-w-0 flex-1">
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
          Tu área de trabajo profesional. Rutinas, planes de nutrición y gestión de clientes desde
          un único panel.
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
          <p className="font-heading text-4xl text-[var(--text)]">
            49<span className="text-xl">€</span>
            <span className="text-lg font-normal text-[var(--muted)]">/mes</span>
          </p>
          <p className="mt-1 text-xs text-[var(--muted)]">Sin permanencia. Cancela cuando quieras.</p>
        </div>

        <ul className="flex w-full flex-col gap-2 text-left">
          {[
            "Rutinas personalizadas ilimitadas",
            "Planes de nutrición",
            "Gestión de clientes",
            "Soporte prioritario",
          ].map((item) => (
            <li key={item} className="flex items-center gap-2.5 text-sm text-[var(--text)]">
              <CheckCircle size={15} className="shrink-0 text-emerald-500" />
              {item}
            </li>
          ))}
        </ul>

        <a
          href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "soporte@superentrenador.com"}?subject=Quiero%20activar%20Coach%20Studio`}
          className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-6 py-3.5 text-sm font-semibold text-[var(--ink)] transition-transform hover:-translate-y-0.5"
        >
          Contactar para activar
        </a>

        <p className="text-xs text-[var(--muted)]">
          Te activamos el acceso en menos de 24 h.
        </p>
      </div>
    </main>
  );
}
