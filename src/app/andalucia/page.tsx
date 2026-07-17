import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPin, ShieldCheck } from "lucide-react";
import { JsonLd } from "@/components/json-ld";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { isAndaluciaCity, sortCitiesByName } from "@/lib/coverage";
import { listMarketplaceCities, listPublicTrainerProfiles } from "@/lib/repositories/trainers";
import { siteConfig } from "@/lib/site";

const ANDALUCIA_DESCRIPTION =
  "Marketplace de entrenadores personales en Andalucía. Compara perfiles por ciudad, especialidad, modalidad, experiencia y precio antes de contactar.";

export async function generateMetadata(): Promise<Metadata> {
  const trainers = await listPublicTrainerProfiles();

  return {
    title: "Entrenadores personales en Andalucía",
    description: ANDALUCIA_DESCRIPTION,
    alternates: {
      canonical: "/andalucia",
    },
    robots: trainers.length > 0 ? undefined : { index: false, follow: true },
  };
}

export default async function AndaluciaPage() {
  const cities = sortCitiesByName((await listMarketplaceCities()).filter(isAndaluciaCity));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Entrenadores personales en Andalucía",
    description: ANDALUCIA_DESCRIPTION,
    url: `${siteConfig.url}/andalucia`,
    hasPart: cities.map((city) => ({
      "@type": "WebPage",
      name: city.heroTitle,
      url: `${siteConfig.url}/ciudades/${city.slug}`,
    })),
  };

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-4 py-6 md:px-6 md:py-8 lg:px-8">
      <JsonLd data={jsonLd} />
      <section className="premium-hero rounded-[32px] p-6 sm:p-8 lg:p-10">
        <div className="relative grid gap-8 lg:grid-cols-[1fr_340px] lg:items-end">
          <SectionHeading
            eyebrow="Cobertura Andalucía"
            title="Entrenadores personales en Andalucía, ciudad por ciudad"
            body="Estamos desplegando el marketplace por territorios con páginas claras para comparar entrenadores, captar profesionales y contactar con más criterio. Andalucía queda como primera región completa antes de escalar al resto de España."
            titleAs="h1"
          />
          <aside className="premium-card rounded-[24px] p-5">
            <p className="app-kicker">Estado actual</p>
            <strong className="mt-4 block font-heading text-5xl text-[var(--text)]">{cities.length}</strong>
            <p className="app-copy mt-2 text-sm">ciudades andaluzas preparadas para comparar perfiles, captar entrenadores y validar demanda.</p>
          </aside>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-3">
        {["Capitales cubiertas", "Costa del Sol priorizada", "Listo para ampliar a España"].map((item) => (
          <div key={item} className="rounded-[18px] border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-sm font-semibold text-[var(--text)]">
            <span className="inline-flex items-center gap-2">
              <ShieldCheck size={15} className="text-[var(--accent)]" />
              {item}
            </span>
          </div>
        ))}
      </section>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {cities.map((city, index) => (
          <Reveal key={city.slug} delay={Math.min(index, 6) * 50}>
            <Link
              href={`/ciudades/${city.slug}`}
              className="premium-card group flex h-full flex-col rounded-[24px] p-6 transition duration-200 hover:-translate-y-0.5 hover:border-[var(--line-strong)] hover:shadow-[var(--shadow)]"
            >
              <p className="app-kicker inline-flex items-center gap-1.5">
                <MapPin size={12} />
                {city.region}
              </p>
              <h2 className="app-title mt-3 text-3xl text-[var(--text)]">{city.name}</h2>
              <p className="app-copy mt-4 flex-1 text-sm">{city.intro}</p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[var(--accent)]">
                Ver entrenadores
                <ArrowRight size={15} />
              </span>
            </Link>
          </Reveal>
        ))}
      </section>
    </main>
  );
}
