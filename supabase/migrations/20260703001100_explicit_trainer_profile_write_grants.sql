-- Make write privileges on trainer_profiles explicit.
--
-- RLS and triggers still enforce row ownership, moderation reset, and admin-only
-- approval. These grants define the column-level write surface available through
-- PostgREST for the authenticated role.

REVOKE INSERT ON public.trainer_profiles FROM authenticated;
REVOKE UPDATE ON public.trainer_profiles FROM authenticated;

GRANT INSERT (
  user_id,
  slug,
  display_name,
  city_slug,
  headline,
  short_bio,
  long_bio,
  specialties,
  modalities,
  languages,
  years_experience,
  price_from,
  contact_info,
  photo_url,
  hidden_contact_hint,
  is_published,
  review_status
) ON public.trainer_profiles TO authenticated;

GRANT UPDATE (
  user_id,
  slug,
  display_name,
  city_slug,
  headline,
  short_bio,
  long_bio,
  specialties,
  modalities,
  languages,
  years_experience,
  price_from,
  contact_info,
  photo_url,
  hidden_contact_hint,
  is_published,
  review_status,
  reviewed_by,
  reviewed_at
) ON public.trainer_profiles TO authenticated;
