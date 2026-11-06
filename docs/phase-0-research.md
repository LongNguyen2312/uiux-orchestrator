# Phase 0 — Research & Architecture

Status: complete · Researched: 2026-11-06 · Author: maintainers of `uiux-orchestrator`

Everything below was checked against the source repositories cloned on the research date
(commit shown). Nothing is inferred from a README alone when the SKILL.md disagrees; where a
claim could not be verified it is marked **unverified**.

---

## 1. Repository inspection

The working directory was empty (no git history, no files). Nothing had to be preserved.

## 2. Agent Skills specification (agentskills.io, `agentskills/agentskills` @ main)

Constraints that shape this project:

| Rule | Consequence for us |
|---|---|
| `name` 1–64 chars, `[a-z0-9-]`, no `--`, **must match the parent directory** | Skill lives in `skills/uiux-orchestrator/` with `name: uiux-orchestrator`. |
| `description` ≤ 1024 chars, says what + when | Description is the only Layer-1 text every agent sees; it carries the triggers. |
| Optional: `license`, `compatibility` (≤ 500), `metadata` (string→string), `allowed-tools` (experimental) | We use `license`, `compatibility`, `metadata.version`. No `allowed-tools` (agent-specific). |
| Body < 5000 tokens recommended, < 500 lines | SKILL.md is a hub: pipeline + routing table + load map. Detail lives in one-level-deep files. |
| File references one level deep from SKILL.md | SKILL.md links every core/workflow file directly; supporting files do not chain into each other except to `registry/skills.yaml`. |
| Progressive disclosure: metadata → instructions → resources | Mirrors the orchestrator's own three loading layers (§8). |

Agent-specific extensions observed in the wild (not part of the spec, must not be relied on):
`disable-model-invocation`, `user-invocable`, `argument-hint`, `version` at top level. We read them
when present (they change *how* a skill may be invoked) but never require them.

**Decision:** ship the skill under `skills/uiux-orchestrator/` so that repository-level material
(README, docs, tests, benchmark) is never installed into a user's skill directory and never costs
context.

## 3. Skill research — what each source actually is

