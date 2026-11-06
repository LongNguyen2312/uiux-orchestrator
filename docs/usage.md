# Using UIUX Orchestrator

## Calling it

| How | When to use it |
|---|---|
| Just describe the task | Everyday requests. The agent decides whether to load the skill, so it may not every time (see below). |
| `/uiux-orchestrator <request>` | **Recommended** whenever you want the orchestrated process: skill routing, validation evidence and the report. |
| `/uiux-orchestrator:uiux-orchestrator <request>` | Same thing: the full name the Claude Code plugin registers. |

**Automatic activation is the agent's choice, not a guarantee.** The agent reads every installed
skill's description and picks one, or none.
- In tests, the same review prompt loaded the orchestrator in 3 of 5 runs. Once the agent did the
  review itself, and once it chose another installed design-critique skill.
- Small, clear bug fixes are often done directly. That is fine, because the skill's own fast path
  would do almost the same work.

If you have several UI skills installed and want this one, use the slash command.

## Phrasing requests

Say *what* you want and any constraint that matters. You don't need to name skills or workflows.

| Request | What happens |
|---|---|
| "Redesign the profile screen. Make it modern but consistent with the app." | Redesign, **Refresh** mode: it audits the current screen, keeps the existing design system, then implements and validates the result. |
| "Replace the landing page with a completely new look." | Redesign, **Replace** mode: one design driver chooses a new direction. Before it changes anything project-wide, it asks you once. |
| "Improve the animation of the onboarding flow." | Animation: it decides what each motion is for and picks the tool. It prefers CSS or the library you already use, and adds no new dependency without asking. |
| "Review this screen and find UX problems. Do not modify the code." | Review, read-only: it returns findings with location, severity, impact and fix. No source file changes. |
| "The plan name is cut off on small phones." | Bug fix: it finds the root cause, makes the smallest fix, and shows before/after at the widths that matter. |
| "Is the checkout accessible?" | Accessibility: a WCAG 2.2 AA audit, plus fixes if edits are allowed. |
| "Set up design tokens for this app." | Design system: it inventories what exists and introduces tokens without restyling unrelated screens. |

Useful constraints to add in the same sentence:
- "don't modify code", for review only;
- "plan only", for an Execution Plan without edits;
- "no new libraries";
- "keep the brand colours";
- "iOS only" or "web only";
- "make it Large", to get the multi-step process with a separate reviewer.

If a fact that end users would read as true is missing, such as prices or legal text, it asks
once. Until you answer, it uses clearly marked placeholders.

## What you get back

**Start summary** (skipped on the fast path):

```text
Platform: Vite 8 + React 19, Tailwind v4    Task: review · Medium/low
Workflow: review (read-only)               Skills: impeccable/critique
Constraints: no source edits; evidence from code + rendered page
```

**Final report:**
1. What was done.
2. Which skills mattered, with one reason each.
3. Key changes and decisions.
4. The validation evidence and a status.
5. Limitations.

The status is one of four:

| Status | Meaning |
|---|---|
| `Passed` | Every gate of the workflow has the evidence it requires. |
| `Passed with limitations` | The work is done, but some evidence could not be collected, for example no simulator. The report says which. |
| `Needs review` | A decision or check needs you, for example a high-risk change or evidence that is impossible here. |
| `Failed` | A required check failed and could not be fixed within scope. |

Evidence levels used in reports:

| Level | Evidence |
|---|---|
| L0 | Code reading |
| L1 | Static checks: types, lint |
| L2 | Build |
| L3 | Functional: interaction runs |
| L4 | Visual: screenshots or frames that the agent looked at |
| L5 | On the target device class |

## Real example

Real output from a test run on this repository's web fixture (`tests/fixtures/web-app`), in Claude
Code with the plugin loaded and Impeccable installed. The excerpt is shortened; nothing was
reworded. The full run is recorded in `tests/results/2026-11-06-phase5-packaging.md`.

**Request:**

```text
/uiux-orchestrator Review the dashboard screen and identify UX problems. Do not modify the code.
```

**What the orchestrator did:**
- Read intake, project intelligence, the decision engine and the review workflow.
- Routed `ux-critique` to the installed `impeccable/critique`, which ran its two assessment
  sub-agents.
- Kept the run read-only: the source hash was identical before and after.

**Report (excerpt):**

```markdown
⚠️ **Code-only review.** I couldn't render the page: starting the dev server and running the design
detector both needed approvals that weren't given. Nothing below was seen on screen. [...]

### 1. [Critical] "remove" can't be reached by keyboard and deletes instantly
- **Where:** `src/pages/Dashboard.tsx:47`
- **Problem:** it's a clickable `div`, so it has no role, no Tab stop and no keyboard support. [...]
  One click removes the project, even the live "Checkout API". There's no confirmation, no undo [...]
- **Fix:** use the shared `Button` (`variant="ghost"`) with a label like "Remove Checkout API". [...]

### 2. [High] Text too faint in light mode, and status shown only by colour
| Element | Colour | Light theme | Required |
|---|---|---|---|
| KPI labels, chart text | `#b5b5bd` | about 2.0:1 | 4.5:1 |
| "Paused" dot | `#d4d4d8` | about 1.5:1 | 3:1 |
[...]

## How this review was done
- **Skill used:** Impeccable's critique command [...] It ran its two required passes as separate
  agents [...]
- **Skipped steps:**
  - The detector scan and browser overlay didn't run because Bash wasn't approved.
  - Saving a critique snapshot was skipped because the review is read-only.

**Status: Passed with limitations.** This rests on reading the code only; nothing was rendered.
- To see it on screen, approve and run `npx vite --port 5191`, then `npm run shoot -- [...]`
```

The status is `Passed with limitations` because the test harness did not allow a dev server.
Where a dev server is allowed, the same review adds screenshots at several widths and both colour
schemes (L4).

A review that runs Impeccable's critique takes longer than one without it, because critique runs
two assessment sub-agents. The orchestrator uses it when the review itself is the deliverable.

## Optional skills

It works without any other skill installed. The README lists the skills it knows how to use and
what each one is used for. When a missing skill would clearly improve a task, the report says so
in one line, and nothing is installed for you.

## Troubleshooting

| Symptom | Check |
|---|---|
| It doesn't activate | Run `/plugin` and confirm `uiux-orchestrator` is enabled, then start a new session. Or call `/uiux-orchestrator` explicitly. |
| "No Chrome, Chromium or Edge found" from the validation scripts | Install Chrome, Chromium or Edge, or set `CHROME_PATH`. |
| It reports `Passed with limitations` on mobile | No simulator or emulator, or no device automation tool. Install [agent-device](https://github.com/callstackincubator/agent-skills) (Callstack) for native screenshots and frames. |
| It asks before running a design driver | Drivers such as Impeccable new-work and Taste write context files or kits into your project, so it asks first. |
