# Phase 3 — execution runs on sample projects

- Date: 2026-11-06 · Agent: Claude Code subagents (general-purpose), model Opus 5.5 · n = 1 per run
- Fixtures: `tests/fixtures/web-app` (Vite 8, React 19.3, Tailwind v4, motion 14; planted UX problems)
  and `tests/fixtures/expo-onboarding` (Expo SDK 58, RN 0.88, Reanimated 4.7)
- Each run worked on its own copy under `/tmp/uiux-runs/<id>`. It made real edits, ran builds and
  took screenshots. Shared prompt: harness context in `PROMPT_COMMON.md` (recorded below), then the
  user request verbatim.
- Environment: macOS, Node 20 (Node 24 via nvm for Expo), Chrome, Xcode 26.6 with an iOS 26.5
  simulator, no Flutter, no device-automation tool.
- Skill availability: `impeccable` installed normally (Skill tool). Emil, UUPM, Lucian, GSAP, Taste and
  Vercel were provided as cloned folders and activated by reading their SKILL.md (the "no skill tool"
  path).
- Author checks: diffs and hashes inspected, and key screenshots viewed independently.

## Round 1 (skill v0.2.0 + briefs)

| Run | Request | Route taken | External skills actually run | Result | Evidence | Status claimed (checked) |
|---|---|---|---|---|---|---|
| R1 | Redesign settings, "consistent" | redesign / Refresh | `vercel/web-design-guidelines` (fetched live, applied) | Strong redesign; token use fixed dark mode; dialog for delete; validation | L1, L2, L3 scripted, L4 before/after (author viewed) | Passed with limitations ✔ |
| R2 | Review dashboard, no edits | review (took the fast path) | none | 13 located findings with severity; excellent | L0 + L4; **source hash unchanged (author verified)** | Passed ✔ |
| R3 | Plan name cut off | bug-fix, fast path | none | Root cause `w-28 nowrap`; 2-class fix; found the bug at all widths | L1, L2, measured clipping before/after | Passed ✔ (diff verified) |
| R4 | FAQ abrupt | animation (took the fast path) | none | CSS `grid-rows` accordion; chose CSS over unused Motion after measuring +46.6 KB | L1, L2, L3, rAF frame trace | Passed with limitations ✔ |
| R5 | Proper OTP input | design / implement | **`lucian/uxui`**: search, get #026, tokens, port with MIT header | Native-input-overlay OTP; paste/autofill; states; fluid sizing | L1, L2, L3, L4 (author viewed error state) | Passed with limitations ✔ |
| R6 | Usage chart, "pick the right one" | design (took the fast path) | none (UUPM skipped) | Column chart, tokens, SR table | L1, L2, L4 (author viewed) | Passed with limitations ✔ |
| R8 | Landing page (routing probe) | design, Persuade | Taste **eliminated** on a real prerequisite check (Node 20; Node 24 via nvm noted); Impeccable launcher run | Driver = `impeccable/new-work`; Vercel as independent reviewer | n/a (plan only) | n/a |

**Round 1 diagnosis.** The output quality was high, but the orchestrator under-used specialists:

- The fast path absorbed a review (R2), an animation (R4) and an explicit design-judgment request (R6).
- R1 skipped `impeccable/critique` because the problems were "obvious".

Agents also reported ambiguities:

- read-only vs. build artifacts;
- unused library vs. bundle cost;
- missing-backend behavior;
- Impeccable new-work prerequisites;
- nvm runtimes;
- chart slot;
- user framing narrower than the defect;
- landing page vs. app shell.

## Fixes applied between rounds

- **Fast path:**
  - eligible only for bug-fix/improvement, with no design judgment asked, Small/low;
  - checked before the decision engine;
  - reviews never take it.
- **Default-on specialists:**
  - entries with `recommended` + `value_if_missing: high` are used when they survive routing;
  - skipping one needs a concrete reason;
  - a "not a reason" table blocks the common skip excuses;
  - `cost: heavy` entries are default-on only for Medium+ central slots.
- **Registry and routing:**
  - new `data-visualization` slot;
  - an unregistered skill that is a closer fit takes the slot;
  - environment exclusions respected.
- **Animation tool step:** CSS first for simple state changes; an installed-but-unused library must justify its bundle cost.
- **Execution policy:**
  - read-only allows build outputs and temp/gitignored evidence;
  - missing backend: keep existing no-ops, mark the integration point;
  - "shared" means it has other usages;
  - a new-route layout branch is additive.
