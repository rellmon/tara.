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

export interface TripSummary {
  total: number
  upcoming: number
  completed: number
  estimatedSpending: number
}

export function getTripSummary(trips: Trip[]): TripSummary {
  const today = todayString()

  const upcomingTrips = trips.filter((trip) => trip.endDate >= today)
  const completedTrips = trips.filter((trip) => trip.endDate < today)

  const estimatedSpending = upcomingTrips.reduce(
    (sum, trip) => sum + trip.travelerCount * trip.estimatedBudgetPerPerson,
    0,
  )

  return {
    total: trips.length,
    upcoming: upcomingTrips.length,
    completed: completedTrips.length,
    estimatedSpending,
  }
}