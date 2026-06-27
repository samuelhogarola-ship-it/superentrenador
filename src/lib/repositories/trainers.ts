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

// contact_info is intentionally excluded — it must never be served to anon users.
// The column is fetched client-side only after the user authenticates (ContactPanel).
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
  photo_url: string | null;
  review_status: string;
  cities: { name: string; region: string } | null;
}

// Explicit column list — contact_info is omitted on purpose.
const PUBLIC_TRAINER_COLUMNS =
  "id, slug, display_name, city_slug, headline, short_bio, long_bio, " +
  "specialties, verified, years_experience, rating, reviews_count, price_from, " +
  "modalities, languages, hidden_contact_hint, photo_url, review_status, " +
  "cities(name, region)";

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
    .select(PUBLIC_TRAINER_COLUMNS)
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
    .select(PUBLIC_TRAINER_COLUMNS)
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (error || !data) {
    return publicTrainerProfiles.find((trainer) => trainer.slug === slug) ?? null;
  }

  return mapTrainer(data as unknown as TrainerRow);
}

/** Only fetches the `specialties` column — avoids loading full profiles. */
export async function listAllSpecialties(): Promise<string[]> {
  if (!hasSupabaseEnv()) {
    const set = new Set<string>();
    publicTrainerProfiles.forEach((t) => t.specialties.forEach((s) => set.add(s)));
    return Array.from(set).sort();
  }

  const supabase = getSupabaseServerClient();
  const { data } = await supabase
    .from("trainer_profiles")
    .select("specialties")
    .eq("is_published", true);

  if (!data) return [];

  const set = new Set<string>();
  data.forEach((row) => (row.specialties as string[] ?? []).forEach((s) => set.add(s)));
  return Array.from(set).sort();
}

/** Only fetches the `modalities` column — avoids loading full profiles. */
export async function listAllModalities(): Promise<string[]> {
  if (!hasSupabaseEnv()) {
    const set = new Set<string>();
    publicTrainerProfiles.forEach((t) => t.modalities.forEach((m) => set.add(m)));
    return Array.from(set).sort();
  }

  const supabase = getSupabaseServerClient();
  const { data } = await supabase
    .from("trainer_profiles")
    .select("modalities")
    .eq("is_published", true);

  if (!data) return [];

  const set = new Set<string>();
  data.forEach((row) => (row.modalities as string[] ?? []).forEach((m) => set.add(m)));
  return Array.from(set).sort();
}

/** Uses lightweight COUNT + aggregation queries — does not call listPublicTrainerProfiles. */
export async function getMarketplaceStats() {
  if (!hasSupabaseEnv()) {
    const trainers = publicTrainerProfiles;
    const totalTrainers = trainers.length;
    const totalReviews = trainers.reduce((s, t) => s + t.reviewsCount, 0);
    const avgRating = Number(
      (trainers.reduce((s, t) => s + t.rating, 0) / Math.max(totalTrainers, 1)).toFixed(1)
    );
    return { totalTrainers, totalReviews, avgRating, totalCities: marketplaceCities.length };
  }

  const supabase = getSupabaseServerClient();

  const [countRes, aggregateRes, citiesCountRes] = await Promise.all([
    supabase
      .from("trainer_profiles")
      .select("*", { count: "exact", head: true })
      .eq("is_published", true),
    supabase
      .from("trainer_profiles")
      .select("reviews_count, rating")
      .eq("is_published", true),
    supabase
      .from("cities")
      .select("*", { count: "exact", head: true }),
  ]);

  const totalTrainers = countRes.count ?? 0;
  const rows = aggregateRes.data ?? [];
  const totalReviews = rows.reduce((s, r) => s + ((r.reviews_count as number) ?? 0), 0);
  const avgRating =
    rows.length > 0
      ? Number(
          (rows.reduce((s, r) => s + Number(r.rating), 0) / rows.length).toFixed(1)
        )
      : 0;
  const totalCities = citiesCountRes.count ?? 0;

  return { totalTrainers, totalReviews, avgRating, totalCities };
}
