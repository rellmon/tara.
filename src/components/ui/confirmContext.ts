import { createContext } from 'react'

export interface ConfirmOptions {
  title: string
  message: string
  confirmLabel?: string // default: "Confirm"
  cancelLabel?: string // default: "Cancel"
  destructive?: boolean // red confirm button
}

// Resolves to true when the user confirms, false when they cancel.
export type ConfirmFn = (options: ConfirmOptions) => Promise<boolean>

export const ConfirmContext = createContext<ConfirmFn | null>(null)