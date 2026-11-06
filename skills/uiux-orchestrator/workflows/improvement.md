# Workflow: UI improvement (polish, refinement, responsive/adaptive tweaks)

Steps: `inspect → audit-current → implement → validate → report` (+ `review` for Medium+)

| Step | Notes |
|---|---|
| inspect | Target and the tokens/components it uses. Small tasks stop reading here. |
| audit-current | Small: your own pass using the "what to inspect" list in quality-gates. Medium+: route `ux-critique` or a focused slot matching the ask (`typeset`, `layout`, `colorize`, `clarify`, `adapt`, `harden`, `tone`). Pick **one** focused command when the ask names one dimension. |
| implement | Targeted improvements only, ranked by impact. Preserve architecture, identity, copy (unless copy is the ask), and behavior. |
| validate | L1 + L2; L4 for anything visible. |
| review | Medium+: the polish slot (`impeccable/polish`) or the built-in checklist. |

Skip `ux`, `direction`, `system` entirely unless the audit proves the problem is structural — then
stop and propose escalating to `redesign.md` (Refresh) instead of silently expanding scope.

Responsive / adaptive asks: decide the target sizes from the platform (web breakpoints in the
project; iOS size classes; Android window size classes; Flutter `LayoutBuilder`/`MediaQuery`
breakpoints), then fix layout at each. Route `responsive` slot only when the approach is unclear
(`impeccable/adapt`, `android/adaptive`, `android/edge-to-edge`; `emil/mobile-native` only for web
apps on phones).

**Distinct steps when composed as a secondary intent:** a focused `audit-current` pass for the named
dimension.

## Gate

Each targeted issue resolved · no regressions in touched components · identity and architecture
preserved · evidence L1 + L2, plus L4 for visual changes.
