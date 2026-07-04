-- Constrain profile moderation and subscription states to values understood by
-- the application.

UPDATE public.trainer_profiles
SET review_status = 'pending'
WHERE review_status NOT IN ('pending', 'approved', 'rejected');

UPDATE public.trainer_profiles
SET subscription_status = 'inactive'
WHERE subscription_status NOT IN ('inactive', 'active');

ALTER TABLE public.trainer_profiles
  DROP CONSTRAINT IF EXISTS trainer_profiles_review_status_check,
  ADD CONSTRAINT trainer_profiles_review_status_check
    CHECK (review_status IN ('pending', 'approved', 'rejected'));

ALTER TABLE public.trainer_profiles
  DROP CONSTRAINT IF EXISTS trainer_profiles_subscription_status_check,
  ADD CONSTRAINT trainer_profiles_subscription_status_check
    CHECK (subscription_status IN ('inactive', 'active'));
