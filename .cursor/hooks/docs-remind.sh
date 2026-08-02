#!/usr/bin/env bash
# Nudge once if content-pipeline code changed without docs.
# Prints {} when nothing to do. Never blocks the agent.

set -euo pipefail

python3 - <<'PY'
import json, os, subprocess, sys

try:
    data = json.load(sys.stdin)
except Exception:
    data = {}

status = data.get("status") or ""
loop_count = int(data.get("loop_count") or 0)

def out(obj):
    sys.stdout.write(json.dumps(obj))
    raise SystemExit(0)

if status and status != "completed":
    out({})
if loop_count >= 1:
    out({})

PIPELINE = (
    "src/data/writingArticles.ts",
    "src/data/experiments.ts",
)

DOC_PREFIXES = (
    ".cursor/rules/",
    "AGENTS.md",
    "overview.md",
    "src/data/EXPERIMENTS.md",
    "src/data/writing-articles/README.md",
    "src/assets/home-assets/README.md",
)

def git_names(*args):
    try:
        r = subprocess.run(
            ["git", *args],
            capture_output=True,
            text=True,
            check=False,
        )
    except FileNotFoundError:
        return []
    if r.returncode != 0:
        return []
    return [ln.strip() for ln in r.stdout.splitlines() if ln.strip()]

changed = set()
changed.update(git_names("diff", "--name-only", "HEAD"))
changed.update(git_names("diff", "--name-only", "--cached"))
changed.update(git_names("ls-files", "--others", "--exclude-standard"))

pipeline_hits = sorted(p for p in PIPELINE if p in changed)

# New *Articles.ts / loader modules under src/data (not the high-churn writing.ts list)
for path in changed:
    if not path.startswith("src/data/") or not path.endswith(".ts"):
        continue
    base = os.path.basename(path)
    if base == "writing.ts":
        continue
    if path in PIPELINE:
        continue
    if "Articles" in base or base.endswith("Loader.ts"):
        pipeline_hits.append(path)

docs_hit = any(
    path == pref or path.startswith(pref)
    for path in changed
    for pref in DOC_PREFIXES
)

if pipeline_hits and not docs_hit:
    out({
        "followup_message": (
            "Docs check: content-pipeline files changed "
            f"({', '.join(pipeline_hits)}) "
            "but rules/runbooks were not updated. If how-to-add-content changed, "
            "update the matching `.cursor/rules/*.mdc` and runbook "
            "(see `.cursor/rules/docs-maintenance.mdc`). "
            "If this was only an internal refactor with the same checklist, reply done."
        )
    })

out({})
PY
