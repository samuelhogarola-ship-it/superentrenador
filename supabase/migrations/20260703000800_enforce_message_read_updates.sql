-- Keep read receipts server-owned.
--
-- Trainers may update only read_at, and this trigger normalizes that update to
-- the database clock so clients cannot spoof read timestamps or mark messages
-- unread through the public API.

CREATE OR REPLACE FUNCTION public.enforce_message_read_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.sender_id := OLD.sender_id;
  NEW.sender_name := OLD.sender_name;
  NEW.trainer_profile_id := OLD.trainer_profile_id;
  NEW.body := OLD.body;
  NEW.created_at := OLD.created_at;
  NEW.read_at := COALESCE(OLD.read_at, now());

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS enforce_message_read_update
  ON public.messages;

CREATE TRIGGER enforce_message_read_update
  BEFORE UPDATE ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_message_read_update();
