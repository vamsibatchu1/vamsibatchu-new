# Writing figures

Article images for `src/data/writing-articles/*.json`.

Also resolved: `src/assets/shared/stills/` (heroes shared with Home). Filename-only `"src"` in JSON — loader merges both folders.

## Add a figure

1. Drop the image here (`my-piece-01.png`, etc.). Prefer jpg/png/webp/gif.
2. In article JSON:

```json
{ "type": "image", "src": "my-piece-01.png", "alt": "…", "caption": "…" }
```

Do **not** set `url` — `writingArticles.ts` fills it from the glob.

## Shared with Home

If Home also uses the image (e.g. `hero4.jpg`), put it in `src/assets/shared/stills/` instead — still reference by filename only.
