import { eachDayOfInterval, format, isValid, parse, parseISO } from 'date-fns'
import type { ItineraryActivity } from '../types/itinerary'

// All dates from startDate to endDate as "YYYY-MM-DD" strings.
export function getTripDays(startDate: string, endDate: string): string[] {
  const start = parseISO(startDate)
  const end = parseISO(endDate)

  if (!isValid(start) || !isValid(end) || start > end) return []

  return eachDayOfInterval({ start, end }).map((day) =>
    format(day, 'yyyy-MM-dd'),
  )
}

export function sortByStartTime(
  activities: ItineraryActivity[],
): ItineraryActivity[] {
  return [...activities].sort((a, b) => a.startTime.localeCompare(b.startTime))
}

export function formatDayLabel(date: string): string {
  return format(parseISO(date), 'EEE, MMM d')
}

// "14:00" -> "2:00 PM"
export function formatTime(time: string): string {
  const parsed = parse(time, 'HH:mm', new Date())
  return isValid(parsed) ? format(parsed, 'h:mm a') : time
}

// An activity with no end time is treated as a single moment.
function effectiveEnd(activity: ItineraryActivity): string {
  return activity.endTime !== '' ? activity.endTime : activity.startTime
}

export function activitiesOverlap(
  a: ItineraryActivity,
  b: ItineraryActivity,
): boolean {
  if (a.startTime === b.startTime) return true

  return a.startTime < effectiveEnd(b) && b.startTime < effectiveEnd(a)
}

// Maps an activity's id to the activities it overlaps with.
// Pass activities from a single day only.
export function findOverlaps(
  activities: ItineraryActivity[],
): Record<string, ItineraryActivity[]> {
  const result: Record<string, ItineraryActivity[]> = {}

  for (let i = 0; i < activities.length; i++) {
    for (let j = i + 1; j < activities.length; j++) {
      const a = activities[i]
      const b = activities[j]

      if (activitiesOverlap(a, b)) {
        result[a.id] = [...(result[a.id] ?? []), b]
        result[b.id] = [...(result[b.id] ?? []), a]
      }
    }
  }

  return result
}

// Insert a new activity into the list at the position that fits its start time
// among the activities of the same trip and day.
export function insertActivityByTime(
  activities: ItineraryActivity[],
  newActivity: ItineraryActivity,
): ItineraryActivity[] {
  const result = [...activities]
  let firstSameDay = -1
  let lastNotLater = -1

  result.forEach((activity, index) => {
    if (
      activity.tripId !== newActivity.tripId ||
      activity.date !== newActivity.date
    ) {
      return
    }
    if (firstSameDay === -1) firstSameDay = index
    if (activity.startTime <= newActivity.startTime) lastNotLater = index
  })

  let insertAt = result.length
  if (lastNotLater !== -1) {
    insertAt = lastNotLater + 1
  } else if (firstSameDay !== -1) {
    insertAt = firstSameDay
  }

  result.splice(insertAt, 0, newActivity)
  return result
}

// Swap an activity with its neighbor on the same day.
// direction: -1 moves it up, 1 moves it down.
export function moveActivity(
  activities: ItineraryActivity[],
  activityId: string,
  direction: -1 | 1,
): ItineraryActivity[] {
  const target = activities.find((activity) => activity.id === activityId)
  if (!target) return activities

  // Positions in the full list that belong to this trip and day.
  const slots: number[] = []
  activities.forEach((activity, index) => {
    if (activity.tripId === target.tripId && activity.date === target.date) {
      slots.push(index)
    }
  })

  const position = slots.findIndex((index) => activities[index].id === activityId)
  const neighborPosition = position + direction
  if (neighborPosition < 0 || neighborPosition >= slots.length) {
    return activities
  }

  const result = [...activities]
  const a = slots[position]
  const b = slots[neighborPosition]
  const temp = result[a]
  result[a] = result[b]
  result[b] = temp
  return result
}

// Move the dragged activity to the position of the activity it was dropped on.
// Both must belong to the same trip and day.
export function reorderActivity(
  activities: ItineraryActivity[],
  activeId: string,
  overId: string,
): ItineraryActivity[] {
  const active = activities.find((activity) => activity.id === activeId)
  const over = activities.find((activity) => activity.id === overId)

  if (!active || !over || active.id === over.id) return activities
  if (active.tripId !== over.tripId || active.date !== over.date) {
    return activities
  }

  // Positions in the full list that belong to this trip and day.
  const slots: number[] = []
  activities.forEach((activity, index) => {
    if (activity.tripId === active.tripId && activity.date === active.date) {
      slots.push(index)
    }
  })

  const dayItems = slots.map((index) => activities[index])
  const from = dayItems.findIndex((activity) => activity.id === activeId)
  const to = dayItems.findIndex((activity) => activity.id === overId)

  const [moved] = dayItems.splice(from, 1)
  dayItems.splice(to, 0, moved)

  // Write the reordered day back into the same slots.
  const result = [...activities]
  slots.forEach((slotIndex, i) => {
    result[slotIndex] = dayItems[i]
  })
  return result
}