-- Replace column-level grants with a security_invoker view.
--
-- Problem in v2 migration: stripe_customer_id and other sensitive columns were
-- included in the anon GRANT. A view provides a cleaner, stable public surface
-- and makes it impossible to accidentally expose columns added to the table later.
--
-- The view uses security_invoker = true so RLS policies on trainer_profiles
-- (e.g. is_published = true for anon) still apply at query time.

-- 1. Revoke all column-level and table-level grants from anon (cleans up v1 + v2).
REVOKE SELECT ON public.trainer_profiles FROM anon;

-- 2. Create the public view — only safe columns, no contact_info / stripe_customer_id
--    / subscription_status / user_id.
CREATE OR REPLACE VIEW public.trainer_profiles_public
  WITH (security_invoker = true)
AS
SELECT
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
  photo_url,
  review_status
FROM public.trainer_profiles;

-- 3. Grant anon SELECT on the view only — never on the base table.
GRANT SELECT ON public.trainer_profiles_public TO anon;

-- 4. authenticated retains full SELECT on the base table (contact_info included).
GRANT SELECT ON public.trainer_profiles TO authenticated;
