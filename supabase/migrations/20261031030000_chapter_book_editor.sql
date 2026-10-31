ALTER TABLE public.chapters ADD COLUMN IF NOT EXISTS book_title TEXT;
ALTER TABLE public.chapters ADD COLUMN IF NOT EXISTS display_chapter_number INTEGER CHECK (display_chapter_number > 0);
NOTIFY pgrst, 'reload schema';
