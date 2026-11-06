## Test harness context (read carefully)

You are a coding agent doing a real UI task in a real project. This is a test run of the
`uiux-orchestrator` skill, located at <repo>/skills/uiux-orchestrator/.
Read its SKILL.md first and follow it end to end, loading its other files only as it instructs.

Project: a Vite 8 + React 19 + TypeScript + Tailwind CSS v4 app ("Acme"), with motion 14 installed.
Inspect it yourself as the skill says. Commands: `npm run build`, `npm run typecheck`,
`npx vite --port <PORT> --strictPort` (start it in the background; kill it when you are done).
Visual tooling already in the project: `node scripts/shoot.mjs` (read its header for flags). It
drives the system Chrome headlessly. Do NOT use any Playwright/browser MCP tools (they are shared
with other agents running at the same time).

Skills available in this environment:
- `impeccable` is installed normally (use your Skill tool if you have one; otherwise read
  ~/.claude/skills/impeccable/SKILL.md).
- These are installed for this test at the paths below but are not registered with your Skill
  tool. Activate one by reading its SKILL.md (the "no skill tool" path of the skill registry) and
  resolving its relative paths from its own directory:
  - Emil Kowalski skills: /tmp/uiux-research/emilkowalski_skills/skills/<name>/SKILL.md
  - UI UX Pro Max: /tmp/uiux-research/nextlevelbuilder_ui-ux-pro-max-skill/.claude/skills/ui-ux-pro-max/SKILL.md
  - Lucian UX/UI: /tmp/uiux-research/Seokwoooo_lucian-uxui/skills/lucian-uxui/SKILL.md
  - GSAP skills: /tmp/uiux-research/greensock_gsap-skills/skills/<name>/SKILL.md
  - Taste: /tmp/uiux-research/Leonxlnx_taste-skill/skills/taste-skill/SKILL.md
  - Vercel web-design-guidelines: /tmp/uiux-research/vercel-labs_agent-skills/skills/web-design-guidelines/SKILL.md
  Run skill scripts from your project directory, invoking them by absolute path (python3 -I for Python).
- Nothing else. Do not install skills, global tools, or new project dependencies unless the
  skill's rules allow it and you would have asked the user. If you would need to ask the user,
  write the question and the default you chose, and continue with the default.

Rules: work only inside your project directory (and /tmp for scratch). Save screenshots under
<project>/shots/.

When finished, output:
1. The orchestrator's final report (as the skill defines it).
2. TEST APPENDIX:
   a. the skill files you read, in order (full or partial);
   b. external skills activated, how (Skill tool / read SKILL.md), and which of their steps you
      ran or skipped and why;
   c. commands run with their outcomes (build, typecheck, screenshots);
   d. screenshot file paths (before and after where relevant);
   e. anything in the orchestrator skill that was unclear, contradictory, missing, or that made
      you do unnecessary work. Be candid.
