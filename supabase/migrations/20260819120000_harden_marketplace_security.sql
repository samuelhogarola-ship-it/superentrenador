-- Close legacy grants and require verified identities for sensitive marketplace RPCs.

DO $$
DECLARE
  v_column text;
BEGIN
  FOR v_column IN
    SELECT column_name
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'trainer_profiles'
  LOOP
    EXECUTE format(
      'REVOKE SELECT (%I) ON TABLE public.trainer_profiles FROM anon',
      v_column
    );
  END LOOP;
END;
$$;

REVOKE ALL PRIVILEGES ON TABLE public.trainer_profiles FROM anon;
GRANT SELECT ON public.trainer_profiles_public TO anon;

CREATE OR REPLACE FUNCTION public.has_confirmed_email()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM auth.users
    WHERE id = auth.uid()
      AND email_confirmed_at IS NOT NULL
  )
$$;

REVOKE ALL ON FUNCTION public.has_confirmed_email() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_confirmed_email() TO authenticated;

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
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required' USING ERRCODE = '42501';
  END IF;

  IF p_key IS NULL
    OR length(p_key) > 200
    OR p_limit NOT BETWEEN 1 AND 100
    OR p_window_seconds NOT BETWEEN 1 AND 86400
    OR NOT (p_key LIKE 'trainer-contact:%' OR p_key LIKE 'messages:post:%')
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

DROP POLICY IF EXISTS "Thread client can read messages" ON public.messages;
DROP POLICY IF EXISTS "Trainer can read messages on own profiles" ON public.messages;
DROP POLICY IF EXISTS "Participants can insert thread messages" ON public.messages;
DROP POLICY IF EXISTS "Trainer can mark messages as read" ON public.messages;

CREATE POLICY "Thread client can read messages"
  ON public.messages FOR SELECT TO authenticated
  USING (
    public.has_confirmed_email()
    AND auth.uid() = client_id
  );

CREATE POLICY "Trainer can read messages on own profiles"
  ON public.messages FOR SELECT TO authenticated
  USING (
    public.has_confirmed_email()
    AND EXISTS (
      SELECT 1
      FROM public.trainer_profiles tp
      WHERE tp.id = trainer_profile_id
        AND tp.user_id = auth.uid()
    )
  );

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
        )
      )
      OR public.can_reply_to_message_thread(trainer_profile_id, client_id)
    )
  );

CREATE POLICY "Trainer can mark messages as read"
  ON public.messages FOR UPDATE TO authenticated
  USING (
    public.has_confirmed_email()
    AND EXISTS (
      SELECT 1
      FROM public.trainer_profiles tp
      WHERE tp.id = trainer_profile_id
        AND tp.user_id = auth.uid()
    )
  )
  WITH CHECK (
    public.has_confirmed_email()
    AND EXISTS (
      SELECT 1
      FROM public.trainer_profiles tp
      WHERE tp.id = trainer_profile_id
        AND tp.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "trainer_photos_authenticated_insert" ON storage.objects;
DROP POLICY IF EXISTS "trainer_photos_authenticated_update" ON storage.objects;
DROP POLICY IF EXISTS "trainer_photos_authenticated_delete" ON storage.objects;

CREATE POLICY "trainer_photos_authenticated_insert"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    public.has_confirmed_email()
    AND bucket_id = 'trainer-photos'
    AND (storage.foldername(name))[1] = auth.uid()::text
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
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "trainer_photos_authenticated_delete"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    public.has_confirmed_email()
    AND bucket_id = 'trainer-photos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
