-- Named chapter catalog for chapter-wise MCQ quizzes and study resources.
CREATE TABLE IF NOT EXISTS public.chapters (
  id TEXT PRIMARY KEY,
  class_slug TEXT NOT NULL,
  subject_slug TEXT NOT NULL,
  chapter_number INT NOT NULL CHECK (chapter_number > 0),
  title TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (class_slug, subject_slug, chapter_number)
);

ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read Chapters" ON public.chapters;
CREATE POLICY "Public Read Chapters" ON public.chapters
  FOR SELECT TO anon, authenticated USING (true);

NOTIFY pgrst, 'reload schema';
