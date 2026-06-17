import { hasSupabaseEnv } from "@/lib/supabase/client";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { marketplaceCities, publicTrainerProfiles } from "@/lib/marketplace-data";
import type { MarketplaceCity, PublicTrainerProfile } from "@/types/marketplace";

export interface TrainerFilters {
  specialty?: string;
  citySlug?: string;
  modality?: string;
  sort?: "rating" | "price-asc" | "price-desc";
}

interface CityRow {
  slug: string;
  name: string;
  region: string;
  country: string;
  hero_title: string;
  intro: string;
  seo_description: string;
}

interface TrainerRow {
  id: string;
  slug: string;
  display_name: string;
  city_slug: string;
  headline: string;
  short_bio: string;
  long_bio: string;
  specialties: string[];
  verified: boolean;
  years_experience: number;
  rating: number;
  reviews_count: number;
  price_from: number;
  modalities: string[];
  languages: string[];
  hidden_contact_hint: string;
  contact_info: string;
  photo_url: string | null;
  review_status: string;
  cities: { name: string; region: string } | null;
}

function mapCity(row: CityRow): MarketplaceCity {
  return {
    slug: row.slug,
    name: row.name,
    region: row.region,
    country: row.country,
    heroTitle: row.hero_title,
    intro: row.intro,
    seoDescription: row.seo_description,
  };
}

function mapTrainer(row: TrainerRow): PublicTrainerProfile {
  return {
    id: row.id,
    slug: row.slug,
    displayName: row.display_name,
    citySlug: row.city_slug,
    city: row.cities?.name ?? row.city_slug,
    region: row.cities?.region ?? "",
    headline: row.headline,
    shortBio: row.short_bio,
    longBio: row.long_bio,
    specialties: row.specialties ?? [],
    verified: row.verified,
    yearsExperience: row.years_experience,
    rating: Number(row.rating),
    reviewsCount: row.reviews_count,
    priceFrom: Number(row.price_from),
    modalities: row.modalities ?? [],
    languages: row.languages ?? [],
    hiddenContactHint: row.hidden_contact_hint,
    contactInfo: row.contact_info ?? "",
    photoUrl: row.photo_url ?? null,
    reviewStatus: row.review_status ?? "pending",
  };
}

function sortTrainers(trainers: PublicTrainerProfile[], sort: TrainerFilters["sort"]) {
  if (sort === "price-asc") {
    return [...trainers].sort((a, b) => a.priceFrom - b.priceFrom);
  }
  if (sort === "price-desc") {
    return [...trainers].sort((a, b) => b.priceFrom - a.priceFrom);
  }
  return [...trainers].sort((a, b) => b.rating - a.rating);
}

function filterStaticTrainers(filters: TrainerFilters) {
  let trainers = [...publicTrainerProfiles];

  if (filters.specialty) {
    trainers = trainers.filter((trainer) => trainer.specialties.includes(filters.specialty!));
  }
  if (filters.citySlug) {
    trainers = trainers.filter((trainer) => trainer.citySlug === filters.citySlug);
  }
  if (filters.modality) {
    trainers = trainers.filter((trainer) => trainer.modalities.includes(filters.modality!));
  }

  return sortTrainers(trainers, filters.sort);
}

export async function listMarketplaceCities(): Promise<MarketplaceCity[]> {
  if (!hasSupabaseEnv()) {
    return marketplaceCities;
  }

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase.from("cities").select("*").order("name");

  if (error || !data) {
    console.error("[supabase] listMarketplaceCities failed, falling back to static data", error);
    return marketplaceCities;
  }

  return (data as CityRow[]).map(mapCity);
}

export async function getMarketplaceCity(slug: string): Promise<MarketplaceCity | null> {
  if (!hasSupabaseEnv()) {
    return marketplaceCities.find((city) => city.slug === slug) ?? null;
  }

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase.from("cities").select("*").eq("slug", slug).maybeSingle();

  if (error || !data) {
    return marketplaceCities.find((city) => city.slug === slug) ?? null;
  }

  return mapCity(data as CityRow);
}

export async function listPublicTrainerProfiles(filters: TrainerFilters = {}): Promise<PublicTrainerProfile[]> {
  if (!hasSupabaseEnv()) {
    return filterStaticTrainers(filters);
  }

  const supabase = getSupabaseServerClient();
  let query = supabase
    .from("trainer_profiles")
    .select("*, cities(name, region)")
    .eq("is_published", true);

  if (filters.specialty) {
    query = query.contains("specialties", [filters.specialty]);
  }
  if (filters.citySlug) {
    query = query.eq("city_slug", filters.citySlug);
  }
  if (filters.modality) {
    query = query.contains("modalities", [filters.modality]);
  }

  if (filters.sort === "price-asc") {
    query = query.order("price_from", { ascending: true });
  } else if (filters.sort === "price-desc") {
    query = query.order("price_from", { ascending: false });
  } else {
    query = query.order("rating", { ascending: false });
  }

  const { data, error } = await query;

  if (error || !data) {
    console.error("[supabase] listPublicTrainerProfiles failed, falling back to static data", error);
    return filterStaticTrainers(filters);
  }

  return (data as unknown as TrainerRow[]).map(mapTrainer);
}

export async function listFeaturedTrainerProfiles(): Promise<PublicTrainerProfile[]> {
  const trainers = await listPublicTrainerProfiles({ sort: "rating" });
  return trainers.slice(0, 3);
}

export async function listTrainerProfilesByCity(citySlug: string, filters: TrainerFilters = {}) {
  return listPublicTrainerProfiles({ ...filters, citySlug });
}

export async function getPublicTrainerProfileBySlug(slug: string): Promise<PublicTrainerProfile | null> {
  if (!hasSupabaseEnv()) {
    return publicTrainerProfiles.find((trainer) => trainer.slug === slug) ?? null;
  }

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("trainer_profiles")
    .select("*, cities(name, region)")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (error || !data) {
    return publicTrainerProfiles.find((trainer) => trainer.slug === slug) ?? null;
  }

  return mapTrainer(data as unknown as TrainerRow);
}

export async function listAllSpecialties(): Promise<string[]> {
  const trainers = await listPublicTrainerProfiles();
  const specialties = new Set<string>();
  trainers.forEach((trainer) => trainer.specialties.forEach((specialty) => specialties.add(specialty)));
  return Array.from(specialties).sort();
}

export async function listAllModalities(): Promise<string[]> {
  const trainers = await listPublicTrainerProfiles();
  const modalities = new Set<string>();
  trainers.forEach((trainer) => trainer.modalities.forEach((modality) => modalities.add(modality)));
  return Array.from(modalities).sort();
}

export async function getMarketplaceStats() {
  const [trainers, cities] = await Promise.all([listPublicTrainerProfiles(), listMarketplaceCities()]);

  const totalTrainers = trainers.length;
  const totalReviews = trainers.reduce((sum, trainer) => sum + trainer.reviewsCount, 0);
  const avgRating = trainers.reduce((sum, trainer) => sum + trainer.rating, 0) / Math.max(totalTrainers, 1);

  return {
    totalTrainers,
    totalReviews,
    avgRating: Number(avgRating.toFixed(1)),
    totalCities: cities.length,
  };
}
