-- Read-only reproduction template; not a migration and not executed automatically.
-- psql binding :owner_id must be the privately verified source person UUID.
-- Use only the owner-approved source/connection. No private IDs in this file.
-- Connector callers substitute a separately validated UUID as a SQL literal.
BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ READ ONLY;
SET LOCAL statement_timeout = '15s';
WITH scoped AS (
  SELECT * FROM public.sessions WHERE person_id = :'owner_id'::uuid
), messages AS (
  SELECT s.id AS session_id, m.value AS msg, m.ordinality AS position
  FROM scoped s
  CROSS JOIN LATERAL jsonb_array_elements(s.data->'messages') WITH ORDINALITY m
)
SELECT jsonb_build_object(
  'read_only', current_setting('transaction_read_only'),
  'sessions', (SELECT jsonb_build_object(
    'count', count(*), 'active', count(*) FILTER (WHERE deleted_at IS NULL),
    'min_created', min(created_at), 'max_created', max(created_at),
    'max_modified', max(last_modified), 'rooms', count(DISTINCT room_id),
    'message_count_sum', sum(message_count),
    'actual_messages', sum(jsonb_array_length(data->'messages')),
    'mismatched_count_sessions', count(*) FILTER (
      WHERE message_count <> jsonb_array_length(data->'messages')),
    'json_bytes', sum(octet_length(data::text))) FROM scoped),
  'roles', (SELECT jsonb_agg(x) FROM (
    SELECT CASE WHEN msg->>'role' IN (
      'user','assistant','user-with-attachments','notes-marker','time-marker','artifact')
      THEN msg->>'role' ELSE 'other' END AS role, count(*) AS n
    FROM messages GROUP BY 1) x),
  'shapes', (SELECT jsonb_build_object(
    'missing_id', count(*) FILTER (WHERE msg->>'id' IS NULL),
    'content_arrays', count(*) FILTER (WHERE jsonb_typeof(msg->'content')='array'),
    'content_strings', count(*) FILTER (WHERE jsonb_typeof(msg->'content')='string'),
    'timestamp_number', count(*) FILTER (WHERE jsonb_typeof(msg->'timestamp')='number'),
    'timestamp_string', count(*) FILTER (WHERE jsonb_typeof(msg->'timestamp')='string'),
    'attachments_present', count(*) FILTER (WHERE msg ? 'attachments')) FROM messages),
  'resources', (SELECT count(*) FROM public.resources WHERE person_id=:'owner_id'::uuid),
  'ownership', (SELECT jsonb_build_object(
    'orphan_rooms',count(*) FILTER(WHERE s.room_id IS NOT NULL AND r.id IS NULL),
    'foreign_owner_rooms',count(*) FILTER(WHERE r.person_id<>s.person_id))
    FROM scoped s LEFT JOIN public.rooms r ON r.id=s.room_id)
) AS inventory;
COMMIT;
