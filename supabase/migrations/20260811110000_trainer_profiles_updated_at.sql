-- Adds a real `updated_at` so the sitemap can give crawlers a genuine
-- freshness signal per trainer profile instead of no lastModified at all.

ALTER TABLE public.trainer_profiles
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trainer_profiles_set_updated_at ON public.trainer_profiles;
CREATE TRIGGER trainer_profiles_set_updated_at
  BEFORE UPDATE ON public.trainer_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- Recreate the public view (same shape as 20260714090000) with updated_at added.
DROP VIEW IF EXISTS public.trainer_profiles_public;

CREATE VIEW public.trainer_profiles_public AS
SELECT
  tp.id,
  tp.slug,
  tp.display_name,
  tp.city_slug,
  c.name    AS city_name,
  c.region  AS city_region,
  tp.headline,
  tp.short_bio,
  tp.long_bio,
  tp.specialties,
  tp.verified,
  tp.years_experience,
  tp.rating,
  tp.reviews_count,
  tp.price_from,
  tp.modalities,
  tp.languages,
  tp.hidden_contact_hint,
  tp.is_published,
  tp.created_at,
  tp.updated_at,
  tp.photo_url,
  tp.review_status
FROM public.trainer_profiles tp
LEFT JOIN public.cities c ON c.slug = tp.city_slug
WHERE tp.is_published = true
  AND tp.is_demo = false;

GRANT SELECT ON public.trainer_profiles_public TO anon;
GRANT SELECT ON public.trainer_profiles_public TO authenticated;
