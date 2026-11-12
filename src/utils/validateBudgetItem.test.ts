import { describe, expect, it } from 'vitest'
import { validateBudgetItem } from './validateBudgetItem'

describe('validateBudgetItem', () => {
  it('accepts a named item with an amount', () => {
    expect(validateBudgetItem({ name: 'Van rental', amount: 12000 })).toEqual({})
  })

  it('accepts an amount of zero (free things are valid)', () => {
    expect(validateBudgetItem({ name: 'Free parking', amount: 0 })).toEqual({})
  })

  it('requires a name, including not just spaces', () => {
    expect(validateBudgetItem({ name: '', amount: 100 }).name).toBeDefined()
    expect(validateBudgetItem({ name: '   ', amount: 100 }).name).toBeDefined()
  })

  it('rejects a negative amount', () => {
    expect(validateBudgetItem({ name: 'Van', amount: -1 }).amount).toBeDefined()
  })

  it('rejects an amount that is not a number (such as a blank field)', () => {
    expect(validateBudgetItem({ name: 'Van', amount: NaN }).amount).toBeDefined()
    expect(validateBudgetItem({ name: 'Van', amount: Infinity }).amount).toBeDefined()
  })
})