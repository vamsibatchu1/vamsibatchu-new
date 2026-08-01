import {
  useEffect,
  useRef,
  type CSSProperties,
  type ReactNode,
} from 'react'

type ScrollCubeProps = {
  children: ReactNode
  /** Face / page background. */
  background?: string
  /** Body text color. */
  color?: string
  className?: string
}

/**
 * Scroll-driven 3D text cube — same technique as juliavolkmar.de:
 * invisible scroll source + two perspective faces (±30° rotateX) whose
 * content is synced to scroll, meeting at the viewport midline.
 */
export default function ScrollCube({
  children,
  background = '#ffffff',
  color = '#000000',
  className = '',
}: ScrollCubeProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const articleRef = useRef<HTMLElement>(null)
  const cloneWrapRef = useRef<HTMLDivElement>(null)
  const clone1ScrollRef = useRef<HTMLDivElement>(null)
  const clone2ScrollRef = useRef<HTMLDivElement>(null)
  const blockRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const article = articleRef.current
    const cloneWrap = cloneWrapRef.current
    const c1 = clone1ScrollRef.current
    const c2 = clone2ScrollRef.current
    const block = blockRef.current
    if (!article || !cloneWrap || !c1 || !c2 || !block) return

    if (reduced) {
      // Flat fallback: make the source article visible and scrollable
      article.style.opacity = '1'
      const wrappers = article.querySelectorAll<HTMLElement>('[data-cube-block]')
      wrappers.forEach((el) => {
        el.style.opacity = '1'
        el.style.pointerEvents = 'auto'
      })
      cloneWrap.style.display = 'none'
      return
    }

    let viewPortHeight = window.innerHeight
    let viewPortWidth = window.innerWidth
    let articleH = block.offsetHeight

    let rotationX = 0
    let rotationY = 0
    let strength = 1
    let _rotationX = 0
    let _rotationY = 0
    let _strength = 0
    const friction = 0.02
    const maxDegree = 60
    let raf = 0
    let scrollIdle: number | undefined

    const setVh = () => {
      document.documentElement.style.setProperty(
        '--cube-vh',
        `${window.innerHeight * 0.01}px`,
      )
    }

    const updateViewport = () => {
      viewPortHeight = window.innerHeight
      viewPortWidth = window.innerWidth
      setVh()
    }

    const updateScrollElement = () => {
      articleH = block.offsetHeight
    }

    const onMouseMove = (e: MouseEvent) => {
      rotationX = 0.5 - e.clientX / viewPortWidth
      rotationY = 0.5 - e.clientY / viewPortHeight
      const ax = Math.abs(rotationX)
      const ay = Math.abs(rotationY)
      strength = (ax + ay) / 2
    }

    const onMouseOut = () => {
      rotationX = 0
      rotationY = 0
    }

    const onScroll = () => {
      rootRef.current?.classList.add('is-scrolling')
      window.clearTimeout(scrollIdle)
      scrollIdle = window.setTimeout(() => {
        rootRef.current?.classList.remove('is-scrolling')
      }, 60)
    }

    const render = () => {
      // Infinite loop across the duplicated content block
      if (article.scrollTop >= articleH) {
        article.scrollTop = -(articleH - article.scrollTop) - 0.1
      } else if (article.scrollTop <= 0) {
        article.scrollTop = articleH + article.scrollTop - 0.1
      }

      const y = article.scrollTop
      c1.style.transform = `translate3d(0, ${-y}px, 0)`
      c2.style.transform = `translate3d(0, ${-(y + 1.5 * viewPortHeight)}px, 0)`

      _strength += (strength - _strength) * friction
      _rotationX += (rotationX - _rotationX) * friction
      _rotationY += (rotationY - _rotationY) * friction

      cloneWrap.style.transform =
        `perspective(1000px) translate3d(${_rotationX * (viewPortWidth / 3)}px, ${_rotationY * (viewPortHeight / 3)}px, ${-10 * _strength}vmax) rotateX(${-_rotationY * maxDegree}deg) rotateY(${_rotationX * maxDegree}deg)`

      raf = requestAnimationFrame(render)
    }

    const seedScrollToThirdLine = (resetScroll = true) => {
      updateViewport()
      updateScrollElement()
      const firstP = block.querySelector('p')
      const cs = firstP ? getComputedStyle(firstP) : null
      const fontSize = cs ? parseFloat(cs.fontSize) || 24 : 24
      const lineHeight =
        (cs && parseFloat(cs.lineHeight)) || fontSize * 1.25
      // At scrollTop≈0 the seam already sits ~0.5vh into the block.
      // Spacer shifts content so line 3 of the first paragraph hits the fold.
      const spacerH = Math.max(0, viewPortHeight * 0.5 - lineHeight * 2.5)
      rootRef.current
        ?.querySelectorAll<HTMLElement>('.cube-seed-spacer')
        .forEach((el) => {
          el.style.height = `${spacerH}px`
        })
      updateScrollElement()
      if (resetScroll) article.scrollTop = 1
    }

    const onResize = () => {
      seedScrollToThirdLine(false)
    }

    setVh()
    updateViewport()
    updateScrollElement()
    seedScrollToThirdLine(true)

    window.addEventListener('resize', onResize, { passive: true })
    window.addEventListener('mousemove', onMouseMove, { passive: true })
    document.addEventListener('mouseout', onMouseOut, { passive: true })
    article.addEventListener('scroll', onScroll, { passive: true })
    raf = requestAnimationFrame(render)

    // Recalc after fonts/layout settle
    const t = window.setTimeout(() => {
      seedScrollToThirdLine(true)
    }, 200)

    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(t)
      window.clearTimeout(scrollIdle)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseout', onMouseOut)
      article.removeEventListener('scroll', onScroll)
    }
  }, [])

  const vars = {
    ['--cube-bg' as string]: background,
    ['--cube-fg' as string]: color,
  } as CSSProperties

  const face = (scrollRef: typeof clone1ScrollRef, key: string) => (
    <article key={key} className="cube-face" aria-hidden>
      <div ref={scrollRef} className="cube-scroller">
        <div className="cube-block" data-cube-block>
          <div className="cube-seed-spacer" aria-hidden />
          {children}
        </div>
        <div className="cube-block" data-cube-block>
          <div className="cube-seed-spacer" aria-hidden />
          {children}
        </div>
      </div>
    </article>
  )

  return (
    <div
      ref={rootRef}
      className={`scroll-cube ${className}`}
      style={vars}
    >
      {/* Invisible scroll source */}
      <article ref={articleRef} id="cube-article" className="cube-source">
        <div className="cube-scroller">
          <div ref={blockRef} className="cube-block" data-cube-block>
            <div className="cube-seed-spacer" aria-hidden />
            {children}
          </div>
          <div className="cube-block" data-cube-block>
            <div className="cube-seed-spacer" aria-hidden />
            {children}
          </div>
        </div>
      </article>

      {/* Visible ±30° faces */}
      <div ref={cloneWrapRef} className="cube-clone-wrap">
        <div id="cube-clone-1" className="cube-clone cube-clone--top">
          {face(clone1ScrollRef, 'c1')}
        </div>
        <div id="cube-clone-2" className="cube-clone cube-clone--bottom">
          {face(clone2ScrollRef, 'c2')}
        </div>
      </div>

      <style>{cubeCss}</style>
    </div>
  )
}

