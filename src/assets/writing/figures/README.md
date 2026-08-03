# Shared stills (`stills`)

Still images used by:

1. **Home** creative-text posters (`src/features/home/creativeFlow.ts`)
2. **Writing** article figures (`src/data/writing-articles/*.json` via `writingArticles.ts`)

## Add a Home poster

1. Add the file here (`hero9.jpg`, etc.). Prefer jpg/png/webp/gif.
2. In `src/features/home/creativeFlow.ts`:
   - import the asset
   - add a flow image object (id, column, placement, `src`, aspect)
3. Center SVG silhouette: `src/assets/creative-intelligence.svg` (referenced from creativeFlow).

Layout helpers: `src/features/home/creativeTextLayout.ts`. Prefer `object-contain` (no crop).

## Use an image in a writing article

No Home import required. Reference the **filename** in article JSON:

```json
{ "type": "image", "src": "hero9.jpg", "alt": "…", "caption": "…" }
```

## Remove

- From Home: remove import + flow entry in `creativeFlow.ts`.
- From articles: remove or retarget image blocks.
- Delete the file only when nothing references it.
