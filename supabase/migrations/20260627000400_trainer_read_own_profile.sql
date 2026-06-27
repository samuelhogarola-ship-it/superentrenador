-- Trainers could not read their own profile when is_published = false
-- (e.g. after admin rejection). The only existing SELECT policy requires
-- is_published = true, so a rejected trainer's getTrainerProfile() call
-- returned null and their mi-perfil form appeared empty.
--
-- This policy lets authenticated users always read their own row,
-- regardless of publish status, so they can fix and resubmit.

CREATE POLICY "Trainer can read own profile"
  ON public.trainer_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);
