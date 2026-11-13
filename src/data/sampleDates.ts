import { addDays, format } from 'date-fns'

// The sample trip starts this many days after the visitor's first visit,
// so a new visitor always sees an upcoming trip.
const TRIP_STARTS_IN_DAYS = 14
const TRIP_LENGTH_DAYS = 3

export interface SampleDates {
  tripStart: string // "YYYY-MM-DD"
  tripEnd: string // "YYYY-MM-DD"
  // A date relative to the trip's first day: 0 is day one, -1 the day before.
  tripDay: (offset: number) => string
  // An ISO timestamp for N days before today, at the given local time.
  daysAgoAt: (daysAgo: number, hour: number, minute: number) => string
}

function toDateString(date: Date): string {
  return format(date, 'yyyy-MM-dd')
}

export function createSampleDates(today: Date): SampleDates {
  const start = addDays(today, TRIP_STARTS_IN_DAYS)

  return {
    tripStart: toDateString(start),
    tripEnd: toDateString(addDays(start, TRIP_LENGTH_DAYS - 1)),
    tripDay: (offset) => toDateString(addDays(start, offset)),
    daysAgoAt: (daysAgo, hour, minute) => {
      const moment = addDays(today, -daysAgo)
      moment.setHours(hour, minute, 0, 0)
      return moment.toISOString()
    },
  }
}

// Calculated once, when the app loads in the visitor's browser, and shared by
// every sample file so they all agree.
export const sampleDates = createSampleDates(new Date())