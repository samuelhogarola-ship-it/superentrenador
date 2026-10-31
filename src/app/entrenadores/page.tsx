import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight } from "lucide-react";
import { FiltersBar } from "@/components/filters-bar";
import { JsonLd } from "@/components/json-ld";
import { MarketplaceEmptyState } from "@/components/marketplace-empty-state";
import { Reveal } from "@/components/reveal";
import { TrainerListItem } from "@/components/trainer-list-item";
import { trainerCollectionJsonLd } from "@/lib/marketplace-seo";
import { createSocialMetadata, siteConfig } from "@/lib/site";
import {
  listAllCategories,
  listAllSpecialties,
  listMarketplaceCities,
  listPublicTrainerProfiles,
} from "@/lib/repositories/trainers";

interface TrainersPageProps {
  searchParams: Promise<{ q?: string; category?: string; specialty?: string; city?: string; modality?: string; nearby?: string; maxPrice?: string; sort?: string }>;
}

function citySlug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("es")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function generateMetadata(): Promise<Metadata> {
  const trainers = await listPublicTrainerProfiles();
  const hasPublishedSupply = trainers.length > 0;
  const description = hasPublishedSupply
    ? "Explora perfiles públicos de entrenadores por categoría, ciudad, especialidad y formato antes de contactar."
    : "Explora perfiles locales de entrenadores por categoría, ciudad y modalidad.";

  return {
    title: "Entrenadores por categoría",
    description,
    alternates: {
      canonical: "/entrenadores",
    },
    ...createSocialMetadata("Entrenadores por categoría", description, "/entrenadores"),
    robots: hasPublishedSupply ? undefined : { index: false, follow: true },
  };
}

export default async function TrainersPage({ searchParams }: TrainersPageProps) {
  const params = await searchParams;
  const [categories, specialties, cities] = await Promise.all([
    listAllCategories(),
    listAllSpecialties(),
    listMarketplaceCities(),
  ]);
  const requestedCity = params.city?.trim();
  const selectedCity = requestedCity
    ? cities.find((city) => city.slug === requestedCity || city.name.toLocaleLowerCase("es") === requestedCity.toLocaleLowerCase("es"))
    : undefined;
  const requestedCitySlug = requestedCity ? selectedCity?.slug ?? citySlug(requestedCity) : undefined;
  const parsedMaxPrice = Number(params.maxPrice);
  const maxPrice = Number.isFinite(parsedMaxPrice) && parsedMaxPrice > 0 ? parsedMaxPrice : undefined;
  const trainers = await listPublicTrainerProfiles({
    q: params.q,
    category: params.category,
    specialty: params.specialty,
    citySlug: requestedCitySlug,
    modality: params.modality,
    maxPrice,
    sort: params.sort as "featured" | "rating" | "price-asc" | "price-desc" | undefined,
  });
  const activeFilters = [
    params.q ? `Búsqueda: ${params.q}` : null,
    params.category ? `Categoría: ${params.category}` : null,
    params.specialty ? `Objetivo: ${params.specialty}` : null,
    requestedCity ? `Ciudad: ${selectedCity?.name ?? requestedCity}` : null,
    params.nearby === "1" ? "Cerca de mí" : params.modality ? `Modalidad: ${params.modality}` : null,
    maxPrice ? `Hasta ${maxPrice} €` : null,
  ].filter(Boolean);

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 bg-white px-4 py-7 text-[#111214] md:px-6 md:py-10 lg:px-8">
      <JsonLd data={trainerCollectionJsonLd(trainers, `${siteConfig.url}/entrenadores`, "Entrenadores por categoría")} />
      <section className="grid gap-5 py-2 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--accent)]">Entrenadores</p>
          <h1 className="mt-2 font-heading text-3xl font-bold text-[#111214] sm:text-5xl">Entrenadores disponibles</h1>
          <p className="mt-3 max-w-2xl text-sm text-[#5b5b63]">
            {trainers.length > 0
              ? `${trainers.length} perfil${trainers.length === 1 ? "" : "es"} real${trainers.length === 1 ? "" : "es"} para comparar.`
              : "Aún no hay perfiles publicados que coincidan con esta búsqueda."}
          </p>
          {activeFilters.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {activeFilters.map((filter) => (
                <span key={filter} className="rounded-full bg-[#f4f4f1] px-3 py-1.5 text-xs font-semibold text-[#3d3d42]">
                  {filter}
                </span>
              ))}
            </div>
          ) : null}
        </div>
        <Link
          href="/registro?intent=trainer"
          className="inline-flex items-center justify-center gap-2 text-sm font-bold text-[#111214] underline decoration-[var(--accent)] decoration-2 underline-offset-4"
        >
          Publicar perfil
          <ArrowRight size={15} />
        </Link>
      </section>

      <section className="relative">
        <Suspense fallback={null}>
          <FiltersBar categories={categories} specialties={specialties} cities={cities} basePath="/entrenadores" />
        </Suspense>
      </section>

      {trainers.length > 0 ? (
        <section className="flex flex-wrap items-center justify-between gap-3 text-sm text-[#5b5b63]">
          <p>Perfiles publicados que coinciden con tu búsqueda.</p>
          <Link href="/registro?intent=trainer" className="font-semibold text-[var(--accent)]">
            ¿Falta tu ciudad? Publica tu perfil
          </Link>
        </section>
      ) : null}

      <div className="grid gap-4">
        {trainers.map((trainer, index) => (
          <Reveal key={trainer.id} delay={Math.min(index, 6) * 60}>
            <TrainerListItem trainer={trainer} />
          </Reveal>
        ))}
        {trainers.length === 0 ? (
          <MarketplaceEmptyState resetHref="/entrenadores" />
        ) : null}
      </div>
    </main>
  );
}