| Source | Commit | Form | What it really contains |
|---|---|---|---|
| UI UX Pro Max `nextlevelbuilder/ui-ux-pro-max-skill` | b7d5353 | Skill `ui-ux-pro-max` + 6 sibling skills (`design`, `design-system`, `ui-styling`, `brand`, `banner-design`, `slides`) | A **searchable local database** (CSV) driven by `scripts/search.py` (Python 3, no deps): 80 styles, 192 product palettes + reasoning rules, 74 font pairings, 119 UX guidelines, 105 icons, 17 GSAP presets, 25 chart types, 22 stack guides (incl. `swiftui`, `react-native`, `flutter`, `jetpack-compose`; **no UIKit or Android Views**). Modes: `--design-system` (full direction), `--domain <x>` (one concern), `--stack <x>`. `--persist` writes `design-system/<slug>/MASTER.md`; refuses to overwrite without `--force`. Explicit "0 results → do not fabricate" rule. |
| Taste `Leonxlnx/taste-skill` | 9b4bf93 (v2.5.0, 2026-11-05) | One skill, install name `design-taste-frontend` | **Not a general visual-direction skill any more.** 2.5.0 is a full pipeline for **professional company / marketing websites** (landing, SaaS, product, shop, cafe, hotel, game site). Ships its own kit (`starter.html`, `system.css`, layouts, photos, icons, effects) that it copies into the project, "deals" palettes/fonts/heroes from history files, and enforces >100 browser checks (`consistency.mjs`, `check.mjs`, `perf.mjs`). Needs Node 22+ and Chrome/Edge/Chromium. Hard house rules (no captions, no scroll reveals, never violet, one section per screen). Older variants (`minimalist-ui`, `high-end-visual-design`, …) moved to `Leonxlnx/taste-skill-classics`. No guidance for app UI, dashboards, or native. |
| Lucian `Seokwoooo/lucian-uxui-prompt` | 7e339fa | **Reference library** (400 HTML/CSS/JS elements, `@meta` + `@demo` headers, `--ux-*` tokens) + companion **skill** `Seokwoooo/lucian-uxui` | 001–200 interface parts, 201–400 website sections & motion. The skill's CLI (`node scripts/lucian-uxui.mjs search|get|tokens`, needs network to lucianlabs.dev or GitHub raw) fetches elements; rules: never invent IDs, keep the MIT header line, port structure and motion values as-is, adapt framework/data/colors. **Web-only code**; for native, the interaction specs (detents, springs, durations) are usable as reference, the code is not. |
| Impeccable `pbakaus/impeccable` | c3bb418 (v4.8.0) | One skill `impeccable` with ~24 sub-commands | A complete design-direction system with its own context files (`PRODUCT.md`, `DESIGN.md`, surface briefs), a launcher (`scripts/impeccable context`, self-contained binary downloaded on first run), a detector hook, and *modes* (Persuade / Operate / Read / Experience). Commands verified: `shape, init, document, extract, critique, audit, polish, bolder, quieter, distill, harden, onboard, animate, colorize, typeset, layout, delight, overdrive, clarify, adapt, optimize, live, generate` (+ `craft` deprecated). **Native variants exist** for `audit` and `adapt` and platform files `ios.md`, `android.md` (cover SwiftUI, UIKit, Compose, Views, RN, Expo, Flutter). No argument → shows a menu, never auto-runs. Also a CLI: `npx impeccable detect <dir|url>`. |
| GSAP `greensock/gsap-skills` | aed9cfd | 8 official skills | `gsap-core, gsap-timeline, gsap-scrolltrigger, gsap-plugins, gsap-react, gsap-frameworks (Vue/Svelte), gsap-performance, gsap-utils`. All plugins are free (post-Webflow). Descriptions **self-promote** ("recommend GSAP … when no library is specified") — this collides with the cheapest-tool-first rule in Emil's `animate`. Web only. |
| Emil Kowalski `emilkowalski/skills` | c8a7962 | 17 skills | See §3.1. |

### 3.1 Emil Kowalski skills — verified names and scope

| Requested name | Exists? | Actual scope (from SKILL.md) | Invocation |
|---|---|---|---|
| `animate` | yes | Build a **web** animation from scratch. Tool ladder: CSS transition → `@starting-style` → CSS animation → WAAPI → Motion. Delegates components to `pick-ui-library`. Does not mention GSAP. | model |
| `animate-expo` | yes | RN/Expo motion with **Reanimated 4 + react-native-worklets, Gesture Handler, Expo Router, expo-haptics**. States "Reanimated 4 requires the New Architecture". APIs like `scheduleOnRN` do not exist in Reanimated 3. | model |
| `review-animations` | yes | Strict motion review, "default to flagging". | **user-only** (`disable-model-invocation: true`) |
| `improve-animations` | yes | Codebase-wide motion audit → prioritized plans. **Read-only.** | model |
| `find-animation-opportunities` | yes | Where motion is missing; **read-only**, proposes exact values. | model |
| `animation-vocabulary` | yes | Glossary: vague description → term. Naming only. | model |
| `apple-design` | yes | Apple fluid-motion & HIG principles **translated for the web**. | model |
| `mobile-native` | yes | Making a **web app** feel native on phones (100vh, tap highlight, safe areas). **Not** for native or RN apps. | model |
| `emil-design-eng` | yes | Umbrella philosophy (676 lines): animation decisions, component polish. Overlaps most of the others. | model |
| — extra | `choreograph`, `animation-performance` (web), `remove-animations`, `break-ui`, `pick-ui-library` (user-only), `prototype` (user-only), `ask-sonner`, `write-swift` (language, not UI) | | |

### 3.2 Additional sources evaluated (§4.2 of the brief)

Kept only where a distinct role was found.

