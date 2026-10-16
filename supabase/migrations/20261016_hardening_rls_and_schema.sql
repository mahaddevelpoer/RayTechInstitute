-- ==============================================================================
-- MIGRATION: 20261014_hardening_rls_and_schema.sql
-- PURPOSE: Fix schema drift, create video_mcqs, add missing columns, and
--          enforce strict Row Level Security (RLS) across all educational tables.
-- ==============================================================================

-- 1. Ensure Classes Table
CREATE TABLE IF NOT EXISTS public.classes (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    numeric_grade INT NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Ensure Subjects Table
CREATE TABLE IF NOT EXISTS public.subjects (
    id TEXT PRIMARY KEY,
    class_slug TEXT NOT NULL,
    slug TEXT NOT NULL,
    title TEXT NOT NULL,
    icon_name TEXT,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT fk_class_slug FOREIGN KEY (class_slug) REFERENCES public.classes(slug) ON DELETE CASCADE
);

-- 3. Ensure Notes Table & Extended Columns
CREATE TABLE IF NOT EXISTS public.notes (
    id TEXT PRIMARY KEY,
    class_slug TEXT NOT NULL,
    subject_slug TEXT NOT NULL,
    chapter_number INT NOT NULL,
    chapter_title TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    pdf_url TEXT NOT NULL,
    file_size TEXT DEFAULT '3.5 MB',
    download_count INT DEFAULT 0,
    last_updated DATE DEFAULT CURRENT_DATE,
    content TEXT DEFAULT NULL,
    preview_pdf_url TEXT DEFAULT NULL,
    action_button_text TEXT DEFAULT NULL,
    action_button_url TEXT DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure notes extended columns exist if table was previously created
ALTER TABLE public.notes ADD COLUMN IF NOT EXISTS content TEXT DEFAULT NULL;
ALTER TABLE public.notes ADD COLUMN IF NOT EXISTS preview_pdf_url TEXT DEFAULT NULL;
ALTER TABLE public.notes ADD COLUMN IF NOT EXISTS action_button_text TEXT DEFAULT NULL;
ALTER TABLE public.notes ADD COLUMN IF NOT EXISTS action_button_url TEXT DEFAULT NULL;

-- 4. Ensure MCQs Table
CREATE TABLE IF NOT EXISTS public.mcqs (
    id TEXT PRIMARY KEY,
    class_slug TEXT NOT NULL,
    subject_slug TEXT NOT NULL,
    chapter_number INT NOT NULL,
    question TEXT NOT NULL,
    code_snippet TEXT,
    options JSONB NOT NULL,
    correct_index INT NOT NULL,
    explanation TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Ensure Past Papers Table
CREATE TABLE IF NOT EXISTS public.past_papers (
    id TEXT PRIMARY KEY,
    class_slug TEXT NOT NULL,
    subject_slug TEXT NOT NULL,
    board TEXT NOT NULL,
    year INT NOT NULL,
    session TEXT NOT NULL,
    pdf_url TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Ensure Result Gazettes Table & Extended Columns
CREATE TABLE IF NOT EXISTS public.gazettes (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    board TEXT NOT NULL,
    class_slug TEXT NOT NULL,
    year INT NOT NULL,
    session TEXT,
    pdf_url TEXT NOT NULL,
    direct_result_url TEXT,
    release_date DATE DEFAULT CURRENT_DATE,
    total_candidates TEXT,
    passing_percentage TEXT,
    action_button_text TEXT DEFAULT NULL,
    action_button_url TEXT DEFAULT NULL,
    content TEXT DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure gazettes extended columns exist
ALTER TABLE public.gazettes ADD COLUMN IF NOT EXISTS action_button_text TEXT DEFAULT NULL;
ALTER TABLE public.gazettes ADD COLUMN IF NOT EXISTS action_button_url TEXT DEFAULT NULL;
ALTER TABLE public.gazettes ADD COLUMN IF NOT EXISTS content TEXT DEFAULT NULL;

-- 7. Ensure Blogs Table & Extended Columns
CREATE TABLE IF NOT EXISTS public.blogs (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    featured_image TEXT NOT NULL,
    author TEXT NOT NULL,
    date_published DATE DEFAULT CURRENT_DATE,
    read_time TEXT,
    tags JSONB DEFAULT '[]'::jsonb,
    action_button_text TEXT DEFAULT NULL,
    action_button_url TEXT DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure blogs extended columns exist
ALTER TABLE public.blogs ADD COLUMN IF NOT EXISTS action_button_text TEXT DEFAULT NULL;
ALTER TABLE public.blogs ADD COLUMN IF NOT EXISTS action_button_url TEXT DEFAULT NULL;

-- 8. Ensure Video Interactive MCQs Table
CREATE TABLE IF NOT EXISTS public.video_mcqs (
    id TEXT PRIMARY KEY,
    video_id TEXT NOT NULL,
    video_title TEXT NOT NULL,
    timestamp_seconds INT NOT NULL,
    timestamp_formatted TEXT NOT NULL,
    topic TEXT NOT NULL,
    question TEXT NOT NULL,
    code_snippet TEXT,
    options JSONB NOT NULL,
    correct_index INT NOT NULL,
    explanation TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Ensure Notification Subscribers Table
CREATE TABLE IF NOT EXISTS public.notification_subscribers (
    id BIGSERIAL PRIMARY KEY,
    token TEXT UNIQUE NOT NULL,
    user_agent TEXT,
    subscribed_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) HARDENING
-- Only public SELECT is allowed for content tables.
-- Anonymous users are STRICTLY FORBIDDEN from INSERT/UPDATE/DELETE.
-- Only the service_role (used by secure-dispatch Edge Function) can write.
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mcqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.past_papers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gazettes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_mcqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_subscribers ENABLE ROW LEVEL SECURITY;

-- Clean up any existing policies
DO $$
DECLARE
    tbl text;
    pol text;
BEGIN
    FOR tbl IN VALUES ('classes'), ('subjects'), ('notes'), ('mcqs'), ('past_papers'), ('gazettes'), ('blogs'), ('video_mcqs'), ('notification_subscribers')
    LOOP
        FOR pol IN 
            SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = tbl
        LOOP
            EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', pol, tbl);
        END LOOP;
    END LOOP;
END $$;

-- ── Content Tables: Public Read-Only Policies ─────────────────────────────────
CREATE POLICY "Public Read Classes" ON public.classes
    FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Public Read Subjects" ON public.subjects
    FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Public Read Notes" ON public.notes
    FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Public Read MCQs" ON public.mcqs
    FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Public Read Past Papers" ON public.past_papers
    FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Public Read Gazettes" ON public.gazettes
    FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Public Read Blogs" ON public.blogs
    FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Public Read Video MCQs" ON public.video_mcqs
    FOR SELECT TO anon, authenticated USING (true);

-- Notification subscriber writes are handled by secure-dispatch with the
-- service role. No anonymous insert policy is created here.

-- End of Migration
