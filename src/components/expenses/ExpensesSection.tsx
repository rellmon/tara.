import { useState } from 'react'
import type { FormEvent } from 'react'
import { format } from 'date-fns'
import Button from '../ui/Button'
import { BUDGET_CATEGORIES, BUDGET_CATEGORY_LABELS } from '../../types/budget'
import type { BudgetCategory } from '../../types/budget'
import type { Expense } from '../../types/expense'
import type { Participant } from '../../types/participant'
import type { Trip } from '../../types/trip'
import { formatCurrencyExact, formatShortDate } from '../../utils/format'
import { validateExpense } from '../../utils/validateExpense'
import type { ExpenseErrors } from '../../utils/validateExpense'

interface ExpensesSectionProps {
  trip: Trip
  expenses: Expense[]
  participants: Participant[]
  onAddExpense: (expense: Expense) => void
}

const inputClasses =
  'mt-1 w-full rounded-xl border border-line bg-white px-4 py-2.5 text-charcoal focus-visible:outline-2 focus-visible:outline-brand-600'

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null
  return (
    <p id={id} className="mt-1 text-sm text-red-700">
      {message}
    </p>
  )
}

function ExpensesSection({
  trip,
  expenses,
  participants,
  onAddExpense,
}: ExpensesSectionProps) {
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState<BudgetCategory>('food')
  const [date, setDate] = useState(() => format(new Date(), 'yyyy-MM-dd'))
  const [paidById, setPaidById] = useState('')
  // People NOT sharing this expense. Anyone not listed here shares it,
  // so travelers added later are included by default.
  const [excludedIds, setExcludedIds] = useState<string[]>([])
  const [notes, setNotes] = useState('')
  const [errors, setErrors] = useState<ExpenseErrors>({})

  const tripParticipants = participants.filter(
    (participant) => participant.tripId === trip.id,
  )
  const participantIds = tripParticipants.map((participant) => participant.id)
  const participantName = (id: string) =>
    tripParticipants.find((participant) => participant.id === id)?.name ??
    'Unknown'

  // If nothing valid is chosen yet, the first traveler is the payer.
  const payerId = participantIds.includes(paidById)
    ? paidById
    : (participantIds[0] ?? '')
  const sharedByIds = participantIds.filter((id) => !excludedIds.includes(id))

  const tripExpenses = expenses
    .filter((expense) => expense.tripId === trip.id)
    .sort((a, b) => b.date.localeCompare(a.date))
  const totalSpent =
    tripExpenses.reduce((sum, expense) => sum + Math.round(expense.amount * 100), 0) /
    100

  function toggleShared(id: string) {
    setExcludedIds((previous) =>
      previous.includes(id)
        ? previous.filter((excluded) => excluded !== id)
        : [...previous, id],
    )
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const values = {
      name: name.trim(),
      amount: amount === '' ? NaN : Number(amount),
      date,
      paidById: payerId,
      sharedByIds,
    }

    const validationErrors = validateExpense(values, participantIds)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    onAddExpense({
      id: crypto.randomUUID(),
      tripId: trip.id,
      name: values.name,
      amount: values.amount,
      category,
      date: values.date,
      paidById: values.paidById,
      sharedByIds: values.sharedByIds,
      notes: notes.trim(),
    })

    // Keep date, category, and payer for quick repeated entry.
    setName('')
    setAmount('')
    setNotes('')
    setExcludedIds([])
  }

  return (
    <section aria-labelledby="expenses-heading" className="mt-12">
      <h2
        id="expenses-heading"
        className="font-display text-2xl font-bold text-brand-900"
      >
        Expenses
      </h2>
      <p className="mt-1 text-sm text-muted">
        Money actually spent on this trip. This is a manual record, not a
        payment.
      </p>

      {tripParticipants.length === 0 ? (
        <p className="mt-4 rounded-2xl border border-dashed border-line p-5 text-sm text-muted">
          Add travelers above first, so you can say who paid and who shares each
          expense.
        </p>
      ) : (
        <form
          onSubmit={handleSubmit}
          noValidate
          className="mt-5 space-y-4 rounded-2xl border border-line bg-white p-5"
        >
          <div>
            <label htmlFor="expense-name" className="text-sm font-medium">
              What was it for?
            </label>
            <input
              id="expense-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Gasoline"
              aria-invalid={errors.name ? true : undefined}
              aria-describedby={errors.name ? 'expense-name-error' : undefined}
              className={inputClasses}
            />
            <FieldError id="expense-name-error" message={errors.name} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="expense-amount" className="text-sm font-medium">
                Amount (₱)
              </label>
              <input
                id="expense-amount"
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="1200"
                aria-invalid={errors.amount ? true : undefined}
                aria-describedby={
                  errors.amount ? 'expense-amount-error' : undefined
                }
                className={inputClasses}
              />
              <FieldError id="expense-amount-error" message={errors.amount} />
            </div>
            <div>
              <label htmlFor="expense-category" className="text-sm font-medium">
                Category
              </label>
              <select
                id="expense-category"
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
              <label htmlFor="expense-date" className="text-sm font-medium">
                Date
              </label>
              <input
                id="expense-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                aria-invalid={errors.date ? true : undefined}
                aria-describedby={errors.date ? 'expense-date-error' : undefined}
                className={inputClasses}
              />
              <FieldError id="expense-date-error" message={errors.date} />
            </div>
            <div>
              <label htmlFor="expense-payer" className="text-sm font-medium">
                Paid by
              </label>
              <select
                id="expense-payer"
                value={payerId}
                onChange={(e) => setPaidById(e.target.value)}
                aria-invalid={errors.paidById ? true : undefined}
                aria-describedby={
                  errors.paidById ? 'expense-payer-error' : undefined
                }
                className={inputClasses}
              >
                {tripParticipants.map((participant) => (
                  <option key={participant.id} value={participant.id}>
                    {participant.name}
                  </option>
                ))}
              </select>
              <FieldError id="expense-payer-error" message={errors.paidById} />
            </div>
          </div>

          <fieldset
            aria-describedby={errors.sharedByIds ? 'expense-shared-error' : undefined}
          >
            <legend className="text-sm font-medium">Shared by</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {tripParticipants.map((participant) => (
                <label
                  key={participant.id}
                  className="flex min-h-10 cursor-pointer items-center gap-2 rounded-full border border-line px-4 py-1.5 text-sm has-[:checked]:border-brand-600 has-[:checked]:bg-brand-50"
                >
                  <input
                    type="checkbox"
                    checked={sharedByIds.includes(participant.id)}
                    onChange={() => toggleShared(participant.id)}
                    className="h-4 w-4 accent-brand-600"
                  />
                  {participant.name}
                </label>
              ))}
            </div>
            <FieldError id="expense-shared-error" message={errors.sharedByIds} />
          </fieldset>

          <div>
            <label htmlFor="expense-notes" className="text-sm font-medium">
              Notes (optional)
            </label>
            <textarea
              id="expense-notes"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className={inputClasses}
            />
          </div>

          <Button type="submit">Add expense</Button>
        </form>
      )}

      {tripExpenses.length === 0 ? (
        <p className="mt-4 rounded-2xl border border-dashed border-line p-5 text-sm text-muted">
          No expenses recorded yet.
        </p>
      ) : (
        <>
          <ul className="mt-4 space-y-3">
            {tripExpenses.map((expense) => (
              <li
                key={expense.id}
                className="rounded-2xl border border-line bg-white p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="break-words font-medium text-charcoal">
                      {expense.name}
                    </p>
                    <p className="text-sm text-muted">
                      {BUDGET_CATEGORY_LABELS[expense.category] ??
                        BUDGET_CATEGORY_LABELS.other}{' '}
                      · {formatShortDate(expense.date)}
                    </p>
                  </div>
                  <span className="font-semibold text-brand-900">
                    {formatCurrencyExact(expense.amount)}
                  </span>
                </div>
                <p className="mt-2 break-words text-sm text-muted">
                  Paid by{' '}
                  <span className="font-medium text-charcoal">
                    {participantName(expense.paidById)}
                  </span>{' '}
                  · Shared by{' '}
                  {expense.sharedByIds.map(participantName).join(', ')}
                </p>
                {expense.notes && (
                  <p className="mt-1 break-words text-sm text-muted">
                    {expense.notes}
                  </p>
                )}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-right text-sm text-muted">
            Total spent:{' '}
            <span className="font-semibold text-brand-900">
              {formatCurrencyExact(totalSpent)}
            </span>
          </p>
        </>
      )}
    </section>
  )
}

export default ExpensesSection