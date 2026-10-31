import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { JsonLd } from "@/components/json-ld";
import { HeroSearchBar } from "@/components/hero-search-bar";
import { MarketplaceEmptyState } from "@/components/marketplace-empty-state";
import { TrainerCard } from "@/components/trainer-card";
import { marketplaceWebsiteJsonLd } from "@/lib/marketplace-seo";
import { listAllCategories, listFeaturedTrainerProfiles, listMarketplaceCities } from "@/lib/repositories/trainers";
import { createSocialMetadata, siteConfig } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Super Entrenador | Encuentra tu entrenador personal",
  description: siteConfig.description,
  alternates: {
    canonical: "/",
  },
  ...createSocialMetadata(
    "Super Entrenador | Encuentra tu entrenador personal",
    siteConfig.description,
    "/",
  ),
};

const QUICK_CATEGORIES = ["Entrenador personal", "Tenis", "Pádel", "Fútbol", "Boxeo", "Pilates"] as const;

export default async function Home() {
  const [trainersToShow, categories, cities] = await Promise.all([
    listFeaturedTrainerProfiles(),
    listAllCategories(),
    listMarketplaceCities(),
  ]);

  return (
    <main className="flex flex-1 flex-col">
      <JsonLd data={marketplaceWebsiteJsonLd()} />
      <section className="marketplace-hero px-4 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-12">
        <div className="relative z-10 mx-auto w-full max-w-5xl">
          <h1 className="app-title marketplace-hero-title whitespace-nowrap text-center text-[clamp(1.15rem,5.5vw,2.75rem)] leading-tight">
            Encuentra tu entrenador ideal
          </h1>
          <div className="mx-auto mt-5 max-w-4xl">
            <HeroSearchBar categories={categories} cities={cities} />
          </div>
          <nav aria-label="Búsquedas rápidas" className="mx-auto mt-4 flex max-w-4xl flex-wrap justify-center gap-x-1 gap-y-2">
            {QUICK_CATEGORIES.map((category, index) => (
              <Link
                key={category}
                href={`/entrenadores?category=${encodeURIComponent(category)}`}
                className={`px-3 py-1.5 text-sm font-semibold text-[#3f444d] transition-colors hover:text-[#087dcc] ${index > 0 ? "border-l border-black/10" : ""}`}
              >
                {category}
              </Link>
            ))}
          </nav>
        </div>
      </section>
      <section className="bg-white px-5 py-16 text-[var(--ink)] sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="app-kicker text-[var(--accent)]">Perfiles destacados</p>
              <h2 className="app-title mt-2 text-3xl sm:text-4xl">Encuentra tu entrenador</h2>
            </div>
            <Link
              href="/entrenadores"
              className="font-semibold text-[var(--accent)] transition-colors hover:text-[var(--accent-strong)]"
            >
              Ver todos
            </Link>
          </div>
          {trainersToShow.length > 0 ? (
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {trainersToShow.map((trainer) => (
                <TrainerCard key={trainer.id} trainer={trainer} />
              ))}
            </div>
          ) : (
            <div className="mt-8">
              <MarketplaceEmptyState resetHref="/entrenadores" />
            </div>
          )}
        </div>
      </section>
      <section
        aria-label="Inscripción de entrenadores"
        className="bg-white px-5 pb-16 text-[var(--ink)] sm:px-8 lg:px-12"
      >
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 rounded-[2rem] bg-[#17171b] px-6 py-8 text-center sm:flex-row sm:px-10 sm:text-left">
          <p className="font-heading text-2xl font-bold text-white sm:text-3xl">¿Eres entrenador?</p>
          <Link
            href="/registro?intent=trainer"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-6 py-3 font-bold text-[#111214] transition-transform hover:-translate-y-0.5"
          >
            Inscríbete
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </main>
  );
}
