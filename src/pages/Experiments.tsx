import BrowserField from '../features/experiments/BrowserField'
import { shellBleedX } from '../components/shellLayout'

export default function Experiments() {
  return (
    <section className="lowercase">
      <div className={`relative ${shellBleedX}`}>
        <BrowserField />
      </div>
    </section>
  )
}
