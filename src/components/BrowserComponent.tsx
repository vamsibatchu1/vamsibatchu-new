import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import { motion, usePresence } from 'framer-motion'
import { EXIT_MS } from './browserExit'
import { type BrowserHeap } from './browserHeapPhysics'

export type BrowserRect = {
  x: number
  y: number
  w: number
  h: number
  rotate?: number
}

export type BrowserFocusState = 'idle' | 'focused' | 'shelved'

type Edge = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw'

type BrowserComponentProps = {
  id: string
  /** Paragraph shown in the content pane (replaced by video on hover) */
  body: string
  initial: BrowserRect
  /** Title-bar label; falls back to “untitled” */
  title?: string
  /** Optional link opened from the body (new tab for absolute URLs) */
  href?: string | null
  /** Optional 16:9 thumbnail video revealed on hover over the content */
  videoUrl?: string | null
  fieldSize: { w: number; h: number }
  focusState?: BrowserFocusState
  /** Active Matter.js heap; shelved cards register into it */
  heap?: BrowserHeap | null
  zIndex?: number
  onActivate?: () => void
  onMinimize?: () => void
  onFocusRequest?: () => void
  onFocusRelease?: () => void
  className?: string
}

const TITLE_H = 32
const MIN_W = 200
const MIN_H = 140
const EDGE = 8
const FOCUS_MAX_SCALE = 2

type Pose = {
  x: number
  y: number
  scale: number
  rotate: number
  opacity: number
}

function focusPose(field: { w: number; h: number }, home: BrowserRect): Pose {
  const pad = 28
  const fit = Math.min(
    FOCUS_MAX_SCALE,
    (field.w - pad * 2) / home.w,
    (field.h - pad * 2) / home.h,
  )
  const scale = Math.max(1, fit)
  return {
    x: (field.w - home.w) / 2,
    y: (field.h - home.h) / 2,
    scale,
    rotate: 0,
    opacity: 1,
  }
}

/**
 * Wireframe browser window — thin black outline, title-bar chrome,
 * Figma-style edge/corner resize + title-bar drag.
 * Hover → video preview; click → focus to center; siblings tumble via Matter.js.
 */
