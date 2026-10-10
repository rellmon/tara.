import { describe, expect, it } from 'vitest'
import type { Expense } from '../types/expense'
import type { Participant } from '../types/participant'
import { getBalances } from './balances'
import { getExpenseShares } from './splitExpense'
import { validateExpense } from './validateExpense'
import type { ExpenseInput } from './validateExpense'

function makeExpense(overrides: Partial<Expense> = {}): Expense {
  return {
    id: 'e1',
    tripId: 't1',
    name: 'Dinner',
    amount: 1000,
    category: 'food',
    date: '2026-11-14',
    paidById: 'a',
    sharedByIds: ['a', 'b'],
    notes: '',
    ...overrides,
  }
}

function makeInput(overrides: Partial<ExpenseInput> = {}): ExpenseInput {
  return {
    name: 'Dinner',
    amount: 1000,
    date: '2026-11-14',
    paidById: 'a',
    sharedByIds: ['a', 'b'],
    customShares: { a: 700, b: 300 },
    ...overrides,
  }
}

const ids = ['a', 'b', 'c']

describe('getExpenseShares', () => {
  it('uses the custom amounts', () => {
    const shares = getExpenseShares(
      makeExpense({ customShares: { a: 700, b: 300 } }),
    )

    expect(shares.map((share) => [share.participantId, share.amount])).toEqual([
      ['a', 700],
      ['b', 300],
    ])
  })

  it('returns no shares when the amounts do not add up', () => {
    expect(
      getExpenseShares(makeExpense({ customShares: { a: 700, b: 200 } })),
    ).toEqual([])
  })

  it('returns no shares for a zero or missing share', () => {
    expect(
      getExpenseShares(makeExpense({ customShares: { a: 1000, b: 0 } })),
    ).toEqual([])
    expect(
      getExpenseShares(makeExpense({ customShares: { a: 1000 } })),
    ).toEqual([])
  })

  it('splits equally when there are no custom shares', () => {
    const shares = getExpenseShares(makeExpense())

    expect(shares.map((share) => share.amount)).toEqual([500, 500])
  })
})

describe('validateExpense with custom shares', () => {
  it('accepts shares that add up to the amount', () => {
    expect(validateExpense(makeInput(), ids).customShares).toBeUndefined()
  })

  it('rejects shares that do not add up', () => {
    const errors = validateExpense(
      makeInput({ customShares: { a: 700, b: 200 } }),
      ids,
    )

    expect(errors.customShares).toBeDefined()
  })

  it('rejects more than 2 decimal places', () => {
    const errors = validateExpense(
      makeInput({ customShares: { a: 333.333, b: 666.667 } }),
      ids,
    )

    expect(errors.customShares).toBeDefined()
  })

  it('rejects zero and negative shares', () => {
    expect(
      validateExpense(makeInput({ customShares: { a: 1000, b: 0 } }), ids)
        .customShares,
    ).toBeDefined()
    expect(
      validateExpense(makeInput({ customShares: { a: 1200, b: -200 } }), ids)
        .customShares,
    ).toBeDefined()
  })

  it('rejects people who are not on the trip', () => {
    const errors = validateExpense(
      makeInput({ sharedByIds: ['a', 'z'], customShares: { a: 700, z: 300 } }),
      ids,
    )

    expect(errors.sharedByIds).toBeDefined()
    expect(errors.customShares).toBeDefined()
  })
})

describe('balances with custom shares', () => {
  it('uses the custom amounts and still adds up to zero', () => {
    const people: Participant[] = [
      { id: 'a', tripId: 't1', name: 'Alex' },
      { id: 'b', tripId: 't1', name: 'Jamie' },
    ]
    const balances = getBalances(
      [makeExpense({ customShares: { a: 200, b: 800 } })],
      people,
    )

    expect(balances.map((balance) => balance.net)).toEqual([800, -800])
  })
})