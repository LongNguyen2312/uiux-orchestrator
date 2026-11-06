#!/usr/bin/env python3
"""Check that every pinned dependency commit in .claude-plugin/marketplace.json still exists.

Usage: python3 scripts/check_pins.py
Exits 1 if a pinned commit or its sparse-checkout path can no longer be fetched.
Uses only `git` and the Python standard library.
"""
import json
import pathlib
import subprocess
import sys
import tempfile

ROOT = pathlib.Path(__file__).resolve().parent.parent


def repo_url(src):
    if src["source"] == "github":
        return f"https://github.com/{src['repo']}.git"
    url = src["url"]
    return url if "://" in url or url.startswith("git@") else f"https://github.com/{url}.git"


def check(name, src):
    sha, url, path = src.get("sha"), repo_url(src), src.get("path", ".")
    if not sha:
        return f"{name}: no sha pinned"
    with tempfile.TemporaryDirectory() as tmp:
        run = lambda *a: subprocess.run(["git", *a], cwd=tmp, capture_output=True, text=True)
        run("init", "-q")
        r = run("fetch", "-q", "--depth=1", "--filter=blob:none", url, sha)
        if r.returncode != 0:
            return f"{name}: commit {sha[:12]} not fetchable from {url} ({r.stderr.strip()[:120]})"
        r = run("ls-tree", "-d", "--name-only", sha, path.rstrip("/") or ".")
        if path not in (".", "./") and r.stdout.strip() == "":
            return f"{name}: path '{path}' missing at {sha[:12]}"
    return None


def main():
    market = json.loads((ROOT / ".claude-plugin" / "marketplace.json").read_text())
    failures, checked = [], 0
    for plugin in market["plugins"]:
        src = plugin.get("source")
        if isinstance(src, dict) and src.get("source") in ("github", "git-subdir", "url"):
            checked += 1
            err = check(plugin["name"], src)
            print(("FAIL " + err) if err else f"ok   {plugin['name']} @ {src['sha'][:12]}")
            if err:
                failures.append(err)
    print(f"{checked} pinned dependencies checked, {len(failures)} failed")
    return 1 if failures else 0


if __name__ == "__main__":
    sys.exit(main())
