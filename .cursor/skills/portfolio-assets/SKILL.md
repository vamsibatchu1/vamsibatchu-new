---
name: portfolio-assets
description: >-
  Locate or move portfolio media by page. Use when the user asks where assets
  live, how stills/figures/nav icons/landing GIF/work logos are organized, or
  after restructuring src/assets folders.
---

# Portfolio assets map

| Folder | Contents |
| --- | --- |
| `src/assets/landing/` | `landing.gif`, ApiDoc `landing-sym-*.svg` |
| `src/assets/shared/nav/` | Mobile nav doodles (`home`, `work`, `experiments`, `writing`, `about.webp`) |
| `src/assets/shared/stills/` | Cross-page heroes (`hero4`, `hero5`, `hero7`) — Home + Writing |
| `src/assets/home/` | `creative-intelligence.svg` + `posters/` (Home-only) |
| `src/assets/writing/figures/` | Article-only figures |
| `src/assets/work/` | `gdm.svg` + `icons/` model SVGs |
| `src/assets/experiments/videos/` | Experiment preview mp4s |

## Resolvers

- Writing figures: filename-only in article JSON → `writingArticles.ts` globs `writing/figures` + `shared/stills`
- Experiments: filename in JSON `video` → `experiments.ts` glob
- Home posters: explicit imports in `creativeFlow.ts`
- Work logos: explicit imports in `workCardFlow.ts`

Do **not** revive flat `src/assets/stills/` or root-level nav webps.
