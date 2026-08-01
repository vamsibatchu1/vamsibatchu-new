import ScrollCube from '../components/ScrollCube'

export default function About() {
  return (
    <>
      {/* Keeps layout from collapsing under the fixed cube */}
      <div className="pointer-events-none h-[50vh]" aria-hidden />

      <ScrollCube background="#ffffff" color="#000000">
        <p>
          Vamsi Batchu is a product designer and design builder working across
          AI, interaction, and experimental interfaces. He is a member of
          technical staff at{' '}
          <a
            href="https://deepmind.google"
            target="_blank"
            rel="noreferrer"
          >
            Google DeepMind
          </a>
          , where craft meets systems at the edge of what interfaces can do.
        </p>
        <p>
          <br />
          <br />
          His practice sits between prototypes and polished product experiences
          — pacing, type, and touch tested on small surfaces before they grow
          into things people return to without thinking twice. Studio
          experiments and commissions live alongside shipping work; the
          through-line is curiosity.
        </p>
        <p>
          <br />
          <br />
          Previously he has built and designed across consumer and research
          surfaces, always chasing the moment where a system becomes legible —
          and a little bit alive.
        </p>
        <p>
          <br />
          <br />
          Studio
          <br />
          <a href="mailto:hello@vamsibatchu.com">hello@vamsibatchu.com</a>
          <br />
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
          >
            @vamsibatchu
          </a>
        </p>
      </ScrollCube>
    </>
  )
}
