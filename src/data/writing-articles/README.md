# Adding / editing a writing piece

One JSON file per article. List order lives in `columns.json`. Metadata is **not** duplicated elsewhere.

## Files

| Role | Path |
| --- | --- |
| Article bodies + metadata | `src/data/writing-articles/<id>.json` |
| Column order (essays / notes / talks) | `src/data/writing-articles/columns.json` |
| Loader | `src/data/writingArticles.ts` (re-exported via `writing.ts`) |
| Page UI | `src/pages/Writing.tsx` |
| Pocket editor | `src/features/writing/WritingEditor.tsx` |
| Figure images | `src/assets/stills/` |

## Checklist — new post

1. Choose a kebab-case `id` (e.g. `holding-the-model`). **Never reuse** an id.
2. Add `src/data/writing-articles/<id>.json`:

```json
{
  "id": "my-new-post",
  "title": "my new post",
  "kind": "essay",
  "year": 2026,
  "excerpt": "one-line tease for the archive list.",
  "blocks": [
    { "type": "p", "text": "First paragraph…" },
    {
      "type": "image",
      "src": "hero4.jpg",
      "alt": "description",
      "caption": "fig. 01 — optional"
    }
  ]
}
```

3. Append the `id` to the right array in `columns.json` (`essays` | `notes` | `talks`).
4. For new figures: drop images into `src/assets/stills/`, reference **filename only** in `"src"`.
5. Open `/writing`, click the row — editor should load. Close via Esc, red traffic light, or clicking the page backdrop (clears the active row). Desktop toolbar includes optional page-dim; toolbar is hidden on mobile.

## Blocks

- `{ "type": "p", "text": "…" }`
- `{ "type": "image", "src": "file.jpg", "alt": "…", "caption?": "…" }`

Do **not** set `url` in JSON — the loader fills it from the stills glob.

## Edit / remove

- Metadata or body → edit that article’s JSON only.
- Reorder → edit `columns.json`.
- Remove → delete the JSON file and remove the id from `columns.json`.
