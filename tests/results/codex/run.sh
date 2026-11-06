#!/bin/bash
O=/tmp/uiux-eval/codex
codex exec -C /tmp/uiux-runs/C1 -s read-only --skip-git-repo-check --json "Review the dashboard screen and identify UX problems. Do not modify the code." > $O/C1.jsonl 2> $O/C1.err; echo "C1 $?"
codex exec -C /tmp/uiux-runs/C2 -s workspace-write --skip-git-repo-check --json "On the pricing page the plan name 'Professional Annual' is cut off on small phones. Fix it." > $O/C2.jsonl 2> $O/C2.err; echo "C2 $?"
codex exec -C /tmp/uiux-runs/C3 -s read-only --skip-git-repo-check --json "Use the uiux-orchestrator skill. The FAQ on the Help page opens and closes abruptly; make it feel smooth and polished. For now, only produce the start summary and the execution plan the skill defines (workflow, slots, picks with reasons, validation) — do not edit files." > $O/C3.jsonl 2> $O/C3.err; echo "C3 $?"