| Source | Kept? | Role |
|---|---|---|
| `expo/skills` (official) | **yes** | `expo-native-ui` (HIG-styled Expo screens), `expo-design-system`, `expo-ui` (@expo/ui real SwiftUI/Compose controls), `expo-router`. `expo-animation` is **the same content as Emil's `animate-expo`** (credited) → registered as an alias, never both. |
| `software-mansion-labs/skills` | **yes** | `react-native-best-practices` umbrella with `animations` (Reanimated 4, Skia, layout & scroll-driven animation) and `gestures` (RNGH) references — first-party for the libraries themselves. |
| `callstackincubator/agent-skills` | **yes (validation)** | `agent-device`: drives iOS simulators/Android emulators, screenshots, taps → fills the mobile visual-validation gap. `react-navigation` for nav UI. |
| `android/skills` (official) | **yes** | `adaptive` (window size classes), `edge-to-edge`, `navigation-event` (predictive back), `jetpack-compose-performance`, `migrate-xml-views-to-jetpack-compose`. |
| `vercel-labs/agent-skills` | **yes (review)** | `web-design-guidelines` (fetches Vercel Web Interface Guidelines, terse `file:line` review), `vercel-react-view-transitions`. |
| `twostraws/SwiftUI-Agent-Skill` (`swiftui-pro`) | optional | SwiftUI code-quality review (APIs, performance). Not a design skill. |
| Flutter | **no skill kept** | No official Flutter agent skill exists (checked `flutter/*`). Community repos are rule dumps without a distinct role. Flutter is served by the orchestrator's own platform reference + flutter.dev docs. |
| Rive | **no skill** | No maintained agent skill found; Rive stays a reference entry (official docs) for state-machine illustration/animation. |
| Accessibility | **no extra skill** | Covered by Impeccable `audit`, UUPM `ux` domain, Vercel guidelines, and the orchestrator's own WCAG reference. A dedicated skill added nothing distinct. |

## 4. Integrate directly vs. use as reference

| Source | Integration class | Why |
|---|---|---|
| UI UX Pro Max `ui-ux-pro-max` | **Specialist (direct)** | Narrow, queryable, deterministic; safe to call for one concern. Its siblings (`design`, `brand`, `banner-design`, `slides`) are out of scope (logos, CIP, banners, decks) → not registered. |
| Taste `design-taste-frontend` | **Driver (direct, narrow)** | Owns an entire marketing-site build. Only routed for *web marketing/company pages*, greenfield or full redesign, when the project can host its kit. Never for app UI, dashboards, native. |
| Lucian `lucian-uxui` | **Specialist (direct)** for web; **reference** for native | Component/interaction source. |
| Impeccable | **Driver** (new-work/shape) **and specialist** (single commands) | Its commands are individually addressable; the orchestrator calls one command per need. |
| GSAP skills | **Specialist (direct)**, web only | Called only after the motion tool decision picks GSAP. |
| Emil skills | **Specialist (direct)**; `review-animations`, `pick-ui-library`, `prototype` are **user-invoked only** → recommended, never auto-run | |
| Expo / SWM / Callstack / Android / Vercel | **Specialist** | Platform-first-party knowledge. |
| Apple HIG, Material 3, RN, Expo, Flutter, WCAG, platform animation docs | **Reference** | Knowledge, not procedures. |

## 5. Capability matrix

Legend: ● primary authority · ◐ capable, secondary · ○ touches it, not recommended for it · blank = no.
Platforms: W web · RN React Native/Expo · iOS · And Android · Fl Flutter.

