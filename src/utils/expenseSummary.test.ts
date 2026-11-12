import { describe, expect, it } from 'vitest'
import { sampleExpenses } from '../data/sampleExpenses'
import { sampleParticipants } from '../data/sampleParticipants'
import { makeExpense } from '../test/factories'
import type { BudgetCategory } from '../types/budget'
import type { Expense } from '../types/expense'
import {
  filterExpenses,
  getPaidByParticipant,
  getSpendingByCategory,
  sumExpenses,
} from './expenseSummary'

function ids(list: Expense[]): string[] {
  return list.map((expense) => expense.id)
}

describe('sumExpenses', () => {
  it('adds up the sample expenses', () => {
    expect(sumExpenses(sampleExpenses)).toBe(7400)
  })

  it('adds centavos exactly, and is 0 for nothing', () => {
    expect(sumExpenses([])).toBe(0)
    expect(
      sumExpenses([
        makeExpense({ id: '1', amount: 0.1 }),
        makeExpense({ id: '2', amount: 0.2 }),
      ]),
    ).toBe(0.3)
  })
})

describe('getSpendingByCategory', () => {
  it('groups the sample expenses by category', () => {
    expect(getSpendingByCategory(sampleExpenses)).toEqual({
      transportation: 2000,
      accommodation: 3000,
      food: 2400,
      activities: 0,
      shopping: 0,
      emergency: 0,
      other: 0,
    })
  })

  it('files an unknown saved category under other', () => {
    const expense = makeExpense({
      category: 'bogus' as unknown as BudgetCategory,
      amount: 250,
    })

    expect(getSpendingByCategory([expense]).other).toBe(250)
  })
})

describe('getPaidByParticipant', () => {
  it('shows what each person paid, including people who paid nothing', () => {
    expect(getPaidByParticipant(sampleExpenses, sampleParticipants)).toEqual([
      { id: 'sample-p-alex', name: 'Alex', amount: 3200 },
      { id: 'sample-p-jamie', name: 'Jamie', amount: 1200 },
      { id: 'sample-p-sam', name: 'Sam', amount: 3000 },
      { id: 'sample-p-taylor', name: 'Taylor', amount: 0 },
      { id: 'sample-p-riley', name: 'Riley', amount: 0 },
    ])
  })

  it('ignores payers who are not on the trip', () => {
    const withGhost = [
      ...sampleExpenses,
      makeExpense({ id: 'g', paidById: 'ghost', amount: 500 }),
    ]

    const rows = getPaidByParticipant(withGhost, sampleParticipants)

    expect(rows.map((row) => row.amount)).toEqual([3200, 1200, 3000, 0, 0])
  })
})

describe('filterExpenses', () => {
  const all = { category: 'all', personId: 'all' } as const

  it('returns every expense, as a new list, when nothing is filtered', () => {
    const result = filterExpenses(sampleExpenses, all)

    expect(ids(result)).toEqual(ids(sampleExpenses))
    expect(result).not.toBe(sampleExpenses)
  })

  it('filters by category', () => {
    const result = filterExpenses(sampleExpenses, { ...all, category: 'food' })

    expect(ids(result)).toEqual(['sample-exp-2', 'sample-exp-4'])
  })

  it('filters by a person who paid or shares', () => {
    // Riley shares every sample expense except the dinner.
    const result = filterExpenses(sampleExpenses, { ...all, personId: 'sample-p-riley' })

    expect(ids(result)).toEqual(['sample-exp-1', 'sample-exp-2', 'sample-exp-3'])
  })

  it('applies category and person together', () => {
    const result = filterExpenses(sampleExpenses, {
      category: 'food',
      personId: 'sample-p-riley',
    })

    expect(ids(result)).toEqual(['sample-exp-2'])
  })

  it('counts a payer who is not sharing as involved', () => {
    const expenses = [makeExpense({ id: 'x', paidById: 'alex', sharedByIds: ['jamie'] })]

    expect(ids(filterExpenses(expenses, { ...all, personId: 'alex' }))).toEqual(['x'])
    expect(filterExpenses(expenses, { ...all, personId: 'sam' })).toEqual([])
  })
})