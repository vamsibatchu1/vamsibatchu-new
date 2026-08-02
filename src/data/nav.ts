import type { MarkTone } from '../components/Mark'

export type NavLinkItem = {
  to: string
  label: string
  /** Shorter label for tight mobile tabs (optional). */
  shortLabel?: string
  end?: boolean
  tone: MarkTone
}

/** Shared primary nav — powers desktop top bar and mobile bottom bar. */
export const navLinks: NavLinkItem[] = [
  { to: '/home', label: 'home', end: true, tone: 'orange' },
  { to: '/work', label: 'work', tone: 'yellow' },
  { to: '/experiments', label: 'experiments', shortLabel: 'lab', tone: 'purple' },
  { to: '/writing', label: 'writing', tone: 'blue' },
  { to: '/about', label: 'about', tone: 'green' },
]
