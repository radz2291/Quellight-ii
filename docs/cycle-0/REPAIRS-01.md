# Repairs after independent challenge 01

Original tested candidate: `34acfcc04152ed5570d1e7449e1df648226b1ea6`. [Initial independent report](VERIFICATION-01.md) is retained unchanged with its HELD verdict. This file records builder repairs for a successor exact-commit audit, not a retroactive PASS for the first candidate.

| Finding | Repair | Evidence limit |
| --- | --- | --- |
| F-01 expanded source reproduction | Added [detailed structural SQL](source-detail.sql) with privately bound owner parameter, all public shape/time/role/part/attachment/catalog/storage/session-policy checks, and a redacted exception count. Existing core template gains explicit absent-key/null and cached-null checks. Audit explains actual grouped-key/schema evidence versus strengthened future checks. | Consolidated template assembled from recorded SELECT expressions; no new source query. Detailed private grant exception stays in II-001. Actual counts/source no-mutation history remain builder tool observations. |
| F-02 line-ending hashes | Technology explains canonical Git-blob LF digests, Windows CRLF checkout behavior and provides an exact portable Git-blob hash command. | Raw working-file hashes are diagnostic; behavior replay is distinct from byte identity. |
| F-03 stale worker fencing | Trusted context includes lease generation; the mutation transaction locks/rechecks run owner/generation/expiry/cancellation before any new effect, alongside receipt/data/outbox. | Proposed contract only; process-kill/fencing tests remain later-stage work. |
| F-04 snapshot identity | Explicit source_snapshot fields and uniqueness on source/message; matching composite integrity and successor-snapshot reconciliation explained. | Real importer/canonical serialization/unchanged-item reconciliation still require implementation proof. |

Foundation links and whitespace are checked before the successor commit. The first failed Git commit due to absent checkout author identity was retried with per-command Codex author settings; global Git configuration was not changed. The initial Work heartbeat was corrected with the successful exact candidate SHA.
