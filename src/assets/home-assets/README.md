# Home + shared stills (`home-assets`)

Still images used by:

1. **Home** creative-text posters (`src/pages/Home.tsx` → `CreativeTextRow`)
2. **Writing** article figures (`src/data/writing-articles/index.json` via `writingArticles.ts` glob)

## Add a Home poster

1. Add the file here (`hero9.jpg`, etc.). Prefer jpg/png/webp.
2. In `src/pages/Home.tsx`:
   - `import hero9 from '../assets/home-assets/hero9.jpg'`
   - Add a flow image object (id, column index, vertical placement, `src`, width/aspect as siblings).
3. Tune placement with the existing defaults pattern (col 0 top/bottom, col 1, col 4, …). Images are draggable wrap obstacles; keep `object-contain` (no crop).

Layout helpers: `src/components/creativeTextLayout.ts`.

## Use an image in a writing article

No Home import required. Reference the **filename** in JSON:

```json
{ "type": "image", "src": "hero9.jpg", "alt": "…", "caption": "…" }
```

`writingArticles.ts` resolves any file matching `src/assets/home-assets/*.{jpg,jpeg,png,webp}`.

## Remove

- From Home: remove import + flow entry in `Home.tsx`.
- From articles: remove or retarget image blocks in `index.json`.
- Delete the file only when nothing references it.
