CREATE SCHEMA ql;
REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA ql FROM PUBLIC;
CREATE FUNCTION ql.owner() RETURNS text LANGUAGE sql STABLE AS $$
 SELECT CASE session_user WHEN 'alice' THEN 'alice' WHEN 'worker_alice' THEN 'alice'
 WHEN 'bob' THEN 'bob' WHEN 'worker_bob' THEN 'bob' ELSE NULL END
$$;
REVOKE ALL ON FUNCTION ql.owner() FROM PUBLIC;
CREATE TABLE ql.schema_version(version integer PRIMARY KEY);
INSERT INTO ql.schema_version VALUES(1);
CREATE TABLE ql.definitions(kind text PRIMARY KEY, version integer NOT NULL, definition jsonb NOT NULL, skill text NOT NULL);
INSERT INTO ql.definitions VALUES
 ('note',1,'{"required":["title"],"properties":{"title":"string","body":"string"}}','core/note@1'),
 ('task',1,'{"required":["title"],"properties":{"title":"string","body":"string","due":"date"}}','core/task@1');
CREATE TABLE ql.sources(
 owner_id text NOT NULL DEFAULT ql.owner(), id uuid NOT NULL, body text NOT NULL CHECK(length(body) BETWEEN 1 AND 16000),
 created_at timestamptz NOT NULL DEFAULT clock_timestamp(), PRIMARY KEY(owner_id,id));
CREATE TABLE ql.records(
 owner_id text NOT NULL DEFAULT ql.owner(), id uuid NOT NULL, source_id uuid NOT NULL, kind text NOT NULL REFERENCES ql.definitions,
 schema_version integer NOT NULL DEFAULT 1 CHECK(schema_version>0), version integer NOT NULL DEFAULT 1 CHECK(version>0),
 data jsonb NOT NULL CHECK(jsonb_typeof(data)='object' AND octet_length(data::text)<20000),
 created_at timestamptz NOT NULL DEFAULT clock_timestamp(), PRIMARY KEY(owner_id,id),
 FOREIGN KEY(owner_id,source_id) REFERENCES ql.sources(owner_id,id));
CREATE TABLE ql.revisions(
 owner_id text NOT NULL DEFAULT ql.owner(), record_id uuid NOT NULL, version integer NOT NULL, data jsonb NOT NULL,
 actor text NOT NULL CHECK(actor IN ('human','steward')), operation_key text NOT NULL,
 created_at timestamptz NOT NULL DEFAULT clock_timestamp(), PRIMARY KEY(owner_id,record_id,version),
 FOREIGN KEY(owner_id,record_id) REFERENCES ql.records(owner_id,id));
CREATE TABLE ql.operations(
 owner_id text NOT NULL DEFAULT ql.owner(), key text NOT NULL CHECK(length(key) BETWEEN 8 AND 100),
 fingerprint text NOT NULL, result jsonb NOT NULL, created_at timestamptz NOT NULL DEFAULT clock_timestamp(),
 PRIMARY KEY(owner_id,key));
CREATE TABLE ql.runs(
 owner_id text NOT NULL DEFAULT ql.owner(), id uuid NOT NULL, source_id uuid NOT NULL,
 kind text NOT NULL REFERENCES ql.definitions, data jsonb NOT NULL,
 status text NOT NULL DEFAULT 'queued' CHECK(status IN ('queued','running','finished','failed','cancelled')),
 generation integer NOT NULL DEFAULT 0, attempt integer NOT NULL DEFAULT 0, step integer NOT NULL DEFAULT 0,
 lease_until timestamptz, error_code text, record_id uuid,
 created_at timestamptz NOT NULL DEFAULT clock_timestamp(), PRIMARY KEY(owner_id,id),
 FOREIGN KEY(owner_id,source_id) REFERENCES ql.sources(owner_id,id),
 FOREIGN KEY(owner_id,record_id) REFERENCES ql.records(owner_id,id));
CREATE TABLE ql.outbox(
 owner_id text NOT NULL DEFAULT ql.owner(), run_id uuid NOT NULL, delivered boolean NOT NULL DEFAULT false,
 PRIMARY KEY(owner_id,run_id), FOREIGN KEY(owner_id,run_id) REFERENCES ql.runs(owner_id,id));
