import { AlertTriangle, CheckCircle2 } from 'lucide-react'
import { BUDGET_CATEGORIES, BUDGET_CATEGORY_LABELS } from '../../types/budget'
import type { BudgetItem } from '../../types/budget'
import type { ItineraryActivity } from '../../types/itinerary'
import type { Trip } from '../../types/trip'
import {
  getBudgetStatus,
  getCostPerPerson,
  getEstimatedBreakdown,
} from '../../utils/budget'
import { formatCurrency, formatCurrencyExact } from '../../utils/format'
import { budgetCategoryColors } from './budgetCategoryStyles'
import DonutChart from './DonutChart'

interface EstimatedBreakdownProps {
  trip: Trip
  activities: ItineraryActivity[]
  budgetItems: BudgetItem[]
}

function formatShare(amount: number, total: number): string {
  const percent = (amount / total) * 100
  return percent < 1 ? '<1%' : `${Math.round(percent)}%`
}

function EstimatedBreakdown({
  trip,
  activities,
  budgetItems,
}: EstimatedBreakdownProps) {
  const { byCategory, total } = getEstimatedBreakdown(
    trip.id,
    activities,
    budgetItems,
  )
  const perPerson = getCostPerPerson(total, trip.travelerCount)

  const plannedTotal = trip.travelerCount * trip.estimatedBudgetPerPerson
  const status = getBudgetStatus(plannedTotal, total)
  const barWidth = Math.min(status.percentUsed, 100)

  // Only categories with a cost, largest first.
  const rows = BUDGET_CATEGORIES.filter((category) => byCategory[category] > 0)
    .map((category) => ({ category, amount: byCategory[category] }))
    .sort((a, b) => b.amount - a.amount)

  return (
    <section aria-labelledby="estimated-heading" className="mt-12">
      <h2
        id="estimated-heading"
        className="font-display text-2xl font-bold text-brand-900"
      >
        Estimated costs
      </h2>
      <p className="mt-1 text-sm text-muted">
        Budget items plus the estimated cost of itinerary activities.
      </p>

      {rows.length === 0 ? (
        <p className="mt-4 rounded-2xl border border-dashed border-line p-5 text-sm text-muted">
          Add budget items or activity costs to see a breakdown.
        </p>
      ) : (
        <div className="mt-4 rounded-2xl border border-line bg-white p-5">
          <div className="flex flex-col items-center gap-6 sm:flex-row">
            <DonutChart
              segments={rows.map((row) => ({
                key: row.category,
                value: row.amount,
                strokeClass: budgetCategoryColors[row.category].stroke,
              }))}
              ariaLabel="Estimated cost breakdown by category"
              centerLabel="Total estimated"
              centerValue={formatCurrency(total)}
            />

            <ul className="w-full space-y-3">
              {rows.map((row) => (
                <li
                  key={row.category}
                  className="flex items-center gap-3 text-sm"
                >
                  <span
                    className={`h-3 w-3 shrink-0 rounded-full ${budgetCategoryColors[row.category].swatch}`}
                    aria-hidden="true"
                  />
                  <span className="min-w-0 flex-1 font-medium text-charcoal">
                    {BUDGET_CATEGORY_LABELS[row.category]}
                  </span>
                  <span className="text-muted">
                    {formatShare(row.amount, total)}
                  </span>
                  <span className="w-24 text-right font-semibold text-brand-900">
                    {formatCurrency(row.amount)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-5 flex items-baseline justify-between gap-3 border-t border-line pt-4">
            <span className="font-medium text-charcoal">Total estimated</span>
            <span className="font-display text-2xl font-bold text-brand-900">
              {formatCurrency(total)}
            </span>
          </div>

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
                  {status.isOver ? 'Over budget by ' : 'Remaining budget: '}
                  <span className="font-display text-lg font-bold">
                    {formatCurrency(Math.abs(status.remaining))}
                  </span>
                </p>
                <p className="mt-0.5 text-sm text-muted">
                  {plannedTotal > 0
                    ? `${Math.round(status.percentUsed)}% of your ${formatCurrency(plannedTotal)} planned budget (estimates only)`
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

          <dl className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl bg-brand-50 p-4">
              <dt className="text-sm text-muted">
                Estimated per person ({trip.travelerCount}{' '}
                {trip.travelerCount === 1 ? 'traveler' : 'travelers'})
              </dt>
              <dd className="mt-1 break-words font-display text-xl font-bold text-brand-900">
                {formatCurrencyExact(perPerson)}
              </dd>
            </div>
            <div className="rounded-xl bg-sage p-4">
              <dt className="text-sm text-muted">Your per-person budget</dt>
              <dd className="mt-1 break-words font-display text-xl font-bold text-brand-900">
                {formatCurrencyExact(trip.estimatedBudgetPerPerson)}
              </dd>
            </div>
          </dl>
        </div>
      )}
    </section>
  )
}

export default EstimatedBreakdown