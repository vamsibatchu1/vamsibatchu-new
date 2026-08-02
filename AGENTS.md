# AGENTS.md

Entry map for humans and Cursor agents working on this portfolio.

## Read first

| Doc | When |
| --- | --- |
| [`overview.md`](./overview.md) | Product vision, routes intent, changelog |
| [`.cursor/rules/`](./.cursor/rules/) | Auto-applied agent conventions (prefer these over chat memory) |
| This file | Where to change what |

## Common tasks

### Add a blog / writing piece

→ [`src/data/writing-articles/README.md`](./src/data/writing-articles/README.md)  
Also: `.cursor/rules/writing.mdc`

### Add an experiment (+ video)

→ [`src/data/EXPERIMENTS.md`](./src/data/EXPERIMENTS.md)  
Also: `.cursor/rules/experiments.mdc`

### Add a Home poster image

→ [`src/assets/home-assets/README.md`](./src/assets/home-assets/README.md)  
Also: `.cursor/rules/home-assets.mdc`

## Repo map (short)

```
src/
  App.tsx                 routes
  pages/                  Landing, Home, Work, Experiments, Writing, About
  components/             UI + experiments chrome (BrowserField, WritingEditor, …)
  data/
    writing.ts            writing index columns
    writing-articles/     article JSON bodies
    writingArticles.ts    resolves article images
    experiments.json      experiment records
    experiments.ts        resolves video URLs
  assets/
    home-assets/          shared stills (Home + Writing figures)
    experiment-thumbnails-video/  mp4 previews
```

## Dev

```bash
npm install
npm run dev
npm run build
```

## Agent habits

- Prefer editing **data + assets** for content; avoid hardcoding posts into page JSX.
- After changing a content workflow, update the matching rule/runbook in the same session (see `.cursor/rules/docs-maintenance.mdc`).
- A project `stop` hook (`.cursor/hooks/docs-remind.sh`) may nudge once if pipeline loaders change without docs.
- Keep `overview.md` changelog for meaningful product changes; keep runbooks for “how to add X”.
