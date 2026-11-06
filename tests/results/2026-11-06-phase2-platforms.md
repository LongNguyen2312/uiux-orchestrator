# Phase 2 platform-file run

- Date: 2026-11-06 · Agent: Claude Code subagent, model Opus 5.5 · n = 1
- Input: `tests/archive/phase2-scenarios.md` (P1 Expo SDK 58 swipe-to-delete, P2 SwiftUI bars/sheets
  after Xcode 27, P3 Flutter grid→detail with Android back), skill at v0.2.0-pre
- Scored by hand

## What the platform files changed (behaviour observed)

| # | Version-gate knowledge applied | Correct? |
|---|---|---|
| P1 | Gesture Handler v3 hooks (not the v2 builder); Reanimated 4 `scheduleOnRN`; velocity-carrying spring; haptic at the threshold; tap alternative via accessibility action; no dependency or navigation changes | ✅ (it guessed `ReanimatedSwipeable` exists; it does, and the file now says so) |
| P2 | Diagnosed Liquid Glass forced by the Xcode 27 build as the root cause; gated `toolbarBackground`/`presentationBackground` with an availability check, because the deployment target is iOS 17; reported, without fixing, an out-of-scope dark-mode issue | ✅ |
| P3 | Kept the default page so `PredictiveBackPageTransitionsBuilder` stays; `Hero`; reduced-motion path; router and imports untouched | ✅ |

Unnecessary invocations: 0. Workflow choices: animation (P1, P3) and bug-fix (P2), both correct.

## Gaps found and fixed

1. RN file didn't mention Gesture Handler's ready-made `ReanimatedSwipeable` (checked: present in
   3.5.0) or that Reanimated 4 requires `react-native-worklets`. → added.
2. `animate-expo` and `swm/react-native-best-practices` were described as a pair, but the registry
   had no `complements` link between them. → added.
3. iOS: the conflict ladder (project truth above platform) seemed to argue for keeping old bar fills.
   → added a standing ruling: customizations of an old system look are not brand truth; gate by OS
   availability. Opt-out key name recorded as unverified.
4. Flutter: missing `transitionOnUserGestures`, `HeroMode`, the same-Navigator limitation, and the
   warning that `CustomTransitionPage` replaces the predictive back transition. → added.

## Facts the test agent doubted (from its training memory), re-checked

- Flutter's default Android transition is `PredictiveBackPageTransitionsBuilder`: confirmed on
  docs.flutter.dev breaking-changes page (fetched 2026-11-06).
- `material_ui` package: confirmed on pub.dev (1.10.0, publisher flutter.dev).
- Xcode 27 removing the old-design opt-out: from WWDC26 session 102 per the research agent; not
  re-fetched by the author.
