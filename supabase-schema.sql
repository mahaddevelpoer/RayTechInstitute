-- RayTech Institute canonical Supabase schema.
-- Safe to run on a new project or an existing project. Content writes are
-- performed only by the authenticated secure-dispatch Edge Function.

CREATE TABLE IF NOT EXISTS public.classes (
  id TEXT PRIMARY KEY, slug TEXT UNIQUE NOT NULL, title TEXT NOT NULL,
  numeric_grade INT NOT NULL, description TEXT, is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.subjects (
  id TEXT PRIMARY KEY, class_slug TEXT NOT NULL, slug TEXT NOT NULL,
  title TEXT NOT NULL, icon_name TEXT, description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT fk_subject_class_slug FOREIGN KEY (class_slug) REFERENCES public.classes(slug) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.chapters (
  id TEXT PRIMARY KEY, class_slug TEXT NOT NULL, subject_slug TEXT NOT NULL,
  chapter_number INT NOT NULL, title TEXT NOT NULL, description TEXT,
  is_active BOOLEAN DEFAULT TRUE, created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(), UNIQUE (class_slug, subject_slug, chapter_number)
);

CREATE TABLE IF NOT EXISTS public.notes (
  id TEXT PRIMARY KEY, class_slug TEXT NOT NULL, subject_slug TEXT NOT NULL,
  chapter_number INT NOT NULL, chapter_title TEXT NOT NULL, title TEXT NOT NULL,
  description TEXT, pdf_url TEXT NOT NULL, file_size TEXT DEFAULT '3.5 MB',
  download_count INT DEFAULT 0, last_updated DATE DEFAULT CURRENT_DATE,
  content TEXT, preview_pdf_url TEXT, action_button_text TEXT, action_button_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.mcqs (
  id TEXT PRIMARY KEY, class_slug TEXT NOT NULL, subject_slug TEXT NOT NULL,
  chapter_number INT NOT NULL, question TEXT NOT NULL, code_snippet TEXT,
  options JSONB NOT NULL, correct_index INT NOT NULL, explanation TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.past_papers (
  id TEXT PRIMARY KEY, class_slug TEXT NOT NULL, subject_slug TEXT NOT NULL,
  board TEXT NOT NULL, year INT NOT NULL, session TEXT NOT NULL, pdf_url TEXT NOT NULL,
  description TEXT, content TEXT, created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.gazettes (
  id TEXT PRIMARY KEY, title TEXT NOT NULL, board TEXT NOT NULL, class_slug TEXT NOT NULL,
  year INT NOT NULL, session TEXT, pdf_url TEXT NOT NULL, direct_result_url TEXT,
  release_date DATE DEFAULT CURRENT_DATE, total_candidates TEXT, passing_percentage TEXT,
  action_button_text TEXT, action_button_url TEXT, content TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.blogs (
  id TEXT PRIMARY KEY, title TEXT NOT NULL, slug TEXT UNIQUE NOT NULL, category TEXT NOT NULL,
  excerpt TEXT NOT NULL, content TEXT NOT NULL, featured_image TEXT NOT NULL, author TEXT NOT NULL,
  date_published DATE DEFAULT CURRENT_DATE, read_time TEXT, tags JSONB DEFAULT '[]'::jsonb,
  action_button_text TEXT, action_button_url TEXT, created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.video_mcqs (
  id TEXT PRIMARY KEY, video_id TEXT NOT NULL, video_title TEXT NOT NULL,
  timestamp_seconds INT NOT NULL, timestamp_formatted TEXT NOT NULL, topic TEXT NOT NULL,
  question TEXT NOT NULL, code_snippet TEXT, options JSONB NOT NULL, correct_index INT NOT NULL,
  explanation TEXT, created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.notification_subscribers (
  id BIGSERIAL PRIMARY KEY, token TEXT UNIQUE NOT NULL, user_agent TEXT,
  subscribed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bring older installations up to the current column contract.
ALTER TABLE public.classes ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.subjects ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.chapters ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.chapters ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE public.chapters ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.notes ADD COLUMN IF NOT EXISTS content TEXT;
ALTER TABLE public.notes ADD COLUMN IF NOT EXISTS preview_pdf_url TEXT;
ALTER TABLE public.notes ADD COLUMN IF NOT EXISTS action_button_text TEXT;
ALTER TABLE public.notes ADD COLUMN IF NOT EXISTS action_button_url TEXT;
ALTER TABLE public.notes ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.mcqs ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.past_papers ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.past_papers ADD COLUMN IF NOT EXISTS content TEXT;
ALTER TABLE public.past_papers ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.gazettes ADD COLUMN IF NOT EXISTS action_button_text TEXT;
ALTER TABLE public.gazettes ADD COLUMN IF NOT EXISTS action_button_url TEXT;
ALTER TABLE public.gazettes ADD COLUMN IF NOT EXISTS content TEXT;
ALTER TABLE public.gazettes ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.blogs ADD COLUMN IF NOT EXISTS action_button_text TEXT;
ALTER TABLE public.blogs ADD COLUMN IF NOT EXISTS action_button_url TEXT;
ALTER TABLE public.blogs ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.video_mcqs ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mcqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.past_papers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gazettes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_mcqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_subscribers ENABLE ROW LEVEL SECURITY;

-- Remove legacy duplicate or permissive policies before recreating the contract.
DO $$
DECLARE table_name TEXT; policy_name TEXT;
BEGIN
  FOR table_name IN SELECT unnest(ARRAY[
    'classes', 'subjects', 'chapters', 'notes', 'mcqs', 'past_papers',
    'gazettes', 'blogs', 'video_mcqs', 'notification_subscribers'
  ]) LOOP
    FOR policy_name IN SELECT policyname FROM pg_policies
      WHERE schemaname = 'public' AND tablename = table_name LOOP
      EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', policy_name, table_name);
    END LOOP;
  END LOOP;
END $$;

CREATE POLICY "Public Read Classes" ON public.classes FOR SELECT TO anon, authenticated USING (TRUE);
CREATE POLICY "Public Read Subjects" ON public.subjects FOR SELECT TO anon, authenticated USING (TRUE);
CREATE POLICY "Public Read Chapters" ON public.chapters FOR SELECT TO anon, authenticated USING (TRUE);
CREATE POLICY "Public Read Notes" ON public.notes FOR SELECT TO anon, authenticated USING (TRUE);
CREATE POLICY "Public Read MCQs" ON public.mcqs FOR SELECT TO anon, authenticated USING (TRUE);
CREATE POLICY "Public Read Past Papers" ON public.past_papers FOR SELECT TO anon, authenticated USING (TRUE);
CREATE POLICY "Public Read Gazettes" ON public.gazettes FOR SELECT TO anon, authenticated USING (TRUE);
CREATE POLICY "Public Read Blogs" ON public.blogs FOR SELECT TO anon, authenticated USING (TRUE);
CREATE POLICY "Public Read Video MCQs" ON public.video_mcqs FOR SELECT TO anon, authenticated USING (TRUE);
CREATE POLICY "Public Insert Notification Subscribers" ON public.notification_subscribers
  FOR INSERT TO anon, authenticated WITH CHECK (TRUE);

-- No anon/authenticated INSERT, UPDATE, or DELETE policies are intentional.
-- The secure-dispatch Edge Function uses the service role for admin mutations.
