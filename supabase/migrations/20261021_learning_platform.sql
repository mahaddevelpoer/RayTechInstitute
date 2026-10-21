-- Private authoring tables. Public visitors use exported HTML, not these tables.
CREATE TABLE IF NOT EXISTS public.learning_languages (
  id text PRIMARY KEY,
  slug text UNIQUE NOT NULL CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text NOT NULL CHECK (length(trim(title)) BETWEEN 1 AND 160),
  description text NOT NULL DEFAULT '',
  runtime text NOT NULL CHECK (runtime IN ('html','css','javascript','php','python')),
  state text NOT NULL DEFAULT 'draft' CHECK (state IN ('draft','published','archived')),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS public.learning_courses (
  id text PRIMARY KEY,
  slug text UNIQUE NOT NULL CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text NOT NULL CHECK (length(trim(title)) BETWEEN 1 AND 160),
  description text NOT NULL DEFAULT '',
  language_ids text[] NOT NULL DEFAULT '{}',
  state text NOT NULL DEFAULT 'draft' CHECK (state IN ('draft','published','archived')),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS public.learning_topics (
  id text PRIMARY KEY,
  language_id text NOT NULL REFERENCES public.learning_languages(id) ON DELETE RESTRICT,
  slug text NOT NULL CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text NOT NULL CHECK (length(trim(title)) BETWEEN 1 AND 160),
  summary text NOT NULL DEFAULT '',
  position integer NOT NULL CHECK (position > 0),
  version integer NOT NULL DEFAULT 1 CHECK (version > 0),
  objectives text[] NOT NULL DEFAULT '{}',
  prerequisite_ids text[] NOT NULL DEFAULT '{}',
  content text NOT NULL DEFAULT '' CHECK (length(content) <= 100000),
  starter_code text NOT NULL DEFAULT '' CHECK (length(starter_code) <= 20000),
  video_ids text[] NOT NULL DEFAULT '{}',
  questions jsonb NOT NULL DEFAULT '[]' CHECK (jsonb_typeof(questions) = 'array'),
  questions_per_attempt integer NOT NULL DEFAULT 10 CHECK (questions_per_attempt BETWEEN 1 AND 100),
  assignment jsonb CHECK (assignment IS NULL OR jsonb_typeof(assignment) = 'object'),
  state text NOT NULL DEFAULT 'draft' CHECK (state IN ('draft','published','archived')),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(language_id, slug),
  CHECK (state <> 'published' OR (
    length(trim(content)) > 0 AND length(trim(summary)) > 0
    AND cardinality(objectives) > 0 AND assignment IS NOT NULL
    AND jsonb_array_length(questions) >= questions_per_attempt
  ))
);
CREATE UNIQUE INDEX IF NOT EXISTS learning_topic_position
  ON public.learning_topics(language_id, position) WHERE state <> 'archived';

-- Fixed-window counters contain an opaque Firebase UID, never submitted code.
CREATE TABLE IF NOT EXISTS public.learning_review_quota (
  bucket text PRIMARY KEY,
  used integer NOT NULL CHECK (used >= 0),
  expires_at timestamptz NOT NULL
);
ALTER TABLE public.learning_languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_review_quota ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.learning_languages, public.learning_courses, public.learning_topics, public.learning_review_quota FROM anon, authenticated;
GRANT ALL ON public.learning_languages, public.learning_courses, public.learning_topics, public.learning_review_quota TO service_role;

-- Only the server may reserve quota, after verifying identity. Shared lock
-- makes checking all three limits and incrementing them one atomic operation.
-- Failures still consume reservations, preventing cost-amplifying retries.
CREATE OR REPLACE FUNCTION public.reserve_learning_review(p_uid text)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  stamp timestamptz := clock_timestamp();
  day_start timestamptz;
  minute_start timestamptz;
  day_key text;
  minute_key text;
  user_key text;
BEGIN
  IF p_uid IS NULL OR length(p_uid) NOT BETWEEN 1 AND 128 THEN
    RAISE EXCEPTION 'Invalid learner identity';
  END IF;
  PERFORM pg_advisory_xact_lock(821734901);
  stamp := clock_timestamp();
  day_start := date_trunc('day', stamp AT TIME ZONE 'UTC') AT TIME ZONE 'UTC';
  minute_start := date_trunc('minute', stamp);
  day_key := 'global:day:' || extract(epoch FROM day_start)::bigint;
  minute_key := 'global:minute:' || extract(epoch FROM minute_start)::bigint;
  user_key := 'user:' || p_uid || ':' || extract(epoch FROM day_start)::bigint;
  DELETE FROM public.learning_review_quota WHERE expires_at <= stamp;
  -- Conservative budget below the provider's free-tier allowance.
  IF coalesce((SELECT used FROM public.learning_review_quota WHERE bucket = day_key),0) >= 40
    OR coalesce((SELECT used FROM public.learning_review_quota WHERE bucket = minute_key),0) >= 10
    OR coalesce((SELECT used FROM public.learning_review_quota WHERE bucket = user_key),0) >= 3 THEN
    RETURN false;
  END IF;
  INSERT INTO public.learning_review_quota(bucket, used, expires_at)
    VALUES (day_key, 1, day_start + interval '1 day'),
           (minute_key, 1, minute_start + interval '1 minute'),
           (user_key, 1, day_start + interval '1 day')
    ON CONFLICT (bucket) DO UPDATE SET used = public.learning_review_quota.used + 1;
  RETURN true;
END;
$$;
REVOKE ALL ON FUNCTION public.reserve_learning_review(text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.reserve_learning_review(text) TO service_role;

-- Registry only, not invented published lesson content. Existing admin edits win.
INSERT INTO public.learning_languages(id,slug,title,description,runtime) VALUES
  ('html','html','HTML','Structure web pages with semantic HTML.','html'),
  ('css','css','CSS','Style responsive and accessible web pages.','css'),
  ('javascript','javascript','JavaScript','Add behavior to web pages with JavaScript.','javascript'),
  ('php','php','PHP','Learn PHP fundamentals in browser-based exercises.','php'),
  ('python','python','Python','Learn programming fundamentals with Python.','python')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.learning_courses(id,slug,title,description,language_ids) VALUES
  ('web-development','web-development','Web Development','Study HTML, CSS, JavaScript and PHP as individual language tracks.',ARRAY['html','css','javascript','php']),
  ('python','python','Python Programming','Learn Python through lessons, topic quizzes and assignments.',ARRAY['python'])
ON CONFLICT (id) DO NOTHING;
NOTIFY pgrst, 'reload schema';
