import type { Metadata } from "next";
import Link from "next/link";
import { BadgeCheck, Check, Star, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "Premium | Super Entrenador",
  description: "Destaca tu perfil, aparece primero en búsquedas y recibe más contactos con Super Entrenador Premium.",
  robots: { index: false, follow: false },
};

const PLANS = [
  {
    id: "gratuito",
    name: "Gratuito",
    price: 0,
    period: "siempre",
    description: "Para probar el marketplace.",
    highlight: false,
    cta: "Tu plan actual",
    ctaHref: "/dashboard",
    features: [
      "Perfil público en el marketplace",
      "Aparición en búsquedas estándar",
      "Bandeja de mensajes ilimitada",
      "Estadísticas básicas",
    ],
    missing: [
      "Posición destacada en resultados",
      "Insignia Premium en tu ficha",
      "Aparición en portada",
      "Soporte prioritario",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: 19,
    period: "mes",
    description: "Para entrenadores que quieren destacar.",
    highlight: true,
    cta: "Solicitar acceso Pro",
    ctaHref: "mailto:samuel.hogarola@gmail.com?subject=Plan Pro",
    badge: "Acceso anticipado",
    features: [
      "Todo lo del plan Gratuito",
      "Posición destacada en resultados",
      "Insignia Premium en tu ficha",
      "Aparición en portada del marketplace",
      "Estadísticas avanzadas",
      "Soporte prioritario por email",
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

export default function PremiumPage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-14 bg-white px-4 py-12 text-[#111214] md:px-6 lg:px-8 lg:py-20">
      <header className="text-center">
        <span className="inline-flex items-center gap-2 border border-[#111214]/15 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[var(--accent)]">
          <Zap size={13} />
          Super Entrenador Premium
        </span>
        <h1 className="mt-5 font-heading text-4xl font-bold leading-[1.05] text-[#111214] sm:text-6xl">
          Más visibilidad,<br className="hidden sm:block" /> más contactos
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-[#5b5b63]">
          Destaca entre los mejores entrenadores, aparece primero en búsquedas y convierte más visitas en clientes reales.
        </p>
      </header>

      <div className="grid gap-6 sm:grid-cols-3">
        {PLANS.map((plan) => (
          <article
            key={plan.id}
            className={`relative flex flex-col border p-6 sm:p-7 ${
              plan.highlight ? "border-[#111214] bg-[#111214] text-white" : "border-[#111214]/15 bg-white text-[#111214]"
            }`}
          >
            {plan.badge ? (
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[var(--accent)] px-4 py-1 text-xs font-bold text-[#111214]">
                {plan.badge}
              </span>
            ) : null}

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
                  <span className="mt-0.5 shrink-0 w-[15px] text-center">–</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Link
              href={plan.ctaHref}
              className={`mt-8 inline-flex items-center justify-center px-5 py-3 text-sm font-bold transition-colors ${
                plan.highlight
                  ? "bg-[var(--accent)] text-[#111214] hover:bg-white"
                  : plan.id === "gratuito"
                    ? "border border-[#111214]/15 bg-white text-[#111214] hover:border-[#111214]"
                    : "bg-[#111214] text-white hover:bg-[var(--accent)] hover:text-[#111214]"
              }`}
            >
              {plan.cta}
            </Link>
          </article>
        ))}
      </div>

      <section className="border border-[#111214]/15 bg-white p-7 sm:p-10">
        <div className="flex flex-wrap items-center gap-4">
          <Star size={28} className="shrink-0 fill-[var(--accent)] text-[var(--accent)]" />
          <div>
            <h2 className="font-heading text-2xl font-bold text-[#111214]">¿Por qué Premium?</h2>
            <p className="mt-1 text-sm text-[#5b5b63]">Estamos validando qué herramientas generan más visibilidad y contactos de calidad.</p>
          </div>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          {[
            { icon: BadgeCheck, title: "Insignia verificada", desc: "Tu ficha muestra la insignia Premium. Los clientes confían más en perfiles destacados." },
            { icon: Zap, title: "Primero en resultados", desc: "Apareces antes que los perfiles gratuitos en búsquedas y páginas de ciudad." },
            { icon: Star, title: "En portada", desc: "Tu perfil aparece en la sección destacada de la página de inicio." },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="border border-[#111214]/12 bg-[#fafafa] p-5">
              <Icon size={22} className="text-[var(--accent)]" />
              <h3 className="mt-3 font-semibold text-[#111214]">{title}</h3>
              <p className="mt-1.5 text-sm leading-6 text-[#5b5b63]">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border border-[#111214] bg-[#111214] px-7 py-12 text-center text-white sm:px-10">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--accent)]">Acceso anticipado</p>
        <h2 className="mt-3 font-heading text-3xl font-bold">Escríbenos y lo activamos a mano</h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-white/70">
          El cobro automático de Premium todavía no está disponible. Cuéntanos tu caso y activamos el plan Pro en tu perfil manualmente.
        </p>
        <Link
          href="mailto:samuel.hogarola@gmail.com?subject=Plan Pro"
          className="mt-7 inline-flex items-center gap-2 border-2 border-[var(--accent)] bg-[var(--accent)] px-7 py-3.5 text-sm font-bold text-[#111214] transition-colors hover:bg-transparent hover:text-[var(--accent)]"
        >
          Solicitar acceso Pro
        </Link>
      </section>
    </main>
  );
}
