import { useState } from 'react'
import ExpenseForm from './ExpenseForm'
import type { ExpenseFormValues } from './ExpenseForm'
import ExpenseSummary from './ExpenseSummary'
import { BUDGET_CATEGORIES, BUDGET_CATEGORY_LABELS } from '../../types/budget'
import type { BudgetCategory } from '../../types/budget'
import type { Expense } from '../../types/expense'
import type { Participant } from '../../types/participant'
import type { Trip } from '../../types/trip'
import { filterExpenses, sumExpenses } from '../../utils/expenseSummary'
import { formatCurrencyExact, formatShortDate } from '../../utils/format'

interface ExpensesSectionProps {
  trip: Trip
  expenses: Expense[]
  participants: Participant[]
  onAddExpense: (expense: Expense) => void
  onUpdateExpense: (expense: Expense) => void
  onDeleteExpense: (expenseId: string) => void
}

const selectClasses =
  'mt-1 w-full rounded-xl border border-line bg-white px-4 py-2.5 text-charcoal focus-visible:outline-2 focus-visible:outline-brand-600'

function ExpensesSection({
  trip,
  expenses,
  participants,
  onAddExpense,
  onUpdateExpense,
  onDeleteExpense,
}: ExpensesSectionProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [categoryFilter, setCategoryFilter] = useState<BudgetCategory | 'all'>(
    'all',
  )
  const [personFilter, setPersonFilter] = useState<string>('all')

  const tripParticipants = participants.filter(
    (participant) => participant.tripId === trip.id,
  )
  const participantName = (id: string) =>
    tripParticipants.find((participant) => participant.id === id)?.name ??
    'Unknown'

  // If the selected person was removed, fall back to "everyone".
  const activePerson =
    personFilter === 'all' ||
    tripParticipants.some((participant) => participant.id === personFilter)
      ? personFilter
      : 'all'
  const filtersActive = categoryFilter !== 'all' || activePerson !== 'all'

  const tripExpenses = expenses.filter((expense) => expense.tripId === trip.id)
  const visibleExpenses = filterExpenses(tripExpenses, {
    category: categoryFilter,
    personId: activePerson,
  }).sort((a, b) => b.date.localeCompare(a.date))

  function clearFilters() {
    setCategoryFilter('all')
    setPersonFilter('all')
  }

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

      <ExpenseSummary
        expenses={tripExpenses}
        participants={tripParticipants}
      />

      {tripExpenses.length === 0 ? (
        <p className="mt-4 rounded-2xl border border-dashed border-line p-5 text-sm text-muted">
          No expenses recorded yet.
        </p>
      ) : (
        <>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div>
              <label
                htmlFor="expense-filter-category"
                className="text-sm font-medium"
              >
                Category
              </label>
              <select
                id="expense-filter-category"
                value={categoryFilter}
                onChange={(e) =>
                  setCategoryFilter(e.target.value as BudgetCategory | 'all')
                }
                className={selectClasses}
              >
                <option value="all">All categories</option>
                {BUDGET_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {BUDGET_CATEGORY_LABELS[category]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="expense-filter-person"
                className="text-sm font-medium"
              >
                Involving (paid or shares)
              </label>
              <select
                id="expense-filter-person"
                value={activePerson}
                onChange={(e) => setPersonFilter(e.target.value)}
                className={selectClasses}
              >
                <option value="all">Everyone</option>
                {tripParticipants.map((participant) => (
                  <option key={participant.id} value={participant.id}>
                    {participant.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm text-muted">
            <p aria-live="polite">
              Showing {visibleExpenses.length} of {tripExpenses.length}{' '}
              {tripExpenses.length === 1 ? 'expense' : 'expenses'}
            </p>
            {filtersActive && (
              <button
                type="button"
                onClick={clearFilters}
                className="rounded-full px-3 py-1.5 font-medium text-brand-700 transition-colors hover:bg-brand-50 focus-visible:outline-2 focus-visible:outline-brand-600"
              >
                Clear filters
              </button>
            )}
          </div>

          {visibleExpenses.length === 0 ? (
            <p className="mt-3 rounded-2xl border border-dashed border-line p-5 text-sm text-muted">
              No expenses match these filters.
            </p>
          ) : (
            <>
              <ul className="mt-3 space-y-3">
                {visibleExpenses.map((expense) =>
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
                {filtersActive ? 'Total of shown expenses' : 'Total spent'}:{' '}
                <span className="font-semibold text-brand-900">
                  {formatCurrencyExact(sumExpenses(visibleExpenses))}
                </span>
              </p>
            </>
          )}
        </>
      )}
    </section>
  )
}

export default ExpensesSection