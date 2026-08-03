---
name: add-home-poster
description: >-
  Add or change Home creative-text wrap posters. Use when the user asks to add
  a Home poster, creative-text image, creativeFlow image, or creative-intelligence
  silhouette asset.
---

# Add a Home poster

Runbook: `src/assets/home/README.md`. Rule: `.cursor/rules/stills.mdc`.

## Checklist

1. Home-only → `src/assets/home/posters/`. Shared with Writing → `src/assets/shared/stills/`.
2. Import + add flow entry in `src/features/home/creativeFlow.ts` (id, column, top, widthRatio, float, aspectRatio, src, alt).
3. Center silhouette: `src/assets/home/creative-intelligence.svg` via `creativeFlow.shapeSrc`.
4. Prefer `object-contain`; layout helpers in `creativeTextLayout.ts`.
5. Posters are desktop-only wrap images (`≥1024`); still register them in `creativeFlow.ts`.
