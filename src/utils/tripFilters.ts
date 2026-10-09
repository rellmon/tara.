import { format, parseISO } from 'date-fns'
import type { Trip } from '../types/trip'

// Today's date as "YYYY-MM-DD" in the user's local time.
function todayString(): string {
  return format(new Date(), 'yyyy-MM-dd')
}

export function getUpcomingTrips(trips: Trip[]): Trip[] {
  const today = todayString()

  return trips
    .filter((trip) => trip.endDate >= today)
    .sort(
      (a, b) =>
        parseISO(a.startDate).getTime() - parseISO(b.startDate).getTime(),
    )
}