# Platform: React Native (Expo and React Native CLI)

Covers Expo (managed and prebuild/CNG) and bare React Native CLI apps on iOS and Android.
Cross-platform principles: `references/visual-design.md`, `references/motion-principles.md`,
`references/accessibility.md`. For native look and behavior details, also see the relevant
sections of `platforms/ios.md` and `platforms/android.md`. Read only the sections the task touches.

Last checked: 2026-11-06. Version facts are in §0. **Always read the project's actual versions**:
the ecosystem changed a lot between 2024 and 2026.

## 0. Version gates (check before using)

| Fact | Status 2026-11-06 | Consequence |
|---|---|---|
| Latest stable | Expo SDK 58 (Oct 2026), React Native 0.88 | Since SDK 55, Expo packages use the SDK major version (e.g. `expo-router` 58.x) |
| New Architecture | Default since RN 0.76 / SDK 53. **Cannot be disabled from RN 0.82**. SDK 54 is the last Expo SDK with a legacy option; SDK 55+ has none (`newArchEnabled` removed) | Projects on SDK ≤ 54 or RN < 0.82 may still be legacy. Check before picking libraries |
| Reanimated | 4.x (4.7) requires the New Architecture and a separate `react-native-worklets`. **Reanimated 3 is no longer maintained** (last 3.19.x) | On legacy projects, write Reanimated 3 APIs (`runOnJS`, no worklets package). Upgrading is a separate, permissioned task |
| Reanimated 4 setup | Requires `react-native-worklets` as a direct dependency (Expo configures the Babel plugin; bare RN adds `react-native-worklets/plugin` last) | Reanimated 4 without worklets is a broken setup. Report it and ask before adding the package |
| Reanimated 4 CSS timing values | Typed: use `cubicBezier(...)` / keyword easings (some recipes write a `'cubic-bezier(...)'` string, which 4.7's types reject) | Translate recipe strings when copying |
| Reanimated 4 extras | CSS-style transitions (`transitionProperty`, `transitionDuration`) and CSS animations (`animationName` keyframes) | Simple state transitions can skip shared values |
| Gesture Handler | v3 (3.5) is current, needs RN ≥ 0.82, hooks API (`usePanGesture`, `onActivate`/`onDeactivate`). v2 is tagged `legacy` (`Gesture.Pan()` builder) | Match the installed major; `emil/animate-expo` recipes use v2 and note the v3 mapping |
| Expo Router | 58.x: native tabs stable (`expo-router/native-tabs`; SDK 54–57 used `unstable-native-tabs`), toolbars, link previews (iOS) | Use what the installed version exposes |
| React Navigation | v7 stable; v8 in alpha | Don't adopt v8 unasked |
| Android edge-to-edge | Mandatory in Expo SDK 54+ (`edgeToEdgeEnabled` removed in 55) | Always handle insets |
| `SafeAreaView` from `react-native` | Deprecated → `react-native-safe-area-context` | Use its `SafeAreaView` or `useSafeAreaInsets` |
| `@expo/ui` | SwiftUI/Compose APIs stable since SDK 56; web experimental | Use only if installed or approved |
| FlashList | v2 needs New Architecture; no `estimatedItemSize` | v1 projects keep `estimatedItemSize` |

## 1. Principles

- It's native UI driven by JavaScript. Users judge it against native apps on their OS, so follow
  iOS and Android conventions (back gesture, tab bar style, pickers, sheets, haptics, typography)
  even with a custom brand.
- **Two threads matter.** React renders on the JS thread; gestures and animations must run on the
  UI thread (Reanimated worklets, native drivers) to stay smooth while JS is busy.
- Prefer platform-native building blocks (native stack, native tabs, system sheets, `@expo/ui` if
  present) over JS re-implementations.
- Expo Go is for quick previews only: it can't load custom native code and supports one SDK. Use a
  development build for native modules, and a release build for performance.

## 2. Layout, spacing, adaptive

- Flexbox with `flexDirection: 'column'` by default. Use `gap` for spacing. Avoid absolute
  positioning except for overlays.
- Insets: wrap screens with `SafeAreaProvider` (once, at the root) and use `useSafeAreaInsets()` or
  `SafeAreaView` from `react-native-safe-area-context`. Native stack headers and tabs handle their
  own insets, so don't double-pad.
- Keyboard: `KeyboardAvoidingView` (behavior `padding` on iOS), or `react-native-keyboard-controller`
  if installed. Test that forms scroll the focused field into view.
- Adaptive: `useWindowDimensions()` for breakpoints (phone vs. tablet widths, landscape). Don't
  branch on device model. Support iPad and Android tablets if the app declares them.
- Use the project's spacing scale (theme file, NativeWind/Tailwind classes, Tamagui/Restyle/
  Unistyles tokens). Avoid magic numbers.

## 3. Typography

