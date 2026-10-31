import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import { PlanAudienceSwitcher, type PlanAudience } from "@/components/plan-audience-switcher";
import { hasSupabaseEnv } from "@/lib/supabase/client";
import { getSupabaseSessionServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Planes para alumnos y entrenadores",
  description: "Planes para alumnos, entrenadores y centros que quieren aprender, contactar o destacar sus perfiles.",
  robots: { index: false, follow: false },
};

const STUDENT_PLANS = [
  {
    id: "alumno-gratis",
    name: "Gratuito",
    price: 0,
    period: "siempre",
    description: "Para alumnos que quieren aprender y explorar la plataforma.",
    highlight: false,
    cta: "Crear cuenta gratis",
    ctaHref: "/registro?intent=client",
    features: [
      "Acceso a la biblioteca",
      "Newsletter de Superentrenador",
      "Plataforma de aprendizaje (próximamente)",
      "Coach Studio básico",
      "Participación en la comunidad (próximamente)",
    ],
    missing: [
      "Contacto con entrenadores",
    ],
  },
  {
    id: "pase-alumno",
    name: "Pase alumno",
    price: 10,
    period: "mes",
    description: "Para alumnos que quieren contactar con entrenadores.",
    highlight: false,
    cta: "Me interesa el pase alumno",
    ctaHref: "mailto:samuel.hogarola@gmail.com?subject=Pase alumno",
    features: [
      "Todo lo del plan Gratuito",
      "Contacto con entrenadores",
      "Mensajes con los perfiles contactados",
      "1 pregunta a expertos al mes, hasta un máximo de 5 (próximamente)",
    ],
    missing: [],
  },
];

const TRAINER_PLANS = [
  {
    id: "entrenador-gratis",
    name: "Gratuito",
    price: 0,
    period: "siempre",
    description: "Para entrenadores que quieren publicar su primer perfil.",
    highlight: false,
    cta: "Crear perfil gratis",
    ctaHref: "/registro?intent=trainer",
    features: [
      "Perfil público en el marketplace",
      "Aparición estándar en búsquedas",
      "Recepción de contactos de alumnos con pase",
      "Bandeja de mensajes básica",
      "Estadísticas básicas",
      "Participación en la comunidad (próximamente)",
    ],
    missing: [
      "Perfil verificado e insignia Pro",
      "Posición prioritaria",
      "Coach Studio completo",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: 20,
    period: "mes",
    description: "Para entrenadores que quieren destacar.",
    highlight: true,
    cta: "Me interesa el plan Pro",
    ctaHref: "mailto:samuel.hogarola@gmail.com?subject=Plan Pro",
    features: [
      "Todo lo del plan Gratuito profesional",
      "Perfil verificado",
      "Insignia Pro en tu ficha",
      "Perfil destacado en resultados",
      "Estadísticas avanzadas",
      "Coach Studio completo para hasta 3 clientes",
      "Rutinas creadas con IA y revisión humana",
      "Acceso al banco de rutinas",
      "Hasta 10 consultas a expertos al mes (próximamente)",
    ],
    missing: [],
  },
  {
    id: "estudio",
    name: "Estudio",
    price: 49,
    period: "mes",
    description: "Para centros y equipos de entrenadores.",
    highlight: false,
    cta: "Hablar con ventas",
    ctaHref: "mailto:samuel.hogarola@gmail.com?subject=Plan Estudio",
    features: [
      "Todo lo del plan Pro",
      "Hasta 5 perfiles de entrenadores",
      "Panel de administración del equipo",
      "Facturación consolidada",
      "Soporte telefónico dedicado",
    ],
    missing: [],
  },
];

type Plan = (typeof STUDENT_PLANS)[number] | (typeof TRAINER_PLANS)[number];

type ViewerPlan = "anonymous" | "student-free" | "student-pass" | "trainer-free" | "trainer-pro";

async function getViewerPlan(): Promise<ViewerPlan> {
  if (!hasSupabaseEnv()) return "anonymous";

  try {
    const supabase = await getSupabaseSessionServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return "anonymous";

    const { data: subscriptionStatus } = await supabase.rpc("get_own_trainer_subscription_status");
    if (subscriptionStatus === "active") return "trainer-pro";
    if (subscriptionStatus === "inactive") return "trainer-free";

    const { data: hasStudentPass } = await supabase.rpc("has_active_student_pass");
    return hasStudentPass ? "student-pass" : "student-free";
  } catch {
    return "anonymous";
  }
}

function PlanCard({ plan, viewerPlan }: { plan: Plan; viewerPlan: ViewerPlan }) {
  const currentPlanById: Partial<Record<Plan["id"], ViewerPlan>> = {
    "alumno-gratis": "student-free",
    "pase-alumno": "student-pass",
    "entrenador-gratis": "trainer-free",
    pro: "trainer-pro",
  };
  const isCurrentPlan = currentPlanById[plan.id] === viewerPlan;
  const ctaLabel = isCurrentPlan ? "Tu plan actual" : plan.cta;
  const ctaHref = isCurrentPlan ? "/dashboard" : plan.ctaHref;

  return (
    <article
      id={plan.id}
      className={`relative flex h-full flex-col border p-6 sm:p-7 ${
        plan.highlight ? "border-[#111214] bg-[#111214] text-white" : "border-[#111214]/15 bg-white text-[#111214]"
      }`}
    >
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--accent)]">{plan.name}</p>
        <div className="mt-3 flex items-baseline gap-1">
          <span className="font-heading text-4xl font-bold">{plan.price === 0 ? "Gratis" : `${plan.price}€`}</span>
          {plan.price > 0 ? (
            <span className={`text-sm ${plan.highlight ? "text-white/60" : "text-[#8a8a92]"}`}>/ {plan.period}</span>
          ) : null}
        </div>
        <p className={`mt-2 text-sm ${plan.highlight ? "text-white/70" : "text-[#5b5b63]"}`}>{plan.description}</p>
      </div>

      <ul className="mt-6 flex flex-col gap-2.5">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5 text-sm">
            <Check size={15} className="mt-0.5 shrink-0 text-[var(--accent)]" />
            <span className={plan.highlight ? "text-white/90" : "text-[#3d3d42]"}>{feature}</span>
          </li>
        ))}
        {plan.missing.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5 text-sm opacity-40">
            <span className="mt-0.5 w-[15px] shrink-0 text-center">–</span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-8">
        <Link
          href={ctaHref}
          aria-current={isCurrentPlan ? "page" : undefined}
          data-umami-event="premium-cta"
          data-umami-event-plan={plan.id}
          className={`group inline-flex w-full items-center justify-center border-2 px-5 py-3 text-center text-sm font-bold transition-colors ${
            plan.highlight
              ? "border-[var(--accent)] bg-[var(--accent)] text-[#111214] hover:bg-transparent hover:text-[var(--accent)]"
              : plan.price === 0
                ? "border-[#111214]/15 bg-white text-[#111214] hover:border-[#111214] hover:bg-[#111214] hover:text-white"
                : "border-[#111214] bg-[#111214] text-white hover:border-[var(--accent)] hover:bg-[var(--accent)] hover:text-[#111214]"
          }`}
        >
          <span className={plan.highlight
            ? "text-[#111214] group-hover:text-[var(--accent)]"
            : plan.price === 0
              ? "text-[#111214] group-hover:text-white"
              : "text-white group-hover:text-[#111214]"
          }>
            {ctaLabel}
          </span>
        </Link>
      </div>
    </article>
  );
}

