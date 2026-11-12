import { useEffect, useId, useRef } from 'react'
import Button from './Button'
import type { ConfirmOptions } from './confirmContext'

interface ConfirmDialogProps {
  options: ConfirmOptions
  onConfirm: () => void
  onCancel: () => void
}

function ConfirmDialog({ options, onConfirm, onCancel }: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  const messageId = useId()

  useEffect(() => {
    const dialog = dialogRef.current
    if (dialog && !dialog.open) dialog.showModal()

    // Start on the safe choice, so Enter never confirms by accident.
    dialog?.querySelector<HTMLElement>('[data-autofocus]')?.focus()
  }, [])

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-describedby={messageId}
      onCancel={(event) => {
        // Esc: let our own state close the dialog.
        event.preventDefault()
        onCancel()
      }}
      onClick={(event) => {
        // A click on the dark backdrop lands on the dialog element itself.
        if (event.target === event.currentTarget) onCancel()
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl border border-line bg-white p-0 text-charcoal shadow-xl backdrop:bg-charcoal/40"
    >
      <div className="p-6">
        <h2
          id={titleId}
          className="font-display text-xl font-bold text-brand-900"
        >
          {options.title}
        </h2>
        <p id={messageId} className="mt-2 break-words text-sm text-muted">
          {options.message}
        </p>

        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            data-autofocus
          >
            {options.cancelLabel ?? 'Cancel'}
          </Button>
          <Button
            type="button"
            variant={options.destructive ? 'danger' : 'primary'}
            onClick={onConfirm}
          >
            {options.confirmLabel ?? 'Confirm'}
          </Button>
        </div>
      </div>
    </dialog>
  )
}

export default ConfirmDialog