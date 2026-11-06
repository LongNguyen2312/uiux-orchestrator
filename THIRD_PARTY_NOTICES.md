# Third-party notices

UIUX Orchestrator is MIT-licensed ([LICENSE](LICENSE)). It **does not bundle, copy or modify the
code or instructions** of any other skill. It refers to them by name and URL, and it routes work
to them only when they are installed.

**Claude Code plugin dependencies.** `.claude-plugin/marketplace.json` lists six skill plugins
(Impeccable, Taste, UI UX Pro Max, a subset of Emil Kowalski's skills, Anthropic `frontend-design`
and Vercel `web-design-guidelines`). Each entry points to its author's GitHub repository at a pinned
commit. When a user installs the orchestrator plugin, Claude Code downloads those skills directly
from the original repositories, under their own licences listed below. This repository hosts none
of their files.

The repository does contain small amounts of third-party material:

1. **Skill metadata excerpts (test inputs).** These two files hold the `name` and a truncated
   `description` from each skill's `SKILL.md` frontmatter. They record exactly what an agent saw
   in the routing tests:
   - `tests/harness/installed-skills-metadata.txt`
   - `tests/results/2026-11-06-skill-metadata-snapshot.txt`
2. **Facts and short quotations in the registry and research notes.** Command names, flags,
   version numbers, prerequisites and side effects, verified from each skill's own files. These
   are in `skills/uiux-orchestrator/registry/skills.yaml` and `docs/phase-0-research.md`.
3. **Photographs** in `docs/assets/` (showcase screenshots) from Pexels. Details are below.

## Skill projects referenced

| Project | Licence | Copyright |
|---|---|---|
| [Impeccable](https://github.com/pbakaus/impeccable) | Apache-2.0 | Paul Bakaus (package author) |
| [Emil Kowalski skills](https://github.com/emilkowalski/skills) | MIT | © 2026 Emil Kowalski |
| [GSAP skills](https://github.com/greensock/gsap-skills) | MIT | © 2026 GreenSock |
| [UI UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) | MIT | © 2024 Next Level Builder |
| [Taste](https://github.com/Leonxlnx/taste-skill) | MIT | © 2026 Leonxlnx |
| [Lucian UX/UI](https://github.com/Seokwoooo/lucian-uxui) | MIT | © 2026 Seokwoooo |
| [Expo skills](https://github.com/expo/skills) | MIT | © 2025-present 650 Industries, Inc. (Expo) |
| [Software Mansion skills](https://github.com/software-mansion-labs/skills) | MIT (stated in README) | Software Mansion |
| [Callstack agent-skills](https://github.com/callstackincubator/agent-skills) | MIT | © 2026 Callstack Incubator |
| [Android skills](https://github.com/android/skills) | Apache-2.0 | See repository (Android team) |
| [Vercel agent-skills](https://github.com/vercel-labs/agent-skills) | MIT (stated in README) | Vercel |
| [SwiftUI Pro](https://github.com/twostraws/SwiftUI-Agent-Skill) | MIT | © 2026 Paul Hudson |
| [Anthropic skills](https://github.com/anthropics/skills) (`frontend-design`) | Apache-2.0 (per-skill `LICENSE.txt`) | See repository (Anthropic) |
| [Apple Design (dickwu)](https://github.com/dickwu/apple-design-skill) | No licence published | dickwu; guideline text belongs to Apple Inc. |

Licences as found in each repository on 2026-11-06.

The MIT-licensed excerpts are used under the MIT licence: *"The above copyright notice and this
permission notice shall be included in all copies or substantial portions of the Software."*
The copyright holders are listed above. The full licence texts are in each linked repository.

The Apache-2.0 excerpts (Impeccable, Android, Anthropic `frontend-design`) are short quotations of
skill descriptions and command names. No source files are redistributed. The licence text is at
https://www.apache.org/licenses/LICENSE-2.0.

**Apple Design (dickwu)** publishes no licence, so no text from it is reproduced here. Its entry in
the test metadata is a paraphrase, and the registry records only facts about it (name, URL,
purpose).

Names and trademarks (Apple, Android, Expo, GSAP, Vercel and others) belong to their owners.
Referring to a project here does not imply endorsement.

## Photographs

The images in `docs/assets/vahl-*` are screenshots of a demo page built with photos from
[Pexels](https://www.pexels.com), used under the [Pexels licence](https://www.pexels.com/license/).
Photographers and links are listed in [`docs/assets/CREDITS.md`](docs/assets/CREDITS.md).

The photos show real cars from other manufacturers. "Vahl" is a fictional brand, and no
manufacturer is affiliated with this project or endorses it.

## Development dependencies of the test fixtures

`tests/fixtures/*/package.json` lists open-source packages: React, Vite and Tailwind CSS (MIT),
TypeScript and puppeteer-core (Apache-2.0), Expo and React Native (MIT), and others. They are
**not** included in this repository (`node_modules/` is ignored). They are installed only if
someone runs a fixture locally.

The skill's own scripts (`skills/uiux-orchestrator/scripts/`) have no dependencies.
