import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { experiments, type Experiment } from '../data/experiments'
import BrowserComponent, { type BrowserRect } from './BrowserComponent'

type FloatingBrowser = {
  experiment: Experiment
  initial: BrowserRect
}

function mulberry32(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function buildFleet(
  items: Experiment[],
  width: number,
  height: number,
): FloatingBrowser[] {
  const rand = mulberry32(20260731)
  return items.map((experiment) => {
    const w = 150 + rand() * 160
    const h = 120 + rand() * 110
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
 * Content comes from `src/data/experiments.json`.
 */
export default function BrowserField({
  className = '',
}: {
  className?: string
}) {
  const shellRef = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)
  const [topId, setTopId] = useState<string | null>(null)
  const dims = useRef({ w: 1200, h: 640 })

  useLayoutEffect(() => {
    const node = shellRef.current
    if (!node) return
    dims.current = { w: node.clientWidth, h: node.clientHeight }
    setReady(true)
  }, [])

  const fleet = useMemo(() => {
    if (!ready) return []
    return buildFleet(experiments, dims.current.w, dims.current.h)
  }, [ready])

  return (
    <div
      ref={shellRef}
      className={`relative isolate overflow-hidden bg-white ${className}`}
      style={{ height: 'min(72vh, 720px)', minHeight: 480 }}
      aria-label="Floating browser experiments"
    >
      {fleet.map((item, i) => {
        const { experiment } = item
        return (
          <BrowserComponent
            key={experiment.id}
            title={experiment.title}
            body={experiment.body}
            href={experiment.url}
            initial={item.initial}
            zIndex={topId === experiment.id ? 50 : i + 1}
            onActivate={() => setTopId(experiment.id)}
          />
        )
      })}
    </div>
  )
}
