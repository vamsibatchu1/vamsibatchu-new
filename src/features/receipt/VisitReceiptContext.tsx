import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { useLocation } from 'react-router-dom'
import {
  makeSessionId,
  pathLabel,
  type PageStat,
  type VisitSnapshot,
} from './visitMath'

type PageBucket = {
  ms: number
  clicks: number
  scrolls: number
}

type VisitReceiptValue = {
  /** Frozen print — set when receipt opens; static until next open. */
  snapshot: VisitSnapshot | null
  open: boolean
  setOpen: (open: boolean) => void
}

const VisitReceiptContext = createContext<VisitReceiptValue | null>(null)

function emptyBucket(): PageBucket {
  return { ms: 0, clicks: 0, scrolls: 0 }
}

export function VisitReceiptProvider({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  const startedAtRef = useRef(Date.now())
  const sessionIdRef = useRef(makeSessionId(startedAtRef.current))
  const bucketsRef = useRef<Record<string, PageBucket>>({})
  const routeOrderRef = useRef<string[]>([pathname])
  const pathRef = useRef(pathname)
  const sliceStartRef = useRef(Date.now())
  const visibleRef = useRef(
    typeof document !== 'undefined' ? !document.hidden : true,
  )

  const [open, setOpenState] = useState(false)
  const [snapshot, setSnapshot] = useState<VisitSnapshot | null>(null)

  const ensure = useCallback((path: string) => {
    if (!bucketsRef.current[path]) bucketsRef.current[path] = emptyBucket()
    return bucketsRef.current[path]
  }, [])

  const flushTime = useCallback(() => {
    if (!visibleRef.current) return
    const path = pathRef.current
    const now = Date.now()
    const delta = now - sliceStartRef.current
    sliceStartRef.current = now
    if (delta > 0) ensure(path).ms += delta
  }, [ensure])

  const buildSnapshot = useCallback((): VisitSnapshot => {
    flushTime()
    const endedAt = Date.now()
    const order = routeOrderRef.current
    const pages: PageStat[] = order
      .map((path) => {
        const b = bucketsRef.current[path] ?? emptyBucket()
        return {
          path,
          label: pathLabel(path),
          ms: b.ms,
          clicks: b.clicks,
          scrolls: b.scrolls,
        }
      })
      .filter((p) => p.ms > 250 || p.clicks > 0 || p.scrolls > 0)

    // Include any paths that got activity but were missed in order (shouldn't happen)
    for (const [path, b] of Object.entries(bucketsRef.current)) {
      if (pages.some((p) => p.path === path)) continue
      if (b.ms > 250 || b.clicks > 0 || b.scrolls > 0) {
        pages.push({
          path,
          label: pathLabel(path),
          ms: b.ms,
          clicks: b.clicks,
          scrolls: b.scrolls,
        })
      }
    }

    return {
      startedAt: startedAtRef.current,
      endedAt,
      pages,
      routeOrder: [...order],
      sessionId: sessionIdRef.current,
      totalClicks: pages.reduce((n, p) => n + p.clicks, 0),
      totalScrolls: pages.reduce((n, p) => n + p.scrolls, 0),
    }
  }, [flushTime])

  const setOpen = useCallback(
    (next: boolean) => {
      if (next) {
        setSnapshot(buildSnapshot())
        setOpenState(true)
        return
      }
      setOpenState(false)
    },
    [buildSnapshot],
  )

  // Seed landing / first path
  useEffect(() => {
    ensure(pathname)
  }, [ensure, pathname])

  useEffect(() => {
    flushTime()
    const prev = pathRef.current
    pathRef.current = pathname
    ensure(pathname)
    if (pathname !== prev) {
      const order = routeOrderRef.current
      if (order[order.length - 1] !== pathname) order.push(pathname)
    }
    sliceStartRef.current = Date.now()
  }, [pathname, flushTime, ensure])

  useEffect(() => {
    const onVis = () => {
      if (document.hidden) {
        flushTime()
        visibleRef.current = false
      } else {
        visibleRef.current = true
        sliceStartRef.current = Date.now()
      }
    }
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [flushTime])

  useEffect(() => {
    const onClick = () => {
      ensure(pathRef.current).clicks += 1
    }
    let scrollAcc = 0
    let scrollTimer: number | null = null
    const onScroll = () => {
      scrollAcc += 1
      if (scrollTimer != null) return
      scrollTimer = window.setTimeout(() => {
        ensure(pathRef.current).scrolls += Math.min(scrollAcc, 8)
        scrollAcc = 0
        scrollTimer = null
      }, 400)
    }
    document.addEventListener('click', onClick, true)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      document.removeEventListener('click', onClick, true)
      window.removeEventListener('scroll', onScroll)
      if (scrollTimer != null) window.clearTimeout(scrollTimer)
    }
  }, [ensure])

  const value = useMemo(
    () => ({ snapshot, open, setOpen }),
    [snapshot, open, setOpen],
  )

  return (
    <VisitReceiptContext.Provider value={value}>
      {children}
    </VisitReceiptContext.Provider>
  )
}

export function useVisitReceipt() {
  const ctx = useContext(VisitReceiptContext)
  if (!ctx) {
    throw new Error('useVisitReceipt must be used within VisitReceiptProvider')
  }
  return ctx
}
