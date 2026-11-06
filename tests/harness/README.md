# Routing harness

Measures how well an agent routes UI/UX requests, with and without `uiux-orchestrator`, against
`tests/scenarios.json`. It does not execute tasks; execution quality is covered by the Phase 3
fixture runs (`tests/results/2026-11-06-phase3-execution.md`).

## Files

| File | Purpose |
|---|---|
| `../scenarios.json` | Scenarios, each with its project facts, environment (installed / `excluded_skills`, tools) and expected routing |
| `../scenarios-heldout.json` | Held-out scenarios: same format, never used for tuning |
| `installed-skills-metadata.txt` | Name + description of every skill in the registry. This is what an agent sees before choosing |
| `batches.json` | Shuffled scenario batches per repetition (fixed seeds, so runs are reproducible) |
| `../../scripts/score_routing.py` | Scorer (Python stdlib) |

## Running

1. For each batch, start a fresh agent with the matching prompt below. Use one agent per batch,
   with no shared context between agents.
2. Each agent writes a JSON array of decisions to the output path in its prompt.
3. Score the results:
   `python3 scripts/score_routing.py out/rep1-*.json out/rep2-*.json --label with-skill --md out/with-skill.md`
   (`--key <file>` to score against another scenario file, e.g. the held-out set;
   `--normalize-intents` maps workflow-style words to intent ids)
4. Record agent token usage and wall time from the agent runtime, per batch.

## Decision schema (one object per scenario)

```json
{
  "id": "S08",
  "platform": "web | react-native-expo | react-native-cli | ios | android | flutter | unsupported",
  "intents": ["primary intent first (enum in scenarios.json)"],
  "workflow": "design | redesign | improvement | animation | review | bug-fix | design-system | accessibility",
  "fast_path": false,
  "mutation": "allowed | read-only | plan-only",
  "size": "Small | Medium | Large",
  "risk": "low | elevated | high",
  "driver": "skill name/id or null",
  "selected_skills": ["skills you would actually activate (ids, names, or 'impeccable <command>')"],
  "recommended_to_user": ["skills you would recommend to the user instead of running (user-invoked or not installed)"],
  "asks_user": false,
  "mode": "single | sequential-review | multi-agent",
  "best_status": "Passed | Passed with limitations | Needs review | Failed",
  "skill_files_consulted": ["with-skill runs only: orchestrator files used for this scenario"],
  "registry_read_fully": false,
  "notes": "one line"
}
```

Baseline runs omit `fast_path`, `skill_files_consulted` and `registry_read_fully`.

## Prompt: with skill

```text
You are a coding agent with the skill `uiux-orchestrator` at <SKILL_DIR>. For each scenario below,
act as you would at the start of the real task: follow the skill's SKILL.md and load its other files
progressively, only as it instructs (search the registry for ids instead of reading it whole). The
scenario's "project" and "environment" fields are the result of inspecting the project; nothing else
exists on disk. Installed skills: "all" means every skill in <METADATA>; [] means none. Read nothing
outside the skill directory, <METADATA>, and <SCENARIOS>. No web access.
Decide stages 1–3 (intake, project intelligence, decide) and the validation you could reach. Do not
write code. Write a JSON array of decisions (schema: <HARNESS_README>) to <OUT>, one per scenario
id in this order: <IDS>. Then reply with: the files you read, and anything unclear in the skill.
```

## Prompt: baseline (no orchestrator)

The same prompt, except the agent has no orchestrator. It sees only `<METADATA>` (skill names and
descriptions) and decides as it naturally would.
