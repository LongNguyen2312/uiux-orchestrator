## HELD-OUT baseline (1 rep × 8)

Decisions scored: 8 (scenarios: 8; missing: none)

| Metric | Correct | Total | Rate |
|---|---|---|---|
| 1. Platform detection | 8 | 8 | 100% |
| 2. Intent classification | 8 | 8 | 100% |
| 3. Workflow selection | 7 | 8 | 88% |
| 4. Skill selection (must ∧ ¬must-not) | 4 | 8 | 50% |
| Mutation permission | 8 | 8 | 100% |
| Driver choice | 1 | 8 | 12% |
| Ask-user decision | 1 | 1 | 100% |
| Status honesty (≤ best reachable) | 8 | 8 | 100% |
| 5. Unnecessary skill invocations | 7 | 15 selected | 47% |

### Mismatches

- H01: failed ['driver']; selected=['impeccable/polish']; must=[]; violations=[]; unnecessary=[]; got platform=web workflow=improvement intents=['ui-improvement'] fast_path=None driver=impeccable status=Passed mode=single
- H02: failed ['skills', 'driver']; selected=['callstack/agent-device', 'emil/apple-design', 'twostraws/swiftui-pro']; must=[]; violations=['emil/apple-design']; unnecessary=['emil/apple-design', 'twostraws/swiftui-pro']; got platform=ios workflow=bug-fix intents=['ui-bug-fix'] fast_path=None driver=swiftui-pro status=Passed mode=single
- H03: failed ['driver']; selected=['callstack/agent-device', 'expo/native-ui', 'swm/react-native-best-practices']; must=[]; violations=[]; unnecessary=['swm/react-native-best-practices']; got platform=react-native-expo workflow=design intents=['ui-implementation'] fast_path=None driver=react-native-best-practices status=Passed mode=single
- H04: failed ['skills', 'driver']; selected=['callstack/agent-device', 'unknown:design:accessibility-review']; must=[['impeccable/audit']]; violations=[]; unnecessary=['unknown:design:accessibility-review']; got platform=android workflow=accessibility intents=['accessibility', 'ui-review'] fast_path=None driver=design:accessibility-review status=Passed with limitations mode=single
- H05: failed ['skills', 'driver']; selected=['emil/choreograph', 'impeccable/animate']; must=[['emil/animate', 'emil/find-animation-opportunities']]; violations=[]; unnecessary=['impeccable/animate']; got platform=web workflow=animation intents=['animation', 'ui-improvement'] fast_path=None driver=impeccable status=Passed mode=single
- H06: failed ['skills', 'driver']; selected=['callstack/agent-device', 'swm/react-native-best-practices', 'unknown:superpowers:systematic-debugging']; must=[['emil/animate-expo', 'expo/expo-animation']]; violations=['swm/react-native-best-practices']; unnecessary=['swm/react-native-best-practices', 'unknown:superpowers:systematic-debugging']; got platform=react-native-cli workflow=bug-fix intents=['ui-bug-fix', 'animation'] fast_path=None driver=superpowers:systematic-debugging status=Passed with limitations mode=single
- H07: failed ['workflow', 'driver']; selected=['impeccable/shape']; must=[]; violations=[]; unnecessary=[]; got platform=web workflow=redesign intents=['design-exploration', 'redesign'] fast_path=None driver=impeccable status=Needs review mode=single
