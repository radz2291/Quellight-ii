# Repair and owner-steering record

Original `498b9ea27dbd3f8c2bf4a8f04f92de9925a7fd89` is retained with its [independent HELD verdict](VERIFICATION-01.md). The fresh verifier demonstrated F1: a save paused at the async digest boundary resumed after Alice→Bob sign-out/sign-in and committed Alice's pending intention as Bob. Database RLS remained correct for the current cookie; the missing boundary was the originating UI session.

Repairs:

- Both the preserved native fixture and selected Next UI capture owner/session before asynchronous payload work, reject a changed/aborted scope before dispatch and avoid touching another owner's pending operation key. The Next owner component unmounts its runtime and aborts requests/drafts on sign-out.
- The gateway accepts an expected-owner header as a **precondition**, never identity. A mismatch with the authenticated session fails before the operation. Direct HTTP regression checks it; the Next adapter forwards it without client access to any database credentials.
- Browser reproduction now deliberately pauses the digest, switches owners and resumes it. Neither UI may create the stale record under Bob. Existing receipt/version/recovery tests remain intact.

Owner-directed bounded additions in the same successor:

- Use Next.js 16.4.3 / React 19.3.1 / assistant-ui 0.15.31 for maintained web/chat infrastructure; preserve original UI/backend/evidence. [Evaluation](UI-STACK.md) records justification and path before Cycle 2. Strict TS/TSX, production build and streaming through the local adapter are exercised.
- Default to Companion-first conversation. Your space is the secondary view for explicit save forms, records, JSON, source/revisions and run controls. No backend rearchitecture or loss of inspection. Browser checks visible default content and opens the secondary view for all existing interactions.

Builder successor checks: eight real DB/model/HTTP groups PASS, including mismatched owner-context; checkJs + strict Next TS/TSX + route typegen PASS; production Next/native build PASS; selected browser ten assertions PASS, including default visibility, stop/error and F1; preserved native browser eight assertions PASS including F1. Synthetic screenshots updated, with a separate default conversation image. Production npm audit reports zero vulnerabilities at check time. Successor still requires fresh exact-commit independent verification; these builder observations do not erase the original failure.
