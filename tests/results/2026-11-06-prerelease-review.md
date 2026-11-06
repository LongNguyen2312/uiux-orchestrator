# Pre-release review (v0.5 → v0.6)

Date: 2026-11-06. There were two independent reviewers, fresh agents given only the files:
- **coherence:** contradictions, drift, vagueness, load order, scripts, spec;
- **brief compliance:** each requirement and each of the 15 success criteria, judged against evidence.

The author spot-checked every High finding before fixing it.

## Findings and resolution

| Finding (reviewer) | Verified? | Resolution in v0.6 |
|---|---|---|
| Default-on rule overrode workflow Small rules and "Small → 0 slots"; order vs. outcome test unclear (coherence H1) | yes | decision-engine §2 rewritten: outcome test first, default-on as a presumption with explicit exceptions; missing `cost` = light |
| Driver choice stated 4 times; authority tie-break not computable (H2) | yes | One driver table (decision-engine §4); others point to it; tie-break = row order in the slot index |
| "One skill per slot" vs. multi-evaluator reviews (H3) | yes | `critique` split into `ux-critique`, `tech-audit`, `platform-conformance`, `code-review` |
| Scripts reported "clean" on a failed load; no timeouts; Chrome could leak (H4) | yes (reproduced) | Fails on net errors, HTTP ≥ 400 and timeouts; per-call timeouts; cleanup on every path and on signals; profile removed after Chrome exits |
| Profile platform ids ≠ registry ids; `frameworks` undefined (M1) | yes | Matching ids defined in skill-registry; `validate.py` checks platform and framework ids |
| 9 registry entries unreachable from the shortlist (M2) | yes | Slot index moved to decision-engine §3 and enforced both ways by `validate.py` |
| Driver needs a project write the policy forbids (M3) | yes | One permission line in the question batch; next driver row if nobody answers |
| Animation tool order stated differently (M4) | yes | `workflows/animation.md` canonical; others point to it |
| No fallback for non-interactive agents (M5) | yes | SKILL.md hard rule: safe default, else plan + `Needs review` |
| `npx impeccable detect` could install (M6) | yes | Uses Impeccable's own launcher |
| Script output not marked untrusted (M7) | yes | SKILL.md hard rule |
| Gates duplicated; "L1–L2" ambiguous (M8) | yes | Workflow files canonical; "L1 + L2" |
| Evidence levels needed before stage 5 (M9) | yes | One-line L0–L5 summary in SKILL.md |
| `--help` crashed; `--full` captured viewport only; root sandbox (Low) | yes | Fixed and verified (full page 523 px vs. 400 px viewport) |
| 4 of the brief's 12 decisions not in the plan (compliance) | yes | Execution Plan now has `investigation_depth`, `platform_guidance`, `a11y_audit`, `validation_tools` |
| Registry metadata the brief requires was sparse (compliance) | yes | All 63 entries have `required_inputs`, `expected_outputs` and `capabilities`, enforced by `validate.py` |
| Triggering never tested (compliance #1) | — | Tested for real with `claude -p`: 4/6 triggered, 2 reasonable alternatives, 0/4 false triggers |
| Platform detection never tested from files (compliance #4) | — | 8 file fixtures × 2 runs: 16/16 |
| No native mobile evidence (compliance #2) | — | R7b: native iOS L4 frames via agent-device |
| Other agents untested (compliance #9) | — | Codex CLI 0.166: auto-triggered, read-only review, a real fix, a plan with the v0.6 fields |
| Benchmarks not re-run on the current version (compliance #3) | — | Full 39 + 8 re-run on v0.6 (below) |
| Freshness of verified facts (compliance #10) | — | `validate.py` warns after 180 days; superseded test sets archived |

Not done, and why:
- **External scenario authors** (compliance #6): needs people outside this project.
- **Flutter execution:** the user declined installing the Flutter SDK.
- **Real Large/high-risk multi-agent execution run** (compliance #8): the policy has been exercised in routing runs only.

## Re-run on v0.6

| Run | Skill selection | Unnecessary | Notes |
|---|---|---|---|
| Full main set, v0.6.0-pre (rep4, n=39, key v3) | 95% | 6% | 2 real regressions from the slot split: S38 (no Android platform-conformance candidate) and H06 (animate-expo missing from motion-performance) |
| Same, scored with key v4 | 97% | 0% | Key v4 accepts integrations newer than the original key (S29, S04, S32, S31; listed in `answer_key_changes_v4`) |
| Held-out, v0.6.0-pre (n=8) | 88% | 0% | H06 regression |
| **Verification after the 2 fixes, v0.6.0** (11 affected/neighbouring scenarios × 2 orders) | **100%** (22/22) | 1 pick, accepted by key v4 | S38 and H06 fixed |

Remaining variance: S31 (high-risk plan confirmation) was asked in rep3 but not in rep4, and was asked in
both verification runs.
