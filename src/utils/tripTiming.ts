import { differenceInCalendarDays, format, isValid, parseISO } from 'date-fns'

export type TripTimingKind = 'upcoming' | 'ongoing' | 'ended'

export interface TripTiming {
  label: string
  kind: TripTimingKind
}

// `today` is a parameter so the function can be tested with fixed dates.
export function getTripTiming(
  startDate: string,
  endDate: string,
  today: string = format(new Date(), 'yyyy-MM-dd'),
): TripTiming | null {
  const start = parseISO(startDate)
  const end = parseISO(endDate)
  const now = parseISO(today)

  if (!isValid(start) || !isValid(end) || !isValid(now)) return null

  const daysUntilStart = differenceInCalendarDays(start, now)
  const daysSinceEnd = differenceInCalendarDays(now, end)

  if (daysUntilStart > 0) {
    return {
      kind: 'upcoming',
      label: daysUntilStart === 1 ? 'Tomorrow' : `In ${daysUntilStart} days`,
    }
  }

  if (daysSinceEnd > 0) {
    return { kind: 'ended', label: 'Ended' }
  }

  return { kind: 'ongoing', label: 'Happening now' }
}   