| Capability | UUPM | Taste | Lucian | Impeccable | GSAP | Emil | Expo/SWM | Android official | Vercel |
|---|---|---|---|---|---|---|---|---|---|
| Product / UX analysis | ◐ (product types, UX rules) | ○ (business kind) | | ● `shape`, `critique` | | | | | |
| Visual direction (app UI) | ● `--design-system` | | | ● new-work (Operate mode) | | ○ | ◐ `expo-native-ui` (RN) | | |
| Visual direction (marketing web) | ◐ | ● (driver) | | ● new-work (Persuade mode) | | | | | |
| Design system / tokens | ● MASTER.md | ○ (own kit) | | ● `document`, `extract` | | | ◐ `expo-design-system` | | |
| Typography | ● font pairings | ◐ (dealt) | | ● `typeset` | | ◐ `apple-design` | | | |
| Color | ● palettes | ◐ (dealt) | | ● `colorize` | | | | | |
| Layout / hierarchy | ◐ | ● (marketing) | | ● `layout` | | | | ◐ `adaptive` | |
| Component patterns | ◐ (guidelines) | ◐ (sections) | ● (400 elements, web) | ○ | | ◐ `pick-ui-library` | ◐ `expo-ui` | | |
| UX copy | | ◐ (copy.md) | | ● `clarify` | | | | | |
| Edge cases / hardening | | | | ● `harden` | | ● `break-ui` | | | |
| Responsive / adaptive | ◐ | ◐ (4 widths) | | ● `adapt` (+native) | | ◐ `mobile-native` (web on phones) | | ● `adaptive`, `edge-to-edge` | |
| Motion discovery | | | | ◐ `animate` | | ● `find-animation-opportunities` | | | |
| Motion design + impl (web) | ○ (GSAP presets) | ○ (hover layer) | ◐ (values in elements) | ◐ `animate` | ● (complex/scroll) | ● `animate`, `choreograph` | | | ◐ view transitions |
| Motion impl (RN) | | | | ○ | | ● `animate-expo` | ● SWM `animations`, `gestures` | | |
| Motion impl (iOS/And/Fl) | | | | ○ | | ◐ `apple-design` principles | | ◐ `navigation-event` | |
| Motion review | | | | ◐ | ◐ `gsap-performance` | ● `review-animations`*, `improve-animations` | | | |
| Motion removal | | | | ◐ `quieter`, `distill` | | ● `remove-animations` | | | |
| Animation performance | | | | ◐ `optimize` | ● (GSAP) | ● `animation-performance` (web) | ● SWM | ● `jetpack-compose-performance` | |
| Design critique | ◐ | | | ● `critique` | | ◐ `emil-design-eng` | | | ● `web-design-guidelines` |
| Technical audit (a11y, perf) | ◐ | ◐ (checker, marketing) | | ● `audit` (+native) | | | | | ● |
| Final polish | | | | ● `polish` | | ◐ | | | |
| Visual validation tooling | | ● (own headless checks) | | ◐ `live`, `detect` | | | ● Callstack `agent-device` (mobile) | | |

\* user-invoked only.

## 6. Overlaps (and who owns each)

| Overlap | Skills involved | Resolution |
|---|---|---|
| Whole-surface design pipeline | Impeccable new-work, Taste, UUPM `--design-system` | **One driver per surface.** Marketing web greenfield → Taste *or* Impeccable (Persuade); app UI → Impeccable (Operate) or UUPM; existing design system → neither drives, the project does. |
| Web animation build | Emil `animate`, Impeccable `animate`, GSAP | Emil `animate` decides *whether/what/which tool*; GSAP only executes when the tool decision is GSAP; Impeccable `animate` only when Impeccable is already driving the surface. |
| RN animation | `animate-expo` ≡ `expo-animation`, SWM `animations` | `animate-expo` (or its alias) for feel and decisions; SWM for library-level API detail (Skia, layout animations). Never load both copies of the Emil content. |
| Critique | Impeccable `critique`, Vercel `web-design-guidelines`, `emil-design-eng` | Impeccable for UX/visual critique; Vercel for rule-compliance on web code; Emil only for motion/polish detail. |
| Typography / color | UUPM data, Impeccable `typeset`/`colorize`, Taste dealing | Data selection → UUPM; refining an existing UI → Impeccable; Taste only inside a Taste build. |
| Motion audit | Emil `improve-animations`, `review-animations`, Impeccable `audit` | Codebase-wide → `improve-animations`; one diff/component → `review-animations` (recommend to user) or built-in motion checklist. |
| Emil umbrella | `emil-design-eng` vs. its focused siblings | Prefer the focused sibling; load the umbrella only when no sibling fits. |

