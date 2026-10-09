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