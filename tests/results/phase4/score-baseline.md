## baseline, no orchestrator (1 rep × 34)

Decisions scored: 34 (scenarios: 34; missing: none)

| Metric | Correct | Total | Rate |
|---|---|---|---|
| 1. Platform detection | 34 | 34 | 100% |
| 2. Intent classification | 34 | 34 | 100% |
| 3. Workflow selection | 34 | 34 | 100% |
| 4. Skill selection (must ∧ ¬must-not) | 28 | 34 | 82% |
| Mutation permission | 34 | 34 | 100% |
| Driver choice | 13 | 34 | 38% |
| Recommendations (user-invoked / install hints) | 1 | 2 | 50% |
| Ask-user decision | 12 | 13 | 92% |
| Status honesty (≤ best reachable) | 31 | 34 | 91% |
| Execution mode | 2 | 2 | 100% |
| 5. Unnecessary skill invocations | 17 | 54 selected | 31% |

### Mismatches

- S22: failed ['driver']; selected=['callstack/agent-device', 'swm/react-native-best-practices']; must=[]; violations=[]; unnecessary=['callstack/agent-device', 'swm/react-native-best-practices']; got platform=react-native-expo workflow=bug-fix intents=['ui-bug-fix', 'responsive'] fast_path=None driver=react-native-best-practices status=Passed mode=single
- S30: failed ['status']; selected=['uupm/search']; must=[]; violations=[]; unnecessary=['uupm/search']; got platform=unsupported workflow=improvement intents=['ui-improvement'] fast_path=None driver=None status=Passed with limitations mode=single
- S24: failed ['skills']; selected=['callstack/agent-device']; must=[['impeccable/audit']]; violations=[]; unnecessary=[]; got platform=flutter workflow=accessibility intents=['accessibility'] fast_path=None driver=None status=Passed with limitations mode=single
- S08: failed ['driver', 'status']; selected=['emil/animate', 'emil/animation-performance']; must=[['emil/animate']]; violations=[]; unnecessary=[]; got platform=web workflow=animation intents=['animation', 'ui-implementation'] fast_path=None driver=animate status=Passed mode=single
- S03: failed ['skills', 'driver']; selected=['impeccable/new-work']; must=[]; violations=['impeccable/new-work']; unnecessary=['impeccable/new-work']; got platform=web workflow=design intents=['new-ui-design', 'ui-implementation'] fast_path=None driver=impeccable status=Passed mode=single
- S32: failed ['driver']; selected=['twostraws/swiftui-pro']; must=[]; violations=[]; unnecessary=['twostraws/swiftui-pro']; got platform=ios workflow=review intents=['ui-review', 'responsive'] fast_path=None driver=swiftui-pro status=Needs review mode=single
- S21: failed -; selected=['callstack/agent-device']; must=[]; violations=[]; unnecessary=['callstack/agent-device']; got platform=android workflow=bug-fix intents=['ui-bug-fix', 'responsive'] fast_path=None driver=None status=Passed mode=single
- S07: failed ['driver']; selected=['impeccable/typeset']; must=[]; violations=[]; unnecessary=[]; got platform=web workflow=improvement intents=['ui-improvement'] fast_path=None driver=impeccable status=Passed mode=single
- S10: failed ['skills', 'driver']; selected=['expo/expo-animation', 'swm/react-native-best-practices']; must=[['emil/animate-expo', 'expo/expo-animation']]; violations=['swm/react-native-best-practices']; unnecessary=['swm/react-native-best-practices']; got platform=react-native-expo workflow=animation intents=['animation', 'ui-improvement'] fast_path=None driver=expo-animation status=Passed with limitations mode=single
- S06: failed ['skills', 'driver']; selected=['impeccable/critique', 'impeccable/new-work']; must=[['impeccable/critique']]; violations=['impeccable/new-work']; unnecessary=['impeccable/new-work']; got platform=web workflow=redesign intents=['redesign'] fast_path=None driver=impeccable status=Passed mode=single
- S31: failed ['driver']; selected=['expo/design-system', 'expo/native-ui', 'impeccable/critique', 'impeccable/shape', 'swm/react-native-best-practices']; must=[['impeccable/critique']]; violations=[]; unnecessary=['expo/design-system', 'swm/react-native-best-practices']; got platform=web workflow=redesign intents=['redesign', 'design-system'] fast_path=None driver=impeccable status=Passed with limitations mode=multi-agent
- S26: failed ['driver']; selected=['impeccable/document']; must=[]; violations=[]; unnecessary=[]; got platform=web workflow=design-system intents=['design-system'] fast_path=None driver=impeccable status=Passed mode=single
- S12: failed ['skills', 'driver']; selected=['emil/animate', 'emil/apple-design', 'twostraws/swiftui-pro']; must=[]; violations=['emil/animate']; unnecessary=['emil/animate', 'emil/apple-design', 'twostraws/swiftui-pro']; got platform=ios workflow=animation intents=['animation'] fast_path=None driver=swiftui-pro status=Passed with limitations mode=single
- S16: failed ['driver']; selected=['emil/remove-animations']; must=[['emil/remove-animations']]; violations=[]; unnecessary=[]; got platform=web workflow=animation intents=['animation', 'ui-improvement'] fast_path=None driver=remove-animations status=Passed mode=single
- S27: failed ['ask']; selected=['impeccable/critique', 'taste/design-taste-frontend']; must=[['taste/design-taste-frontend', 'impeccable/new-work']]; violations=[]; unnecessary=[]; got platform=web workflow=design intents=['new-ui-design'] fast_path=None driver=design-taste-frontend status=Passed mode=sequential-review
- S34: failed ['driver']; selected=['emil/design-eng']; must=[]; violations=[]; unnecessary=['emil/design-eng']; got platform=web workflow=review intents=['ui-review', 'animation'] fast_path=None driver=emil-design-eng status=Passed mode=single
- S04: failed -; selected=['expo/design-system', 'expo/native-ui', 'expo/router', 'impeccable/shape', 'swm/react-native-best-practices']; must=[['impeccable/new-work', 'uupm/design-system', 'expo/native-ui']]; violations=[]; unnecessary=['expo/router', 'swm/react-native-best-practices']; got platform=react-native-expo workflow=design intents=['new-ui-design', 'ui-implementation'] fast_path=None driver=expo-native-ui status=Passed with limitations mode=single
- S25: failed ['driver']; selected=['android/adaptive', 'callstack/agent-device']; must=[['android/adaptive']]; violations=[]; unnecessary=[]; got platform=android workflow=improvement intents=['responsive'] fast_path=None driver=adaptive status=Passed mode=single
- S13: failed ['driver']; selected=['android/navigation-event', 'callstack/agent-device']; must=[['android/navigation-event']]; violations=[]; unnecessary=[]; got platform=android workflow=animation intents=['animation'] fast_path=None driver=navigation-event status=Passed with limitations mode=single
- S17: failed ['driver']; selected=['impeccable/critique', 'vercel/web-design-guidelines']; must=[['impeccable/critique']]; violations=[]; unnecessary=[]; got platform=web workflow=review intents=['ui-review'] fast_path=None driver=impeccable status=Passed mode=single
- S09: failed ['driver', 'status']; selected=['gsap/react', 'gsap/scrolltrigger']; must=[['gsap/scrolltrigger'], ['gsap/react', 'gsap/core']]; violations=[]; unnecessary=[]; got platform=web workflow=animation intents=['animation'] fast_path=None driver=gsap-scrolltrigger status=Passed mode=single
- S11: failed ['driver']; selected=['expo/expo-animation', 'swm/react-native-best-practices']; must=[['emil/animate-expo', 'expo/expo-animation']]; violations=[]; unnecessary=[]; got platform=react-native-cli workflow=animation intents=['animation', 'ui-improvement'] fast_path=None driver=expo-animation status=Passed with limitations mode=single
- S19: failed ['driver']; selected=['impeccable/audit', 'impeccable/critique', 'vercel/web-design-guidelines']; must=[['impeccable/critique'], ['impeccable/audit']]; violations=[]; unnecessary=[]; got platform=web workflow=review intents=['ui-review', 'accessibility'] fast_path=None driver=impeccable status=Passed with limitations mode=sequential-review
- S15: failed ['driver']; selected=['emil/improve-animations']; must=[['emil/improve-animations']]; violations=[]; unnecessary=[]; got platform=web workflow=review intents=['ui-review', 'animation'] fast_path=None driver=improve-animations status=Passed mode=single
- S18: failed ['driver']; selected=['callstack/agent-device', 'impeccable/critique', 'twostraws/swiftui-pro']; must=[['impeccable/critique']]; violations=[]; unnecessary=[]; got platform=ios workflow=review intents=['ui-review'] fast_path=None driver=impeccable status=Passed mode=single
- S28: failed ['recommend']; selected=[]; must=[]; violations=[]; unnecessary=[]; got platform=web workflow=redesign intents=['redesign'] fast_path=None driver=None status=Passed mode=single
- S05: failed ['skills']; selected=['impeccable/redesign']; must=[['impeccable/new-work', 'uupm/design-system'], ['impeccable/critique', 'impeccable/audit']]; violations=[]; unnecessary=['impeccable/redesign']; got platform=web workflow=redesign intents=['redesign', 'design-system'] fast_path=None driver=impeccable status=Needs review mode=multi-agent
- S23: failed ['driver']; selected=['impeccable/audit', 'vercel/web-design-guidelines']; must=[['impeccable/audit']]; violations=[]; unnecessary=[]; got platform=web workflow=accessibility intents=['accessibility'] fast_path=None driver=impeccable status=Passed with limitations mode=single