const cubeCss = `
.scroll-cube {
  position: fixed;
  inset: 0;
  z-index: 40;
  overflow: hidden;
  color: var(--cube-fg);
  background: var(--cube-bg);
  touch-action: pan-y;
}

.cube-source,
.cube-face {
  position: absolute;
  inset: 0;
  height: calc(var(--cube-vh, 1vh) * 100);
  overflow: hidden;
  padding: calc(var(--cube-vh, 1vh) * 100) 1em 0;
  font-size: clamp(1.25rem, 2.2vw + 0.6rem, 2.75rem);
  line-height: 1.25;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  color: var(--cube-fg);
}

.cube-source {
  position: fixed;
  z-index: 1;
  height: 100%;
  overflow: scroll;
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.cube-source::-webkit-scrollbar { display: none; }
.cube-source .cube-block {
  opacity: 0;
  pointer-events: none;
}

.cube-clone-wrap {
  position: fixed;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  user-select: none;
  perspective: 1000px;
  transform-style: preserve-3d;
  transform-origin: center center;
}

.cube-clone {
  position: fixed;
  top: calc(var(--cube-vh, 1vh) * 50);
  left: 0;
  right: 0;
  height: calc(var(--cube-vh, 1vh) * 150);
  overflow: hidden;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

.cube-clone .cube-face {
  position: relative;
  inset: auto;
  height: 100%;
  width: 100%;
}

.cube-clone--top {
  transform: translate3d(0, -100%, 0) rotate3d(1, 0, 0, 30deg);
  transform-origin: center bottom;
}
.cube-clone--bottom {
  transform: translate3d(0, 0, 0) rotate3d(-1, 0, 0, 30deg);
  transform-origin: center top;
}

.cube-clone--top::after,
.cube-clone--bottom::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  height: calc(var(--cube-vh, 1vh) * 20);
  pointer-events: none;
  z-index: 99999;
  transform: translate3d(0, 0, 1000px);
}
.cube-clone--top::after {
  top: 0;
  background: linear-gradient(180deg, var(--cube-bg), transparent);
}
.cube-clone--bottom::after {
  bottom: 0;
  background: linear-gradient(0deg, var(--cube-bg), transparent);
}

.cube-scroller { height: auto; will-change: transform; }
.cube-seed-spacer {
  width: 100%;
  flex-shrink: 0;
  pointer-events: none;
}
.cube-block {
  max-width: 1200px;
  margin: 0 auto;
  transform: translate3d(0, 0, 0);
}
.cube-block p {
  margin: 0;
  padding: 0 0 1em;
}
.cube-block p:last-child {
  padding-bottom: 100vh;
}
.cube-block a {
  font-weight: 700;
  color: inherit;
  text-decoration: none;
  background-image: linear-gradient(
    180deg,
    transparent 88%,
    var(--cube-fg) 88%,
    var(--cube-fg) 92%,
    transparent 92%
  );
  background-size: 0 100%;
  background-repeat: no-repeat;
  transition: background-size 0.5s;
  pointer-events: auto;
}
.scroll-cube:not(.is-scrolling) .cube-block a:hover {
  background-size: 100% 100%;
}
.scroll-cube.is-scrolling .cube-block a {
  pointer-events: none;
}

@media (min-width: 576px) {
  .cube-source, .cube-face { font-size: calc(9.375vw - 30px); }
}
@media (min-width: 768px) {
  .cube-source, .cube-face { font-size: calc(33px + 1.17188vw); }
}
@media (min-width: 1280px) {
  .cube-source, .cube-face { font-size: calc(24px + 1.875vw); }
}
@media (min-width: 2560px) {
  .cube-source, .cube-face { font-size: 72px; }
}
`
