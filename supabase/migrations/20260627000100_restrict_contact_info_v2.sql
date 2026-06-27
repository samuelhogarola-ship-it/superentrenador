-- contact_info must never be visible to anonymous users.
--
-- The first migration (20260627000000) only attempted a column-level REVOKE,
-- which has no effect when the role already holds table-level SELECT.
-- This migration applies the correct fix:
--   1. Revoke table-level SELECT from anon.
--   2. Re-grant SELECT on every column EXCEPT contact_info.
-- PostgREST respects column-level-only grants: SELECT * omits non-granted
-- columns and explicit requests for contact_info return HTTP 403.

REVOKE SELECT ON public.trainer_profiles FROM anon;

GRANT SELECT (
  id,
  slug,
  display_name,
  city_slug,
  headline,
  short_bio,
  long_bio,
  specialties,
  verified,
  years_experience,
  rating,
  reviews_count,
  price_from,
  modalities,
  languages,
  hidden_contact_hint,
  is_published,
  created_at,
  user_id,
  photo_url,
  review_status,
  subscription_status,
  stripe_customer_id
) ON public.trainer_profiles TO anon;

-- authenticated retains full table-level SELECT (contact_info included).
GRANT SELECT ON public.trainer_profiles TO authenticated;
