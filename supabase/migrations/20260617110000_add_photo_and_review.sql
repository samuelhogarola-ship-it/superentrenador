-- Add photo URL and review status to trainer profiles

ALTER TABLE public.trainer_profiles
  ADD COLUMN IF NOT EXISTS photo_url text,
  ADD COLUMN IF NOT EXISTS review_status text NOT NULL DEFAULT 'pending';

-- Existing published profiles are already approved
UPDATE public.trainer_profiles
  SET review_status = 'approved'
  WHERE is_published = true AND review_status = 'pending';

-- Admin can read all trainer profiles (including unpublished / pending)
CREATE POLICY IF NOT EXISTS "Admin can read all trainer profiles"
  ON public.trainer_profiles FOR SELECT
  USING ((auth.jwt() ->> 'email') = 'samuel.hogarola@gmail.com');

-- Admin can update all trainer profiles (approve / reject / edit)
CREATE POLICY IF NOT EXISTS "Admin can update trainer profiles"
  ON public.trainer_profiles FOR UPDATE
  USING ((auth.jwt() ->> 'email') = 'samuel.hogarola@gmail.com')
  WITH CHECK ((auth.jwt() ->> 'email') = 'samuel.hogarola@gmail.com');
