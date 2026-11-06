# Workflow: UI bug fix

Steps: `reproduce → inspect → root cause → fix → validate → regression → report`

Usually **no external skill**. Route a slot only when the root cause is in a specialist domain and
not understood after inspection (e.g. RN gesture conflict → `swm/react-native-best-practices`
gestures reference; Android insets → `android/edge-to-edge`; web jank → `emil/animation-performance`).

1. **reproduce** — Render the failing case (size, device, state, data, locale, font scale) and
   capture it. If it cannot be rendered here, identify the exact conditions from code and say the
   reproduction is theoretical.
2. **inspect** — The component, its parents' layout constraints, the tokens and the data feeding it.
3. **root cause** — One sentence: *what* constraint produces the defect *where*. Typical causes:
   fixed width/height, missing flex/weight/`minWidth: 0`, `maxLines` without overflow strategy,
   ignored insets/safe area, z-index/stacking context, missing state, locale/long-text, font scale,
   race in async state, animation leaving stale transform.
4. **fix** — The smallest change that removes the cause (not the symptom). If the cause is wider
   than the user described (e.g. reported "on small phones", broken at every width), fix the cause
   where it applies in the touched component and report the wider scope. No redesign, no
   refactor, no token change unless the token is the cause (then ask if shared).
5. **validate** — Re-run the reproduction; capture after.
6. **regression** — Check the other usages of the changed component and the conditions next to the
   failing one (e.g. 320 and 360 widths, font scale 1.0 and 2.0, LTR and RTL, light and dark).
7. **report** — Root cause, fix, evidence before/after, regression checks done, residual risk.

## Gate

Root cause stated · minimal diff · bug no longer reproduces · neighbouring conditions and usages
unaffected · evidence: reproduction + L4 (or L3) after; theoretical reproduction lowers status to
`Passed with limitations`.
