# Portfolio Overview

Living document for vision, site logic, and change log. Update this whenever we ship a meaningful change.

## Documentation map

| Doc | Role |
| --- | --- |
| [`AGENTS.md`](./AGENTS.md) | Start here — task index for humans & Cursor |
| [`.cursor/rules/`](./.cursor/rules/) | Auto-applied agent rules (portfolio, writing, experiments, stills, lab, docs maintenance) |
| [`.cursor/hooks.json`](./.cursor/hooks.json) | Stop hook nudges if pipeline code changes without docs |
| [`src/data/writing-articles/README.md`](./src/data/writing-articles/README.md) | Add / edit a blog |
| [`src/data/EXPERIMENTS.md`](./src/data/EXPERIMENTS.md) | Add / edit an experiment |
| [`src/assets/stills/README.md`](./src/assets/stills/README.md) | Add Home / Writing images |
| This file | Vision, how the site should feel, changelog |

Operational “how do I add X?” belongs in the runbooks/rules. Keep this file for product direction and history.

## Who this is for

**Vamsi Batchu** — Creative technologist / product designer / design builder at **Google DeepMind**. The portfolio should feel fun, interactive, and uniquely yours — not a generic case-study grid.

## Site goals

- More than an about page: full project detail, writing, experiments, and current work
- Interactive experiments people can play with in-browser
- Responsive across mobile and desktop
- Built page-by-page with references and inspiration guiding each section

## Planned sections / routes

| Route | Purpose |
| --- | --- |
| `/` | Landing gate — white splash with GIF + typewriter intro; Enter to continue |
| `/home` | Main site home (inside shell) |
| `/work` | Detailed project list + case studies |
| `/experiments` | Interactive experiments |
| `/writing` | Blogs and articles |
| `/about` | Bio, experience, what I'm working on |

Future ideas (not scaffolded yet): now / WIP, contact, lab, play.

## How the site should work (logic)

1. **Landing gate (`/`)** — GIF sits outside any frame at native aspect ratio; tractor-feed `ApiDoc` beside it as its own card. Doc shell is static; greeting/role type in, then details fade, then press enter → `/home`. Stacks on mobile.
2. **Shell** — White background site chrome. Top nav only (no footer): name left, section links + social icons right, all in Gloria Hallelujah / lowercase. Pages except Landing render inside this shell.
3. **Navigation** — JetBrains Mono. Name left; `home` · highlighted `work` (yellow) · `experiments` (purple) · `writing` (blue) · `play` (green) + socials. Active tab shows a black dot. Brand links to `/home`.
4. **Home hero** — Editorial layout: large left headline, right body + underlined explore link, hairline divider, then two static rows of work cards (3 + 4) with grey thumbnails, vertical labels, and multi-color arrows. JetBrains Mono throughout.
5. **Work** — Index of projects; each project will deepen into its own detail view when we build that out.
6. **Experiments** — Self-contained interactive pieces; keep them isolated so they don't bloat the rest of the app.
7. **Writing** — List of articles/blogs with links (internal or external).
8. **About** — Experience narrative + current focus (DeepMind, etc.).
9. **Responsive** — Mobile-first layout; landing and nav must remain usable on small screens.
10. **Content + craft** — Design direction, motion, and interactions will evolve from reference images and inspiration you provide.

## Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- React Router

## Assets

- `src/assets/landing.gif` — portrait GIF used on the landing gate

## Change log

### 2026-08-02 — Repo organization

- Writing: one JSON file per article + `columns.json`; list metadata derived from articles (no duplicate `writing.ts` entries)
- Features: `src/features/{experiments,writing,home}`; unused prototypes → `src/lab/`
- Assets: `src/assets/stills/`, `src/assets/experiments/videos/`; Home flow data → `creativeFlow.ts`
- Removed unused `writing.png` (kept `writing.webp`)
- Cursor rules refreshed: `stills.mdc` (replaces home-assets), plus `lab.mdc`; docs-maintenance paths fixed

