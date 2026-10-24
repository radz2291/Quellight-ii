-- Refuse rollback while v2 data exists. Never silently destroy incompatible records/runs.
DO $$ BEGIN
 IF EXISTS(SELECT 1 FROM ql.records WHERE kind='seed_experiment') OR EXISTS(SELECT 1 FROM ql.runs WHERE kind='seed_experiment') THEN
  RAISE EXCEPTION 'Rollback requires retained v2 record/run disposition';
 END IF;
END $$;
DELETE FROM ql.definitions WHERE kind='seed_experiment';
DELETE FROM ql.schema_version WHERE version=2;
