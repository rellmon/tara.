import { useState } from 'react'
import type { FormEvent } from 'react'
import { format } from 'date-fns'
import Button from '../ui/Button'
import { BUDGET_CATEGORIES, BUDGET_CATEGORY_LABELS } from '../../types/budget'
import type { BudgetCategory } from '../../types/budget'
import type { Participant } from '../../types/participant'
import { formatCurrencyExact } from '../../utils/format'
import { validateExpense } from '../../utils/validateExpense'
import type { ExpenseErrors } from '../../utils/validateExpense'

export interface ExpenseFormValues {
  name: string
  amount: number
  category: BudgetCategory
  date: string
  paidById: string
  sharedByIds: string[]
  customShares?: Record<string, number>
  notes: string
}

type SplitMode = 'equal' | 'custom'

interface ExpenseFormProps {
  participants: Participant[] // the trip's participants only
  idPrefix: string
  onSubmit: (values: ExpenseFormValues) => void
  initialValues?: ExpenseFormValues
  submitLabel?: string
  onCancel?: () => void
}

const inputClasses =
  'mt-1 w-full rounded-xl border border-line bg-white px-4 py-2.5 text-charcoal focus-visible:outline-2 focus-visible:outline-brand-600'

const chipClasses =
  'flex min-h-10 cursor-pointer items-center gap-2 rounded-full border border-line px-4 py-1.5 text-sm has-[:checked]:border-brand-600 has-[:checked]:bg-brand-50'

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null
  return (
    <p id={id} className="mt-1 text-sm text-red-700">
      {message}
    </p>
  )
}

