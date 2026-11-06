#!/bin/bash
# Real triggering test: claude -p with read-only tools, 4 turns max.
OUT=/tmp/uiux-eval/trigger
run() { id="$1"; dir="$2"; prompt="$3"
  ( cd "$dir" && claude -p "$prompt" --output-format stream-json --verbose --max-turns 4 \
      --allowedTools "Skill,Read,Glob,Grep" > "$OUT/$id.jsonl" 2> "$OUT/$id.err" )
  echo "$id done ($?)"
}
run T01 /tmp/uiux-runs/T-web "Redesign the settings page. Make it modern, clean and consistent with the existing application."
run T02 /tmp/uiux-runs/T-web "The FAQ on the Help page opens and closes abruptly. Make it feel smooth and polished."
run T03 /tmp/uiux-runs/T-web "Review the dashboard screen and identify UX problems. Do not modify the code."
run T04 /tmp/uiux-runs/T-web "On the pricing page the plan name 'Professional Annual' is cut off on small phones. Fix it."
run T05 /tmp/uiux-runs/T-web "The dashboard has a 'Chart goes here' placeholder. Add the usage chart and pick the right chart type."
run T06 /tmp/uiux-runs/T-expo "Improve the animation of the onboarding flow. Steps just snap and the button feels dead."
run N01 /tmp/uiux-runs/T-web "Add a unit test for the useHashRoute hook in App.tsx."
run N02 /tmp/uiux-runs/T-web "Update the README with setup instructions for this project."
run N03 /tmp/uiux-runs/T-web "/impeccable critique src/pages/Settings.tsx"
run N04 /tmp/uiux-runs/T-web "npm install fails with ERESOLVE peer dependency errors. How do I fix it?"
