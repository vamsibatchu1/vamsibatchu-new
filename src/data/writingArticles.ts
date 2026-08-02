import raw from './writing-articles/index.json'

const imageModules = import.meta.glob<string>('../assets/home-assets/*.{jpg,jpeg,png,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
})

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

function resolveImageSrc(filename: string): string | null {
  const key = `../assets/home-assets/${filename}`
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

const map = raw as Record<string, WritingArticle>

export const writingArticles: Record<string, WritingArticle> = Object.fromEntries(
  Object.entries(map).map(([id, article]) => [id, resolveArticle(article)]),
)

export function getWritingArticle(id: string): WritingArticle | null {
  return writingArticles[id] ?? null
}
