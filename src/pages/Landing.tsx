import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import landingGif from '../assets/landing/landing.gif'
import ApiDoc from '../components/ApiDoc'

/** One full loop of `landing.gif` (11 frames × delays). */
const GIF_LOOP_MS = 2200
const GIF_FADE_MS = 420

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(max-width: 1023px)').matches
      : false,
  )

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)')
    const onChange = () => setIsMobile(mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return isMobile
}

type MobileBeat = 'gif' | 'fading' | 'doc'

export default function Landing() {
  const navigate = useNavigate()
  const reduceMotion = useReducedMotion()
  const isMobile = useIsMobile()
  const sequenced = isMobile && !reduceMotion

  const [exiting, setExiting] = useState(false)
  const [ready, setReady] = useState(false)
  const [beat, setBeat] = useState<MobileBeat>(() =>
    typeof window !== 'undefined' &&
    window.matchMedia('(max-width: 1023px)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? 'gif'
      : 'doc',
  )
  const loopStarted = useRef(false)

  useEffect(() => {
    if (!sequenced) {
      setBeat('doc')
      return
    }
    setBeat((prev) => (prev === 'doc' ? 'gif' : prev))
    loopStarted.current = false
  }, [sequenced])

  useEffect(() => {
    if (beat !== 'fading') return
    const id = window.setTimeout(() => setBeat('doc'), GIF_FADE_MS)
    return () => window.clearTimeout(id)
  }, [beat])

  const onGifLanded = useCallback(() => {
    if (!sequenced || loopStarted.current) return
    loopStarted.current = true
    window.setTimeout(() => setBeat('fading'), GIF_LOOP_MS)
  }, [sequenced])

  const enter = useCallback(() => {
    if (!ready) return
    setExiting((prev) => {
      if (prev) return prev
      window.setTimeout(() => navigate('/home'), 320)
      return true
    })
  }, [navigate, ready])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter') enter()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [enter])

  const showDoc = !sequenced || beat === 'doc'
  const gifVisible = !sequenced || beat === 'gif' || beat === 'fading'

  return (
    <div
      className={`relative flex min-h-dvh justify-center overflow-hidden bg-white px-4 pb-10 text-black transition-opacity duration-300 lg:px-10 lg:pb-14 ${
        sequenced && beat !== 'doc' ? 'items-center' : 'items-end'
      } ${exiting ? 'opacity-0' : 'opacity-100'}`}
    >
      <div className="relative z-10 flex w-full max-w-6xl flex-col items-center gap-4 lg:flex-row lg:items-end lg:justify-center lg:gap-0">
        {gifVisible ? (
          <motion.img
            src={landingGif}
            alt="vamsi batchu with a macaw on his shoulder"
            className="relative z-0 h-auto w-[calc(100vw-80px)] max-w-none origin-bottom select-none object-contain lg:-mr-10 lg:w-full lg:max-w-[34rem]"
            width={800}
            height={447}
            draggable={false}
            initial={
              reduceMotion
                ? false
                : {
                    y: '80%',
                    opacity: 0,
                    rotate: isMobile ? 0 : -5,
                  }
            }
            animate={{
              y: sequenced ? 0 : 'calc(4% + 64px)',
              opacity: sequenced && beat === 'fading' ? 0 : 1,
              rotate: isMobile ? 0 : -4,
            }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : beat === 'fading'
                  ? {
                      opacity: {
                        duration: GIF_FADE_MS / 1000,
                        ease: 'easeInOut',
                      },
                    }
                  : {
                      type: 'spring',
                      stiffness: 110,
                      damping: 16,
                      mass: 0.95,
                      delay: 0.05,
                    }
            }
            onAnimationComplete={onGifLanded}
          />
        ) : null}

        {showDoc ? (
          <div className="relative z-0 w-[calc(100vw-48px)] max-w-md lg:w-full lg:max-w-lg">
            <ApiDoc onEnter={enter} onReady={() => setReady(true)} />
          </div>
        ) : null}
      </div>
    </div>
  )
}
