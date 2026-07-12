import Link from "next/link";
import { ArrowRight, CheckCircle2, MapPin } from "lucide-react";
import { CategoryGrid } from "@/components/category-grid";
import { HeroSearchBar } from "@/components/hero-search-bar";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { StatsBar } from "@/components/stats-bar";
import { TrainerCard } from "@/components/trainer-card";
import {
  getMarketplaceStats,
  listAllSpecialties,
  listFeaturedTrainerProfiles,
  listMarketplaceCities,
} from "@/lib/repositories/trainers";

const HERO_POINTS = [
  "Ciudad, especialidad y modalidad en un solo paso.",
  "Perfiles comparables con señal suficiente para decidir.",
  "Contacto protegido hasta que tengas claro a quién escribir.",
];

export default async function Home() {
  const [featuredTrainers, cities, specialties, stats] = await Promise.all([
    listFeaturedTrainerProfiles(),
    listMarketplaceCities(),
    listAllSpecialties(),
    getMarketplaceStats(),
  ]);

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-14 px-4 py-8 md:px-6 md:py-10 lg:px-8">
      <section className="rounded-[28px] border border-[var(--line)] bg-[var(--surface)] p-6 shadow-[var(--shadow)] sm:p-8 lg:p-10">
        <p className="app-kicker">Marketplace de entrenadores</p>
        <h1 className="app-title mt-4 max-w-3xl text-4xl leading-[1.02] sm:text-6xl">
          Encuentra entrenador personal en tu ciudad sin adivinar.
        </h1>
        <p className="app-copy mt-5 max-w-2xl text-lg">
          Busca por ciudad y especialidad, compara perfiles claros y escribe solo cuando tengas criterio para elegir.
        </p>

        <div className="mt-8 max-w-4xl">
          <HeroSearchBar specialties={specialties} cities={cities} />
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[var(--muted)]">
          {HERO_POINTS.map((item) => (
            <span key={item} className="inline-flex items-center gap-2">
              <CheckCircle2 size={15} className="text-[var(--accent)]" />
              {item}
            </span>
          ))}
        </div>

        <div className="mt-6">
          <Link
            href="/registro"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--text)] underline decoration-[var(--line-strong)] underline-offset-4 transition-colors hover:text-[var(--accent)]"
          >
            Soy entrenador
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      <section>
        <StatsBar
          totalTrainers={stats.totalTrainers}
          avgRating={stats.avgRating}
          totalReviews={stats.totalReviews}
          totalCities={stats.totalCities}
        />
      </section>

      <section className="flex flex-col gap-6">
        <Reveal>
          <SectionHeading
            eyebrow="Accesos rápidos"
            title="Empieza por el objetivo que ya tienes en mente"
            body="Atajos para navegar directo a la especialidad que te interesa, sin recorrer el marketplace completo."
          />
        </Reveal>
        <CategoryGrid specialties={specialties} />
      </section>

      <section className="flex flex-col gap-6">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              eyebrow="Perfiles destacados"
              title="Una selección para empezar a comparar con ventaja"
              body="Perfiles bien presentados, con señal suficiente para decidir si merece la pena profundizar."
            />
            <Link
              href="/entrenadores"
              className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-[var(--line-strong)] bg-[var(--surface)] px-5 py-2.5 text-sm font-semibold text-[var(--text)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
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
            eyebrow="Cobertura actual"
            title="Ciudades activas con estructura lista para crecer"
            body="Landings locales para empezar por demanda real y expandir sin rehacer el producto."
          />
        </Reveal>
        <div className="grid gap-4 md:grid-cols-3">
          {cities.map((city, index) => (
            <Reveal key={city.slug} delay={index * 80}>
              <Link
                href={`/ciudades/${city.slug}`}
                className="group block rounded-[20px] border border-[var(--line)] bg-[var(--surface)] p-6 shadow-[var(--shadow-soft)] transition-colors hover:border-[var(--accent)]"
              >
                <p className="app-kicker inline-flex items-center gap-1.5">
                  <MapPin size={12} />
                  {city.region}
                </p>
                <h3 className="app-title mt-3 text-2xl text-[var(--text)]">{city.name}</h3>
                <p className="app-copy mt-4 text-sm">{city.intro}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent)]">
                  Ver entrenadores
                  <ArrowRight size={14} />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <Reveal>
        <section className="grid gap-6 rounded-[28px] bg-[var(--accent)] px-6 py-8 text-white sm:px-8 sm:py-10 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/70">Para entrenadores</p>
            <h2 className="font-heading mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
              Publica tu perfil y conviértete en una opción clara para clientes locales.
            </h2>
            <p className="mt-4 max-w-2xl text-sm text-white/78">
              Crea una ficha pública, recibe mensajes desde el marketplace y deja listo el salto a Coach Studio cuando actives la parte profesional.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/registro"
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-[var(--accent)] transition-colors hover:opacity-95"
            >
              Crear cuenta
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/coach-studio"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Ver Coach Studio
            </Link>
          </div>
        </section>
      </Reveal>
    </main>
  );
}
