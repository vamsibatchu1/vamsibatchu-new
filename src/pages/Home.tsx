import CreativeTextRow from '../features/home/CreativeTextRow'
import { creativeFlow } from '../features/home/creativeFlow'
import {
  IndexGallery,
  homeIndexGallery,
} from '../features/home/indexGalleryData'
import PracticeMap from '../features/practice-map/PracticeMap'
import { shellSectionY } from '../components/shellLayout'

const rowClass = shellSectionY

export default function Home() {
  return (
    <section
      className="flex flex-col"
      style={{ fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}
    >
      <div
        id="intro"
        className={`${rowClass} grid grid-cols-1 items-end gap-6 lg:grid-cols-[2fr_3fr] lg:gap-8`}
      >
        <p className="w-full max-w-full text-[22px] leading-[1.2] text-black lg:text-[28px] lg:leading-[1.1]">
          some call me a product designer. some call me a design engineer. i
          prefer tinkerer. a builder moving between art, interaction, systems,
          and code, looking for new ways to make technology feel useful,
          expressive, and alive.
        </p>
        <figure className="flex w-full min-w-0 flex-col gap-1.5">
          <PracticeMap
            variant="teaser"
            canvasClassName="h-[min(48dvh,380px)] lg:h-[min(52dvh,460px)]"
          />
          <figcaption className="px-0.5 text-[9px] lowercase leading-tight tracking-[0.06em] text-black/65 lg:text-[10px]">
            fig. 01 — a practice without fixed edges
          </figcaption>
        </figure>
      </div>

      <div id="creative-text" className={rowClass}>
        <CreativeTextRow flow={creativeFlow} />
      </div>

      <div id="gallery" className={rowClass}>
        <IndexGallery cells={homeIndexGallery} />
      </div>
    </section>
  )
}
