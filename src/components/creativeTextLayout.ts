import {
  layoutNextLine,
  type LayoutCursor,
  type PreparedTextWithSegments,
} from '@chenglou/pretext'

export const LINE_HEIGHT = 15

/** Image obstacle inside the shared multi-column flow. */
export type FlowImage = {
  id: string
  /** 0-based column index (clamped at layout time). */
  column: number
  /** Top edge in px within the column stack. */
  top: number
  height: number
  /**
   * Fraction of column width. `1` = full bleed (text only above/below).
   * `< 1` = text can wrap beside on the free side.
   */
  widthRatio?: number
  /** Which side the image hugs when not full-width. */
  float?: 'left' | 'right'
  src?: string
  alt?: string
}

export type PlacedLine = {
  col: number
  x: number
  y: number
  slotWidth: number
  text: string
  measuredWidth: number
}

function overlaps(a0: number, a1: number, b0: number, b1: number) {
  return a0 < b1 && a1 > b0
}

/** Free interval inside [0, colWidth] after subtracting image obstacles on this band. */
function freeSlot(
  colWidth: number,
  bandTop: number,
  bandBottom: number,
  images: FlowImage[],
  col: number,
): { left: number; right: number } | null {
  let left = 0
  let right = colWidth

  for (const img of images) {
    if (img.column !== col) continue
    if (!overlaps(bandTop, bandBottom, img.top, img.top + img.height)) continue

    const ratio = img.widthRatio ?? 1
    const imgW = colWidth * ratio
    const float = img.float ?? 'left'

    if (ratio >= 0.98) return null

    if (float === 'left') left = Math.max(left, imgW + 8)
    else right = Math.min(right, colWidth - imgW - 8)
  }

  if (right - left < 24) return null
  return { left, right }
}

/** Stream one prepared article across columns, routing around image obstacles. */
export function layoutFlow(
  prepared: PreparedTextWithSegments,
  colCount: number,
  colWidth: number,
  colHeight: number,
  images: FlowImage[],
): PlacedLine[] {
  const lines: PlacedLine[] = []
  let cursor: LayoutCursor = { segmentIndex: 0, graphemeIndex: 0 }
  let exhausted = false

  for (let col = 0; col < colCount && !exhausted; col++) {
    let y = 0
    while (y + LINE_HEIGHT <= colHeight) {
      const slot = freeSlot(colWidth, y, y + LINE_HEIGHT, images, col)
      if (!slot) {
        y += LINE_HEIGHT
        continue
      }

      const width = slot.right - slot.left
      const line = layoutNextLine(prepared, cursor, width)
      if (line === null) {
        exhausted = true
        break
      }

      lines.push({
        col,
        x: slot.left,
        y,
        slotWidth: width,
        text: line.text.replace(/\s+$/u, ''),
        measuredWidth: line.width,
      })
      cursor = line.end
      y += LINE_HEIGHT
    }
  }

  return lines
}

export function justifySpacing(line: PlacedLine, isLastInFlow: boolean) {
  if (isLastInFlow) return 0
  const gaps = (line.text.match(/\s+/gu) ?? []).length
  if (gaps < 1) return 0
  return Math.max(0, line.slotWidth - line.measuredWidth) / gaps
}
