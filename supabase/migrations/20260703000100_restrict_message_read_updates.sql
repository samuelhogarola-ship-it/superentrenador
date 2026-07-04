-- Restrict trainer message updates to the read_at column only.
--
-- The previous UPDATE policy correctly limited which rows trainers could touch,
-- but Postgres grants are column-wide: without a column grant, clients may update
-- any mutable column on allowed rows. Keep the existing RLS row guard and narrow
-- the authenticated role to UPDATE(read_at).

REVOKE UPDATE ON public.messages FROM authenticated;

GRANT UPDATE (read_at) ON public.messages TO authenticated;
