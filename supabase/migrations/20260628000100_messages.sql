CREATE TABLE public.messages (
  id                 uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id          uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sender_name        text        NOT NULL,
  trainer_profile_id uuid        NOT NULL REFERENCES public.trainer_profiles(id) ON DELETE CASCADE,
  body               text        NOT NULL CHECK (char_length(trim(body)) > 0 AND char_length(body) <= 2000),
  created_at         timestamptz NOT NULL DEFAULT now(),
  read_at            timestamptz
);

CREATE INDEX ON public.messages (trainer_profile_id, created_at DESC);
CREATE INDEX ON public.messages (sender_id, created_at DESC);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Clients: insert their own messages
CREATE POLICY "Sender can insert own messages"
  ON public.messages FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = sender_id);

-- Clients: read messages they sent
CREATE POLICY "Sender can read own messages"
  ON public.messages FOR SELECT TO authenticated
  USING (auth.uid() = sender_id);

-- PTs: read messages sent to their profiles
CREATE POLICY "Trainer can read messages on own profiles"
  ON public.messages FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.trainer_profiles tp
      WHERE tp.id = trainer_profile_id AND tp.user_id = auth.uid()
    )
  );

-- PTs: mark messages as read (only read_at column)
CREATE POLICY "Trainer can mark messages as read"
  ON public.messages FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.trainer_profiles tp
      WHERE tp.id = trainer_profile_id AND tp.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.trainer_profiles tp
      WHERE tp.id = trainer_profile_id AND tp.user_id = auth.uid()
    )
  );
