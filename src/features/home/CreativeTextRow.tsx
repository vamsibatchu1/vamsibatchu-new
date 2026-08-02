import {
  prepareWithSegments,
  type PreparedTextWithSegments,
} from '@chenglou/pretext'
import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react'
import {
  LINE_HEIGHT,
  layoutFlow,
  justifySpacing,
  resolveFlowImageSize,
  type FlowImage,
} from './creativeTextLayout'
import { markColors, type MarkTone } from '../../components/Mark'
import { buildShapeBands, type ShapeBand } from '../../components/svgShapeMask'

export type { FlowImage }

const FONT = '400 11px "JetBrains Mono"'
const FONT_SIZE = 11
const COL_COUNT_DESKTOP = 5
const COL_HEIGHT = 480
const GAP = 20
const SVG_MAX_W = 600

export type TextKeyword = {
  word: string
  gloss: string
  tone: MarkTone
}

export type CreativeTextFlow = {
  /** One continuous article — Pretext streams this across all columns. */
  text: string
  images: FlowImage[]
  /** Optional SVG/image whose opaque ink becomes wrap obstacles. */
  shapeSrc?: string
  /** Clickable words that inject a highlighted gloss into the stream. */
  keywords?: TextKeyword[]
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

function normalizeArticle(text: string) {
  return text.toUpperCase().replace(/\s+/gu, ' ').trim()
}

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/** Inject «gloss» after the first whole-word match of the expanded keyword. */
function buildStreamText(
  base: string,
  expandedWord: string | null,
  keywords: TextKeyword[],
) {
  if (!expandedWord) return base
  const kw = keywords.find(
    (k) => k.word.toUpperCase() === expandedWord.toUpperCase(),
  )
  if (!kw) return base

  const needle = kw.word.toUpperCase()
  const gloss = kw.gloss.toUpperCase().replace(/\s+/gu, ' ').trim()
  const re = new RegExp(`\\b${escapeRegExp(needle)}\\b`)
  if (!re.test(base)) return base
  return base.replace(re, `${needle} «${gloss}»`)
}

function wordKey(token: string) {
  return token.replace(/[^A-Z0-9]/giu, '').toUpperCase()
}

type CreativeTextRowProps = {
  flow: CreativeTextFlow
}

/**
 * One continuous Pretext stream across columns.
 * Rectangular images are draggable obstacles; an optional SVG shape
 * is scanned so text wraps around each glyph silhouette.
 * Keywords inject a Mark-colored gloss into the stream on click.
 */
export default function CreativeTextRow({ flow }: CreativeTextRowProps) {
  const stageRef = useRef<HTMLDivElement>(null)
  const preparedRef = useRef<PreparedTextWithSegments | null>(null)
  const baseTextRef = useRef(normalizeArticle(flow.text))
  const [preparedTick, setPreparedTick] = useState(0)
  const [images, setImages] = useState(flow.images)
  const [expandedWord, setExpandedWord] = useState<string | null>(null)
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

  const keywords = flow.keywords ?? []
  const expandedKw = expandedWord
    ? keywords.find((k) => k.word.toUpperCase() === expandedWord.toUpperCase())
    : undefined

  useEffect(() => {
    setImages(flow.images)
  }, [flow.images])

  useEffect(() => {
    baseTextRef.current = normalizeArticle(flow.text)
    setExpandedWord(null)
  }, [flow.text])

  useEffect(() => {
    let cancelled = false
    const stream = buildStreamText(
      baseTextRef.current,
      expandedWord,
      flow.keywords ?? [],
    )

    void document.fonts.ready.then(() => {
      if (cancelled) return
      preparedRef.current = prepareWithSegments(stream, FONT)
      setPreparedTick((n) => n + 1)
    })

    return () => {
      cancelled = true
    }
  }, [flow.text, flow.keywords, expandedWord])

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
      const clamped = images.map((img) => {
        const { height } = resolveFlowImageSize(img, colWidth)
        return {
          ...img,
          column: clamp(img.column, 0, colCount - 1),
          top: clamp(img.top, 0, Math.max(0, COL_HEIGHT - height)),
          height,
        }
      })

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
      prev.map((img) => {
        if (img.id !== drag.id) return img
        const { height } = resolveFlowImageSize(img, snap.colWidth)
        return {
          ...img,
          column: clamp(drag.originCol + colDelta, 0, snap.colCount - 1),
          top: clamp(drag.originTop + dy, 0, Math.max(0, COL_HEIGHT - height)),
        }
      }),
    )
  }

  const onPointerUp = () => {
    dragRef.current = null
  }

  const toggleKeyword = (word: string) => {
    setExpandedWord((cur) =>
      cur && cur.toUpperCase() === word.toUpperCase() ? null : word,
    )
  }

  const lastLineIndex = (snapshot?.lines.length ?? 1) - 1
  const glossColor = expandedKw ? markColors[expandedKw.tone] : undefined

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
      aria-label="Creative text flow — click highlighted keywords for glosses"
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

      {(() => {
        let inGloss = false
        return snapshot?.lines.map((line, i) => {
          const left = line.col * (snapshot.colWidth + GAP) + line.x
          const wordSpacing = justifySpacing(line, i === lastLineIndex)
          const parsed = parseLineWithKeywords(
            line.text,
            inGloss,
            keywords,
            expandedWord,
            glossColor,
            toggleKeyword,
          )
          inGloss = parsed.inGloss
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
              {parsed.nodes}
            </div>
          )
        })
      })()}

      {(snapshot?.images ?? images).map((img) => {
        const colW = snapshot?.colWidth ?? 0
        const { width: w, height: h } = resolveFlowImageSize(img, colW)
        const left =
          (snapshot ? img.column * (snapshot.colWidth + GAP) : 0) +
          (img.float === 'right' ? colW - w : 0)

        return (
          <div
            key={img.id}
            role="button"
            tabIndex={0}
            aria-label={`Move image ${img.id}`}
            className="absolute cursor-grab active:cursor-grabbing"
            style={{
              left,
              top: img.top,
              width: w,
              height: h,
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
                className="pointer-events-none block size-full object-contain"
                draggable={false}
              />
            ) : null}
          </div>
        )
      })}
    </div>
  )
}

