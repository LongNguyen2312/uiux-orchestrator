## rep4 (v0.6.0-pre, before the 2 skill fixes) scored with key v4

Decisions scored: 39 (scenarios: 39; missing: none)

| Metric | Correct | Total | Rate |
|---|---|---|---|
| 1. Platform detection | 39 | 39 | 100% |
| 2. Intent classification | 39 | 39 | 100% |
| 3. Workflow selection | 39 | 39 | 100% |
| 4. Skill selection (must ∧ ¬must-not) | 38 | 39 | 97% |
| Fast-path decision | 39 | 39 | 100% |
| Mutation permission | 39 | 39 | 100% |
| Driver choice | 39 | 39 | 100% |
| Recommendations (user-invoked / install hints) | 2 | 2 | 100% |
| Ask-user decision | 15 | 16 | 94% |
| Status honesty (≤ best reachable) | 39 | 39 | 100% |
| Execution mode | 2 | 2 | 100% |
| 5. Unnecessary skill invocations | 0 | 54 selected | 0% |
| Skill files consulted per scenario (avg) | — | 39 | 8.7 files |
| Registry read in full | 0 | 39 | 0% |

### Mismatches

- S38: failed ['skills']; selected=['callstack/agent-device']; must=[['impeccable/critique', 'impeccable/audit']]; violations=[]; unnecessary=[]; got platform=android workflow=review intents=['ui-review'] fast_path=False driver=None status=Passed mode=single
- S31: failed ['ask']; selected=['impeccable/audit', 'impeccable/critique']; must=[['impeccable/critique']]; violations=[]; unnecessary=[]; got platform=web workflow=redesign intents=['redesign'] fast_path=False driver=None status=Passed with limitations mode=multi-agent
