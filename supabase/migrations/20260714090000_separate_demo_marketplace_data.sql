-- Keep demo marketplace profiles out of production public surfaces.
--
-- Rollback:
--   alter table public.trainer_profiles drop column if exists is_demo;
--   recreate public.trainer_profiles_public with only "where tp.is_published = true".

ALTER TABLE public.trainer_profiles
  ADD COLUMN IF NOT EXISTS is_demo boolean NOT NULL DEFAULT false;

UPDATE public.trainer_profiles
SET is_demo = true
WHERE slug IN (
  'carlos-ruiz-entrenador-personal-fuengirola',
  'laura-moreno-fitness-malaga',
  'sergio-navarro-rendimiento-madrid'
);

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
  tp.photo_url,
  tp.review_status
FROM public.trainer_profiles tp
LEFT JOIN public.cities c ON c.slug = tp.city_slug
WHERE tp.is_published = true
  AND tp.is_demo = false;

GRANT SELECT ON public.trainer_profiles_public TO anon;
GRANT SELECT ON public.trainer_profiles_public TO authenticated;