- `allowFontScaling` stays on (the default). Set `maxFontSizeMultiplier` only on chrome that cannot
  grow (tab labels, badges), never on body text.
- Use the platform system font by default: San Francisco on iOS, Roboto/Google Sans on Android (via
  `fontFamily` undefined). Custom fonts load via `expo-font` / `useFonts` (Expo) or are linked (CLI).
  Don't render text before fonts load (splash screen hold).
- Text must wrap at the largest accessibility sizes. Test with iOS AX5 / Android font scale 2.0.

## 4. Color and theming

- `useColorScheme()` + the project's theme. Navigation themes (React Navigation / Expo Router
  `ThemeProvider`) must match the app theme so headers and tab bars switch too.
- Use semantic platform colors where the app aims for native feel (`PlatformColor` on iOS/Android,
  `DynamicColorIOS`) — `expo/native-ui` covers this.
- Status bar: `expo-status-bar` `<StatusBar style="auto" />`. Check legibility over content when
  edge-to-edge.

## 5. Components and conventions

- Pressables: `Pressable` with visible pressed feedback (opacity/scale on iOS, ripple via
  `android_ripple` on Android). Use `hitSlop` to reach 44pt/48dp without enlarging visuals.
- Lists: `FlatList`/`SectionList` or FlashList (if installed) for anything long. Never `.map()`
  inside a `ScrollView` for unbounded data. Memoize `renderItem`; use stable `keyExtractor`.
- Sheets: the native stack `presentation: 'formSheet'` / Expo Router sheet options, `@expo/ui`
  BottomSheet, or the installed library (`@gorhom/bottom-sheet`). Keep the installed one.
- Inputs: correct `keyboardType`, `textContentType` (iOS) / `autoComplete`, `returnKeyType`, and
  `secureTextEntry` with paste allowed.
- Images: `expo-image` (if installed) for caching and transitions; always set dimensions.
- Platform differences: `Platform.select` for small ones, `.ios.tsx` / `.android.tsx` files for
  large ones.

## 6. Navigation

- Expo Router (file-based, `app/`) or React Navigation. Use the installed one; never switch.
- Use the native stack (`@react-navigation/native-stack` / Expo Router `Stack`) for platform
  transitions and the iOS swipe-back. Don't disable `gestureEnabled` without reason.
- Tabs: native tabs (Expo Router 58 `expo-router/native-tabs`) render the system tab bar (Liquid
  Glass on iOS 26+). JS tabs (`@react-navigation/bottom-tabs`) are fine where already used. Keep tabs
  at 3–5.
- Android back: the hardware/gesture back must behave (closes sheets/modals first). Use
  `BackHandler` only for custom cases. Predictive back is handled by the native stack.
- Deep links: every important screen reachable by URL (Expo Router does this by default).

## 7. Interaction and input

- Gestures: React Native Gesture Handler (`GestureDetector` + v2 builder or v3 hooks) driving
  Reanimated shared values. Never `PanResponder` for new work.
