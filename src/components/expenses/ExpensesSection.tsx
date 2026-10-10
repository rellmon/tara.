import { useState } from 'react'
import ExpenseForm from './ExpenseForm'
import type { ExpenseFormValues } from './ExpenseForm'
import { BUDGET_CATEGORY_LABELS } from '../../types/budget'
import type { Expense } from '../../types/expense'
import type { Participant } from '../../types/participant'
import type { Trip } from '../../types/trip'
import { formatCurrencyExact, formatShortDate } from '../../utils/format'

interface ExpensesSectionProps {
  trip: Trip
  expenses: Expense[]
  participants: Participant[]
  onAddExpense: (expense: Expense) => void
  onUpdateExpense: (expense: Expense) => void
  onDeleteExpense: (expenseId: string) => void
}

function ExpensesSection({
  trip,
  expenses,
  participants,
  onAddExpense,
  onUpdateExpense,
  onDeleteExpense,
}: ExpensesSectionProps) {
  const [editingId, setEditingId] = useState<string | null>(null)

  const tripParticipants = participants.filter(
    (participant) => participant.tripId === trip.id,
  )
  const participantName = (id: string) =>
    tripParticipants.find((participant) => participant.id === id)?.name ??
    'Unknown'

  const tripExpenses = expenses
    .filter((expense) => expense.tripId === trip.id)
    .sort((a, b) => b.date.localeCompare(a.date))
  const totalSpent =
    tripExpenses.reduce(
      (sum, expense) => sum + Math.round(expense.amount * 100),
      0,
    ) / 100

  function handleAdd(values: ExpenseFormValues) {
    onAddExpense({
      id: crypto.randomUUID(),
      tripId: trip.id,
      ...values,
    })
  }

  function handleUpdate(expense: Expense, values: ExpenseFormValues) {
    onUpdateExpense({ ...expense, ...values })
    setEditingId(null)
  }

  function handleDelete(expense: Expense) {
    const confirmed = window.confirm(
      `Delete "${expense.name}"? This can't be undone.`,
    )
    if (!confirmed) return

    if (editingId === expense.id) setEditingId(null)
    onDeleteExpense(expense.id)
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
        <div className="mt-5">
          <ExpenseForm
            participants={tripParticipants}
            idPrefix="expense-new"
            onSubmit={handleAdd}
          />
        </div>
      )}

      {tripExpenses.length === 0 ? (
        <p className="mt-4 rounded-2xl border border-dashed border-line p-5 text-sm text-muted">
          No expenses recorded yet.
        </p>
      ) : (
        <>
          <ul className="mt-4 space-y-3">
            {tripExpenses.map((expense) =>
              editingId === expense.id ? (
                <li key={expense.id}>
                  <ExpenseForm
                    participants={tripParticipants}
                    idPrefix={`expense-edit-${expense.id}`}
                    initialValues={expense}
                    submitLabel="Save changes"
                    onSubmit={(values) => handleUpdate(expense, values)}
                    onCancel={() => setEditingId(null)}
                  />
                </li>
              ) : (
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
                  <div className="mt-3 flex gap-1">
                    <button
                      type="button"
                      onClick={() => setEditingId(expense.id)}
                      aria-label={`Edit ${expense.name}`}
                      className="rounded-full px-3 py-1.5 text-sm font-medium text-brand-700 transition-colors hover:bg-brand-50 focus-visible:outline-2 focus-visible:outline-brand-600"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(expense)}
                      aria-label={`Delete ${expense.name}`}
                      className="rounded-full px-3 py-1.5 text-sm font-medium text-red-700 transition-colors hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ),
            )}
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