## 7. Conflict-resolution mechanism (summary)

Full rules live in `skills/uiux-orchestrator/core/conflict-resolution.md`. The core idea:
a conflict is resolved **per dimension** (color, type, layout, motion, component, copy), not per
skill, using a fixed precedence ladder:

1. The user's explicit instruction in this task.
2. Non-negotiable floors: WCAG 2.2 AA contrast/target size/focus, reduced motion, no data loss.
   (User may override after being told the consequence.)
3. Project truth for anything in scope as *refinement*: existing tokens, components, libraries,
   architecture, brand.
4. Platform conventions (HIG, Material 3, platform navigation and gesture norms).
5. Decisions already recorded in this task's handoff.
6. The skill with domain authority for that dimension (registry `authority` field).
7. Everything else: drop, or record as an option.

Skill **house rules apply only inside the scope that skill owns** (e.g., Taste's "never violet"
cannot override a violet brand; it disqualifies Taste for that project instead).

## 8. Final architecture

```text
User request
   │
   ▼
[1] Intake ─ intent(s), objective, scope, constraints, mutation permission, complexity, risk
   │
   ▼
[2] Project Intelligence ─ platform, framework, styling, tokens, components, motion stack,
   │                        nav/state, commands, visual tooling → Project Profile
   ▼
[3] Decision Engine
   ├─ compose workflow from step library (workflows/*.md)
   ├─ decompose into capability slots; drop slots that would not change the outcome
   ├─ route each slot: compatibility filter → policy filter → availability → authority → 1 pick
   │      (registry/skills.yaml, read only shortlisted entries)
   ├─ pick at most ONE driver per surface
   └─ choose execution mode (single agent / sequential review / multi-agent)
   ▼
[4] Execution ─ stages pass Handoff records (core/handoff.md); skills loaded progressively
   ▼
[5] Validation ─ evidence levels L0–L5, visual loop, quality gate per workflow
   ▼
[6] Report ─ what, which skills and why, changes, evidence, limitations
```

Design choices and their reasons:

- **Markdown + one YAML registry, no runtime.** Every target agent can read files; none needs a
  server. A tiny validation script is planned only for CI (registry schema lint).
- **Capability slots, not skill lists.** The engine reasons about *what the task needs*; skills are
  plugged into slots via registry metadata, so adding a skill never edits the engine.
- **Provider-qualified ids** (`emil/animate`, `impeccable/animate`): two different skills are named
  `animate`; plugin installs namespace names (`plugin:skill`). The registry stores ids and lists
  every known invocation name per id.
- **Drivers vs. specialists.** Explains and prevents the main failure: two pipelines fighting over
  the same surface.
- **Invocation policy is data.** `disable-model-invocation` skills are recommended to the user,
  never auto-run.
