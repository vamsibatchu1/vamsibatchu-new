import { useEffect } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useShellUi } from '../../components/ShellUiContext'
import ReceiptTicket from './ReceiptTicket'
import { useVisitReceipt } from './VisitReceiptContext'

/**
 * Bottom-right receipt sheet — ticket only, no dialog chrome.
 */
export default function ReceiptDock() {
  const { snapshot, open, setOpen } = useVisitReceipt()
  const { overlayOpen } = useShellUi()
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, setOpen])

  if (overlayOpen) return null

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            key="receipt-backdrop"
            type="button"
            aria-label="close receipt"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-auto fixed inset-0 z-[84] cursor-default bg-transparent"
            onClick={() => setOpen(false)}
          />
          <motion.div
            key="receipt-sheet"
            role="complementary"
            aria-label="portfolio receipt"
            initial={reduceMotion ? false : { y: 48, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={reduceMotion ? undefined : { y: 36, opacity: 0 }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { type: 'spring', stiffness: 380, damping: 32 }
            }
            className="fixed bottom-0 right-8 z-[85] max-h-[min(88dvh,100dvh)] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {snapshot ? <ReceiptTicket snapshot={snapshot} /> : null}
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  )
}
