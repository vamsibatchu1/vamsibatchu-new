import { useEffect, useRef, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import aboutIcon from '../assets/about me.webp'
import experimentsIcon from '../assets/experiments.webp'
import homeIcon from '../assets/home.webp'
import workIcon from '../assets/work.webp'
import writingIcon from '../assets/writing.webp'
import { navLinks } from '../data/nav'
import HeatmapOverlay from './HeatmapOverlay'
import Mark from './Mark'
import { shellMax, shellMainPad, shellPadX } from './shellLayout'
import { ShellUiProvider, useShellUi } from './ShellUiContext'

const mobileNavIcons: Record<string, string> = {
  '/home': homeIcon,
  '/work': workIcon,
  '/experiments': experimentsIcon,
  '/writing': writingIcon,
  '/about': aboutIcon,
}

function barWidthFor(label: string) {
  return Math.max(0.85, label.length * 0.22)
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.527-8.739L2.01 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
    </svg>
  )
}

function useNavCollapsed() {
  const [collapsed, setCollapsed] = useState(false)
  const lastY = useRef(0)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    lastY.current = window.scrollY

    const onScroll = () => {
      const y = window.scrollY
      const delta = y - lastY.current
      lastY.current = y

      if (y < 40) {
        setCollapsed(false)
        return
      }
      if (delta > 4 && y > 100) setCollapsed(true)
      else if (delta < -4) setCollapsed(false)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return collapsed
}

function DesktopTopNav({
  collapsed,
  heatmapOn,
  onToggleHeatmap,
}: {
  collapsed: boolean
  heatmapOn: boolean
  onToggleHeatmap: () => void
}) {
  return (
    <header className="sticky top-0 z-50 hidden bg-white lowercase lg:block">
      <div
        className={`${shellMax} flex items-center justify-end gap-4 py-5 lg:py-6 ${shellPadX}`}
      >
        <nav
          className={`flex flex-wrap items-center justify-end transition-[gap] duration-300 ease-out ${
            collapsed ? 'gap-x-0.5 gap-y-1' : 'gap-x-3 gap-y-2 sm:gap-x-4'
          } text-sm sm:text-base`}
          aria-label="Primary"
        >
          {navLinks.map(({ to, label, end, tone }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              aria-label={label}
              className={({ isActive }) =>
                `inline-flex items-center gap-1.5 transition-opacity hover:opacity-100 ${
                  isActive ? 'opacity-100' : 'opacity-80'
                }`
              }
            >
              {({ isActive }) => (
                <Mark
                  tone={tone}
                  collapsed={collapsed}
                  barWidth={barWidthFor(label)}
                  active={isActive}
                >
                  {label}
                </Mark>
              )}
            </NavLink>
          ))}

          <button
            type="button"
            aria-pressed={heatmapOn}
            aria-label="toggle heatmap mode"
            onClick={onToggleHeatmap}
            className={`inline-flex items-center lowercase transition-all duration-300 hover:opacity-100 ${
              collapsed
                ? 'max-w-0 scale-75 overflow-hidden opacity-0'
                : heatmapOn
                  ? 'max-w-[6rem] opacity-100 line-through decoration-black decoration-1'
                  : 'max-w-[6rem] opacity-80'
            }`}
          >
            heatmap
          </button>

          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            aria-label="instagram"
            className={`inline-flex transition-all duration-300 hover:opacity-100 ${
              collapsed
                ? 'max-w-0 scale-75 overflow-hidden opacity-0'
                : 'max-w-[2rem] opacity-80'
            }`}
          >
            <InstagramIcon />
          </a>
          <a
            href="https://x.com"
            target="_blank"
            rel="noreferrer"
            aria-label="x"
            className={`inline-flex transition-all duration-300 hover:opacity-100 ${
              collapsed
                ? 'max-w-0 scale-75 overflow-hidden opacity-0'
                : 'max-w-[2rem] opacity-80'
            }`}
          >
            <XIcon />
          </a>
        </nav>
      </div>
    </header>
  )
}

function MobileBottomNav({ hidden }: { hidden: boolean }) {
  return (
    <nav
      aria-label="Primary"
      aria-hidden={hidden}
      className={`fixed inset-x-0 bottom-0 z-50 border-t border-black/10 bg-white lowercase transition-transform duration-300 ease-out lg:hidden ${
        hidden ? 'pointer-events-none translate-y-full' : 'translate-y-0'
      }`}
      style={{
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      <div className={`${shellMax} grid grid-cols-5`}>
        {navLinks.map(({ to, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            aria-label={label}
            className={({ isActive }) =>
              `flex min-h-14 flex-col items-center justify-center px-0.5 py-2 transition-opacity ${
                isActive ? 'opacity-100' : 'opacity-50'
              }`
            }
          >
            <img
              src={mobileNavIcons[to]}
              alt=""
              aria-hidden
              className="h-10 w-10 object-contain"
              draggable={false}
            />
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

function LayoutShell() {
  const collapsed = useNavCollapsed()
  const { pathname } = useLocation()
  const [heatmapOn, setHeatmapOn] = useState(false)
  const { overlayOpen } = useShellUi()

  return (
    <div
      className="flex min-h-dvh flex-col bg-white text-black"
      style={{ fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}
    >
      <DesktopTopNav
        collapsed={collapsed}
        heatmapOn={heatmapOn}
        onToggleHeatmap={() => setHeatmapOn((v) => !v)}
      />

      <main className={`${shellMax} flex-1 ${shellMainPad}`}>
        <Outlet />
      </main>

      <MobileBottomNav hidden={overlayOpen} />

      {heatmapOn ? <HeatmapOverlay path={pathname} /> : null}
    </div>
  )
}

export default function Layout() {
  return (
    <ShellUiProvider>
      <LayoutShell />
    </ShellUiProvider>
  )
}
