# Showcase run: Vahl landing page

- **Date:** 2026-11-06
- **Agent:** Claude Code 2.1.318 (`claude -p`), model Opus 5.5, n = 1.
- **Loading:** the orchestrator came in via `--plugin-dir`. Impeccable was installed globally. These
  skills were placed in the project's `.claude/skills/`:
  - Taste and Anthropic frontend-design;
  - Emil Kowalski's animate, choreograph, animation-performance, find-animation-opportunities,
    review-animations, improve-animations and emil-design-eng;
  - the GSAP core, react, scrolltrigger, timeline and performance skills;
  - UI UX Pro Max;
  - Vercel web-design-guidelines and react-view-transitions;
  - Lucian UX/UI.
- **Project:** a Vite 8 + React 19 + Tailwind v4 landing page for a fictional brand, with the
  `motion` library installed and six Pexels photos. The "before" page was written for this demo as a
  typical template.
- **Harness note** (system prompt, not part of the user prompt): a dev server was running at
  localhost:5391, Chrome was installed, Node 20 was the default and Node 24 was available via nvm.
- **Permissions:** edits were auto-accepted. Bash was limited to build, node, python and similar
  commands; no package installs.
- **Duration (redesign):** about 23 minutes over two segments, the second resuming after the background
  critique finished. 142 + 56 turns. No human input during the run, and no edits by the author
  afterwards.

## Prompt (verbatim)

```text
/uiux-orchestrator Redesign the landing page in src/App.tsx for Vahl, a fictional German premium electric car brand with the restraint of Audi. The page works, but it looks like every SaaS template. I want a completely new, art-directed concept that feels like a premium car brand and not like a template or something AI-generated: one strong visual idea, confident typography, a deliberate colour world, and motion that feels engineered (precise and fast, no bouncy gimmicks). It needs a cinematic hero, a way to compare the three models, a technology and charging section, and test-drive booking. Use only the photos in public/cars and don't add npm packages. It must work on mobile, in light and dark mode, and with reduced motion. When you're done, verify it with screenshots and tell me which skills you used and why.
```

## Orchestrator files read, in order

`core/intake.md` → `core/project-intelligence.md` → `core/decision-engine.md` → `workflows/redesign.md` →
`core/skill-registry.md` → registry entries for the driver candidates (taste, impeccable/new-work,
anthropic/frontend-design) → `core/execution-policy.md` → `core/quality-gates.md` → `platforms/web.md`.

## Skills invoked

| Order | Skill | Role |
|---|---|---|
| 1 | `frontend-design` | Visual-direction driver |
| 2 | `animate` (Emil Kowalski) | Motion decisions |
| 3 | `choreograph` (Emil Kowalski) | Hero entrance sequence |
| 4 | `impeccable` critique, inside an independent sub-agent | Review by a different evaluator |

## The agent's final report (verbatim)

I redesigned the landing page around one idea, which I called **Lichtlinie** ("light line"). A thin line of light draws itself across the hero and then reappears as the model tab marker, the charge bar and the focus line in the booking form. The build passes, I checked it with screenshots at 320, 390, 768, 1280 and 1440 px in light and dark mode and with reduced motion, and I clicked and typed through every interaction.

I edited only `src/App.tsx` and `src/index.css`. No packages were added and I didn't commit. Running the build also created a `dist/` folder, and git wasn't available to me to confirm whether that's ignored.

## The design
- **Colour:** mineral greys taken from the Iceland and overcast photos, with no accent colour, so all the colour comes from the photographs. The hero and technology sections are night scenes in both modes; the rest follows the system light/dark setting.
- **Typography:** DIN Condensed, the German road-sign typeface, for headings, with DIN Alternate for figures and Avenir Next for body text. These are macOS system fonts, so nothing loads from the web. On Windows the headings fall back to Bahnschrift, a close DIN relative, and Android gets Roboto Condensed.
- **Hero:** full-screen night photo with a giant "Vahl GT" that rises out of the line as it draws.
- **Model comparison:** tabs that swap the photo with a directional wipe, plus a real side-by-side spec table.
- **Technology:** shown against the LED headlight photo.
- **Charging:** a full-width simulator. You drag the time slider or press "Run an 18-minute charge", and the battery % and km added update along an edge-to-edge charge line.
- **Booking:** visible labels, the model choice, inline errors that move focus to the first problem, and a status message.
- **Shared model choice:** one selection drives the tabs, the table, the charging simulator and the booking form.
- **Motion:** precise, no bounce. The hero runs as a single 1.4 s sequence, interface movements stay under 300 ms, and there are no fade-ins on sections as you scroll. With reduced motion, everything becomes a short fade with no movement.

