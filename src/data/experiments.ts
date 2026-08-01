import raw from './experiments.json'

export type Experiment = {
  id: string
  title: string
  description: string
  url: string | null
  image: string | null
  tags: string[]
  date: string
  /** Paragraph shown inside the wireframe browser body */
  body: string
}

export const experiments = raw as Experiment[]
