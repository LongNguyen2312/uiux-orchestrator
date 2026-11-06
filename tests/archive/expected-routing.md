# Expected routing — Phase 0 scenarios (S1–S8)

The scenarios are in `phase0-scenarios.md`. "Optional" means picking it is acceptable but not
required. Anything else that gets invoked counts toward the unnecessary-invocation metric.

| ID | Intent / workflow | Must select | Optional | Must NOT select | Pass criteria |
|---|---|---|---|---|---|
| S1 | Animation, *improve* sub-type · Medium | `emil/animate-expo` (or `expo/expo-animation`, but not both), **with Reanimated 3 / old-arch API translation noted** | `emil/improve-animations` (if the flow is large) | `swm/react-native-best-practices` (needs New Arch), `emil/animate`, `emil/mobile-native`, `gsap/*`, Taste, Lucian code | No Reanimated 4 / New Arch upgrade without asking. Reduced motion is checked. Device/release-build feel is listed as a limitation if it can't be checked. |
| S2 | Redesign **Refresh** · Medium | `impeccable/critique` (audit-current), with refinement semantics | `impeccable/polish`, `impeccable/layout`, `uupm/search` (one domain query), `vercel/web-design-guidelines` | `impeccable/new-work`, `uupm/design-system`, `taste/*`, `gsap/*`, `lucian/uxui` | Existing tokens and shadcn components kept. No driver. Before/after L4. |
| S3 | Review, read-only | `impeccable/critique` | `impeccable/audit` (native variant), `twostraws/swiftui-pro` | any build or motion skill, `vercel/web-design-guidelines`, `emil/break-ui` | No edits. Findings have severity, location, impact and a fix. The report says whether it is based on code or on rendered UI. |
| S4 | Bug fix · Small | none | — | every design skill | Root cause in one line. Minimal fix. Checked at 320dp and font scale 2.0. |
| S5 | New design (Persuade) · Large | exactly one driver: `taste/design-taste-frontend` (prerequisites and kit confirmed) or `impeccable/new-work` | `lucian/uxui` for one part | two drivers; `uupm/design-system` next to a driver; `gsap/*` (no need) | Driver prerequisites checked. Taste's HTML-kit vs. Next.js mismatch handled explicitly. |
| S6 | Animation, build · Small/Medium | none (Flutter: built-in + `ref/flutter-animation`) | — | `gsap/*`, `emil/animate`, `emil/animate-expo`, `lucian/uxui` | `Hero` + go_router `CustomTransitionPage`. Reduced motion via `MediaQuery.disableAnimations`. |
| S7 | Improvement · Small (fast path) | none | — | every skill | Token changed in one place. Contrast checked. All button states checked. |
| S8 | Animation, build · Medium | `emil/animate` (or built-in tool ladder) with framer-motion kept | `emil/animation-performance`, `emil/choreograph` | `gsap/*` (unless the existing library is shown to be insufficient, and only with permission) | No new dependency. Reduced-motion path. Scroll-linked motion on transform/opacity/pathLength. |
