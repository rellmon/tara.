import { describe, expect, it } from 'vitest'
import { validateExpense } from './validateExpense'
import type { ExpenseInput } from './validateExpense'

const ids = ['alex', 'jamie', 'sam']

function makeInput(overrides: Partial<ExpenseInput> = {}): ExpenseInput {
  return {
    name: 'Dinner',
    amount: 1200,
    date: '2026-11-14',
    paidById: 'alex',
    sharedByIds: ['alex', 'jamie'],
    ...overrides,
  }
}

describe('validateExpense', () => {
  it('accepts a valid expense', () => {
    expect(validateExpense(makeInput(), ids)).toEqual({})
  })

  it('requires a name', () => {
    expect(validateExpense(makeInput({ name: '' }), ids).name).toBeDefined()
    expect(validateExpense(makeInput({ name: '   ' }), ids).name).toBeDefined()
  })

  it('rejects amounts that are zero, negative, or not a number', () => {
    for (const amount of [0, -5, NaN, Infinity]) {
      expect(validateExpense(makeInput({ amount }), ids).amount).toBe(
        'Enter an amount greater than 0.',
      )
    }
  })

  it('rejects more than 2 decimal places', () => {
    expect(validateExpense(makeInput({ amount: 10.555 }), ids).amount).toBe(
      'Use at most 2 decimal places.',
    )
    expect(validateExpense(makeInput({ amount: 0.001 }), ids).amount).toBeDefined()
  })

  it('accepts centavo amounts, even ones that are inexact in floating point', () => {
    for (const amount of [0.01, 19.99, 1200, 0.1 + 0.2]) {
      expect(validateExpense(makeInput({ amount }), ids).amount).toBeUndefined()
    }
  })

  it('requires a real date', () => {
    for (const date of ['', 'nope', '2026-02-30']) {
      expect(validateExpense(makeInput({ date }), ids).date).toBeDefined()
    }
  })

  it('requires the payer to be on the trip', () => {
    expect(validateExpense(makeInput({ paidById: '' }), ids).paidById).toBeDefined()
    expect(validateExpense(makeInput({ paidById: 'ghost' }), ids).paidById).toBeDefined()
  })

  it('requires at least one person to share the cost', () => {
    expect(validateExpense(makeInput({ sharedByIds: [] }), ids).sharedByIds).toBe(
      'Choose at least one person to share the cost.',
    )
  })

  it('requires everyone sharing to be on the trip', () => {
    const errors = validateExpense(makeInput({ sharedByIds: ['alex', 'ghost'] }), ids)

    expect(errors.sharedByIds).toBe('Some selected people are not on this trip.')
  })

  it('lets someone pay for an expense they do not share', () => {
    const errors = validateExpense(
      makeInput({ paidById: 'alex', sharedByIds: ['jamie', 'sam'] }),
      ids,
    )

    expect(errors).toEqual({})
  })

  it('does not check a custom split while the amount itself is invalid', () => {
    const errors = validateExpense(
      makeInput({ amount: 0, customShares: { alex: 700, jamie: 300 } }),
      ids,
    )

    expect(errors.amount).toBeDefined()
    expect(errors.customShares).toBeUndefined()
  })

  it('rejects a custom split with no amounts', () => {
    const errors = validateExpense(
      makeInput({ sharedByIds: ['alex'], customShares: {} }),
      ids,
    )

    expect(errors.customShares).toBeDefined()
  })

  it('says how far off a custom split is', () => {
    const errors = validateExpense(
      makeInput({ amount: 1000, customShares: { alex: 700, jamie: 200 } }),
      ids,
    )

    expect(errors.customShares).toMatch(/900\.00/)
    expect(errors.customShares).toMatch(/1,000\.00/)
  })
})