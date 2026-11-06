# UIUX Orchestrator

**One skill that makes your coding agent work like a small product design team, and shows the
evidence when it says it's done.**

[![validate](https://github.com/LongNguyen2312/uiux-orchestrator/actions/workflows/validate.yml/badge.svg)](https://github.com/LongNguyen2312/uiux-orchestrator/actions/workflows/validate.yml)
![version](https://img.shields.io/badge/version-1.0.0-blue)
![license](https://img.shields.io/badge/license-MIT-green)
![agents](https://img.shields.io/badge/tested%20on-Claude%20Code%20·%20Codex%20CLI-black)

Web · React Native / Expo · iOS (SwiftUI, UIKit) · Android (Compose, Views) · Flutter

---

## The problem

You install a few great design skills: Impeccable, Emil Kowalski's animation skills, UI UX Pro
Max, an Apple HIG skill. Then your agent:

- runs **all of them** on a one-line fix, or **none of them** on a full redesign;
- lets two skills fight over the same screen;
- writes Reanimated 4 code into your Reanimated 3 app;
- restyles your design system when you asked for "consistent";
- says *"Done ✅"* without ever opening the page.

## The fix

UIUX Orchestrator reads the request and your project, then uses **only the expertise the task
needs**:

> **The right skill, at the right time, for the right reason.**

| | What it does for you |
|---|---|
| 🎯 **Picks the minimum** | Splits the task into needs (UX critique, motion, typography, accessibility…) and sends each need to *one* skill. A need that wouldn't change the result isn't run at all. |
| 🔍 **Knows your stack** | Detects the framework, versions, New Architecture, design tokens, components and motion libraries before writing any code. |
| 🛡️ **Respects your project** | Keeps your design system. Edits nothing on a read-only review. Never installs a skill or a library without asking. |
| ✅ **Proves the result** | Runs builds, screenshots, contrast and overflow checks, and frame traces. Ends with a status it can back up: `Passed`, `Passed with limitations`, `Needs review` or `Failed`. |
| 🧩 **Works alone** | No other skill is required. It uses the ones you have, and tells you in one line when a missing one would really help. |

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

There is nothing else to install. The optional checking scripts use Node 18+ and Chrome if you
have them. The [usage guide](docs/usage.md#install-update-remove) covers older Claude Code
versions, updating, removal and the agents tested so far.

## Use

Just ask. To be sure the orchestrator runs, start with `/uiux-orchestrator`:

```text
/uiux-orchestrator Redesign the settings screen. Keep it consistent with the app.
/uiux-orchestrator The onboarding animation feels dead. Make it smooth.
/uiux-orchestrator Review the dashboard for UX problems. Don't change the code.
```

There are no sub-commands to learn. It picks the workflow from what you say: design, redesign,
improvement, animation, review, bug fix, design system or accessibility.

## What you get back

A real excerpt from a read-only dashboard review:

```markdown
### 1. [Critical] "remove" can't be reached by keyboard and deletes instantly
- **Where:** `src/pages/Dashboard.tsx:47`
- **Fix:** use the shared `Button` with a label like "Remove Checkout API" [...]

### 2. [High] Text too faint in light mode, and status shown only by colour
| Element | Colour | Light theme | Required |
|---|---|---|---|
| KPI labels | `#b5b5bd` | about 2.0:1 | 4.5:1 |

**Skill used:** Impeccable's critique, with its two assessment passes.
**Status: Passed with limitations.** Reviewed from the code only; nothing was rendered.
```

Every finding has a file and line. The status says exactly what was and wasn't verified.
[More examples →](docs/usage.md)

## Does it actually help?

Measured on this project's own test scenarios, with one model. Methods and caveats are in the
[benchmark](tests/benchmark.md).

| | Without | With orchestrator |
|---|---|---|
| Picked the right skills (8 held-out scenarios) | 50% | **100%** |
| Ran a skill it didn't need | 47% | **0%** |
| Detected platform, framework and architecture from real project files | — | **16 / 16** |

Not yet run for real: Flutter, native Android, and large multi-agent tasks. Feedback from real
projects is the most useful contribution right now.

## Works with the skills you already have

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

Each one is used only for what it does best. The verified details for each are in
[how it works](docs/how-it-works.md#skill-integrations-optional).

## Learn more

- [Usage guide](docs/usage.md): phrasing requests, reading reports, troubleshooting.
- [How it works](docs/how-it-works.md): the pipeline, platforms, built-in tools, evidence,
  development.
- [Benchmark](tests/benchmark.md) · [Changelog](CHANGELOG.md) · [Contributing](CONTRIBUTING.md)

MIT licensed. Issues and real-project reports are welcome.
