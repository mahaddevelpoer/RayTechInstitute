CREATE TABLE IF NOT EXISTS competition_private.notification_preferences(uid text PRIMARY KEY,email text NOT NULL,enabled boolean NOT NULL DEFAULT false,token text NOT NULL UNIQUE,updated_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS competition_private.winner_deliveries(attempt_id uuid PRIMARY KEY,sent_at timestamptz NOT NULL DEFAULT now());
ALTER TABLE competition_private.notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE competition_private.winner_deliveries ENABLE ROW LEVEL SECURITY;
CREATE OR REPLACE FUNCTION public.competition_notifications(p_action text,p_uid text DEFAULT NULL,p_payload jsonb DEFAULT '{}') RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE result jsonb;
BEGIN
CASE p_action
WHEN 'preferences' THEN SELECT jsonb_build_object('enabled',enabled) INTO result FROM competition_private.notification_preferences WHERE uid=p_uid;result:=coalesce(result,'{"enabled":false}');
WHEN 'save' THEN
INSERT INTO competition_private.notification_preferences(uid,email,enabled,token)VALUES(p_uid,p_payload->>'email',(p_payload->>'enabled')::boolean,p_payload->>'token')ON CONFLICT(uid) DO UPDATE SET email=excluded.email,enabled=excluded.enabled,updated_at=now();result:=jsonb_build_object('saved',true);
WHEN 'unsubscribe' THEN UPDATE competition_private.notification_preferences SET enabled=false,updated_at=now() WHERE token=p_payload->>'token';result:=jsonb_build_object('saved',true);
WHEN 'pending' THEN
SELECT coalesce(jsonb_agg(item),'[]') INTO result FROM (
SELECT jsonb_build_object('id',a.id,'email',n.email,'token',n.token,'name',a.body->>'displayName','score',a.body->'score','total',jsonb_array_length(a.body->'paper'),'title',r.config->>'title') item
FROM competition_private.attempts a JOIN competition_private.rounds r ON r.id=a.round_id JOIN competition_private.notification_preferences n ON n.uid=a.uid AND n.enabled
WHERE r.enabled AND (coalesce(r.config->>'resultsAt',r.config->>'endsAt'))::timestamptz<=now() AND a.body->>'status'='completed' AND NOT coalesce((a.body->>'underReview')::boolean,false) AND (a.body->>'score')::int>0
AND NOT EXISTS(SELECT 1 FROM competition_private.attempts other WHERE other.round_id=a.round_id AND other.body->>'status'='completed' AND NOT coalesce((other.body->>'underReview')::boolean,false) AND (other.body->>'score')::int>(a.body->>'score')::int)
AND NOT EXISTS(SELECT 1 FROM competition_private.winner_deliveries d WHERE d.attempt_id=a.id) LIMIT 25) winners;
WHEN 'sent' THEN INSERT INTO competition_private.winner_deliveries(attempt_id)VALUES((p_payload->>'id')::uuid)ON CONFLICT DO NOTHING;result:=jsonb_build_object('saved',true);
ELSE RAISE EXCEPTION 'UNKNOWN_OPERATION';END CASE;RETURN result;END $$;
REVOKE ALL ON FUNCTION public.competition_notifications(text,text,jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.competition_notifications(text,text,jsonb) TO service_role;

REVOKE ALL ON FUNCTION public.competition_notifications(text,text,jsonb) FROM anon,authenticated;
REVOKE ALL ON competition_private.notification_preferences,competition_private.winner_deliveries FROM anon,authenticated;
