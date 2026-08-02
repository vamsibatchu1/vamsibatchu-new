import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

type ShellUiValue = {
  /** True when a full-focus overlay (e.g. writing editor) should hide mobile chrome. */
  overlayOpen: boolean
  setOverlayOpen: (open: boolean) => void
}

const ShellUiContext = createContext<ShellUiValue | null>(null)

export function ShellUiProvider({ children }: { children: ReactNode }) {
  const [overlayOpen, setOverlayOpenState] = useState(false)
  const setOverlayOpen = useCallback((open: boolean) => {
    setOverlayOpenState(open)
  }, [])
  const value = useMemo(
    () => ({ overlayOpen, setOverlayOpen }),
    [overlayOpen, setOverlayOpen],
  )
  return (
    <ShellUiContext.Provider value={value}>{children}</ShellUiContext.Provider>
  )
}

export function useShellUi() {
  const ctx = useContext(ShellUiContext)
  if (!ctx) {
    throw new Error('useShellUi must be used within ShellUiProvider')
  }
  return ctx
}
