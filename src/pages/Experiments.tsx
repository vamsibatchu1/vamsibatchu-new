import { useMemo, useState } from 'react'

const INK = '#000000'
const INK_SOFT = '#6e6e6e'
const THUMB = '#efeeec'
const DIVIDER = '#d0d0d0'

type ExperimentTag = 'all' | 'motion' | 'type' | 'ai' | 'play'

type Experiment = {
  id: string
  title: string
  href?: string
  place: string
  kind: string
  detail: string
  date: string
  tag: Exclude<ExperimentTag, 'all'>
}

const FILTERS: { id: ExperimentTag; label: string }[] = [
  { id: 'all', label: 'all' },
  { id: 'motion', label: 'motion' },
  { id: 'type', label: 'type' },
  { id: 'ai', label: 'ai' },
  { id: 'play', label: 'play' },
]

const experiments: Experiment[] = [
  {
    id: 'pretext-flow',
    title: 'pretext column drift',
    href: '#',
    place: 'home · creative text row',
    kind: 'type · layout',
    detail: 'one stream, five columns, movable obstacles',
    date: '26/07/2026',
    tag: 'type',
  },
  {
    id: 'fill-headline',
    title: 'fill headline barcode',
    href: '#',
    place: 'home · hero',
    kind: 'type · interaction',
    detail: 'character grid with width stretch + cursor field',
    date: '27/07/2026',
    tag: 'type',
  },
  {
    id: 'landing-dots',
    title: 'landing stipple field',
    href: '#',
    place: 'landing · background',
    kind: 'generative',
    detail: 'noise-driven white dots on black',
    date: '31/07/2026',
    tag: 'play',
  },
  {
    id: 'spring-enter',
    title: 'spring-enter paper stack',
    href: '#',
    place: 'landing · api doc',
    kind: 'motion',
    detail: 'tractor-feed card rises on spring physics',
    date: '26/07/2026',
    tag: 'motion',
  },
  {
    id: 'nav-collapse',
    title: 'nav color bars',
    href: '#',
    place: 'site chrome',
    kind: 'motion · ui',
    detail: 'labels collapse into proportional marks on scroll',
    date: '27/07/2026',
    tag: 'motion',
  },
  {
    id: 'model-sketches',
    title: 'model sketch dialogues',
    href: '#',
    place: 'deepmind studio',
    kind: 'ai · prototype',
    detail: 'tiny interfaces for talking with unfinished models',
    date: '12/06/2026',
    tag: 'ai',
  },
  {
    id: 'weekend-physics',
    title: 'weekend physics toys',
    href: '#',
    place: 'atelier',
    kind: 'play · motion',
    detail: 'throwaway springs, soft bodies, cursor magnets',
    date: '03/05/2026',
    tag: 'play',
  },
  {
    id: 'mono-justify',
    title: 'mono justify laboratory',
    href: '#',
    place: 'type experiments',
    kind: 'type',
    detail: 'word-spacing justify measured with pretext',
    date: '18/04/2026',
    tag: 'type',
  },
]

