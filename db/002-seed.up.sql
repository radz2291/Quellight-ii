-- Extension only: core gateway/worker/UI do not import seed-specific code.
INSERT INTO ql.definitions VALUES ('seed_experiment',2,
 '{"required":["title","variety","day"],"properties":{"title":"string","body":"string","variety":"string","day":"integer","germinated":"boolean"}}',
 'seed-experiment@2');
INSERT INTO ql.schema_version VALUES(2);
