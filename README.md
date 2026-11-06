<h1 align="center">UIUX Orchestrator</h1>

<h3 align="center">Your agent has a dozen design skills.<br>This is the one that knows which to use.</h3>

<p align="center">
  Describe the interface you want in one sentence. It picks the right specialists, builds the result,
  and proves it works with screenshots.
</p>

<p align="center">
  <a href="https://github.com/LongNguyen2312/uiux-orchestrator/actions/workflows/validate.yml"><img src="https://github.com/LongNguyen2312/uiux-orchestrator/actions/workflows/validate.yml/badge.svg" alt="validate"></a>
  <img src="https://img.shields.io/badge/version-1.0.0-blue" alt="version">
  <img src="https://img.shields.io/badge/license-MIT-green" alt="license">
  <img src="https://img.shields.io/badge/Claude%20Code%20·%20Codex-ready-black" alt="agents">
</p>

---

## One sentence in. A finished landing page out.

<p align="center"><b>23 minutes · 4 specialist skills · 0 lines written by hand</b></p>

<table>
  <tr>
    <td align="center"><b>Before</b></td>
    <td align="center"><b>After</b></td>
  </tr>
  <tr>
    <td><img src="docs/assets/vahl-before.jpg" alt="Before: a generic template landing page"></td>
    <td><img src="docs/assets/vahl-after.jpg" alt="After: a cinematic night hero with a giant Vahl GT title on a line of light"></td>
  </tr>
</table>

<picture>
  <source srcset="docs/assets/vahl-demo.webp" type="image/webp">
  <img src="docs/assets/vahl-demo.gif" alt="The hero line draws and the title rises, model tabs wipe between photos, the charging simulator runs" width="100%">
</picture>

| Job | Skill the orchestrator picked |
|---|---|
| Visual direction | [Anthropic frontend-design](https://github.com/anthropics/skills) |
| Motion rules | [Emil Kowalski · animate](https://github.com/emilkowalski/skills) |
| Choreography | [Emil Kowalski · choreograph](https://github.com/emilkowalski/skills) |
| Independent review | [Impeccable · critique](https://github.com/pbakaus/impeccable) |

<details>
<summary>See both full pages side by side</summary>
<br>
<img src="docs/assets/vahl-fullpage.jpg" alt="Full page before (left) and after (right)">
</details>

<sub>Vahl is a fictional brand. Photos: Pexels ([credits](docs/assets/CREDITS.md)).</sub>

## Why you need it

| 😩 Without it | 😎 With UIUX Orchestrator |
|---|---|
| A one-line fix triggers a whole design pipeline | Small fixes stay small and fast |
| Two skills fight over the same screen | One clear lead, each specialist on its own job |
| Code that doesn't fit your stack or versions | It reads your project before it writes |
| *"Done ✅"*, and nobody opened the page | Screenshots and checks, with an honest status |

## Install

```text
/plugin install uiux-orchestrator --marketplace LongNguyen2312/uiux-orchestrator
```

Then just ask:

```text
/uiux-orchestrator The onboarding animation feels dead. Make it smooth.
```

<sub>Codex and other agents: see the [usage guide](docs/usage.md#install-update-remove).</sub>

## Numbers, not adjectives

<table>
  <tr>
    <td align="center"><h2>100%</h2>right skills picked<br><sub>vs 50% for the agent alone</sub></td>
    <td align="center"><h2>0%</h2>unnecessary skill runs<br><sub>vs 47% for the agent alone</sub></td>
    <td align="center"><h2>16/16</h2>stacks detected<br><sub>from real project files</sub></td>
  </tr>
</table>

## Works everywhere you build UI

**Web** · **React Native** · **iOS** · **Android** · **Flutter**. Each platform has built-in,
version-checked guidance.

## Bring your own specialists

UIUX Orchestrator **doesn't bundle any other skill**. It works on its own, and every skill you add
gives it another expert to call on. Popular picks:

| Skill | What it adds | Install |
|---|---|---|
| [Impeccable](https://github.com/pbakaus/impeccable) | Design critique, audits, polish, new visual worlds | `npx impeccable install` |
| [Taste](https://github.com/Leonxlnx/taste-skill) | Marketing-site design direction | `npx skills add https://github.com/Leonxlnx/taste-skill --skill "design-taste-frontend"` |
| [UI UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) | Data-backed styles, palettes, charts | `/plugin marketplace add nextlevelbuilder/ui-ux-pro-max-skill` |
| [Emil Kowalski](https://github.com/emilkowalski/skills) | Motion that feels right | `npx skills@latest add emilkowalski/skills` |
| [frontend-design](https://github.com/anthropics/skills) | Distinctive visual direction for new pages | `/plugin marketplace add anthropics/skills` |

<sub>More skills (GSAP, Vercel, Expo, Android, SwiftUI and others) and the exact steps for each agent
are in the [full list](docs/usage.md#recommended-skills).</sub>

---

<p align="center">
  📘 <a href="docs/usage.md">Usage</a> · ⚙️ <a href="docs/how-it-works.md">How it works</a> ·
  📊 <a href="tests/benchmark.md">Benchmark</a> · 🤝 <a href="CONTRIBUTING.md">Contributing</a> ·
  📄 <a href="THIRD_PARTY_NOTICES.md">Third-party notices</a>
  <br><br>
  <b>If it saves you a redesign, give it a ⭐</b>
</p>
