import { useCallback, useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import landingGif from '../assets/landing.gif'
import ApiDoc from '../components/ApiDoc'

export default function Landing() {
  const navigate = useNavigate()
  const reduceMotion = useReducedMotion()
  const [exiting, setExiting] = useState(false)
  const [ready, setReady] = useState(false)

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

  return (
    <div
      className={`relative flex min-h-dvh items-end justify-center overflow-hidden bg-white px-4 pb-10 text-black lg:px-10 lg:pb-14 ${
        exiting ? 'opacity-0' : 'opacity-100'
      } transition-opacity duration-300`}
    >
      <div className="relative z-10 flex w-full max-w-6xl flex-col items-center gap-4 lg:flex-row lg:items-end lg:justify-center lg:gap-0">
        <motion.img
          src={landingGif}
          alt="vamsi batchu with a macaw on his shoulder"
          className="relative z-0 h-auto w-full max-w-xl origin-bottom select-none object-contain lg:-mr-10 lg:max-w-[34rem]"
          width={800}
          height={447}
          draggable={false}
          initial={
            reduceMotion ? false : { y: '80%', opacity: 0, rotate: -5 }
          }
          animate={{
            y: 'calc(4% + 64px)',
            opacity: 1,
            rotate: -4,
          }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : {
                  type: 'spring',
                  stiffness: 110,
                  damping: 16,
                  mass: 0.95,
                  delay: 0.05,
                }
          }
        />

        <div className="relative z-0 w-full max-w-md lg:max-w-lg">
          <ApiDoc onEnter={enter} onReady={() => setReady(true)} />
        </div>
      </div>
    </div>
  )
}