CREATE TABLE ql.effects(
 owner_id text NOT NULL DEFAULT ql.owner(), run_id uuid NOT NULL, record_id uuid NOT NULL,
 PRIMARY KEY(owner_id,run_id), FOREIGN KEY(owner_id,run_id) REFERENCES ql.runs(owner_id,id),
 FOREIGN KEY(owner_id,record_id) REFERENCES ql.records(owner_id,id));
CREATE TABLE ql.events(
 owner_id text NOT NULL DEFAULT ql.owner(), id uuid NOT NULL, record_id uuid, run_id uuid,
 action text NOT NULL, actor text NOT NULL CHECK(actor IN ('human','steward')), detail jsonb NOT NULL DEFAULT '{}',
 created_at timestamptz NOT NULL DEFAULT clock_timestamp(), PRIMARY KEY(owner_id,id),
 FOREIGN KEY(owner_id,record_id) REFERENCES ql.records(owner_id,id), FOREIGN KEY(owner_id,run_id) REFERENCES ql.runs(owner_id,id));
DO $$ DECLARE t text; BEGIN
 FOREACH t IN ARRAY ARRAY['sources','records','revisions','operations','runs','outbox','effects','events'] LOOP
  EXECUTE format('ALTER TABLE ql.%I ENABLE ROW LEVEL SECURITY',t);
  EXECUTE format('ALTER TABLE ql.%I FORCE ROW LEVEL SECURITY',t);
  EXECUTE format('CREATE POLICY owner_policy ON ql.%I USING (owner_id=ql.owner()) WITH CHECK(owner_id=ql.owner())',t);
 END LOOP;
END $$;
CREATE INDEX records_kind ON ql.records(owner_id,kind,created_at);
CREATE INDEX events_time ON ql.events(owner_id,created_at);
CREATE INDEX runs_pending ON ql.runs(owner_id,status,lease_until);
GRANT USAGE ON SCHEMA ql TO alice,bob,worker_alice,worker_bob;
GRANT EXECUTE ON FUNCTION ql.owner() TO alice,bob,worker_alice,worker_bob;
GRANT SELECT ON ALL TABLES IN SCHEMA ql TO alice,bob,worker_alice,worker_bob;
GRANT INSERT ON ql.sources,ql.records,ql.revisions,ql.operations,ql.events TO alice,bob,worker_alice,worker_bob;
GRANT UPDATE(data,version,schema_version) ON ql.records TO alice,bob,worker_alice,worker_bob;
GRANT INSERT(owner_id,id,source_id,kind,data) ON ql.runs TO alice,bob;
GRANT INSERT(owner_id,run_id) ON ql.outbox TO alice,bob;
GRANT INSERT ON ql.effects TO worker_alice,worker_bob;
GRANT UPDATE ON ql.runs,ql.outbox TO worker_alice,worker_bob;
-- No PUBLIC function execution, no table ownership/BYPASSRLS, TRUNCATE, role membership or DDL for runtimes.
-- Narrow cancellation authority, still scoped by session_user; no dynamic SQL or data-returning escalation.
CREATE FUNCTION ql.cancel_run(target uuid) RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,ql AS $$
DECLARE changed integer; BEGIN
 UPDATE ql.runs SET status='cancelled', generation=generation+1,lease_until=NULL
 WHERE owner_id=ql.owner() AND id=target AND status IN ('queued','running');
 GET DIAGNOSTICS changed=ROW_COUNT;
 RETURN changed=1;
END $$;
REVOKE ALL ON FUNCTION ql.cancel_run(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION ql.cancel_run(uuid) TO alice,bob;
CREATE FUNCTION ql.retry_run(target uuid) RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,ql AS $$
DECLARE changed integer; BEGIN
 UPDATE ql.runs SET status='queued',generation=generation+1,lease_until=NULL,error_code=NULL
 WHERE owner_id=ql.owner() AND id=target AND status='failed';
 GET DIAGNOSTICS changed=ROW_COUNT;
 IF changed=1 THEN UPDATE ql.outbox SET delivered=false WHERE owner_id=ql.owner() AND run_id=target; END IF;
 RETURN changed=1;
END $$;
REVOKE ALL ON FUNCTION ql.retry_run(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION ql.retry_run(uuid) TO alice,bob;
