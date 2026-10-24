# Hosted-resource prerequisites — no action authorized

II-002 authorizes local synthetic proof and this checklist. It does not authorize deletion, provisioning, real import, legacy remediation, payment or deployment. The current [HANDOFF](../HANDOFF.md) controls authority. The prior [retirement/import plan](../cycle-0/IMPORT-AND-OPERATIONS.md) remains applicable.

| Prerequisite | Evidence / gate |
| --- | --- |
| Historical source | Owner-selected ARA-Light. Existing private C0 account inventory is historical evidence; no connector query or source write in C1. Exclude it from retirement. |
| Staging target | ARA-Light-Staging-01 is the owner-named retirement candidate. Re-read exact account/org/project UUID and human-readable name privately at the moment of proposed retirement; names alone are insufficient. Live target identity **NOT REVERIFIED** in C1. |
| Account ownership/entitlement | Verify signed-in account and organization, project inventory, free/paid entitlement and actual capacity. Owner's two-project limit is not an independently verified billing fact. **PENDING**. |
| Data and credentials | Inventory tables, Auth identities/config, grants/jobs/functions, storage objects and URLs, Edge Functions, external bindings and secrets without public disclosure. Owner disposition per category and exact retention must precede deletion. **PENDING**. |
| Backup and restore | Private encrypted backup plus separately copied Storage objects/config; verify checksums and independently restore into an isolated approved destination. Count and ownership conservation, app/schema version compatibility, ACL checks and restore report required. Local migration rollback is not hosted restore evidence. **PENDING**. |
| Destination | Owner chooses distinct Quellight project, organization, region, plan, cost ceiling, allowed credentials and isolation. No assumed region/budget/key installation. **PENDING**. |
| Rollback | Record recovery window, owner of retained backups, old-client cutover/rollback, credentials/URLs needing rotation, storage link changes and eventual backup disposal. Project deletion may be permanent; do not promise restoration of the same ID or endpoint. **PENDING**. |
| Final authority | Present exact target+disposition+restore+cost evidence for a separately bounded owner decision. Prepare concrete plan before requesting deletion/provision approval. No existing C0 acceptance or C1 launch satisfies this gate. **NOT GRANTED**. |

No credentials or private project IDs belong in this public checklist. No account limit, backup restore or production security claim is marked PASS. This is the required stage planning artifact, not completed hosted-resource readiness. Outstanding gates do not justify bypassing the demonstrated local RLS environment.
