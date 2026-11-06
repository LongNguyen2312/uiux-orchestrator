# Triggering and project detection — real-environment tests

- Date: 2026-11-06
- Skill: v0.6 candidate (after the pre-release review fixes)
- Machine: the author's macOS machine with its real skill set (Impeccable, Anthropic design plugins,
  dataviz, superpowers, agent-device, …)

## 1. Does the skill trigger on its own? (`claude -p`, real install)

The skill was symlinked into `~/.claude/skills/` for the test and removed afterwards. Each prompt
ran with `claude -p` in a copy of the web fixture or the Expo fixture.

The agent was **not** told about the skill. Tools were limited to Skill, Read, Glob and Grep, with
4 turns maximum, so nothing could be edited. Script: `triggering/run.sh`; parsed results:
`triggering/summary.json`.

| # | Prompt | Expected | First skill invoked | Verdict |
|---|---|---|---|---|
| T01 | Redesign the settings page… consistent with the existing app | orchestrator | `uiux-orchestrator` | ✅ |
| T02 | FAQ opens abruptly; make it smooth | orchestrator | `uiux-orchestrator` | ✅ |
| T03 | Review the dashboard; do not modify code | orchestrator | `uiux-orchestrator` | ✅ |
| T04 | Plan name cut off on small phones; fix it | orchestrator or none | none (fixed directly) | ✅ acceptable: an evident local bug, which the orchestrator would also send down the fast path |
| T05 | Add the usage chart and pick the right chart type | orchestrator or a chart skill | `dataviz` | ✅ acceptable: a closer fit, the same pick the orchestrator's closer-fit rule makes |
| T06 | (Expo) improve the onboarding animation | orchestrator | `uiux-orchestrator` | ✅ |
| N01 | Add a unit test for useHashRoute | none | none | ✅ |
| N02 | Update the README | none | none | ✅ |
| N03 | `/impeccable critique src/pages/Settings.tsx` | not the orchestrator | none (slash command handled directly) | ✅ |
| N04 | npm ERESOLVE error | none | none | ✅ |

Result: 4/6 UI prompts triggered the orchestrator, and the other 2 went to a reasonable alternative.
There were 0/4 false triggers.

Each prompt ran once, on one model, in one environment.

## 2. Project detection from real files

There are 8 file-only fixtures in `tests/fixtures/detect/` (answer key:
`tests/fixtures/detect-expected.json`, outside the fixture folders):

1. Next.js + shadcn
2. UIKit-only iOS
3. Android Views + Material Components
4. RN CLI 0.74 on the old architecture
5. Flutter `CupertinoApp`
6. A monorepo with a Vite web app and an Expo SDK 58 app (the request targets the mobile app)
7. Expo SDK 52 with `newArchEnabled: false`
8. Angular Material

Two agents ran in opposite orders. Each followed stages 1–2 of the skill, reading only inside each
fixture. Raw output is in `results/detect-A.json` and `results/detect-B.json`.

| Field | Correct |
|---|---|
| Platform (profile enum) | 16/16 |
| Framework (e.g. UIKit not SwiftUI, Views not Compose, Cupertino, Angular) | 16/16 |
| New Architecture flag (d4 off, d6 on, d7 off) | 6/6 |
| Monorepo target package (d6 → apps/mobile) | 2/2 |
| Motion stack and Reanimated generation where present | 8/8 |

The runs also found gaps in `core/project-intelligence.md`, which have since been fixed:
- Expo Router in `src/app/` and `main: expo-router/entry`;
- an explicit New Architecture flag overrides the default, and Android and iOS can disagree;
- Material 2 vs. 3 on Views is decided by the theme parent;
- Vue, Svelte and Angular motion signals and where Angular Material keeps its theme;
- `CupertinoThemeData`;
- lockfiles are the version source;
- how to find packages in a monorepo;
- `unknown (<why>)` for facts the files don't show;
- extra architecture flags that gate APIs (deployment target, targetSdk, GH/Reanimated generation).

Caveat: the fixtures are small and the author wrote them. Real repositories are noisier.
