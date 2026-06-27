-- Fix trainer_profiles_public view.
--
-- Problem: security_invoker = true means the view executes as the calling
-- role (anon). But we revoked anon's SELECT on trainer_profiles in migration
-- 200, so the view itself fails with "permission denied for table
-- trainer_profiles" when queried by anon.
--
-- Fix:
--   1. Remove security_invoker (revert to security_definer — view runs as
--      the owner who has full table access).
--   2. Add explicit WHERE is_published = true so unpublished rows are never
--      exposed (compensates for the owner bypassing RLS).
--   3. Inline the cities JOIN so PostgREST foreign-key inference is not
--      required and the repository can query a flat shape without nested
--      selects.

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
WHERE tp.is_published = true;

-- Re-grant SELECT after CREATE OR REPLACE resets grants.
GRANT SELECT ON public.trainer_profiles_public TO anon;
GRANT SELECT ON public.trainer_profiles_public TO authenticated;
