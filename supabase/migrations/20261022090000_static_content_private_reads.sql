-- Apply only after the authenticated content_catalog Edge endpoint and new admin UI are live.
-- Public pages use the service-role build snapshot, not anonymous database reads.
BEGIN;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mcqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.past_papers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gazettes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_mcqs ENABLE ROW LEVEL SECURITY;
REVOKE SELECT ON public.classes,public.subjects,public.chapters,public.notes,public.mcqs,public.past_papers,public.gazettes,public.blogs,public.video_mcqs FROM anon,authenticated;
GRANT SELECT ON public.classes,public.subjects,public.chapters,public.notes,public.mcqs,public.past_papers,public.gazettes,public.blogs,public.video_mcqs TO service_role;
COMMIT;
