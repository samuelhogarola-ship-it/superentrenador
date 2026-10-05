-- Allow a confirmed trainer to delete only the profile linked to their user.

GRANT DELETE ON public.trainer_profiles TO authenticated;

DROP POLICY IF EXISTS "Trainer can delete own profile" ON public.trainer_profiles;

CREATE POLICY "Trainer can delete own profile"
  ON public.trainer_profiles FOR DELETE TO authenticated
  USING (
    public.has_confirmed_email()
    AND auth.uid() = user_id
  );
