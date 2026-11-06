#!/usr/bin/env python3
"""Validate the uiux-orchestrator skill. Python 3 stdlib only.

Checks
  1. SKILL.md frontmatter against the Agent Skills specification (agentskills.io).
  2. SKILL.md length (< 500 lines recommended by the spec).
  3. Every relative Markdown link in the skill resolves.
  4. Every skill id referenced in Markdown (`provider/name`) exists in registry/skills.yaml.
  5. Every `ref/...` id referenced exists in the registry's references list.
  6. Registry ids are unique; every equivalent_to and complements target exists.
  7. Bundled scripts pass `node --check` (when Node is available).
  8. Every registry entry has the required metadata fields and valid platform ids.
  9. The slot index (decision-engine §3) and registry `slots` agree in both directions.
 10. Warns when registry `verified_on` or platform "Last checked" dates are older than 180 days.

Usage: python3 scripts/validate.py [skill_dir]   (default: skills/uiux-orchestrator)
Exit code 0 = all checks pass, 1 = failures printed.
"""
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
SKILL_DIR = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / "skills" / "uiux-orchestrator"
NAME_RE = re.compile(r"^(?!-)(?!.*--)[a-z0-9-]{1,64}(?<!-)$")
ALLOWED_KEYS = {"name", "description", "license", "compatibility", "metadata", "allowed-tools"}
# Backticked tokens that look like ids but are paths or library names, not registry ids.
NOT_IDS = {"next/font", "res/font", "motion/react"}

errors = []


def fail(msg):
    errors.append(msg)


def parse_frontmatter(text):
    if not text.startswith("---\n"):
        fail("SKILL.md: missing YAML frontmatter")
        return {}
    end = text.index("\n---", 4)
    fm, top, current = text[4:end], {}, None
    for line in fm.splitlines():
        if not line.strip():
            continue
        if line.startswith(" ") and current == "metadata":
            k, _, v = line.strip().partition(":")
            v = v.strip()
            if not (v.startswith('"') and v.endswith('"')):
                fail(f"metadata.{k}: value must be a quoted string (spec: string→string map)")
            top["metadata"][k] = v.strip('"')
            continue
        k, _, v = line.partition(":")
        current = k.strip()
        top[current] = {} if current == "metadata" else v.strip()
    return top


def check_skill_md():
    path = SKILL_DIR / "SKILL.md"
    text = path.read_text()
    fm = parse_frontmatter(text)
    for key in fm:
        if key not in ALLOWED_KEYS:
            fail(f"frontmatter: unknown key '{key}' (spec allows {sorted(ALLOWED_KEYS)})")
    name = fm.get("name", "")
    if not NAME_RE.match(name):
        fail(f"frontmatter.name '{name}' violates naming rules")
    if name != SKILL_DIR.name:
        fail(f"frontmatter.name '{name}' must match directory '{SKILL_DIR.name}'")
    desc = fm.get("description", "")
    if not 1 <= len(desc) <= 1024:
        fail(f"frontmatter.description length {len(desc)} not in 1..1024")
    comp = fm.get("compatibility")
    if comp is not None and not 1 <= len(comp) <= 500:
        fail(f"frontmatter.compatibility length {len(comp)} not in 1..500")
    lines = text.count("\n") + 1
    if lines >= 500:
        fail(f"SKILL.md has {lines} lines (spec recommends < 500)")
    return lines, len(text.split())


def check_links():
    for md in SKILL_DIR.rglob("*.md"):
        for target in re.findall(r"\]\(([^)#\s]+)(?:#[^)]*)?\)", md.read_text()):
            if re.match(r"^[a-z]+://", target):
                continue
            if not (md.parent / target).exists():
                fail(f"{md.relative_to(SKILL_DIR)}: broken link -> {target}")


