-- Optional topic labels within the existing chapter; question identities stay unchanged.
ALTER TABLE public.mcqs ADD COLUMN IF NOT EXISTS topic TEXT;
COMMENT ON COLUMN public.mcqs.topic IS 'Optional topic within a class subject chapter, used for topic-specific practice.';
NOTIFY pgrst, 'reload schema';
