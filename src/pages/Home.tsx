import CreativeTextRow from '../features/home/CreativeTextRow'
import { creativeFlow } from '../features/home/creativeFlow'

const THUMB_GREY = '#efeeec'

type WorkCard = {
  id: string
  label: string
  width: number
  height: number
  arrow: string
}

/** gallery — first thumbnail strip */
const galleryItems: WorkCard[] = [
  {
    id: 'portrait',
    label: 'portrait with macaw',
    width: 220,
    height: 160,
    arrow: '#ff6b9d',
  },
  {
    id: 'deepmind',
    label: 'deepmind studio',
    width: 280,
    height: 200,
    arrow: '#6b5ce7',
  },
  {
    id: 'lab',
    label: 'experiments lab',
    width: 180,
    height: 220,
    arrow: '#3db8ff',
  },
]

/** archive — second thumbnail strip */
const archiveItems: WorkCard[] = [
  {
    id: 'writing',
    label: 'selected writing',
    width: 160,
    height: 140,
    arrow: '#ffe033',
  },
  {
    id: 'prototype',
    label: 'weekend prototype',
    width: 240,
    height: 170,
    arrow: '#ff8a5b',
  },
  {
    id: 'play',
    label: 'play experiments',
    width: 140,
    height: 190,
    arrow: '#4ad295',
  },
  {
    id: 'craft',
    label: 'craft notes',
    width: 200,
    height: 150,
    arrow: '#c084fc',
  },
]

function Arrow({ color }: { color: string }) {
  return (
    <span
      className="mb-2 block size-0 border-y-[5px] border-y-transparent border-l-[8px]"
      style={{ borderLeftColor: color }}
      aria-hidden
    />
  )
}

function Card({ card }: { card: WorkCard }) {
  return (
    <article className="flex shrink-0 items-end gap-2.5">
      <div
        className="shrink-0"
        style={{
          width: card.width,
          height: card.height,
          backgroundColor: THUMB_GREY,
        }}
        aria-hidden
      />
      <div className="flex flex-col items-center pt-1">
        <Arrow color={card.arrow} />
        <span
          className="text-[10px] font-medium uppercase tracking-[0.14em] text-black"
          style={{
            writingMode: 'vertical-rl',
            transform: 'rotate(180deg)',
          }}
        >
          {card.label}
        </span>
      </div>
    </article>
  )
}

function CardRow({ cards }: { cards: WorkCard[] }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-10">
      {cards.map((card) => (
        <Card key={card.id} card={card} />
      ))}
    </div>
  )
}

const rowClass = 'py-10 sm:py-12'

export default function Home() {
  return (
    <section
      className="flex flex-col"
      style={{ fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}
    >
      <div id="intro" className={rowClass}>
        <p className="w-[80%] max-w-full text-[28px] leading-[1.1] text-black">
          some call me a product designer, some call me a design engineer. I
          call myself a tinkerer and someone who is usually doing a lot of things & who just loves building tasteful product experiences with a
          blend of art, design, technology, and code.
        </p>
      </div>

      <div id="creative-text" className={rowClass}>
        <CreativeTextRow flow={creativeFlow} />
      </div>

      <div id="gallery" className={rowClass}>
        <CardRow cards={galleryItems} />
      </div>

      <div id="archive" className={rowClass}>
        <CardRow cards={archiveItems} />
      </div>
    </section>
  )
}