function BeakerIcon() {
  return (
    <svg viewBox="0 0 64 64" className="mx-auto h-14 w-14" fill="none" aria-hidden>
      <path
        d="M24 8h16M28 8v14l-10 22a8 8 0 0 0 7 12h14a8 8 0 0 0 7-12L36 22V8"
        stroke={INK}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M22 40h20" stroke={INK} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

function PrintsIcon() {
  return (
    <svg viewBox="0 0 64 64" className="mx-auto h-14 w-14" fill="none" aria-hidden>
      <ellipse cx="22" cy="18" rx="7" ry="10" stroke={INK} strokeWidth="1.6" />
      <circle cx="18" cy="32" r="2.2" fill={INK} />
      <circle cx="24" cy="34" r="2.2" fill={INK} />
      <circle cx="20" cy="38" r="2" fill={INK} />
      <ellipse cx="42" cy="28" rx="7" ry="10" stroke={INK} strokeWidth="1.6" />
      <circle cx="38" cy="42" r="2.2" fill={INK} />
      <circle cx="44" cy="44" r="2.2" fill={INK} />
      <circle cx="40" cy="48" r="2" fill={INK} />
    </svg>
  )
}

function ThumbPair() {
  return (
    <div className="flex gap-1.5" aria-hidden>
      <div className="size-12 shrink-0 sm:size-14" style={{ backgroundColor: THUMB }} />
      <div className="size-12 shrink-0 sm:size-14" style={{ backgroundColor: THUMB }} />
    </div>
  )
}

export default function Experiments() {
  const [filter, setFilter] = useState<ExperimentTag>('all')

  const visible = useMemo(
    () =>
      filter === 'all'
        ? experiments
        : experiments.filter((item) => item.tag === filter),
    [filter],
  )

  return (
    <section
      className="pb-16 lowercase"
      style={{ color: INK }}
    >
      <header className="mx-auto mb-10 max-w-3xl text-center sm:mb-14">
        <h1
          className="text-[2.35rem] leading-[1.05] tracking-[-0.02em] sm:text-5xl lg:text-[3.35rem]"
          style={{ fontFamily: '"Newsreader", "Times New Roman", serif' }}
        >
          my experiments archive
        </h1>

        <div className="mt-10 flex items-end justify-center gap-16 sm:gap-24">
          <a
            href="#lab-notes"
            className="group flex flex-col items-center gap-2 transition-opacity hover:opacity-70"
          >
            <BeakerIcon />
            <span
              className="text-[10px] tracking-[0.06em]"
              style={{ fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}
            >
              my current lab notes
            </span>
          </a>
          <a
            href="#list"
            className="group flex flex-col items-center gap-2 transition-opacity hover:opacity-70"
          >
            <PrintsIcon />
            <span
              className="text-[10px] tracking-[0.06em]"
              style={{ fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}
            >
              my favourite experiments
            </span>
          </a>
        </div>
      </header>

      <nav
        id="lab-notes"
        className="mb-2 flex flex-wrap gap-x-5 gap-y-2 border-y py-3 text-[11px] uppercase tracking-[0.14em] sm:gap-x-8 sm:text-xs"
        style={{
          borderColor: DIVIDER,
          fontFamily: '"JetBrains Mono", ui-monospace, monospace',
        }}
        aria-label="Filter experiments"
      >
        {FILTERS.map((item) => {
          const active = filter === item.id
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilter(item.id)}
              className="transition-opacity hover:opacity-100"
              style={{ opacity: active ? 1 : 0.45 }}
              aria-pressed={active}
            >
              {item.label}
            </button>
          )
        })}
      </nav>

      <ul id="list" className="flex flex-col">
        {visible.map((item) => (
          <li
            key={item.id}
            className="border-b py-5 sm:py-6"
            style={{ borderColor: DIVIDER }}
          >
            <div className="flex flex-col gap-4 lg:grid lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_auto_auto] lg:items-center lg:gap-8">
              <h2
                className="text-[1.65rem] leading-[1.15] tracking-[-0.02em] sm:text-[1.85rem] lg:text-[2rem]"
                style={{ fontFamily: '"Newsreader", "Times New Roman", serif' }}
              >
                {item.title}
                {item.href ? (
                  <>
                    {' '}
                    <a
                      href={item.href}
                      className="text-[0.95rem] italic underline-offset-2 hover:underline sm:text-base"
                      style={{ color: INK_SOFT }}
                    >
                      ( link )
                    </a>
                  </>
                ) : null}
              </h2>

              <div
                className="space-y-0.5 text-[11px] leading-[1.45] tracking-[0.02em] sm:text-xs"
                style={{ fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}
              >
                <p>{item.place}</p>
                <p style={{ color: INK_SOFT }}>{item.kind}</p>
                <p style={{ color: INK_SOFT }}>{item.detail}</p>
              </div>

              <ThumbPair />

              <time
                className="text-[11px] tracking-[0.04em] sm:text-xs lg:justify-self-end"
                style={{ fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}
                dateTime={item.date.split('/').reverse().join('-')}
              >
                {item.date}
              </time>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
