import type { Metadata } from "next";
import { Suspense } from "react";
import { FiltersBar } from "@/components/filters-bar";
import { JsonLd } from "@/components/json-ld";
import { MarketplaceEmptyState } from "@/components/marketplace-empty-state";
import { Reveal } from "@/components/reveal";
import { TrainerListItem } from "@/components/trainer-list-item";
import { trainerCollectionJsonLd } from "@/lib/marketplace-seo";
import { siteConfig } from "@/lib/site";
import {
  listAllModalities,
  listAllSpecialties,
  listMarketplaceCities,
  listPublicTrainerProfiles,
} from "@/lib/repositories/trainers";

export const metadata: Metadata = {
  title: "Entrenadores personales",
  description:
    "Explora perfiles públicos de entrenadores personales por ciudad, especialidad y formato antes de desbloquear contacto y contratación.",
  alternates: {
    canonical: "/entrenadores",
  },
};

interface TrainersPageProps {
  searchParams: Promise<{ specialty?: string; city?: string; modality?: string; sort?: string }>;
}

export default async function TrainersPage({ searchParams }: TrainersPageProps) {
  const params = await searchParams;
  const [trainers, specialties, modalities, cities] = await Promise.all([
    listPublicTrainerProfiles({
      specialty: params.specialty,
      citySlug: params.city,
      modality: params.modality,
      sort: params.sort as "rating" | "price-asc" | "price-desc" | undefined,
    }),
    listAllSpecialties(),
    listAllModalities(),
    listMarketplaceCities(),
  ]);

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-6 md:px-6 md:py-8 lg:px-8">
      <JsonLd data={trainerCollectionJsonLd(trainers, `${siteConfig.url}/entrenadores`, "Entrenadores personales")} />
      <section className="app-surface rounded-[28px] px-6 py-7 sm:px-8">
        <p className="app-kicker">Marketplace</p>
        <h1 className="app-title mt-2 text-3xl text-[var(--text)] sm:text-4xl">
          {trainers.length} entrenador{trainers.length === 1 ? "" : "es"} disponible{trainers.length === 1 ? "" : "s"}
        </h1>
        <p className="app-copy mt-2 max-w-2xl text-sm">
          Filtra por especialidad, ciudad o modalidad y compara perfiles reales antes de desbloquear el contacto.
        </p>
      </section>

      <Suspense fallback={null}>
        <FiltersBar specialties={specialties} modalities={modalities} cities={cities} basePath="/entrenadores" />
      </Suspense>

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
