import { useEffect, useState } from 'react'
import { writingColumns, type WritingEntry } from '../data/writing'
import WritingEditor from '../features/writing/WritingEditor'
import writingImage from '../assets/writing.webp'
import { useShellUi } from '../components/ShellUiContext'

/**
 * Writing archive — Sulki & Min–style index:
 * left meta column + three lined lists (black type / black rules).
 * Click a row to open the article editor (no expand).
 */
export default function Writing() {
  const [openId, setOpenId] = useState<string | null>(null)
  const { setOverlayOpen } = useShellUi()

  useEffect(() => {
    setOverlayOpen(openId != null)
    return () => setOverlayOpen(false)
  }, [openId, setOverlayOpen])

  const select = (id: string) => {
    setOpenId((cur) => (cur === id ? null : id))
  }

  return (
    <section
      className="lowercase text-black"
      style={{ fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}
      aria-label="Writing archive"
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(14rem,18rem)_minmax(0,1fr)] lg:gap-12">
        <aside className="text-[13px] leading-[1.55] text-black/90 lg:sticky lg:top-24 lg:self-start lg:text-xs lg:leading-[1.5]">
          <div className="flex flex-col items-start space-y-4">
            <p>
              writing is where unfinished thoughts get a place to sit —
              notes on interfaces, models, pacing, and the odd experiments
              that do not fit a case study.
            </p>
            <img
              src={writingImage}
              alt=""
              className="h-auto w-[140px] max-w-full lg:w-[168px]"
            />
            <p>
              some pieces are essays, some are field notes from the lab,
              some started as talks. nothing here is a finished argument;
              it is a way of sharing the work while it is still moving.
              click a row to open the article editor.
            </p>
          </div>
        </aside>

        <div className="grid min-w-0 grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-8">
          {writingColumns.map((col) => (
            <WritingList
              key={col.id}
              label={col.label}
              entries={col.entries}
              openId={openId}
              onSelect={select}
            />
          ))}
        </div>
      </div>

      <WritingEditor articleId={openId} onClose={() => setOpenId(null)} />
    </section>
  )
}

function WritingList({
  label,
  entries,
  openId,
  onSelect,
}: {
  label: string
  entries: WritingEntry[]
  openId: string | null
  onSelect: (id: string) => void
}) {
  let lastYear: number | null = null

  return (
    <div className="min-w-0">
      <h2 className="pb-2 text-[15px] font-bold tracking-tight">
        {label}
      </h2>
      <div className="border-t-[1.5px] border-black" aria-hidden />

      <ul className="list-none p-0">
        {entries.map((entry) => {
          const showYear = entry.year !== lastYear
          lastYear = entry.year
          return (
            <WritingRow
              key={entry.id}
              entry={entry}
              showYear={showYear}
              active={openId === entry.id}
              onSelect={() => onSelect(entry.id)}
            />
          )
        })}
      </ul>
    </div>
  )
}

function WritingRow({
  entry,
  showYear,
  active,
  onSelect,
}: {
  entry: WritingEntry
  showYear: boolean
  active: boolean
  onSelect: () => void
}) {
  return (
    <li className="border-b border-black text-[12px] leading-[1.4] lg:text-[11px] lg:leading-[1.35]">
      <button
        type="button"
        aria-pressed={active}
        onClick={onSelect}
        className={`grid w-full cursor-pointer grid-cols-[3rem_minmax(0,1fr)] gap-x-2 px-1 py-2 text-left focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-black lg:grid-cols-[2.75rem_minmax(0,1fr)] lg:py-[5px] ${
          active
            ? 'bg-black text-white'
            : 'bg-transparent text-black hover:bg-black/[0.04]'
        }`}
      >
        <span className="tabular-nums">{showYear ? entry.year : ''}</span>
        <span className="min-w-0 break-words">
          {entry.title}, {entry.kind}
        </span>
      </button>
    </li>
  )
}
