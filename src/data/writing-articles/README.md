# Adding / editing a writing piece

Writing has two layers: the **archive list** and the **article body**. Both must share the same stable `id`.

## Files

| Role | Path |
| --- | --- |
| List columns (essays / notes / talks) | `src/data/writing.ts` |
| Article bodies | `src/data/writing-articles/index.json` |
| Image URL resolver | `src/data/writingArticles.ts` (do not put content here) |
| Page UI | `src/pages/Writing.tsx` |
| Pocket editor | `src/components/WritingEditor.tsx` |
| Figure images | `src/assets/home-assets/` |

## Checklist — new post

1. Choose a kebab-case `id` (e.g. `holding-the-model`). **Never reuse** an id.
2. Add an entry in the right column in `writing.ts` via `entry({ id, year, title, kind }, excerpt)`.
3. Add a top-level key in `index.json` with the **same** `id`:

```json
"my-new-post": {
  "id": "my-new-post",
  "title": "my new post",
  "kind": "essay",
  "year": 2026,
  "excerpt": "one-line tease matching the list when possible.",
  "blocks": [
    { "type": "p", "text": "First paragraph…" },
    {
      "type": "image",
      "src": "hero4.jpg",
      "alt": "description",
      "caption": "fig. 01 — optional"
    },
    { "type": "p", "text": "More copy…" }
  ]
}
```

4. For new figures: drop `jpg` / `jpeg` / `png` / `webp` into `src/assets/home-assets/`, then reference **filename only** in `"src"`.
5. Open `/writing`, click the row — editor should load the article. Esc or traffic-light close dismisses; brightness dims the page behind the editor.

## Blocks

- `{ "type": "p", "text": "…" }`
- `{ "type": "image", "src": "file.jpg", "alt": "…", "caption?": "…" }`

Do **not** set `url` in JSON — `writingArticles.ts` fills it from the glob.

## Edit existing

- Title / year / kind / excerpt in list → `writing.ts` (and mirror metadata in JSON if shown in the editor header).
- Body / figures → `index.json` only.
- Removing a post: delete from both `writing.ts` and `index.json`.

## Columns

`writingColumns` ids: `essays`, `notes`, `talks` (labels match). Put the entry in the column that matches `kind` when sensible.
