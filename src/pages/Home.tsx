import CreativeTextRow from '../features/home/CreativeTextRow'
import { creativeFlow } from '../features/home/creativeFlow'
import { shellSectionY } from '../components/shellLayout'

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
      className="mb-1.5 block size-0 border-y-[4px] border-y-transparent border-l-[7px] lg:mb-2 lg:border-y-[5px] lg:border-l-[8px]"
      style={{ borderLeftColor: color }}
      aria-hidden
    />
  )
}

function Card({ card }: { card: WorkCard }) {
  return (
    <article className="flex max-w-full shrink-0 items-end gap-2 lg:gap-2.5">
      <div
        className="max-w-[11rem] shrink-0 lg:max-w-none"
        style={{
          width: card.width,
          aspectRatio: `${card.width} / ${card.height}`,
          backgroundColor: THUMB_GREY,
        }}
        aria-hidden
      />
      <div className="flex flex-col items-center pt-1">
        <Arrow color={card.arrow} />
        <span
          className="text-[9px] font-medium uppercase tracking-[0.14em] text-black lg:text-[10px]"
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
    <div className="flex flex-wrap items-end gap-x-6 gap-y-8 lg:justify-between lg:gap-x-8 lg:gap-y-10">
      {cards.map((card) => (
        <Card key={card.id} card={card} />
      ))}
    </div>
  )
}

const rowClass = shellSectionY

export default function Home() {
  return (
    <section
      className="flex flex-col"
      style={{ fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}
    >
      <div id="intro" className={rowClass}>
        <p className="w-full max-w-full text-[22px] leading-[1.2] text-black lg:w-[80%] lg:text-[28px] lg:leading-[1.1]">
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
