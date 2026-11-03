-- Preserve class identities, subject references and existing public URLs.
ALTER TABLE public.classes ADD COLUMN IF NOT EXISTS program_title TEXT;
ALTER TABLE public.classes ADD COLUMN IF NOT EXISTS semester_number INTEGER;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conrelid = 'public.classes'::regclass AND conname = 'classes_program_semester_valid') THEN
    ALTER TABLE public.classes ADD CONSTRAINT classes_program_semester_valid CHECK (
      (program_title IS NULL AND semester_number IS NULL) OR
      (program_title IS NOT NULL AND length(btrim(program_title)) BETWEEN 1 AND 100 AND semester_number IS NOT NULL AND semester_number BETWEEN 1 AND 16)
    );
  END IF;
END $$;
CREATE UNIQUE INDEX IF NOT EXISTS classes_program_semester_unique
  ON public.classes (lower(btrim(program_title)), semester_number)
  WHERE program_title IS NOT NULL;
-- User confirmed existing DIT Computer Networking and MS Office belong to semester 1.
-- Keep the same class slug so every existing subject, note and MCQ link survives.
UPDATE public.classes SET program_title = 'DIT', semester_number = 1
WHERE slug = 'dit-intermediate' AND program_title IS NULL AND semester_number IS NULL;
NOTIFY pgrst, 'reload schema';
