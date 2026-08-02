import raw from './experiments.json'

export type ExperimentKind = 'image' | 'music' | 'video'

export type Experiment = {
  id: string
  title: string
  /** Experiment log index, e.g. "01/52" */
  log: string
  description: string
  url: string | null
  image: string | null
  /** Filename inside `src/assets/experiments/videos/` */
  video: string | null
  /** Coarse media kind used by the Experiments filter strip */
  kind: ExperimentKind
  tags: string[]
  date: string
  /** Paragraph shown inside the wireframe browser body */
  body: string
  /** Resolved URL for the thumbnail video (filled at module load). */
  videoUrl: string | null
}

export const EXPERIMENT_FILTERS = ['all', 'image', 'music', 'video'] as const
export type ExperimentFilter = (typeof EXPERIMENT_FILTERS)[number]

const videoModules = import.meta.glob<string>(
  '../assets/experiments/videos/*.mp4',
  { eager: true, query: '?url', import: 'default' },
)

function resolveVideoUrl(filename: string | null): string | null {
  if (!filename) return null
  const key = `../assets/experiments/videos/${filename}`
  return videoModules[key] ?? null
}

export const experiments: Experiment[] = (raw as Omit<Experiment, 'videoUrl'>[]).map(
  (exp) => ({
    ...exp,
    videoUrl: resolveVideoUrl(exp.video),
  }),
)
