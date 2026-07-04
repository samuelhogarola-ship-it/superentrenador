-- Avoid exposing trainer auth user ids through direct browser reads.
--
-- Own-profile lookups that need user_id filtering now go through SECURITY
-- DEFINER functions. Direct authenticated SELECT keeps only non-sensitive,
-- marketplace-facing columns from trainer_profiles.

CREATE OR REPLACE FUNCTION public.get_own_trainer_dashboard_profile()
RETURNS TABLE (
  id uuid,
  slug text,
  display_name text,
  review_status text,
  is_published boolean
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    tp.id,
    tp.slug,
    tp.display_name,
    tp.review_status,
    tp.is_published
  FROM public.trainer_profiles tp
  WHERE auth.uid() IS NOT NULL
    AND tp.user_id = auth.uid()
  LIMIT 1
$$;

CREATE OR REPLACE FUNCTION public.get_own_trainer_message_profile()
RETURNS TABLE (
  id uuid,
  display_name text,
  slug text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    tp.id,
    tp.display_name,
    tp.slug
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

REVOKE EXECUTE ON FUNCTION public.get_own_trainer_dashboard_profile() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_own_trainer_message_profile() FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.get_own_trainer_dashboard_profile() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_own_trainer_message_profile() TO authenticated;