function parseLineWithKeywords(
  text: string,
  startInGloss: boolean,
  keywords: TextKeyword[],
  expandedWord: string | null,
  glossColor: string | undefined,
  onToggle: (word: string) => void,
): { nodes: ReactNode[]; inGloss: boolean } {
  const keywordSet = new Map(
    keywords.map((k) => [k.word.toUpperCase(), k] as const),
  )
  const nodes: ReactNode[] = []
  let inGloss = startInGloss
  let buf = ''
  let key = 0

  const flushPlain = (plain: string) => {
    if (!plain) return
    if (inGloss) {
      nodes.push(
        <span
          key={`g-${key++}`}
          className="px-0.5 text-black"
          style={{ backgroundColor: glossColor ?? markColors.yellow }}
        >
          {plain}
        </span>,
      )
      return
    }

    const tokens = plain.split(/(\s+)/u)
    tokens.forEach((token) => {
      if (!token) return
      if (/^\s+$/u.test(token)) {
        nodes.push(token)
        return
      }

      const wk = wordKey(token)
      const kw = keywordSet.get(wk)
      if (!kw) {
        nodes.push(<span key={`t-${key++}`}>{token}</span>)
        return
      }

      const isOpen =
        !!expandedWord &&
        expandedWord.toUpperCase() === kw.word.toUpperCase()

      nodes.push(
        <button
          key={`k-${key++}`}
          type="button"
          aria-expanded={isOpen}
          aria-label={
            isOpen
              ? `collapse gloss for ${kw.word}`
              : `expand gloss for ${kw.word}`
          }
          onClick={(e) => {
            e.stopPropagation()
            onToggle(kw.word)
          }}
          className="cursor-pointer border-0 bg-transparent p-0 uppercase text-black underline decoration-black/35 underline-offset-2 hover:decoration-black"
          style={{
            fontFamily: 'inherit',
            fontSize: 'inherit',
            lineHeight: 'inherit',
            letterSpacing: 'inherit',
          }}
        >
          {token}
        </button>,
      )
    })
  }

  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    if (ch === '«') {
      flushPlain(buf)
      buf = ''
      inGloss = true
      continue
    }
    if (ch === '»') {
      flushPlain(buf)
      buf = ''
      inGloss = false
      continue
    }
    buf += ch
  }
  flushPlain(buf)

  return { nodes, inGloss }
}
