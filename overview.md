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

1. **Landing gate (`/`)** — GIF + tractor-feed `ApiDoc`. Desktop: side by side. Mobile: sequenced entrance (GIF one loop → fade → ApiDoc); 40px GIF inset / 24px ApiDoc inset; no GIF tilt on mobile. Enter/tap → `/home`.
2. **Shell** — White background. Desktop: sticky top nav (text + Mark + heatmap + socials). Mobile: bottom icon tab bar; hide when writing editor overlay is open.
3. **Navigation** — Shared `navLinks` (`home` · `work` · `experiments` · `writing` · `about`) with Mark tones. Same routes on all breakpoints.
4. **Home** — Intro (copy + practice-map teaser) → creative-intelligence multi-column text → index gallery.
5. **Work** — Stub for now; projects deepen later.
6. **Experiments** — Self-contained interactive pieces; keep isolated.
7. **Writing** — Archive by essays / notes / talks (tabs on mobile, columns on desktop). Pocket editor; backdrop click / Esc closes and clears selection.
8. **About** — Bio / focus.
9. **Responsive** — Prefer mobile-specific sequencing and chrome over shrinking desktop layouts blindly.
10. **Content + craft** — Evolve from references; keep JetBrains Mono + lowercase UI.

## Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- React Router
- framer-motion, Three.js (practice map), Matter.js (experiments)

## Assets

- `src/assets/landing.gif` — portrait GIF on the landing gate
- `src/assets/{home,work,experiments,writing,about me}.webp` — mobile nav icons

## Change log

### 2026-08-02 — Portfolio receipt

- Local visit tracker (time / clicks / scrolls per page) + thermal “VB STUDIO” receipt
- Top-nav `receipt` (next to heatmap); ticket slides up bottom-right — no dialog chrome / download UI
- Stats stay on-device — session time, clicks, scrolls, and token totals per page

### 2026-08-02 — Mobile polish + landing sequence

- Landing mobile: GIF plays one loop, fades, then ApiDoc mounts; upright GIF; side insets 40px (GIF) / 24px (ApiDoc)
- Mobile bottom nav: doodle icons instead of text labels
- Creative text: 2 columns on narrow stages (was 1)
- Writing mobile: essays/notes/talks as horizontal tabs
- Writing editor: hide tools row on mobile; chrome title removed; backdrop click always closes + clears selection
- Practice map labels: left-aligned, wrap to two lines, tighter gap under nodes

### 2026-08-02 — Practice map on Home intro

- Moved fidgetable blueprint `PracticeMap` into Home `#intro` as a second column (Work restored to stub)

### 2026-08-02 — Practice map sandbox on Work

- Added fidgetable 3D `PracticeMap` (`src/features/practice-map/`) with concept data in `practiceMap.ts`
- Initially mounted on `/work` as a temporary home

### 2026-08-02 — Mobile shell + type

- Mobile: bottom tab bar (shared `navLinks`); desktop keeps top nav
- Writing editor full-bleed sheet on mobile; hides bottom nav while open
- Mobile type/spacing pass on Home, Writing, Work; Experiments stage shorter on small screens

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
