import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { FiltersBar } from "@/components/filters-bar";
import { JsonLd } from "@/components/json-ld";
import { MarketplaceEmptyState } from "@/components/marketplace-empty-state";
import { Reveal } from "@/components/reveal";
import { TrainerListItem } from "@/components/trainer-list-item";
import { trainerCollectionJsonLd } from "@/lib/marketplace-seo";
import { siteConfig } from "@/lib/site";
import {
  listAllModalities,
  listAllCategories,
  listAllSpecialties,
  listMarketplaceCities,
  listPublicTrainerProfiles,
} from "@/lib/repositories/trainers";

interface TrainersPageProps {
  searchParams: Promise<{ q?: string; category?: string; specialty?: string; city?: string; modality?: string; sort?: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  const trainers = await listPublicTrainerProfiles();
  const hasPublishedSupply = trainers.length > 0;

  return {
    title: "Entrenadores por categoría",
    description: hasPublishedSupply
      ? "Explora perfiles públicos de entrenadores por categoría, ciudad, especialidad y formato antes de contactar."
      : "Explora perfiles locales de entrenadores por categoría, ciudad y modalidad.",
    alternates: {
      canonical: "/entrenadores",
    },
    robots: hasPublishedSupply ? undefined : { index: false, follow: true },
  };
}

export default async function TrainersPage({ searchParams }: TrainersPageProps) {
  const params = await searchParams;
  const [trainers, categories, specialties, modalities, cities] = await Promise.all([
    listPublicTrainerProfiles({
      q: params.q,
      category: params.category,
      specialty: params.specialty,
      citySlug: params.city,
      modality: params.modality,
      sort: params.sort as "featured" | "rating" | "price-asc" | "price-desc" | undefined,
    }),
    listAllCategories(),
    listAllSpecialties(),
    listAllModalities(),
    listMarketplaceCities(),
  ]);
  const selectedCity = cities.find((city) => city.slug === params.city);
  const activeFilters = [
    params.q ? `Búsqueda: ${params.q}` : null,
    params.category ? `Categoría: ${params.category}` : null,
    params.specialty ? `Objetivo: ${params.specialty}` : null,
    selectedCity ? `Ciudad: ${selectedCity.name}` : null,
    params.modality ? `Modalidad: ${params.modality}` : null,
  ].filter(Boolean);

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 bg-white px-4 py-6 text-[#111214] md:px-6 md:py-8 lg:px-8">
      <JsonLd data={trainerCollectionJsonLd(trainers, `${siteConfig.url}/entrenadores`, "Entrenadores por categoría")} />
      <section className="grid gap-5 border border-[#111214] px-6 py-7 sm:px-8 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--accent)]">Marketplace</p>
          <h1 className="mt-2 font-heading text-3xl font-bold text-[#111214] sm:text-5xl">
            {trainers.length > 0
              ? `${trainers.length} entrenador${trainers.length === 1 ? "" : "es"} para comparar`
              : params.category
                ? `Entrenadores de ${params.category}`
                : "Encuentra tu entrenador por categoría y ciudad"}
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-[#5b5b63]">
            {trainers.length > 0
              ? "Filtra por categoría, objetivo, ciudad o modalidad y compara perfiles antes de contactar."
              : "Estamos ampliando la oferta por categorías y ciudades. Filtra para explorar la cobertura o publica tu perfil."}
          </p>
          {activeFilters.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {activeFilters.map((filter) => (
                <span key={filter} className="border border-[#111214]/15 px-3 py-1.5 text-xs font-semibold text-[#111214]">
                  {filter}
                </span>
              ))}
            </div>
          ) : null}
        </div>
        <Link
          href="/registro?intent=trainer"
          className="inline-flex items-center justify-center gap-2 border border-[#111214] bg-white px-5 py-3 text-sm font-bold text-[#111214] transition-colors hover:bg-[#111214] hover:text-white"
        >
          Publicar perfil
          <ArrowRight size={15} />
        </Link>
      </section>

      <section className="grid gap-3 md:grid-cols-3">
        {["Contacto protegido", "Perfiles comparables", "Búsqueda por ciudad"].map((item) => (
          <div key={item} className="border border-[#111214]/15 px-4 py-3 text-sm font-semibold text-[#111214]">
            <span className="inline-flex items-center gap-2">
              <ShieldCheck size={15} className="text-[var(--accent)]" />
              {item}
            </span>
          </div>
        ))}
      </section>

      <section className="sticky top-20 z-20">
        <Suspense fallback={null}>
          <FiltersBar categories={categories} specialties={specialties} modalities={modalities} cities={cities} basePath="/entrenadores" />
        </Suspense>
      </section>

      <section className="flex flex-wrap items-center justify-between gap-3 text-sm text-[#5b5b63]">
        <p>
          {trainers.length > 0
            ? "Perfiles ordenados para comparar antes de contactar."
            : "No hay perfiles publicados con estos filtros todavía."}
        </p>
        <Link href="/registro?intent=trainer" className="font-semibold text-[var(--accent)]">
          ¿Falta tu ciudad? Publica tu perfil
        </Link>
      </section>

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
