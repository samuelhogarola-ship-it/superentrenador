import type { MarketplaceCity } from "@/types/marketplace";

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
