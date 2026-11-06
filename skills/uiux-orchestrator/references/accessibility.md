# Accessibility reference (WCAG 2.2 AA + platform mapping)

This is the knowledge behind `workflows/accessibility.md` and the floors in
`core/conflict-resolution.md` rung 2. Last checked: 2026-11-06 (see Sources).

## 1. WCAG 2.2 AA criteria that UI work most often touches

| SC | Level | Requirement (short) |
|---|---|---|
| 1.1.1 Non-text content | A | Images and icons that carry meaning have a text alternative; decorative ones are hidden from assistive tech |
| 1.3.1 Info and relationships | A | Structure (headings, lists, labels, groups) is exposed programmatically |
| 1.4.1 Use of color | A | Color is never the only signal |
| 1.4.3 Contrast (minimum) | AA | Text 4.5:1; large text (≥ 24px regular or ≥ 18.66px bold) 3:1 |
| 1.4.4 Resize text | AA | Text resizes to 200% without loss of content or function |
| 1.4.10 Reflow | AA | No two-dimensional scrolling at 320 CSS px width (vertical content) or 256 CSS px height (horizontal content), except content that needs it (maps, data tables) |
| 1.4.11 Non-text contrast | AA | UI components and meaningful graphics: 3:1 against adjacent colors |
| 1.4.12 Text spacing | AA | Works with line height 1.5, paragraph spacing 2×, letter spacing 0.12em, word spacing 0.16em |
| 1.4.13 Content on hover or focus | AA | Tooltips/popovers can be dismissed, hovered and stay visible |
| 2.1.1 Keyboard | A | Everything is operable by keyboard (web; also hardware keyboards on mobile) |
| 2.2.2 Pause, stop, hide | A | Auto-moving content longer than 5 s can be paused |
| 2.4.3 Focus order | A | Focus order preserves meaning |
| 2.4.7 Focus visible | AA | A keyboard focus indicator is visible |
| 2.4.11 Focus not obscured (minimum) | AA | A focused element is not entirely hidden by sticky headers, footers or overlays |
| 2.5.7 Dragging movements | AA | Any drag action has a single-pointer alternative (tap/click) |
| 2.5.8 Target size (minimum) | AA | Targets ≥ 24×24 CSS px, or enough spacing (exceptions: inline, equivalent control, essential, user-agent) |
| 3.2.6 Consistent help | A | Help mechanisms repeated across pages (contact details, contact form, self-help, chat) appear in the same relative order |
| 3.3.1 / 3.3.3 Error identification / suggestion | A / AA | Errors are identified in text, with a correction suggestion |
| 3.3.7 Redundant entry | A | Information already entered in a process is auto-filled or selectable (exceptions: essential, security, no longer valid) |
| 3.3.8 Accessible authentication (minimum) | AA | No cognitive test (e.g. memorizing, transcribing) to log in, unless an alternative exists; allow paste and password managers |
| 4.1.2 Name, role, value | A | Custom controls expose name, role, state and value |
| 4.1.3 Status messages | AA | Status updates are announced without moving focus |

Platform target sizes beyond WCAG's minimum: Android/Material 48×48 dp (enforced by Material
components). iOS HIG default control size is 44×44 pt with a 28×28 pt minimum. Use 44 pt for
touch-first controls and go below it only for dense secondary controls with spacing. Flutter's
guideline matchers test 48×48 (Android) and 44×44 (iOS).

## 2. Platform mapping

| Area | Web | iOS | Android | Flutter | React Native |
|---|---|---|---|---|---|
| Name / role / state | Semantic HTML first; ARIA only to fill gaps | `accessibilityLabel`/`Traits`/`Value`; SwiftUI `.accessibilityLabel`, `.accessibilityAddTraits` | `contentDescription`; Compose `semantics { }`, `Role` | `Semantics`, `semanticLabel`, `excludeSemantics` | `accessibilityLabel`, `accessibilityRole` / `role`, `accessibilityState` / `aria-*` |
| Grouping | `fieldset`/`legend`, `role="group"` | `.accessibilityElement(children: .combine)` | `Modifier.semantics(mergeDescendants = true)` | `MergeSemantics` | `accessible={true}` on the container |
| Focus / order | DOM order, `:focus-visible`, trap in dialogs, return focus on close | VoiceOver order, `accessibilitySortPriority` | TalkBack order, `traversalIndex`, `isTraversalGroup` | `FocusTraversalGroup`, `OrderedTraversalPolicy` | platform order; `accessibilityViewIsModal` (iOS) |
| Live updates | `aria-live`, `role="status"` | `AccessibilityNotification.Announcement` / `UIAccessibility.post` | `liveRegion` semantics | `SemanticsService.announce` / `liveRegion` | `AccessibilityInfo.announceForAccessibility` |
| Text scaling | `rem`, 200% zoom, no fixed heights on text containers | Dynamic Type incl. accessibility sizes; `@ScaledMetric` | `sp`; font scale up to 200% (non-linear) | `MediaQuery.textScalerOf` | `allowFontScaling` (default on); `maxFontSizeMultiplier` only for chrome |
| Reduce motion | `prefers-reduced-motion` | `accessibilityReduceMotion` / `UIAccessibility.isReduceMotionEnabled` | animator duration scale / "Remove animations" | `MediaQuery.disableAnimationsOf` | `AccessibilityInfo.isReduceMotionEnabled`, Reanimated `useReducedMotion` |
| Other prefs | `prefers-contrast`, `forced-colors`, `prefers-reduced-transparency` | Bold Text, Increase Contrast, Reduce Transparency, Smart Invert | high-contrast text, color correction | `MediaQuery.highContrastOf`, `boldTextOf` | `AccessibilityInfo` events |
| Automated checks | axe, Lighthouse | Accessibility Inspector audit; `XCUIApplication.performAccessibilityAudit()` | Accessibility Scanner; ATF checks in Espresso/Compose tests | `meetsGuideline(...)` matchers | the platform tools above |

WCAG 2.2 is the current W3C Recommendation (Dec 2024); WCAG 3 is still a Working Draft (checked 2026-11-06), so do not cite it as a requirement.
Exact API availability depends on OS/library versions. Confirm in `platforms/<platform>.md`.

## 3. Manual checks that automated tools miss

1. Complete the main task with only a screen reader (VoiceOver / TalkBack / NVDA or VoiceOver on
   the web).
2. Complete it with only a keyboard (web; iPad and Android with a hardware keyboard if supported).
3. Largest text setting: nothing clipped or overlapping; the primary action is still reachable.
4. Reduced motion on: no essential content lost.
5. Zoom/reflow to 320 CSS px (web).
6. Color-blind simulation, or a check that no information relies on color alone.
7. Error states: announced, described in text, focus moves to the first error or a summary.

## Sources

- WCAG 2.2: https://www.w3.org/TR/WCAG22/ · Understanding docs: https://www.w3.org/WAI/WCAG22/Understanding/
- Apple Accessibility HIG: https://developer.apple.com/design/human-interface-guidelines/accessibility
- Android accessibility: https://developer.android.com/guide/topics/ui/accessibility
- Flutter accessibility: https://docs.flutter.dev/ui/accessibility
- React Native accessibility: https://reactnative.dev/docs/accessibility
