import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from 'react'

export type BrowserRect = {
  x: number
  y: number
  w: number
  h: number
  rotate?: number
}

type Edge = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw'

type BrowserComponentProps = {
  /** Paragraph shown in the content area */
  body: string
  initial: BrowserRect
  /** Title-bar label; falls back to “untitled” */
  title?: string
  /** Optional link opened from the body (new tab for absolute URLs) */
  href?: string | null
  zIndex?: number
  onActivate?: () => void
  className?: string
}

const MIN_W = 140
const MIN_H = 110
const EDGE = 8

/**
 * Wireframe browser window — thin black outline, title-bar chrome,
 * Figma-style edge/corner resize + title-bar drag.
 */
export default function BrowserComponent({
  body,
  initial,
  title = 'untitled',
  href = null,
  zIndex = 1,
  onActivate,
  className = '',
}: BrowserComponentProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const [rect, setRect] = useState<BrowserRect>(initial)
  const drag = useRef<{
    mode: 'move' | Edge
    startX: number
    startY: number
    origin: BrowserRect
  } | null>(null)

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const d = drag.current
      if (!d) return
      const dx = e.clientX - d.startX
      const dy = e.clientY - d.startY
      const o = d.origin

      if (d.mode === 'move') {
        setRect({ ...o, x: o.x + dx, y: o.y + dy })
        return
      }

      let { x, y, w, h } = o
      const mode = d.mode

      if (mode.includes('e')) w = Math.max(MIN_W, o.w + dx)
      if (mode.includes('s')) h = Math.max(MIN_H, o.h + dy)
      if (mode.includes('w')) {
        w = Math.max(MIN_W, o.w - dx)
        x = o.x + (o.w - w)
      }
      if (mode.includes('n')) {
        h = Math.max(MIN_H, o.h - dy)
        y = o.y + (o.h - h)
      }
      setRect({ ...o, x, y, w, h })
    }

    const onUp = () => {
      drag.current = null
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
    }
  }, [])

  const startDrag = (
    e: ReactPointerEvent,
    mode: 'move' | Edge,
  ) => {
    e.preventDefault()
    e.stopPropagation()
    onActivate?.()
    drag.current = {
      mode,
      startX: e.clientX,
      startY: e.clientY,
      origin: { ...rect },
    }
    ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
  }

  const rotate = rect.rotate ?? 0
  const TITLE_H = 32
  const BODY_PAD = 16
  const FONT_SIZE = 11
  const LINE_HEIGHT = 1.45
  const lineClamp = Math.max(
    1,
    Math.floor((rect.h - TITLE_H - BODY_PAD * 2) / (FONT_SIZE * LINE_HEIGHT)),
  )
  const bodyTextStyle: CSSProperties = {
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: lineClamp,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    width: '100%',
    height: '100%',
    margin: 0,
    textAlign: 'left',
    fontSize: FONT_SIZE,
    lineHeight: LINE_HEIGHT,
    letterSpacing: '0.01em',
    color: '#000',
  }

  return (
    <div
      ref={rootRef}
      className={`browser-component absolute touch-none select-none ${className}`}
      style={{
        left: rect.x,
        top: rect.y,
        width: rect.w,
        height: rect.h,
        zIndex,
        transform: rotate ? `rotate(${rotate}deg)` : undefined,
        fontFamily: '"JetBrains Mono", ui-monospace, monospace',
      }}
      onPointerDown={() => onActivate?.()}
    >
      <div className="flex h-full w-full flex-col overflow-hidden rounded-[10px] border border-black bg-white">
        {/* Title bar */}
        <div
          className="relative flex h-8 shrink-0 cursor-grab items-center justify-end gap-2.5 border-b border-black px-2.5 active:cursor-grabbing"
          onPointerDown={(e) => startDrag(e, 'move')}
        >
          <span className="pointer-events-none mr-auto truncate pl-1 text-[9px] tracking-[0.04em] text-black/35 lowercase">
            {title}
          </span>
          <ChromeIcons />
        </div>

        {/* Body — top-left, 16px inset, fills + ellipsis */}
        <div className="min-h-0 flex-1 overflow-hidden p-4">
          {href ? (
            <a
              href={href}
              className="block no-underline"
              style={bodyTextStyle}
              {...(href.startsWith('http')
                ? { target: '_blank', rel: 'noopener noreferrer' }
                : {})}
              onPointerDown={(e) => e.stopPropagation()}
            >
              {body}
            </a>
          ) : (
            <p style={bodyTextStyle}>{body}</p>
          )}
        </div>
      </div>

      {/* Resize handles */}
      <Handle edge="n" onPointerDown={(e) => startDrag(e, 'n')} />
      <Handle edge="s" onPointerDown={(e) => startDrag(e, 's')} />
      <Handle edge="e" onPointerDown={(e) => startDrag(e, 'e')} />
      <Handle edge="w" onPointerDown={(e) => startDrag(e, 'w')} />
      <Handle edge="ne" onPointerDown={(e) => startDrag(e, 'ne')} />
      <Handle edge="nw" onPointerDown={(e) => startDrag(e, 'nw')} />
      <Handle edge="se" onPointerDown={(e) => startDrag(e, 'se')} />
      <Handle edge="sw" onPointerDown={(e) => startDrag(e, 'sw')} />
    </div>
  )
}

function ChromeIcons() {
  return (
    <div className="flex items-center gap-2 text-black" aria-hidden>
      <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
        <path d="M1.5 5.5h8" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" />
      </svg>
      <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
        <rect
          x="1.4"
          y="1.4"
          width="8.2"
          height="8.2"
          rx="1.2"
          stroke="currentColor"
          strokeWidth="1.15"
        />
      </svg>
      <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
        <path
          d="M2.2 2.2l6.6 6.6M8.8 2.2L2.2 8.8"
          stroke="currentColor"
          strokeWidth="1.15"
          strokeLinecap="round"
        />
      </svg>
    </div>
  )
}

function Handle({
  edge,
  onPointerDown,
}: {
  edge: Edge
  onPointerDown: (e: ReactPointerEvent) => void
}) {
  const cursor =
    edge === 'n' || edge === 's'
      ? 'ns-resize'
      : edge === 'e' || edge === 'w'
        ? 'ew-resize'
        : edge === 'ne' || edge === 'sw'
          ? 'nesw-resize'
          : 'nwse-resize'

  const style: CSSProperties = { cursor, position: 'absolute' }
  const s = EDGE

  if (edge === 'n') Object.assign(style, { top: -s / 2, left: s, right: s, height: s })
  if (edge === 's') Object.assign(style, { bottom: -s / 2, left: s, right: s, height: s })
  if (edge === 'e') Object.assign(style, { right: -s / 2, top: s, bottom: s, width: s })
  if (edge === 'w') Object.assign(style, { left: -s / 2, top: s, bottom: s, width: s })
  if (edge === 'ne') Object.assign(style, { top: -s / 2, right: -s / 2, width: s * 1.5, height: s * 1.5 })
  if (edge === 'nw') Object.assign(style, { top: -s / 2, left: -s / 2, width: s * 1.5, height: s * 1.5 })
  if (edge === 'se') Object.assign(style, { bottom: -s / 2, right: -s / 2, width: s * 1.5, height: s * 1.5 })
  if (edge === 'sw') Object.assign(style, { bottom: -s / 2, left: -s / 2, width: s * 1.5, height: s * 1.5 })

  return <div style={style} onPointerDown={onPointerDown} />
}
