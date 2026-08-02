/** Filename helper shared by export paths. */
export function receiptFilename(sessionId: string, endedAt: number): string {
  const d = new Date(endedAt)
  const stamp = [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, '0'),
    String(d.getDate()).padStart(2, '0'),
    '-',
    String(d.getHours()).padStart(2, '0'),
    String(d.getMinutes()).padStart(2, '0'),
  ].join('')
  return `vb-receipt-${stamp}-${sessionId.toLowerCase()}.png`
}
