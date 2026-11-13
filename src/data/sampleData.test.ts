import { describe, expect, it } from 'vitest'
import { format } from 'date-fns'
import { getTripDays } from '../utils/itinerary'
import { getUpcomingTrips } from '../utils/tripFilters'
import { getTripTiming } from '../utils/tripTiming'
import { createSampleDates } from './sampleDates'
import { sampleActivities } from './sampleActivities'
import { sampleExpenses } from './sampleExpenses'
import { samplePolls, sampleVotes } from './samplePolls'
import { sampleTrips } from './sampleTrips'

const trip = sampleTrips[0]

describe('createSampleDates', () => {
  it('starts the trip 14 days from today and lasts 3 days', () => {
    const dates = createSampleDates(new Date(2026, 10, 12))

    expect(dates.tripStart).toBe('2026-11-26')
    expect(dates.tripEnd).toBe('2026-11-28')
    expect(dates.tripDay(-1)).toBe('2026-11-25')
    expect(dates.tripDay(-25)).toBe('2026-11-01')
  })

  it('crosses month, year, and leap-day boundaries', () => {
    expect(createSampleDates(new Date(2026, 11, 25)).tripStart).toBe('2027-01-08')
    expect(createSampleDates(new Date(2028, 1, 20)).tripStart).toBe('2028-03-05')
  })

  it('makes a local timestamp the given number of days ago', () => {
    const iso = createSampleDates(new Date(2026, 10, 12, 15, 0)).daysAgoAt(2, 10, 30)
    const made = new Date(iso)

    expect([made.getFullYear(), made.getMonth(), made.getDate()]).toEqual([2026, 10, 10])
    expect([made.getHours(), made.getMinutes()]).toEqual([10, 30])
  })

  it('is always upcoming, whatever day the visitor first arrives', () => {
    const firstVisits = [
      new Date(2026, 0, 1),
      new Date(2026, 5, 15),
      new Date(2026, 11, 31),
      new Date(2028, 1, 29),
    ]

    for (const visit of firstVisits) {
      const dates = createSampleDates(visit)
      const today = format(visit, 'yyyy-MM-dd')

      expect(getTripTiming(dates.tripStart, dates.tripEnd, today)).toEqual({
        kind: 'upcoming',
        label: 'In 14 days',
      })
    }
  })
})

describe('sample data', () => {
  it('puts every sample activity on a day of the sample trip', () => {
    const days = getTripDays(trip.startDate, trip.endDate)

    expect(days).toHaveLength(3)
    for (const activity of sampleActivities) {
      expect(activity.tripId).toBe(trip.id)
      expect(days).toContain(activity.date)
    }
  })

  it('dates every sample expense on or before the end of the trip', () => {
    for (const expense of sampleExpenses) {
      expect(expense.tripId).toBe(trip.id)
      expect(expense.date <= trip.endDate).toBe(true)
    }
  })

  it('links the polls and votes to each other and to the trip', () => {
    expect(samplePolls.find((poll) => poll.tripId !== null)?.tripId).toBe(trip.id)

    for (const vote of sampleVotes) {
      const poll = samplePolls.find((p) => p.id === vote.pollId)

      expect(poll).toBeDefined()
      expect(poll?.options.some((option) => option.id === vote.optionId)).toBe(true)
    }
  })

  it('always gives a new visitor one upcoming trip', () => {
    expect(getUpcomingTrips(sampleTrips)).toHaveLength(1)
  })
})