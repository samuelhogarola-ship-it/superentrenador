-- contact_info must never be visible to anonymous users.
--
-- PostgreSQL column-level privilege enforcement:
-- Revoking a single column while the role has table-level SELECT has no effect,
-- because table-level SELECT already grants access to all columns.
-- The correct fix is to revoke table-level SELECT from anon and then re-grant
-- SELECT on every column EXCEPT contact_info.
-- PostgREST respects column-level-only grants and omits non-granted columns
-- from SELECT * results (returns 403 on explicit contact_info requests).

-- 1. Drop the table-level grant from anon.
REVOKE SELECT ON public.trainer_profiles FROM anon;

-- 2. Re-grant SELECT on every public column except contact_info.
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

-- 3. authenticated retains full table-level SELECT (contact_info included).
GRANT SELECT ON public.trainer_profiles TO authenticated;
