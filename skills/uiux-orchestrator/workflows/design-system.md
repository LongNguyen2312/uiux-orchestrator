# Workflow: Design system (document, extend, create)

| Sub-type | Signals | Steps |
|---|---|---|
| Document | "document our design system", "write DESIGN.md", "what tokens do we have" | inspect → inventory → document → report |
| Extend | "add a variant/token/component", "make these consistent" | inspect → inventory → decide → implement → migrate usages (if asked) → validate |
| Create | no system exists and user wants one | ux (product context) → direction → tokens → core components → apply to one screen → validate |

**inventory** — Collect what exists: tokens (color roles, type scale, spacing, radius, elevation,
motion), components and variants, hardcoded values that should be tokens (count and locations),
naming inconsistencies, platform theme integration (`MaterialTheme`, `ThemeData`, asset catalogs,
CSS variables, Tailwind theme).

**document** — `impeccable/document` (DESIGN.md) if available and the project has no other format;
otherwise write in the project's existing format/location. Describe what the code *does*, derived
from the code, not aspirations.

**decide / tokens** — Semantic tokens over raw values (`color.bg.surface` → primitive). Every
color role ships with its on-color and a contrast check. Type scale tied to platform scaling
(Dynamic Type, `sp`, `textScaler`, `rem`). For Create, the driver comes from the driver table (decision-engine §4); `uupm/design-system`
`--persist` writes only into a location the user agrees; Expo projects may use `expo/design-system`.

**migrate usages** — Only when asked or required by the change; list every file touched.

Rules: never rename or delete tokens in use without permission; changes to shared tokens are
**elevated risk** — capture before/after on the most prominent screens using them.

## Gate

Changes intentional and listed (old → new) · usages updated or confirmed unaffected · docs match
code · contrast of every new/changed color pair checked · L1 + L2, plus L4 on a representative screen
(Document sub-type with no code changes: spot-check docs against code; L4 not applicable).
