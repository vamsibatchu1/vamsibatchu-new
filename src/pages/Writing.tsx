import { useId, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { writingColumns, type WritingEntry } from '../data/writing'

/**
 * Writing archive — Sulki & Min–style index:
 * left meta column + three lined lists (black type / black rules).
 * Click a row to expand and reveal an excerpt.
 */
export default function Writing() {
  const [openId, setOpenId] = useState<string | null>(null)

  return (
    <section
      className="lowercase text-black"
      style={{ fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}
      aria-label="Writing archive"
    >
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(9rem,11.5rem)_minmax(0,1fr)] lg:gap-12 xl:gap-16">
        <aside className="text-[11px] leading-[1.5] sm:text-xs lg:sticky lg:top-24 lg:self-start">
          <div className="space-y-4 text-black/90">
            <p>
              writing is where unfinished thoughts get a place to sit —
              notes on interfaces, models, pacing, and the odd experiments
              that do not fit a case study.
            </p>
            <p>
              some pieces are essays, some are field notes from the lab,
              some started as talks. nothing here is a finished argument;
              it is a way of sharing the work while it is still moving.
            </p>
          </div>
        </aside>

        <div className="grid min-w-0 grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8 xl:gap-10">
          {writingColumns.map((col) => (
            <WritingList
              key={col.id}
              label={col.label}
              entries={col.entries}
              openId={openId}
              onToggle={(id) => setOpenId((cur) => (cur === id ? null : id))}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function WritingList({
  label,
  entries,
  openId,
  onToggle,
}: {
  label: string
  entries: WritingEntry[]
  openId: string | null
  onToggle: (id: string) => void
}) {
  let lastYear: number | null = null

  return (
    <div className="min-w-0">
      <h2 className="pb-2 text-sm font-bold tracking-tight sm:text-[15px]">
        {label}
      </h2>
      <div className="border-t-[1.5px] border-black" aria-hidden />

      <ul className="list-none p-0">
        {entries.map((entry, i) => {
          const showYear = entry.year !== lastYear
          lastYear = entry.year
          const id = `${label}-${entry.year}-${entry.title}-${i}`
          return (
            <WritingRow
              key={id}
              entry={entry}
              showYear={showYear}
              open={openId === id}
              onToggle={() => onToggle(id)}
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
  open,
  onToggle,
}: {
  entry: WritingEntry
  showYear: boolean
  open: boolean
  onToggle: () => void
}) {
  const reduceMotion = useReducedMotion()
  const panelId = useId()

  return (
    <li className="border-b border-black text-[10px] leading-[1.35] sm:text-[11px]">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={onToggle}
        className="grid w-full cursor-pointer grid-cols-[2.75rem_minmax(0,1fr)] gap-x-2 py-[5px] text-left text-black focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-black"
      >
        <span className="tabular-nums">{showYear ? entry.year : ''}</span>
        <span className="min-w-0 break-words">
          {entry.title}, {entry.kind}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            id={panelId}
            key="excerpt"
            initial={reduceMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { height: { duration: 0.32, ease: [0.22, 1, 0.36, 1] }, opacity: { duration: 0.2 } }
            }
            className="overflow-hidden"
          >
            <p className="col-start-2 pb-3 pl-[calc(2.75rem+0.5rem)] pr-1 pt-0.5 text-[10px] leading-[1.45] text-black/75 sm:text-[11px]">
              {entry.excerpt}
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </li>
  )
}
