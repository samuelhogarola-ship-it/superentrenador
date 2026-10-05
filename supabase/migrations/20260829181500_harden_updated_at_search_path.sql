-- Prevent caller-controlled schemas from affecting the trainer profile trigger.
ALTER FUNCTION public.set_updated_at() SET search_path = public;