- **Registry briefs and limitations:**
  - Impeccable new-work prerequisites (init interview, network concept seeding, local server);
  - critique contract (A/B sub-agents, skips, "Questions skipped" close);
  - `impeccable detect` source scans are pattern-only;
  - Taste runtime/Chrome checks;
  - UUPM authority on data visualization.
- **Conflict rulings:**
  - skill fidelity vs. layout fit;
  - tokens failing floors (derive from tokens, ask for the token fix);
  - workflow rule vs. skill recipe.
- **Other:**
  - driver ≠ reviewer in the review step;
  - handoff records optional for single-agent Small/Medium;
  - bug fixes cover the wider real cause.

## Round 2 (after fixes)

| Run | Request | Route taken | External skills actually run | Result | Status |
|---|---|---|---|---|---|
| P | A: review dashboard · B: FAQ smooth · C: chart pick (probe) | All three **correctly excluded from the fast path** by condition 1/2 | A → `impeccable/critique` planned; B → `emil/animate` decision record; C → **`uupm/search --domain chart` run twice** (returned Line chart) | Routing matched `tests/archive/expected-routing` intent | n/a (plan only) |
| R1b | Redesign settings (re-run) | redesign / Refresh | **`impeccable/critique`** via the Skill tool, with its Assessment A and B sub-agents; **`impeccable/audit`** as a different-evaluator review; `impeccable detect` (source + URL) | Found issues R1 missed: Help promises a nonexistent Billing section; the Switch off-state is 1.27:1; iOS zoom on 14px inputs; the 2FA flow needs set-up | **Passed with limitations** (L1, L2, L3, L4, detector before/after) |
| R7 | Expo onboarding animation | animation / improve | **`emil/animate-expo`** (SKILL.md + 3 RECIPES sections) | Reanimated 4 CSS transitions; directional step swap; sliding indicator; 0.97 press; reduced-motion path | **Passed with limitations**: L1, L2 (`expo export`), interaction/frames via a react-native-web render; **native iOS not observed** (Expo Go prompt can't be confirmed without a tap tool) |

The probe exposed a conflict between the built-in chart table (column) and UUPM (line); the table
was corrected. R1b's first attempt stalled while waiting on critique's sub-agents. With the updated
brief and a follow-up instruction it completed. R7 surfaced three more fixes, all applied:

- `npx expo lint` auto-installs ESLint;
- a react-native-web fallback for evidence;
- an Expo web hydration pitfall with `entering` animations under reduced motion.

## Integration status after Phase 3

| Provider / skill | Exercised for real? | How | Notes |
|---|---|---|---|
| Impeccable `critique`, `audit`, `detect`, context launcher | ✅ | R1b, R8 (Skill tool) | heavy; `cost: heavy` + brief added |
| Impeccable `new-work` | ⚠️ routed only | R8 plan | prerequisites recorded from its reference files |
| Lucian `lucian-uxui` | ✅ | R5 (network, CLI) | port deviation (fluid width) per new ruling |
| Vercel `web-design-guidelines` | ✅ | R1 (live fetch via curl) | |
| Emil `animate-expo` | ✅ | R7 | |
| Emil `animate` | ⚠️ decision record only | P | R4 built the animation without it (round 1 fast path) |
| UI UX Pro Max `search` | ✅ | P (2 chart queries) | `--design-system` not exercised (no project without a system) |
| Taste | ⚠️ prerequisite check only | R8 | eliminated correctly: Node 20 default; kit conflicts |
| GSAP | ❌ | — | no scenario justified it (installed-library rule) |
| Expo, Software Mansion, Callstack, Android, SwiftUI Pro | ❌ | — | not installed in this environment |

## Observed metrics (n = 1 per run; behaviour, not rates)

- Builds and typechecks of the final states: pass in every execution run (R7: only pre-existing template errors).
- Out-of-scope changes: none in R1/R1b/R3–R6. R2 left source unchanged (hash verified). R1b edited
  `Switch`/`Field` after confirming they had no other usages.
- Unnecessary skill invocations: 0 in both rounds. Under-use of specialists in round 1: 4 of 6
  execution runs. Round 2: 0 of 3.
- Status honesty: every claimed status matched the evidence the author could check. R7 explicitly
  declined native-evidence claims.

## Incidents

- The first Expo launch installed Expo Go on the user's booted iPhone 17 Pro Max simulator instead of
  the intended test simulator. A `boot` of the test device had failed silently. The author
  uninstalled it immediately. A rule now requires explicit UDIDs and forbids installing on devices
  the user is using.
- R7's `npx expo lint` auto-installed ESLint into its temp copy (`/tmp/uiux-runs/R7`, not a user
  project). A rule was added.
