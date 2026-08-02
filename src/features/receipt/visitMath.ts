/** Shared visit-receipt types + nerdy accounting helpers. */

export type PageStat = {
  path: string
  label: string
  ms: number
  clicks: number
  scrolls: number
}

export type VisitSnapshot = {
  /** First paint / provider mount (session start). */
  startedAt: number
  /** Moment the receipt was printed (frozen). */
  endedAt: number
  pages: PageStat[]
  /** Unique paths in visit order. */
  routeOrder: string[]
  sessionId: string
  totalClicks: number
  totalScrolls: number
}

const LABELS: Record<string, string> = {
  '/': 'landing',
  '/home': 'home',
  '/work': 'work',
  '/experiments': 'experiments',
  '/writing': 'writing',
  '/about': 'about',
}

export function pathLabel(path: string): string {
  if (LABELS[path]) return LABELS[path]
  const base = path.split('/').filter(Boolean)[0]
  return base ?? 'unknown'
}

export function formatDuration(ms: number): string {
  const totalSec = Math.max(0, Math.floor(ms / 1000))
  const m = Math.floor(totalSec / 60)
  const s = totalSec % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

/** Fake-but-stable “token” burn — time + clicks + scrolls. */
export function tokensFor(page: Pick<PageStat, 'ms' | 'clicks' | 'scrolls'>): number {
  return Math.max(
    0,
    Math.round(page.ms / 80) + page.clicks * 17 + page.scrolls * 4,
  )
}

export function sumTokens(pages: PageStat[]): number {
  return pages.reduce((n, p) => n + tokensFor(p), 0)
}

export function sumMs(pages: PageStat[]): number {
  return pages.reduce((n, p) => n + p.ms, 0)
}

/** Wall-clock session length from open → print. */
export function sessionWallMs(snapshot: VisitSnapshot): number {
  return Math.max(0, snapshot.endedAt - snapshot.startedAt)
}

export function formatTokens(n: number): string {
  return n.toLocaleString('en-US')
}

export function makeSessionId(startedAt: number): string {
  const a = startedAt.toString(36).slice(-4).toUpperCase()
  const b = Math.floor(Math.random() * 0xffff)
    .toString(16)
    .padStart(4, '0')
    .toUpperCase()
  return `${a}-${b}`
}

export function formatReceiptClock(ts: number): { date: string; time: string } {
  const d = new Date(ts)
  const date = d.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: '2-digit',
  })
  const time = d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
  return { date, time }
}
