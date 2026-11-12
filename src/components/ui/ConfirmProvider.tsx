import { useCallback, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import ConfirmDialog from './ConfirmDialog'
import { ConfirmContext } from './confirmContext'
import type { ConfirmFn, ConfirmOptions } from './confirmContext'

function ConfirmProvider({ children }: { children: ReactNode }) {
  const [options, setOptions] = useState<ConfirmOptions | null>(null)
  const resolveRef = useRef<((result: boolean) => void) | null>(null)
  const triggerRef = useRef<HTMLElement | null>(null)

  const confirm = useCallback<ConfirmFn>((nextOptions) => {
    if (resolveRef.current) {
      // A dialog is already open: treat the old one as cancelled.
      resolveRef.current(false)
    } else {
      // Remember what had focus, to give it back afterwards.
      triggerRef.current =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null
    }

    return new Promise<boolean>((resolve) => {
      resolveRef.current = resolve
      setOptions(nextOptions)
    })
  }, [])

  function settle(result: boolean) {
    resolveRef.current?.(result)
    resolveRef.current = null
    setOptions(null)

    const trigger = triggerRef.current
    triggerRef.current = null

    // Wait a frame for the dialog to leave, then restore focus if the button
    // that opened it still exists (a deleted item's button won't).
    requestAnimationFrame(() => {
      if (trigger?.isConnected) trigger.focus()
    })
  }

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {options && (
        <ConfirmDialog
          options={options}
          onConfirm={() => settle(true)}
          onCancel={() => settle(false)}
        />
      )}
    </ConfirmContext.Provider>
  )
}

export default ConfirmProvider