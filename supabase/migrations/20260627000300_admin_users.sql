-- Replace email-literal admin checks with a proper admin_users table.
--
-- Previous approach encoded samuel.hogarola@gmail.com directly in RLS policies
-- and in client-side JS. Problems:
--   - Email change silently breaks DB policies.
--   - Email hardcoded in JS is a leaked detail with no server-side enforcement.
--
-- New approach: admin_users(user_id) table. RLS policies check
-- EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()).

CREATE TABLE IF NOT EXISTS public.admin_users (
  user_id   uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Each authenticated user can only see their own row (for "am I admin?" checks).
CREATE POLICY "admin_users: read own row"
  ON public.admin_users FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

GRANT SELECT ON public.admin_users TO authenticated;

-- Update trainer_profiles admin policies to use admin_users instead of email.
DROP POLICY IF EXISTS "Admin can read all trainer profiles" ON public.trainer_profiles;
CREATE POLICY "Admin can read all trainer profiles"
  ON public.trainer_profiles FOR SELECT
  TO authenticated
  USING (
    is_published = true
    OR EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Admin can update trainer profiles" ON public.trainer_profiles;
CREATE POLICY "Admin can update trainer profiles"
  ON public.trainer_profiles FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()));

-- Bootstrap: seed the initial admin from auth.users by email.
-- This is a one-time data migration; the email only appears here, not in any
-- auth policy. If the admin email changes, run a manual UPDATE on this table.
INSERT INTO public.admin_users (user_id)
SELECT id FROM auth.users WHERE email = 'samuel.hogarola@gmail.com'
ON CONFLICT DO NOTHING;
