# Workflow: UI/UX review (read-only)

Steps: `inspect → (render) → audit-current → report`

Mutation is **read-only**: no edits, no design-system changes, no context files, no demo toggles.
If the user later asks for fixes, switch to `improvement.md` or `bug-fix.md` using these findings
as the audit record.

1. **inspect** — Read the target, its components and tokens; note platform conventions that apply.
2. **render** — If the app can run here, capture the target at the relevant sizes, themes and states
   (quality-gates tooling). If not, review from code and say so in the report. Do not describe
   rendered appearance you did not observe.
3. **audit-current** — One slot per dimension the user asked about (decision-engine §3):
   - UX / visual quality → `ux-critique`.
   - Technical: accessibility, performance, responsive, web rule compliance → `tech-audit`.
   - Platform conventions → `platform-conformance` (HIG reviewer for Apple platforms; Impeccable
     critique's native guidance for Android; the platform file as fallback; web has none).
   - Code quality, when asked or on Large reviews → `code-review`.
   - Motion → the animation workflow's *review* sub-type.
   "Review the screen / find UX problems" = `ux-critique` (+ `platform-conformance` on Apple
   platforms). "Full review" = `ux-critique` + `tech-audit` (+ `platform-conformance`). With no
   specialist available, use the rubric below.
4. **report** — Merge and dedupe findings (same location + same cause = one finding).

## Rubric (built-in)

Task clarity and primary action · information hierarchy · consistency with the rest of the app ·
platform conventions · states (loading/empty/error/disabled/long content) · forms (labels, errors
near fields, input types, keyboard) · navigation and back behavior · copy clarity ·
accessibility (contrast, targets, labels/roles, focus order, large text, reduced motion) · motion ·
responsiveness/adaptivity · performance signals visible in code.

## Finding format

```text
[Severity] Title
Where: file:line (and screen/state/size if rendered)
Problem: what is wrong, observed or from code (say which)
Impact: who is affected and how
Fix: direction, not a full patch
```

| Severity | Meaning |
|---|---|
| Critical | Blocks a core task, data loss, or excludes users (e.g. checkout button unreachable by screen reader). |
| High | Significant friction or a WCAG AA failure on a main path. |
| Medium | Noticeable inconsistency or friction; secondary paths. |
| Low | Minor polish. |
| Suggestion | Optional improvement or idea, not a defect. |

Order by severity, then by user impact. End with the 3 changes that would matter most.

## Gate

Findings specific, located, with severity, impact and fix direction · evidence basis stated (code
vs. rendered) · no files changed · L0 (+ L4 when rendering was possible).
