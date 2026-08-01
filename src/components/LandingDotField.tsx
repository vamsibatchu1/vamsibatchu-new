import { useEffect, useRef } from 'react'

/** Smooth 2D value noise — stacked for organic cloud density. */
function hash(n: number) {
  const x = Math.sin(n * 127.1) * 43758.5453123
  return x - Math.floor(x)
}

function noise(x: number, y: number) {
  const xi = Math.floor(x)
  const yi = Math.floor(y)
  const xf = x - xi
  const yf = y - yi
  const u = xf * xf * (3 - 2 * xf)
  const v = yf * yf * (3 - 2 * yf)
  const a = hash(xi + yi * 57)
  const b = hash(xi + 1 + yi * 57)
  const c = hash(xi + (yi + 1) * 57)
  const d = hash(xi + 1 + (yi + 1) * 57)
  return a * (1 - u) * (1 - v) + b * u * (1 - v) + c * (1 - u) * v + d * u * v
}

function fbm(x: number, y: number) {
  let value = 0
  let amp = 0.5
  let freq = 1
  for (let i = 0; i < 5; i++) {
    value += amp * noise(x * freq, y * freq)
    amp *= 0.5
    freq *= 2.03
  }
  return value
}

/**
 * Generative black field of irregular white dots (halftone / stipple).
 * Landing page background only — paints to a full-bleed canvas.
 */
export default function LandingDotField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let disposed = false

    const paint = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = window.innerWidth
      const h = window.innerHeight
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      ctx.fillStyle = '#000000'
      ctx.fillRect(0, 0, w, h)

      const gap = w < 640 ? 7 : 6
      const cols = Math.ceil(w / gap) + 1
      const rows = Math.ceil(h / gap) + 1
      // Seed shifts slightly with size so resize feels generative, not identical
      const seedX = w * 0.0017
      const seedY = h * 0.0013

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = col * gap + (row % 2 === 0 ? 0 : gap * 0.35)
          const y = row * gap

          const nx = col * 0.045 + seedX
          const ny = row * 0.045 + seedY
          let density = fbm(nx, ny)

          // Bias: denser top-left, emptier bottom (matches reference atmosphere)
          const falloff =
            1 -
            Math.pow(y / h, 1.35) * 0.85 -
            Math.pow(x / w, 1.1) * 0.25
          density = density * 0.75 + falloff * 0.55
          density = Math.max(0, Math.min(1, density))

          if (density < 0.22) continue

          const t = (density - 0.22) / 0.78
          const radius = 0.35 + t * t * 2.4
          const alpha = 0.08 + t * 0.72

          ctx.beginPath()
          ctx.arc(x, y, radius, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255,255,255,${alpha.toFixed(3)})`
          ctx.fill()
        }
      }

      // Single red accent — tiny signal in the field
      const rx = w * 0.72 + hash(w) * 40
      const ry = h * 0.68 + hash(h) * 50
      ctx.beginPath()
      ctx.arc(rx, ry, 1.35, 0, Math.PI * 2)
      ctx.fillStyle = '#ff2a2a'
      ctx.fill()
    }

    const onResize = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(paint)
    }

    paint()
    window.addEventListener('resize', onResize)

    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      void disposed
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 h-full w-full"
    />
  )
}
