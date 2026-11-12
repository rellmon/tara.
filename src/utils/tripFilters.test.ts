import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { makeTrip } from '../test/factories'
import { getTripSummary, getUpcomingTrips } from './tripFilters'

// Freeze "today" to November 12, 2026 so the results never depend on the real date.
beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] })
  vi.setSystemTime(new Date(2026, 10, 12, 10, 0, 0))
})

afterEach(() => {
  vi.useRealTimers()
})

const A = makeTrip({
  id: 'A',
  startDate: '2026-11-14',
  endDate: '2026-11-16',
  travelerCount: 5,
  estimatedBudgetPerPerson: 15000,
})
const B = makeTrip({
  id: 'B',
  startDate: '2026-11-10',
  endDate: '2026-11-12',
  travelerCount: 2,
  estimatedBudgetPerPerson: 1000,
})
const C = makeTrip({
  id: 'C',
  startDate: '2026-11-01',
  endDate: '2026-11-03',
  travelerCount: 4,
  estimatedBudgetPerPerson: 2000,
})

describe('getUpcomingTrips', () => {
  it('keeps unfinished trips, soonest start first, and drops finished ones', () => {
    expect(getUpcomingTrips([A, B, C]).map((trip) => trip.id)).toEqual(['B', 'A'])
  })

  it('counts a trip that ends today, but not one that ended yesterday', () => {
    const endedYesterday = makeTrip({ id: 'D', startDate: '2026-11-09', endDate: '2026-11-11' })

    expect(getUpcomingTrips([B]).map((trip) => trip.id)).toEqual(['B'])
    expect(getUpcomingTrips([endedYesterday])).toEqual([])
  })
})

describe('getTripSummary', () => {
  it('counts trips and adds up estimated spending for upcoming trips only', () => {
    expect(getTripSummary([A, B, C])).toEqual({
      total: 3,
      upcoming: 2,
      completed: 1,
      estimatedSpending: 77000,
    })
  })

  it('is all zeros with no trips, and never reorders the list it is given', () => {
    expect(getTripSummary([])).toEqual({
      total: 0,
      upcoming: 0,
      completed: 0,
      estimatedSpending: 0,
    })

    const list = [A, B, C]
    getUpcomingTrips(list)

    expect(list.map((trip) => trip.id)).toEqual(['A', 'B', 'C'])
  })
})