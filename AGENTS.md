# AGENTS.md

Entry map for humans and Cursor agents working on this portfolio.

## Read first

| Doc | When |
| --- | --- |
| [`overview.md`](./overview.md) | Product vision, routes intent, changelog |
| [`.cursor/rules/`](./.cursor/rules/) | Auto-applied agent conventions (prefer these over chat memory) |
| [`.cursor/skills/`](./.cursor/skills/) | Discoverable task skills (content + assets) |
| This file | Where to change what |

## Common tasks

### Add a blog / writing piece

→ [`src/data/writing-articles/README.md`](./src/data/writing-articles/README.md)  
Also: `.cursor/rules/writing.mdc`, `.cursor/skills/add-writing`

### Add a writing figure image

→ [`src/assets/writing/figures/README.md`](./src/assets/writing/figures/README.md)  
Shared with Home → `src/assets/shared/stills/`

### Add an experiment (+ video)

→ [`src/data/EXPERIMENTS.md`](./src/data/EXPERIMENTS.md)  
Also: `.cursor/rules/experiments.mdc`, `.cursor/skills/add-experiment`

### Add a Home poster image

→ [`src/assets/home/README.md`](./src/assets/home/README.md)  
Also: `.cursor/rules/stills.mdc`, `.cursor/skills/add-home-poster`

### Work logos / WorkCard copy

→ `src/features/work/workCardFlow.ts` + `src/assets/work/`  
Also: `.cursor/rules/work.mdc`

## Repo map (short)

```
src/
  App.tsx                 routes
  pages/                  Landing, Home, Work, Experiments, Writing, About
  components/             shared chrome (Layout, Mark, ApiDoc, HeatmapOverlay, …)
  features/
    experiments/          BrowserField fleet + physics
    writing/              WritingEditor
    home/                 CreativeTextRow, creativeFlow, IndexGallery
    practice-map/         3D practice map (Home intro teaser)
    work/                 WorkCard + workCardFlow
    receipt/              visit tracker + thermal receipt PNG export
  lab/                    unused prototypes (not routed)
  data/
    nav.ts                shared primary nav links (top + bottom)
    practiceMap.ts        practice map concepts + axes
    writing.ts            re-exports archive list helpers
    writingArticles.ts    loads writing-articles/*.json + figure URLs
    writing-articles/     one JSON per post + columns.json
    experiments.json      experiment records
    experiments.ts        resolves video URLs
  assets/
    shared/nav/           mobile bottom-nav icons
    shared/stills/        cross-page heroes (Home + Writing)
    home/                 creative-intelligence + posters/
    writing/figures/      article figures
    landing/              GIF + ApiDoc symbols
    work/                 gdm.svg + icons/
    experiments/videos/   mp4 previews
```

## Responsive UX notes (quick)

- Landing mobile: GIF loop → fade → ApiDoc (`Landing.tsx`); desktop simultaneous.
- Writing mobile: category tabs; editor closes on backdrop click; no tools row.
- Creative text: 2 cols `<900px`, 5 cols desktop (`CreativeTextRow.tsx`).
- Mobile nav: doodle icons in `Layout.tsx` from `shared/nav/` (not text Marks).
- Desktop nav extras: heatmap (`Scan`) + receipt (`Receipt`).

## Dev

```bash
npm install
npm run dev
npm run build
```

## Agent habits

- Prefer editing **data + assets** for content; avoid hardcoding posts into page JSX.
- After changing a content workflow, update the matching rule/runbook/skill in the same session (see `.cursor/rules/docs-maintenance.mdc`).
- A project `stop` hook (`.cursor/hooks/docs-remind.sh`) may nudge once if pipeline loaders change without docs.
- Keep `overview.md` changelog for meaningful product changes; keep runbooks for “how to add X”.
