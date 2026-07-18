-- Moderation needs sensitive profile fields without granting browser-wide table access.

CREATE OR REPLACE FUNCTION public.get_admin_trainer_profiles()
RETURNS TABLE (
  id uuid,
  slug text,
  display_name text,
  city_slug text,
  city_name text,
  city_region text,
  headline text,
  short_bio text,
  long_bio text,
  specialties text[],
  modalities text[],
  languages text[],
  years_experience integer,
  price_from numeric,
  contact_info text,
  photo_url text,
  review_status text,
  is_published boolean,
  created_at timestamptz
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
    tp.city_slug,
    c.name,
    c.region,
    tp.headline,
    tp.short_bio,
    tp.long_bio,
    tp.specialties,
    tp.modalities,
    tp.languages,
    tp.years_experience,
    tp.price_from,
    tp.contact_info,
    tp.photo_url,
    tp.review_status,
    tp.is_published,
    tp.created_at
  FROM public.trainer_profiles tp
  LEFT JOIN public.cities c ON c.slug = tp.city_slug
  WHERE auth.uid() IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM public.admin_users au WHERE au.user_id = auth.uid()
    )
  ORDER BY tp.created_at DESC
$$;

REVOKE EXECUTE ON FUNCTION public.get_admin_trainer_profiles() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_admin_trainer_profiles() TO authenticated;
