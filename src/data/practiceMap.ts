export type PracticeAxis = {
  neg: string
  pos: string
}

/** Axes for the practice map (normalized −1…1). */
export const practiceAxes = {
  /** Foundational ← → Experimental */
  x: { neg: 'foundational', pos: 'experimental' } satisfies PracticeAxis,
  /** Strategic ← → Visual */
  y: { neg: 'strategic', pos: 'visual' } satisfies PracticeAxis,
  /** General ← → Specific */
  z: { neg: 'general', pos: 'specific' } satisfies PracticeAxis,
} as const

export type PracticeNodeShape = 'sphere' | 'box' | 'tetrahedron'

export type PracticeConcept = {
  id: string
  label: string
  /** −1 foundational … +1 experimental */
  x: number
  /** −1 strategic … +1 visual */
  y: number
  /** −1 general … +1 specific */
  z: number
  note: string
  /** Optional marker form; otherwise derived from id. */
  shape?: PracticeNodeShape
}

/** Stable shape assignment — spheres only for now. */
export function nodeShapeFor(concept: PracticeConcept): PracticeNodeShape {
  if (concept.shape) return concept.shape
  return 'sphere'
}

/**
 * Plotted practice vocabulary — edit freely; Work page hosts the sandbox map.
 * Coordinates roughly match the collected 3D concept graph.
 */
export const practiceConcepts: PracticeConcept[] = [
  {
    id: 'editorial',
    label: 'editorial',
    x: -0.55,
    y: 0.72,
    z: 0.45,
    note: 'type, pacing, and page as a composed argument.',
  },
  {
    id: 'aesthetics',
    label: 'aesthetics',
    x: -0.42,
    y: 0.88,
    z: 0.25,
    note: 'taste as a material — what the eye trusts before the brief.',
  },
  {
    id: 'creative-direction',
    label: 'creative direction',
    x: -0.68,
    y: 0.58,
    z: 0.55,
    note: 'holding a north star while the medium keeps changing.',
  },
  {
    id: 'typography',
    label: 'typography',
    x: 0.35,
    y: 0.82,
    z: 0.5,
    note: 'letters as architecture; mono as instrument.',
  },
  {
    id: 'digital-motion',
    label: 'digital motion',
    x: 0.55,
    y: 0.7,
    z: 0.35,
    note: 'timing as manners — motion that behaves in company.',
  },
  {
    id: 'visual-experimentation',
    label: 'visual experimentation',
    x: 0.72,
    y: 0.62,
    z: 0.2,
    note: 'permission to misbehave before the product asks for polish.',
  },
  {
    id: 'visual-development',
    label: 'visual development',
    x: 0.48,
    y: 0.45,
    z: 0.55,
    note: 'growing a look until it can carry a system.',
  },
  {
    id: 'identity-physical-motion',
    label: 'identity through physical motion',
    x: 0.65,
    y: 0.35,
    z: 0.7,
    note: 'bodies, props, and gesture as brand material.',
  },
  {
    id: 'digital-ecosystems',
    label: 'digital ecosystems',
    x: 0.78,
    y: 0.22,
    z: 0.4,
    note: 'surfaces that talk to each other without a meeting.',
  },
  {
    id: 'audiovisual',
    label: 'audiovisual',
    x: 0.05,
    y: 0.15,
    z: 0.1,
    note: 'image and sound sharing one tempo.',
  },
  {
    id: 'paid-media',
    label: 'paid media',
    x: 0.12,
    y: -0.05,
    z: -0.15,
    note: 'attention bought carefully — still a design problem.',
  },
  {
    id: 'physical-ecosystems',
    label: 'physical ecosystems',
    x: -0.45,
    y: 0.05,
    z: 0.15,
    note: 'rooms, objects, and paths as the interface.',
  },
  {
    id: 'context',
    label: 'context',
    x: -0.7,
    y: -0.35,
    z: -0.45,
    note: 'what surrounds the work before the work starts.',
  },
  {
    id: 'trend-forecasting',
    label: 'trend forecasting',
    x: -0.35,
    y: -0.45,
    z: -0.55,
    note: 'reading the weather without chasing every cloud.',
  },
  {
    id: 'communities',
    label: 'communities',
    x: -0.55,
    y: -0.55,
    z: -0.35,
    note: 'people as the durable unit of product.',
  },
  {
    id: 'zeitgeist',
    label: 'zeitgeist',
    x: -0.25,
    y: -0.65,
    z: -0.5,
    note: 'the shared mood a piece has to answer to.',
  },
  {
    id: 'management',
    label: 'management',
    x: -0.6,
    y: -0.75,
    z: -0.25,
    note: 'constraints, calendars, and care as craft.',
  },
  {
    id: 'narrative',
    label: 'narrative',
    x: -0.4,
    y: -0.5,
    z: -0.1,
    note: 'the story that makes a system legible.',
  },
  {
    id: 'innovative-conceptualization',
    label: 'innovative conceptualization',
    x: 0.15,
    y: -0.55,
    z: 0.05,
    note: 'the idea before the screen — still deserves a prototype.',
  },
  {
    id: 'critical-sociology',
    label: 'critical sociology',
    x: 0.45,
    y: -0.7,
    z: 0.55,
    note: 'asking who a system serves — and who it leaves out.',
  },
  {
    id: 'identity-introspection',
    label: 'identity through introspection',
    x: 0.55,
    y: -0.55,
    z: 0.65,
    note: 'inward work that shows up as outward form.',
  },
  {
    id: 'identity-food',
    label: 'identity through food design',
    x: 0.7,
    y: -0.65,
    z: 0.75,
    note: 'taste, ritual, and table as identity systems.',
  },
]
