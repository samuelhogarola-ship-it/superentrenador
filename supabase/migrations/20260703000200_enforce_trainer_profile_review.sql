-- Enforce moderation state for trainer self-service writes.
--
-- Client-side code already sends edited profiles back to review, but RLS alone
-- cannot restrict individual changed columns. This trigger prevents a trainer
-- from self-publishing or self-approving through the Supabase client. Admins
-- keep the ability to approve/reject through admin policies and server actions.

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

DROP TRIGGER IF EXISTS enforce_trainer_profile_review
  ON public.trainer_profiles;

CREATE TRIGGER enforce_trainer_profile_review
  BEFORE INSERT OR UPDATE ON public.trainer_profiles
  FOR EACH ROW
  WHEN (auth.uid() IS NOT NULL)
  EXECUTE FUNCTION public.enforce_trainer_profile_review();
