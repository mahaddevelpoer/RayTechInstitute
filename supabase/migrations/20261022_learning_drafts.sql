-- Editing a live lesson must not replace the published snapshot before review.
ALTER TABLE public.learning_topics ADD COLUMN IF NOT EXISTS pending_draft jsonb
  CHECK (pending_draft IS NULL OR jsonb_typeof(pending_draft) = 'object');
