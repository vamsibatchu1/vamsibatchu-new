---
name: add-experiment
description: >-
  Add or edit an Experiments fleet entry in this portfolio. Use when the user
  asks to add an experiment, BrowserField piece, or experiment video mp4; or
  mentions experiments.json / experiments/videos.
---

# Add / edit an experiment

Runbook: `src/data/EXPERIMENTS.md`. Rule: `.cursor/rules/experiments.mdc`.

## Checklist

1. Place `*.mp4` in `src/assets/experiments/videos/` (filename = JSON `video` value).
2. Append object to `src/data/experiments.json`.
3. Never put `videoUrl` in JSON — `experiments.ts` resolves via glob.

## Fields

`id`, `title`, `log`, `description`, `url`, `image`, `video`, `kind` (`image` | `music` | `video`), `tags[]`, `date` (`YYYY-MM-DD`), `body`.
