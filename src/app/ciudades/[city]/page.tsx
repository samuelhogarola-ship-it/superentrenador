import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { FiltersBar } from "@/components/filters-bar";
import { JsonLd } from "@/components/json-ld";
import { MarketplaceEmptyState } from "@/components/marketplace-empty-state";
import { Reveal } from "@/components/reveal";
import { TrainerListItem } from "@/components/trainer-list-item";
import { cityCollectionJsonLd } from "@/lib/marketplace-seo";
import {
  getMarketplaceCity,
  listAllCategories,
  listAllModalities,
  listAllSpecialties,
  listMarketplaceCities,
  listTrainerProfilesByCity,
} from "@/lib/repositories/trainers";

interface CityPageProps {
  params: Promise<{ city: string }>;
  searchParams: Promise<{ category?: string; specialty?: string; modality?: string; sort?: string }>;
}

export const revalidate = 3600;

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

  const [trainers, categories, specialties, modalities, cities] = await Promise.all([
    listTrainerProfilesByCity(currentCity.slug, {
      category: search.category,
      specialty: search.specialty,
      modality: search.modality,
      sort: search.sort as "featured" | "rating" | "price-asc" | "price-desc" | undefined,
    }),
    listAllCategories(),
    listAllSpecialties(),
    listAllModalities(),
    listMarketplaceCities(),
  ]);

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 bg-white px-4 py-6 text-[#111214] md:px-6 md:py-8 lg:px-8">
      <JsonLd data={cityCollectionJsonLd(currentCity, trainers)} />
      <section className="border border-[#111214] px-6 py-8 sm:px-8 sm:py-10">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--accent)]">
          {currentCity.name} · {currentCity.region}
        </p>
        <h1 className="mt-3 max-w-2xl font-heading text-3xl font-bold text-[#111214] sm:text-5xl">
          {currentCity.heroTitle}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-[#5b5b63]">{currentCity.intro}</p>
      </section>

      <Suspense fallback={null}>
        <FiltersBar
          categories={categories}
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
