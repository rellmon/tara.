import { AlertTriangle, CheckCircle2 } from 'lucide-react'
import { BUDGET_CATEGORY_LABELS } from '../../types/budget'
import type { BudgetItem } from '../../types/budget'
import type { Expense } from '../../types/expense'
import type { ItineraryActivity } from '../../types/itinerary'
import type { Trip } from '../../types/trip'
import { getBudgetStatus } from '../../utils/budget'
import { getBudgetComparison } from '../../utils/budgetComparison'
import { formatCurrencyExact } from '../../utils/format'

interface BudgetVsActualProps {
  trip: Trip
  activities: ItineraryActivity[]
  budgetItems: BudgetItem[]
  expenses: Expense[]
}

function BudgetVsActual({
  trip,
  activities,
  budgetItems,
  expenses,
}: BudgetVsActualProps) {
  const comparison = getBudgetComparison(trip, activities, budgetItems, expenses)
  const status = getBudgetStatus(comparison.planned, comparison.actual)
  const barWidth = Math.min(status.percentUsed, 100)

  return (
    <section aria-labelledby="comparison-heading" className="mt-12">
      <h2
        id="comparison-heading"
        className="font-display text-2xl font-bold text-brand-900"
      >
        Budget vs actual
      </h2>
      <p className="mt-1 text-sm text-muted">
        Estimated = budget items plus activity costs. Spent = recorded expenses.
      </p>

      {comparison.rows.length === 0 ? (
        <p className="mt-4 rounded-2xl border border-dashed border-line p-5 text-sm text-muted">
          Record expenses or add estimates to compare spending with your plan.
        </p>
      ) : (
        <div className="mt-4 rounded-2xl border border-line bg-white p-5">
          <dl className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-sage p-4">
              <dt className="text-sm text-muted">Planned budget</dt>
              <dd className="mt-1 break-words font-display text-xl font-bold text-brand-900">
                {formatCurrencyExact(comparison.planned)}
              </dd>
            </div>
            <div className="rounded-xl bg-brand-50 p-4">
              <dt className="text-sm text-muted">Estimated</dt>
              <dd className="mt-1 break-words font-display text-xl font-bold text-brand-900">
                {formatCurrencyExact(comparison.estimated)}
              </dd>
            </div>
            <div className="rounded-xl bg-brand-50 p-4">
              <dt className="text-sm text-muted">Spent so far</dt>
              <dd className="mt-1 break-words font-display text-xl font-bold text-brand-900">
                {formatCurrencyExact(comparison.actual)}
              </dd>
            </div>
          </dl>

          <div
            className={`mt-4 rounded-xl p-4 ${
              status.isOver ? 'bg-amber-50' : 'bg-brand-50'
            }`}
          >
            <div className="flex items-start gap-2">
              {status.isOver ? (
                <AlertTriangle
                  size={18}
                  className="mt-0.5 shrink-0 text-amber-800"
                  aria-hidden="true"
                />
              ) : (
                <CheckCircle2
                  size={18}
                  className="mt-0.5 shrink-0 text-brand-600"
                  aria-hidden="true"
                />
              )}
              <div className="min-w-0">
                <p
                  className={`font-medium ${
                    status.isOver ? 'text-amber-900' : 'text-brand-900'
                  }`}
                >
                  {status.isOver
                    ? 'Spending is over the planned budget by '
                    : 'Left of the planned budget: '}
                  <span className="font-display text-lg font-bold">
                    {formatCurrencyExact(Math.abs(status.remaining))}
                  </span>
                </p>
                <p className="mt-0.5 text-sm text-muted">
                  {comparison.planned > 0
                    ? `${Math.round(status.percentUsed)}% of the planned budget spent`
                    : 'No planned budget set for this trip.'}
                </p>
              </div>
            </div>
            <div
              className="mt-3 h-2 overflow-hidden rounded-full bg-white"
              aria-hidden="true"
            >
              <div
                className={`h-full rounded-full ${
                  status.isOver ? 'bg-amber-500' : 'bg-brand-500'
                }`}
                style={{ width: `${barWidth}%` }}
              />
            </div>
          </div>

          <h3 className="mt-6 text-sm font-semibold text-brand-900">
            By category
          </h3>
          <ul className="mt-2 divide-y divide-line">
            {comparison.rows.map((row) => {
              const over = row.difference < 0

              return (
                <li key={row.category} className="py-3">
                  <p className="font-medium text-charcoal">
                    {BUDGET_CATEGORY_LABELS[row.category]}
                  </p>
                  <dl className="mt-1 grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <dt className="text-xs text-muted">Estimated</dt>
                      <dd className="break-words text-charcoal">
                        {formatCurrencyExact(row.estimated)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-muted">Spent</dt>
                      <dd className="break-words text-charcoal">
                        {formatCurrencyExact(row.actual)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-muted">
                        {over ? 'Over by' : 'Left'}
                      </dt>
                      <dd
                        className={`break-words font-semibold ${
                          over ? 'text-amber-800' : 'text-brand-700'
                        }`}
                      >
                        {formatCurrencyExact(Math.abs(row.difference))}
                      </dd>
                    </div>
                  </dl>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </section>
  )
}

export default BudgetVsActual