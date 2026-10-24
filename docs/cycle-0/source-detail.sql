-- Supplemental reproduction of detailed public audit observations.
-- Consolidated from the executed read-only discovery SELECTs; this assembled
-- file has not itself been executed against source. Results may change over time.
-- Bind :owner_id privately to the verified authorized source person UUID.
-- No content values, private identities, filenames, URLs, credentials or
-- affected access-control exception table names are returned.
BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ READ ONLY;
SET LOCAL statement_timeout = '15s';
WITH scoped AS (
  SELECT * FROM public.sessions WHERE person_id=:'owner_id'::uuid
), messages AS (
  SELECT s.id session_id,m.value msg,m.ordinality pos
  FROM scoped s CROSS JOIN LATERAL
    jsonb_array_elements(data->'messages') WITH ORDINALITY m
), parts AS (
  SELECT v FROM messages CROSS JOIN LATERAL jsonb_array_elements(
    CASE WHEN jsonb_typeof(msg->'content')='array'
      THEN msg->'content' ELSE '[]'::jsonb END) v
), attachments AS (
  SELECT v FROM messages CROSS JOIN LATERAL jsonb_array_elements(
    CASE WHEN jsonb_typeof(msg->'attachments')='array'
      THEN msg->'attachments' ELSE '[]'::jsonb END) v
)
SELECT jsonb_build_object(
  'read_only',current_setting('transaction_read_only'),
  'global_structure',jsonb_build_object(
    'public_ordinary_tables',(SELECT count(*) FROM pg_class c
      JOIN pg_namespace n ON c.relnamespace=n.oid
      WHERE n.nspname='public' AND c.relkind='r'),
    'persons',(SELECT count(*) FROM public.persons),
    'sessions',(SELECT count(*) FROM public.sessions),
    'session_owners',(SELECT count(DISTINCT person_id) FROM public.sessions),
    'session_data_objects',(SELECT count(*) FROM public.sessions
      WHERE jsonb_typeof(data)='object'),
    'session_message_arrays',(SELECT count(*) FROM public.sessions
      WHERE jsonb_typeof(data->'messages')='array')),
  'columns',(SELECT jsonb_agg(jsonb_build_object('table',table_name,
      'column',column_name,'type',data_type,'nullable',is_nullable) ORDER BY table_name,ordinal_position)
    FROM information_schema.columns WHERE table_schema='public'
      AND table_name IN ('sessions','resources','rooms','room_exports')),
  'time',(SELECT jsonb_build_object(
    'numeric_count',count(*) FILTER(WHERE jsonb_typeof(msg->'timestamp')='number'),
    'numeric_min',min((msg->>'timestamp')::numeric)
      FILTER(WHERE jsonb_typeof(msg->'timestamp')='number'),
    'numeric_max',max((msg->>'timestamp')::numeric)
      FILTER(WHERE jsonb_typeof(msg->'timestamp')='number'),
    'string_count',count(*) FILTER(WHERE jsonb_typeof(msg->'timestamp')='string'),
    'iso_prefix_count',count(*) FILTER(
      WHERE msg->>'timestamp' ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}T'),
    'string_min',min(msg->>'timestamp') FILTER(
      WHERE jsonb_typeof(msg->'timestamp')='string'
        AND msg->>'timestamp' ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}T'),
    'string_max',max(msg->>'timestamp') FILTER(
      WHERE jsonb_typeof(msg->'timestamp')='string'
        AND msg->>'timestamp' ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}T'),
    'missing_or_null',count(*) FILTER(WHERE msg->>'timestamp' IS NULL))
    FROM messages),
  'duplicate_timestamp_groups',(SELECT count(*) FROM (
    SELECT session_id,msg->>'timestamp' FROM messages
    GROUP BY 1,2 HAVING count(*)>1) x),
  'role_labels',(SELECT jsonb_agg(x) FROM (
    SELECT CASE WHEN msg->>'role' ~ '^[a-z_-]{1,32}$'
      THEN msg->>'role' ELSE '[nonstandard]' END role,count(*) n
    FROM messages GROUP BY 1) x),
  'message_keys',(SELECT jsonb_object_agg(k,n) FROM (
    SELECT k,count(*) n FROM messages CROSS JOIN LATERAL jsonb_object_keys(
      CASE WHEN jsonb_typeof(msg)='object' THEN msg ELSE '{}'::jsonb END) k
    WHERE k IN ('id','role','content','text','timestamp','created_at','createdAt',
      'attachments','files','parts','type') GROUP BY k) x),
  'id_key_present',(SELECT count(*) FROM messages WHERE msg ? 'id'),
  'id_key_with_null',(SELECT count(*) FROM messages WHERE msg ? 'id' AND msg->>'id' IS NULL),
  'cached_null_sessions',(SELECT count(*) FROM scoped WHERE message_count IS NULL),
  'non_object_messages',(SELECT count(*) FROM messages WHERE jsonb_typeof(msg)<>'object'),
  'parts',(SELECT jsonb_build_object('count',count(*),
    'text_key',count(*) FILTER(WHERE v ? 'text'),
    'type_text',count(*) FILTER(WHERE v->>'type'='text'),
    'inlineData',count(*) FILTER(WHERE v ? 'inlineData'),
    'inline_data',count(*) FILTER(WHERE v ? 'inline_data'),
    'fileData',count(*) FILTER(WHERE v ? 'fileData'),
    'image_url',count(*) FILTER(WHERE v ? 'image_url'),
    'non_object',count(*) FILTER(WHERE jsonb_typeof(v)<>'object')) FROM parts),
  'part_types',(SELECT jsonb_agg(x) FROM (
    SELECT CASE WHEN v->>'type' ~ '^[a-z_-]{1,32}$'
      THEN v->>'type' ELSE '[missing-or-nonstandard]' END type,count(*) n
    FROM parts GROUP BY 1) x),
  'attachment_shapes',(SELECT jsonb_agg(x) FROM (
    SELECT jsonb_typeof(msg->'attachments') type,count(*) n,
      sum(CASE WHEN jsonb_typeof(msg->'attachments')='array'
        THEN jsonb_array_length(msg->'attachments') ELSE 0 END) array_items
    FROM messages WHERE msg ? 'attachments' GROUP BY 1) x),
  'attachment_keys',(SELECT jsonb_agg(x) FROM (
    SELECT k,count(*) n FROM attachments CROSS JOIN LATERAL jsonb_object_keys(
      CASE WHEN jsonb_typeof(v)='object' THEN v ELSE '{}'::jsonb END) k
    WHERE k IN ('id','name','url','uri','path','mimeType','mime_type','type','size',
      'data','base64','content','file','status') GROUP BY k) x),
  'resource_links',(SELECT count(*) FROM public.resources
    WHERE person_id=:'owner_id'::uuid AND session_id IS NOT NULL),
  'storage',jsonb_build_object('bucket_count',(SELECT count(*) FROM storage.buckets),
    'legacy_person_object_count',(SELECT count(*) FROM storage.objects
      WHERE owner_id=:'owner_id')),
  'session_security',(SELECT jsonb_build_object('rls',c.relrowsecurity,
    'force_rls',c.relforcerowsecurity,'policy_count',
      (SELECT count(*) FROM pg_policy WHERE polrelid=c.oid))
    FROM pg_class c JOIN pg_namespace n ON c.relnamespace=n.oid
    WHERE n.nspname='public' AND c.relname='sessions'),
  'redacted_public_rls_exception_count',(SELECT count(*) FROM pg_class c
    JOIN pg_namespace n ON c.relnamespace=n.oid
    WHERE n.nspname='public' AND c.relkind='r' AND NOT c.relrowsecurity)
) inventory;
COMMIT;
