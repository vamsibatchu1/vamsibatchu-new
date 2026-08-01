import { useEffect, useRef, useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import Mark, { type MarkTone } from './Mark'

const links: {
  to: string
  label: string
  end?: boolean
  tone: MarkTone
}[] = [
  { to: '/home', label: 'home', end: true, tone: 'orange' },
  { to: '/work', label: 'work', tone: 'yellow' },
  { to: '/experiments', label: 'experiments', tone: 'purple' },
  { to: '/writing', label: 'writing', tone: 'blue' },
  { to: '/about', label: 'about', tone: 'green' },
]

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

export default function Layout() {
  const collapsed = useNavCollapsed()
return (
    <div
      className="flex min-h-dvh flex-col bg-white text-black"
      style={{ fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}
    >
      <header className="sticky top-0 z-50 bg-white lowercase">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-end gap-4 px-4 py-5 sm:px-8 sm:py-6 lg:px-10">
          <nav
            className={`flex flex-wrap items-center justify-end transition-[gap] duration-300 ease-out ${
              collapsed
                ? 'gap-x-0.5 gap-y-1'
                : 'gap-x-3 gap-y-2 sm:gap-x-4'
            } text-sm sm:text-base`}
            aria-label="Primary"
          >
            {links.map(({ to, label, end, tone }) => (
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

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-8 sm:py-12 lg:px-10">
        <Outlet />
      </main>
    </div>
  )
}
