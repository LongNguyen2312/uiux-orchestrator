# Fixture: expo-onboarding

An Expo SDK 58 app whose Home tab is a 3-step onboarding with deliberate motion problems:
instant step swaps, a `Pressable` with no pressed feedback, and progress dots that jump.

Recreate it (needs Node ≥ 22.13):

```bash
npx create-expo-app@latest expo-onboarding --template default --no-install   # SDK 58 at time of writing
cp -R <this folder>/src/. expo-onboarding/src/                                 # overlays index.tsx + onboarding component
cd expo-onboarding && npm install
```

Versions recorded on 2026-11-06: expo 58.0.23, react-native 0.88.1, react-native-reanimated 4.7.1,
react-native-worklets 0.13.0, react-native-gesture-handler 3.3.x, expo-router 58.0.30.

The untouched template already has 3 TypeScript errors (`animated-icon.web.tsx`, `app-tabs.web.tsx`,
`constants/theme.ts`). They are not part of the fixture's test.
