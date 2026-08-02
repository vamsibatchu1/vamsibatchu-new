# Adding / editing an experiment

Experiments are JSON records + optional preview videos. The page renders a field of browser windows (`BrowserField`); it does not hardcode the fleet in JSX.

## Files

| Role | Path |
| --- | --- |
| Records | `src/data/experiments.json` |
| Loader + `videoUrl` | `src/data/experiments.ts` |
| Page | `src/pages/Experiments.tsx` |
| UI / physics | `src/features/experiments/` |
| Videos | `src/assets/experiments/videos/*.mp4` |

## Checklist — new experiment

1. Place an `mp4` in `src/assets/experiments/videos/` (e.g. `my-piece.mp4`).
2. Append to `experiments.json` (`video` = filename only, or `null`).
3. `kind` must be `image` | `music` | `video`.
4. Leave `videoUrl` out of JSON — the loader resolves it.

## Interaction notes

- Hover → muted looping video; click → focus / Matter heap for others.
- Exit → CRT wipe (`browser-crt-wipe`).
