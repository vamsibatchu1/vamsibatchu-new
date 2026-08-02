import type { VisitSnapshot } from './visitMath'
import {
  formatDuration,
  formatReceiptClock,
  formatTokens,
  sessionWallMs,
  sumTokens,
  tokensFor,
} from './visitMath'

type ReceiptTicketProps = {
  snapshot: VisitSnapshot
}

/**
 * Thermal visit receipt — monospace strip, fixed columns inside the paper.
 */
export default function ReceiptTicket({ snapshot }: ReceiptTicketProps) {
  const { date, time } = formatReceiptClock(snapshot.endedAt)
  const start = formatReceiptClock(snapshot.startedAt)
  const tokens = sumTokens(snapshot.pages)
  const sessionMs = sessionWallMs(snapshot)
  const itemCount = snapshot.pages.length
  const code = [
    snapshot.sessionId.replace('-', ''),
    String(snapshot.totalClicks).padStart(3, '0'),
    String(Math.floor(sessionMs / 1000)).padStart(4, '0'),
  ].join('/')

  return (
    <div
      className="receipt-ticket w-[280px] overflow-hidden bg-[#f7f4ec] px-3.5 py-4 text-black"
      style={{
        fontFamily: '"JetBrains Mono", ui-monospace, monospace',
        boxShadow: '0 12px 40px rgb(0 0 0 / 0.18)',
      }}
    >
      <header className="text-center lowercase leading-tight">
        <p className="text-[16px] font-bold tracking-[0.14em]">VB STUDIO</p>
        <p className="mt-1 text-[10px]">store #01</p>
        <p className="text-[9px] text-black/55">design · code · media</p>
      </header>

      <Rule />

      <div className="space-y-0.5 text-[9px] lowercase leading-relaxed text-black/65">
        <MetaRow label="opened" value={`${start.date} ${start.time}`} />
        <MetaRow label="printed" value={`${date} ${time}`} />
        <MetaRow label="ref" value={snapshot.sessionId} />
      </div>

      <Rule kind="dash" />

      <div className="text-[9px] lowercase">
        <div className="grid grid-cols-[minmax(0,1fr)_2.5rem_2.75rem] gap-x-2 text-[8px] tracking-[0.04em] text-black/45">
          <span>page</span>
          <span className="text-right">time</span>
          <span className="text-right">tok</span>
        </div>

        {snapshot.pages.length === 0 ? (
          <p className="py-3 text-center text-[9px] text-black/40">
            empty cart — browse a bit first
          </p>
        ) : (
          <ul className="mt-1.5 list-none space-y-1.5 p-0">
            {snapshot.pages.map((page) => {
              const tk = tokensFor(page)
              return (
                <li key={page.path}>
                  <div className="grid grid-cols-[minmax(0,1fr)_2.5rem_2.75rem] gap-x-2">
                    <span className="min-w-0 truncate">{page.label}</span>
                    <span className="text-right tabular-nums">
                      {formatDuration(page.ms)}
                    </span>
                    <span className="text-right tabular-nums">
                      {formatTokens(tk)}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[8px] text-black/40">
                    {page.clicks} clicks · {page.scrolls} scrolls
                  </p>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      <Rule kind="dash" />

      <div className="space-y-0.5 text-[9px] lowercase tabular-nums">
        <MetaRow label="pages" value={String(itemCount)} />
        <MetaRow label="clicks" value={String(snapshot.totalClicks)} />
        <MetaRow label="session" value={formatDuration(sessionMs)} />
        <MetaRow label="tokens" value={formatTokens(tokens)} />
      </div>

      <div className="mt-3 text-center">
        <p className="text-[10px] tracking-[0.28em]">T O T A L</p>
        <p className="mt-1 text-[20px] font-bold tabular-nums">
          {formatTokens(tokens)}
        </p>
        <p className="mt-0.5 text-[8px] text-black/45">tokens</p>
      </div>

      <Rule kind="star" />

      <p className="text-center text-[9px] tracking-[0.1em]">++APPROVED++</p>
      <p className="mt-2 break-all text-center text-[8px] leading-relaxed text-black/50">
        *{code}*
        <br />
        {date} {time}
      </p>
    </div>
  )
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-x-2">
      <span className="text-black/45">{label}</span>
      <span className="min-w-0 truncate text-right tabular-nums">{value}</span>
    </div>
  )
}

function Rule({ kind = 'line' }: { kind?: 'line' | 'dash' | 'star' }) {
  if (kind === 'dash') {
    return (
      <div
        className="my-2.5 border-t border-dashed border-black/30"
        aria-hidden
      />
    )
  }
  if (kind === 'star') {
    return (
      <p
        className="my-2.5 overflow-hidden text-center text-[9px] leading-none tracking-[0.2em] text-black/35"
        aria-hidden
      >
        * * * * * * * * * * * * *
      </p>
    )
  }
  return (
    <div className="my-2.5 border-t border-black/35" aria-hidden />
  )
}
