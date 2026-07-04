-- Track moderation decisions on trainer profiles.

ALTER TABLE public.trainer_profiles
  ADD COLUMN IF NOT EXISTS reviewed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS reviewed_at timestamptz;

CREATE INDEX IF NOT EXISTS trainer_profiles_reviewed_at_idx
  ON public.trainer_profiles (reviewed_at DESC);

-- Recreate the self-service guard so trainer edits clear prior moderation.
CREATE OR REPLACE FUNCTION public.enforce_trainer_profile_review()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()) THEN
    RETURN NEW;
  END IF;

  NEW.is_published := false;
  NEW.review_status := 'pending';
  NEW.reviewed_by := NULL;
  NEW.reviewed_at := NULL;

  IF TG_OP = 'INSERT' THEN
    NEW.verified := false;
    NEW.subscription_status := 'inactive';
    NEW.stripe_customer_id := NULL;
  ELSE
    NEW.verified := OLD.verified;
    NEW.subscription_status := OLD.subscription_status;
    NEW.stripe_customer_id := OLD.stripe_customer_id;
  END IF;

  RETURN NEW;
END;
$$;
