-- Admin-only global switch. Public static pages never query this table.
CREATE TABLE IF NOT EXISTS public.learning_ai_settings (
  id text PRIMARY KEY CHECK (id = 'global'),
  enabled boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.learning_ai_settings ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.learning_ai_settings FROM PUBLIC, anon, authenticated;
GRANT SELECT, UPDATE ON public.learning_ai_settings TO service_role;
INSERT INTO public.learning_ai_settings(id, enabled) VALUES ('global', false)
ON CONFLICT (id) DO NOTHING;
