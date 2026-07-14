import { hasSupabaseEnv } from "@/lib/supabase/client";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { marketplaceCities, publicTrainerProfiles } from "@/lib/marketplace-data";
import type { MarketplaceCity, PublicTrainerProfile } from "@/types/marketplace";

export interface TrainerFilters {
  specialty?: string;
  citySlug?: string;
  modality?: string;
  sort?: "featured" | "price-asc" | "price-desc" | "rating";
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

// Rows returned by the trainer_profiles_public view (flat shape — cities joined).
// contact_info, stripe_customer_id, user_id are excluded at the view level.
interface TrainerRow {
  id: string;
  slug: string;
  display_name: string;
  city_slug: string;
  city_name: string | null;
  city_region: string | null;
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
  photo_url: string | null;
  review_status: string;
}

// Columns to fetch from trainer_profiles_public view (no nested selects needed).
const PUBLIC_VIEW_COLUMNS =
  "id, slug, display_name, city_slug, city_name, city_region, " +
  "headline, short_bio, long_bio, specialties, verified, years_experience, " +
  "rating, reviews_count, price_from, modalities, languages, " +
  "hidden_contact_hint, photo_url, review_status";

const DEMO_PROFILE_SLUGS = new Set(publicTrainerProfiles.map((trainer) => trainer.slug));

function isMarketplaceDemoMode() {
  return process.env.MARKETPLACE_DEMO_MODE === "true";
}

function getDemoTrainerProfiles() {
  return isMarketplaceDemoMode() ? publicTrainerProfiles : [];
}

function isProductionDemoProfile(row: Pick<TrainerRow, "slug">) {
  return !isMarketplaceDemoMode() && DEMO_PROFILE_SLUGS.has(row.slug);
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

function mergeCitiesWithFallback(rows: CityRow[] = []) {
  const bySlug = new Map<string, MarketplaceCity>();
  marketplaceCities.forEach((city) => bySlug.set(city.slug, city));
  rows.map(mapCity).forEach((city) => bySlug.set(city.slug, city));
  return Array.from(bySlug.values()).sort((a, b) => a.name.localeCompare(b.name, "es"));
}

function mapTrainer(row: TrainerRow): PublicTrainerProfile {
  return {
    id: row.id,
    slug: row.slug,
    displayName: row.display_name,
    citySlug: row.city_slug,
    city: row.city_name ?? row.city_slug,
    region: row.city_region ?? "",
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
  return [...trainers].sort((a, b) => {
    if (a.verified !== b.verified) return Number(b.verified) - Number(a.verified);
    return a.displayName.localeCompare(b.displayName, "es");
  });
}

function filterStaticTrainers(filters: TrainerFilters) {
  let trainers = getDemoTrainerProfiles();

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
    console.error("[supabase] listMarketplaceCities failed", error);
    return marketplaceCities;
  }

  return mergeCitiesWithFallback(data as CityRow[]);
}

export async function getMarketplaceCity(slug: string): Promise<MarketplaceCity | null> {
  if (!hasSupabaseEnv()) {
    return marketplaceCities.find((city) => city.slug === slug) ?? null;
  }

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase.from("cities").select("*").eq("slug", slug).maybeSingle();

  if (error) {
    console.error("[supabase] getMarketplaceCity failed", error);
    return marketplaceCities.find((city) => city.slug === slug) ?? null;
  }

  if (!data) {
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
    .from("trainer_profiles_public")
    .select(PUBLIC_VIEW_COLUMNS);

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
    query = query.order("verified", { ascending: false }).order("created_at", { ascending: false });
  }

  const { data, error } = await query;

  if (error || !data) {
    console.error("[supabase] listPublicTrainerProfiles failed", error);
    return [];
  }

  return (data as unknown as TrainerRow[]).filter((row) => !isProductionDemoProfile(row)).map(mapTrainer);
}

export async function listFeaturedTrainerProfiles(): Promise<PublicTrainerProfile[]> {
  const trainers = await listPublicTrainerProfiles({ sort: "featured" });
  return trainers.slice(0, 3);
}

export async function listTrainerProfilesByCity(citySlug: string, filters: TrainerFilters = {}) {
  return listPublicTrainerProfiles({ ...filters, citySlug });
}

export async function getPublicTrainerProfileBySlug(slug: string): Promise<PublicTrainerProfile | null> {
  if (!hasSupabaseEnv()) {
    return getDemoTrainerProfiles().find((trainer) => trainer.slug === slug) ?? null;
  }

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("trainer_profiles_public")
    .select(PUBLIC_VIEW_COLUMNS)
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) {
    console.error("[supabase] getPublicTrainerProfileBySlug failed", error);
    return null;
  }

  const trainer = data as unknown as TrainerRow;
  if (isProductionDemoProfile(trainer)) {
    return null;
  }

  return mapTrainer(trainer);
}

/** Only fetches the `specialties` column — avoids loading full profiles. */
export async function listAllSpecialties(): Promise<string[]> {
  if (!hasSupabaseEnv()) {
    const set = new Set<string>();
    getDemoTrainerProfiles().forEach((t) => t.specialties.forEach((s) => set.add(s)));
    return Array.from(set).sort();
  }

  const supabase = getSupabaseServerClient();
  const { data } = await supabase
    .from("trainer_profiles_public")
    .select("slug, specialties");

  if (!data) return [];

  const set = new Set<string>();
  (data as Pick<TrainerRow, "slug" | "specialties">[])
    .filter((row) => !isProductionDemoProfile(row))
    .forEach((row) => (row.specialties ?? []).forEach((s) => set.add(s)));
  return Array.from(set).sort();
}

/** Only fetches the `modalities` column — avoids loading full profiles. */
export async function listAllModalities(): Promise<string[]> {
  if (!hasSupabaseEnv()) {
    const set = new Set<string>();
    getDemoTrainerProfiles().forEach((t) => t.modalities.forEach((m) => set.add(m)));
    return Array.from(set).sort();
  }

  const supabase = getSupabaseServerClient();
  const { data } = await supabase
    .from("trainer_profiles_public")
    .select("slug, modalities");

  if (!data) return [];

  const set = new Set<string>();
  (data as Pick<TrainerRow, "slug" | "modalities">[])
    .filter((row) => !isProductionDemoProfile(row))
    .forEach((row) => (row.modalities ?? []).forEach((m) => set.add(m)));
  return Array.from(set).sort();
}

/** Uses lightweight COUNT + aggregation queries — does not call listPublicTrainerProfiles. */
export async function getMarketplaceStats() {
  if (!hasSupabaseEnv()) {
    const trainers = getDemoTrainerProfiles();
    const totalTrainers = trainers.length;
    return { totalTrainers, totalCities: marketplaceCities.length };
  }

  const supabase = getSupabaseServerClient();

  const [profilesRes, citiesCountRes] = await Promise.all([
    supabase
      .from("trainer_profiles_public")
      .select("slug"),
    supabase
      .from("cities")
      .select("*", { count: "exact", head: true }),
  ]);

  const totalTrainers = ((profilesRes.data ?? []) as Pick<TrainerRow, "slug">[]).filter(
    (row) => !isProductionDemoProfile(row)
  ).length;
  const totalCities = Math.max(citiesCountRes.count ?? 0, marketplaceCities.length);

  return { totalTrainers, totalCities };
}
