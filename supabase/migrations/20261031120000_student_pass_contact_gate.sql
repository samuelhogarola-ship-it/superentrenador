-- A monthly student pass is required to reveal trainer contact details or send
-- messages. Passes are activated manually until automated billing is available.

CREATE TABLE IF NOT EXISTS public.student_passes (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'inactive' CHECK (status IN ('inactive', 'active')),
  current_period_end timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.student_passes ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.student_passes FROM PUBLIC, anon, authenticated;
GRANT ALL ON public.student_passes TO service_role;

CREATE OR REPLACE FUNCTION public.has_active_student_pass()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.student_passes sp
    WHERE sp.user_id = auth.uid()
      AND sp.status = 'active'
      AND sp.current_period_end > now()
  )
$$;

REVOKE ALL ON FUNCTION public.has_active_student_pass() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_active_student_pass() TO authenticated;

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
  IF NOT public.has_confirmed_email() OR NOT public.has_active_student_pass() THEN
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
          AND public.has_active_student_pass()
          AND EXISTS (
            SELECT 1
            FROM public.trainer_profiles tp
            WHERE tp.id = trainer_profile_id
              AND tp.is_published = true
              AND tp.review_status = 'approved'
              AND tp.is_demo = false
          )
        )
        OR (
          EXISTS (
            SELECT 1
            FROM public.trainer_profiles own_profile
            WHERE own_profile.id = trainer_profile_id
              AND own_profile.user_id = auth.uid()
          )
          AND public.can_reply_to_message_thread(trainer_profile_id, client_id)
        )
      )
      THEN public.consume_message_rate_limit()
      ELSE false
    END
  );
