import Link from "next/link";
import { ArrowRight, BadgeCheck, BookOpen, CheckCircle2, MapPin, ShieldCheck, Sparkles, Target } from "lucide-react";
import { CategoryGrid } from "@/components/category-grid";
import { HeroSearchBar } from "@/components/hero-search-bar";
import { JsonLd } from "@/components/json-ld";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { StatsBar } from "@/components/stats-bar";
import { TrainerCard } from "@/components/trainer-card";
import { listBlogPosts } from "@/lib/blog";
import { isAndaluciaCity, sortCitiesByName } from "@/lib/coverage";
import { marketplaceWebsiteJsonLd, trainerCollectionJsonLd } from "@/lib/marketplace-seo";
import { siteConfig } from "@/lib/site";
import {
  getMarketplaceStats,
  listAllSpecialties,
  listFeaturedTrainerProfiles,
  listMarketplaceCities,
} from "@/lib/repositories/trainers";

const HERO_POINTS = [
  "Andalucía preparada como primera región comercial.",
  "Plazas abiertas para entrenadores fundadores.",
  "Contacto protegido para conversaciones con intención real.",
];

const TRUST_SIGNALS = [
  { value: "13", label: "ciudades preparadas para captación local" },
  { value: "0 ruido", label: "sin feeds, anuncios ni perfiles inflados" },
  { value: "1 región", label: "Andalucía como primer mercado completo" },
];

const FLOW_STEPS = [
  {
    icon: Target,
    title: "Define el objetivo",
    body: "Fuerza, pérdida de grasa, posparto, rendimiento o seguimiento online. El filtro empieza por intención real.",
  },
  {
    icon: BadgeCheck,
    title: "Compara señal útil",
    body: "Experiencia, modalidad, precio de entrada y especialidad aparecen en el mismo lenguaje visual.",
  },
  {
    icon: ShieldCheck,
    title: "Contacta con control",
    body: "El marketplace protege el contacto y empuja conversaciones más serias para usuarios y entrenadores.",
  },
];

