-- Keep message creation tied to published trainer profiles and server-owned
-- message metadata.

DROP POLICY IF EXISTS "Sender can insert own messages" ON public.messages;

CREATE POLICY "Sender can insert own messages"
  ON public.messages FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = sender_id
    AND EXISTS (
      SELECT 1 FROM public.trainer_profiles tp
      WHERE tp.id = trainer_profile_id
        AND tp.is_published = true
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
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN NEW;
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
