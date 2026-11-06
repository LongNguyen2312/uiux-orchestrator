# UIUX Orchestrator

**Turn your coding agent into a product design team that picks the right expert for every UI task
and proves the result.**

[![validate](https://github.com/LongNguyen2312/uiux-orchestrator/actions/workflows/validate.yml/badge.svg)](https://github.com/LongNguyen2312/uiux-orchestrator/actions/workflows/validate.yml)
![version](https://img.shields.io/badge/version-1.0.0-blue)
![license](https://img.shields.io/badge/license-MIT-green)
![agents](https://img.shields.io/badge/works%20with-Claude%20Code%20·%20Codex%20CLI-black)

Web · React Native / Expo · iOS (SwiftUI, UIKit) · Android (Compose, Views) · Flutter

---

## The problem: great skills, no conductor

The agent-skills ecosystem has exploded. There are excellent skills for UX critique, visual
design, typography, motion, accessibility, and for platform rules on iOS, Android and React
Native. Each one is great on its own. Installed together, they become a new problem:

**🎻 Nobody decides who plays.** Your agent picks skills by matching a one-line description. So a
one-line CSS fix gets a full design-system pipeline, while a real redesign gets no expert at all.

**⚔️ Skills collide.** Two design skills both "own" the screen. One wants to replace your visual
direction while the other polishes it. You end up with a mix of both and the intent of neither.

**🧱 Advice that doesn't fit your project.** A skill written for Reanimated 4 produces APIs your
Reanimated 3 app doesn't have. A "redesign" command throws away the design system you asked it
to keep. A web animation recipe ends up in a SwiftUI screen.

**🔁 Decisions get lost between steps.** The direction chosen in design never reaches
implementation, and the reviewer judges against different criteria than the designer used.

**🙈 "Done ✅", but nobody looked.** The agent says the UI is fixed without building it, rendering
it, or checking contrast, overflow or motion.

## The solution: an orchestrator that thinks like a lead designer

UIUX Orchestrator sits above your skills and runs the work the way a senior product team would:

> **The right skill, at the right time, for the right reason.**

```text
understand the request → read the project → decide what's needed → build → verify → report
```

| | |
|---|---|
| 🎯 **Only what the task needs** | It breaks every task into concrete needs: UX critique, visual direction, typography, motion, accessibility, platform conformance. Each need goes to the **single best** skill. A need that wouldn't change the outcome is skipped, so small fixes stay fast and big redesigns get real expertise. |
| 🧭 **One clear lead per screen** | At most one design "driver" owns a surface, and written rulings settle overlaps between skills. No more tug-of-war. |
| 🔍 **Fluent in your stack** | Before touching code it detects your framework and versions: Expo SDK and the New Architecture, Reanimated, SwiftUI or UIKit, Compose or Views, Material 3, Flutter. It reads your design tokens, components and motion libraries too. The advice it applies fits *your* project. |
| 🛡️ **Respects your work** | "Consistent" means it keeps your design system. "Review" means it changes no files. It never installs a skill, library or tool without asking. |
| 🔗 **Decisions carry through** | Design decisions (direction, tokens, components) are handed to implementation and then to review, so every step works from the same brief. |
| ✅ **Proof, not promises** | It verifies with builds, screenshots at several widths and colour schemes, contrast and overflow checks, frame-by-frame motion traces, and device runs where available. Every report ends with an honest status: `Passed`, `Passed with limitations`, `Needs review` or `Failed`. |
| 🧩 **Great on its own** | No other skill is required: built-in guidance covers every platform. Install more skills and it puts each one to its best use. |

## Install

**Claude Code** (one command):

```text
/plugin install uiux-orchestrator --marketplace LongNguyen2312/uiux-orchestrator
```

**Codex CLI and other Agent Skills agents:**

```bash
git clone https://github.com/LongNguyen2312/uiux-orchestrator.git ~/uiux-orchestrator
ln -s ~/uiux-orchestrator/skills/uiux-orchestrator ~/.codex/skills/uiux-orchestrator
```

That's it: there are no dependencies. The [usage guide](docs/usage.md#install-update-remove)
covers updates and other agents.

## Use

Just describe what you want, or start with `/uiux-orchestrator` to call it directly:

```text
/uiux-orchestrator Redesign the settings screen. Keep it consistent with the app.
/uiux-orchestrator The onboarding animation feels dead. Make it smooth.
/uiux-orchestrator Review the dashboard for UX problems. Don't change the code.
```

There are no sub-commands to learn. It recognises design, redesign, improvement, animation,
review, bug-fix, design-system and accessibility work from your words.

## What you get back

A real excerpt from a dashboard review:

```markdown
### 1. [Critical] "remove" can't be reached by keyboard and deletes instantly
- **Where:** `src/pages/Dashboard.tsx:47`
- **Problem:** a clickable `div`: no role, no Tab stop. One click removes even the live project,
  with no confirmation or undo.
- **Fix:** use the shared `Button` with a label like "Remove Checkout API", plus an undo message.

### 2. [High] Text too faint in light mode, and status shown only by colour
| Element    | Colour    | Light theme | Required |
|------------|-----------|-------------|----------|
| KPI labels | `#b5b5bd` | about 2.0:1 | 4.5:1    |

**Skill used:** Impeccable's critique, with its two independent assessment passes.
```

Every finding is located, ranked and paired with a fix that uses your own components and tokens.
[More examples →](docs/usage.md)

## Proven on real tests

| | Agent alone | With UIUX Orchestrator |
|---|---|---|
| Picked the right skills for the task | 50% | **100%** |
| Ran skills the task didn't need | 47% | **0%** |
| Detected platform, framework and architecture from project files | — | **16 / 16** |

The agent-alone column is the same model choosing from the same installed skills, without the
orchestrator. The scenarios and methods are in the [benchmark](tests/benchmark.md).

## Plays well with the skills you love

[Impeccable](https://github.com/pbakaus/impeccable) ·
[Emil Kowalski](https://github.com/emilkowalski/skills) ·
[UI UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) ·
[Anthropic frontend-design](https://github.com/anthropics/skills) ·
[Apple Design](https://github.com/dickwu/apple-design-skill) ·
[Vercel](https://github.com/vercel-labs/agent-skills) · [GSAP](https://github.com/greensock/gsap-skills) ·
[Taste](https://github.com/Leonxlnx/taste-skill) · [Lucian UX/UI](https://github.com/Seokwoooo/lucian-uxui) ·
[Expo](https://github.com/expo/skills) · [Software Mansion](https://github.com/software-mansion-labs/skills) ·
[Callstack](https://github.com/callstackincubator/agent-skills) · [Android](https://github.com/android/skills) ·
[SwiftUI Pro](https://github.com/twostraws/SwiftUI-Agent-Skill)

It knows what each skill is best at, which versions it targets, what it needs to run, and what it
changes in your project. It calls each one only where it adds real value.
[See how each is used →](docs/how-it-works.md#skill-integrations-optional)

## Learn more

- [Usage guide](docs/usage.md): phrasing requests, reading reports, troubleshooting.
- [How it works](docs/how-it-works.md): the pipeline, platforms, built-in tools, development.
- [Benchmark](tests/benchmark.md) · [Changelog](CHANGELOG.md) · [Contributing](CONTRIBUTING.md)

MIT licensed. Stars, issues and real-project stories are welcome. ⭐
