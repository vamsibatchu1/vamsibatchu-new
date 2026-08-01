import { useEffect, useRef } from 'react'

type HeatPoint = { x: number; y: number; value: number }

/** Interactive / readable surfaces we treat as “clickable content”. */
const CONTENT_SELECTOR = [
  'main p',
  'main a',
  'main h1',
  'main h2',
  'main h3',
  'main li',
  'main button',
  'main img',
  'main canvas',
  'main svg',
  'main video',
  'main [role="button"]',
  'main .browser-component',
].join(', ')

function mulberry32(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function hashSeed(s: string) {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

type ContentBox = {
  left: number
  top: number
  width: number
  height: number
  area: number
}

/** Visible text / image / control boxes in viewport CSS pixels. */
function collectContentBoxes(): ContentBox[] {
  const nodes = document.querySelectorAll(CONTENT_SELECTOR)
  const boxes: ContentBox[] = []
  const vw = window.innerWidth
  const vh = window.innerHeight

  for (const el of nodes) {
    if (!(el instanceof HTMLElement) && !(el instanceof SVGElement)) continue
    const r = el.getBoundingClientRect()
    if (r.width < 6 || r.height < 6) continue
    // Must intersect the viewport
    if (r.bottom < 0 || r.top > vh || r.right < 0 || r.left > vw) continue

    const left = Math.max(0, r.left)
    const top = Math.max(0, r.top)
    const right = Math.min(vw, r.right)
    const bottom = Math.min(vh, r.bottom)
    const width = right - left
    const height = bottom - top
    if (width < 4 || height < 4) continue

    boxes.push({ left, top, width, height, area: width * height })
  }

  return boxes
}

/** Spawn simulated clicks only inside measured content boxes. */
function buildClickMap(
  boxes: ContentBox[],
  dpr: number,
  path: string,
): { max: number; data: HeatPoint[] } {
  const rand = mulberry32(
    hashSeed(`heat-content:${path}:${boxes.length}:${Math.round(window.innerWidth)}`),
  )
  const data: HeatPoint[] = []
  let max = 1

  if (boxes.length === 0) return { max, data }

  const totalArea = boxes.reduce((sum, b) => sum + b.area, 0)
  const TARGET = 140

  for (const box of boxes) {
    const share = box.area / totalArea
    const count = Math.max(2, Math.round(share * TARGET))
    // Hotter on larger / denser targets (images + buttons a bit more)
    const baseIntensity = 45 + share * 400

    for (let i = 0; i < count; i++) {
      // Bias toward center of each box (looks more like real click clusters)
      const u = (rand() + rand() + rand()) / 3
      const v = (rand() + rand() + rand()) / 3
      const x = Math.round((box.left + u * box.width) * dpr)
      const y = Math.round((box.top + v * box.height) * dpr)
      const value = Math.round(baseIntensity * (0.4 + rand() * 0.6))
      max = Math.max(max, value)
      data.push({ x, y, value })
    }
  }

  return { max, data }
}

function paintHeatmap(
  canvas: HTMLCanvasElement,
  points: HeatPoint[],
  max: number,
  boxes: ContentBox[],
  dpr: number,
) {
  const w = canvas.width
  const h = canvas.height
  const ctx = canvas.getContext('2d')
  if (!ctx || w === 0 || h === 0) return

  const shadow = document.createElement('canvas')
  shadow.width = w
  shadow.height = h
  const sctx = shadow.getContext('2d')
  if (!sctx) return

  sctx.clearRect(0, 0, w, h)
  for (const p of points) {
    const radius = (18 + (p.value / max) * 28) * dpr
    const g = sctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius)
    const a = Math.min(1, p.value / max) * 0.55
    g.addColorStop(0, `rgba(0,0,0,${a})`)
    g.addColorStop(1, 'rgba(0,0,0,0)')
    sctx.fillStyle = g
    sctx.beginPath()
    sctx.arc(p.x, p.y, radius, 0, Math.PI * 2)
    sctx.fill()
  }

  const img = sctx.getImageData(0, 0, w, h)
  const { data } = img
  for (let i = 0; i < data.length; i += 4) {
    const v = data[i + 3] / 255
    if (v <= 0.02) {
      data[i] = 0
      data[i + 1] = 0
      data[i + 2] = 0
      data[i + 3] = 0
      continue
    }
    let r = 0
    let g = 0
    let b = 0
    if (v < 0.25) {
      const t = v / 0.25
      b = 255
      g = Math.round(255 * t)
    } else if (v < 0.5) {
      const t = (v - 0.25) / 0.25
      g = 255
      b = Math.round(255 * (1 - t))
    } else if (v < 0.75) {
      const t = (v - 0.5) / 0.25
      r = Math.round(255 * t)
      g = 255
    } else {
      const t = (v - 0.75) / 0.25
      r = 255
      g = Math.round(255 * (1 - t))
    }
    data[i] = r
    data[i + 1] = g
    data[i + 2] = b
    data[i + 3] = Math.round(Math.min(0.72, 0.15 + v * 0.7) * 255)
  }

  ctx.clearRect(0, 0, w, h)
  ctx.putImageData(img, 0, 0)

  // Clip heat so it only shows over text / image / control boxes
  const mask = document.createElement('canvas')
  mask.width = w
  mask.height = h
  const mctx = mask.getContext('2d')
  if (!mctx) return
  mctx.fillStyle = '#fff'
  for (const box of boxes) {
    mctx.fillRect(
      Math.floor(box.left * dpr),
      Math.floor(box.top * dpr),
      Math.ceil(box.width * dpr),
      Math.ceil(box.height * dpr),
    )
  }
  ctx.globalCompositeOperation = 'destination-in'
  ctx.drawImage(mask, 0, 0)
  ctx.globalCompositeOperation = 'source-over'
}

/**
 * Simulated click heatmap clipped to real text / image / control bounds.
 * pointer-events none so the site stays usable underneath.
 */
export default function HeatmapOverlay({ path }: { path: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let frame = 0

    const draw = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`

      const boxes = collectContentBoxes()
      const { max, data } = buildClickMap(boxes, dpr, path)
      paintHeatmap(canvas, data, max, boxes, dpr)
    }

    const schedule = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(draw)
    }

    // Wait a tick so route content has painted
    const boot = window.setTimeout(schedule, 40)
    window.addEventListener('resize', schedule)
    window.addEventListener('scroll', schedule, { passive: true })

    return () => {
      window.clearTimeout(boot)
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', schedule)
      window.removeEventListener('scroll', schedule)
    }
  }, [path])

  return (
    <div className="pointer-events-none fixed inset-0 z-[60]" aria-hidden>
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  )
}
