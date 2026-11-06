# Fixture: web-app ("Acme")

A Vite 8 + React 19 + TypeScript + Tailwind v4 app with tokens (`src/index.css` `@theme`), shared
components (`Button`, `Card`, `Field`, `Switch`, `Nav`) and pages with deliberate problems:

| Page | Planted problems | Used by |
|---|---|---|
| Settings | ignores components and tokens, inline hex, placeholder-only labels, Delete styled like Save, no save feedback, broken dark mode | redesign runs (R1, R1b) |
| Dashboard | low-contrast hex text, purple glow, emoji icons, `div` click handler, color-only status, non-responsive KPI grid, chart placeholder | review (R2), chart (R6) |
| Pricing | plan name clipped by `w-28 overflow-hidden whitespace-nowrap` | bug fix (R3) |
| Help | FAQ toggles instantly | animation (R4) |
| Verify | plain code field | component reference (R5) |

`npm install`, then `npx vite --port <p>`; screenshots with `node scripts/shoot.mjs --help`-style flags
(see the header of `scripts/shoot.mjs`). Uses puppeteer-core 24 with the system Chrome (Node 20 compatible).
