# Home assets

| Path | Use |
| --- | --- |
| `creative-intelligence.svg` | Center silhouette in creative-text wrap (`creativeFlow.shapeSrc`) |
| `posters/` | Home-only creative-text posters |

Shared heroes used by Home **and** Writing live in `src/assets/shared/stills/` (`hero4`, `hero5`, `hero7`).

## Add a Home poster

1. Add the file under `posters/` (jpg/png/webp/gif), **or** under `shared/stills/` if Writing will also reference it.
2. In `src/features/home/creativeFlow.ts`: import + add a flow image (id, column, placement, `src`, aspect).
3. Layout helpers: `src/features/home/creativeTextLayout.ts`. Prefer `object-contain` (no crop).

Home creative-text posters are **desktop-only** (`CreativeTextRow` hides wrap images below 1024px).
