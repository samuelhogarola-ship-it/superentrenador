import type { Metadata } from "next";
import Link from "next/link";
import {
  Accessibility,
  Bike,
  CircleDot,
  Dumbbell,
  HandFist,
  Footprints,
  Goal,
  Mountain,
  MapPin,
  PersonStanding,
  Search,
  Star,
  Trophy,
  Volleyball,
  Waves,
} from "lucide-react";
import { JsonLd } from "@/components/json-ld";
import { HeroSearchBar } from "@/components/hero-search-bar";
import { MarketplaceEmptyState } from "@/components/marketplace-empty-state";
import { TrainerCard } from "@/components/trainer-card";
import { marketplaceWebsiteJsonLd } from "@/lib/marketplace-seo";
import { listAllCategories, listFeaturedTrainerProfiles, listMarketplaceCities } from "@/lib/repositories/trainers";
import { MARKETPLACE_CATEGORIES, PERSONAL_TRAINER_SERVICES, PERSONAL_TRAINER_SUBCATEGORIES } from "@/lib/marketplace-taxonomy";
import { siteConfig } from "@/lib/site";
import type { PublicTrainerProfile } from "@/types/marketplace";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Super Entrenador | Marketplace de entrenadores personales",
  description: siteConfig.description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    title: "Super Entrenador | Marketplace de entrenadores personales",
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
  },
};

const CATEGORY_ICONS = [
  { label: "Entrenador personal", icon: Dumbbell },
  { label: "Fútbol", icon: Trophy },
  { label: "Tenis", icon: CircleDot },
  { label: "Pádel", icon: CircleDot },
  { label: "Baloncesto", icon: Volleyball },
  { label: "Natación", icon: Waves },
  { label: "Ciclismo", icon: Bike },
  { label: "Atletismo", icon: Footprints },
  { label: "Boxeo", icon: HandFist },
  { label: "Pilates", icon: PersonStanding },
  { label: "Yoga", icon: PersonStanding },
  { label: "Escalada", icon: Mountain },
  { label: "Golf", icon: Goal },
  { label: "Voleibol", icon: Volleyball },
  { label: "Gimnasia", icon: Accessibility },
];

function CategoryMarquee() {
  const items = [...MARKETPLACE_CATEGORIES, ...MARKETPLACE_CATEGORIES];

  return (
    <div className="category-marquee mt-16" aria-label="Categorías de entrenadores">
      <div className="category-marquee-track">
        {items.map((label, index) => {
          const Icon = CATEGORY_ICONS[index % MARKETPLACE_CATEGORIES.length].icon;
          return (
            <Link
              key={`${label}-${index}`}
              href={`/entrenadores?category=${encodeURIComponent(label)}`}
              className="category-pill"
              tabIndex={index >= MARKETPLACE_CATEGORIES.length ? -1 : undefined}
            >
              <Icon size={20} strokeWidth={1.8} />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function PersonalSubcategories() {
  return (
    <div className="personal-subcategories mx-auto mt-5 max-w-7xl">
      <span>Entrenador personal:</span>
      {PERSONAL_TRAINER_SUBCATEGORIES.map((subcategory) => (
        <Link
          key={subcategory}
          href={`/entrenadores?category=${encodeURIComponent("Entrenador personal")}&specialty=${encodeURIComponent(subcategory)}`}
        >
          {subcategory}
        </Link>
      ))}
      {PERSONAL_TRAINER_SERVICES.map((service) => (
        <Link
          key={service}
          href={`/entrenadores?category=${encodeURIComponent("Entrenador personal")}&specialty=${encodeURIComponent(service)}`}
        >
          {service}
        </Link>
      ))}
    </div>
  );
}

function HeroFeaturedList({ trainers }: { trainers: PublicTrainerProfile[] }) {
  return (
    <div className="hero-featured-list" aria-label="Entrenadores destacados">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#ff6868]">Selección local</p>
          <h2 className="mt-1 font-heading text-2xl font-bold text-[#17171b]">Entrenadores destacados</h2>
        </div>
        <Star size={22} className="fill-[#ffb72d] text-[#ffb72d]" />
      </div>
      <div className="mt-5 grid gap-3">
        {trainers.slice(0, 3).map((trainer) => (
          <Link key={trainer.id} href={`/entrenadores/${trainer.slug}`} className="hero-featured-row">
            <span className="hero-featured-initial">{trainer.displayName.slice(0, 1)}</span>
            <span className="min-w-0 flex-1">
              <strong className="block truncate text-base text-[#17171b]">{trainer.displayName}</strong>
              <span className="mt-0.5 flex items-center gap-1 text-sm text-[#68686d]">
                <MapPin size={13} />
                {trainer.city} · {trainer.category ?? "Entrenador"}
              </span>
            </span>
            {trainer.reviewsCount > 0 ? <span className="shrink-0 text-sm font-bold text-[#17171b]">★ {trainer.rating.toFixed(1)}</span> : null}
          </Link>
        ))}
      </div>
      <Link href="/entrenadores" className="mt-5 block text-center text-sm font-bold text-[#ff6868] hover:text-[#17171b]">Ver todos los perfiles</Link>
    </div>
  );
}

export default async function Home() {
  const [trainersToShow, categories, cities] = await Promise.all([
    listFeaturedTrainerProfiles(),
    listAllCategories(),
    listMarketplaceCities(),
  ]);

  return (
    <main className="flex flex-1 flex-col">
      <JsonLd data={marketplaceWebsiteJsonLd()} />
      <section className="marketplace-hero px-5 py-12 sm:px-8 lg:px-12">
        <div className="marketplace-hero-inner mx-auto grid w-full max-w-7xl items-center gap-10 lg:grid-cols-[1fr_0.85fr]">
          <div className="relative z-10">
          <p className="app-kicker inline-flex items-center gap-2">
            <Search size={13} />
            Marketplace de entrenadores
          </p>
          <h1 className="app-title marketplace-hero-title mt-5 max-w-3xl text-4xl leading-[0.98] sm:text-6xl">
            Encuentra tu entrenador ideal
          </h1>
          <p className="marketplace-hero-points mt-6 max-w-xl text-base sm:text-lg">
            <span>Encuentra un entrenador a tu medida</span>
            <span>Entrenamiento para todos los niveles</span>
            <span>Presencial y online en tu ciudad</span>
          </p>
          <div className="mt-8 max-w-3xl">
            <HeroSearchBar categories={categories} cities={cities} />
          </div>
          </div>
          {trainersToShow.length > 0 ? <HeroFeaturedList trainers={trainersToShow} /> : null}
        </div>
        <CategoryMarquee />
        <PersonalSubcategories />
        <div className="marketplace-hero-proof mx-auto mt-8 max-w-7xl">★ Valoraciones reales de particulares y perfiles comparables antes de contactar</div>
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
    </main>
  );
}
