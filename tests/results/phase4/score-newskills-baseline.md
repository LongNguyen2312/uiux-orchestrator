## New skills — baseline (1 × 10)

Decisions scored: 10 (scenarios: 39; missing: ['S01', 'S02', 'S04', 'S05', 'S07', 'S08', 'S09', 'S10', 'S11', 'S12', 'S13', 'S14', 'S15', 'S16', 'S19', 'S20', 'S22', 'S23', 'S24', 'S25', 'S26', 'S27', 'S28', 'S29', 'S30', 'S31', 'S32', 'S33', 'S34'])

| Metric | Correct | Total | Rate |
|---|---|---|---|
| 1. Platform detection | 10 | 10 | 100% |
| 2. Intent classification | 10 | 10 | 100% |
| 3. Workflow selection | 10 | 10 | 100% |
| 4. Skill selection (must ∧ ¬must-not) | 8 | 10 | 80% |
| Mutation permission | 10 | 10 | 100% |
| Driver choice | 3 | 10 | 30% |
| Ask-user decision | 7 | 7 | 100% |
| Status honesty (≤ best reachable) | 10 | 10 | 100% |
| 5. Unnecessary skill invocations | 4 | 17 selected | 24% |

### Mismatches

- S37: failed ['driver']; selected=['callstack/agent-device', 'dickwu/apple-design', 'twostraws/swiftui-pro']; must=[['dickwu/apple-design']]; violations=[]; unnecessary=[]; got platform=ios workflow=review intents=['ui-review'] fast_path=None driver=apple-design (dickwu) status=Passed with limitations mode=sequential-review
- S03: failed ['skills', 'driver']; selected=['impeccable/new-work']; must=[]; violations=['impeccable/new-work']; unnecessary=['impeccable/new-work']; got platform=web workflow=design intents=['new-ui-design', 'ui-implementation'] fast_path=None driver=impeccable craft status=Passed mode=single
- S38: failed ['driver']; selected=['callstack/agent-device', 'impeccable/critique']; must=[['impeccable/critique', 'impeccable/audit']]; violations=[]; unnecessary=[]; got platform=android workflow=review intents=['ui-review'] fast_path=None driver=impeccable critique status=Passed mode=single
- S18: failed ['driver']; selected=['dickwu/apple-design', 'impeccable/critique']; must=[['impeccable/critique']]; violations=[]; unnecessary=[]; got platform=ios workflow=review intents=['ui-review'] fast_path=None driver=apple-design (dickwu) status=Passed with limitations mode=sequential-review
- S39: failed ['driver']; selected=['callstack/agent-device', 'dickwu/apple-design', 'impeccable/critique', 'swm/react-native-best-practices']; must=[['impeccable/critique']]; violations=[]; unnecessary=['swm/react-native-best-practices']; got platform=react-native-expo workflow=review intents=['ui-review'] fast_path=None driver=impeccable critique status=Passed mode=sequential-review
- S06: failed ['skills', 'driver']; selected=['impeccable/new-work', 'impeccable/shape']; must=[['impeccable/critique']]; violations=['impeccable/new-work']; unnecessary=['impeccable/new-work', 'impeccable/shape']; got platform=web workflow=redesign intents=['redesign'] fast_path=None driver=impeccable craft status=Passed mode=single
- S17: failed ['driver']; selected=['impeccable/critique', 'vercel/web-design-guidelines']; must=[['impeccable/critique']]; violations=[]; unnecessary=[]; got platform=web workflow=review intents=['ui-review'] fast_path=None driver=impeccable critique status=Passed mode=sequential-review
