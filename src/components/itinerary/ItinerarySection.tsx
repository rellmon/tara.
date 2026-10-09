import { Link } from 'react-router-dom'
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import SortableActivityItem from './SortableActivityItem'
import type { ItineraryActivity } from '../../types/itinerary'
import type { Trip } from '../../types/trip'
import {
  findOverlaps,
  formatDayLabel,
  getTripDays,
} from '../../utils/itinerary'

interface ItinerarySectionProps {
  trip: Trip
  activities: ItineraryActivity[]
  onDeleteActivity: (activityId: string) => void
  onMoveActivity: (activityId: string, direction: -1 | 1) => void
  onReorderActivity: (activeId: string, overId: string) => void
}

function ItinerarySection({
  trip,
  activities,
  onDeleteActivity,
  onMoveActivity,
  onReorderActivity,
}: ItinerarySectionProps) {
  const days = getTripDays(trip.startDate, trip.endDate)
  const tripActivities = activities.filter(
    (activity) => activity.tripId === trip.id,
  )

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  function handleDelete(activity: ItineraryActivity) {
    const confirmed = window.confirm(
      `Delete "${activity.title}"? This can't be undone.`,
    )
    if (!confirmed) return

    onDeleteActivity(activity.id)
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    onReorderActivity(String(active.id), String(over.id))
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
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={dayActivities.map((activity) => activity.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <ul className="mt-3 space-y-3">
                      {dayActivities.map((activity, position) => (
                        <SortableActivityItem
                          key={activity.id}
                          tripId={trip.id}
                          activity={activity}
                          conflicts={overlaps[activity.id] ?? []}
                          isFirst={position === 0}
                          isLast={position === dayActivities.length - 1}
                          onDelete={handleDelete}
                          onMove={onMoveActivity}
                        />
                      ))}
                    </ul>
                  </SortableContext>
                </DndContext>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default ItinerarySection