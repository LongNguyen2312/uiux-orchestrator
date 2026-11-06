## with-skill v0.3.0 (2 reps × 34)

Decisions scored: 68 (scenarios: 34; missing: none)

| Metric | Correct | Total | Rate |
|---|---|---|---|
| 1. Platform detection | 68 | 68 | 100% |
| 2. Intent classification | 56 | 68 | 82% |
| 3. Workflow selection | 68 | 68 | 100% |
| 4. Skill selection (must ∧ ¬must-not) | 68 | 68 | 100% |
| Fast-path decision | 68 | 68 | 100% |
| Mutation permission | 68 | 68 | 100% |
| Driver choice | 68 | 68 | 100% |
| Recommendations (user-invoked / install hints) | 4 | 4 | 100% |
| Ask-user decision | 25 | 26 | 96% |
| Status honesty (≤ best reachable) | 62 | 68 | 91% |
| Execution mode | 4 | 4 | 100% |
| 5. Unnecessary skill invocations | 3 | 85 selected | 4% |
| Skill files consulted per scenario (avg) | — | 68 | 8.9 files |
| Registry read in full | 12 | 68 | 18% |

### Mismatches

- S32: failed ['status']; selected=['impeccable/audit']; must=[]; violations=[]; unnecessary=[]; got platform=ios workflow=review intents=['ui-review', 'responsive'] fast_path=False driver=None status=Passed with limitations mode=single
- S08: failed ['status']; selected=['emil/animate']; must=[['emil/animate']]; violations=[]; unnecessary=[]; got platform=web workflow=animation intents=['animation', 'new-ui-design'] fast_path=False driver=None status=Passed mode=single
- S09: failed ['status']; selected=['gsap/core', 'gsap/react', 'gsap/scrolltrigger']; must=[['gsap/scrolltrigger'], ['gsap/react', 'gsap/core']]; violations=[]; unnecessary=[]; got platform=web workflow=animation intents=['animation'] fast_path=False driver=None status=Passed mode=single
- S04: failed -; selected=['expo/router', 'impeccable/audit', 'impeccable/new-work']; must=[['impeccable/new-work', 'uupm/design-system', 'expo/native-ui']]; violations=[]; unnecessary=['expo/router', 'impeccable/audit']; got platform=react-native-expo workflow=design intents=['new-ui-design'] fast_path=False driver=impeccable/new-work status=Passed with limitations mode=sequential-review
- S31: failed ['ask']; selected=['impeccable/audit', 'impeccable/critique', 'impeccable/onboard', 'impeccable/polish']; must=[['impeccable/critique']]; violations=[]; unnecessary=[]; got platform=web workflow=redesign intents=['redesign'] fast_path=False driver=None status=Passed with limitations mode=multi-agent
- S25: failed -; selected=['android/adaptive', 'callstack/agent-device', 'impeccable/audit']; must=[['android/adaptive']]; violations=[]; unnecessary=['impeccable/audit']; got platform=android workflow=improvement intents=['responsive', 'ui-improvement'] fast_path=False driver=None status=Passed mode=multi-agent
- S09: failed ['status']; selected=['gsap/core', 'gsap/react', 'gsap/scrolltrigger']; must=[['gsap/scrolltrigger'], ['gsap/react', 'gsap/core']]; violations=[]; unnecessary=[]; got platform=web workflow=animation intents=['animation'] fast_path=False driver=None status=Passed mode=single
- S32: failed ['status']; selected=['impeccable/audit']; must=[]; violations=[]; unnecessary=[]; got platform=ios workflow=review intents=['ui-review', 'responsive'] fast_path=False driver=None status=Passed with limitations mode=single
- S24: failed ['status']; selected=['callstack/agent-device', 'impeccable/audit']; must=[['impeccable/audit']]; violations=[]; unnecessary=[]; got platform=flutter workflow=accessibility intents=['accessibility', 'improvement'] fast_path=False driver=None status=Passed mode=single
- S20: failed ['intent']; selected=[]; must=[]; violations=[]; unnecessary=[]; got platform=web workflow=bug-fix intents=['bug-fix', 'responsive'] fast_path=True driver=None status=Passed mode=single
- S18: failed ['intent']; selected=['impeccable/critique']; must=[['impeccable/critique']]; violations=[]; unnecessary=[]; got platform=ios workflow=review intents=['review'] fast_path=False driver=None status=Passed mode=single
- S27: failed ['intent']; selected=['impeccable/critique', 'taste/design-taste-frontend']; must=[['taste/design-taste-frontend', 'impeccable/new-work']]; violations=[]; unnecessary=[]; got platform=web workflow=design intents=['design'] fast_path=False driver=taste/design-taste-frontend status=Passed mode=single
- S29: failed ['intent']; selected=['impeccable/new-work', 'vercel/web-design-guidelines']; must=[['impeccable/new-work']]; violations=[]; unnecessary=[]; got platform=web workflow=design intents=['design'] fast_path=False driver=impeccable/new-work status=Passed mode=single
- S21: failed ['intent']; selected=[]; must=[]; violations=[]; unnecessary=[]; got platform=android workflow=bug-fix intents=['bug-fix', 'responsive'] fast_path=True driver=None status=Passed mode=single
- S15: failed ['intent']; selected=['emil/improve-animations']; must=[['emil/improve-animations']]; violations=[]; unnecessary=[]; got platform=web workflow=animation intents=['review', 'animation'] fast_path=False driver=None status=Passed mode=single
- S04: failed ['intent']; selected=['emil/animate-expo', 'impeccable/new-work', 'impeccable/shape']; must=[['impeccable/new-work', 'uupm/design-system', 'expo/native-ui']]; violations=[]; unnecessary=[]; got platform=react-native-expo workflow=design intents=['design'] fast_path=False driver=impeccable/new-work status=Passed with limitations mode=sequential-review
- S02: failed ['intent']; selected=[]; must=[]; violations=[]; unnecessary=[]; got platform=web workflow=improvement intents=['improvement'] fast_path=True driver=None status=Passed mode=single
- S01: failed ['intent']; selected=[]; must=[]; violations=[]; unnecessary=[]; got platform=web workflow=improvement intents=['improvement'] fast_path=True driver=None status=Passed mode=single
- S17: failed ['intent']; selected=['impeccable/critique']; must=[['impeccable/critique']]; violations=[]; unnecessary=[]; got platform=web workflow=review intents=['review'] fast_path=False driver=None status=Passed mode=single
- S03: failed ['intent']; selected=['impeccable/critique', 'impeccable/shape']; must=[]; violations=[]; unnecessary=[]; got platform=web workflow=design intents=['design'] fast_path=False driver=None status=Passed mode=single
- S19: failed ['intent']; selected=['impeccable/audit', 'impeccable/critique']; must=[['impeccable/critique'], ['impeccable/audit']]; violations=[]; unnecessary=[]; got platform=web workflow=review intents=['review', 'accessibility'] fast_path=False driver=None status=Passed mode=single
