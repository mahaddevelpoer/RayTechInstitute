ALTER TABLE public.blogs ADD COLUMN IF NOT EXISTS seo JSONB NOT NULL DEFAULT '{}';
NOTIFY pgrst, 'reload schema';
