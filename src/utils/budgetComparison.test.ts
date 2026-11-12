import { describe, expect, it } from 'vitest'
import { sampleActivities } from '../data/sampleActivities'
import { sampleBudgetItems } from '../data/sampleBudgetItems'
import { sampleExpenses } from '../data/sampleExpenses'
import { sampleTrips } from '../data/sampleTrips'
import { makeExpense, makeTrip } from '../test/factories'
import { getBudgetComparison } from './budgetComparison'

const trip = sampleTrips[0]

function compare(extraExpenses = [makeExpense({ id: 'unused', tripId: 'other', amount: 0 })]) {
  return getBudgetComparison(trip, sampleActivities, sampleBudgetItems, [
    ...sampleExpenses,
    ...extraExpenses,
  ])
}

describe('getBudgetComparison', () => {
  it('compares planned, estimated, and spent for the sample trip', () => {
    const result = compare()

    expect(result.planned).toBe(75000)
    expect(result.estimated).toBe(39700)
    expect(result.actual).toBe(7400)
    expect(result.rows).toEqual([
      { category: 'transportation', estimated: 15000, actual: 2000, difference: 13000 },
      { category: 'accommodation', estimated: 15000, actual: 3000, difference: 12000 },
      { category: 'food', estimated: 4600, actual: 2400, difference: 2200 },
      { category: 'activities', estimated: 100, actual: 0, difference: 100 },
      { category: 'emergency', estimated: 5000, actual: 0, difference: 5000 },
    ])
  })

  it('shows unplanned spending as over by the full amount', () => {
    const result = compare([
      makeExpense({ id: 'x', tripId: trip.id, category: 'shopping', amount: 500 }),
    ])

    expect(result.rows.find((row) => row.category === 'shopping')).toEqual({
      category: 'shopping',
      estimated: 0,
      actual: 500,
      difference: -500,
    })
  })

  it('shows an overspent category with a negative difference', () => {
    const result = compare([
      makeExpense({ id: 'x', tripId: trip.id, category: 'transportation', amount: 20000 }),
    ])

    expect(result.rows.find((row) => row.category === 'transportation')).toEqual({
      category: 'transportation',
      estimated: 15000,
      actual: 22000,
      difference: -7000,
    })
    expect(result.actual).toBe(27400)
  })

  it('ignores expenses from other trips', () => {
    const result = compare([
      makeExpense({ id: 'x', tripId: 'other-trip', category: 'shopping', amount: 9999 }),
    ])

    expect(result.actual).toBe(7400)
    expect(result.rows.some((row) => row.category === 'shopping')).toBe(false)
  })

  it('has no rows for a trip with no estimates or expenses', () => {
    const empty = makeTrip({ id: 'empty', travelerCount: 4, estimatedBudgetPerPerson: 5000 })

    expect(getBudgetComparison(empty, [], [], [])).toEqual({
      planned: 20000,
      estimated: 0,
      actual: 0,
      rows: [],
    })
  })
})