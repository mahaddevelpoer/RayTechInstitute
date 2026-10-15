-- Idempotent schema patch for the static detail-page content model.
-- Run this in Supabase SQL Editor if the migration runner has not applied it.

ALTER TABLE public.blogs ADD COLUMN IF NOT EXISTS action_button_text TEXT DEFAULT NULL;
ALTER TABLE public.blogs ADD COLUMN IF NOT EXISTS action_button_url TEXT DEFAULT NULL;

ALTER TABLE public.notes ADD COLUMN IF NOT EXISTS content TEXT DEFAULT NULL;
ALTER TABLE public.notes ADD COLUMN IF NOT EXISTS preview_pdf_url TEXT DEFAULT NULL;
ALTER TABLE public.notes ADD COLUMN IF NOT EXISTS action_button_text TEXT DEFAULT NULL;
ALTER TABLE public.notes ADD COLUMN IF NOT EXISTS action_button_url TEXT DEFAULT NULL;

ALTER TABLE public.gazettes ADD COLUMN IF NOT EXISTS action_button_text TEXT DEFAULT NULL;
ALTER TABLE public.gazettes ADD COLUMN IF NOT EXISTS action_button_url TEXT DEFAULT NULL;
ALTER TABLE public.gazettes ADD COLUMN IF NOT EXISTS content TEXT DEFAULT NULL;

ALTER TABLE public.past_papers ADD COLUMN IF NOT EXISTS description TEXT DEFAULT NULL;
ALTER TABLE public.past_papers ADD COLUMN IF NOT EXISTS content TEXT DEFAULT NULL;

NOTIFY pgrst, 'reload schema';
