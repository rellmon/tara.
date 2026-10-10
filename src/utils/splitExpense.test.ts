import { describe, expect, it } from 'vitest'
import type { Expense } from '../types/expense'
import type { ExpenseShare } from '../types/split'
import { splitExpenseEqually } from './splitExpense'

function makeExpense(overrides: Partial<Expense> = {}): Expense {
  return {
    id: 'e1',
    tripId: 't1',
    name: 'Test expense',
    amount: 1200,
    category: 'food',
    date: '2026-11-14',
    paidById: 'alex',
    sharedByIds: ['alex', 'jamie', 'sam', 'taylor'],
    notes: '',
    ...overrides,
  }
}

function totalCentavos(shares: ExpenseShare[]): number {
  return shares.reduce((sum, share) => sum + Math.round(share.amount * 100), 0)
}

describe('splitExpenseEqually', () => {
  it('splits ₱1,200 among 4 people into ₱300 each', () => {
    const shares = splitExpenseEqually(makeExpense())

    expect(shares).toHaveLength(4)
    expect(shares.map((share) => share.amount)).toEqual([300, 300, 300, 300])
    expect(shares.map((share) => share.participantId)).toEqual([
      'alex',
      'jamie',
      'sam',
      'taylor',
    ])
  })

  it('does not include people who are not sharing', () => {
    const shares = splitExpenseEqually(makeExpense())

    expect(shares.some((share) => share.participantId === 'riley')).toBe(false)
  })

  it('gives leftover centavos to the first sharers (₱100 among 3)', () => {
    const shares = splitExpenseEqually(
      makeExpense({ amount: 100, sharedByIds: ['a', 'b', 'c'] }),
    )

    expect(shares.map((share) => share.amount)).toEqual([33.34, 33.33, 33.33])
    expect(totalCentavos(shares)).toBe(10000)
  })

  it('always adds up exactly to the amount', () => {
    const amounts = [0.01, 0.05, 10.01, 99.99, 1234.56, 20000]

    for (const amount of amounts) {
      for (let count = 1; count <= 7; count++) {
        const sharedByIds = Array.from({ length: count }, (_, i) => `p${i}`)
        const shares = splitExpenseEqually(makeExpense({ amount, sharedByIds }))

        expect(totalCentavos(shares)).toBe(Math.round(amount * 100))
      }
    }
  })

  it('charges one person the full amount when they are the only sharer', () => {
    const shares = splitExpenseEqually(makeExpense({ sharedByIds: ['sam'] }))

    expect(shares).toEqual([{ expenseId: 'e1', participantId: 'sam', amount: 1200 }])
  })

  it('does not add a share for the payer when the payer is not sharing', () => {
    const shares = splitExpenseEqually(
      makeExpense({ paidById: 'alex', sharedByIds: ['jamie', 'sam'] }),
    )

    expect(shares.map((share) => share.participantId)).toEqual(['jamie', 'sam'])
    expect(shares.map((share) => share.amount)).toEqual([600, 600])
  })

  it('counts a duplicated person only once', () => {
    const shares = splitExpenseEqually(
      makeExpense({ amount: 900, sharedByIds: ['a', 'a', 'b'] }),
    )

    expect(shares.map((share) => share.amount)).toEqual([450, 450])
  })

  it('returns no shares when nobody is sharing', () => {
    expect(splitExpenseEqually(makeExpense({ sharedByIds: [] }))).toEqual([])
  })

  it('returns no shares for a zero, negative, or invalid amount', () => {
    for (const amount of [0, -5, NaN]) {
      expect(splitExpenseEqually(makeExpense({ amount }))).toEqual([])
    }
  })
})