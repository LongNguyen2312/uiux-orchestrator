# Design-to-code handoff

Every stage that makes decisions ends with a **Handoff record**. The next stage consumes it
instead of re-analysing. Keep records in the conversation (or, for Large tasks the user wants
persisted, in a file the user agrees to, e.g. `docs/ui-decisions/<task>.md`). Never write
handoff files into the project unasked.

## Record format (all stages)

```yaml
stage: visual-direction
input: what this stage received (previous record ids, profile, user constraints)
decisions:
  - what was decided, concretely (values, names, components) — not adjectives
constraints: what the next stage must not change
open: questions left for a later stage (or none)
next: the stage that consumes this
```

Write only the fields that carry information. Records are **required** when stages run in
different agents or the task is Large/high risk. For a single agent on a Small/Medium task, a
"Decisions" list in the final report is enough.

## Stage contracts

| Stage | Must hand off |
|---|---|
| Product / UX analysis | Users and their main task on this surface; primary action; information hierarchy (what is first/second/third); required states (loading, empty, error, disabled, offline, permission); flows and entry/exit points; success criteria. |
| Visual direction | Design style in one line + mode (Operate/Persuade/Read/Experience); visual hierarchy rules; color direction (roles → tokens or new values); typography direction (families, scale steps used); component principles (density, radius, elevation, iconography); motion direction (personality, duration range, easing/spring family) if motion is in scope. |
| Design system decisions | Token changes (name → old → new) or "none"; new components and their variants/states; components reused as-is; where tokens live. |
| Component research | For each needed part: chosen source (project component / platform component / library / Lucian element #id), adaptation notes, rejected options in one line. |
| Implementation | Files changed; how each decision was applied; deviations from decisions with reason; states implemented; known gaps. |
| Design review | Findings (severity, location, impact, fix); which decisions were checked; verdict. |
| Visual refinement | Fixes applied per finding; findings deferred with reason; evidence to re-verify. |

## Rules

- **Implementation uses recorded decisions.** If implementation finds a decision unworkable
  (a token missing, a component cannot support a state), it records a deviation and the reason,
  then proceeds with the closest compliant option. It does not invent a new direction.
- **Review checks against records and requirements**, not against its own taste. It may reopen a
  decision only for a concrete defect (accessibility, platform violation, requirement miss, broken
  behavior) — see conflict-resolution rung 1–4.
- **Do not repeat analysis** whose record is still valid. A record is invalid only if the
  requirement, the scope, or the project truth it relied on changed.
- **Skipped stages** produce no record; the next stage takes its input from the profile and intake.
