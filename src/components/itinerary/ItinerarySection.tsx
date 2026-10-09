import { Clock, MapPin } from 'lucide-react'
import type { ItineraryActivity } from '../../types/itinerary'
import type { Trip } from '../../types/trip'
import { formatCurrency } from '../../utils/format'
import {
  formatDayLabel,
  formatTime,
  getTripDays,
  sortByStartTime,
} from '../../utils/itinerary'

interface ItinerarySectionProps {
  trip: Trip
  activities: ItineraryActivity[]
}

function ItinerarySection({ trip, activities }: ItinerarySectionProps) {
  const days = getTripDays(trip.startDate, trip.endDate)
  const tripActivities = activities.filter(
    (activity) => activity.tripId === trip.id,
  )

  return (
    <section aria-labelledby="itinerary-heading" className="mt-12">
      <h2
        id="itinerary-heading"
        className="font-display text-2xl font-bold text-brand-900"
      >
        Itinerary
      </h2>

      <div className="mt-6 space-y-8">
        {days.map((day, index) => {
          const dayActivities = sortByStartTime(
            tripActivities.filter((activity) => activity.date === day),
          )

          return (
            <div key={day}>
              <h3 className="font-semibold text-brand-900">
                Day {index + 1}
                <span className="font-normal text-muted">
                  {' '}
                  · {formatDayLabel(day)}
                </span>
              </h3>

              {dayActivities.length === 0 ? (
                <p className="mt-3 rounded-2xl border border-dashed border-line p-5 text-sm text-muted">
                  Nothing planned yet.
                </p>
              ) : (
                <ul className="mt-3 space-y-3">
                  {dayActivities.map((activity) => (
                    <li
                      key={activity.id}
                      className="rounded-2xl border border-line bg-white p-4"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <p className="break-words font-medium text-charcoal">
                          {activity.title}
                        </p>
                        <span className="rounded-full bg-sage px-3 py-0.5 text-xs font-medium capitalize text-brand-900">
                          {activity.category.replace('-', ' ')}
                        </span>
                      </div>

                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
                        <span className="flex items-center gap-1.5">
                          <Clock size={14} aria-hidden="true" />
                          {formatTime(activity.startTime)}
                          {activity.endTime &&
                            ` – ${formatTime(activity.endTime)}`}
                        </span>
                        {activity.locationName && (
                          <span className="flex items-center gap-1.5 break-words">
                            <MapPin size={14} aria-hidden="true" />
                            {activity.locationName}
                          </span>
                        )}
                        {activity.estimatedCost > 0 && (
                          <span>{formatCurrency(activity.estimatedCost)}</span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default ItinerarySection