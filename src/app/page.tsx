import Link from "next/link";
import { ArrowRight, LockKeyhole, MapPin, ShieldCheck, UserCheck } from "lucide-react";
import { CategoryGrid } from "@/components/category-grid";
import { HeroSearchBar } from "@/components/hero-search-bar";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { StatsBar } from "@/components/stats-bar";
import { Testimonials } from "@/components/testimonials";
import { TrainerCard } from "@/components/trainer-card";
import {
  getMarketplaceStats,
  listAllSpecialties,
  listFeaturedTrainerProfiles,
  listMarketplaceCities,
} from "@/lib/repositories/trainers";

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Busca por ciudad y especialidad",
    body: "Filtra entre entrenadores verificados por objetivo, modalidad y precio en segundos.",
  },
  {
    step: "02",
    title: "Compara perfiles reales",
    body: "Valoraciones, experiencia y bio detallada para decidir con criterio, sin letra pequeña.",
  },
  {
    step: "03",
    title: "Desbloquea el contacto",
    body: "Inicia sesión para hablar directamente con el entrenador y arrancar tu plan.",
  },
];

export default async function Home() {
  const [featuredTrainers, cities, specialties, stats] = await Promise.all([
    listFeaturedTrainerProfiles(),
    listMarketplaceCities(),
    listAllSpecialties(),
    getMarketplaceStats(),
  ]);

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-10 px-4 py-6 md:gap-14 md:px-6 md:py-8 lg:px-8">
      <section className="app-surface relative overflow-hidden rounded-[28px] px-5 py-8 sm:rounded-[36px] sm:px-10 sm:py-14 lg:px-14 lg:py-16">
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-60"
          style={{ background: "radial-gradient(circle, rgba(201,150,47,0.16), transparent 70%)" }}
          aria-hidden="true"
        />
        <p className="app-kicker">El Superprof del entrenamiento personal</p>
        <h1 className="app-title mt-4 max-w-3xl text-3xl leading-[1.05] text-[var(--text)] sm:text-5xl lg:text-6xl">
          Encuentra a tu entrenador personal ideal, cerca de ti.
        </h1>
        <p className="app-copy mt-5 max-w-xl text-base sm:text-lg">
          Compara cientos de entrenadores verificados por ciudad, especialidad y precio. Perfiles reales,
          valoraciones reales, contacto protegido hasta que tú decidas dar el paso.
        </p>

        <div className="mt-8 max-w-3xl">
          <HeroSearchBar specialties={specialties} cities={cities} />
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
          <Link href="/entrenadores" className="font-semibold text-[var(--text)] underline-offset-4 hover:underline">
            Ver todos los entrenadores
          </Link>
          <span className="text-[var(--line-strong)]">·</span>
          <Link href="/login" className="font-semibold text-[var(--muted)] hover:text-[var(--text)]">
            Soy entrenador y quiero unirme
          </Link>
        </div>

        <div className="mt-10">
          <StatsBar
            totalTrainers={stats.totalTrainers}
            avgRating={stats.avgRating}
            totalReviews={stats.totalReviews}
            totalCities={stats.totalCities}
          />
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <Reveal>
          <SectionHeading
            eyebrow="Categorías populares"
            title="Encuentra entrenadores por especialidad"
            body="Desde pérdida de grasa hasta preparación de rendimiento: navega directo al objetivo que te interesa."
          />
        </Reveal>
        <CategoryGrid specialties={specialties} />
      </section>

      <section className="flex flex-col gap-6">
        <Reveal>
          <SectionHeading
            eyebrow="Cómo funciona"
            title="De la búsqueda al primer entrenamiento, en tres pasos"
            body="El mismo flujo simple de un marketplace premium: buscar, comparar y desbloquear contacto con confianza."
          />
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-3">
          {HOW_IT_WORKS.map((item, index) => (
            <Reveal key={item.step} delay={index * 80}>
              <div className="app-surface h-full rounded-[26px] p-6">
                <span className="font-heading text-4xl text-[var(--accent)]">{item.step}</span>
                <h3 className="mt-4 text-lg font-semibold text-[var(--text)]">{item.title}</h3>
                <p className="app-copy mt-2 text-sm">{item.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              eyebrow="Entrenadores destacados"
              title="Perfiles con mejor valoración esta semana"
              body="Verificados, con experiencia probada y disponibilidad presencial u online."
            />
            <Link
              href="/entrenadores"
              className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-[var(--line)] bg-white px-5 py-2.5 text-sm font-semibold text-[var(--text)] hover:border-[var(--line-strong)]"
            >
              Ver todos
              <ArrowRight size={15} />
            </Link>
          </div>
        </Reveal>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredTrainers.map((trainer, index) => (
            <Reveal key={trainer.id} delay={index * 80}>
              <TrainerCard trainer={trainer} featured={index === 0} />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <Reveal>
          <SectionHeading
            eyebrow="Lo que dicen los usuarios"
            title="Confianza real antes de contactar"
            body="Igual que en los marketplaces que ya conoces: decides con criterio, no a ciegas."
          />
        </Reveal>
        <Reveal delay={120}>
          <Testimonials />
        </Reveal>
      </section>

      <section className="flex flex-col gap-6">
        <Reveal>
          <SectionHeading
            eyebrow="Ciudades activas"
            title="Empezamos local, preparados para escalar"
            body="Fuengirola y Málaga ya tienen estructura lista. El mismo sistema crece por ciudad, zona y especialidad sin reconstruir el producto."
          />
        </Reveal>
        <div className="grid gap-4 md:grid-cols-3">
          {cities.map((city, index) => (
            <Reveal key={city.slug} delay={index * 80}>
              <Link
                href={`/ciudades/${city.slug}`}
                className="app-surface group relative block overflow-hidden rounded-[28px] p-6 transition-transform hover:-translate-y-1"
              >
                <div
                  className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-70 transition-transform group-hover:scale-110"
                  style={{ background: "radial-gradient(circle, rgba(201,150,47,0.18), transparent 72%)" }}
                  aria-hidden="true"
                />
                <p className="app-kicker inline-flex items-center gap-1.5">
                  <MapPin size={12} />
                  {city.region}
                </p>
                <h3 className="app-title mt-3 text-3xl text-[var(--text)]">{city.name}</h3>
                <p className="app-copy mt-4 text-sm">{city.intro}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[var(--text)]">
                  Ver entrenadores
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <Reveal>
        <section className="grid gap-6 overflow-hidden rounded-[36px] lg:grid-cols-[1.1fr_0.9fr]">
          <div className="app-surface flex flex-col justify-center rounded-[36px] px-6 py-10 sm:px-10">
            <p className="app-kicker">Confianza antes del pago</p>
            <h2 className="app-title mt-3 text-3xl text-[var(--text)] sm:text-4xl">
              El marketplace enseña valor real antes de pedir nada a cambio.
            </h2>
            <div className="mt-6 grid gap-4 text-sm text-[var(--muted)]">
              <span className="inline-flex items-start gap-3">
                <ShieldCheck size={16} className="mt-0.5 text-[var(--accent)]" />
                Verificación y reseñas reales como capa de credibilidad.
              </span>
              <span className="inline-flex items-start gap-3">
                <UserCheck size={16} className="mt-0.5 text-[var(--accent)]" />
                Especialidad, experiencia y precio claro en cada ficha.
              </span>
              <span className="inline-flex items-start gap-3">
                <LockKeyhole size={16} className="mt-0.5 text-[var(--accent)]" />
                Contacto protegido hasta que decidas avanzar a premium.
              </span>
            </div>
          </div>

          <div className="app-surface flex flex-col justify-center gap-4 rounded-[36px] bg-[var(--text)] px-6 py-10 text-white sm:px-10">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/60">¿Eres entrenador personal?</p>
            <h2 className="font-heading text-3xl leading-tight sm:text-4xl">
              Crea tu perfil público y consigue nuevos clientes cada semana.
            </h2>
            <p className="text-sm text-white/70">
              Únete al marketplace, aparece en tu ciudad y especialidad, y deja que la demanda local te encuentre.
            </p>
            <Link
              href="/login"
              className="mt-2 inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-[var(--text)] transition-transform hover:-translate-y-0.5"
            >
              Quiero unirme como entrenador
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </Reveal>
    </main>
  );
}