- **Graceful degradation.** Each slot has a built-in fallback (the orchestrator's own references),
  so the orchestrator works with zero external skills.

## 9. Repository structure (adopted)

```text
uiux-orchestrator/
├── README.md · LICENSE · CHANGELOG.md · CONTRIBUTING.md
├── docs/phase-0-research.md          # this file (not installed)
├── skills/uiux-orchestrator/         # the installable skill
│   ├── SKILL.md                      # hub: pipeline, slot table, load map
│   ├── core/
│   │   ├── intake.md                 # intent analyzer + complexity/risk
│   │   ├── project-intelligence.md   # detection signatures, profile template
│   │   ├── decision-engine.md        # slots, routing algorithm, loading, multi-agent
│   │   ├── skill-registry.md         # schema, availability detection, extending
│   │   ├── conflict-resolution.md
│   │   ├── handoff.md                # stage contracts
│   │   ├── execution-policy.md       # non-destructive + dependency + reporting
│   │   └── quality-gates.md          # validation engine + gates
│   ├── workflows/                    # design, redesign, improvement, animation,
│   │                                 # review, bug-fix, design-system, accessibility
│   ├── registry/skills.yaml          # Layer-1/2 metadata for external skills
│   ├── platforms/                    # web, react-native, ios, android, flutter (Phase 2, done)
│   └── references/                   # visual-design, motion-principles, accessibility (Phase 2, done)
└── tests/                            # scenarios, routing expectations, measured results
```

Merged versus the brief's draft: intent + complexity → `intake.md`; skill-routing → part of
`decision-engine.md`; registry data separated from registry schema; validation engine merged
into quality gates (they share evidence definitions).

## 10. Routing examples

Each example lists the slots that survive the "would it change the outcome?" check.

1. **"Improve the animation of the onboarding flow."** — Expo SDK 52, Reanimated 3.16, New Arch
   off. Intent: Animation (improve) · Medium. Workflow: animation (audit → implement → review).
   Slots: motion-audit → `emil/improve-animations` *or* built-in checklist when it's a single flow;
   motion-impl → `emil/animate-expo` **for decisions only**, flagging that its Reanimated 4 APIs
   (`scheduleOnRN`, worklets package) don't apply; use Reanimated 3 equivalents (`runOnJS`).
   Not selected: GSAP, `emil/animate` (web), `mobile-native` (web), Taste. No upgrade to
   Reanimated 4 / New Arch without permission. Validation: dev build on simulator + release-build
   feel check flagged as device-level limitation if no device.
2. **"Redesign the settings page, modern, consistent with the existing app."** — Next.js +
   Tailwind + shadcn. Intent: Redesign (scoped) · Medium. Project truth drives; no new design
   system. Slots: audit current → `impeccable/critique`; direction → constrained by existing
   tokens, so UUPM only for one targeted `--domain ux` query (e.g. settings form grouping) if a
   UX question remains; implementation with existing shadcn components; polish →
   `impeccable/polish`. Not selected: Taste (marketing pipeline), GSAP, UUPM `--design-system`
   (would replace the system), Lucian (shadcn already has the parts).
3. **"Review the checkout screen; don't modify code."** — SwiftUI. Intent: Review · read-only.
   Slots: UX critique → `impeccable/critique` (native platform file); technical/a11y →
   `impeccable/audit` with `audit.native`. Not selected: any implementation or motion skill.
   Output: findings with severity, file:line, impact, fix direction. No edits.
4. **"'Continue' label cut off on 320dp screens. Fix it."** — Compose M3. Intent: Bug fix ·
   Small. **No external skill.** Root cause in code (fixed width / maxLines / no
   `Modifier.weight`), minimal fix, font-scale 200% check, screenshot on a small-width emulator
   or Compose preview. Not selected: Impeccable `adapt` (the bug is understood), UUPM, `android/adaptive`.
5. **"Landing page for our AI code-review dev tool; must not look AI-generated."** — Empty
   repo, Next.js. Intent: New UI design (Persuade) · Large. One driver: **Taste** if Node 22 +
   Chrome are present and the user accepts its kit/house rules, otherwise **Impeccable new-work**.
   Taste's software plan already fits ("code-review tool: a red and green diff"). Supplementary:
   Lucian for one or two interaction elements only if a section needs it. Not selected: UUPM
   `--design-system` (second driver), GSAP (Taste forbids scroll reveals; nothing needs it).
6. **"Smooth transition from product grid to detail."** — Flutter, go_router. Intent: Animation
   · Small/Medium. **No external skill.** Flutter reference: `Hero` + go_router
   `CustomTransitionPage`; Emil timing principles from the built-in motion reference. Not
   selected: GSAP, `animate`, `animate-expo`, Lucian code.
7. **"Change the primary button color from blue to green."** — Vue + Tailwind token. Intent: UI
   improvement · Small. **No external skill.** Change the token once, check contrast of text on
   the new green (AA 4.5:1), check hover/focus/disabled variants derive correctly.
8. **"Pinned scroll storytelling section with an SVG line that draws on scroll."** — React +
   Vite, framer-motion installed. Intent: Animation (new, complex) · Medium. Tool decision:
   framer-motion's `useScroll` + `pathLength` can do it without a new dependency → prefer it;
   GSAP (`gsap-scrolltrigger` + `gsap-react`, DrawSVG) only if pinning/scrub choreography exceeds
   what the existing library handles cleanly, and then ask before adding the dependency.

## 11. Cases where the orchestrator must NOT call a skill

1. **Token or copy one-liners** (color swap, label text, spacing tweak) — a skill call costs more
   than the change and adds nothing.
2. **Bug fixes with a known root cause** (overflow, z-index, clipped text, safe-area inset) — fix
   minimally; no design skill.
3. **Review-only requests** — no implementation, motion-build, or design-system skill; only
   evaluators.
4. **Platform mismatch** — GSAP, Emil `animate`, `mobile-native`, Lucian code, Taste on any
   native/RN/Flutter project; `animate-expo` on a web project.
5. **Project already answers the question** — an established design system means no
   `--design-system` generation, no Taste kit, no Impeccable new-work world replacement.
6. **Second skill for a filled slot** — e.g. UUPM palettes after Impeccable has set the color
   direction for this surface; `emil-design-eng` when `animate` is already loaded.
7. **User-invoked-only skills** (`review-animations`, `pick-ui-library`, `prototype`) — never
   auto-run; mention them to the user when they would add real value.
8. **Skill not installed** — never pretend; use the built-in fallback, mention the skill only if
   it would materially change the result.

## 12. MVP scope and order

| Phase | Deliverable | Exit criterion |
|---|---|---|
| 1 (now) | SKILL.md, core/*, workflows/*, registry/skills.yaml | Spec-valid skill; routing of the 8 Phase-0 scenarios matches expectations in a with-skill run. |
| 2 | platforms/{web, react-native, ios, android, flutter}.md, references/{motion, accessibility, visual-hierarchy}.md | Each platform file covers the 12 required topics with official sources + check date. |
| 3 | Registry hardening: per-skill handoff briefs, version checks, Lucian/Taste prerequisites | Each registered skill exercised once on a sample project. |
| 4 | 25+ scenarios, routing harness, measured metrics | Results recorded with date, model, agent; no target presented as measured. |
| 5 | README install/usage per agent, examples, release | Only agents actually tested listed as supported. |

## 13. Self-assessment

| Check | Finding | Action |
|---|---|---|
| Missing pieces | Platform files and motion/a11y references are referenced as fallbacks but arrive in Phase 2. | Phase-1 SKILL.md tells the agent to use official guidance it knows, cite it, and mark version-specific claims unverified until the files exist; no dangling links. |
| Extensibility | New skill = one registry entry; new platform = one platform file + detection row; new agent = install path row. Engine untouched. | — |
| Brittleness | External skills change fast (Taste rebuilt 2.1 → 2.5 the day before this research). | Registry stores `verified_version` + date; engine re-reads a skill's own SKILL.md before trusting registry claims when versions differ. |
| Claude Code feasibility | Skills via Skill tool; plugin namespacing handled by invocation-name lists; subagents available. | — |
| Codex / others | No Skill tool: skills are activated by reading `SKILL.md` from `~/.agents/skills`, `~/.codex/skills`, `.agents/skills`. No subagents → sequential review mode. | Execution policy documents both. **Unverified** until Phase 5 testing. |
| Token cost | Registry has 61 entries (~3.5k words). First with-skill run read it whole; after refactor, agents grep shortlisted ids only. SKILL.md is ~1.2k words. | Token counts measured in Phase 4. |
| Risk: orchestrator overhead on tiny tasks | Fast path: Small + low-risk tasks skip registry loading entirely. | Built into decision engine. |

## 14. Phase 1 outcome (2026-11-06)

Baseline vs. with-skill routing runs: `tests/results/2026-11-06-baseline.md`,
`tests/results/2026-11-06-with-skill.md`. With the skill, the three high/medium baseline misses
(Reanimated 4 vs 3, Impeccable redesign semantics, Taste prerequisites and kit) were handled
correctly, with no unnecessary invocations. The run surfaced 12 ambiguities in the skill; all were
addressed and the affected scenarios re-tested. Sample size is 1 per run.
