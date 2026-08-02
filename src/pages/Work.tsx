import WorkCard from '../features/work/WorkCard'
import { shellSectionY } from '../components/shellLayout'

export default function Work() {
  return (
    <section
      className={`flex flex-col lowercase text-black ${shellSectionY}`}
      style={{ fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}
      aria-label="Work"
    >
      <WorkCard />
    </section>
  )
}
