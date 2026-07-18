-- Keep a stable client/trainer thread so trainers can answer without exposing
-- conversations to other clients or allowing either side to spoof a sender.

ALTER TABLE public.messages
  ADD COLUMN client_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

UPDATE public.messages SET client_id = sender_id WHERE client_id IS NULL;

ALTER TABLE public.messages ALTER COLUMN client_id SET NOT NULL;

CREATE INDEX messages_client_trainer_created_idx
  ON public.messages (client_id, trainer_profile_id, created_at DESC);

CREATE OR REPLACE FUNCTION public.can_reply_to_message_thread(
  target_trainer_profile_id uuid,
  target_client_id uuid
)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    auth.uid() IS NOT NULL
    AND target_client_id <> auth.uid()
    AND EXISTS (
      SELECT 1
      FROM public.trainer_profiles tp
      WHERE tp.id = target_trainer_profile_id
        AND tp.user_id = auth.uid()
    )
    AND EXISTS (
      SELECT 1
      FROM public.messages m
      WHERE m.trainer_profile_id = target_trainer_profile_id
        AND m.client_id = target_client_id
        AND m.sender_id = target_client_id
    )
$$;

REVOKE EXECUTE ON FUNCTION public.can_reply_to_message_thread(uuid, uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.can_reply_to_message_thread(uuid, uuid) TO authenticated;

DROP POLICY IF EXISTS "Sender can read own messages" ON public.messages;
DROP POLICY IF EXISTS "Trainer can read messages on own profiles" ON public.messages;
DROP POLICY IF EXISTS "Sender can insert own messages" ON public.messages;

CREATE POLICY "Thread client can read messages"
  ON public.messages FOR SELECT TO authenticated
  USING (auth.uid() = client_id);

CREATE POLICY "Trainer can read messages on own profiles"
  ON public.messages FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.trainer_profiles tp
      WHERE tp.id = trainer_profile_id AND tp.user_id = auth.uid()
    )
  );

CREATE POLICY "Participants can insert thread messages"
  ON public.messages FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = sender_id
    AND (
      (
        auth.uid() = client_id
        AND EXISTS (
          SELECT 1 FROM public.trainer_profiles tp
          WHERE tp.id = trainer_profile_id AND tp.is_published = true
        )
      )
      OR public.can_reply_to_message_thread(trainer_profile_id, client_id)
    )
  );

CREATE OR REPLACE FUNCTION public.enforce_message_sender_identity()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  jwt jsonb;
  sender_is_trainer boolean;
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN NEW;
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM public.trainer_profiles tp
    WHERE tp.id = NEW.trainer_profile_id AND tp.user_id = auth.uid()
  ) INTO sender_is_trainer;

  IF sender_is_trainer THEN
    IF NEW.client_id IS NULL
      OR NOT public.can_reply_to_message_thread(NEW.trainer_profile_id, NEW.client_id) THEN
      RAISE EXCEPTION 'Trainer cannot initiate this message thread' USING ERRCODE = '42501';
    END IF;
  ELSE
    NEW.client_id := auth.uid();
  END IF;

  jwt := auth.jwt();
  NEW.sender_id := auth.uid();
  NEW.sender_name := COALESCE(
    NULLIF(jwt #>> '{user_metadata,full_name}', ''),
    NULLIF(jwt ->> 'email', ''),
    'Usuario'
  );
  NEW.created_at := now();
  NEW.read_at := NULL;

  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.enforce_message_read_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.sender_id := OLD.sender_id;
  NEW.sender_name := OLD.sender_name;
  NEW.client_id := OLD.client_id;
  NEW.trainer_profile_id := OLD.trainer_profile_id;
  NEW.body := OLD.body;
  NEW.created_at := OLD.created_at;
  NEW.read_at := COALESCE(OLD.read_at, now());

  RETURN NEW;
END;
$$;
