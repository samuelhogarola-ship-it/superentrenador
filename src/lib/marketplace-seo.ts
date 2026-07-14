import type { MarketplaceCity, PublicTrainerProfile } from "@/types/marketplace";
import { siteConfig } from "@/lib/site";

export function marketplaceWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteConfig.url}/entrenadores?specialty={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function trainerCollectionJsonLd(trainers: PublicTrainerProfile[], url: string, name: string) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    url,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: trainers.slice(0, 20).map((trainer, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${siteConfig.url}/entrenadores/${trainer.slug}`,
        name: trainer.displayName,
      })),
    },
  };
}

export function trainerProfileJsonLd(trainer: PublicTrainerProfile) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: trainer.displayName,
    url: `${siteConfig.url}/entrenadores/${trainer.slug}`,
    image: trainer.photoUrl ?? undefined,
    description: trainer.shortBio,
    address: {
      "@type": "PostalAddress",
      addressLocality: trainer.city,
      addressRegion: trainer.region,
      addressCountry: "ES",
    },
    knowsAbout: trainer.specialties,
    aggregateRating:
      trainer.reviewsCount > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: trainer.rating,
            reviewCount: trainer.reviewsCount,
          }
        : undefined,
    makesOffer: {
      "@type": "Offer",
      price: trainer.priceFrom,
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      itemOffered: {
        "@type": "Service",
        name: `Entrenamiento personal con ${trainer.displayName}`,
        areaServed: trainer.city,
        serviceType: trainer.specialties.join(", "),
      },
    },
  };
}

export function cityCollectionJsonLd(city: MarketplaceCity, trainers: PublicTrainerProfile[]) {
  return trainerCollectionJsonLd(
    trainers,
    `${siteConfig.url}/ciudades/${city.slug}`,
    `Entrenadores personales en ${city.name}`
  );
}
