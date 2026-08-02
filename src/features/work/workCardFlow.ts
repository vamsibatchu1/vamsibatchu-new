import gdmWordmark from '../../assets/gdm.svg'
import geminiIcon from '../../assets/icons/gemini.svg'
import geminiOmniIcon from '../../assets/icons/gemini-omni.svg'
import geminiAudioIcon from '../../assets/icons/gemini-audio.svg'
import nanoBananaIcon from '../../assets/icons/nano-banana.svg'
import lyriaIcon from '../../assets/icons/lyria.svg'
import { type FlowImage } from '../home/creativeTextLayout'

/**
 * Copy + logo obstacles for the work-card text wrap.
 * Keep copy long enough to fill both columns around the marks.
 */
export const workCardText = `
  At Google DeepMind I work on generative systems that see, speak, compose,
  and act. The practice sits between research and product: shaping Gemini
  for agents and tools, Gemini Omni for multimodal making that starts with
  video, Nano Banana for image create and edit, Gemini Audio for real-time
  voice, and Lyria for high-fidelity music. Each model is a different
  surface on the same question — how intelligence becomes material people
  can use. Days move between prototypes, evaluations, interaction details,
  and the quiet craft that makes a system feel intentional rather than
  merely capable. The stack changes; the through-line is building interfaces
  where frontier models meet human attention, taste, and play. Models open
  new forms of media while the work remains about framing problems, keeping
  a point of view, and knowing when the experience should stay quiet.

  Much of the job is translation — taking a research capability and turning
  it into something a person can hold: an editor that feels sharp, a voice
  that listens without theater, an image tool that respects craft instead of
  flooding the canvas. I care about pacing, failure modes, and the small
  decisions that decide whether a model feels like a collaborator or a
  spectacle. Evaluation is part of design. So is restraint. The interesting
  work is rarely the demo; it is the path from a clever system to a usable
  one, and from a usable one to something with character. Between launches
  there is always another interface to refine, another edge case to name,
  another moment where the model should do less so the person can do more.

  I think in systems and in surfaces. A system has limits, latency, and a
  training story. A surface has timing, hierarchy, and the feeling of a first
  attempt. Good product work holds both at once. You cannot ship a point of
  view without understanding the model, and you cannot reveal the model
  without designing how it arrives. That is the craft I practice at DeepMind:
  making frontier capability legible, useful, and occasionally delightful,
  without pretending every blank canvas needs to be filled. Some of the best
  decisions are the ones that keep the tools quiet until they are needed.
`

/** Spread marks; keep widthRatio low so type owns the surroundings. */
export const workCardImages: FlowImage[] = [
  {
    id: 'gemini',
    column: 0,
    top: 20,
    widthRatio: 0.3,
    float: 'left',
    aspectRatio: 1,
    src: geminiIcon,
    alt: 'Gemini',
  },
  {
    id: 'gdm',
    column: 1,
    top: 48,
    widthRatio: 0.7,
    float: 'left',
    aspectRatio: 144 / 20,
    src: gdmWordmark,
    alt: 'Google DeepMind',
  },
  {
    id: 'omni',
    column: 1,
    top: 150,
    widthRatio: 0.28,
    float: 'right',
    aspectRatio: 1,
    src: geminiOmniIcon,
    alt: 'Gemini Omni',
  },
  {
    id: 'nano',
    column: 0,
    top: 240,
    widthRatio: 0.28,
    float: 'right',
    aspectRatio: 1,
    src: nanoBananaIcon,
    alt: 'Nano Banana',
  },
  {
    id: 'audio',
    column: 1,
    top: 340,
    widthRatio: 0.28,
    float: 'left',
    aspectRatio: 1,
    src: geminiAudioIcon,
    alt: 'Gemini Audio',
  },
  {
    id: 'lyria',
    column: 0,
    top: 440,
    widthRatio: 0.28,
    float: 'left',
    aspectRatio: 1,
    src: lyriaIcon,
    alt: 'Lyria',
  },
]
