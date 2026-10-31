import type { MarketplaceCity, PublicTrainerProfile } from "@/types/marketplace";

export const ANDALUCIA_REGIONS = [
  "Almería",
  "Cádiz",
  "Córdoba",
  "Granada",
  "Huelva",
  "Jaén",
  "Málaga",
  "Sevilla",
];

export function isAndaluciaCity(city: MarketplaceCity) {
  return city.country === "España" && ANDALUCIA_REGIONS.includes(city.region);
}

export function sortCitiesByName(cities: MarketplaceCity[]) {
  return [...cities].sort((a, b) => a.name.localeCompare(b.name, "es"));
}

export function getActiveAndaluciaCities(
  cities: MarketplaceCity[],
  trainers: Pick<PublicTrainerProfile, "citySlug">[],
) {
  const activeCitySlugs = new Set(trainers.map((trainer) => trainer.citySlug));
  return sortCitiesByName(
    cities.filter((city) => isAndaluciaCity(city) && activeCitySlugs.has(city.slug)),
  );
}
