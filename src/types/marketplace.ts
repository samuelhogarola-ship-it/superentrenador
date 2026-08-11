import type { ReviewStatus } from "@/lib/supabase/database.types";

export interface MarketplaceCity {
  slug: string;
  name: string;
  region: string;
  country: string;
  heroTitle: string;
  intro: string;
  seoDescription: string;
}

export interface PublicTrainerProfile {
  id: string;
  slug: string;
  displayName: string;
  citySlug: string;
  city: string;
  region: string;
  category?: string;
  headline: string;
  shortBio: string;
  longBio: string;
  specialties: string[];
  verified: boolean;
  yearsExperience: number;
  rating: number;
  reviewsCount: number;
  priceFrom: number;
  priceUnit?: "hora" | "sesión";
  modalities: string[];
  languages: string[];
  hiddenContactHint: string;
  photoUrl: string | null;
  /** "draft" only ever occurs on static demo data — real DB rows are constrained to ReviewStatus. */
  reviewStatus: ReviewStatus | "draft";
}
