import { BUDGET_CATEGORIES } from '../types/budget'
import type { BudgetCategory } from '../types/budget'
import type { Expense } from '../types/expense'
import type { Participant } from '../types/participant'

export interface ExpenseFilters {
  category: BudgetCategory | 'all'
  personId: string | 'all'
}

function toCentavos(amount: number): number {
  return Math.round(amount * 100)
}

export function sumExpenses(expenses: Expense[]): number {
  return (
    expenses.reduce((sum, expense) => sum + toCentavos(expense.amount), 0) / 100
  )
}

export function getSpendingByCategory(
  expenses: Expense[],
): Record<BudgetCategory, number> {
  const centavos = {} as Record<BudgetCategory, number>
  for (const category of BUDGET_CATEGORIES) {
    centavos[category] = 0
  }

  for (const expense of expenses) {
    const category = expense.category in centavos ? expense.category : 'other'
    centavos[category] += toCentavos(expense.amount)
  }

  const result = {} as Record<BudgetCategory, number>
  for (const category of BUDGET_CATEGORIES) {
    result[category] = centavos[category] / 100
  }
  return result
}

export interface PaidByPerson {
  id: string
  name: string
  amount: number
}

// How much each participant paid out of pocket.
export function getPaidByParticipant(
  expenses: Expense[],
  participants: Participant[],
): PaidByPerson[] {
  return participants.map((participant) => {
    const centavos = expenses
      .filter((expense) => expense.paidById === participant.id)
      .reduce((sum, expense) => sum + toCentavos(expense.amount), 0)

    return { id: participant.id, name: participant.name, amount: centavos / 100 }
  })
}

// "Person" matches expenses the person paid OR shares.
export function filterExpenses(
  expenses: Expense[],
  filters: ExpenseFilters,
): Expense[] {
  return expenses.filter((expense) => {
    if (filters.category !== 'all' && expense.category !== filters.category) {
      return false
    }

    if (
      filters.personId !== 'all' &&
      expense.paidById !== filters.personId &&
      !expense.sharedByIds.includes(filters.personId)
    ) {
      return false
    }

    return true
  })
}