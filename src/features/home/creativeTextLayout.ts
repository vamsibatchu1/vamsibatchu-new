import {
  layoutNextLine,
  type LayoutCursor,
  type PreparedTextWithSegments,
} from '@chenglou/pretext'
import {
  blockedForBand,
  freeSpans,
  LINE_HEIGHT,
  type BlockedSpan,
  type ShapeBand,
} from '../../components/svgShapeMask'

export { LINE_HEIGHT }

/** Image obstacle inside the shared multi-column flow. */
export type FlowImage = {
  id: string
  /** 0-based column index (clamped at layout time). */
  column: number
  /** Top edge in px within the column stack. */
  top: number
  /**
   * Explicit height in px. Ignored when `aspectRatio` is set —
   * height is then derived from column width × widthRatio.
   */
  height?: number
  /**
   * Natural width ÷ height. When set, displayed height is
   * `(colWidth * widthRatio) / aspectRatio` (no cropping).
   */
  aspectRatio?: number
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

/** Resolve display width/height for layout + rendering. */
export function resolveFlowImageSize(
  img: FlowImage,
  colWidth: number,
): { width: number; height: number } {
  const ratio = img.widthRatio ?? 1
  const width = Math.max(1, colWidth * ratio)
  const height = img.aspectRatio
    ? width / img.aspectRatio
    : (img.height ?? 120)
  return { width, height }
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

/** Rectangular image obstacles → blocked spans in column-local coords. */
function imageBlockedInColumn(
  colWidth: number,
  bandTop: number,
  bandBottom: number,
  images: FlowImage[],
  col: number,
): BlockedSpan[] | 'full' {
  const blocked: BlockedSpan[] = []

  for (const img of images) {
    if (img.column !== col) continue
    const { width: imgW, height: imgH } = resolveFlowImageSize(img, colWidth)
    if (!overlaps(bandTop, bandBottom, img.top, img.top + imgH)) continue

    const ratio = img.widthRatio ?? 1
    const float = img.float ?? 'left'

    if (ratio >= 0.98) return 'full'

    if (float === 'left') blocked.push({ left: 0, right: imgW + 8 })
    else blocked.push({ left: colWidth - imgW - 8, right: colWidth })
  }

  return blocked
}

/**
 * Stream one prepared article across columns.
 * Routes around rectangular images and SVG silhouette scanlines
 * so type can slip through gaps between glyph shapes.
 *
 * Column-major: fill each column top→bottom, then the next column,
 * so reading down a column stays a continuous sentence stream.
 */
export function layoutFlow(
  prepared: PreparedTextWithSegments,
  colCount: number,
  colWidth: number,
  colHeight: number,
  images: FlowImage[],
  gap = 20,
  shapeBands?: ShapeBand[],
): PlacedLine[] {
  const lines: PlacedLine[] = []
  let cursor: LayoutCursor = { segmentIndex: 0, graphemeIndex: 0 }
  let exhausted = false

  for (let col = 0; col < colCount && !exhausted; col++) {
    const stageLeft = col * (colWidth + gap)

    for (let y = 0; y + LINE_HEIGHT <= colHeight && !exhausted; y += LINE_HEIGHT) {
      const imgBlock = imageBlockedInColumn(
        colWidth,
        y,
        y + LINE_HEIGHT,
        images,
        col,
      )
      if (imgBlock === 'full') continue

      const shapeBlock = shapeBands
        ? blockedForBand(shapeBands, y)
            .map((s) => ({
              left: s.left - stageLeft,
              right: s.right - stageLeft,
            }))
            .filter((s) => s.right > 0 && s.left < colWidth)
        : []

      const slots = freeSpans(colWidth, [...imgBlock, ...shapeBlock], 22)

      for (const slot of slots) {
        if (exhausted) break
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
      }
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
