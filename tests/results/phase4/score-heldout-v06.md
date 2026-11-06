## run

Decisions scored: 8 (scenarios: 8; missing: none)

| Metric | Correct | Total | Rate |
|---|---|---|---|
| 1. Platform detection | 8 | 8 | 100% |
| 2. Intent classification | 8 | 8 | 100% |
| 3. Workflow selection | 8 | 8 | 100% |
| 4. Skill selection (must ∧ ¬must-not) | 7 | 8 | 88% |
| Fast-path decision | 6 | 6 | 100% |
| Mutation permission | 8 | 8 | 100% |
| Driver choice | 8 | 8 | 100% |
| Ask-user decision | 1 | 1 | 100% |
| Status honesty (≤ best reachable) | 8 | 8 | 100% |
| 5. Unnecessary skill invocations | 0 | 12 selected | 0% |
| Skill files consulted per scenario (avg) | — | 8 | 7.6 files |
| Registry read in full | 0 | 8 | 0% |

### Mismatches

- H06: failed ['skills']; selected=['callstack/agent-device']; must=[['emil/animate-expo', 'expo/expo-animation']]; violations=[]; unnecessary=[]; got platform=react-native-cli workflow=animation intents=['animation', 'ui-bug-fix'] fast_path=False driver=None status=Passed mode=single
