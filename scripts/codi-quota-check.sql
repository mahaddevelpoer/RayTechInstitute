BEGIN;
DO $$ BEGIN
  IF NOT public.reserve_codi_voice('codi-transactional-qa','live') THEN RAISE EXCEPTION 'First reservation failed'; END IF;
  IF NOT public.reserve_codi_voice('codi-transactional-qa','live') THEN RAISE EXCEPTION 'Second reservation failed'; END IF;
  IF public.reserve_codi_voice('codi-transactional-qa','live') THEN RAISE EXCEPTION 'Minute quota was not enforced'; END IF;
END $$;
SELECT NOT has_function_privilege('anon','public.reserve_codi_voice(text,text)','execute') AS anon_denied,
       NOT has_function_privilege('authenticated','public.reserve_codi_voice(text,text)','execute') AS direct_student_denied,
       has_function_privilege('service_role','public.reserve_codi_voice(text,text)','execute') AS server_allowed,
       (SELECT relrowsecurity FROM pg_class WHERE oid='public.codi_voice_quota'::regclass) AS rls_enabled;
ROLLBACK;
