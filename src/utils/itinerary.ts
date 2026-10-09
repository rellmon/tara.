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