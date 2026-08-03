import creativeIntelligence from '../../assets/home/creative-intelligence.svg'
import play from '../../assets/home/posters/play.webp'
import taste from '../../assets/home/posters/taste.webp'
import hero4 from '../../assets/shared/stills/hero4.jpg'
import hero5 from '../../assets/shared/stills/hero5.jpg'
import hero7 from '../../assets/shared/stills/hero7.jpg'
import { type MarkTone } from '../../components/Mark'
import { type CreativeTextFlow } from './CreativeTextRow'

const creativeKeywords: CreativeTextFlow['keywords'] = [
  {
    word: 'emerging media',
    gloss:
      'New forms of expression that appear when technology changes what can be seen, heard, generated, or interacted with. The medium may be unfamiliar, but the goal remains human connection.',
    tone: 'blue' as MarkTone,
  },
  {
    word: 'observe carefully',
    gloss:
      'Paying attention before attempting to make. Watching how people behave, how objects communicate, and how small details change the feeling of an experience.',
    tone: 'purple' as MarkTone,
  },
  {
    word: 'every experience becomes material',
    gloss:
      'What we watch, read, hear, notice, and remember quietly enters the work. Creation is often the recombination of things we have cared enough to notice.',
    tone: 'orange' as MarkTone,
  },
  {
    word: 'empty page',
    gloss:
      'A useful fiction. No page is truly empty. We arrive with memories, references, habits, questions, and fragments gathered over time.',
    tone: 'pink' as MarkTone,
  },
  {
    word: 'ideas often arrive as fragments',
    gloss:
      'Most ideas do not begin as complete concepts. They appear as images, phrases, gestures, references, or small tensions that only reveal their relationship through making.',
    tone: 'yellow' as MarkTone,
  },
  {
    word: 'taste',
    gloss:
      'The ability to recognize what deserves attention. Taste helps us choose between possibilities, identify what feels alive, and remove what weakens the idea.',
    tone: 'green' as MarkTone,
  },
  {
    word: 'final five percent',
    gloss:
      'The part of the process where small choices create a disproportionate difference. Timing, spacing, language, motion, sound, and restraint turn something functional into something felt.',
    tone: 'blue' as MarkTone,
  },
  {
    word: 'a pause creates room',
    gloss:
      'Silence and delay are active materials. A pause can create anticipation, focus attention, or give someone time to form their own interpretation.',
    tone: 'purple' as MarkTone,
  },
  {
    word: 'framing the problem',
    gloss:
      'Deciding which question is actually worth answering. The quality of the outcome is often determined before anything is generated, designed, or built.',
    tone: 'orange' as MarkTone,
  },
  {
    word: 'point of view',
    gloss:
      'A recognizable way of seeing and choosing. Point of view gives separate decisions a shared logic and prevents the work from becoming a collection of fashionable effects.',
    tone: 'pink' as MarkTone,
  },
  {
    word: 'play',
    gloss:
      'Exploration without the immediate pressure of usefulness. Play creates room for accidents, strange combinations, and discoveries that structured processes often miss.',
    tone: 'yellow' as MarkTone,
  },
  {
    word: 'knowing when it should remain quiet',
    gloss:
      'Resisting the urge to make every surface intelligent, animated, conversational, or expressive. Sometimes the best design decision is to let the experience recede.',
    tone: 'green' as MarkTone,
  },
  {
    word: 'protect the character',
    gloss:
      'Preserving the qualities that make an idea distinct as it moves through tools, iterations, and systems. Refinement should clarify identity, not sand it away.',
    tone: 'blue' as MarkTone,
  },
  {
    word: 'human decisions',
    gloss:
      'The judgments, edits, references, refusals, and small acts of care that give generated material direction and make the finished work feel authored.',
    tone: 'purple' as MarkTone,
  },
]

/**
 * creative-text — one Pretext article streamed across five columns.
 * Fixed 480px stage: center SVG silhouette + posters; dragging rearranges wrap.
 */
export const creativeFlow: CreativeTextFlow = {
  text: `
    I work between product design, code, and emerging media. The material
    changes: interfaces, language, images, motion, sound, and models. But the
    practice remains the same: observe carefully, make something, test it, and
    refine it until the idea becomes clear. Every experience becomes material.
    A photograph, a scene from a film, an unusual piece of typography, a
    conversation, or a tool that behaves unexpectedly. Creation rarely begins
    with an empty page. It begins with everything we have paid attention to.
    Ideas often arrive as fragments rather than complete answers. The work is
    learning how to notice the connection between them, preserve what is
    surprising, and give the fragments enough structure to become something
    others can enter. Models can produce endless possibilities, but taste helps
    us decide which ones have meaning. It is the ability to recognize what
    feels alive, what feels derivative, what should be refined, and what should
    be removed entirely. Craft is not disappearing; it is changing shape. It
    lives in the prompt, the prototype, the transition, the pacing, the system,
    the edit, and the final five percent that turns an output into an
    experience. The quality of a piece is often found in the relationships
    between its parts: how language meets motion, how an image changes the
    meaning of a sentence, or how a pause creates room for curiosity. Working
    with AI is not simply asking a machine to make something. It is framing the
    problem, setting constraints, choosing references, combining tools,
    evaluating results, and taking responsibility for what reaches the world. A
    model can offer material, but it cannot replace a point of view. The work of
    the creative is to shape possibility into something intentional, coherent,
    and specific. Not every experiment needs to become a product. Some exist to
    test an interaction, stretch a medium, or reveal a question worth pursuing.
    Play is not separate from serious work; it is how new forms are discovered.
    New capabilities invite us to add more: more motion, more content, more
    generation, more intelligence. But not every surface needs to speak,
    predict, animate, or create. Sometimes the most thoughtful use of
    technology is knowing when it should remain quiet. I do not believe
    authorship requires making every pixel by hand. It requires having a point
    of view and caring enough to shape every part into a coherent whole. The
    tools will keep changing. The models will become faster, larger, and more
    capable. What remains valuable is our ability to direct them with
    curiosity, judgment, care, and taste. Making with these systems also
    requires attention to what gets lost along the way. Speed can flatten
    nuance, and abundance can make every choice feel interchangeable. The
    creative task is to protect the character of an idea, keep its edges
    intact, and make sure the final experience still carries a trace of the
    human decisions that shaped it.
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
      id: 'taste',
      column: 1,
      top: 0,
      widthRatio: 0.58,
      float: 'left',
      aspectRatio: 3654 / 4584,
      src: taste,
      alt: 'Taste still',
    },
    {
      id: 'play',
      column: 4,
      top: 48,
      widthRatio: 0.56,
      float: 'right',
      aspectRatio: 3967 / 4191,
      src: play,
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
