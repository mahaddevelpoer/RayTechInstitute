-- Local preparation only. No public practice table is reused as a competitive bank.
CREATE SCHEMA IF NOT EXISTS competition_private;
REVOKE ALL ON SCHEMA competition_private FROM PUBLIC;

CREATE TABLE IF NOT EXISTS competition_private.rounds (
 id TEXT PRIMARY KEY,
 config JSONB NOT NULL,
 bank JSONB NOT NULL DEFAULT '[]',
 enabled BOOLEAN NOT NULL DEFAULT false,
 updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS competition_private.attempts (
 id UUID PRIMARY KEY,
 uid TEXT NOT NULL,
 week_key DATE NOT NULL,
 round_id TEXT NOT NULL REFERENCES competition_private.rounds(id),
 version INT NOT NULL DEFAULT 1,
 body JSONB NOT NULL,
 created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
 UNIQUE(uid,week_key)
);
CREATE INDEX IF NOT EXISTS competition_round_attempts ON competition_private.attempts(round_id);
CREATE INDEX IF NOT EXISTS competition_pending_deadlines ON competition_private.attempts (((body->>'endsAt')::numeric)) WHERE body->>'status'='active';
CREATE INDEX IF NOT EXISTS competition_completed_scores ON competition_private.attempts (round_id,((body->>'score')::int) DESC) WHERE body->>'status'='completed' AND coalesce((body->>'underReview')::boolean,false)=false;
CREATE TABLE IF NOT EXISTS competition_private.rate_limits (
 subject TEXT PRIMARY KEY, count INT NOT NULL, expires_at TIMESTAMPTZ NOT NULL
);
CREATE TABLE IF NOT EXISTS competition_private.reviews (attempt_id UUID NOT NULL,reviewer TEXT NOT NULL,held BOOLEAN NOT NULL,reason TEXT NOT NULL,reviewed_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE competition_private.rounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE competition_private.attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE competition_private.rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE competition_private.reviews ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON ALL TABLES IN SCHEMA competition_private FROM PUBLIC;

-- Only the authenticated Edge service may call this internal persistence gateway.
-- HTTP actions are separately validated; no client is allowed to select an RPC action.
CREATE OR REPLACE FUNCTION public.competition_gateway(p_action TEXT,p_uid TEXT DEFAULT NULL,p_payload JSONB DEFAULT '{}')
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE result JSONB; attempt_id UUID; affected INT; current_week DATE;
BEGIN
 current_week := date_trunc('week',clock_timestamp() AT TIME ZONE 'Asia/Karachi')::date;
 -- Finalise abandoned attempts when their weekly round ends, without awarding unseen answers.
 IF p_action IN ('catalog','leaderboard','result','cleanup') THEN
  UPDATE competition_private.attempts SET body=body||jsonb_build_object('status','completed','completedAt',body->>'endsAtIso'),version=version+1
  WHERE body->>'status'='active' AND (body->>'endsAt')::numeric <= extract(epoch FROM clock_timestamp())*1000;
 END IF;
 CASE p_action
 WHEN 'catalog' THEN
  SELECT coalesce(jsonb_agg(config || jsonb_build_object('available',enabled AND jsonb_array_length(bank)>0) ORDER BY config->>'startsAt' DESC),'[]'::jsonb)
  INTO result FROM competition_private.rounds WHERE enabled=true;
 WHEN 'round' THEN
  SELECT jsonb_build_object('config',config,'bank',bank,'enabled',enabled,'revision',updated_at::text) INTO result FROM competition_private.rounds WHERE id=p_payload->>'roundId';
 WHEN 'admin_rounds' THEN
  SELECT coalesce(jsonb_agg(jsonb_build_object('config',config,'enabled',enabled,'bankCount',jsonb_array_length(bank)) ORDER BY updated_at DESC),'[]'::jsonb) INTO result FROM competition_private.rounds;
 WHEN 'admin_attempts' THEN
  SELECT coalesce(jsonb_agg(jsonb_build_object('attemptId',id,'displayName',body->>'displayName','status',body->>'status','score',body->'score','total',jsonb_array_length(body->'paper'),'visibilityEvents',jsonb_array_length(body->'events'),'underReview',body->'underReview') ORDER BY created_at DESC),'[]'::jsonb)
  INTO result FROM (SELECT * FROM competition_private.attempts WHERE round_id=p_payload->>'roundId' ORDER BY created_at DESC LIMIT 100) recent;
 WHEN 'set_review' THEN
  UPDATE competition_private.attempts SET body=body||jsonb_build_object('underReview',(p_payload->>'held')::boolean),version=version+1 WHERE id::text=p_payload->>'attemptId';
  GET DIAGNOSTICS affected=ROW_COUNT;IF affected<>1 THEN RAISE EXCEPTION 'ATTEMPT_NOT_FOUND'; END IF;
  INSERT INTO competition_private.reviews(attempt_id,reviewer,held,reason)VALUES((p_payload->>'attemptId')::uuid,p_uid,(p_payload->>'held')::boolean,p_payload->>'reason');result:=jsonb_build_object('saved',true);
 WHEN 'save_round' THEN
  -- Materialise a disabled row first so simultaneous first-time saves also share
  -- the same row lock. A failed validation rolls this placeholder back.
  INSERT INTO competition_private.rounds(id,config,bank,enabled)
  VALUES(p_payload->'config'->>'id',p_payload->'config','[]'::jsonb,false) ON CONFLICT(id) DO NOTHING;
  PERFORM 1 FROM competition_private.rounds WHERE id=p_payload->'config'->>'id' FOR UPDATE;
  IF EXISTS(SELECT 1 FROM competition_private.attempts WHERE round_id=p_payload->'config'->>'id') THEN RAISE EXCEPTION 'ROUND_LOCKED'; END IF;
  IF (p_payload->>'enabled')::boolean AND EXISTS(
   SELECT 1 FROM competition_private.rounds old_round CROSS JOIN LATERAL jsonb_array_elements(old_round.bank) old_question
   JOIN jsonb_array_elements(p_payload->'bank') new_question ON lower(trim(old_question->>'prompt'))=lower(trim(new_question->>'prompt'))
   WHERE old_round.id<>p_payload->'config'->>'id' AND (old_round.config->>'endsAt')::timestamptz<=clock_timestamp()
  ) THEN RAISE EXCEPTION 'BANK_REUSED'; END IF;
  INSERT INTO competition_private.rounds(id,config,bank,enabled) VALUES(p_payload->'config'->>'id',p_payload->'config',p_payload->'bank',(p_payload->>'enabled')::boolean)
  ON CONFLICT(id) DO UPDATE SET config=excluded.config,bank=excluded.bank,enabled=excluded.enabled,updated_at=clock_timestamp();
  result:=jsonb_build_object('saved',true);
 WHEN 'attempt' THEN
  SELECT jsonb_build_object('body',body,'version',version) INTO result FROM competition_private.attempts WHERE uid=p_uid AND week_key=current_week;
 WHEN 'attempt_by_id' THEN
  SELECT jsonb_build_object('body',body,'version',version) INTO result FROM competition_private.attempts WHERE uid=p_uid AND id::text=p_payload->>'attemptId';
 WHEN 'insert' THEN
  PERFORM 1 FROM competition_private.rounds WHERE id=p_payload->'body'->>'roundId' FOR UPDATE;
  IF NOT EXISTS(SELECT 1 FROM competition_private.rounds WHERE id=p_payload->'body'->>'roundId' AND enabled=true AND updated_at::text=p_payload->'body'->>'roundRevision') THEN RAISE EXCEPTION 'ROUND_CHANGED'; END IF;
  INSERT INTO competition_private.attempts(id,uid,week_key,round_id,body)
  VALUES((p_payload->'body'->>'id')::uuid,p_uid,current_week,p_payload->'body'->>'roundId',p_payload->'body') ON CONFLICT(uid,week_key) DO NOTHING;
  SELECT jsonb_build_object('body',body,'version',version) INTO result FROM competition_private.attempts WHERE uid=p_uid AND week_key=current_week;
 WHEN 'cas' THEN
  UPDATE competition_private.attempts SET body=p_payload->'body',version=version+1
  WHERE uid=p_uid AND id=(p_payload->'body'->>'id')::uuid AND version=(p_payload->>'version')::int
   AND body->'paper'=p_payload->'body'->'paper' AND body->'roundId'=p_payload->'body'->'roundId'
   AND body->'displayName'=p_payload->'body'->'displayName' AND body->'photoUrl'=p_payload->'body'->'photoUrl';
  GET DIAGNOSTICS affected=ROW_COUNT;result:=to_jsonb(affected=1);
 WHEN 'leaderboard' THEN
  SELECT coalesce(jsonb_agg(item ORDER BY (item->>'rank')::int,item->>'completedAt'),'[]'::jsonb) INTO result FROM (
   SELECT jsonb_build_object('resultId',id,'displayName',body->>'displayName','photoUrl',body->>'photoUrl','score',(body->>'score')::int,'total',jsonb_array_length(body->'paper'),
    'completedAt',body->>'completedAt','rank',dense_rank() OVER(ORDER BY (body->>'score')::int DESC)) AS item
   FROM competition_private.attempts WHERE round_id=p_payload->>'roundId' AND body->>'status'='completed' AND coalesce((body->>'underReview')::boolean,false)=false
   ORDER BY (body->>'score')::int DESC,body->>'completedAt',id LIMIT 20
  ) ranked;
 WHEN 'result' THEN
  SELECT jsonb_build_object('resultId',id,'roundId',round_id,'endsAt',body->>'endsAtIso','displayName',body->>'displayName','photoUrl',body->>'photoUrl','score',(body->>'score')::int,'total',jsonb_array_length(body->'paper'),'completedAt',body->>'completedAt','underReview',coalesce((body->>'underReview')::boolean,false),
   'rank',CASE WHEN coalesce((body->>'underReview')::boolean,false)=true THEN NULL ELSE 1+(SELECT count(DISTINCT (other.body->>'score')::int) FROM competition_private.attempts other WHERE other.round_id=a.round_id AND other.body->>'status'='completed' AND coalesce((other.body->>'underReview')::boolean,false)=false AND (other.body->>'score')::int>(a.body->>'score')::int) END)
   INTO result FROM competition_private.attempts a WHERE id::text=p_payload->>'resultId' AND body->>'status'='completed';
 WHEN 'rate' THEN
  INSERT INTO competition_private.rate_limits(subject,count,expires_at) VALUES(p_payload->>'subject',1,clock_timestamp()+interval '1 minute')
  ON CONFLICT(subject) DO UPDATE SET count=CASE WHEN competition_private.rate_limits.expires_at<clock_timestamp() THEN 1 ELSE competition_private.rate_limits.count+1 END,
   expires_at=CASE WHEN competition_private.rate_limits.expires_at<clock_timestamp() THEN clock_timestamp()+interval '1 minute' ELSE competition_private.rate_limits.expires_at END;
  SELECT to_jsonb(count<=(p_payload->>'limit')::int) INTO result FROM competition_private.rate_limits WHERE subject=p_payload->>'subject';
 WHEN 'cleanup' THEN
  DELETE FROM competition_private.rate_limits WHERE expires_at<clock_timestamp()-interval '1 day';result:=jsonb_build_object('cleaned',true);
 ELSE RAISE EXCEPTION 'UNKNOWN_COMPETITION_OPERATION';
 END CASE;
 RETURN result;
END $$;
REVOKE ALL ON FUNCTION public.competition_gateway(TEXT,TEXT,JSONB) FROM PUBLIC;
DO $$ BEGIN
 IF EXISTS(SELECT 1 FROM pg_roles WHERE rolname='anon') THEN
  REVOKE ALL ON SCHEMA competition_private FROM anon;
  REVOKE ALL ON FUNCTION public.competition_gateway(TEXT,TEXT,JSONB) FROM anon;
 END IF;
 IF EXISTS(SELECT 1 FROM pg_roles WHERE rolname='authenticated') THEN
  REVOKE ALL ON SCHEMA competition_private FROM authenticated;
  REVOKE ALL ON FUNCTION public.competition_gateway(TEXT,TEXT,JSONB) FROM authenticated;
 END IF;
 IF EXISTS(SELECT 1 FROM pg_roles WHERE rolname='service_role') THEN
  GRANT EXECUTE ON FUNCTION public.competition_gateway(TEXT,TEXT,JSONB) TO service_role;
 END IF;
END $$;
