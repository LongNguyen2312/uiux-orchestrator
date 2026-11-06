# Dashboard UX review: `src/pages/Dashboard.tsx`

⚠️ **Code-only review.** I couldn't render the page: starting the dev server and running the design detector both needed approvals that weren't given. Nothing below was seen on screen. Contrast ratios are calculated from the colour values, and sizes at 390px are estimates. I didn't change any files.

**Design score: 12/40 (Poor).** The metrics are the right ones for a developer API product (calls, spend, latency). Everything around them is generic or unfinished. The chart is a placeholder, and the numbers have no time period or comparison. The page's only action is destructive, can't be reached by keyboard, and has no undo. The single biggest fix is finishing the chart and putting context on the three numbers.

## Problems, most severe first

### 1. [Critical] "remove" can't be reached by keyboard and deletes instantly
- **Where:** `src/pages/Dashboard.tsx:47`
- **Problem:** it's a clickable `div`, so it has no role, no Tab stop and no keyboard support. The text is 12px, likely below the 24px minimum target size (WCAG 2.5.8). It's styled as a harmless blue link, but one click removes the project, even the live "Checkout API". There's no confirmation, no undo, no message afterwards, and no way to add a project back.
- **Impact:** keyboard and screen-reader users can't use the page's only action. Mouse users can remove a live project by mistake and not get it back.
- **Fix:** use the shared `Button` (`variant="ghost"`) with a label like "Remove Checkout API". After a removal, show "Removed. Undo" in a message that screen readers announce. For live projects, consider asking for confirmation or moving removal to project settings.

### 2. [High] Text too faint in light mode, and status shown only by colour
- **Where:** `:24`, `:28`, `:32`, `:39` and `:46`
- **Contrast:** the hardcoded colours seem tuned for dark mode, and dark mode passes. Light mode is the default and fails:

| Element | Colour | Light theme | Required |
|---|---|---|---|
| KPI labels, chart text | `#b5b5bd` | about 2.0:1 | 4.5:1 |
| "Paused" dot | `#d4d4d8` | about 1.5:1 | 3:1 |

- **Status:** a project's status is only the colour of a ● character. Screen readers read it as "black circle" or skip it.
- **Fix:** use the existing `text-ink-muted` token (about 6.7:1 light, 6.9:1 dark). Show the dot as decoration next to the words "Live" or "Paused".

### 3. [High] The main dashboard content is missing
- **Where:** `:36–40` and `:23–33`
- **Problem:** the screen shows the developer text "Chart goes here (6 months)", even though the usage data is already in the file. The three numbers have no time period, no comparison and no thresholds, so "$412" or "182ms" can't be judged good or bad. Latency doesn't say which percentile (p50/p95).
- **Impact:** the page can't answer "how am I doing?", and the placeholder makes the product look unfinished.
- **Fix:**
  - Draw the usage chart. Even a simple bar list or table would do.
  - Label the period ("October") and show the change ("+12.3% vs Sep"; usage is up 91% since May and never shown).
  - Show spend against the spend cap the Help page describes (`Help.tsx:5`).
  - Name the latency percentile.
  - Calculate the numbers from the data instead of typing them in by hand.

### 4. [Medium] The page ignores the design system
- **Where:** `:23`, `:27`, `:31`, `:36` and `:41`
- **Problem:** the cards have a violet glow (`#7c3aed`) that isn't in the brand palette (primary is `#3b5bdb`). They have no border, while the card background differs from the page background by only 1.07:1. The labels use emoji (🚀 💰 ⚡), which screen readers read aloud ("rocket API calls"). The page uses `rounded-xl` instead of the radius token and plain divs instead of the shared `Card`. "Usage" and "Projects" aren't headings, so heading navigation skips them. This goes against the "use these tokens" rule in `index.css:3`.
- **Fix:**
  - Use `<Card title="Usage">` and `<Card title="Projects">`.
  - Give the stat tiles a border and the radius token.
  - Remove the glow and the emoji.
  - Mark each label and value as a pair (`dl`/`dt`/`dd`) so screen readers connect them.

### 5. [Medium] The three stat cards don't adapt to phone screens
- **Where:** `:22`
- **Problem:** the grid is always three columns. At 390px each tile has about 77px of room, while "182ms" at its size needs about 94px (estimated), so it probably overflows. The 24px glows would also spill across the 16px gaps.
- **Fix:** `grid-cols-1 sm:grid-cols-3`, the same pattern the Pricing page already uses (`Pricing.tsx:13`).

### Smaller issues
- **Status dot placement:** the row spreads its three items across the full width (`:44`), so the dot floats mid-row, away from the project name. Long names have no truncation.
- **Empty state:** if every project is removed, the card shows only the word "Projects", with no message and no way to add one.
- **Lists:** the project rows aren't a list. The Help page's `ul` with `divide-y divide-line` (`Help.tsx:16`) is the pattern to match.
- **Missing states:** there are no loading or error states for the numbers or the project list.
- **No drill-down or time range:** project names aren't links and there's no time-range control, which power users will miss.
- **Capitalisation:** "remove" is lowercase; elsewhere labels use sentence case.

### What works
- The page frame (heading, spacing) matches the Help and Pricing pages.
- Three well-chosen metrics, shown as compact numbers with units (`34.7k`, `182ms`, `$412`).
- Several tokens are already used correctly: `bg-surface`, `border-line`, `text-success`, `text-primary`.

### The 3 changes that would matter most
1. Make "remove" a real, labelled button with undo, plus an empty state for no projects.
2. Fix the light-mode contrast and add "Live"/"Paused" text next to the status dots.
3. Replace the chart placeholder with a real chart, and add a time period and comparison to each number.

## How this review was done
- **Skill used:** Impeccable's critique command, the specialist for UX review here. It ran its two required passes as separate agents, a design review and a detector scan, which I then merged and checked against the sibling pages. All of its findings are above.
- **Missing context:** Impeccable's context loader was refused, and there's no PRODUCT.md or DESIGN.md, so the tokens in `src/index.css` were the design reference.
- **Skipped steps:**
  - The detector scan and browser overlay didn't run because Bash wasn't approved.
  - Saving a critique snapshot was skipped because the review is read-only.
  - Impeccable's follow-up questions were skipped because this is a non-interactive run.
- **Not needed:** platform-convention checks don't apply to web. The accessibility issues are included, but this wasn't a full WCAG audit.

**Status: Passed with limitations.** This rests on reading the code only; nothing was rendered.
- To see it on screen, approve and run `npx vite --port 5191`, then `npm run shoot -- --url http://localhost:5191/#/dashboard --widths 390,768,1280 --scheme light` (repeat with `--scheme dark`).
- For the real detector output, also run `~/.claude/skills/impeccable/scripts/impeccable detect --json src/pages/Dashboard.tsx`.

If you want these fixed, the improvement workflow can use these findings as its starting point.
