-- Basic profile content integrity.
--
-- Keep public marketplace data in ranges and shapes the app understands.

UPDATE public.trainer_profiles
SET
  years_experience = GREATEST(years_experience, 0),
  rating = LEAST(GREATEST(rating, 0), 5),
  reviews_count = GREATEST(reviews_count, 0),
  price_from = GREATEST(price_from, 0);

ALTER TABLE public.trainer_profiles
  DROP CONSTRAINT IF EXISTS trainer_profiles_slug_format_check,
  ADD CONSTRAINT trainer_profiles_slug_format_check
    CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$');

ALTER TABLE public.trainer_profiles
  DROP CONSTRAINT IF EXISTS trainer_profiles_text_content_check,
  ADD CONSTRAINT trainer_profiles_text_content_check
    CHECK (
      length(trim(display_name)) > 0
      AND length(trim(headline)) > 0
      AND length(trim(short_bio)) > 0
      AND length(trim(long_bio)) > 0
      AND length(trim(hidden_contact_hint)) > 0
    );

ALTER TABLE public.trainer_profiles
  DROP CONSTRAINT IF EXISTS trainer_profiles_numbers_check,
  ADD CONSTRAINT trainer_profiles_numbers_check
    CHECK (
      years_experience >= 0
      AND years_experience <= 80
      AND rating >= 0
      AND rating <= 5
      AND reviews_count >= 0
      AND price_from >= 0
    );
