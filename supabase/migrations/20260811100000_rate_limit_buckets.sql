-- Backs API rate limiting with a shared table instead of per-instance memory,
-- so limits hold under multiple serverless instances (see src/lib/server/rate-limit.ts).

CREATE TABLE IF NOT EXISTS public.rate_limit_buckets (
  key text PRIMARY KEY,
  count integer NOT NULL DEFAULT 0,
  reset_at timestamptz NOT NULL
);

ALTER TABLE public.rate_limit_buckets ENABLE ROW LEVEL SECURITY;

-- No policies: only reachable through the SECURITY DEFINER function below.
REVOKE ALL ON public.rate_limit_buckets FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.check_rate_limit(p_key text, p_limit integer, p_window_seconds integer)
RETURNS TABLE(allowed boolean, remaining integer, reset_at timestamptz)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_now timestamptz := now();
  v_reset_at timestamptz;
  v_count integer;
BEGIN
  -- Opportunistic cleanup of stale buckets — avoids needing a cron job.
  IF random() < 0.01 THEN
    DELETE FROM public.rate_limit_buckets WHERE reset_at < v_now - interval '1 day';
  END IF;

  INSERT INTO public.rate_limit_buckets AS b (key, count, reset_at)
  VALUES (p_key, 1, v_now + make_interval(secs => p_window_seconds))
  ON CONFLICT (key) DO UPDATE
    SET count = CASE WHEN b.reset_at <= v_now THEN 1 ELSE b.count + 1 END,
        reset_at = CASE WHEN b.reset_at <= v_now THEN v_now + make_interval(secs => p_window_seconds) ELSE b.reset_at END
  RETURNING b.count, b.reset_at INTO v_count, v_reset_at;

  RETURN QUERY SELECT (v_count <= p_limit), GREATEST(p_limit - v_count, 0), v_reset_at;
END;
$$;

REVOKE ALL ON FUNCTION public.check_rate_limit(text, integer, integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.check_rate_limit(text, integer, integer) TO authenticated;
