# Adding / editing an experiment

Experiments are JSON records + optional preview videos. The page renders a field of browser windows (`BrowserField`); it does not hardcode the fleet in JSX.

## Files

| Role | Path |
| --- | --- |
| Records | `src/data/experiments.json` |
| Loader + `videoUrl` | `src/data/experiments.ts` |
| Page | `src/pages/Experiments.tsx` |
| UI / physics | `src/components/BrowserField.tsx`, `BrowserComponent.tsx`, `browserHeapPhysics.ts`, … |
| Videos | `src/assets/experiment-thumbnails-video/*.mp4` |

## Checklist — new experiment

1. Export / place an `mp4` in `src/assets/experiment-thumbnails-video/` (e.g. `my-piece.mp4`).
2. Append to `experiments.json`:

```json
{
  "id": "my-piece",
  "title": "my piece",
  "log": "20/52",
  "description": "One-line card description.",
  "url": null,
  "image": null,
  "video": "my-piece.mp4",
  "kind": "image",
  "tags": ["tag-a", "tag-b"],
  "date": "2026-08-02",
  "body": "Longer copy shown inside the browser chrome body."
}
```

3. `kind` must be `image` | `music` | `video` (filter vocabulary in `experiments.ts`).
4. Leave `videoUrl` out of JSON — the loader resolves it from `video`.
5. If there is no video yet, set `"video": null` (window still shows text; hover video swap needs a file).

## Edit / remove

- Copy, tags, log index → edit the JSON object.
- Swap video → replace the mp4 (same filename) or change `video` to the new filename.
- Remove → delete the JSON object; delete unused mp4 if nothing else references it.

## Interaction notes (preserve unless redesigning)

- Default: text in a 16:9 pane; **hover** → muted looping video.
- **Click** → focus that window; others tumble via Matter.js heap.
- Exit / dismiss → CRT scanline wipe (`browser-crt-wipe`).
