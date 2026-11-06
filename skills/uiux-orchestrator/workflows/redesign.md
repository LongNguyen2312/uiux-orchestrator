# Workflow: Redesign

First confirm the sub-type from intake: **Refresh** (inside the current system — default) or
**Replace** (new visual direction, confirmed).

Steps: `inspect → audit-current → ux → direction → system → components → motion → implement → validate → review → refine → report`

| Step | Refresh | Replace |
|---|---|---|
| inspect | Target + neighbours + shared components it uses. | Whole surface family in scope. |
| audit-current | **Always.** Capture the current UI (L4 if possible) and list UX + visual problems with locations. This is the redesign's evidence base. | Same; also record what the product must keep (content, functions, native affordances). |
| ux | Re-derive hierarchy and flow only where the audit found problems. | Full UX record. |
| direction | Constrained: layout, hierarchy, density and component choice **within** existing tokens. No driver. | Driver chosen (one). User confirms direction before implementation on Large scope. |
| system | Only additive tokens/variants, justified by a finding. | Token changes listed old → new; usages outside scope assessed. |
| components | Reuse; extend variants; new only when nothing fits. | Same order of preference. |
| motion | Only if audit found motion problems or opportunities (`emil/find-animation-opportunities`). | Motion direction is part of the direction record. |
| implement | Progressive: one region/section at a time, keep the screen working between steps. | Same; feature-flag or route-level switch when the product is live and the user wants it. |
| validate | Before/after captures at the same sizes/states. | Same, plus untouched screens that share changed components. |
| review | Medium+: check scope compliance and consistency with untouched screens with a different slot than the audit step (e.g. `tech-audit` after `ux-critique`), or the built-in rubric. | Independent reviewer (decision-engine §4/§7). |
| refine / report | Route `polish` only when the review found polish-level issues; otherwise the built-in pass. Report before/after, findings resolved, findings deferred. | Same, plus direction rationale. |

Rules:
- Do not redesign what is not in scope, even if it looks dated. List it as a suggestion.
- Map wording: user "redesign … consistent with the existing app" = Refresh. In Impeccable's
  vocabulary this is *refinement*; never invoke its replacement path (`new-work` replacing
  DESIGN.md) for a Refresh.
- Behavior changes (navigation, flows, data) need permission even inside a redesign.

**Distinct steps when composed as a secondary intent:** `audit-current`.

## Gate

Design gate · every audit finding in scope resolved or explicitly deferred · nothing outside scope
changed · consistent with untouched screens · evidence L2 + L4 before/after.