export default async function Home() {
  const [featuredTrainers, cities, specialties, stats] = await Promise.all([
    listFeaturedTrainerProfiles(),
    listMarketplaceCities(),
    listAllSpecialties(),
    getMarketplaceStats(),
  ]);
  const andaluciaCities = sortCitiesByName(cities.filter(isAndaluciaCity));
  const latestPosts = listBlogPosts().slice(0, 3);

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-14 px-4 py-8 md:px-6 md:py-10 lg:px-8">
      <JsonLd data={marketplaceWebsiteJsonLd()} />
      <JsonLd data={trainerCollectionJsonLd(featuredTrainers, siteConfig.url, "Entrenadores personales destacados")} />
      <section className="premium-hero rounded-[32px] p-6 sm:p-8 lg:p-10">
        <div className="relative grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
          <div>
            <p className="app-kicker inline-flex items-center gap-2">
              <Sparkles size={13} />
              Marketplace premium en lanzamiento
            </p>
            <h1 className="app-title mt-4 max-w-4xl text-4xl leading-[0.98] sm:text-6xl lg:text-7xl">
              Entrenadores personales con presencia local desde el primer día.
            </h1>
            <p className="app-copy mt-6 max-w-2xl text-lg">
              Estamos activando Andalucía con perfiles claros, contacto protegido y landings locales preparadas para captar demanda ciudad por ciudad.
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

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/entrenadores"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-bold text-white shadow-[0_18px_36px_rgba(22,101,52,0.22)] transition-transform hover:-translate-y-0.5"
              >
                Ver marketplace
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/registro"
                className="inline-flex items-center gap-2 rounded-full border border-[var(--line-strong)] bg-white/70 px-6 py-3 text-sm font-bold text-[var(--text)] backdrop-blur transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                Publicar como fundador
              </Link>
            </div>
          </div>

          <aside className="premium-card rounded-[28px] p-5">
            <p className="app-kicker">Por qué funciona</p>
            <div className="mt-5 grid gap-4">
              {TRUST_SIGNALS.map((signal) => (
                <div key={signal.label} className="rounded-[20px] border border-[var(--line)] bg-white/70 p-4">
                  <strong className="font-heading text-3xl text-[var(--text)]">{signal.value}</strong>
                  <p className="mt-1 text-sm leading-6 text-[var(--muted)]">{signal.label}</p>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section>
        <StatsBar
          totalTrainers={stats.totalTrainers}
          totalCities={stats.totalCities}
        />
      </section>

      <section className="flex flex-col gap-6">
        <Reveal>
          <SectionHeading
            eyebrow="Accesos rápidos"
            title="Empieza por el resultado que quieres conseguir"
            body="El marketplace no te obliga a navegar como una red social: filtra por intención y llega antes a una lista corta."
          />
        </Reveal>
        <CategoryGrid specialties={specialties} />
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {FLOW_STEPS.map((step, index) => {
          const Icon = step.icon;
          return (
            <Reveal key={step.title} delay={index * 80}>
              <article className="premium-card h-full rounded-[24px] p-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]">
                  <Icon size={19} />
                </span>
                <h2 className="app-title mt-5 text-2xl text-[var(--text)]">{step.title}</h2>
                <p className="app-copy mt-3 text-sm">{step.body}</p>
              </article>
            </Reveal>
          );
        })}
      </section>

      <section className="flex flex-col gap-6">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              eyebrow="Perfiles destacados"
              title="Perfiles que ya parecen una decisión seria"
              body="Cada ficha publicada muestra señal comercial útil: especialidad, revisión editorial, precio de entrada y formato de trabajo."
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
          {featuredTrainers.length > 0 ? (
            featuredTrainers.map((trainer, index) => (
              <Reveal key={trainer.id} delay={index * 80}>
                <TrainerCard trainer={trainer} featured={index === 0} />
              </Reveal>
            ))
          ) : (
            <Reveal>
              <div className="premium-card rounded-[24px] p-6 md:col-span-2 lg:col-span-3">
                <p className="app-kicker">Oferta inicial</p>
                <h3 className="app-title mt-3 text-2xl text-[var(--text)]">
                  Estamos seleccionando los primeros perfiles publicados.
                </h3>
                <p className="app-copy mt-3 max-w-2xl text-sm">
                  Si eres entrenador en Andalucía, puedes entrar como perfil fundador y aparecer antes de abrir campañas locales a clientes.
                </p>
                <Link
                  href="/registro"
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-bold text-white transition-colors hover:opacity-95"
                >
                  Crear perfil fundador
                  <ArrowRight size={15} />
                </Link>
              </div>
            </Reveal>
          )}
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              eyebrow="Cobertura Andalucía"
              title="Andalucía queda lista como primera región comercial"
              body="Capitales y plazas de alta demanda con landings locales para SEO, captación de entrenadores y validación de mercado antes de escalar al resto de España."
            />
            <Link
              href="/andalucia"
              className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-[var(--line-strong)] bg-[var(--surface)] px-5 py-2.5 text-sm font-semibold text-[var(--text)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              Ver Andalucía
              <ArrowRight size={15} />
            </Link>
          </div>
        </Reveal>
        <div className="grid gap-4 md:grid-cols-3">
          {andaluciaCities.slice(0, 6).map((city, index) => (
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

      <section className="flex flex-col gap-6">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              eyebrow="Blog"
              title="Guías para decidir mejor antes de contactar"
              body="Contenido práctico para clientes que comparan entrenadores y profesionales que quieren publicar una ficha más fuerte desde el lanzamiento."
            />
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-[var(--line-strong)] bg-[var(--surface)] px-5 py-2.5 text-sm font-semibold text-[var(--text)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              Ver blog
              <BookOpen size={15} />
            </Link>
          </div>
        </Reveal>
        <div className="grid gap-4 md:grid-cols-3">
          {latestPosts.map((post, index) => (
            <Reveal key={post.slug} delay={index * 80}>
              <Link
                href={`/blog/${post.slug}`}
                className="group flex h-full flex-col rounded-[22px] border border-[var(--line)] bg-[var(--surface)] p-6 shadow-[var(--shadow-soft)] transition duration-200 hover:-translate-y-0.5 hover:border-[var(--line-strong)]"
              >
                <p className="app-kicker">{post.category}</p>
                <h3 className="app-title mt-3 text-2xl text-[var(--text)]">{post.title}</h3>
                <p className="app-copy mt-3 flex-1 text-sm">{post.excerpt}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[var(--accent)]">
                  Leer guía
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
              Publica tu perfil fundador y entra antes de abrir tráfico local.
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
