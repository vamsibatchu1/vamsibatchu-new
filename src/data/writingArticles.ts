import columnsJson from './writing-articles/columns.json'

export type WritingBlock =
  | { type: 'p'; text: string }
  | {
      type: 'image'
      src: string
      alt: string
      caption?: string
      /** Resolved Vite URL filled at load */
      url?: string
    }

export type WritingArticle = {
  id: string
  title: string
  kind: string
  year: number
  excerpt: string
  blocks: WritingBlock[]
}

export type WritingEntry = {
  id: string
  year: number
  title: string
  kind: string
  excerpt: string
}

export type WritingColumn = {
  id: string
  label: string
  entries: WritingEntry[]
}

const articleModules = import.meta.glob<WritingArticle>('./writing-articles/*.json', {
  eager: true,
  import: 'default',
})

const imageModules = import.meta.glob<string>(
  '../assets/stills/*.{jpg,jpeg,png,webp,gif}',
  {
  eager: true,
  query: '?url',
  import: 'default',
},
)

function resolveImageSrc(filename: string): string | null {
  const key = `../assets/stills/${filename}`
  return imageModules[key] ?? null
}

function resolveArticle(article: WritingArticle): WritingArticle {
  return {
    ...article,
    blocks: article.blocks.map((block) => {
      if (block.type !== 'image') return block
      const url = resolveImageSrc(block.src)
      return url ? { ...block, url } : block
    }),
  }
}

function articleIdFromPath(path: string): string | null {
  const base = path.split('/').pop() ?? ''
  if (base === 'columns.json' || !base.endsWith('.json')) return null
  return base.replace(/\.json$/, '')
}

export const writingArticles: Record<string, WritingArticle> = Object.fromEntries(
  Object.entries(articleModules)
    .map(([path, raw]) => {
      const id = articleIdFromPath(path)
      if (!id || !raw || !Array.isArray(raw.blocks)) return null
      return [id, resolveArticle({ ...raw, id: raw.id || id })] as const
    })
    .filter((row): row is readonly [string, WritingArticle] => row !== null),
)

export function getWritingArticle(id: string): WritingArticle | null {
  return writingArticles[id] ?? null
}

const columns = columnsJson as Record<string, string[]>

const columnMeta: { id: string; label: string }[] = [
  { id: 'essays', label: 'essays' },
  { id: 'notes', label: 'notes' },
  { id: 'talks', label: 'talks' },
]

function toEntry(article: WritingArticle): WritingEntry {
  return {
    id: article.id,
    year: article.year,
    title: article.title,
    kind: article.kind,
    excerpt: article.excerpt,
  }
}

/** Archive columns — order from columns.json; metadata from article files */
export const writingColumns: WritingColumn[] = columnMeta.map(({ id, label }) => {
  const ids = columns[id] ?? []
  const entries = ids
    .map((articleId) => writingArticles[articleId])
    .filter((a): a is WritingArticle => Boolean(a))
    .map(toEntry)
  return { id, label, entries }
})

export function findWritingEntry(id: string): WritingEntry | undefined {
  for (const col of writingColumns) {
    const hit = col.entries.find((e) => e.id === id)
    if (hit) return hit
  }
  return undefined
}
