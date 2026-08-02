import { useEffect, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  getWritingArticle,
  type WritingBlock,
} from '../../data/writingArticles'

type WritingEditorProps = {
  articleId: string | null
  onClose: () => void
}

const ACCENT = '#d4f1bc'
const CHROME = '#ececec'

/**
 * Technical “pocket” text editor — slides up from the bottom-right.
 * Shows article JSON content (paragraphs + figures). Shared editing later.
 */
export default function WritingEditor({ articleId, onClose }: WritingEditorProps) {
  const reduceMotion = useReducedMotion()
  const article = articleId ? getWritingArticle(articleId) : null
  const panelRef = useRef<HTMLDivElement>(null)
  const [pageDimmed, setPageDimmed] = useState(false)

  useEffect(() => {
    if (!articleId) {
      setPageDimmed(false)
      return
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [articleId, onClose])

  useEffect(() => {
    if (article && panelRef.current) {
      const body = panelRef.current.querySelector('[data-editor-body]')
      body?.scrollTo({ top: 0 })
    }
  }, [article?.id])

  return (
    <AnimatePresence>
      {article ? (
        <>
          {/* Click-catcher over the page — closes editor + clears selection */}
          <motion.div
            key="page-dim"
            aria-hidden
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: pageDimmed ? 1 : 0 }}
            exit={reduceMotion ? undefined : { opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="pointer-events-auto fixed inset-0 z-[79] bg-white"
            onClick={onClose}
          />

          <motion.div
            key={article.id}
            ref={panelRef}
            role="dialog"
            aria-modal
            aria-label={`article editor — ${article.title}`}
            initial={reduceMotion ? false : { y: 36, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={reduceMotion ? undefined : { y: 28, opacity: 0 }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { type: 'spring', stiffness: 380, damping: 32 }
            }
            className="fixed inset-x-0 bottom-0 z-[80] flex h-[min(78dvh,calc(100dvh-env(safe-area-inset-bottom,0px)-1rem))] w-full flex-col overflow-hidden rounded-t-[10px] border border-black/15 bg-white shadow-[0_18px_50px_rgb(0_0_0/0.12)] lg:inset-x-auto lg:right-4 lg:bottom-[-16px] lg:h-[min(480px,calc(100dvh-5rem))] lg:w-[min(600px,calc(100vw-2rem))] lg:rounded-[10px]"
            style={{
              fontFamily: '"JetBrains Mono", ui-monospace, monospace',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <EditorChrome onClose={onClose} />
            <EditorToolbar
              pageDimmed={pageDimmed}
              onToggleDim={() => setPageDimmed((v) => !v)}
            />
            <EditorRuler />
            <div
              data-editor-body
              className="min-h-0 flex-1 overflow-y-auto px-4 py-4 text-[14px] leading-[1.6] text-black lg:px-5 lg:text-[12px] lg:leading-[1.55]"
            >
              <header className="mb-4 border-b border-black/10 pb-3">
                <p className="text-[10px] tracking-[0.08em] text-black/40 lowercase lg:text-[9px]">
                  {article.kind} · {article.year} · {article.id}.json
                </p>
                <h2 className="mt-1 text-[17px] font-medium lowercase tracking-tight lg:text-[15px]">
                  {article.title}
                </h2>
              </header>
              <ArticleBody blocks={article.blocks} />
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  )
}

function EditorChrome({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="flex h-9 shrink-0 items-center gap-2 border-b border-black/10 px-2.5 text-[9px] tracking-[0.04em] text-black/45 lowercase"
      style={{ backgroundColor: CHROME }}
    >
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          aria-label="close editor"
          onClick={onClose}
          className="flex size-3 items-center justify-center rounded-full border border-black/25 bg-[#ff5f57] p-0 hover:brightness-95"
        />
        <span className="size-3 rounded-full border border-black/25 bg-[#febc2e]" aria-hidden />
        <span className="size-3 rounded-full border border-black/25 bg-[#28c840]" aria-hidden />
      </div>
    </div>
  )
}

function EditorToolbar({
  pageDimmed,
  onToggleDim,
}: {
  pageDimmed: boolean
  onToggleDim: () => void
}) {
  return (
    <div className="hidden h-auto shrink-0 items-center gap-1.5 overflow-x-auto border-b border-black/10 bg-white px-2.5 py-2.5 text-[9px] text-black/55 lg:flex">
      <ToolGroup>
        <ToolBtn label="font">jetbrains mono</ToolBtn>
        <ToolBtn label="weight">regular</ToolBtn>
        <ToolBtn label="size">12</ToolBtn>
      </ToolGroup>
      <ToolGroup>
        <ToolBtn label="highlight">
          <span className="inline-block size-2.5 rounded-[2px]" style={{ background: ACCENT }} />
        </ToolBtn>
        <ToolBtn label="strikethrough">
          <span className="line-through">B</span>
        </ToolBtn>
      </ToolGroup>
      <ToolGroup>
        <ToolBtn label="align left">≡</ToolBtn>
        <ToolBtn label="align center">≣</ToolBtn>
        <ToolBtn label="align right">≡</ToolBtn>
      </ToolGroup>
      <ToolGroup>
        <ToolBtn label="zoom">140%</ToolBtn>
      </ToolGroup>
      <ToolGroup>
        <ToolBtn
          label={pageDimmed ? 'show page' : 'dim page'}
          active={pageDimmed}
          onClick={onToggleDim}
        >
          <BrightnessIcon />
        </ToolBtn>
      </ToolGroup>
    </div>
  )
}

function BrightnessIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden
    >
      <circle cx="6" cy="6" r="2.15" stroke="currentColor" strokeWidth="1.15" />
      <path
        d="M6 1.1v1.3M6 9.6v1.3M1.1 6h1.3M9.6 6h1.3M2.55 2.55l.92.92M8.53 8.53l.92.92M9.45 2.55l-.92.92M3.47 8.53l-.92.92"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinecap="round"
      />
    </svg>
  )
}

function ToolGroup({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-7 items-stretch overflow-hidden rounded-md border border-black/10 bg-[#f7f7f7]">
      {children}
    </div>
  )
}

function ToolBtn({
  children,
  label,
  active = false,
  onClick,
}: {
  children: ReactNode
  label: string
  active?: boolean
  onClick?: () => void
}) {
  const className = [
    'inline-flex h-full min-w-7 items-center justify-center border-l border-black/10 px-2 first:border-l-0',
    active ? 'bg-black text-white' : 'bg-transparent',
  ].join(' ')

  if (onClick) {
    return (
      <button
        type="button"
        aria-label={label}
        aria-pressed={active}
        onClick={onClick}
        className={`${className} cursor-pointer ${
          active ? 'hover:text-white' : 'text-black/70 hover:text-black'
        }`}
      >
        {children}
      </button>
    )
  }

  return (
    <span aria-label={label} className={className}>
      {children}
    </span>
  )
}

function EditorRuler() {
  return (
    <div
      className="flex h-5 shrink-0 items-end gap-0 overflow-hidden border-b border-black/10 px-5 text-[7px] tabular-nums text-black/25"
      aria-hidden
    >
      {Array.from({ length: 20 }, (_, i) => (
        <span key={i} className="relative w-[5%] border-l border-black/15 pl-0.5">
          {i}
        </span>
      ))}
    </div>
  )
}

function ArticleBody({ blocks }: { blocks: WritingBlock[] }) {
  return (
    <div className="space-y-3 lowercase">
      {blocks.map((block, i) => {
        if (block.type === 'p') {
          return (
            <p key={`p-${i}`} className="text-pretty">
              {block.text}
            </p>
          )
        }
        return (
          <figure key={`img-${i}`} className="my-4">
            {block.url ? (
              <img
                src={block.url}
                alt={block.alt}
                className="max-h-48 w-auto max-w-full border border-black/10 object-contain"
              />
            ) : (
              <div className="flex h-28 items-center justify-center border border-dashed border-black/20 bg-[#f4f4f4] text-[9px] text-black/35">
                missing {block.src}
              </div>
            )}
            {block.caption ? (
              <figcaption className="mt-1.5 text-[9px] tracking-[0.04em] text-black/40">
                {block.caption}
              </figcaption>
            ) : null}
          </figure>
        )
      })}
    </div>
  )
}
