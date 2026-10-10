import { describe, expect, it } from 'vitest'
import type { Expense } from '../types/expense'
import type { Participant } from '../types/participant'
import { getBalances } from './balances'

const people: Participant[] = [
  { id: 'alex', tripId: 't1', name: 'Alex' },
  { id: 'jamie', tripId: 't1', name: 'Jamie' },
  { id: 'sam', tripId: 't1', name: 'Sam' },
  { id: 'taylor', tripId: 't1', name: 'Taylor' },
  { id: 'riley', tripId: 't1', name: 'Riley' },
]

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

function netOf(balances: ReturnType<typeof getBalances>, id: string): number {
  return balances.find((balance) => balance.participantId === id)?.net ?? NaN
}

function sumNets(balances: ReturnType<typeof getBalances>): number {
  return balances.reduce((sum, balance) => sum + Math.round(balance.net * 100), 0)
}

describe('getBalances', () => {
  it('handles the dinner example: Alex pays ₱1,200 for 4 people', () => {
    const balances = getBalances([makeExpense()], people)

    expect(netOf(balances, 'alex')).toBe(900)
    expect(netOf(balances, 'jamie')).toBe(-300)
    expect(netOf(balances, 'sam')).toBe(-300)
    expect(netOf(balances, 'taylor')).toBe(-300)
    expect(netOf(balances, 'riley')).toBe(0)
  })

  it('records what each person paid and their share', () => {
    const alex = getBalances([makeExpense()], people).find(
      (balance) => balance.participantId === 'alex',
    )

    expect(alex?.paid).toBe(1200)
    expect(alex?.share).toBe(300)
  })

  it('works when the payer is not one of the sharers', () => {
    const balances = getBalances(
      [makeExpense({ amount: 600, sharedByIds: ['jamie', 'sam'] })],
      people,
    )

    expect(netOf(balances, 'alex')).toBe(600)
    expect(netOf(balances, 'jamie')).toBe(-300)
    expect(netOf(balances, 'sam')).toBe(-300)
  })

  it('adds up to exactly zero with leftover centavos', () => {
    const balances = getBalances(
      [
        makeExpense({
          amount: 100,
          paidById: 'alex',
          sharedByIds: ['alex', 'jamie', 'sam'],
        }),
      ],
      people,
    )

    expect(netOf(balances, 'alex')).toBe(66.66)
    expect(netOf(balances, 'jamie')).toBe(-33.33)
    expect(netOf(balances, 'sam')).toBe(-33.33)
    expect(sumNets(balances)).toBe(0)
  })

  it('adds up to zero across several expenses and payers', () => {
    const everyone = ['alex', 'jamie', 'sam', 'taylor', 'riley']
    const expenses = [
      makeExpense({ id: 'a', amount: 2000, paidById: 'alex', sharedByIds: everyone }),
      makeExpense({ id: 'b', amount: 1200, paidById: 'jamie', sharedByIds: everyone }),
      makeExpense({ id: 'c', amount: 3000, paidById: 'sam', sharedByIds: everyone }),
      makeExpense({ id: 'd' }),
    ]
    const balances = getBalances(expenses, people)

    expect(netOf(balances, 'alex')).toBe(1660)
    expect(netOf(balances, 'jamie')).toBe(-340)
    expect(netOf(balances, 'sam')).toBe(1460)
    expect(netOf(balances, 'taylor')).toBe(-1540)
    expect(netOf(balances, 'riley')).toBe(-1240)
    expect(sumNets(balances)).toBe(0)
  })

  it('ignores an expense that has no sharers', () => {
    const balances = getBalances([makeExpense({ sharedByIds: [] })], people)

    expect(balances.every((balance) => balance.net === 0)).toBe(true)
  })

  it('returns a zero row for people with no expenses', () => {
    const balances = getBalances([], people)

    expect(balances).toHaveLength(5)
    expect(balances.every((balance) => balance.paid === 0 && balance.share === 0)).toBe(true)
  })
})