- Every drag has a tap alternative. Respect system edge gestures (don't put horizontal pans at the
  screen's left edge on iOS).
- Haptics: `expo-haptics` (`selectionAsync` for pickers/toggles, `impactAsync(Light)` for snaps,
  `notificationAsync` for success/error). They are silently skipped in iOS Low Power Mode and similar
  states, so never rely on haptics alone. Use them sparingly and in sync with the visual event.

## 8. Accessibility specifics

- `accessibilityLabel` / `aria-label`, `accessibilityRole` / `role` (`role` takes precedence;
  values differ slightly: `heading` vs `header`), `accessibilityState` / `aria-*` for
  selected/checked/disabled/expanded, `accessibilityHint` for non-obvious results. Follow the
  project's existing style.
- Group composite rows: `accessible` on the container with a combined label.
  `importantForAccessibility="no-hide-descendants"` (Android) / `accessibilityElementsHidden`
  (iOS) or `aria-hidden` to hide decoration.
- Modals: `accessibilityViewIsModal` (iOS) / `aria-modal`. Return focus to the trigger on close
  (`AccessibilityInfo.setAccessibilityFocus`).
- Announcements: `AccessibilityInfo.announceForAccessibility`.
- Reduced motion: `AccessibilityInfo.isReduceMotionEnabled()` plus the `reduceMotionChanged` event;
  Reanimated `useReducedMotion()` (read at launch, no re-render) or `ReduceMotion.System` in configs
  (the default).

## 9. Animation

Follow the tool decision in `workflows/animation.md`. Motion skill: `emil/animate-expo` (or its
alias `expo/expo-animation`, never both).

- **Reanimated**: `useSharedValue`, `useAnimatedStyle`, `withTiming`/`withSpring`, layout
  animations (`entering`/`exiting`/`layout`), and on v4 the CSS transitions/animations. Keep
  per-frame logic in worklets.
  - v4: call into JS with `scheduleOnRN` from `react-native-worklets`.
  - v3: `runOnJS`.
  - Never read `.value` during render.
- **Ready-made gesture components first**: Gesture Handler ships `ReanimatedSwipeable`
  (`react-native-gesture-handler/ReanimatedSwipeable`, present in 3.5) for swipe-to-reveal or
  delete rows, and `Pressable` with Reanimated for press feedback. Build a custom pan only when these
  can't express the design.
- **Gesture-driven**: drive shared values from Gesture Handler. On release, `withSpring` with the
  gesture velocity; use `withDecay` for momentum.
- **Screen transitions**: native stack animations first. Shared element transitions only with what
  the installed Reanimated version supports (check its docs; treat as experimental unless stated).
- **Canvas/effects**: `@shopify/react-native-skia` if installed. Lottie/Rive for designer-made
  motion.
- Core `Animated` with `useNativeDriver: true` only in projects without Reanimated (transform and
  opacity only).
- `LayoutAnimation` for simple, non-interactive list changes when Reanimated is absent.

## 10. Performance

- Judge in **release builds on a real, modest device**. For Expo: `npx expo start --no-dev --minify`,
  or a release/preview build. Dev mode and Expo Go are much slower and hide real problems.
- Watch JS and UI thread FPS (perf monitor). Typical culprits: re-rendering on every scroll event
  or animation frame, inline functions in large lists, heavy work in `onScroll` without worklets,
  large images without resizing, deep provider re-renders.
- Lists: FlashList (if installed), `getItemLayout` for fixed rows, `removeClippedSubviews` with
  care, memoized rows.
- Avoid `setState` in gesture or scroll handlers. Use shared values.

## 11. Validation

- L1: `tsc --noEmit`, eslint only if the project already has an ESLint config (`npx expo lint`
  installs and configures ESLint on first run). L2: `npx expo export` (JS bundle) or a native build (`npx expo run:ios`
  / `run:android`, or `xcodebuild`/Gradle for CLI). Expo prebuild only if the project uses CNG.
- L4: run on simulator/emulator. Capture with `callstack/agent-device` (if installed),
  `xcrun simctl io booted screenshot <file>`, or `adb exec-out screencap -p > <file>`. Check both
  iOS and Android when the change is cross-platform: light/dark, largest text, small phone (e.g.
  iPhone SE / 360dp) and a large one, and reduced motion.
- Web preview fallback (Expo `--web`, when native can't be driven): the bundled `scripts/ui-check.mjs`
  and `scripts/motion-trace.mjs` work against the web URL. Label the evidence "react-native-web
  preview, not device".
- L5: release build on a device for animation feel, gestures, haptics and performance claims.

## 12. Common mistakes

- Using Reanimated 4/worklets APIs in a Reanimated 3 project, or Gesture Handler v3 hooks on v2
  (and vice versa).
- Upgrading Reanimated, Gesture Handler, RN or enabling the New Architecture as part of a UI task.
- `SafeAreaView` from `react-native`; double insets under native headers; content under the Android
  navigation bar after edge-to-edge.
- Web habits: hover states, `onClick` thinking, CSS units, `100vh`-style assumptions, tiny
  touch targets.
- Animations driven by `setState`/JS timers; reading shared values in render.
- Judging smoothness in Expo Go or a dev build.
- Custom JS tab bars or headers that ignore platform conventions when native ones would do.
- `maxFontSizeMultiplier={1}` on body text; fixed heights on text containers.
- One platform tested only.
- Expo web with server output: an `entering` layout animation combined with reduced motion can
  leave server-rendered content `visibility: hidden` after hydration. Prefer transitions on
  always-mounted elements for content that must be visible, and check the web build if the app ships
  web.

## Sources

- Expo changelog: https://expo.dev/changelog (SDK 55, 56, 58) · New Architecture: https://docs.expo.dev/guides/new-architecture/
- React Native docs: https://reactnative.dev/docs/accessibility, /docs/accessibilityinfo, /docs/text, /docs/performance, /docs/safeareaview, /docs/platform-specific-code
- Reanimated: https://docs.swmansion.com/react-native-reanimated/ (getting started, accessibility, useReducedMotion)
- Gesture Handler v3 upgrade: https://docs.swmansion.com/react-native-gesture-handler/docs/guides/upgrading-to-3/
- Expo Router native tabs: https://docs.expo.dev/router/advanced/native-tabs/ · Expo UI: https://docs.expo.dev/versions/latest/sdk/ui/ · Haptics: https://docs.expo.dev/versions/latest/sdk/haptics/
- Dev mode: https://docs.expo.dev/workflow/development-mode/ · Dev builds FAQ: https://docs.expo.dev/develop/development-builds/faq/
- Safe area context: https://rnsac.appandflow.com/ · FlashList v2: https://shopify.github.io/flash-list/docs/v2-migration
