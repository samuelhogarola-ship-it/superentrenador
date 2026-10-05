import { hasSupabaseEnv } from "@/lib/supabase/client";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { marketplaceCities, publicTrainerProfiles } from "@/lib/marketplace-data";
import { MARKETPLACE_CATEGORIES, MARKETPLACE_MODALITIES, MARKETPLACE_SPECIALTIES } from "@/lib/marketplace-taxonomy";
import type { Tables } from "@/lib/supabase/database.types";
import type { MarketplaceCity, PublicTrainerProfile } from "@/types/marketplace";

export interface TrainerFilters {
  q?: string;
  category?: string;
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
//
// The generated view type marks every column nullable (accurate for an empty
// view row), but a real published profile always has these populated — the
// `as unknown as TrainerRow` casts below assert that business invariant.
// Derived from the generated type instead of hand-restated so the two can't
// drift out of sync again.
type PublicTrainerViewRow = Tables<"trainer_profiles_public">;
type TrainerRow = Omit<
  { [K in keyof PublicTrainerViewRow]: NonNullable<PublicTrainerViewRow[K]> },
  "city_name" | "city_region"
> & {
  city_name: string | null;
  city_region: string | null;
};

// Columns to fetch from trainer_profiles_public view (no nested selects needed).
const PUBLIC_VIEW_COLUMNS =
  "id, slug, display_name, city_slug, city_name, city_region, " +
  "headline, short_bio, long_bio, specialties, verified, years_experience, " +
  "rating, reviews_count, price_from, modalities, languages, " +
  "hidden_contact_hint, photo_url, review_status, updated_at";

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
    updatedAt: row.updated_at,
  };
}

function sortTrainers(trainers: PublicTrainerProfile[], sort: TrainerFilters["sort"]) {
  if (sort === "price-asc") {
    return [...trainers].sort((a, b) => a.priceFrom - b.priceFrom);
  }
  if (sort === "price-desc") {
    return [...trainers].sort((a, b) => b.priceFrom - a.priceFrom);
  }
  if (sort === "rating") {
    return [...trainers].sort((a, b) => {
      if (a.reviewsCount !== b.reviewsCount) return b.reviewsCount - a.reviewsCount;
      return b.rating - a.rating;
    });
  }
  return [...trainers].sort((a, b) => {
    if (a.verified !== b.verified) return Number(b.verified) - Number(a.verified);
    return a.displayName.localeCompare(b.displayName, "es");
  });
}

function filterStaticTrainers(filters: TrainerFilters) {
  let trainers = getDemoTrainerProfiles();

  if (filters.q) {
    const query = filters.q.trim().toLocaleLowerCase("es");
    trainers = trainers.filter((trainer) => [
      trainer.displayName,
      trainer.city,
      trainer.category ?? "",
      trainer.headline,
      trainer.shortBio,
      ...trainer.specialties,
    ].join(" ").toLocaleLowerCase("es").includes(query));
  }

  if (filters.category) {
    trainers = trainers.filter(
      (trainer) => trainer.category === filters.category || trainer.specialties.includes(filters.category!),
    );
  }
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
    return [];
  }

  return (data as CityRow[]).map(mapCity);
}

export async function getMarketplaceCity(slug: string): Promise<MarketplaceCity | null> {
  if (!hasSupabaseEnv()) {
    return marketplaceCities.find((city) => city.slug === slug) ?? null;
  }

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase.from("cities").select("*").eq("slug", slug).maybeSingle();

  if (error) {
    console.error("[supabase] getMarketplaceCity failed", error);
    return null;
  }

  if (!data) {
    return null;
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

  if (filters.category) {
    // `category` (sport/discipline, e.g. "Fútbol") is a different taxonomy from
    // `specialties` (e.g. "Fuerza") and has no dedicated column on the profile —
    // match it against specialties and free-text bio fields instead of a column
    // that can never contain it.
    const term = filters.category.replace(/[%,()]/g, " ").trim();
    query = query.or(
      `specialties.cs.{${filters.category}},headline.ilike.%${term}%,short_bio.ilike.%${term}%,long_bio.ilike.%${term}%`,
    );
  }
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
  } else if (filters.sort === "rating") {
    query = query.order("reviews_count", { ascending: false }).order("rating", { ascending: false });
  } else {
    query = query.order("verified", { ascending: false }).order("created_at", { ascending: false });
  }

  const { data, error } = await query;

  if (error || !data) {
    console.error("[supabase] listPublicTrainerProfiles failed", error);
    return [];
  }

  const profiles = (data as unknown as TrainerRow[]).filter((row) => !isProductionDemoProfile(row)).map(mapTrainer);
  if (!filters.q) return profiles;

  const queryText = filters.q.trim().toLocaleLowerCase("es");
  return profiles.filter((trainer) => [
    trainer.displayName,
    trainer.city,
    trainer.headline,
    trainer.shortBio,
    ...trainer.specialties,
  ].join(" ").toLocaleLowerCase("es").includes(queryText));
}