def check_registry():
    reg = (SKILL_DIR / "registry" / "skills.yaml").read_text()
    ids = re.findall(r"^\s*-?\s*\{?\s*id:\s*([a-z0-9]+/[a-z0-9-]+)", reg, re.M)
    refs = {i for i in ids if i.startswith("ref/")}
    skills = [i for i in ids if not i.startswith("ref/")]
    dups = sorted({i for i in skills if skills.count(i) > 1})
    if dups:
        fail(f"registry: duplicate ids {dups}")
    for group in re.findall(r"(?:equivalent_to|complements):\s*\[([^\]]*)\]", reg):
        for target in filter(None, (t.strip() for t in group.split(","))):
            if target not in skills:
                fail(f"registry: equivalent_to unknown id {target}")
    for md in SKILL_DIR.rglob("*.md"):
        for token in set(re.findall(r"`([a-z0-9]+/[a-z0-9-]+)`", md.read_text())):
            if token in NOT_IDS or token.split("/")[0] in {"workflows", "core", "registry", "references", "platforms"}:
                continue
            if token.startswith("ref/"):
                if token not in refs:
                    fail(f"{md.relative_to(SKILL_DIR)}: unknown reference id {token}")
            elif token not in skills:
                fail(f"{md.relative_to(SKILL_DIR)}: unknown skill id {token}")
    return len(skills), len(refs)


REQUIRED_FIELDS = ["names", "role", "invocation", "slots", "platforms", "priority", "value_if_missing",
                   "use_when", "capabilities", "required_inputs", "expected_outputs"]
PLATFORM_IDS = {"web", "react-native", "ios", "android", "flutter", "any"}
FRAMEWORK_IDS = {"any", "react", "nextjs", "vue", "nuxt", "svelte", "sveltekit", "angular", "astro", "html",
                 "expo", "react-native-cli", "swiftui", "uikit", "compose", "views", "flutter"}
def field_re(name):
    return r"(?:^|[\s{,])" + re.escape(name) + r":\s*(\[[^\]]*\]|\{[^}]*\}|[^,}\n]+)"


def registry_entries():
    """Parse registry/skills.yaml without a YAML library: providers, shared blocks, entries."""
    text = (SKILL_DIR / "registry" / "skills.yaml").read_text()
    text = text.split("\nreferences:")[0]
    entries = {}
    for prov in re.split(r"\n  - provider:", text)[1:]:
        shared = ""
        if "\n    shared:" in prov:
            shared = prov.split("\n    shared:")[1].split("\n    skills:")[0]
        skills_part = prov.split("\n    skills:")[1] if "\n    skills:" in prov else ""
        for blk in re.split(r"\n      - (?=\{?\s*id:)", skills_part)[1:]:
            m = re.match(r"\{?\s*id:\s*([a-z0-9]+/[a-z0-9-]+)", blk)
            if m:
                entries[m.group(1)] = (blk, shared)
    return entries


def field(blk, shared, name):
    for src in (blk, shared):
        m = re.search(field_re(name), src, re.M)
        if m:
            v = m.group(1).strip()
            if v.startswith("["):
                return [x.strip().strip('"').strip("'") for x in v[1:-1].split(",") if x.strip()]
            return v
        if re.search(r"^\s+" + re.escape(name) + r":\s*$", src, re.M) or re.search(r"^\s+" + re.escape(name) + r":\s*>-?\s*$", src, re.M):
            return ["(block)"]
    return None


def check_registry_fields_and_index():
    entries = registry_entries()
    for sid, (blk, shared) in entries.items():
        for f in REQUIRED_FIELDS:
            if field(blk, shared, f) in (None, [], ""):
                fail(f"registry {sid}: missing required field '{f}' (entry or provider shared)")
        fws = field(blk, shared, "frameworks") or []
        badf = [x for x in fws if x not in FRAMEWORK_IDS]
        if badf:
            fail(f"registry {sid}: unknown framework ids {badf} (see core/skill-registry.md)")
        plats = field(blk, shared, "platforms") or []
        bad = [x for x in plats if x not in PLATFORM_IDS]
        if bad:
            fail(f"registry {sid}: unknown platform ids {bad}")
    # slot index in decision-engine §3
    de = (SKILL_DIR / "core" / "decision-engine.md").read_text()
    sec = de.split("## 3. Slot index")[1].split("\n## 4.")[0]
    rows = {}
    for line in sec.splitlines():
        m = re.match(r"\|\s*([a-z-]+)\s*\|(.*?)\|", line)
        if m and m.group(1) not in ("slot",):
            rows[m.group(1)] = set(re.findall(r"`([a-z0-9]+/[a-z0-9*-]+)`", m.group(2)))
    for sid, (blk, shared) in entries.items():
        provider = sid.split("/")[0]
        for slot in field(blk, shared, "slots") or []:
            if slot not in rows:
                fail(f"registry {sid}: slot '{slot}' has no row in decision-engine §3")
            elif sid not in rows[slot] and f"{provider}/*" not in rows[slot]:
                fail(f"decision-engine §3: row '{slot}' is missing {sid}")
    for slot, ids in rows.items():
        for rid in ids:
            if rid.endswith("/*"):
                prov = rid.split("/")[0]
                if not any(k.startswith(prov + "/") and slot in (field(*entries[k], "slots") or []) for k in entries):
                    fail(f"decision-engine §3: row '{slot}' lists {rid} but no {prov} entry has that slot")
            elif rid not in entries:
                fail(f"decision-engine §3: row '{slot}' lists unknown id {rid}")
            elif slot not in (field(*entries[rid], "slots") or []):
                fail(f"decision-engine §3: row '{slot}' lists {rid}, whose registry slots don't include it")
    return len(rows)


