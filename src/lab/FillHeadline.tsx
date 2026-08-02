import { motion, useReducedMotion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'

const COPY = 'building intentional experiences at google deepmind'
const CHARS = COPY.toUpperCase().split('')

function bestColumns(count: number, aspect: number) {
  let best = Math.max(1, Math.round(Math.sqrt(count * aspect)))
  let bestScore = Infinity

  for (let cols = 1; cols <= count; cols++) {
    const rows = Math.ceil(count / cols)
    const gridAspect = cols / rows
    const empty = cols * rows - count
    const score = Math.abs(Math.log(gridAspect / Math.max(aspect, 0.01))) + empty * 0.08
    if (score < bestScore) {
      bestScore = score
      best = cols
    }
  }

  return best
}

/** Stable per-index width stretch only — height stays natural. */
function letterStretch(index: number) {
  const a = Math.sin(index * 127.1 + 311.7) * 43758.5453
  const r = a - Math.floor(a)
  // Needle-thin → chunky, width only
  return { scaleX: 0.22 + r * 2.05, scaleY: 1 }
}

export default function FillHeadline() {
  const boxRef = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const [layout, setLayout] = useState({ cols: 9, rows: 5, fontSize: 24, w: 0, h: 0 })
  const [pointer, setPointer] = useState<{ x: number; y: number } | null>(null)

  useEffect(() => {
    const box = boxRef.current
    if (!box) return

    const measure = () => {
      const w = box.clientWidth
      const h = box.clientHeight
      if (w < 2 || h < 2) return

      const cols = bestColumns(CHARS.length, w / h)
      const rows = Math.ceil(CHARS.length / cols)
      setLayout({
        cols,
        rows,
        w,
        h,
        fontSize: (h / rows) * 0.95,
      })
    }

    const ro = new ResizeObserver(measure)
    ro.observe(box)
    void document.fonts.ready.then(measure)
    measure()

    return () => ro.disconnect()
  }, [])

  const cellW = layout.w / layout.cols
  const cellH = layout.h / layout.rows

  return (
    <div
      ref={boxRef}
      className="relative h-full min-h-[16rem] w-full overflow-hidden bg-black text-white sm:min-h-0"
      onPointerMove={(e) => {
        if (reduceMotion) return
        const rect = e.currentTarget.getBoundingClientRect()
        setPointer({ x: e.clientX - rect.left, y: e.clientY - rect.top })
      }}
      onPointerLeave={() => setPointer(null)}
    >
      <h1 className="sr-only">{COPY}</h1>
      <div
        className="grid h-full w-full"
        style={{
          gridTemplateColumns: `repeat(${layout.cols}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${layout.rows}, minmax(0, 1fr))`,
          fontFamily: '"Bebas Neue", sans-serif',
          fontSize: layout.fontSize,
        }}
        aria-hidden
      >
        {CHARS.map((char, i) => {
          const col = i % layout.cols
          const row = Math.floor(i / layout.cols)
          return (
            <Letter
              key={`${char}-${i}`}
              char={char}
              index={i}
              col={col}
              row={row}
              cellW={cellW}
              cellH={cellH}
              pointer={pointer}
              reduceMotion={!!reduceMotion}
            />
          )
        })}
      </div>
    </div>
  )
}

function Letter({
  char,
  index,
  col,
  row,
  cellW,
  cellH,
  pointer,
  reduceMotion,
}: {
  char: string
  index: number
  col: number
  row: number
  cellW: number
  cellH: number
  pointer: { x: number; y: number } | null
  reduceMotion: boolean
}) {
  const isSpace = char === ' '
  const stretch = useMemo(() => letterStretch(index), [index])
  const offset = useMemo(() => {
    if (reduceMotion || !pointer || cellW <= 0 || cellH <= 0) {
      return { x: 0, y: 0 }
    }

    const cx = (col + 0.5) * cellW
    const cy = (row + 0.5) * cellH
    const dx = cx - pointer.x
    const dy = cy - pointer.y
    const dist = Math.hypot(dx, dy) || 1
    const radius = Math.max(cellW, cellH) * 2.6
    if (dist > radius) return { x: 0, y: 0 }

    const force = (1 - dist / radius) ** 2 * Math.min(cellW, cellH) * 0.4
    return { x: (dx / dist) * force, y: (dy / dist) * force }
  }, [pointer, reduceMotion, col, row, cellW, cellH])

  return (
    <motion.span
      className="flex h-full w-full select-none items-center justify-center overflow-hidden leading-none"
      initial={
        reduceMotion
          ? false
          : { opacity: 0, scaleX: stretch.scaleX * 0.3, scaleY: 1 }
      }
      animate={{
        opacity: isSpace ? 0 : 1,
        scaleX: stretch.scaleX,
        scaleY: 1,
        x: offset.x,
        y: offset.y,
      }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : {
              opacity: { delay: index * 0.012, duration: 0.35 },
              scaleX: {
                delay: index * 0.012,
                type: 'spring',
                stiffness: 320,
                damping: 20,
              },
              x: { type: 'spring', stiffness: 260, damping: 18, mass: 0.35 },
              y: { type: 'spring', stiffness: 260, damping: 18, mass: 0.35 },
            }
      }
      whileHover={
        reduceMotion || isSpace
          ? undefined
          : {
              scaleX: stretch.scaleX * 1.12,
              scaleY: 1,
              transition: { type: 'spring', stiffness: 420, damping: 16 },
            }
      }
    >
      {isSpace ? '\u00A0' : char}
    </motion.span>
  )
}
