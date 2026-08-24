-- Qualify the cleanup column because `reset_at` is also an output parameter of
-- the PL/pgSQL function and otherwise becomes ambiguous at runtime.

CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_key text,
  p_limit integer,
  p_window_seconds integer
)
RETURNS TABLE(allowed boolean, remaining integer, reset_at timestamptz)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_now timestamptz := now();
  v_reset_at timestamptz;
  v_count integer;
  v_expected_limit integer;
  v_expected_window_seconds integer := 600;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required' USING ERRCODE = '42501';
  END IF;

  v_expected_limit := CASE p_key
    WHEN 'trainer-contact:' || auth.uid()::text THEN 30
    WHEN 'messages:post:' || auth.uid()::text THEN 5
    ELSE NULL
  END;

  IF v_expected_limit IS NULL
    OR p_limit <> v_expected_limit
    OR p_window_seconds <> v_expected_window_seconds
  THEN
    RAISE EXCEPTION 'Invalid rate limit parameters' USING ERRCODE = '22023';
  END IF;

  IF random() < 0.01 THEN
    DELETE FROM public.rate_limit_buckets AS bucket
    WHERE bucket.reset_at < v_now - interval '1 day';
  END IF;

  INSERT INTO public.rate_limit_buckets AS b (key, count, reset_at)
  VALUES (p_key, 1, v_now + make_interval(secs => p_window_seconds))
  ON CONFLICT (key) DO UPDATE
    SET count = CASE WHEN b.reset_at <= v_now THEN 1 ELSE b.count + 1 END,
        reset_at = CASE
          WHEN b.reset_at <= v_now THEN v_now + make_interval(secs => p_window_seconds)
          ELSE b.reset_at
        END
  RETURNING b.count, b.reset_at INTO v_count, v_reset_at;

  RETURN QUERY
  SELECT (v_count <= p_limit), GREATEST(p_limit - v_count, 0), v_reset_at;
END;
$$;

REVOKE ALL ON FUNCTION public.check_rate_limit(text, integer, integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.check_rate_limit(text, integer, integer) TO authenticated;
