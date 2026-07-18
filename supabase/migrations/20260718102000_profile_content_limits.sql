-- Enforce the same practical content limits for direct PostgREST writes as the UI.
-- NOT VALID keeps legacy rows deployable while protecting every new write.

ALTER TABLE public.trainer_profiles
  ADD CONSTRAINT trainer_profiles_text_lengths_check CHECK (
    length(display_name) <= 120
    AND length(headline) <= 180
    AND length(short_bio) <= 320
    AND length(long_bio) <= 3000
    AND length(hidden_contact_hint) <= 240
    AND length(contact_info) <= 500
    AND (photo_url IS NULL OR length(photo_url) <= 1000)
  ) NOT VALID,
  ADD CONSTRAINT trainer_profiles_array_lengths_check CHECK (
    cardinality(specialties) BETWEEN 1 AND 12
    AND cardinality(modalities) BETWEEN 1 AND 4
    AND cardinality(languages) BETWEEN 1 AND 10
    AND length(array_to_string(specialties, '')) <= 1200
    AND length(array_to_string(modalities, '')) <= 400
    AND length(array_to_string(languages, '')) <= 600
  ) NOT VALID,
  ADD CONSTRAINT trainer_profiles_business_ranges_check CHECK (
    price_from BETWEEN 0 AND 10000
    AND reviews_count BETWEEN 0 AND 1000000
  ) NOT VALID,
  ADD CONSTRAINT trainer_profiles_photo_url_check CHECK (
    photo_url IS NULL OR photo_url ~ '^https://'
  ) NOT VALID;
