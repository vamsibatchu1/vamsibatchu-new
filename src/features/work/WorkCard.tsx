import {
  prepareWithSegments,
  type PreparedTextWithSegments,
} from '@chenglou/pretext'
import { useEffect, useRef, useState } from 'react'
import {
  LINE_HEIGHT,
  layoutFlow,
  justifySpacing,
  resolveFlowImageSize,
  type FlowImage,
} from '../home/creativeTextLayout'
import { workCardImages, workCardText } from './workCardFlow'

const FONT = '400 11px "JetBrains Mono"'
const FONT_SIZE = 11
const COL_COUNT = 2
const COL_HEIGHT = 680
const GAP = 18
/** Inner inset — layout + paint stay inside this margin. */
const PAD = 16

type LayoutSnapshot = {
  colWidth: number
  colCount: number
  lines: ReturnType<typeof layoutFlow>
  images: FlowImage[]
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

function normalizeArticle(text: string) {
  return text.toUpperCase().replace(/\s+/gu, ' ').trim()
}

/**
 * work-card — half-width stacked text with DeepMind logos as wrap obstacles.
 * All marks stay fully inside the card bounds.
 */
export default function WorkCard() {
  const stageRef = useRef<HTMLDivElement>(null)
  const preparedRef = useRef<PreparedTextWithSegments | null>(null)
  const [preparedTick, setPreparedTick] = useState(0)
  const [snapshot, setSnapshot] = useState<LayoutSnapshot | null>(null)

  useEffect(() => {
    let cancelled = false
    void document.fonts.ready.then(() => {
      if (cancelled) return
      preparedRef.current = prepareWithSegments(
        normalizeArticle(workCardText),
        FONT,
      )
      setPreparedTick((t) => t + 1)
    })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const stage = stageRef.current
    if (!stage || !preparedRef.current) return

    const relayout = () => {
      const prepared = preparedRef.current
      if (!prepared) return

      const totalW = stage.clientWidth - PAD * 2
      if (totalW < 2) return

      const colWidth = (totalW - GAP * (COL_COUNT - 1)) / COL_COUNT

      const clamped = workCardImages.map((img) => {
        const ratio = Math.min(img.widthRatio ?? 1, 0.92)
        const sized = resolveFlowImageSize({ ...img, widthRatio: ratio }, colWidth)
        // Keep a few px inside the column so logos never kiss the clip edge
        const height = Math.min(sized.height, COL_HEIGHT - 8)
        const top = clamp(img.top, 0, Math.max(0, COL_HEIGHT - height))
        return {
          ...img,
          widthRatio: ratio,
          column: clamp(img.column, 0, COL_COUNT - 1),
          top,
          height,
        }
      })

      setSnapshot({
        colWidth,
        colCount: COL_COUNT,
        lines: layoutFlow(
          prepared,
          COL_COUNT,
          colWidth,
          COL_HEIGHT,
          clamped,
          GAP,
        ),
        images: clamped,
      })
    }

    relayout()
    const ro = new ResizeObserver(relayout)
    ro.observe(stage)
    return () => ro.disconnect()
  }, [preparedTick])

  const lastLineIndex = (snapshot?.lines.length ?? 1) - 1

  return (
    <article
      className="work-card relative w-full max-w-full select-none overflow-hidden border border-black/12 bg-[#faf9f6] lowercase lg:w-1/2"
      aria-label="Google DeepMind work card"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.22]"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.5\'/%3E%3C/svg%3E")',
        }}
        aria-hidden
      />

      <div
        ref={stageRef}
        className="relative w-full"
        style={{
          height: COL_HEIGHT + PAD * 2,
          fontFamily: '"JetBrains Mono", ui-monospace, monospace',
          fontSize: FONT_SIZE,
          lineHeight: `${LINE_HEIGHT}px`,
        }}
      >
        {snapshot?.lines.map((line, i) => {
          const left = PAD + line.col * (snapshot.colWidth + GAP) + line.x
          const wordSpacing = justifySpacing(line, i === lastLineIndex)
          return (
            <div
              key={`line-${i}`}
              className="absolute whitespace-nowrap uppercase text-black"
              style={{
                left,
                top: PAD + line.y,
                width: line.slotWidth,
                wordSpacing: wordSpacing > 0 ? `${wordSpacing}px` : undefined,
              }}
            >
              {line.text}
            </div>
          )
        })}

        {(snapshot?.images ?? []).map((img) => {
          const colW = snapshot?.colWidth ?? 0
          const { width: w, height: h } = resolveFlowImageSize(img, colW)
          const colLeft = PAD + (snapshot ? img.column * (snapshot.colWidth + GAP) : 0)
          const left =
            img.float === 'right' ? colLeft + colW - w : colLeft

          return (
            <div
              key={img.id}
              className="pointer-events-none absolute overflow-visible"
              style={{
                left,
                top: PAD + img.top,
                width: w,
                height: h,
              }}
            >
              {img.src ? (
                <img
                  src={img.src}
                  alt={img.alt ?? ''}
                  className="block size-full object-contain object-left"
                  draggable={false}
                />
              ) : null}
            </div>
          )
        })}
      </div>
    </article>
  )
}
