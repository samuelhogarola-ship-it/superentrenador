-- Add Stripe subscription fields to trainer profiles

ALTER TABLE public.trainer_profiles
  ADD COLUMN IF NOT EXISTS subscription_status text NOT NULL DEFAULT 'inactive',
  ADD COLUMN IF NOT EXISTS stripe_customer_id text;
