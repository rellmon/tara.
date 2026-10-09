import { Link } from 'react-router-dom'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Clock,
  GripVertical,
  MapPin,
} from 'lucide-react'
import { categoryConfig } from './categoryConfig'
import type { ItineraryActivity } from '../../types/itinerary'
import { formatCurrency } from '../../utils/format'
import { formatTime } from '../../utils/itinerary'

interface SortableActivityItemProps {
  tripId: string
  activity: ItineraryActivity
  conflicts: ItineraryActivity[]
  isFirst: boolean
  isLast: boolean
  onDelete: (activity: ItineraryActivity) => void
  onMove: (activityId: string, direction: -1 | 1) => void
}

const moveButtonClasses =
  'inline-flex h-10 w-10 items-center justify-center rounded-full text-brand-700 transition-colors hover:bg-brand-50 focus-visible:outline-2 focus-visible:outline-brand-600 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent'

function SortableActivityItem({
  tripId,
  activity,
  conflicts,
  isFirst,
  isLast,
  onDelete,
  onMove,
}: SortableActivityItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: activity.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const category = categoryConfig[activity.category] ?? categoryConfig.other

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`relative rounded-2xl border bg-white p-4 ${
        conflicts.length > 0 ? 'border-amber-300' : 'border-line'
      } ${isDragging ? 'z-10 shadow-lg' : ''}`}
    >
      <div className="flex gap-2">
        <button
          type="button"
          ref={setActivatorNodeRef}
          {...attributes}
          {...listeners}
          aria-label={`Drag to reorder ${activity.title}`}
          className="-ml-1 inline-flex h-10 w-8 shrink-0 cursor-grab touch-none items-center justify-center rounded-lg text-muted hover:bg-brand-50 focus-visible:outline-2 focus-visible:outline-brand-600 active:cursor-grabbing"
        >
          <GripVertical size={18} aria-hidden="true" />
        </button>

        <div className="min-w-0 flex-1">
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
              {activity.endTime && ` – ${formatTime(activity.endTime)}`}
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

          {conflicts.length > 0 && (
            <p className="mt-3 flex items-start gap-2 rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-900">
              <AlertTriangle
                size={16}
                className="mt-0.5 shrink-0"
                aria-hidden="true"
              />
              <span>
                Time overlap with {conflicts.map((c) => c.title).join(', ')}
              </span>
            </p>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-1">
            <Link
              to={`/trips/${tripId}/activities/${activity.id}/edit`}
              className="rounded-full px-3 py-1.5 text-sm font-medium text-brand-700 transition-colors hover:bg-brand-50 focus-visible:outline-2 focus-visible:outline-brand-600"
            >
              Edit
            </Link>
            <button
              type="button"
              onClick={() => onDelete(activity)}
              className="rounded-full px-3 py-1.5 text-sm font-medium text-red-700 transition-colors hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-red-700"
            >
              Delete
            </button>

            <div className="ml-auto flex gap-1">
              <button
                type="button"
                onClick={() => onMove(activity.id, -1)}
                disabled={isFirst}
                aria-label={`Move ${activity.title} up`}
                className={moveButtonClasses}
              >
                <ArrowUp size={18} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => onMove(activity.id, 1)}
                disabled={isLast}
                aria-label={`Move ${activity.title} down`}
                className={moveButtonClasses}
              >
                <ArrowDown size={18} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </li>
  )
}

export default SortableActivityItem