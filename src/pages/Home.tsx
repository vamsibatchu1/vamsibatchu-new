import CreativeTextRow, {
  type CreativeTextFlow,
} from '../components/CreativeTextRow'
import FeatureCardRow, {
  type FeatureCardData,
} from '../components/FeatureCardRow'
import FillHeadline from '../components/FillHeadline'
import ManifestCard from '../components/ManifestCard'
import { markColors } from '../components/Mark'

const THUMB_GREY = '#efeeec'
const { pink, orange, blue, yellow, purple, green } = markColors

type WorkCard = {
  id: string
  label: string
  width: number
  height: number
  arrow: string
}

/**
 * creative-text — one Pretext article streamed across five columns.
 * Fixed 480px stage: text + images stay constant; dragging only rearranges flow.
 */
const creativeFlow: CreativeTextFlow = {
  text: `
    Practice. Creative technology at the edge of product and play —
    interfaces that feel hand-tuned, systems that still surprise when
    you lean on them. DeepMind. Member of technical staff building
    intentional experiences where motion, models, and craft share the
    same room. Method. Prototype first, polish later; every surface
    earns its place and every interaction gets a reason to exist.
    Studio. Side quests and commissions: experiments where layout,
    type, and interaction get to misbehave a little before they grow
    up into product. Notes. Field notes on AI, interaction, and making
    things — how tools reshape what a product can feel like in a hand,
    on a screen, in a room full of other people thinking out loud.
    Anywhere the brief is fuzzy, start with a small surface and a loud
    question. Atelier work prefers constraints that sing: narrow widths,
    short deadlines, strange materials. Writing is another prototype —
    sentences as components, paragraphs as layouts, arguments as
    navigation. Keep moving the pictures. Let the text find a new path.
    Columns are rooms; images are furniture. Shift a block and the
    sentences walk around it without changing what they say. That is
    the joke and the craft: one continuous voice, five vertical paths,
    obstacles that teach the type to bend. Measure twice, place once,
    then drag again because reflow is the point. Rhythm over ornament.
    Precision over spectacle. Playfulness with a straight face. Build
    tools people can feel. Leave seams visible enough to invite a hand.
    When the grid gets too polite, introduce a picture mid-column and
    watch the language negotiate. Soft hyphens of intent. Hard breaks
    of taste. Between them: work that holds up in daylight and still
    looks alive at night. Portfolio as instrument, not brochure. Each
    project a sample, each sample a question answered with motion,
    structure, and a little bit of nerve. Read across, not down only.
    The ending is wherever the last column runs out of air — until you
    move an image and the ending moves with it, same words, new shape.
    Attention is the scarce material. Spend it on pacing, on the quiet
    gap after a headline, on the way a thumbnail pulls the eye before
    the caption lands. Systems thinking without the jargon: inputs,
    outputs, feedback, and the human in the loop who still wants joy.
    A button is a promise. A scroll is a conversation. A model is a
    collaborator with opinions you have to edit. Design for recovery
    when things fail gracefully. Design for delight when they do not
    fail at all. Ship the smallest honest version, then iterate in
    public if you can. Collect references the way chefs collect knives —
    sharp, few, used constantly. Ignore trends that flatten your voice.
    Borrow structure freely; invent the feeling. Color as punctuation.
    Type as architecture. Motion as manners. Accessibility as baseline,
    not a patch. Document the weird decisions so future-you remembers
    why the corner is rounded that way. Invite critique early, often,
    kindly. Protect deep work blocks like calendar sacred sites. Then
    open the door and let the world rearrange the furniture again.
    Same library of words, same four pictures — only the path changes.
    That constancy is the feature: content is fixed, composition is live.
    Fill the frame to the last line. Leave no idle column if you can help it.
  `,
  images: [
    {
      id: 'img-a',
      column: 0,
      top: 220,
      height: 160,
      widthRatio: 1,
    },
    {
      id: 'img-b',
      column: 2,
      top: 100,
      height: 150,
      widthRatio: 1,
    },
    {
      id: 'img-c',
      column: 3,
      top: 260,
      height: 150,
      widthRatio: 0.62,
      float: 'right',
    },
    {
      id: 'img-d',
      column: 4,
      top: 48,
      height: 140,
      widthRatio: 1,
    },
  ],
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

/** projects — feature cards with barcode signatures */
const projectCards: FeatureCardData[] = [
  {
    id: 'anywhere',
    title: 'anywhere',
    subtitle: 'member of technical staff at google deepmind',
    body: 'Building playful, precise digital experiences — systems that feel alive under your fingertips each day.',
    barcode: [
      { color: orange, width: 31 },
      { color: yellow, width: 9 },
      { color: blue, width: 22 },
    ],
  },
  {
    id: 'atelier',
    title: 'atelier.',
    subtitle: 'selected studio experiments and commissions.',
    body: 'Prototypes, interfaces, and side quests where craft meets curiosity on small surfaces with real intent.',
    barcode: [
      { color: blue, width: 14 },
      { color: orange, width: 28 },
      { color: green, width: 8 },
      { color: yellow, width: 18 },
    ],
  },
  {
    id: 'notes',
    title: 'notes...',
    subtitle: 'writing: interaction, ai, and making things.',
    body: 'Field notes from building — how layout, motion, and models reshape what a product can feel like to use.',
    barcode: [
      { color: purple, width: 10 },
      { color: orange, width: 24 },
      { color: yellow, width: 16 },
      { color: blue, width: 7 },
      { color: pink, width: 20 },
    ],
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
      {/* hero — headline + manifesto */}
      <div id="hero" className={rowClass}>
        <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-2 lg:gap-10">
          <FillHeadline />
          <ManifestCard />
        </div>
      </div>

      {/* creative-text — Pretext continuous flow + image obstacles */}
      <div id="creative-text" className={rowClass}>
        <CreativeTextRow flow={creativeFlow} />
      </div>

      {/* gallery — primary thumbnail strip */}
      <div id="gallery" className={rowClass}>
        <CardRow cards={galleryItems} />
      </div>

      {/* archive — secondary thumbnail strip */}
      <div id="archive" className={rowClass}>
        <CardRow cards={archiveItems} />
      </div>

      {/* projects — feature cards */}
      <div id="projects" className={rowClass}>
        <FeatureCardRow cards={projectCards} />
      </div>
    </section>
  )
}
