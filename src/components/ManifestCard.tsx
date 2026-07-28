import landingSym1 from '../assets/landing-sym-1.svg'

export default function ManifestCard() {
  return (
    <aside
      className="flex h-full w-full flex-col justify-between gap-10 bg-[#efeeec] p-5 text-black sm:gap-12 sm:p-6"
      style={{ fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}
      aria-label="Studio manifesto"
    >
      <header className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="text-2xl font-bold italic leading-none tracking-tight sm:text-3xl">
            BATCHU
          </span>
          <span
            className="text-lg leading-none tracking-wider sm:text-xl"
            style={{ fontFamily: '"Press Start 2P", monospace' }}
          >
            c.&nbsp;26
          </span>
        </div>
        <img
          src={landingSym1}
          alt=""
          className="mt-1 size-7 object-contain sm:size-8"
          draggable={false}
          aria-hidden
        />
      </header>

      <p className="text-[11px] uppercase leading-[1.75] tracking-[0.02em] sm:text-xs sm:leading-[1.8]">
        Inspired by rebellious makers and design legends, first chapter of
        Batchu Circa26 nods to a brilliant craft history while setting sights on
        awakening and encouraging a new cast of bold builders across AI,
        interaction, and experimental interfaces.
      </p>

      <footer className="flex items-end justify-between gap-4 text-[9px] uppercase leading-snug tracking-[0.04em] sm:text-[10px]">
        <div>
          <p>Batchu C.26</p>
          <p className="mt-0.5 font-medium normal-case tracking-normal">
            The best of then, now and next.
          </p>
        </div>
        <p className="shrink-0 text-right">Batchu c.26 S.01 • 2026</p>
      </footer>
    </aside>
  )
}
