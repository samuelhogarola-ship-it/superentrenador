-- Enforce marketplace rate limits at database entry points so authenticated
-- callers cannot bypass the Next.js routes through direct PostgREST requests.

CREATE OR REPLACE FUNCTION public.get_public_trainer_contact_info(trainer_slug text)
RETURNS text
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_allowed boolean;
  v_contact_info text;
BEGIN
  IF NOT public.has_confirmed_email() THEN
    RETURN NULL;
  END IF;

  SELECT rl.allowed
  INTO v_allowed
  FROM public.check_rate_limit(
    'trainer-contact:' || auth.uid()::text,
    30,
    600
  ) rl;

  IF NOT COALESCE(v_allowed, false) THEN
    RAISE EXCEPTION 'rate_limit_exceeded' USING ERRCODE = 'P0001';
  END IF;

  SELECT tp.contact_info
  INTO v_contact_info
  FROM public.trainer_profiles tp
  WHERE tp.slug = trainer_slug
    AND tp.is_published = true
    AND tp.review_status = 'approved'
    AND tp.is_demo = false
  LIMIT 1;

  RETURN v_contact_info;
END;
$$;

REVOKE ALL ON FUNCTION public.get_public_trainer_contact_info(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_public_trainer_contact_info(text) TO authenticated;

CREATE OR REPLACE FUNCTION public.consume_message_rate_limit()
RETURNS boolean
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_allowed boolean;
BEGIN
  IF NOT public.has_confirmed_email() THEN
    RETURN false;
  END IF;

  SELECT rl.allowed
  INTO v_allowed
  FROM public.check_rate_limit(
    'messages:post:' || auth.uid()::text,
    5,
    600
  ) rl;

  IF NOT COALESCE(v_allowed, false) THEN
    RAISE EXCEPTION 'rate_limit_exceeded' USING ERRCODE = 'P0001';
  END IF;

  RETURN true;
END;
$$;

REVOKE ALL ON FUNCTION public.consume_message_rate_limit() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.consume_message_rate_limit() TO authenticated;

DROP POLICY IF EXISTS "Participants can insert thread messages" ON public.messages;

CREATE POLICY "Participants can insert thread messages"
  ON public.messages FOR INSERT TO authenticated
  WITH CHECK (
    public.has_confirmed_email()
    AND auth.uid() = sender_id
    AND CASE
      WHEN (
        (
          auth.uid() = client_id
          AND EXISTS (
            SELECT 1
            FROM public.trainer_profiles tp
            WHERE tp.id = trainer_profile_id
              AND tp.is_published = true
              AND tp.review_status = 'approved'
              AND tp.is_demo = false
          )
        )
        OR public.can_reply_to_message_thread(trainer_profile_id, client_id)
      )
      THEN public.consume_message_rate_limit()
      ELSE false
    END
  );