STALE_DAYS = 180


def check_freshness():
    """Warn (not fail) when verified facts are older than STALE_DAYS."""
    import datetime
    today = datetime.date.today()
    warnings = []
    reg = (SKILL_DIR / "registry" / "skills.yaml").read_text()
    for prov, date in re.findall(r"provider: ([a-z0-9-]+)[\s\S]*?verified_on: (\d{4}-\d{2}-\d{2})", reg):
        age = (today - datetime.date.fromisoformat(date)).days
        if age > STALE_DAYS:
            warnings.append(f"registry provider '{prov}' verified {age} days ago ({date})")
    for md in sorted((SKILL_DIR / "platforms").glob("*.md")):
        m = re.search(r"Last checked: (\d{4}-\d{2}-\d{2})", md.read_text())
        if m and (today - datetime.date.fromisoformat(m.group(1))).days > STALE_DAYS:
            warnings.append(f"{md.name} last checked {m.group(1)}")
    return warnings


def check_scripts():
    """Syntax-check bundled Node scripts when Node is available (skipped otherwise)."""
    import shutil
    import subprocess
    node = shutil.which("node")
    scripts = sorted((SKILL_DIR / "scripts").rglob("*.mjs")) if (SKILL_DIR / "scripts").exists() else []
    if not node or not scripts:
        return len(scripts), False
    for js in scripts:
        r = subprocess.run([node, "--check", str(js)], capture_output=True, text=True)
        if r.returncode != 0:
            fail(f"{js.relative_to(SKILL_DIR)}: node --check failed: {r.stderr.strip().splitlines()[-1] if r.stderr.strip() else r.returncode}")
    return len(scripts), True


def check_plugin_manifests(skill_version):
    """Plugin packaging: manifests parse, names agree, and all three versions match."""
    import json
    plugin_dir = ROOT / ".claude-plugin"
    if not plugin_dir.is_dir():
        return None
    try:
        plugin = json.loads((plugin_dir / "plugin.json").read_text())
        market = json.loads((plugin_dir / "marketplace.json").read_text())
    except (OSError, ValueError) as e:
        fail(f".claude-plugin: {e}")
        return None
    entries = [p for p in market.get("plugins", []) if p.get("name") == plugin.get("name")]
    if not entries:
        fail(f"marketplace.json: no entry named '{plugin.get('name')}'")
        return None
    versions = {"plugin.json": plugin.get("version"), "marketplace.json": entries[0].get("version"),
                "SKILL.md metadata": skill_version}
    if len(set(versions.values())) != 1:
        fail(f"version mismatch: {versions}")
    return plugin.get("version")


def main():
    lines, words = check_skill_md()
    skill_version = parse_frontmatter((SKILL_DIR / "SKILL.md").read_text()).get("metadata", {}).get("version")
    version = check_plugin_manifests(skill_version)
    check_links()
    n_skills, n_refs = check_registry()
    n_rows = check_registry_fields_and_index()
    n_js, checked = check_scripts()
    print(f"SKILL.md: {lines} lines, {words} words · registry: {n_skills} skill entries, {n_refs} references"
          f" · slot rows: {n_rows} · scripts: {n_js} ({'syntax-checked' if checked else 'node not found, not checked'})"
          + (f" · plugin v{version}" if version else ""))
    for w in check_freshness():
        print(f"WARN stale: {w} — re-verify (CONTRIBUTING.md)")
    if errors:
        print(f"FAIL ({len(errors)})")
        for e in errors:
            print("  -", e)
        return 1
    print("OK")
    return 0


if __name__ == "__main__":
    sys.exit(main())
