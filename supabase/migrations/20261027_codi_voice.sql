-- Independent of assignment quotas. Only a verified server can reserve usage.
CREATE TABLE IF NOT EXISTS public.codi_voice_quota (
  bucket text PRIMARY KEY, used integer NOT NULL CHECK (used >= 0), expires_at timestamptz NOT NULL
);
ALTER TABLE public.codi_voice_quota ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.codi_voice_quota FROM PUBLIC, anon, authenticated;
GRANT ALL ON public.codi_voice_quota TO service_role;
CREATE OR REPLACE FUNCTION public.reserve_codi_voice(p_uid text, p_kind text)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  stamp timestamptz; day_start timestamptz; minute_start timestamptz;
  global_day text; global_minute text; learner_day text;
BEGIN
  IF p_uid IS NULL OR length(p_uid) NOT BETWEEN 1 AND 128 OR p_kind IS NULL OR p_kind NOT IN ('live','read') THEN RAISE EXCEPTION 'Invalid voice identity or action'; END IF;
  PERFORM pg_advisory_xact_lock(821734902);
  stamp := clock_timestamp();
  day_start := date_trunc('day', stamp AT TIME ZONE 'UTC') AT TIME ZONE 'UTC';
  minute_start := date_trunc('minute', stamp);
  global_day := p_kind || ':day:' || extract(epoch FROM day_start)::bigint;
  global_minute := p_kind || ':minute:' || extract(epoch FROM minute_start)::bigint;
  learner_day := p_kind || ':user:' || p_uid || ':' || extract(epoch FROM day_start)::bigint;
  DELETE FROM public.codi_voice_quota WHERE expires_at <= stamp;
  IF coalesce((SELECT used FROM public.codi_voice_quota WHERE bucket=global_day),0) >= (CASE WHEN p_kind='live' THEN 20 ELSE 100 END)
    OR coalesce((SELECT used FROM public.codi_voice_quota WHERE bucket=global_minute),0) >= 2
    OR coalesce((SELECT used FROM public.codi_voice_quota WHERE bucket=learner_day),0) >= (CASE WHEN p_kind='live' THEN 3 ELSE 40 END) THEN RETURN false; END IF;
  INSERT INTO public.codi_voice_quota(bucket,used,expires_at) VALUES
    (global_day,1,day_start+interval '1 day'),(global_minute,1,minute_start+interval '1 minute'),(learner_day,1,day_start+interval '1 day')
    ON CONFLICT(bucket) DO UPDATE SET used=public.codi_voice_quota.used+1;
  RETURN true;
END;
$$;
REVOKE ALL ON FUNCTION public.reserve_codi_voice(text,text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.reserve_codi_voice(text,text) TO service_role;
