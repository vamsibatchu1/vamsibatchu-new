type StudioPlateProps = {
  /** Image URLs for icon slots (left → right). */
  icons?: string[]
}

export default function StudioPlate({ icons = [] }: StudioPlateProps) {
  return (
    <div className="mb-3 flex w-full items-center justify-between gap-3 border border-black bg-white px-2.5 py-2 text-black">
      <div className="min-w-0 flex-1 text-[9px] leading-[1.35] uppercase tracking-[0.04em] sm:text-[10px]">
        <p>vamsi batchu | studio</p>
        <p>product design • build</p>
        <p>ai • interactive media</p>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-2.5" aria-hidden>
        {icons.map((src, i) => (
          <img
            key={`${src}-${i}`}
            src={src}
            alt=""
            className="size-5 object-contain sm:size-6"
            draggable={false}
          />
        ))}
      </div>
    </div>
  )
}
