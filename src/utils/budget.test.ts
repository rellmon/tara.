import { describe, expect, it } from 'vitest'
import { sampleActivities } from '../data/sampleActivities'
import { sampleBudgetItems } from '../data/sampleBudgetItems'
import { makeActivity, makeBudgetItem } from '../test/factories'
import type { BudgetCategory } from '../types/budget'
import type { ActivityCategory } from '../types/itinerary'
import {
  getActivityCostByDay,
  getAveragePerDay,
  getBudgetStatus,
  getCostPerPerson,
  getEstimatedBreakdown,
} from './budget'

describe('getEstimatedBreakdown', () => {
  it('adds up the sample trip by category', () => {
    const { byCategory, total } = getEstimatedBreakdown(
      'sample-la-union',
      sampleActivities,
      sampleBudgetItems,
    )

    expect(byCategory).toEqual({
      transportation: 15000,
      accommodation: 15000,
      food: 4600,
      activities: 100,
      shopping: 0,
      emergency: 5000,
      other: 0,
    })
    expect(total).toBe(39700)
  })

  it('ignores items and activities from other trips', () => {
    const items = [
      makeBudgetItem({ id: '1', tripId: 't1', category: 'food', amount: 1000 }),
      makeBudgetItem({ id: '2', tripId: 't2', category: 'food', amount: 9999 }),
    ]
    const activities = [makeActivity({ id: 'a', tripId: 't2', estimatedCost: 500 })]

    const { byCategory, total } = getEstimatedBreakdown('t1', activities, items)

    expect(total).toBe(1000)
    expect(byCategory.food).toBe(1000)
  })

  it('files each activity category under the right budget category', () => {
    const rows: Array<[ActivityCategory, number]> = [
      ['sightseeing', 100],
      ['adventure', 200],
      ['free-time', 300],
      ['other', 400],
      ['food', 50],
      ['shopping', 25],
      ['transportation', 10],
      ['accommodation', 5],
    ]
    const activities = rows.map(([category, estimatedCost], i) =>
      makeActivity({ id: `a${i}`, category, estimatedCost }),
    )

    const { byCategory, total } = getEstimatedBreakdown('t1', activities, [])

    expect(byCategory).toEqual({
      transportation: 10,
      accommodation: 5,
      food: 50,
      activities: 600,
      shopping: 25,
      emergency: 0,
      other: 400,
    })
    expect(total).toBe(1090)
  })

  it('adds centavos exactly (0.1 + 0.2 is 0.3)', () => {
    const items = [
      makeBudgetItem({ id: '1', category: 'other', amount: 0.1 }),
      makeBudgetItem({ id: '2', category: 'other', amount: 0.2 }),
    ]

    const { byCategory, total } = getEstimatedBreakdown('t1', [], items)

    expect(byCategory.other).toBe(0.3)
    expect(total).toBe(0.3)
  })

  it('is all zeros when there is nothing', () => {
    const { byCategory, total } = getEstimatedBreakdown('t1', [], [])

    expect(Object.values(byCategory).every((value) => value === 0)).toBe(true)
    expect(total).toBe(0)
  })

  it('files an unknown saved category under other', () => {
    const item = makeBudgetItem({
      category: 'bogus' as unknown as BudgetCategory,
      amount: 250,
    })

    expect(getEstimatedBreakdown('t1', [], [item]).byCategory.other).toBe(250)
  })
})

describe('getCostPerPerson', () => {
  it('divides the total and rounds up to the next centavo', () => {
    expect(getCostPerPerson(39700, 5)).toBe(7940)
    expect(getCostPerPerson(39700, 3)).toBe(13233.34)
    expect(getCostPerPerson(100, 3)).toBe(33.34)
    expect(getCostPerPerson(1000, 1)).toBe(1000)
    expect(getCostPerPerson(0, 4)).toBe(0)
  })

  it('never leaves the group short, and is never off by a full centavo each', () => {
    for (const total of [0.01, 99.99, 100, 1234.56, 39700]) {
      for (let count = 1; count <= 9; count++) {
        const cents = Math.round(total * 100)
        const collected = Math.round(getCostPerPerson(total, count) * 100) * count

        expect(collected).toBeGreaterThanOrEqual(cents)
        expect(collected - cents).toBeLessThan(count)
      }
    }
  })

  it('returns 0 for an invalid traveler count', () => {
    for (const count of [0, -1, 2.5, NaN]) {
      expect(getCostPerPerson(1000, count)).toBe(0)
    }
  })
})

describe('getAveragePerDay', () => {
  it('divides the total and rounds to the nearest centavo', () => {
    expect(getAveragePerDay(39700, 3)).toBe(13233.33)
    expect(getAveragePerDay(200, 3)).toBe(66.67)
    expect(getAveragePerDay(75000, 3)).toBe(25000)
    expect(getAveragePerDay(1, 1)).toBe(1)
  })

  it('returns 0 for an invalid number of days', () => {
    for (const days of [0, -2, 1.5, NaN]) {
      expect(getAveragePerDay(1000, days)).toBe(0)
    }
  })
})

describe('getActivityCostByDay', () => {
  const days = ['2026-11-14', '2026-11-15', '2026-11-16']

  it('adds up the sample activities on their day', () => {
    expect(getActivityCostByDay('sample-la-union', sampleActivities, days)).toEqual({
      '2026-11-14': 1200,
      '2026-11-15': 0,
      '2026-11-16': 0,
    })
  })

  it('ignores activities outside the trip dates and from other trips', () => {
    const activities = [
      makeActivity({ id: '1', date: '2026-11-15', estimatedCost: 300 }),
      makeActivity({ id: '2', date: '2026-11-20', estimatedCost: 999 }),
      makeActivity({ id: '3', tripId: 't2', date: '2026-11-15', estimatedCost: 777 }),
    ]

    expect(getActivityCostByDay('t1', activities, days)).toEqual({
      '2026-11-14': 0,
      '2026-11-15': 300,
      '2026-11-16': 0,
    })
  })

  it('adds centavos exactly', () => {
    const activities = [
      makeActivity({ id: '1', estimatedCost: 0.1 }),
      makeActivity({ id: '2', estimatedCost: 0.2 }),
    ]

    expect(getActivityCostByDay('t1', activities, days)['2026-11-14']).toBe(0.3)
  })
})

describe('getBudgetStatus', () => {
  it('shows what is left when under budget', () => {
    const status = getBudgetStatus(75000, 39700)

    expect(status.remaining).toBe(35300)
    expect(status.isOver).toBe(false)
    expect(status.percentUsed).toBeCloseTo(52.93, 2)
  })

  it('shows a negative remainder when over budget', () => {
    const status = getBudgetStatus(25000, 39700)

    expect(status.remaining).toBe(-14700)
    expect(status.isOver).toBe(true)
    expect(status.percentUsed).toBeCloseTo(158.8, 1)
  })

  it('does not count exactly on budget as over', () => {
    expect(getBudgetStatus(39700, 39700)).toEqual({
      remaining: 0,
      percentUsed: 100,
      isOver: false,
    })
  })

  it('handles a planned budget of zero without dividing by zero', () => {
    expect(getBudgetStatus(0, 500)).toEqual({
      remaining: -500,
      percentUsed: 100,
      isOver: true,
    })
    expect(getBudgetStatus(0, 0)).toEqual({
      remaining: 0,
      percentUsed: 0,
      isOver: false,
    })
  })

  it('ignores floating-point noise below a centavo', () => {
    const status = getBudgetStatus(0.3, 0.1 + 0.2)

    expect(status.remaining).toBe(0)
    expect(status.isOver).toBe(false)
  })
})