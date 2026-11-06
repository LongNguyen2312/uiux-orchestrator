## Mobile harness notes (in addition to PROMPT_COMMON.md, which describes a web project — ignore its web-specific lines)

Project: Expo SDK 58 app (React Native 0.88, Reanimated 4.7, Gesture Handler 3.3, react-native-worklets 0.13,
Expo Router with native tabs, React Compiler). Routes live in src/app/. Inspect it yourself.
- Node: this project needs Node ≥ 22.13. Prefix commands with
  `export PATH=$HOME/.nvm/versions/node/v24.18.0/bin:$PATH;` (Node 24 is installed via nvm; do not change the default).
- Typecheck: `npx tsc --noEmit` — NOTE: the untouched template already has 3 pre-existing type errors
  (animated-icon.web.tsx, app-tabs.web.tsx, constants/theme.ts). Don't fix them; just make sure you add none.
- Lint: `npx expo lint`. JS bundle build: `npx expo export --platform ios --output-dir /tmp/uiux-runs/R7-export`.
- Dev server: `CI=1 npx expo start --port 8091` (background; kill it when done). Expo Go 58 is installed on the
  test simulator iPhone 17e, UDID 5769C0B5-FDE9-4DF3-86DC-DCE97B286A96 (already booted). Use ONLY this UDID.
  Never use or install anything on the other booted simulator (iPhone 17 Pro Max) — it belongs to the user.
- Known environment limits: `xcrun simctl openurl <UDID> exp://127.0.0.1:8091` shows an iOS
  "Open in Expo Go?" prompt that cannot be confirmed: there is no tap/automation tool here (no agent-device,
  idb or Maestro; osascript keystrokes are not permitted). `xcrun simctl io <UDID> screenshot <file>` works.
  Do not try to install automation tools.
- Save screenshots under the project's shots/ folder.
