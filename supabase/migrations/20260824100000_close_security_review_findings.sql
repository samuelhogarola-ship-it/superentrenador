-- Apply security review corrections in a new migration so environments that
-- already recorded the previous hardening migration receive every fix.

UPDATE public.trainer_profiles
SET is_published = false
WHERE is_published = true
  AND review_status <> 'approved';

ALTER TABLE public.trainer_profiles
  DROP CONSTRAINT IF EXISTS trainer_profiles_published_requires_approval,
  ADD CONSTRAINT trainer_profiles_published_requires_approval
    CHECK (NOT is_published OR review_status = 'approved');

CREATE OR REPLACE VIEW public.trainer_profiles_public AS
SELECT
  tp.id,
  tp.slug,
  tp.display_name,
  tp.city_slug,
  c.name AS city_name,
  c.region AS city_region,
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
  tp.updated_at,
  tp.photo_url,
  tp.review_status
FROM public.trainer_profiles tp
LEFT JOIN public.cities c ON c.slug = tp.city_slug
WHERE tp.is_published = true
  AND tp.review_status = 'approved'
  AND tp.is_demo = false;

GRANT SELECT ON public.trainer_profiles_public TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.get_public_trainer_contact_info(trainer_slug text)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT tp.contact_info
  FROM public.trainer_profiles tp
  WHERE public.has_confirmed_email()
    AND tp.slug = trainer_slug
    AND tp.is_published = true
    AND tp.review_status = 'approved'
  LIMIT 1
$$;

REVOKE ALL ON FUNCTION public.get_public_trainer_contact_info(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_public_trainer_contact_info(text) TO authenticated;

CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_key text,
  p_limit integer,
  p_window_seconds integer
)
RETURNS TABLE(allowed boolean, remaining integer, reset_at timestamptz)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_now timestamptz := now();
  v_reset_at timestamptz;
  v_count integer;
  v_expected_limit integer;
  v_expected_window_seconds integer := 600;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required' USING ERRCODE = '42501';
  END IF;

  v_expected_limit := CASE
    WHEN p_key LIKE 'trainer-contact:%' THEN 30
    WHEN p_key LIKE 'messages:post:%' THEN 5
    ELSE NULL
  END;

  IF p_key IS NULL
    OR length(p_key) > 200
    OR v_expected_limit IS NULL
    OR p_limit <> v_expected_limit
    OR p_window_seconds <> v_expected_window_seconds
    OR right(p_key, 36) <> auth.uid()::text
  THEN
    RAISE EXCEPTION 'Invalid rate limit parameters' USING ERRCODE = '22023';
  END IF;

  IF random() < 0.01 THEN
    DELETE FROM public.rate_limit_buckets WHERE reset_at < v_now - interval '1 day';
  END IF;

  INSERT INTO public.rate_limit_buckets AS b (key, count, reset_at)
  VALUES (p_key, 1, v_now + make_interval(secs => p_window_seconds))
  ON CONFLICT (key) DO UPDATE
    SET count = CASE WHEN b.reset_at <= v_now THEN 1 ELSE b.count + 1 END,
        reset_at = CASE
          WHEN b.reset_at <= v_now THEN v_now + make_interval(secs => p_window_seconds)
          ELSE b.reset_at
        END
  RETURNING b.count, b.reset_at INTO v_count, v_reset_at;

  RETURN QUERY
  SELECT (v_count <= p_limit), GREATEST(p_limit - v_count, 0), v_reset_at;
END;
$$;

REVOKE ALL ON FUNCTION public.check_rate_limit(text, integer, integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.check_rate_limit(text, integer, integer) TO authenticated;

DROP POLICY IF EXISTS "Participants can insert thread messages" ON public.messages;

CREATE POLICY "Participants can insert thread messages"
  ON public.messages FOR INSERT TO authenticated
  WITH CHECK (
    public.has_confirmed_email()
    AND auth.uid() = sender_id
    AND (
      (
        auth.uid() = client_id
        AND EXISTS (
          SELECT 1
          FROM public.trainer_profiles tp
          WHERE tp.id = trainer_profile_id
            AND tp.is_published = true
            AND tp.review_status = 'approved'
        )
      )
      OR public.can_reply_to_message_thread(trainer_profile_id, client_id)
    )
  );

DROP POLICY IF EXISTS "trainer_photos_authenticated_insert" ON storage.objects;
DROP POLICY IF EXISTS "trainer_photos_authenticated_update" ON storage.objects;

CREATE POLICY "trainer_photos_authenticated_insert"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    public.has_confirmed_email()
    AND bucket_id = 'trainer-photos'
    AND name = auth.uid()::text || '/profile'
  );

CREATE POLICY "trainer_photos_authenticated_update"
  ON storage.objects FOR UPDATE TO authenticated
  USING (
    public.has_confirmed_email()
    AND bucket_id = 'trainer-photos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  )
  WITH CHECK (
    public.has_confirmed_email()
    AND bucket_id = 'trainer-photos'
    AND name = auth.uid()::text || '/profile'
  );
