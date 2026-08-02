import IndexGallery, {
  type IndexGalleryCell,
} from './IndexGallery'

/** Desktop column count — cell units must divide evenly into this. */
const COLS = 7
const ROWS = 6
const TARGET_UNITS = COLS * ROWS

/** Prefer a double-wide plate at these indices when the row still has room. */
const WANT_DOUBLE = new Set([4, 18, 33])

const CAPTIONS: Array<{ title: string; subtitle: string }> = [
  { title: 'studio still', subtitle: 'study 01' },
  { title: 'interface sketch', subtitle: 'prototype' },
  { title: 'field note', subtitle: 'archive' },
  { title: 'motion test', subtitle: 'experiment' },
  { title: 'type specimen', subtitle: 'layout' },
  { title: 'model output', subtitle: 'edited' },
  { title: 'reference board', subtitle: 'research' },
  { title: 'interaction pass', subtitle: 'build' },
  { title: 'color study', subtitle: 'material' },
  { title: 'system map', subtitle: 'diagram' },
]

/**
 * Build cells so column-units always land on a full row (no orphan tiles).
 */
function buildIndexCells(): IndexGalleryCell[] {
  const cells: IndexGalleryCell[] = []
  let units = 0
  let i = 0

  while (units < TARGET_UNITS) {
    const remainingInRow = COLS - (units % COLS)
    const remainingTotal = TARGET_UNITS - units
    const canDouble =
      WANT_DOUBLE.has(i) && remainingInRow >= 2 && remainingTotal >= 2
    const span: 1 | 2 = canDouble ? 2 : 1
    const caption = CAPTIONS[i % CAPTIONS.length]!

    cells.push({
      id: `index-${i}`,
      colSpan: span > 1 ? span : undefined,
      title: caption.title,
      subtitle: caption.subtitle,
    })
    units += span
    i += 1
  }

  return cells
}

/**
 * Home gallery — Phaidon index sheet with light-grey placeholder plates.
 * Exactly 6×7 column-units on desktop so the last row is never incomplete.
 */
export const homeIndexGallery: IndexGalleryCell[] = buildIndexCells()

export { IndexGallery }
