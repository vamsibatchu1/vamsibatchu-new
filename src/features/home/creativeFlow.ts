import creativeIntelligence from '../../assets/creative-intelligence.svg'
import hero4 from '../../assets/stills/hero4.jpg'
import hero5 from '../../assets/stills/hero5.jpg'
import hero6 from '../../assets/stills/hero6.jpg'
import hero7 from '../../assets/stills/hero7.jpg'
import hero8 from '../../assets/stills/hero8.jpg'
import { type MarkTone } from '../../components/Mark'
import { type CreativeTextFlow } from './CreativeTextRow'

const creativeKeywords: CreativeTextFlow['keywords'] = [
  {
    word: 'navigation',
    gloss:
      'the path a hand takes through an interface — wayfinding made of type, motion, and memory',
    tone: 'blue' as MarkTone,
  },
  {
    word: 'deepmind',
    gloss:
      'where craft meets models — intentional experiences built as a member of technical staff',
    tone: 'purple' as MarkTone,
  },
  {
    word: 'prototype',
    gloss:
      'the smallest honest version of an idea, built to be broken before it is polished',
    tone: 'orange' as MarkTone,
  },
  {
    word: 'interaction',
    gloss:
      'the conversation between person and system — pacing, touch, and recovery as manners',
    tone: 'pink' as MarkTone,
  },
  {
    word: 'attention',
    gloss:
      'the scarce material of product — spent on gaps, headlines, and what the eye meets first',
    tone: 'yellow' as MarkTone,
  },
  {
    word: 'systems',
    gloss:
      'inputs, outputs, feedback — still allowed to surprise once they become legible',
    tone: 'green' as MarkTone,
  },
  {
    word: 'portfolio',
    gloss:
      'an instrument, not a brochure — samples you can play until the composition shifts',
    tone: 'blue' as MarkTone,
  },
  {
    word: 'rhythm',
    gloss:
      'ornament’s quieter sibling — the beat that holds type, motion, and empty space together',
    tone: 'orange' as MarkTone,
  },
]

/**
 * creative-text — one Pretext article streamed across five columns.
 * Fixed 480px stage: center SVG silhouette + posters; dragging rearranges wrap.
 */
export const creativeFlow: CreativeTextFlow = {
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
    Same library of words, same five pictures — only the path changes.
    That constancy is the feature: content is fixed, composition is live.
    Fill the frame to the last line. Leave no idle column if you can help it.
    Practice is a loop. Creative technology keeps asking what a product
    can feel like when type, models, and motion share one page. DeepMind
    work sits beside studio experiments; both insist on surfaces that
    stay legible under pressure. Method again: prototype first, polish
    later, let interaction teach the next cut. Notes accumulate — field
    scraps on attention, systems, rhythm, and the portfolio as instrument.
    Navigation is learned by moving through it. Keep the sentences walking.
    When one column runs out of air, the next one picks up mid-breath. That
    is how five paths stay one argument: finish the thought downward, then
    step sideways and continue. Borrow structure freely. Invent the feeling.
    Leave seams visible. Ship the smallest honest version and let the wrap
    around the mark remind you that composition is live. Start again when
    the column ends: the same voice continues in the next vertical room,
    wrapping the silhouette without losing the thread.
  `,
  images: [
    {
      id: 'hero4',
      column: 0,
      top: 36,
      widthRatio: 0.56,
      float: 'left',
      aspectRatio: 1080 / 1328,
      src: hero4,
      alt: 'Seoul Paloma Wool poster',
    },
    {
      id: 'hero5',
      column: 0,
      top: 999,
      widthRatio: 0.54,
      float: 'left',
      aspectRatio: 1500 / 1875,
      src: hero5,
      alt: 'Sock scarf instructional poster',
    },
    {
      id: 'hero6',
      column: 1,
      top: 0,
      widthRatio: 0.58,
      float: 'left',
      aspectRatio: 1080 / 1495,
      src: hero6,
      alt: 'ISA Gallery yellow grid poster',
    },
    {
      id: 'hero8',
      column: 4,
      top: 48,
      widthRatio: 0.56,
      float: 'right',
      aspectRatio: 1400 / 1750,
      src: hero8,
      alt: 'Photo Book Speed Date poster',
    },
    {
      id: 'hero7',
      column: 4,
      top: 999,
      widthRatio: 0.52,
      float: 'right',
      aspectRatio: 1920 / 2718,
      src: hero7,
      alt: 'Kinderoper Theater Magdeburg poster',
    },
  ],
  shapeSrc: creativeIntelligence,
  keywords: creativeKeywords,
}
