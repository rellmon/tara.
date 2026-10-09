import { Link } from 'react-router-dom'
import { AlertTriangle, ArrowDown, ArrowUp, Clock, MapPin } from 'lucide-react'
import { categoryConfig } from './categoryConfig'
import type { ItineraryActivity } from '../../types/itinerary'
import type { Trip } from '../../types/trip'
import { formatCurrency } from '../../utils/format'
import {
  findOverlaps,
  formatDayLabel,
  formatTime,
  getTripDays,
} from '../../utils/itinerary'

interface ItinerarySectionProps {
  trip: Trip
  activities: ItineraryActivity[]
  onDeleteActivity: (activityId: string) => void
  onMoveActivity: (activityId: string, direction: -1 | 1) => void
}

const moveButtonClasses =
  'inline-flex h-10 w-10 items-center justify-center rounded-full text-brand-700 transition-colors hover:bg-brand-50 focus-visible:outline-2 focus-visible:outline-brand-600 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent'

function ItinerarySection({
  trip,
  activities,
  onDeleteActivity,
  onMoveActivity,
}: ItinerarySectionProps) {
  const days = getTripDays(trip.startDate, trip.endDate)
  const tripActivities = activities.filter(
    (activity) => activity.tripId === trip.id,
  )

  function handleDelete(activity: ItineraryActivity) {
    const confirmed = window.confirm(
      `Delete "${activity.title}"? This can't be undone.`,
    )
    if (!confirmed) return

    onDeleteActivity(activity.id)
  }

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
          // Array order is the display order.
          const dayActivities = tripActivities.filter(
            (activity) => activity.date === day,
          )
          const overlaps = findOverlaps(dayActivities)

          return (
            <div key={day}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-semibold text-brand-900">
                  Day {index + 1}
                  <span className="font-normal text-muted">
                    {' '}
                    · {formatDayLabel(day)}
                  </span>
                </h3>
                <Link
                  to={`/trips/${trip.id}/activities/new?date=${day}`}
                  className="rounded-full px-4 py-2 text-sm font-medium text-brand-700 transition-colors hover:bg-brand-50 focus-visible:outline-2 focus-visible:outline-brand-600"
                >
                  + Add activity
                </Link>
              </div>

              {dayActivities.length === 0 ? (
                <p className="mt-3 rounded-2xl border border-dashed border-line p-5 text-sm text-muted">
                  Nothing planned yet.
                </p>
              ) : (
                <ul className="mt-3 space-y-3">
                  {dayActivities.map((activity, position) => {
                    const conflicts = overlaps[activity.id] ?? []
                    const category =
                      categoryConfig[activity.category] ?? categoryConfig.other

                    return (
                      <li
                        key={activity.id}
                        className={`rounded-2xl border bg-white p-4 ${
                          conflicts.length > 0
                            ? 'border-amber-300'
                            : 'border-line'
                        }`}
                      >
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <p className="break-words font-medium text-charcoal">
                            {activity.title}
                          </p>
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-xs font-medium ${category.classes}`}
                          >
                            <category.icon size={12} aria-hidden="true" />
                            {category.label}
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
                            <span>
                              {formatCurrency(activity.estimatedCost)}
                            </span>
                          )}
                        </div>

                        {conflicts.length > 0 && (
                          <p className="mt-3 flex items-start gap-2 rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-900">
                            <AlertTriangle
                              size={16}
                              className="mt-0.5 shrink-0"
                              aria-hidden="true"
                            />
                            <span>
                              Time overlap with{' '}
                              {conflicts.map((c) => c.title).join(', ')}
                            </span>
                          </p>
                        )}

                        <div className="mt-3 flex flex-wrap items-center gap-1">
                          <Link
                            to={`/trips/${trip.id}/activities/${activity.id}/edit`}
                            className="rounded-full px-3 py-1.5 text-sm font-medium text-brand-700 transition-colors hover:bg-brand-50 focus-visible:outline-2 focus-visible:outline-brand-600"
                          >
                            Edit
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleDelete(activity)}
                            className="rounded-full px-3 py-1.5 text-sm font-medium text-red-700 transition-colors hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-red-700"
                          >
                            Delete
                          </button>

                          <div className="ml-auto flex gap-1">
                            <button
                              type="button"
                              onClick={() => onMoveActivity(activity.id, -1)}
                              disabled={position === 0}
                              aria-label={`Move ${activity.title} up`}
                              className={moveButtonClasses}
                            >
                              <ArrowUp size={18} aria-hidden="true" />
                            </button>
                            <button
                              type="button"
                              onClick={() => onMoveActivity(activity.id, 1)}
                              disabled={position === dayActivities.length - 1}
                              aria-label={`Move ${activity.title} down`}
                              className={moveButtonClasses}
                            >
                              <ArrowDown size={18} aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                      </li>
                    )
                  })}
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