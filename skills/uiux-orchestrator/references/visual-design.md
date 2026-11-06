# Visual design principles (hierarchy, layout, type, color)

Platform-neutral principles. They apply on top of a project's design system and a platform's
conventions, never in place of them. Platform type scales, spacing units and components live in
`platforms/<platform>.md`.

## 1. Hierarchy first

Every screen answers three questions in this order:
1. Where am I?
2. What is the main thing here?
3. What can I do next?

- **One primary action per view.** Secondary actions are visibly secondary (tonal, outline, text).
  Destructive actions are separated and confirmed or undoable.
- Rank content into 3 levels at most (primary, secondary, supporting).
- Use the fewest tools to rank it: size, weight, color/contrast, position, spacing. Adding
  borders, shadows and colors to rank is a sign the spacing and type are not doing their job.
- **Squint test:** blur the screenshot. The primary element and the primary action should still
  stand out.

## 2. Layout and spacing

- Use a spacing scale (commonly 4 or 8 based) and only its steps. Mixed spacing values are the
  most common cause of a "slightly off" look.
- Proximity shows relationships: space inside a group < space between groups < space between
  sections.
- Align to a small number of edges. Every new alignment line costs clarity.
- Respect platform margins and safe areas/insets. Content never sits under system bars, notches,
  home indicators or keyboards.
- Line length for reading text: about 45–75 characters.
- Density follows the task: data-heavy tools can be denser; first-run and marketing surfaces
  breathe more. Use one density per surface.
- Reserve space for asynchronous content (skeletons with the final dimensions), so content does
  not jump.

## 3. Typography

- Use the platform/system type scale or the project's scale. Use 4–6 roles on a screen.
- Create hierarchy with size **and** weight, not size alone. Limit weights to 2–3.
- Body text must scale with user settings (Dynamic Type, `sp`, `textScaler`, `rem`).
  Layouts must survive the largest setting without clipping. Allow wrapping, don't truncate key
  content, and stack horizontal layouts when space runs out.
- Line height: about 1.4–1.6 for body text, tighter for large headings. Tracking: slightly
  negative only for large display sizes (most system fonts handle it optically).
- Numbers that update or align in tables use tabular figures.

## 4. Color

- Work in **roles**, not hues: background, surface, surface-variant, primary, on-primary,
  secondary, error, outline, and so on. Components consume roles; themes map roles to values.
- Every foreground/background pair meets contrast floors (`references/accessibility.md`).
- Color is never the only signal (pair it with an icon, text or shape).
- Use one accent for interactive/primary meaning. If everything is colorful, nothing is.
- Dark mode is a separate palette, not an inverted one:
  - lower the saturation of accents;
  - use elevation through lighter surfaces, not shadows;
  - avoid pure black under bright text if it causes smearing on OLED;
  - check contrast again.

## 5. Components and states

- Reuse before creating. A new component must exist because no existing one can express the need.
- Every interactive component defines its states:
  - default, pressed/active, focus-visible, disabled, loading;
  - hover on pointer platforms;
  - selected/checked where relevant.
- Every data view defines its content states: loading, empty (with a way forward), error (what
  happened + what to do), partial, very long content, and offline where the app supports it.
- Touch targets meet platform minimums even when the visible shape is smaller. Enlarge the hit
  area, not the visual.

## 6. Avoiding generic, "AI-generated" UI

These patterns make an interface look templated. Avoid them unless the brand or the user asks
for them:

- purple/blue gradients and glassmorphism as default decoration;
- glow shadows everywhere;
- emoji used as icons;
- three-card feature grids repeated in every section;
- centered everything;
- identical rounded cards nested inside rounded cards;
- an oversized hero headline with vague copy ("Revolutionize your workflow");
- fake metrics and testimonials;
- random accent colors per section;
- inconsistent icon styles;
- decorative motion on every element.

The antidote is specificity:
- real content and the product's own UI;
- a deliberate, limited palette;
- one typographic idea;
- spacing doing the hierarchy work;
- conventions where users expect them, distinctiveness where the brand lives.

## 7. Consistency checks before handing off

- Same element, same look, everywhere: buttons, inputs, cards, list rows, icons (one icon family,
  one stroke weight).
- Same meaning, same color.
- Same transition for the same kind of change.
- New screens match their neighbours more than they match a reference image.

## 8. Choosing a chart (built-in fallback)

| Data question | Chart |
|---|---|
| A metric's trend over time (the usual dashboard question) | Line chart; area fill only for a single series showing volume |
| Comparing the totals of a few discrete periods (e.g. "which month was highest?") | Column chart, zero baseline |
| Compare categories | Horizontal bar, sorted by value; long labels fit |
| Part of a whole, ≤ 5 parts | Stacked bar, or a donut only when the total is meaningful |
| Distribution | Histogram / box plot |
| Relationship between two measures | Scatter plot |
| A single headline number | KPI tile with period and change vs. previous period |

When a data-visualization skill is used, its recommendation takes precedence over this table.

Always: label units and the period; bars start at zero; highlight the series or point that
matters (e.g. the current period), mute the rest; don't encode meaning in color alone; give
screen readers an equivalent (a data table or a summary sentence); use tabular figures; design the
empty state.

