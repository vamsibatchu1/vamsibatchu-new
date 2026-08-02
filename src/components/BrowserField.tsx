import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { experiments } from '../data/experiments'
import BrowserComponent, { type BrowserRect } from './BrowserComponent'
import { BrowserHeap } from './browserHeapPhysics'

type FloatingBrowser = {
  experiment: (typeof experiments)[number]
  initial: BrowserRect
}

const TITLE_H = 32

function mulberry32(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Default window size: width drives a 16:9 content pane under the title bar. */
function sizeForVideoWidth(videoW: number) {
  return {
    w: videoW,
    h: TITLE_H + (videoW * 9) / 16,
  }
}

function buildFleet(
  items: typeof experiments,
  width: number,
  height: number,
): FloatingBrowser[] {
  const rand = mulberry32(20260731)
  return items.map((experiment) => {
    const videoW = 240 + rand() * 80
    const { w, h } = sizeForVideoWidth(videoW)
    const x = rand() * Math.max(24, width - w - 16)
    const y = 28 + rand() * Math.max(24, height - h - 40)
    const rotate = (rand() - 0.5) * 16
    return {
      experiment,
      initial: { x, y, w, h, rotate },
    }
  })
}

/**
 * Scatter of resizable wireframe browsers — weird lab wallpaper for Experiments.
 * Hover previews video; click focuses one window; the rest tumble into a Matter.js heap.
 */
export default function BrowserField({
  className = '',
}: {
  className?: string
}) {
  const shellRef = useRef<HTMLDivElement>(null)
  const spawnDims = useRef({ w: 1200, h: 640 })
  const [ready, setReady] = useState(false)
  const [topId, setTopId] = useState<string | null>(null)
  const [focusId, setFocusId] = useState<string | null>(null)
  const [minimized, setMinimized] = useState<string[]>([])
  const [fieldSize, setFieldSize] = useState({ w: 1200, h: 640 })
  const [heap, setHeap] = useState<BrowserHeap | null>(null)

  useLayoutEffect(() => {
    const node = shellRef.current
    if (!node) return

    const measure = () => {
      const next = { w: node.clientWidth, h: node.clientHeight }
      setFieldSize(next)
      if (!ready) {
        spawnDims.current = next
        setReady(true)
      }
    }

    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(node)
    return () => ro.disconnect()
  }, [ready])

  // Spin up / tear down Matter world with focus
  useLayoutEffect(() => {
    const node = shellRef.current
    if (!focusId || !node) {
      setHeap((prev) => {
        prev?.destroy()
        return null
      })
      return
    }

    const next = new BrowserHeap(node, fieldSize.w, fieldSize.h)
    next.start()
    setHeap(next)

    return () => {
      next.destroy()
      setHeap((prev) => (prev === next ? null : prev))
    }
  }, [focusId, fieldSize.w, fieldSize.h])

  const fleet = useMemo(() => {
    if (!ready) return []
    return buildFleet(experiments, spawnDims.current.w, spawnDims.current.h)
  }, [ready])

  const visible = fleet.filter(
    (item) => !minimized.includes(item.experiment.id),
  )

  const dockItems = fleet.filter((item) =>
    minimized.includes(item.experiment.id),
  )

  const focusCard = (id: string) => {
    setFocusId(id)
    setTopId(id)
  }

  const clearFocus = () => setFocusId(null)

  const minimize = (id: string) => {
    setFocusId((prev) => (prev === id ? null : prev))
    setMinimized((prev) => (prev.includes(id) ? prev : [...prev, id]))
  }

  const restore = (id: string) => {
    setMinimized((prev) => prev.filter((x) => x !== id))
    setTopId(id)
  }

  return (
    <div
      ref={shellRef}
      className={`relative isolate overflow-hidden bg-white ${className}`}
      style={{ height: 'min(72vh, 720px)', minHeight: 480 }}
      aria-label="Floating browser experiments"
      onPointerLeave={clearFocus}
    >
      <AnimatePresence initial={false}>
        {visible.map((item, i) => {
          const { experiment } = item
          const focusState =
            focusId == null
              ? 'idle'
              : focusId === experiment.id
                ? 'focused'
                : 'shelved'

          return (
            <BrowserComponent
              key={experiment.id}
              id={experiment.id}
              title={experiment.title}
              body={experiment.body}
              href={experiment.url}
              videoUrl={experiment.videoUrl}
              initial={item.initial}
              fieldSize={fieldSize}
              focusState={focusState}
              heap={focusState === 'shelved' ? heap : null}
              zIndex={
                focusState === 'focused'
                  ? 80
                  : topId === experiment.id
                    ? 50
                    : i + 1
              }
              onActivate={() => setTopId(experiment.id)}
              onMinimize={() => minimize(experiment.id)}
              onFocusRequest={() => focusCard(experiment.id)}
              onFocusRelease={clearFocus}
            />
          )
        })}
      </AnimatePresence>

      {focusId ? (
        <div
          className="absolute inset-0 z-[70]"
          aria-hidden
          onPointerDown={clearFocus}
        />
      ) : null}

      {dockItems.length > 0 ? (
        <div
          className="absolute inset-x-0 bottom-0 z-[60] flex flex-wrap items-center justify-end gap-1.5 border-t border-black bg-white px-3 py-2"
          style={{ fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}
          aria-label="Minimized experiments"
        >
          <span className="mr-1 text-[9px] tracking-[0.03em] text-black/35 lowercase">
            dock
          </span>
          {dockItems.map(({ experiment }) => (
            <button
              key={experiment.id}
              type="button"
              onClick={() => restore(experiment.id)}
              title={`restore ${experiment.title}`}
              className="max-w-[9rem] truncate border border-black bg-[#febc2e]/35 px-2 py-1 text-[10px] lowercase tracking-[0.03em] text-black hover:bg-[#febc2e]/55"
            >
              {experiment.title}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