type PremiumPageProps = {
  searchParams: Promise<{ audience?: string | string[] }>;
};

export default async function PremiumPage({ searchParams }: PremiumPageProps) {
  const query = await searchParams;
  const viewerPlan = await getViewerPlan();
  const defaultAudience = viewerPlan === "trainer-free" || viewerPlan === "trainer-pro" ? "trainers" : "students";
  const requestedAudience = Array.isArray(query.audience) ? query.audience[0] : query.audience;
  const audience: PlanAudience = requestedAudience === "trainers" || requestedAudience === "students"
    ? requestedAudience
    : defaultAudience;

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 bg-white px-4 py-8 text-[#111214] md:px-6 lg:px-8 lg:py-12">
      <header className="text-center">
        <h1 className="font-heading text-2xl font-bold leading-tight text-[#111214] sm:text-3xl">
          Elige cómo usar<br className="hidden sm:block" /> Superentrenador
        </h1>
      </header>

      <PlanAudienceSwitcher
        audience={audience}
        studentPlans={(
          <section aria-labelledby="student-plans-title">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--accent)]">Para aprender y encontrar ayuda</p>
            <h2 id="student-plans-title" className="mt-2 font-heading text-3xl font-bold">Planes para alumnos</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#5b5b63]">Empieza gratis para aprender y usar las herramientas básicas. Activa el Pase alumno si quieres contactar con entrenadores.</p>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {STUDENT_PLANS.map((plan) => <PlanCard key={plan.id} plan={plan} viewerPlan={viewerPlan} />)}
            </div>
          </section>
        )}
        trainerPlans={(
          <section aria-labelledby="professional-plans-title">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--accent)]">Para publicar, captar y gestionar clientes</p>
            <h2 id="professional-plans-title" className="mt-2 font-heading text-3xl font-bold">Planes para entrenadores</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#5b5b63]">Publica tu perfil gratuitamente o elige un plan profesional para ganar visibilidad y gestionar clientes con Coach Studio.</p>
            <div className="mt-6 grid gap-5 md:grid-cols-3">
              {TRAINER_PLANS.map((plan) => <PlanCard key={plan.id} plan={plan} viewerPlan={viewerPlan} />)}
            </div>
          </section>
        )}
      />
    </main>
  );
}
