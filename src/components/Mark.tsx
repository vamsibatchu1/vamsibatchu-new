import type { ReactNode } from 'react'

export type MarkTone = 'pink' | 'orange' | 'blue' | 'yellow' | 'purple' | 'green'

/** Hex values for nav marks — reuse for barcodes and accents. */
export const markColors: Record<MarkTone, string> = {
  pink: '#ffc2d4',
  orange: '#ffc4a8',
  blue: '#b7dbff',
  yellow: '#ffe566',
  purple: '#d9c2ff',
  green: '#b8f0c0',
}

const tones: Record<MarkTone, string> = {
  pink: 'bg-[#ffc2d4]',
  orange: 'bg-[#ffc4a8]',
  blue: 'bg-[#b7dbff]',
  yellow: 'bg-[#ffe566]',
  purple: 'bg-[#d9c2ff]',
  green: 'bg-[#b8f0c0]',
}

export default function Mark({
  tone,
  children,
  collapsed = false,
  barWidth,
  active = false,
}: {
  tone: MarkTone
  children: ReactNode
  collapsed?: boolean
  /** Rem width used when collapsed (proportional color bar). */
  barWidth?: number
  /** Underline the first letter when this nav item is active. */
  active?: boolean
}) {
  const label = typeof children === 'string' ? children : null
  const showFirstUnderline = active && !collapsed && label && label.length > 0

  return (
    <span
      className={`inline-flex items-center justify-center overflow-hidden transition-[width,padding,min-height] duration-300 ease-out ${tones[tone]} ${
        collapsed ? 'min-h-3 px-0' : 'px-0.5'
      }`}
      style={
        collapsed && barWidth
          ? { width: `${barWidth}rem` }
          : undefined
      }
    >
      <span
        className={`inline-block overflow-hidden whitespace-nowrap transition-[opacity,max-width,margin] duration-300 ease-out ${
          collapsed
            ? 'max-w-0 opacity-0'
            : 'max-w-[12rem] opacity-100'
        }`}
      >
        {showFirstUnderline ? (
          <>
            <span className="underline decoration-black decoration-1 underline-offset-[3px]">
              {label[0]}
            </span>
            {label.slice(1)}
          </>
        ) : (
          children
        )}
      </span>
    </span>
  )
}