export default function BrowserComponent({
  id,
  body,
  initial,
  title = 'untitled',
  href = null,
  videoUrl = null,
  fieldSize,
  focusState = 'idle',
  heap = null,
  zIndex = 1,
  onActivate,
  onMinimize,
  onFocusRequest,
  onFocusRelease,
  className = '',
}: BrowserComponentProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [rect, setRect] = useState<BrowserRect>(initial)
  const [contentHover, setContentHover] = useState(false)
  const [isPresent, safeToRemove] = usePresence()
  const drag = useRef<{
    mode: 'move' | Edge
    startX: number
    startY: number
    origin: BrowserRect
  } | null>(null)
  const suppressClick = useRef(false)

  const showVideo = Boolean(
    videoUrl && isPresent && (contentHover || focusState === 'focused'),
  )
  const exiting = !isPresent
  const interactive = focusState !== 'shelved' && !exiting
  const shelved = focusState === 'shelved'

  useEffect(() => {
    if (isPresent) return
    const t = window.setTimeout(safeToRemove, EXIT_MS)
    return () => window.clearTimeout(t)
  }, [isPresent, safeToRemove])

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

  useEffect(() => {
    const video = videoRef.current
    if (!video || !videoUrl) return
    if (showVideo) {
      void video.play().catch(() => {})
    } else {
      video.pause()
      video.currentTime = 0
    }
  }, [showVideo, videoUrl])

  // Register into Matter heap while shelved
  useLayoutEffect(() => {
    const el = rootRef.current
    if (!shelved || !heap || !el) return

    heap.add({
      id,
      el,
      width: rect.w,
      height: rect.h,
      angleDeg: rect.rotate ?? 0,
    })

    return () => {
      heap.remove(id)
    }
  }, [shelved, heap, id, rect.w, rect.h, rect.rotate])

  const startDrag = (
    e: ReactPointerEvent,
    mode: 'move' | Edge,
  ) => {
    if (!interactive || focusState === 'focused') return
    e.preventDefault()
    e.stopPropagation()
    suppressClick.current = true
    onActivate?.()
    drag.current = {
      mode,
      startX: e.clientX,
      startY: e.clientY,
      origin: { ...rect },
    }
    ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
  }

  const handleCardClick = (e: React.MouseEvent) => {
    if (suppressClick.current) {
      suppressClick.current = false
      return
    }
    const target = e.target as HTMLElement
    if (target.closest('button, a')) return

    onActivate?.()
    if (focusState === 'focused') {
      onFocusRelease?.()
      return
    }
    if (focusState === 'idle') onFocusRequest?.()
  }

  const pose = useMemo<Pose>(() => {
    if (focusState === 'focused') return focusPose(fieldSize, rect)
    return {
      x: rect.x,
      y: rect.y,
      scale: 1,
      rotate: rect.rotate ?? 0,
      opacity: 1,
    }
  }, [focusState, fieldSize, rect])

  const BODY_PAD = 10
  const FONT_SIZE = 10
  const LINE_HEIGHT = 1.4
  const contentH = Math.max(36, rect.h - TITLE_H)
  const lineClamp = Math.max(
    1,
    Math.floor((contentH - BODY_PAD * 2) / (FONT_SIZE * LINE_HEIGHT)),
  )
  const bodyTextStyle: CSSProperties = {
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: lineClamp,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    width: '100%',
    margin: 0,
    textAlign: 'left',
    fontSize: FONT_SIZE,
    lineHeight: LINE_HEIGHT,
    letterSpacing: '0.01em',
    color: '#000',
  }

  const textBlock = href ? (
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
  )

  return (
    <motion.div
      ref={rootRef}
      className={`browser-component absolute touch-none select-none ${className}`}
      initial={false}
      animate={
        shelved
          ? false
          : {
              left: pose.x,
              top: pose.y,
              scale: pose.scale,
              rotate: pose.rotate,
              opacity: exiting ? 1 : pose.opacity,
            }
      }
      transition={{
        type: 'spring',
        stiffness: 320,
        damping: 28,
        mass: 0.9,
      }}
      style={{
        width: rect.w,
        height: rect.h,
        ...(shelved
          ? {
              left: rect.x,
              top: rect.y,
              transform: `rotate(${rect.rotate ?? 0}deg)`,
            }
          : {}),
        zIndex: exiting ? zIndex + 20 : zIndex,
        transformOrigin: 'center center',
        pointerEvents: shelved ? 'none' : undefined,
        fontFamily: '"JetBrains Mono", ui-monospace, monospace',
      }}
      onPointerDown={() => onActivate?.()}
      onPointerEnter={() => onActivate?.()}
      onClick={handleCardClick}
    >
      <div
        className={`relative h-full w-full overflow-hidden rounded-[10px] border border-black bg-white ${
          exiting ? 'browser-crt-wipe' : ''
        }`}
      >
        <div className="flex h-full w-full flex-col">
          <div
            className="relative flex h-8 shrink-0 cursor-grab items-center gap-2 border-b border-black px-2.5 active:cursor-grabbing"
            onPointerDown={(e) => startDrag(e, 'move')}
          >
            <TrafficLights
              onMinimize={() => {
                onActivate?.()
                onMinimize?.()
              }}
            />
          </div>

          <div
            className="relative min-h-0 flex-1 overflow-hidden"
            onPointerEnter={() => setContentHover(true)}
            onPointerLeave={() => setContentHover(false)}
          >
            <div
              className={`h-full overflow-hidden px-2.5 py-2 transition-opacity duration-150 ${
                showVideo ? 'pointer-events-none opacity-0' : 'opacity-100'
              }`}
            >
              {textBlock}
            </div>

            {videoUrl ? (
              <div
                className={`absolute inset-0 bg-black transition-opacity duration-150 ${
                  showVideo ? 'opacity-100' : 'pointer-events-none opacity-0'
                }`}
                aria-hidden={!showVideo}
              >
                <video
                  ref={videoRef}
                  src={videoUrl}
                  className="pointer-events-none absolute inset-0 size-full object-cover"
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  aria-label={`${title} preview`}
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {interactive && focusState === 'idle' ? (
        <>
          <Handle edge="n" onPointerDown={(e) => startDrag(e, 'n')} />
          <Handle edge="s" onPointerDown={(e) => startDrag(e, 's')} />
          <Handle edge="e" onPointerDown={(e) => startDrag(e, 'e')} />
          <Handle edge="w" onPointerDown={(e) => startDrag(e, 'w')} />
          <Handle edge="ne" onPointerDown={(e) => startDrag(e, 'ne')} />
          <Handle edge="nw" onPointerDown={(e) => startDrag(e, 'nw')} />
          <Handle edge="se" onPointerDown={(e) => startDrag(e, 'se')} />
          <Handle edge="sw" onPointerDown={(e) => startDrag(e, 'sw')} />
        </>
      ) : null}
    </motion.div>
  )
}

function TrafficLights({ onMinimize }: { onMinimize?: () => void }) {
  return (
    <div className="flex shrink-0 items-center gap-1.5" aria-hidden={!onMinimize}>
      <span
        className="size-2.5 rounded-full border border-black/40 bg-[#ff5f57]"
        title="close"
      />
      <button
        type="button"
        aria-label="minimize"
        className="size-2.5 cursor-pointer rounded-full border border-black/40 bg-[#febc2e] p-0 hover:brightness-95 active:scale-90"
        onPointerDown={(e) => {
          e.preventDefault()
          e.stopPropagation()
        }}
        onClick={(e) => {
          e.stopPropagation()
          onMinimize?.()
        }}
      />
      <span
        className="size-2.5 rounded-full border border-black/40 bg-[#28c840]"
        title="zoom"
      />
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
