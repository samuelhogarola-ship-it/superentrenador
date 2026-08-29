-- Keep the public marketplace surface strictly read-only.
--
-- The view is not currently updatable because it joins cities, but historical
-- default grants still include DML privileges. Revoke them explicitly so a
-- future view rewrite cannot accidentally make anonymous writes possible.

REVOKE ALL PRIVILEGES ON TABLE public.trainer_profiles_public FROM anon, authenticated;
GRANT SELECT ON TABLE public.trainer_profiles_public TO anon, authenticated;
