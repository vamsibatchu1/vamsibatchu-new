export type ColorBar = {
  color: string
  /** Width in px — varies like a barcode stripe. */
  width: number
}

export type FeatureCardData = {
  id: string
  title: string
  subtitle: string
  body: string
  /** Signature barcode next to the title — unique per card. */
  barcode: ColorBar[]
  /** Optional thumbnail image URL; grey placeholder if omitted. */
  thumbnailSrc?: string
  thumbnailAlt?: string
}

function SignatureBarcode({ bars }: { bars: ColorBar[] }) {
  return (
    <div className="flex shrink-0 items-center gap-[3px]" aria-hidden>
      {bars.map((bar, i) => (
        <span
          key={`${bar.color}-${i}`}
          className="h-7 sm:h-8"
          style={{ width: bar.width, backgroundColor: bar.color }}
        />
      ))}
    </div>
  )
}

function FeatureCard({ card }: { card: FeatureCardData }) {
  return (
    <article className="flex h-full min-w-0 flex-1 flex-col gap-3.5">
      <div className="aspect-video w-full shrink-0 overflow-hidden bg-[#efeeec]">
        {card.thumbnailSrc ? (
          <img
            src={card.thumbnailSrc}
            alt={card.thumbnailAlt ?? ''}
            className="size-full object-cover"
          />
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-[1.75rem] font-bold leading-[0.97] tracking-tight text-black sm:text-[2rem] lg:text-[2.25rem]">
          {card.title}
        </h2>
        <SignatureBarcode bars={card.barcode} />
      </div>

      <p className="text-sm uppercase leading-[0.97] tracking-tight text-[#6e6e6e] sm:text-[0.95rem] lg:text-[1.05rem]">
        {card.subtitle}
      </p>

      <div className="h-px w-full shrink-0 bg-[#d0d0d0]" />

      <p
        className="flex-1 text-justify text-sm leading-[1.15] tracking-tight text-[#6e6e6e] sm:text-base lg:text-lg"
        style={{ fontFamily: '"Reddit Sans", sans-serif' }}
      >
        {card.body}
      </p>

      <div className="h-px w-full shrink-0 bg-[#d0d0d0]" />
    </article>
  )
}

type FeatureCardRowProps = {
  cards: FeatureCardData[]
}

/** Equal-height cards in a row — works for 1, 2, 3, or more. */
export default function FeatureCardRow({ cards }: FeatureCardRowProps) {
  if (cards.length === 0) return null

  return (
    <div className="flex flex-col gap-10 lg:flex-row lg:items-stretch lg:gap-10">
      {cards.map((card) => (
        <FeatureCard key={card.id} card={card} />
      ))}
    </div>
  )
}
