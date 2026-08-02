import type { CSSProperties } from 'react'

export type IndexGalleryCell = {
  id: string
  /** Span two columns — landscape cell, same row height as neighbors. */
  colSpan?: 1 | 2
  /** First line under the plate. */
  title?: string
  /** Second line under the plate. */
  subtitle?: string
}

type IndexGalleryProps = {
  cells: IndexGalleryCell[]
  className?: string
}

const PLATE = '#efeeec'

/**
 * Phaidon-style index grid: white field, 10px inset,
 * grey plate + two-line mono caption (8px gap).
 */
export default function IndexGallery({
  cells,
  className = '',
}: IndexGalleryProps) {
  return (
    <div
      className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 ${className}`}
      role="list"
      aria-label="Selected work index"
      style={{ fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}
    >
      {cells.map((cell) => {
        const span = cell.colSpan ?? 1
        const style: CSSProperties = {
          gridColumn: span > 1 ? `span ${span}` : undefined,
          aspectRatio: span > 1 ? `${span} / 1` : '1 / 1',
        }
        const title = cell.title ?? 'untitled study'
        const subtitle = cell.subtitle ?? 'work in progress'

        return (
          <figure
            key={cell.id}
            role="listitem"
            className="m-0 flex flex-col gap-2 bg-white p-2.5"
            style={style}
          >
            <div
              className="min-h-0 w-full flex-1"
              style={{ backgroundColor: PLATE }}
              aria-hidden
            />
            <figcaption className="shrink-0 text-[8px] leading-[1.25] lowercase tracking-[0.02em] text-black lg:text-[9px]">
              <p className="m-0 truncate">{title}</p>
              <p className="m-0 truncate text-black/55">{subtitle}</p>
            </figcaption>
          </figure>
        )
      })}
    </div>
  )
}
