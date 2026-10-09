import { BUDGET_CATEGORIES, BUDGET_CATEGORY_LABELS } from '../../types/budget'
import type { BudgetItem } from '../../types/budget'
import type { ItineraryActivity } from '../../types/itinerary'
import { getEstimatedBreakdown } from '../../utils/budget'
import { formatCurrency } from '../../utils/format'

interface EstimatedBreakdownProps {
  tripId: string
  activities: ItineraryActivity[]
  budgetItems: BudgetItem[]
}

function EstimatedBreakdown({
  tripId,
  activities,
  budgetItems,
}: EstimatedBreakdownProps) {
  const { byCategory, total } = getEstimatedBreakdown(
    tripId,
    activities,
    budgetItems,
  )

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
          <ul className="space-y-4">
            {rows.map((row) => (
              <li key={row.category}>
                <div className="flex items-baseline justify-between gap-3 text-sm">
                  <span className="font-medium text-charcoal">
                    {BUDGET_CATEGORY_LABELS[row.category]}
                  </span>
                  <span className="font-semibold text-brand-900">
                    {formatCurrency(row.amount)}
                  </span>
                </div>
                <div
                  className="mt-1.5 h-2 overflow-hidden rounded-full bg-sage"
                  aria-hidden="true"
                >
                  <div
                    className="h-full rounded-full bg-brand-500"
                    style={{ width: `${(row.amount / total) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-5 flex items-baseline justify-between gap-3 border-t border-line pt-4">
            <span className="font-medium text-charcoal">Total estimated</span>
            <span className="font-display text-2xl font-bold text-brand-900">
              {formatCurrency(total)}
            </span>
          </div>
        </div>
      )}
    </section>
  )
}

export default EstimatedBreakdown