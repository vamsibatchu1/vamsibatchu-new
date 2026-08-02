import type { VisitSnapshot } from './visitMath'
import {
  formatDuration,
  formatReceiptClock,
  formatTokens,
  sessionWallMs,
  sumTokens,
  tokensFor,
} from './visitMath'
import { receiptFilename } from './downloadReceipt'

const W = 280
const PAD = 14
const FONT = '"JetBrains Mono", ui-monospace, monospace'
const BG = '#f7f4ec'
const COL_TIME = 40
const COL_TOK = 44

/**
 * Draw thermal receipt to canvas and download as PNG.
 */
export async function downloadReceiptPng(snapshot: VisitSnapshot): Promise<void> {
  const lines = buildLines(snapshot)
  const lineH = 14
  const height = PAD * 2 + lines.reduce((h, l) => h + (l.gap ?? lineH), 0) + 8

  const scale = Math.min(3, window.devicePixelRatio || 2)
  const canvas = document.createElement('canvas')
  canvas.width = Math.ceil(W * scale)
  canvas.height = Math.ceil(height * scale)
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('canvas unsupported')

  ctx.scale(scale, scale)
  ctx.fillStyle = BG
  ctx.fillRect(0, 0, W, height)
  ctx.fillStyle = '#000'
  ctx.textBaseline = 'top'

  let y = PAD
  for (const line of lines) {
    const size = line.size ?? 10
    ctx.font = `${line.bold ? '700' : '400'} ${size}px ${FONT}`
    ctx.globalAlpha = line.muted ? 0.55 : 1
    if (line.align === 'center') {
      ctx.textAlign = 'center'
      ctx.fillText(line.text, W / 2, y, W - PAD * 2)
    } else if (line.align === 'cols') {
      const tokX = W - PAD
      const timeX = tokX - COL_TOK - 8
      const labelMax = timeX - COL_TIME - PAD - 8
      ctx.textAlign = 'left'
      ctx.fillText(line.text, PAD, y, labelMax)
      ctx.textAlign = 'right'
      ctx.fillText(line.mid ?? '', timeX, y, COL_TIME)
      ctx.fillText(line.right ?? '', tokX, y, COL_TOK)
    } else if (line.align === 'split' && line.right) {
      ctx.textAlign = 'left'
      ctx.fillText(line.text, PAD, y, 72)
      ctx.textAlign = 'right'
      ctx.fillText(line.right, W - PAD, y, W - PAD * 2 - 80)
    } else {
      ctx.textAlign = 'left'
      ctx.fillText(line.text, PAD, y, W - PAD * 2)
    }
    y += line.gap ?? lineH
  }
  ctx.globalAlpha = 1

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error('png encode failed'))),
      'image/png',
    )
  })

  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = receiptFilename(snapshot.sessionId, snapshot.endedAt)
  a.rel = 'noopener'
  document.body.appendChild(a)
  a.click()
  a.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1500)
}

type Line = {
  text: string
  mid?: string
  right?: string
  align?: 'left' | 'center' | 'split' | 'cols'
  size?: number
  bold?: boolean
  muted?: boolean
  gap?: number
}

function rule(char: string): Line {
  return {
    text: char.repeat(34),
    align: 'center',
    size: 9,
    muted: true,
    gap: 12,
  }
}

function buildLines(snapshot: VisitSnapshot): Line[] {
  const { date, time } = formatReceiptClock(snapshot.endedAt)
  const start = formatReceiptClock(snapshot.startedAt)
  const tokens = sumTokens(snapshot.pages)
  const sessionMs = sessionWallMs(snapshot)
  const code = [
    snapshot.sessionId.replace('-', ''),
    String(snapshot.totalClicks).padStart(3, '0'),
    String(Math.floor(sessionMs / 1000)).padStart(4, '0'),
  ].join('/')

  const lines: Line[] = [
    { text: 'VB STUDIO', align: 'center', size: 15, bold: true, gap: 17 },
    { text: 'store #01', align: 'center', size: 10, gap: 12 },
    {
      text: 'design · code · media',
      align: 'center',
      size: 9,
      muted: true,
      gap: 14,
    },
    rule('='),
    {
      text: 'opened',
      right: `${start.date} ${start.time}`,
      align: 'split',
      size: 9,
      muted: true,
      gap: 12,
    },
    {
      text: 'printed',
      right: `${date} ${time}`,
      align: 'split',
      size: 9,
      muted: true,
      gap: 12,
    },
    {
      text: 'ref',
      right: snapshot.sessionId,
      align: 'split',
      size: 9,
      muted: true,
      gap: 14,
    },
    rule('-'),
    {
      text: 'PAGE',
      mid: 'TIME',
      right: 'TOK',
      align: 'cols',
      size: 8,
      muted: true,
      gap: 13,
    },
  ]

  if (snapshot.pages.length === 0) {
    lines.push({
      text: 'empty cart — browse a bit first',
      align: 'center',
      size: 9,
      muted: true,
      gap: 16,
    })
  } else {
    for (const page of snapshot.pages) {
      const tk = tokensFor(page)
      lines.push({
        text: page.label,
        mid: formatDuration(page.ms),
        right: formatTokens(tk),
        align: 'cols',
        size: 10,
        gap: 12,
      })
      lines.push({
        text: `${page.clicks} clicks · ${page.scrolls} scrolls`,
        size: 8,
        muted: true,
        gap: 13,
      })
    }
  }

  lines.push(
    rule('-'),
    {
      text: 'pages',
      right: String(snapshot.pages.length),
      align: 'split',
      size: 9,
      gap: 12,
    },
    {
      text: 'clicks',
      right: String(snapshot.totalClicks),
      align: 'split',
      size: 9,
      gap: 12,
    },
    {
      text: 'session',
      right: formatDuration(sessionMs),
      align: 'split',
      size: 9,
      gap: 12,
    },
    {
      text: 'tokens',
      right: formatTokens(tokens),
      align: 'split',
      size: 9,
      gap: 16,
    },
    { text: 'T O T A L', align: 'center', size: 10, gap: 14 },
    {
      text: formatTokens(tokens),
      align: 'center',
      size: 20,
      bold: true,
      gap: 12,
    },
    { text: 'tokens', align: 'center', size: 8, muted: true, gap: 14 },
    rule('*'),
    { text: '++APPROVED++', align: 'center', size: 9, gap: 14 },
    { text: `*${code}*`, align: 'center', size: 8, muted: true, gap: 12 },
    { text: `${date} ${time}`, align: 'center', size: 8, muted: true, gap: 12 },
  )

  return lines
}