export async function listAllCategories(): Promise<string[]> {
  const set = new Set<string>(MARKETPLACE_CATEGORIES);
  return Array.from(set);
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
    if (isMarketplaceDemoMode()) {
      return publicTrainerProfiles.find((profile) => profile.slug === slug) ?? null;
    }

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
  const set = new Set<string>(MARKETPLACE_SPECIALTIES);
  if (!hasSupabaseEnv()) {
    getDemoTrainerProfiles().forEach((t) => t.specialties.forEach((s) => set.add(s)));
    return Array.from(set).sort((a, b) => a.localeCompare(b, "es"));
  }

  const supabase = getSupabaseServerClient();
  const { data } = await supabase
    .from("trainer_profiles_public")
    .select("slug, specialties");

  if (!data) return Array.from(set);

  (data as Pick<TrainerRow, "slug" | "specialties">[])
    .filter((row) => !isProductionDemoProfile(row))
    .forEach((row) => (row.specialties ?? []).forEach((s) => set.add(s)));
  return Array.from(set).sort((a, b) => a.localeCompare(b, "es"));
}

/** Only fetches the `modalities` column — avoids loading full profiles. */
export async function listAllModalities(): Promise<string[]> {
  const set = new Set<string>(MARKETPLACE_MODALITIES);
  if (!hasSupabaseEnv()) {
    getDemoTrainerProfiles().forEach((t) => t.modalities.forEach((m) => set.add(m)));
    return Array.from(set).sort((a, b) => a.localeCompare(b, "es"));
  }

  const supabase = getSupabaseServerClient();
  const { data } = await supabase
    .from("trainer_profiles_public")
    .select("slug, modalities");

  if (!data) return Array.from(set);

  (data as Pick<TrainerRow, "slug" | "modalities">[])
    .filter((row) => !isProductionDemoProfile(row))
    .forEach((row) => (row.modalities ?? []).forEach((m) => set.add(m)));
  return Array.from(set).sort((a, b) => a.localeCompare(b, "es"));
}

/** Uses lightweight COUNT + aggregation queries — does not call listPublicTrainerProfiles. */
export async function getMarketplaceStats() {
  if (!hasSupabaseEnv()) {
    const trainers = getDemoTrainerProfiles();
    const totalTrainers = trainers.length;
    const totalReviews = trainers.reduce((sum, trainer) => sum + trainer.reviewsCount, 0);
    const avgRating = totalTrainers
      ? trainers.reduce((sum, trainer) => sum + trainer.rating, 0) / totalTrainers
      : 0;
    return { totalTrainers, totalCities: marketplaceCities.length, totalReviews, avgRating };
  }

  const supabase = getSupabaseServerClient();

  const [profilesRes, citiesCountRes] = await Promise.all([
    supabase
      .from("trainer_profiles_public")
      .select("slug, rating, reviews_count"),
    supabase
      .from("cities")
      .select("*", { count: "exact", head: true }),
  ]);

  const profiles = ((profilesRes.data ?? []) as Pick<TrainerRow, "slug" | "rating" | "reviews_count">[]).filter(
    (row) => !isProductionDemoProfile(row)
  );
  const totalTrainers = profiles.length;
  const totalCities = citiesCountRes.count ?? 0;
  const totalReviews = profiles.reduce((sum, row) => sum + (row.reviews_count ?? 0), 0);
  const avgRating = totalTrainers
    ? profiles.reduce((sum, row) => sum + (row.rating ?? 0), 0) / totalTrainers
    : 0;

  return { totalTrainers, totalCities, totalReviews, avgRating };
}
