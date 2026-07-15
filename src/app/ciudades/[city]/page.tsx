import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { FiltersBar } from "@/components/filters-bar";
import { JsonLd } from "@/components/json-ld";
import { MarketplaceEmptyState } from "@/components/marketplace-empty-state";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { TrainerListItem } from "@/components/trainer-list-item";
import { cityCollectionJsonLd } from "@/lib/marketplace-seo";
import {
  getMarketplaceCity,
  listAllModalities,
  listAllSpecialties,
  listMarketplaceCities,
  listTrainerProfilesByCity,
} from "@/lib/repositories/trainers";

interface CityPageProps {
  params: Promise<{ city: string }>;
  searchParams: Promise<{ specialty?: string; modality?: string; sort?: string }>;
}

export async function generateStaticParams() {
  const cities = await listMarketplaceCities();
  return cities.map((city) => ({ city: city.slug }));
}

export async function generateMetadata({ params }: CityPageProps): Promise<Metadata> {
  const { city } = await params;
  const currentCity = await getMarketplaceCity(city);

  if (!currentCity) {
    return {
      title: "Ciudad no encontrada",
    };
  }

  const trainers = await listTrainerProfilesByCity(currentCity.slug);
  const hasPublishedSupply = trainers.length > 0;

  return {
    title: currentCity.heroTitle,
    description: currentCity.seoDescription,
    alternates: {
      canonical: `/ciudades/${currentCity.slug}`,
    },
    robots: hasPublishedSupply ? undefined : { index: false, follow: true },
  };
}

export default async function CityPage({ params, searchParams }: CityPageProps) {
  const { city } = await params;
  const search = await searchParams;
  const currentCity = await getMarketplaceCity(city);

  if (!currentCity) {
    notFound();
  }

  const [trainers, specialties, modalities, cities] = await Promise.all([
    listTrainerProfilesByCity(currentCity.slug, {
      specialty: search.specialty,
      modality: search.modality,
      sort: search.sort as "featured" | "rating" | "price-asc" | "price-desc" | undefined,
    }),
    listAllSpecialties(),
    listAllModalities(),
    listMarketplaceCities(),
  ]);

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-6 md:px-6 md:py-8 lg:px-8">
      <JsonLd data={cityCollectionJsonLd(currentCity, trainers)} />
      <section className="app-surface rounded-[28px] px-6 py-8 sm:px-8 sm:py-10">
        <SectionHeading
          eyebrow={`${currentCity.name} · ${currentCity.region}`}
          title={currentCity.heroTitle}
          body={currentCity.intro}
          titleAs="h1"
        />
      </section>

      <Suspense fallback={null}>
        <FiltersBar
          specialties={specialties}
          modalities={modalities}
          cities={cities}
          basePath={`/ciudades/${currentCity.slug}`}
          lockCity
        />
      </Suspense>

      <div className="grid gap-4">
        {trainers.map((trainer, index) => (
          <Reveal key={trainer.id} delay={Math.min(index, 6) * 60}>
            <TrainerListItem trainer={trainer} />
          </Reveal>
        ))}
        {trainers.length === 0 ? (
          <MarketplaceEmptyState cityName={currentCity.name} resetHref={`/ciudades/${currentCity.slug}`} />
        ) : null}
      </div>
    </main>
  );
}
