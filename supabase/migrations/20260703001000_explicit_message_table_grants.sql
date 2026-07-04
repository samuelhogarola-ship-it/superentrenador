-- Make PostgREST table privileges for messages explicit.
--
-- RLS policies decide which rows authenticated users can access. These grants
-- define which operations the API role may attempt at all.

REVOKE ALL ON public.messages FROM anon;
REVOKE ALL ON public.messages FROM authenticated;

GRANT SELECT ON public.messages TO authenticated;
GRANT INSERT ON public.messages TO authenticated;
GRANT UPDATE (read_at) ON public.messages TO authenticated;
