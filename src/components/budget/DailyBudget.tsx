import type { BudgetItem } from '../../types/budget'
import type { ItineraryActivity } from '../../types/itinerary'
import type { Trip } from '../../types/trip'
import {
  getActivityCostByDay,
  getAveragePerDay,
  getEstimatedBreakdown,
} from '../../utils/budget'
import { formatCurrency, formatCurrencyExact } from '../../utils/format'
import { formatDayLabel, getTripDays } from '../../utils/itinerary'

interface DailyBudgetProps {
  trip: Trip
  activities: ItineraryActivity[]
  budgetItems: BudgetItem[]
}

function DailyBudget({ trip, activities, budgetItems }: DailyBudgetProps) {
  const days = getTripDays(trip.startDate, trip.endDate)
  if (days.length === 0) return null

  const { total } = getEstimatedBreakdown(trip.id, activities, budgetItems)
  const plannedTotal = trip.travelerCount * trip.estimatedBudgetPerPerson

  const averagePerDay = getAveragePerDay(total, days.length)
  const targetPerDay = getAveragePerDay(plannedTotal, days.length)
  const costByDay = getActivityCostByDay(trip.id, activities, days)

  return (
    <section aria-labelledby="daily-heading" className="mt-12">
      <h2
        id="daily-heading"
        className="font-display text-2xl font-bold text-brand-900"
      >
        Daily budget
      </h2>
      <p className="mt-1 text-sm text-muted">
        Group totals across {days.length} {days.length === 1 ? 'day' : 'days'}.
      </p>

      <div className="mt-4 rounded-2xl border border-line bg-white p-5">
        <dl className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl bg-brand-50 p-4">
            <dt className="text-sm text-muted">Average estimated per day</dt>
            <dd className="mt-1 break-words font-display text-xl font-bold text-brand-900">
              {formatCurrencyExact(averagePerDay)}
            </dd>
          </div>
          <div className="rounded-xl bg-sage p-4">
            <dt className="text-sm text-muted">Target budget per day</dt>
            <dd className="mt-1 break-words font-display text-xl font-bold text-brand-900">
              {formatCurrencyExact(targetPerDay)}
            </dd>
          </div>
        </dl>

        <h3 className="mt-6 text-sm font-semibold text-brand-900">
          Itinerary activity costs by day
        </h3>
        <ul className="mt-2 divide-y divide-line">
          {days.map((day, index) => (
            <li
              key={day}
              className="flex items-baseline justify-between gap-3 py-2.5 text-sm"
            >
              <span className="text-charcoal">
                Day {index + 1}
                <span className="text-muted"> · {formatDayLabel(day)}</span>
              </span>
              <span className="font-semibold text-brand-900">
                {formatCurrency(costByDay[day])}
              </span>
            </li>
          ))}
        </ul>

        <p className="mt-3 text-xs text-muted">
          Budget items like accommodation and transport aren't tied to a day, so
          they only count toward the average.
        </p>
      </div>
    </section>
  )
}

export default DailyBudget