-- Prevent clients from spoofing message sender identity.
--
-- RLS already requires sender_id = auth.uid(); this trigger also derives the
-- visible sender_name from the authenticated JWT instead of trusting the browser.

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

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS enforce_message_sender_identity
  ON public.messages;

CREATE TRIGGER enforce_message_sender_identity
  BEFORE INSERT ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_message_sender_identity();
