import { useContext } from 'react'
import { ConfirmContext } from './confirmContext'
import type { ConfirmFn } from './confirmContext'

export function useConfirm(): ConfirmFn {
  const confirm = useContext(ConfirmContext)

  if (!confirm) {
    throw new Error('useConfirm must be used inside <ConfirmProvider>.')
  }

  return confirm
}