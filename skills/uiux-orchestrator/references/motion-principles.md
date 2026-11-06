# Motion principles (cross-platform)

The knowledge behind `workflows/animation.md`. Platform APIs live in `platforms/<platform>.md`
§ Animation. These are principles, not rules imposed over a platform's own motion system: when a
platform defines motion tokens (Material 3 motion scheme, SwiftUI default springs), use the
platform's values first.

Sources: Apple HIG — Motion; Material 3 — Motion; WCAG 2.2 SC 2.3.3 (AAA) and 2.2.2; Emil Kowalski,
"Animations on the web" and the `emil/*` skills (principles only). Last checked: 2026-11-06.

## 1. Motion needs a job

| Job | Example | Typical form |
|---|---|---|
| Feedback | button press, toggle, success/error | short, immediate, on the touched element |
| State change | expand/collapse, select, tab switch | animate the property that changed |
| Spatial continuity | push/pop, sheet, shared element, popover from its trigger | transform from the origin, symmetric enter/exit paths |
| Attention | new message, required action | rare; once, not looping |
| Direct manipulation | drag, swipe, pinch, pull | tracks the finger 1:1, settles with a spring |

No job → no motion. Don't animate:
- actions the user repeats many times a minute (keyboard shortcuts, list scrolling, typing);
- data that changes constantly;
- whole pages "on scroll" just for decoration.

On Operate surfaces (apps, dashboards, settings), motion is mostly feedback and continuity.

## 2. Timing

| Kind | Default duration | Curve |
|---|---|---|
| Press feedback | 100–160 ms, or a stiff spring | ease-out; scale ≥ 0.95, never from 0 |
| Small UI state change (toggle, hover, tooltip) | 150–250 ms | ease-out |
| Enter / expand | 200–300 ms | strong ease-out, e.g. `cubic-bezier(0.23, 1, 0.32, 1)` |
| Exit / collapse | ~20–30% shorter than enter | ease-in or ease-out |
| Move within the screen | 250–400 ms, longer for longer distances | ease-in-out |
| Full-screen / navigation transition | platform default | platform default |
| Stagger | 20–50 ms per item | total spread under ~300 ms |

- Larger elements and longer distances take longer.
- Small, frequent interactions should be faster.
- Never use one duration for everything.
- Avoid linear easing for UI movement. It is fine for progress, spinners and scrubbed
  scroll-linked values.

## 3. Springs

Use springs for gesture-driven and interruptible motion. Define them by perceptual duration and
bounce (SwiftUI `.spring(duration:bounce:)`, Compose `spring(dampingRatio, stiffness)`, Motion
`visualDuration` + `bounce`), not by guessed stiffness numbers.

- No bounce (critically damped) is the default for UI.
- Use a small bounce (≈ 0.1–0.2) only for playful or physical metaphors.
- After a gesture, hand the release velocity to the spring so motion continues instead of
  restarting.

## 4. Interruption and choreography

- Every animation must be interruptible and reversible mid-flight without jumping. Don't queue
  animations on rapid taps.
- Input is never blocked while something animates.
- In a group, one element leads; others follow with small offsets; things that don't change stay
  still.
- Exits are simpler and faster than entries.
- Origin-aware: menus and popovers scale from their trigger; sheets come from the edge they rest on.

## 5. Performance

- Animate compositor-friendly properties: transform (translate/scale/rotate) and opacity.
- Avoid animating layout (width, height, top/left, margins) except through the platform's own layout
  animation systems (e.g. Compose `animateContentSize`, Reanimated layout animations, SwiftUI
  matched geometry). Those are optimized for it.
- Keep animation work off the busy thread: CSS/WAAPI on the web, UI-thread worklets in Reanimated,
  no per-frame React re-render, `AnimatedBuilder` scope in Flutter.
- Judge smoothness on a release/profile build on a modest device. Debug builds and simulators lie.

## 6. Reduced motion and vestibular safety

- Every platform exposes a reduce-motion preference. Honour it:
  - replace movement and zoom with opacity or an instant change;
  - stop parallax and autoplaying loops;
  - keep essential feedback.
- Never let content exist *only* inside an animation (e.g. text that appears only via a reveal).
  With reduced motion it must still be visible.
- Anything that moves, blinks or scrolls automatically for more than 5 s needs a way to pause it
  (WCAG 2.2.2, A).
- Large parallax, spinning and zoom effects are the main vestibular triggers. Avoid them by default.

## 7. Consistency

Inside one product:
- the same kind of change uses the same motion everywhere;
- define a small set of motion tokens (2–3 durations, 1–2 curves, 1–2 springs) when a design
  system exists or is being created.
