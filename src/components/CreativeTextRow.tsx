import {
  prepareWithSegments,
  type PreparedTextWithSegments,
} from '@chenglou/pretext'
import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import {
  LINE_HEIGHT,
  layoutFlow,
  justifySpacing,
  type FlowImage,
} from './creativeTextLayout'
import { buildShapeBands, type ShapeBand } from './svgShapeMask'

export type { FlowImage }

const FONT = '400 11px "JetBrains Mono"'
const FONT_SIZE = 11
const COL_COUNT_DESKTOP = 5
const COL_HEIGHT = 480
const GAP = 20
const THUMB = '#efeeec'
const SVG_MAX_W = 600

export type CreativeTextFlow = {
  /** One continuous article — Pretext streams this across all columns. */
  text: string
  images: FlowImage[]
  /** Optional SVG/image whose opaque ink becomes wrap obstacles. */
  shapeSrc?: string
}

type LayoutSnapshot = {
  colWidth: number
  colCount: number
  lines: ReturnType<typeof layoutFlow>
  images: FlowImage[]
  shape: {
    src: string
    left: number
    top: number
    width: number
    height: number
  } | null
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

type CreativeTextRowProps = {
  flow: CreativeTextFlow
}

/**
 * One continuous Pretext stream across columns.
 * Rectangular images are draggable obstacles; an optional SVG shape
 * is scanned so text wraps around each glyph silhouette.
 */
export default function CreativeTextRow({ flow }: CreativeTextRowProps) {
  const stageRef = useRef<HTMLDivElement>(null)
  const preparedRef = useRef<PreparedTextWithSegments | null>(null)
  const [preparedTick, setPreparedTick] = useState(0)
  const [images, setImages] = useState(flow.images)
  const [shapeBands, setShapeBands] = useState<ShapeBand[] | null>(null)
  const [shapeBox, setShapeBox] = useState<{
    left: number
    top: number
    width: number
    height: number
  } | null>(null)
  const [snapshot, setSnapshot] = useState<LayoutSnapshot | null>(null)
  const dragRef = useRef<{
    id: string
    startX: number
    startY: number
    originCol: number
    originTop: number
  } | null>(null)

  useEffect(() => {
    setImages(flow.images)
  }, [flow.images])

  useEffect(() => {
    let cancelled = false

    void document.fonts.ready.then(() => {
      if (cancelled) return
      preparedRef.current = prepareWithSegments(
        flow.text.toUpperCase().replace(/\s+/gu, ' ').trim(),
        FONT,
      )
      setPreparedTick((n) => n + 1)
    })

    return () => {
      cancelled = true
    }
  }, [flow.text])

  // Build SVG silhouette mask whenever stage size / shape src changes
  useEffect(() => {
    const stage = stageRef.current
    if (!stage || !flow.shapeSrc) {
      setShapeBands(null)
      setShapeBox(null)
      return
    }

    let cancelled = false

    const run = async () => {
      const stageW = stage.clientWidth
      if (stageW < 2) return

      const drawW = Math.min(SVG_MAX_W, stageW * 0.72, COL_HEIGHT)
      const drawH = drawW // square artboard

      try {
        const { bands, offsetX, offsetY } = await buildShapeBands({
          src: flow.shapeSrc!,
          stageW,
          stageH: COL_HEIGHT,
          drawW,
          drawH,
          pad: 4,
        })
        if (cancelled) return
        setShapeBands(bands)
        setShapeBox({
          left: offsetX,
          top: offsetY,
          width: drawW,
          height: drawH,
        })
      } catch {
        if (!cancelled) {
          setShapeBands(null)
          setShapeBox(null)
        }
      }
    }

    void run()
    const ro = new ResizeObserver(() => {
      void run()
    })
    ro.observe(stage)
    return () => {
      cancelled = true
      ro.disconnect()
    }
  }, [flow.shapeSrc])

  useEffect(() => {
    const stage = stageRef.current
    if (!stage || !preparedRef.current) return

    const relayout = () => {
      const prepared = preparedRef.current
      if (!prepared) return

      const totalW = stage.clientWidth
      if (totalW < 2) return

      const colCount =
        totalW < 640 ? 1 : totalW < 900 ? 2 : COL_COUNT_DESKTOP
      const colWidth = (totalW - GAP * (colCount - 1)) / colCount
      const clamped = images.map((img) => ({
        ...img,
        column: clamp(img.column, 0, colCount - 1),
        top: clamp(img.top, 0, COL_HEIGHT - img.height),
      }))

      // Wait for shape mask when a shapeSrc is set
      if (flow.shapeSrc && !shapeBands) return

      setSnapshot({
        colWidth,
        colCount,
        lines: layoutFlow(
          prepared,
          colCount,
          colWidth,
          COL_HEIGHT,
          clamped,
          GAP,
          shapeBands ?? undefined,
        ),
        images: clamped,
        shape:
          flow.shapeSrc && shapeBox
            ? { src: flow.shapeSrc, ...shapeBox }
            : null,
      })
    }

    relayout()
    const ro = new ResizeObserver(relayout)
    ro.observe(stage)
    return () => ro.disconnect()
  }, [images, preparedTick, shapeBands, shapeBox, flow.shapeSrc])

  const onPointerDown = (
    e: ReactPointerEvent<HTMLDivElement>,
    img: FlowImage,
  ) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    dragRef.current = {
      id: img.id,
      startX: e.clientX,
      startY: e.clientY,
      originCol: img.column,
      originTop: img.top,
    }
  }

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current
    const snap = snapshot
    if (!drag || !snap) return

    const dx = e.clientX - drag.startX
    const dy = e.clientY - drag.startY
    const colDelta = Math.round(dx / (snap.colWidth + GAP))

    setImages((prev) =>
      prev.map((img) =>
        img.id !== drag.id
          ? img
          : {
              ...img,
              column: clamp(drag.originCol + colDelta, 0, snap.colCount - 1),
              top: clamp(drag.originTop + dy, 0, COL_HEIGHT - img.height),
            },
      ),
    )
  }

  const onPointerUp = () => {
    dragRef.current = null
  }

  const lastLineIndex = (snapshot?.lines.length ?? 1) - 1

  return (
    <div
      ref={stageRef}
      className="relative w-full select-none"
      style={{
        height: COL_HEIGHT,
        fontFamily: '"JetBrains Mono", ui-monospace, monospace',
        fontSize: FONT_SIZE,
        lineHeight: `${LINE_HEIGHT}px`,
      }}
      aria-label="Creative text flow — wraps around the SVG silhouette"
    >
      {snapshot?.shape ? (
        <img
          src={snapshot.shape.src}
          alt=""
          aria-hidden
          className="pointer-events-none absolute object-contain"
          style={{
            left: snapshot.shape.left,
            top: snapshot.shape.top,
            width: snapshot.shape.width,
            height: snapshot.shape.height,
          }}
          draggable={false}
        />
      ) : null}

      {snapshot?.lines.map((line, i) => {
        const left = line.col * (snapshot.colWidth + GAP) + line.x
        const wordSpacing = justifySpacing(line, i === lastLineIndex)
        return (
          <div
            key={`line-${i}`}
            className="absolute whitespace-nowrap uppercase text-black"
            style={{
              left,
              top: line.y,
              width: line.slotWidth,
              wordSpacing:
                wordSpacing > 0 ? `${wordSpacing}px` : undefined,
            }}
          >
            {line.text}
          </div>
        )
      })}

      {(snapshot?.images ?? images).map((img) => {
        const colW = snapshot?.colWidth ?? 0
        const ratio = img.widthRatio ?? 1
        const w = Math.max(1, colW * ratio)
        const left =
          (snapshot ? img.column * (snapshot.colWidth + GAP) : 0) +
          (img.float === 'right' ? colW - w : 0)

        return (
          <div
            key={img.id}
            role="button"
            tabIndex={0}
            aria-label={`Move image ${img.id}`}
            className="absolute cursor-grab overflow-hidden active:cursor-grabbing"
            style={{
              left,
              top: img.top,
              width: w,
              height: img.height,
              backgroundColor: THUMB,
              touchAction: 'none',
            }}
            onPointerDown={(e) => onPointerDown(e, img)}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            {img.src ? (
              <img
                src={img.src}
                alt={img.alt ?? ''}
                className="pointer-events-none size-full object-cover"
                draggable={false}
              />
            ) : null}
          </div>
        )
      })}
    </div>
  )
}
