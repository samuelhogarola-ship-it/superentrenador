import type { Metadata } from "next";
import Link from "next/link";
import { BadgeCheck, Check, Star, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "Premium | Super Entrenador",
  description: "Destaca tu perfil, aparece primero en búsquedas y recibe más contactos con Super Entrenador Premium.",
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
    cta: "Empezar gratis 14 días",
    ctaHref: "/registro?plan=pro",
    badge: "Más popular",
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
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-12 px-4 py-10 md:px-6 lg:px-8 lg:py-16">
      <header className="text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-[#fff0ee] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-[#ff6868]">
          <Zap size={13} />
          Super Entrenador Premium
        </span>
        <h1 className="mt-4 font-heading text-4xl font-bold text-[#17171b] sm:text-5xl">
          Más visibilidad,<br className="hidden sm:block" /> más contactos
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-[#68686f]">
          Destaca entre los mejores entrenadores, aparece primero en búsquedas y convierte más visitas en clientes reales.
        </p>
      </header>

      <div className="grid gap-6 sm:grid-cols-3">
        {PLANS.map((plan) => (
          <article
            key={plan.id}
            className={`relative flex flex-col rounded-[28px] border p-6 sm:p-7 ${
              plan.highlight
                ? "border-[#ff6868] bg-[#17171b] text-white shadow-[0_20px_60px_rgba(255,104,104,0.18)]"
                : "border-[#e2e2e2] bg-white text-[#17171b]"
            }`}
          >
            {plan.badge ? (
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-[#ff6868] px-4 py-1 text-xs font-bold text-white">
                {plan.badge}
              </span>
            ) : null}

            <div>
              <p className={`text-xs font-bold uppercase tracking-[0.14em] ${plan.highlight ? "text-[#ff6868]" : "text-[#ff6868]"}`}>
                {plan.name}
              </p>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="font-heading text-4xl font-bold">{plan.price === 0 ? "Gratis" : `${plan.price}€`}</span>
                {plan.price > 0 ? (
                  <span className={`text-sm ${plan.highlight ? "text-white/60" : "text-[#999]"}`}>/ {plan.period}</span>
                ) : null}
              </div>
              <p className={`mt-2 text-sm ${plan.highlight ? "text-white/70" : "text-[#68686f]"}`}>{plan.description}</p>
            </div>

            <ul className="mt-6 flex flex-col gap-2.5">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5 text-sm">
                  <Check size={15} className="mt-0.5 shrink-0 text-[#59c993]" />
                  <span className={plan.highlight ? "text-white/90" : "text-[#29292d]"}>{feature}</span>
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
              className={`mt-8 inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-bold transition-colors ${
                plan.highlight
                  ? "bg-[#ff6868] text-white hover:bg-[#ef5c5c]"
                  : plan.id === "gratuito"
                    ? "border border-[#e2e2e2] bg-white text-[#17171b] hover:bg-[#f5f5f5]"
                    : "bg-[#17171b] text-white hover:bg-[#29292d]"
              }`}
            >
              {plan.cta}
            </Link>
          </article>
        ))}
      </div>

      <section className="rounded-[28px] border border-[#e2e2e2] bg-white p-7 sm:p-10">
        <div className="flex flex-wrap items-center gap-4">
          <Star size={28} className="shrink-0 fill-[#ff6868] text-[#ff6868]" />
          <div>
            <h2 className="font-heading text-2xl font-bold text-[#17171b]">¿Por qué Premium?</h2>
            <p className="mt-1 text-sm text-[#68686f]">Los entrenadores Premium reciben hasta 3× más contactos que los gratuitos.</p>
          </div>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          {[
            { icon: BadgeCheck, title: "Insignia verificada", desc: "Tu ficha muestra la insignia Premium. Los clientes confían más en perfiles destacados." },
            { icon: Zap, title: "Primero en resultados", desc: "Apareces antes que los perfiles gratuitos en búsquedas y páginas de ciudad." },
            { icon: Star, title: "En portada", desc: "Tu perfil aparece en la sección destacada de la página de inicio." },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-[20px] bg-[#f7f7f7] p-5">
              <Icon size={22} className="text-[#ff6868]" />
              <h3 className="mt-3 font-semibold text-[#17171b]">{title}</h3>
              <p className="mt-1.5 text-sm leading-6 text-[#68686f]">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[28px] bg-[#17171b] px-7 py-10 text-center text-white sm:px-10">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#ff6868]">Empieza hoy</p>
        <h2 className="mt-3 font-heading text-3xl font-bold">14 días gratis, sin tarjeta</h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-white/70">
          Activa el plan Pro y comprueba si tu perfil recibe más contactos. Cancela cuando quieras.
        </p>
        <Link
          href="/registro?plan=pro"
          className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#ff6868] px-7 py-3.5 text-sm font-bold text-white hover:bg-[#ef5c5c]"
        >
          Probar Pro 14 días gratis
        </Link>
      </section>
    </main>
  );
}
