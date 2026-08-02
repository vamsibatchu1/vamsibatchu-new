export type WritingEntry = {
  id: string
  year: number
  title: string
  kind: string
  /** Revealed when the row expands */
  excerpt: string
}

export type WritingColumn = {
  id: string
  label: string
  entries: WritingEntry[]
}

type Draft = Omit<WritingEntry, 'excerpt'>

function entry(draft: Draft, excerpt: string): WritingEntry {
  return { ...draft, excerpt }
}

/** Archive columns — essays / notes / talks */
export const writingColumns: WritingColumn[] = [
  {
    id: 'essays',
    label: 'essays',
    entries: [
      entry(
        { id: 'holding-the-model', year: 2026, title: 'holding the model', kind: 'essay' },
        'on keeping a hand on the wheel while the model drafts ahead — when to trust the suggestion, when to cut it, and how the interface should make that choice feel light instead of anxious.',
      ),
      entry(
        { id: 'interfaces-that-argue-back', year: 2026, title: 'interfaces that argue back', kind: 'essay' },
        'a case for tools that push back: soft resistance, better defaults, and the small frictions that keep a person in the loop without turning the screen into a lecture.',
      ),
      entry(
        { id: 'trust-later-steer-first', year: 2025, title: 'trust later, steer first', kind: 'essay' },
        'steer before you trust. this piece maps a few patterns for guiding generative systems early — hold, nudge, undo — so confidence can arrive after the craft does.',
      ),
      entry(
        { id: 'small-surfaces-loud-questions', year: 2025, title: 'small surfaces, loud questions', kind: 'essay' },
        'most of the interesting product work starts on a tiny surface: one screen, one gesture, one stubborn question. this essay is about keeping the frame small long enough for the idea to get honest.',
      ),
      entry(
        { id: 'the-seam-as-a-feature', year: 2025, title: 'the seam as a feature', kind: 'essay' },
        'visible seams invite a hand. rather than hiding every join between human and model, leave a few readable edges — places where authorship, uncertainty, and editability show.',
      ),
      entry(
        { id: 'when-a-button-is-a-promise', year: 2024, title: 'when a button is a promise', kind: 'essay' },
        'every control is a contract. what the label says, what the motion confirms, and what happens when the promise breaks — recovery as part of the interaction, not an afterthought.',
      ),
      entry(
        { id: 'attention-as-scarce-material', year: 2024, title: 'attention as scarce material', kind: 'essay' },
        'treat attention like a material budget: spend it on pacing, on the quiet after a headline, on the thumbnail that pulls before the caption lands. everything else can wait.',
      ),
      entry(
        { id: 'prototypes-before-polish', year: 2024, title: 'prototypes before polish', kind: 'essay' },
        'ship the smallest honest version. polish is a second draft of feeling; prototypes are where the argument is tested in someone’s hand.',
      ),
      entry(
        { id: 'systems-that-still-surprise', year: 2023, title: 'systems that still surprise', kind: 'essay' },
        'systems thinking without the jargon — inputs, outputs, feedback — and room left for surprise so the product does not flatten into a flowchart.',
      ),
      entry(
        { id: 'designing-recovery-paths', year: 2023, title: 'designing recovery paths', kind: 'essay' },
        'failure is part of the path. design the way back: clear undo, calm empty states, and copy that does not blame the person holding the tool.',
      ),
      entry(
        { id: 'type-as-architecture', year: 2023, title: 'type as architecture', kind: 'essay' },
        'type is not decoration; it is structure. how measure, weight, and rhythm build rooms for reading — especially when the content is unfinished on purpose.',
      ),
      entry(
        { id: 'motion-as-manners', year: 2022, title: 'motion as manners', kind: 'essay' },
        'motion is how an interface behaves in company. timing, easing, and restraint as etiquette — not spectacle for its own sake.',
      ),
      entry(
        { id: 'borrowing-structure-freely', year: 2022, title: 'borrowing structure freely', kind: 'essay' },
        'borrow structure, invent the feeling. a short argument for stealing grids, rhythms, and archive layouts while keeping the voice unmistakably yours.',
      ),
      entry(
        { id: 'the-portfolio-as-instrument', year: 2022, title: 'the portfolio as instrument', kind: 'essay' },
        'portfolio as instrument, not brochure — samples you can play, rearrange, and stress-test. the site should teach how you think, not only what you shipped.',
      ),
      entry(
        { id: 'legibility-at-the-edge', year: 2021, title: 'legibility at the edge', kind: 'essay' },
        'chasing the moment a system becomes legible — and a little bit alive — without sanding off the weird edges that made it worth building.',
      ),
      entry(
        { id: 'craft-under-constraint', year: 2021, title: 'craft under constraint', kind: 'essay' },
        'narrow widths, short deadlines, strange materials. constraints that sing, and craft that gets sharper because of them.',
      ),
    ],
  },
  {
    id: 'notes',
    label: 'notes',
    entries: [
      entry(
        { id: 'lab-note-cursor-magnets', year: 2026, title: 'lab note: cursor magnets', kind: 'field note' },
        'the magnets still stick on the wrong axis. snap radius too generous; keeping the bug because the corrected version felt dead.',
      ),
      entry(
        { id: 'damping-0-42-and-the-jelly-spring', year: 2026, title: 'damping 0.42 and the jelly spring', kind: 'field note' },
        'spring too soft, damping at 0.42. the card lands like jelly. tuned it three times, then shipped the wobbly one.',
      ),
      entry(
        { id: 'mono-justify-still-uneven', year: 2025, title: 'mono justify still uneven', kind: 'field note' },
        'justifying monospace without looking broken. measured twice; the uneven gaps might be the texture we keep.',
      ),
      entry(
        { id: 'stipple-behind-the-macaw', year: 2025, title: 'stipple behind the macaw', kind: 'field note' },
        'noise → dots → a breathing field behind the landing gif. quiet enough to miss, alive enough to notice later.',
      ),
      entry(
        { id: 'paper-stack-rotate-4', year: 2025, title: 'paper stack, rotate −4°', kind: 'field note' },
        'api doc card springs in rotated about minus four degrees — printed, slightly crooked, ready to pick up.',
      ),
      entry(
        { id: 'nav-labels-collapsing-to-bars', year: 2024, title: 'nav labels collapsing to bars', kind: 'field note' },
        'on scroll, labels reduce to color bars. navigation as a thin instrument panel instead of a sentence you keep rereading.',
      ),
      entry(
        { id: 'pretext-drift-across-five-columns', year: 2024, title: 'pretext drift across five columns', kind: 'field note' },
        'one stream, five columns, movable walls. drag an obstacle and watch the paragraph find a new channel.',
      ),
      entry(
        { id: 'fill-headline-as-barcode', year: 2024, title: 'fill headline as barcode', kind: 'field note' },
        'headline stretches into bars with the cursor field. less a title, more a responsive instrument.',
      ),
      entry(
        { id: 'scroll-cube-at-30', year: 2023, title: 'scroll cube at ±30°', kind: 'field note' },
        'two faces fold at the midline. the about page becomes a cube you read through, not a column you finish.',
      ),
      entry(
        { id: 'untitled-windows-zero-tabs', year: 2023, title: 'untitled windows, zero tabs', kind: 'field note' },
        'a room of browsers with zero tabs. every surface a half-open thought; naming too early freezes the experiment.',
      ),
      entry(
        { id: 'weekend-soft-body-keep-the-bug', year: 2023, title: 'weekend soft-body keep the bug', kind: 'field note' },
        'throwaway soft-body toy. the late stretch made it feel squishy — kept the wrong solver on purpose.',
      ),
      entry(
        { id: 'tractor-feed-profile-loader', year: 2022, title: 'tractor-feed profile loader', kind: 'field note' },
        'punch holes, press enter. the form pretends to be paper moving through a printer.',
      ),
      entry(
        { id: 'hairline-rules-tracking-0-14', year: 2022, title: 'hairline rules, tracking 0.14', kind: 'field note' },
        'uppercase only, tracking wide, hairlines between rows. specimen sheet energy on a product page.',
      ),
      entry(
        { id: 'z-index-fight-window-three-wins', year: 2022, title: 'z-index fight, window three wins', kind: 'field note' },
        'click to raise, drag to rearrange. window seventeen was on top until three got the pointer.',
      ),
      entry(
        { id: 'refresh-loses-the-frame', year: 2021, title: 'refresh loses the frame', kind: 'field note' },
        'local only, no export. if it mattered enough to keep, it would already have a name and a url.',
      ),
      entry(
        { id: 'still-untitled-on-purpose', year: 2021, title: 'still untitled on purpose', kind: 'field note' },
        'some windows refuse a name. the blank title is a reminder that this is still a lab, not a launch.',
      ),
    ],
  },
  {
    id: 'talks',
    label: 'talks',
    entries: [
      entry(
        { id: 'building-intentional-experiences', year: 2026, title: 'building intentional experiences', kind: 'talk' },
        'a talk on intentional experiences — where motion, models, and craft share the same room, and every surface earns a reason to exist.',
      ),
      entry(
        { id: 'ai-surfaces-you-can-hold', year: 2025, title: 'ai surfaces you can hold', kind: 'talk' },
        'hold / steer patterns for ai ui. small controls, big uncertainty, and keeping the human in the loop without theater.',
      ),
      entry(
        { id: 'from-prototype-to-product-feel', year: 2025, title: 'from prototype to product feel', kind: 'talk' },
        'how a weekend prototype grows a product feel: pacing, type, recovery, and the moment it stops apologizing for being unfinished.',
      ),
      entry(
        { id: 'interaction-at-the-edge-of-models', year: 2024, title: 'interaction at the edge of models', kind: 'talk' },
        'interaction design when the collaborator has opinions. editing the model’s voice without erasing its usefulness.',
      ),
      entry(
        { id: 'why-small-interfaces-matter', year: 2024, title: 'why small interfaces matter', kind: 'talk' },
        'a short talk on tiny surfaces — why the first honest frame beats a dashboard full of undecided features.',
      ),
      entry(
        { id: 'pacing-type-and-touch', year: 2024, title: 'pacing, type, and touch', kind: 'talk' },
        'three materials of product feel: how pacing, typography, and touch teach people what the system is before they read a word.',
      ),
      entry(
        { id: 'studio-experiments-in-public', year: 2023, title: 'studio experiments in public', kind: 'talk' },
        'shipping experiments before they are polite. what changes when the lab is visible and the archive stays weird.',
      ),
      entry(
        { id: 'when-systems-become-legible', year: 2023, title: 'when systems become legible', kind: 'talk' },
        'the moment a system clicks into place for someone new — and how to design for that click without over-explaining.',
      ),
      entry(
        { id: 'commissions-and-side-quests', year: 2023, title: 'commissions and side quests', kind: 'talk' },
        'small intent, big curiosity. how commissions fund the odd experiments that never fit a roadmap slide.',
      ),
      entry(
        { id: 'designing-with-unfinished-tools', year: 2022, title: 'designing with unfinished tools', kind: 'talk' },
        'building ui on tools that are still half-wired. designing for change mid-flight without pretending the ground is solid.',
      ),
      entry(
        { id: 'critique-early-often-kindly', year: 2022, title: 'critique early, often, kindly', kind: 'talk' },
        'critique as a practice: early enough to matter, often enough to stay honest, kind enough that people keep bringing work.',
      ),
      entry(
        { id: 'protecting-deep-work-blocks', year: 2022, title: 'protecting deep work blocks', kind: 'talk' },
        'calendar as craft. treating deep work like a sacred site, then opening the door so the world can rearrange the furniture.',
      ),
      entry(
        { id: 'color-as-punctuation', year: 2021, title: 'color as punctuation', kind: 'talk' },
        'color as punctuation, not wallpaper — marks that pace the eye the way commas pace a sentence.',
      ),
      entry(
        { id: 'accessibility-as-baseline', year: 2021, title: 'accessibility as baseline', kind: 'talk' },
        'accessibility as the first draft, not a patch. what changes when the baseline is legible, keyboardable, and calm.',
      ),
      entry(
        { id: 'same-words-new-shape', year: 2021, title: 'same words, new shape', kind: 'talk' },
        'same library of words, new composition. a talk on reflow as craft — content fixed, path live.',
      ),
    ],
  },
]

export function findWritingEntry(id: string): WritingEntry | undefined {
  for (const col of writingColumns) {
    const hit = col.entries.find((e) => e.id === id)
    if (hit) return hit
  }
  return undefined
}