### 2026-08-02 — Agent / content docs

- Added `AGENTS.md`, `.cursor/rules/` (portfolio, writing, experiments, stills/lab, docs-maintenance), and colocated runbooks for writing / experiments / stills
- Added `.cursor/hooks.json` + `docs-remind.sh` stop hook (nudges once if pipeline loaders change without docs)
- Content workflows documented so future sessions can add posts and media without chat history

### 2026-07-27 — Scroll-collapse nav

- Nav labels hide on scroll down (color bars remain, tighter gaps, proportional widths); labels return on scroll up / near top
- Respects prefers-reduced-motion; social icons fade when collapsed

### 2026-07-27 — ApiDoc spring entrance

- ApiDoc springs up from below on load (framer-motion); typing starts after entrance
- Extra bottom padding inside the doc

### 2026-07-27 — ApiDoc on landing

- Moved `ApiDoc` to landing column 2 (beside GIF) with typed intro + staged details reveal
- Restored plain bio paragraphs on home hero

### 2026-07-27 — API doc component

- Added tractor-feed `ApiDoc` component (retro manual aesthetic) with bio copy + pastel Mark highlights
- Replaced plain home hero body paragraphs with `ApiDoc`

### 2026-07-27 — Home hero (Field Mag layout)

- Rebuilt home hero to match editorial layout: about tag, large headline + right body/link, hairline rule, horizontal image carousel with vertical labels
- Kept JetBrains Mono; nav unchanged; carousel uses landing.gif as placeholder imagery

### 2026-07-27 — JetBrains site shell + nav highlights

- Site shell + home hero use JetBrains Mono; shared `Mark` pastel highlights
- Nav: work/experiments/writing/play colored like landing; `info` renamed to `play`
- Home hero wrapped in 1px black border cards

### 2026-07-27 — Landing card layout

- Replaced typewriter landing with two-column layout: GIF | JetBrains Mono bordered card
- Headers + fun notes with pastel highlight marks; Enter/tap still enters site
- Removed Gloria typewriter choreography from landing

### 2026-07-26 — Landing layout stability

- Reserved fixed slots for greeting, GIF (800/447 aspect), role (2-line height), and press enter so choreography fades/types in place with no layout shift

### 2026-07-26 — Landing GIF loop

- Injected Netscape infinite-loop metadata into `landing.gif` so it loops continuously
- Simplified GIF reveal to a plain looping `<img>` (no remount / fade wrapper)

### 2026-07-26 — Landing choreography

- Sequence: type greeting → play GIF → type role line below → show press enter
- Copy (lowercase): `hi there, i am vamsi batchu.` / `a member of technical staff at google deepmind.` (role wraps to two lines at greeting width)

### 2026-07-26 — Home hero + nav home tab

- Added `home` to top nav with active black-dot indicator
- Built homepage hero (Poppins): intro with underlined roles + 4-col Focus / GIF / Highlights / Contact grid
- Site body font → Poppins; nav stays Gloria Hallelujah

### 2026-07-26 — Main shell nav (white)

- Site after landing uses plain white background
- Top nav: `vamsi batchu` left; `work` `experiments` `writing` `info` + Instagram/X icons right
- Gloria Hallelujah, all lowercase; removed footer for a cleaner chrome

### 2026-07-26 — Landing gate

- Added full-white `/` landing with `landing.gif`
- Handwritten typewriter (Gloria Hallelujah, all lowercase): intro as member of technical staff at google deepmind
- Press Enter (desktop) or tap (mobile) → fade into `/home`
- Moved main Home into site shell at `/home`; nav brand points to `/home`

### 2026-07-26 — Initial scaffold

- Created Vite + React + TypeScript project
- Added Tailwind CSS v4 and React Router
- Added shared `Layout` (header nav + footer), responsive basics
- Stub pages: Home, Work, Experiments, Writing, About
- Added this `overview.md` as the living project brief
