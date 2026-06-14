import { marketplaceCities, publicTrainerProfiles } from "@/lib/marketplace-data";

export async function listMarketplaceCities() {
  return marketplaceCities;
}

export async function getMarketplaceCity(slug: string) {
  return marketplaceCities.find((city) => city.slug === slug) ?? null;
}

export async function listPublicTrainerProfiles() {
  return publicTrainerProfiles;
}

export async function listFeaturedTrainerProfiles() {
  return publicTrainerProfiles.slice(0, 3);
}

export async function listTrainerProfilesByCity(citySlug: string) {
  return publicTrainerProfiles.filter((trainer) => trainer.citySlug === citySlug);
}

export async function getPublicTrainerProfileBySlug(slug: string) {
  return publicTrainerProfiles.find((trainer) => trainer.slug === slug) ?? null;
}
