# 01 — Product contract — Quellight V1

**Status:** owner-directed product intent; implementation unverified. **Audience:** individuals beginning with the owner's own use, but not hardwired to a single person's life or data.

## North star

Quellight is a thoughtful personal AI companion that develops understanding over time. It can help its user remember, reflect, plan and practice. It is attentive and sometimes insightful, but never claims authority over the user's identity or turns every conversation into a task intake session. Its knowledge and actions remain inspectable by the person concerned.

User experience should feel close to the best aspects of ChatGPT personal continuity: a new session need not start from zero; relevant past discussions and durable preferences can appear naturally. This is a **quality target**, not an assertion that we know or can reproduce ChatGPT's private implementation.

## Primary experiences

1. **Natural companion.** Discuss an idea, doubt or personal situation without constant offers to save, categorize or schedule it. A quiet Steward can enrich records asynchronously.
2. **Exact and meaningful recall.** Ask “What did we discuss yesterday / last week?” or make a topical reference. Retrieve the correct original conversation when exact wording matters, alongside curated meaning when useful.
3. **Useful personal memory.** Remember stable preferences, goals, changing views, key people and projects, with source, confidence, time and revision history. Proactively connect a relevant past idea, but never fabricate a link.
4. **Daily Desk.** “Tomorrow I need to review the video” becomes a durable dated task and appears in the next day's briefing. An actual external alert is separate functionality and must not be falsely promised.
5. **Practices.** “I want to exercise twice a week” is a practice target; actual completed sessions are separate observations. Do not turn aspirations into fictional achievements or moral judgments.
6. **Owner inspection.** The user can see when background work is queued/running/stalled/completed, expand actions and evidence, open all retained personal records, and correct or remove them.
7. **Gentle first meeting.** With little known context, load a JIT “getting to know you” method, ask a few relevant optional questions, establish memory/privacy preferences, and learn more organically. An importer-returning user gets a review of known context instead of a redundant questionnaire.

## Experience principles

- Conversation leads; silent administrative work follows. An explicit user action (“save this task”) must persist reliably before a success acknowledgement.
- Reflection is not an objective diagnosis or established identity. Preserve uncertainty and user authorship.
- Quiet by default, transparent on demand. Inspection is separate from the conversational persona.
- State what Quellight *knows*, *infers*, *cannot find*, and *has actually done*.
- Reduce requests for unnecessary clarification; ask when material user intent, external consequences or sensitive meaning are genuinely ambiguous.
- Source-grounded corrections and “forget this” requests take precedence over stale summaries.

## V1 boundaries

**In scope:** single-user journey extensible to future accounts, authentication and isolation, text chat, multi-session memory, dated tasks, recurring practices, a basic daily brief, Companion/Steward coordination, JIT skills, source-backed Living Book, basic Inspection Room, recovery and tests.

**Not required for V1:** native mobile apps, full voice experience, automatic SMS/push delivery, outbound email/calendar/payment integrations, multi-user collaboration, a node-based app builder, advanced relationship visualization, unlimited agent autonomy, or exact ChatGPT feature parity. New needs can be evaluated through [Evolution](06-EVOLUTION.md).

## First-use acceptance stories

The owner should be able to:

- Start with imported history and continue a discussion from another session, opening the original source.
- Start with no history and be respectfully asked for only essential orientation.
- Create tomorrow's task, change its date, and see it in the briefing.
- Establish a recurring practice, record actual activity, and see the difference between intent and evidence.
- Correct a memory and see the old assertion superseded, not silently reintroduced.
- Inspect a background run, its skill versions, sources, changes, failures and retry status.

See [Acceptance](09-ACCEPTANCE.md) for testable cases and [Stages](08-STAGES.md) for authorized delivery order.