function ExpenseForm({
  participants,
  idPrefix,
  onSubmit,
  initialValues,
  submitLabel = 'Add expense',
  onCancel,
}: ExpenseFormProps) {
  const participantIds = participants.map((participant) => participant.id)

  const [name, setName] = useState(initialValues?.name ?? '')
  const [amount, setAmount] = useState(
    initialValues ? String(initialValues.amount) : '',
  )
  const [category, setCategory] = useState<BudgetCategory>(
    initialValues?.category ?? 'food',
  )
  const [date, setDate] = useState(
    initialValues?.date ?? format(new Date(), 'yyyy-MM-dd'),
  )
  const [paidById, setPaidById] = useState(initialValues?.paidById ?? '')
  // People NOT sharing an equal split. Anyone not listed here shares it,
  // so travelers added later are included by default.
  const [excludedIds, setExcludedIds] = useState<string[]>(
    initialValues
      ? participantIds.filter((id) => !initialValues.sharedByIds.includes(id))
      : [],
  )
  const [splitMode, setSplitMode] = useState<SplitMode>(
    initialValues?.customShares ? 'custom' : 'equal',
  )
  // Amounts typed for a custom split, keyed by participant id.
  const [customAmounts, setCustomAmounts] = useState<Record<string, string>>(
    initialValues?.customShares
      ? Object.fromEntries(
          Object.entries(initialValues.customShares).map(([id, value]) => [
            id,
            String(value),
          ]),
        )
      : {},
  )
  const [notes, setNotes] = useState(initialValues?.notes ?? '')
  const [errors, setErrors] = useState<ExpenseErrors>({})

  // If nothing valid is chosen yet, the first traveler is the payer.
  const payerId = participantIds.includes(paidById)
    ? paidById
    : (participantIds[0] ?? '')
  const equalSharedByIds = participantIds.filter(
    (id) => !excludedIds.includes(id),
  )

  // People with a non-blank amount share a custom split.
  const customShares: Record<string, number> = {}
  for (const id of participantIds) {
    const raw = customAmounts[id]
    if (raw !== undefined && raw.trim() !== '') {
      customShares[id] = Number(raw)
    }
  }

  const amountNumber = Number(amount)
  const totalCentavos =
    amount.trim() !== '' && Number.isFinite(amountNumber) && amountNumber > 0
      ? Math.round(amountNumber * 100)
      : null
  const assignedCentavos = Object.values(customShares).reduce(
    (sum, value) => (Number.isFinite(value) ? sum + Math.round(value * 100) : sum),
    0,
  )
  const leftCentavos =
    totalCentavos === null ? null : totalCentavos - assignedCentavos

  function toggleShared(id: string) {
    setExcludedIds((previous) =>
      previous.includes(id)
        ? previous.filter((excluded) => excluded !== id)
        : [...previous, id],
    )
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const isCustom = splitMode === 'custom'
    const values = {
      name: name.trim(),
      amount: amount === '' ? NaN : Number(amount),
      date,
      paidById: payerId,
      sharedByIds: isCustom ? Object.keys(customShares) : equalSharedByIds,
      customShares: isCustom ? customShares : undefined,
    }

    const validationErrors = validateExpense(values, participantIds)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    onSubmit({ ...values, category, notes: notes.trim() })

    // The add form keeps date, category, payer, and split mode for quick
    // repeated entry.
    if (!initialValues) {
      setName('')
      setAmount('')
      setNotes('')
      setExcludedIds([])
      setCustomAmounts({})
    }
  }

  const splitError = errors.customShares ?? errors.sharedByIds

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-4 rounded-2xl border border-line bg-white p-5"
    >
      <div>
        <label htmlFor={`${idPrefix}-name`} className="text-sm font-medium">
          What was it for?
        </label>
        <input
          id={`${idPrefix}-name`}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Gasoline"
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={errors.name ? `${idPrefix}-name-error` : undefined}
          className={inputClasses}
        />
        <FieldError id={`${idPrefix}-name-error`} message={errors.name} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`${idPrefix}-amount`} className="text-sm font-medium">
            Amount (₱)
          </label>
          <input
            id={`${idPrefix}-amount`}
            type="number"
            min="0"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="1200"
            aria-invalid={errors.amount ? true : undefined}
            aria-describedby={
              errors.amount ? `${idPrefix}-amount-error` : undefined
            }
            className={inputClasses}
          />
          <FieldError id={`${idPrefix}-amount-error`} message={errors.amount} />
        </div>
        <div>
          <label
            htmlFor={`${idPrefix}-category`}
            className="text-sm font-medium"
          >
            Category
          </label>
          <select
            id={`${idPrefix}-category`}
            value={category}
            onChange={(e) => setCategory(e.target.value as BudgetCategory)}
            className={inputClasses}
          >
            {BUDGET_CATEGORIES.map((item) => (
              <option key={item} value={item}>
                {BUDGET_CATEGORY_LABELS[item]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`${idPrefix}-date`} className="text-sm font-medium">
            Date
          </label>
          <input
            id={`${idPrefix}-date`}
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            aria-invalid={errors.date ? true : undefined}
            aria-describedby={
              errors.date ? `${idPrefix}-date-error` : undefined
            }
            className={inputClasses}
          />
          <FieldError id={`${idPrefix}-date-error`} message={errors.date} />
        </div>
        <div>
          <label htmlFor={`${idPrefix}-payer`} className="text-sm font-medium">
            Paid by
          </label>
          <select
            id={`${idPrefix}-payer`}
            value={payerId}
            onChange={(e) => setPaidById(e.target.value)}
            aria-invalid={errors.paidById ? true : undefined}
            aria-describedby={
              errors.paidById ? `${idPrefix}-payer-error` : undefined
            }
            className={inputClasses}
          >
            {participants.map((participant) => (
              <option key={participant.id} value={participant.id}>
                {participant.name}
              </option>
            ))}
          </select>
          <FieldError
            id={`${idPrefix}-payer-error`}
            message={errors.paidById}
          />
        </div>
      </div>

      <fieldset>
        <legend className="text-sm font-medium">How is it split?</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          <label className={chipClasses}>
            <input
              type="radio"
              name={`${idPrefix}-split`}
              checked={splitMode === 'equal'}
              onChange={() => setSplitMode('equal')}
              className="h-4 w-4 accent-brand-600"
            />
            Equally
          </label>
          <label className={chipClasses}>
            <input
              type="radio"
              name={`${idPrefix}-split`}
              checked={splitMode === 'custom'}
              onChange={() => setSplitMode('custom')}
              className="h-4 w-4 accent-brand-600"
            />
            Custom amounts
          </label>
        </div>
      </fieldset>

      {splitMode === 'equal' ? (
        <fieldset
          aria-describedby={splitError ? `${idPrefix}-split-error` : undefined}
        >
          <legend className="text-sm font-medium">Shared by</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {participants.map((participant) => (
              <label key={participant.id} className={chipClasses}>
                <input
                  type="checkbox"
                  checked={equalSharedByIds.includes(participant.id)}
                  onChange={() => toggleShared(participant.id)}
                  className="h-4 w-4 accent-brand-600"
                />
                {participant.name}
              </label>
            ))}
          </div>
          <FieldError id={`${idPrefix}-split-error`} message={splitError} />
        </fieldset>
      ) : (
        <fieldset
          aria-describedby={splitError ? `${idPrefix}-split-error` : undefined}
        >
          <legend className="text-sm font-medium">
            Each person's share (₱)
          </legend>
          <p className="mt-1 text-xs text-muted">
            Leave blank for anyone who isn't sharing.
          </p>
          <div className="mt-2 grid gap-3 sm:grid-cols-2">
            {participants.map((participant) => (
              <div key={participant.id}>
                <label
                  htmlFor={`${idPrefix}-custom-${participant.id}`}
                  className="text-sm text-muted"
                >
                  {participant.name}
                </label>
                <input
                  id={`${idPrefix}-custom-${participant.id}`}
                  type="number"
                  min="0"
                  step="0.01"
                  value={customAmounts[participant.id] ?? ''}
                  onChange={(e) =>
                    setCustomAmounts((previous) => ({
                      ...previous,
                      [participant.id]: e.target.value,
                    }))
                  }
                  placeholder="0.00"
                  className={inputClasses}
                />
              </div>
            ))}
          </div>
          <p
            aria-live="polite"
            className={`mt-3 text-sm ${
              leftCentavos === 0 ? 'text-brand-700' : 'text-muted'
            }`}
          >
            {leftCentavos === null
              ? 'Enter the amount above to check the total.'
              : leftCentavos === 0
                ? `All ${formatCurrencyExact(totalCentavos! / 100)} is assigned.`
                : leftCentavos > 0
                  ? `${formatCurrencyExact(assignedCentavos / 100)} of ${formatCurrencyExact(totalCentavos! / 100)} assigned. ${formatCurrencyExact(leftCentavos / 100)} left.`
                  : `Over by ${formatCurrencyExact(Math.abs(leftCentavos) / 100)}.`}
          </p>
          <FieldError id={`${idPrefix}-split-error`} message={splitError} />
        </fieldset>
      )}

      <div>
        <label htmlFor={`${idPrefix}-notes`} className="text-sm font-medium">
          Notes (optional)
        </label>
        <textarea
          id={`${idPrefix}-notes`}
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className={inputClasses}
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <Button type="submit">{submitLabel}</Button>
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}

export default ExpenseForm