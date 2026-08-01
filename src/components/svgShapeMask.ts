export const LINE_HEIGHT = 15

export type BlockedSpan = { left: number; right: number }

/** Per text-line band: blocked X intervals in stage coordinates. */
export type ShapeBand = {
  y: number
  blocked: BlockedSpan[]
}

function mergeSpans(spans: BlockedSpan[]): BlockedSpan[] {
  if (spans.length === 0) return []
  const sorted = [...spans].sort((a, b) => a.left - b.left)
  const out: BlockedSpan[] = [{ ...sorted[0] }]
  for (let i = 1; i < sorted.length; i++) {
    const cur = sorted[i]
    const last = out[out.length - 1]
    if (cur.left <= last.right) last.right = Math.max(last.right, cur.right)
    else out.push({ ...cur })
  }
  return out
}

/** Invert blocked spans inside [0, width] → free intervals. */
export function freeSpans(
  width: number,
  blocked: BlockedSpan[],
  minWidth = 24,
): BlockedSpan[] {
  const merged = mergeSpans(
    blocked
      .map((s) => ({
        left: Math.max(0, s.left),
        right: Math.min(width, s.right),
      }))
      .filter((s) => s.right > s.left),
  )
  const free: BlockedSpan[] = []
  let cursor = 0
  for (const b of merged) {
    if (b.left - cursor >= minWidth) free.push({ left: cursor, right: b.left })
    cursor = Math.max(cursor, b.right)
  }
  if (width - cursor >= minWidth) free.push({ left: cursor, right: width })
  return free
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.decoding = 'async'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`Failed to load shape: ${src}`))
    img.src = src
  })
}

/**
 * Rasterize an SVG (or image) into per-line blocked X spans in stage space.
 * Text can flow through transparent gaps around each glyph silhouette.
 */
export async function buildShapeBands(opts: {
  src: string
  stageW: number
  stageH: number
  /** Display size of the SVG on the stage. */
  drawW: number
  drawH: number
  /** Extra clearance so type doesn’t kiss the ink. */
  pad?: number
  alphaThreshold?: number
}): Promise<{ bands: ShapeBand[]; offsetX: number; offsetY: number }> {
  const {
    src,
    stageW,
    stageH,
    drawW,
    drawH,
    pad = 5,
    alphaThreshold = 24,
  } = opts

  const img = await loadImage(src)
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(drawW))
  canvas.height = Math.max(1, Math.round(drawH))
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) return { bands: [], offsetX: 0, offsetY: 0 }

  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
  const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height)

  const offsetX = (stageW - canvas.width) / 2
  const offsetY = (stageH - canvas.height) / 2

  const bands: ShapeBand[] = []

  for (let y = 0; y < stageH; y += LINE_HEIGHT) {
    const bandTop = y
    const bandBottom = Math.min(stageH, y + LINE_HEIGHT)

    // Intersection of this text band with the SVG rect (stage coords)
    const intersectTop = Math.max(bandTop, offsetY)
    const intersectBottom = Math.min(bandBottom, offsetY + canvas.height)
    if (intersectBottom <= intersectTop) {
      bands.push({ y, blocked: [] })
      continue
    }

    const localY0 = Math.floor(intersectTop - offsetY)
    const localY1 = Math.ceil(intersectBottom - offsetY)
    const blockedLocal: BlockedSpan[] = []
    let runStart: number | null = null

    for (let x = 0; x < canvas.width; x++) {
      let hit = false
      for (let ly = localY0; ly < localY1 && !hit; ly++) {
        const row = Math.min(canvas.height - 1, Math.max(0, ly))
        const a = data[(row * canvas.width + x) * 4 + 3]
        if (a >= alphaThreshold) hit = true
      }

      if (hit) {
        if (runStart === null) runStart = x
      } else if (runStart !== null) {
        blockedLocal.push({
          left: runStart - pad,
          right: x + pad,
        })
        runStart = null
      }
    }
    if (runStart !== null) {
      blockedLocal.push({
        left: runStart - pad,
        right: canvas.width + pad,
      })
    }

    bands.push({
      y,
      blocked: mergeSpans(
        blockedLocal.map((s) => ({
          left: offsetX + s.left,
          right: offsetX + s.right,
        })),
      ),
    })
  }

  return { bands, offsetX, offsetY }
}

export function blockedForBand(
  bands: ShapeBand[],
  y: number,
): BlockedSpan[] {
  const band = bands.find((b) => b.y === y)
  return band?.blocked ?? []
}
