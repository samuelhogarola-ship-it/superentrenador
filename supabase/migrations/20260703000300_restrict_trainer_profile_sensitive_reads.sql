-- Keep sensitive trainer profile fields off the browser-readable base table.
--
-- Authenticated users still need legitimate access to:
--   - their own full editable profile,
--   - their own Coach Studio subscription status,
--   - a published trainer's contact info after logging in.
--
-- Those paths now go through SECURITY DEFINER functions with explicit checks,
-- while direct SELECT on trainer_profiles excludes contact/subscription fields.

CREATE OR REPLACE FUNCTION public.get_public_trainer_contact_info(trainer_slug text)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT tp.contact_info
  FROM public.trainer_profiles tp
  WHERE auth.uid() IS NOT NULL
    AND tp.slug = trainer_slug
    AND tp.is_published = true
  LIMIT 1
$$;

CREATE OR REPLACE FUNCTION public.get_own_trainer_subscription_status()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT tp.subscription_status
  FROM public.trainer_profiles tp
  WHERE auth.uid() IS NOT NULL
    AND tp.user_id = auth.uid()
  LIMIT 1
$$;

CREATE OR REPLACE FUNCTION public.get_own_trainer_profile()
RETURNS TABLE (
  slug text,
  display_name text,
  city_slug text,
  headline text,
  short_bio text,
  long_bio text,
  specialties text[],
  modalities text[],
  languages text[],
  years_experience integer,
  price_from numeric,
  hidden_contact_hint text,
  contact_info text,
  photo_url text,
  review_status text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    tp.slug,
    tp.display_name,
    tp.city_slug,
    tp.headline,
    tp.short_bio,
    tp.long_bio,
    tp.specialties,
    tp.modalities,
    tp.languages,
    tp.years_experience,
    tp.price_from,
    tp.hidden_contact_hint,
    tp.contact_info,
    tp.photo_url,
    tp.review_status
  FROM public.trainer_profiles tp
  WHERE auth.uid() IS NOT NULL
    AND tp.user_id = auth.uid()
  LIMIT 1
$$;

REVOKE SELECT ON public.trainer_profiles FROM authenticated;

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
  photo_url,
  review_status
) ON public.trainer_profiles TO authenticated;

REVOKE EXECUTE ON FUNCTION public.get_public_trainer_contact_info(text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_own_trainer_subscription_status() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_own_trainer_profile() FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.get_public_trainer_contact_info(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_own_trainer_subscription_status() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_own_trainer_profile() TO authenticated;
