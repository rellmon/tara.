import { BUDGET_CATEGORIES, BUDGET_CATEGORY_LABELS } from '../../types/budget'
import type { Expense } from '../../types/expense'
import type { Participant } from '../../types/participant'
import {
  getPaidByParticipant,
  getSpendingByCategory,
  sumExpenses,
} from '../../utils/expenseSummary'
import { formatCurrencyExact } from '../../utils/format'
import { budgetCategoryColors } from '../budget/budgetCategoryStyles'

interface ExpenseSummaryProps {
  expenses: Expense[] // all of the trip's expenses
  participants: Participant[] // the trip's participants
}

function ExpenseSummary({ expenses, participants }: ExpenseSummaryProps) {
  if (expenses.length === 0) return null

  const total = sumExpenses(expenses)
  const byCategory = getSpendingByCategory(expenses)
  const categoryRows = BUDGET_CATEGORIES.filter(
    (category) => byCategory[category] > 0,
  )
    .map((category) => ({ category, amount: byCategory[category] }))
    .sort((a, b) => b.amount - a.amount)
  const paidRows = getPaidByParticipant(expenses, participants)

  return (
    <div className="mt-5 rounded-2xl border border-line bg-white p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-sm font-semibold text-brand-900">
          Spending summary
        </h3>
        <p className="text-sm text-muted">
          Total spent:{' '}
          <span className="font-display text-xl font-bold text-brand-900">
            {formatCurrencyExact(total)}
          </span>
        </p>
      </div>

      <div className="mt-4 grid gap-6 sm:grid-cols-2">
        <div>
          <h4 className="text-sm font-medium text-muted">By category</h4>
          <ul className="mt-2 space-y-2">
            {categoryRows.map((row) => (
              <li
                key={row.category}
                className="flex items-center gap-3 text-sm"
              >
                <span
                  className={`h-3 w-3 shrink-0 rounded-full ${budgetCategoryColors[row.category].swatch}`}
                  aria-hidden="true"
                />
                <span className="min-w-0 flex-1 text-charcoal">
                  {BUDGET_CATEGORY_LABELS[row.category]}
                </span>
                <span className="font-semibold text-brand-900">
                  {formatCurrencyExact(row.amount)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-medium text-muted">Paid by person</h4>
          <ul className="mt-2 space-y-2">
            {paidRows.map((row) => (
              <li key={row.id} className="flex items-center gap-3 text-sm">
                <span className="min-w-0 flex-1 break-words text-charcoal">
                  {row.name}
                </span>
                <span className="font-semibold text-brand-900">
                  {formatCurrencyExact(row.amount)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="mt-4 text-xs text-muted">
        "Paid by person" is money paid out of pocket. Who owes whom comes later.
      </p>
    </div>
  )
}

export default ExpenseSummary