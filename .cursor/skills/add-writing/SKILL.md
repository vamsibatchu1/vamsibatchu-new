---
name: add-writing
description: >-
  Add or edit a Writing archive post in this portfolio. Use when the user asks
  to add a blog, essay, note, talk, writing piece, or article JSON; or mentions
  writing-articles, columns.json, or Writing editor content.
---

# Add / edit a writing piece

Runbook: `src/data/writing-articles/README.md`. Rule: `.cursor/rules/writing.mdc`.

## Checklist

1. Create `src/data/writing-articles/<id>.json` (kebab-case id; never reuse).
2. Append `id` to the right array in `columns.json` (`essays` | `notes` | `talks`).
3. Figures: drop under `src/assets/writing/figures/` (or `src/assets/shared/stills/` if Home also uses them). In JSON, `"src"` = **filename only** — no `url` field.
4. Verify on `/writing` — click row opens editor.

## Blocks

```json
{ "type": "p", "text": "..." }
{ "type": "image", "src": "hero4.jpg", "alt": "...", "caption": "optional" }
```

Loader: `src/data/writingArticles.ts` globs `writing/figures` + `shared/stills`.