## Skills used and why
- **uiux-orchestrator:** decided the workflow (a full redesign rather than a refresh, because you asked for a completely new concept) and which skills to use.
- **frontend-design:** led the visual direction. It produced the colour, type and layout plan, and its check against generated-page tells made me drop the stat band, icon cards and single accent colour. I chose it over Impeccable's full pipeline and Taste because both want to write their own files into the project or need setup choices only you can make.
- **animate:** set the motion rules: whether each element should move at all, which properties, the curves and durations, and the reduced-motion version of each.
- **choreograph:** set the order of the hero entrance (line, then name, then copy, then buttons) and what stays still.
- **impeccable (critique), run independently:** a separate agent reviewed the finished page without seeing my reasoning. It scored it 23/32 and raised 13 issues, and I fixed 12:
  - the line idea was too timid and every section used the same split layout, so Charging became a full-width block;
  - the same photo appeared twice, and a VW badge was visible in the technology shot;
  - form field borders and the slider track were too low-contrast in light mode;
  - there was no navigation on mobile, so I added a menu;
  - required fields weren't marked;
  - unselected table columns were faded.

  The one I skipped is responsive image sizes, which would mean adding resized copies of the photos.

## How it was checked
- Typecheck and production build pass.
- Every interaction was exercised: tabs (by mouse and arrow keys), charge playback, the booking errors, a valid submit, the mobile menu, and keyboard tabbing. No console errors and no sideways scrolling at any width, including 320 px.
- Frame-by-frame traces confirm the timings: the line draws in about 770 ms with no dropped frames; under reduced motion it's a 283 ms fade and the photo wipe becomes a 200 ms crossfade.
- The final screenshots caught a missing focus ring on the header button over the hero; that's fixed and re-checked.
- The remaining automated warnings are false positives: the skip link is hidden until focused, and the header logo is measured against the page instead of the dark photo behind it.

**Status: passed, with limitations:**
- **Third-party cars in the photos:** they're real cars from other brands (a Porsche, a Toyota pickup, a Mitsubishi, a VW). I cropped out the one visible badge, but they may still be recognisable.
- **Booking isn't connected:** the form doesn't send anything. It says so plainly after a valid submit, and `requestTestDrive()` in `App.tsx` is the function to replace with a real booking service.
- **Fictional figures:** I invented the specs and the third charge time; the footer marks all figures as illustrative.
- **Image sizes:** all photos are 2400 px with no smaller versions.
- **Not checked:** I didn't test on a real phone or with a screen reader, and my own screenshot script stood in for Playwright, which wasn't permitted in this session.


## Follow-up: bug report (second session, same project)

The author noticed that the left edge of the "V" was clipped in the hero title and sent one line.
It went to a fresh `claude -p` session with the same harness:

```text
/uiux-orchestrator In the hero, the left edge of the "V" in "Vahl GT" is cut off. Fix it.
```

- Orchestrator files read: `workflows/bug-fix.md` and `core/execution-policy.md` (fast path).
- No skills were invoked.
- 17 turns, about 77 seconds.
- Diff: `src/index.css`, `.hero-name-mask { overflow: clip }` became `overflow-x: visible; overflow-y: clip`.
- The agent could not render in its sandbox and said so. The author verified the fix with
  screenshots afterwards.

The agent's report (verbatim):

I've fixed the cut-off V with a one-line CSS change, but I couldn't see the result in a browser: both Playwright and headless Chrome were blocked here. The fix is based on reading the code only.

**Cause:** the heading is shifted left by `-0.04em` (`margin-left` on `.hero-name`) so the V lines up visually with the content edge. But its wrapper, `.hero-name-mask`, clips overflow on both axes. So the part of the V that sticks out past the wrapper's left edge gets cut off. That clipping only needs to be vertical, for the "rise up" entrance animation.

**Fix** (`src/index.css:351`): the wrapper now clips only top and bottom:
```css
overflow-x: visible;
overflow-y: clip;
```
The left shift stays, so the V still lines up with the content edge. The entrance animation is unchanged because the vertical clip is still there.

**Why nothing else should change:**
- `.hero-name-mask` is used only once, in the hero (`src/App.tsx:188`).
- Nothing else in the hero clips the sides of the V. The page container (`.wrap`) has no clipping. The hero section does clip, but its edge is always at least 1.25rem from the heading, and the V sticks out by at most about 0.8rem (at the largest font size).
- Browser support is the same as before, since the old code already relied on `overflow: clip`.

**Not checked:** I haven't seen the change on screen, and the font's actual glyph shapes weren't measured. To confirm, reload http://localhost:5391/ and look at the V at a wide window and at about 375px wide. Also watch the entrance animation once to check that the text still rises out of an invisible edge. If you allow Playwright or Chrome, I can take before-and-after screenshots myself.

I didn't use any extra design skills; this was a simple local CSS bug.
