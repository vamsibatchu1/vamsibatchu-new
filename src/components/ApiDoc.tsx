import { useCallback, useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import Mark from './Mark'
import StudioPlate from './StudioPlate'
import landingSym1 from '../assets/landing-sym-1.svg'
import landingSym2 from '../assets/landing-sym-2.svg'
import landingSym3 from '../assets/landing-sym-3.svg'

const GREETING = 'hi, i am vamsi batchu.'
const ROLE = 'member of technical staff at google deepmind'
const TYPE_MS = 32
const PAUSE_MS = 280

const holes = Array.from({ length: 22 }, (_, i) => i)

function BlockCursor({ blinking }: { blinking?: boolean }) {
  return (
    <span
      className={`ml-1 inline-block h-[0.9em] w-[0.5em] translate-y-[0.08em] bg-black align-baseline ${
        blinking ? 'animate-pulse' : ''
      }`}
      aria-hidden
    />
  )
}

function useTypewriter(text: string, active: boolean, onDone?: () => void) {
  const [typed, setTyped] = useState('')

  useEffect(() => {
    if (!active) return
    setTyped('')
    let i = 0
    const id = window.setInterval(() => {
      i += 1
      setTyped(text.slice(0, i))
      if (i >= text.length) {
        window.clearInterval(id)
        onDone?.()
      }
    }, TYPE_MS)
    return () => window.clearInterval(id)
  }, [active, text, onDone])

  return typed
}

type Phase = 'idle' | 'greeting' | 'role' | 'details' | 'ready'

export default function ApiDoc({
  onEnter,
  onReady,
}: {
  onEnter: () => void
  onReady?: () => void
}) {
  const reduceMotion = useReducedMotion()
  const [phase, setPhase] = useState<Phase>('idle')

  const startTyping = useCallback(() => {
    setPhase((prev) => (prev === 'idle' ? 'greeting' : prev))
  }, [])

  const onGreetingDone = useCallback(() => {
    window.setTimeout(() => setPhase('role'), PAUSE_MS)
  }, [])

  const onRoleDone = useCallback(() => {
    window.setTimeout(() => setPhase('details'), 220)
  }, [])

  useEffect(() => {
    if (phase !== 'details') return
    const id = window.setTimeout(() => setPhase('ready'), 450)
    return () => window.clearTimeout(id)
  }, [phase])

  useEffect(() => {
    if (phase === 'ready') onReady?.()
  }, [phase, onReady])

  useEffect(() => {
    if (reduceMotion) startTyping()
  }, [reduceMotion, startTyping])

  const greeting = useTypewriter(
    GREETING,
    phase === 'greeting',
    onGreetingDone,
  )
  const role = useTypewriter(ROLE, phase === 'role', onRoleDone)

  const greetingText =
    phase === 'idle' || phase === 'greeting' ? greeting : GREETING
  const roleText =
    phase === 'idle' || phase === 'greeting'
      ? ''
      : phase === 'role'
        ? role
        : ROLE
  const showGreetingCursor = phase === 'greeting'
  const showRoleCursor =
    phase === 'role' || phase === 'details' || phase === 'ready'
  const showDetails = phase === 'details' || phase === 'ready'
  const showEnter = phase === 'ready'

  return (
    <motion.article
      className="api-doc relative flex w-full flex-col overflow-hidden bg-[#f3eee0] text-[11px] leading-relaxed text-black sm:text-[11px]"
      style={{ fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}
      aria-label="API documentation card"
      initial={reduceMotion ? false : { y: '60vh', opacity: 0 }}
      animate={{ y: reduceMotion ? 0 : '8vh', opacity: 1 }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : { type: 'spring', stiffness: 120, damping: 18, mass: 0.9 }
      }
      onAnimationComplete={startTyping}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.55\'/%3E%3C/svg%3E")',
        }}
        aria-hidden
      />

      <div className="relative flex bg-[#f3eee0]">
        <div
          className="relative flex w-6 shrink-0 flex-col items-center justify-between border-r border-dashed border-black/50 py-3 sm:w-7"
          aria-hidden
        >
          {holes.map((i) => (
            <span
              key={i}
              className="size-1.5 rounded-full border border-black/70 bg-[#f3eee0] sm:size-2"
            />
          ))}
        </div>

        <div className="flex min-w-0 flex-1 flex-col px-3 pb-8 pt-3 uppercase sm:px-4 sm:pb-10 sm:pt-4">
          <StudioPlate icons={[landingSym1, landingSym2, landingSym3]} />

          <div className="mb-1">
            <h2 className="font-semibold tracking-wide">load profile</h2>
            <div className="mt-1 border-t-2 border-double border-black" />
          </div>

          <p className="mt-2 normal-case tracking-tight">
            [GET] /v1/human/vamsi/intro
          </p>
          <div className="mt-1 border-t border-black" />

          <div className="mt-3 space-y-1.5 normal-case" aria-live="polite">
            <p className="min-h-[1.25em] text-[13px] leading-snug sm:text-[13px]">
              {greetingText}
              {showGreetingCursor ? <BlockCursor /> : null}
            </p>
            <p className="min-h-[1.25em] text-[13px] leading-snug sm:text-[13px]">
              {roleText}
              {showRoleCursor ? (
                <BlockCursor blinking={phase === 'ready'} />
              ) : null}
            </p>
          </div>

          <div
            className={`mt-3 transition-opacity duration-500 ${
              showDetails ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="border-t border-black pt-3">
              <div className="grid grid-cols-[4.5rem_1fr] gap-y-0.5 normal-case sm:grid-cols-[5.5rem_1fr]">
                <span>RESPONSE</span>
                <span>JSON</span>
                <span>STATUS</span>
                <span>200 OK</span>
                <span className="self-start">DATA</span>
                <pre className="overflow-x-auto whitespace-pre leading-relaxed">
                  {`{
  "id": "vb_tinkerer",
  "practice": ["design", "build", "play"],
  "materials": ["models", "code", "image", "sound", "motion"],
  "status": "making"
}`}
                </pre>
              </div>
            </div>

            <div className="my-3 border-t border-black" />

            <div className="space-y-2 normal-case leading-[1.65]">
              <p>
                I design and build product experiences with{' '}
                <Mark tone="black">AI</Mark>,{' '}
                <Mark tone="black">interaction</Mark>, and emerging forms of
                media. My practice moves between craft and systems, prototypes
                and polished products, utility and play.
              </p>
              <p>The tools keep changing. Curiosity is the through-line.</p>
            </div>
          </div>

          <div className="mt-6 border-t border-black pt-3">
            <button
              type="button"
              onClick={onEnter}
              className={`mb-4 self-start text-left normal-case transition-opacity duration-500 ${
                showEnter
                  ? 'opacity-100'
                  : 'pointer-events-none opacity-0'
              }`}
            >
              <Mark tone="green">press enter</Mark>
              <span className="ml-1">→ enter the site</span>
              <span className="mt-1 block text-[0.65rem] text-black/50 sm:hidden">
                or tap here
              </span>
            </button>

            <footer className="flex items-end justify-between gap-2 normal-case">
              <span className="uppercase">earth</span>
              <span className="italic">*Design as a Service™*</span>
              <span>Page 001</span>
            </footer>
          </div>
        </div>
      </div>
    </motion.article>
  )
}
