# With-skill routing runs (GREEN, then REFACTOR re-test)

- Date: 2026-11-06 · Agent: Claude Code subagents, model Opus 5.5 · Sample: n = 1 per run
- Same inputs as the baseline (`2026-11-06-baseline.md`), plus the instruction to follow
  `skills/uiux-orchestrator/SKILL.md` and load files progressively
- Scored by hand against `tests/archive/expected-routing.md`

Small samples. These runs show behaviour, not rates. Phase 4 will measure rates.

## Run 1: GREEN (skill v0.1.0-pre), S1–S8

| # | Must select | Must NOT select respected | vs. baseline |
|---|---|---|---|
| S1 | ✅ `emil/animate-expo`, decisions only, **with explicit translation to Reanimated 3** (`runOnJS`, no worklets package); no upgrade | ✅ | **Fixed** baseline's High miss |
| S2 | ✅ `impeccable/critique` + `impeccable/polish`, Refresh, no driver; Impeccable's context-file writes skipped | ✅ (`new-work`, `uupm/design-system`, Taste, Lucian rejected with reasons) | **Fixed** baseline's High miss (redesign semantics) |
| S3 | ✅ `impeccable/critique` (native); read-only; evidence basis stated | ✅ | same |
| S4 | ✅ none | ✅ | same |
| S5 | ✅ one driver (Taste if Node 22, Chrome and the kit are accepted, else `impeccable/new-work`); HTML-kit vs. Next.js porting flagged | ✅ | **Fixed** baseline's Medium miss |
| S6 | ✅ none (Flutter built-in) | ✅ | same |
| S7 | ✅ none | ✅ | same; but intake made it elevated (see issues) |
| S8 | ✅ `emil/animate`, framer-motion kept | ✅ | same; the ladder wording invited GSAP (see issues) |

Unnecessary invocations: 0 across S1–S8 (all picks were must-select or allowed-optional).
Validation plans used evidence levels and named a best reachable status in every scenario (the
baseline did neither).

Problems the run found in the skill (agent's own report, checked by the author):

1. Fast path listed "a token change" while intake treated shared tokens as elevated risk → contradiction (S7).
2. "No way to render" counted as a risk trigger → almost every task became elevated/high; S1 became high.
3. The animation ladder named GSAP for "pin/scrub, SVG draw" next to a rule that installed libraries win.
4. `improve-animations` scope boundary unclear for a single multi-screen flow.
5. No tie-break between `emil/animate` and `emil/choreograph`.
6. Unclear whether Impeccable's first-run binary download counts as "installing a tool".
7. No rule for installed-but-unregistered skills; `expo-animation` was listed in two entries' names.
8. `core/skill-registry.md` was missing from the SKILL.md load table. The agent read the **whole registry**.
9. No status rule for when even L1/L2 is impossible.
10. Size/risk were set before inspection, which depends on project facts.
11. Unclear whether adding a page transition counts as "changing routing".
12. The rule "do not invent platform rules" conflicted with the missing `platforms/` files.

## Changes made (REFACTOR)

Each change answers one problem above: the fast-path wording and scoped shared-token rule (1);
render tooling moved from risk to validation status (2); an "installed library first" tool
decision (3); improve-animations scoped to app-wide or several flows (4); a `complements` field
(5); a skill-folder download policy (6); an unregistered-skill rule and deduplicated names (7);
skill-registry in the load table and grep-based entry reads (8); a `Needs review` rule when
L1/L2 is impossible (9); provisional, then finalized size/risk (10); a routing-change definition
(11); a platform-guidance wording rule (12).

## Run 2: REFACTOR re-test, S1, S4, S7, S8

| # | Result | Problem re-checked |
|---|---|---|
| S1 | Large/**elevated** (was high). The built-in checklist for one flow; `animate-expo` with Reanimated 3 translation; `agent-device` mentioned as missing and high-value | 2, 4 fixed |
| S4 | Fast path, no skill; before/after L4 at 320/360dp and font scale 1.0/2.0 | — |
| S7 | Fast path when the token is used only by buttons; asks about scope when it is used elsewhere; computed contrast (picked a shade that passes AA) | 1 fixed |
| S8 | framer-motion `useScroll` → `pathLength`; GSAP eliminated by the installed-library rule; `choreograph` as a conditional complement | 3, 5 fixed |
| Loading | The registry was read **by grep of shortlisted ids only**. `handoff.md`, unused workflows and unused entries were not read | 8 fixed |

New minor issues and what happened to them:
- The fast path said "cheapest check" while the bug-fix gate requires before/after. **Fixed:** the
  fast path now collects the gate's evidence.
- `animate-expo`'s Reanimated 4 caveat sat in `requires` (hard) but was soft. **Fixed:** moved to
  `limitations`; `requires` is now defined as hard-only.
- The `agent-device` install hint was not actionable. **Fixed:** it is now the real `npx skills` command.
- The S8 Medium/Large boundary is a judgement call; version-drift checks were impossible in a
  sandbox; some API facts came from model memory. **Still open:** Phase 2 platform files and
  Phase 4 execution runs.
