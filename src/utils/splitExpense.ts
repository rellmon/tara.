import type { Expense } from '../types/expense'
import type { ExpenseShare } from '../types/split'

// Splits an expense equally among the people in sharedByIds.
// Works in whole centavos so the shares always add up exactly to the amount.
// Leftover centavos go one each to the first sharers in the list.
export function splitExpenseEqually(expense: Expense): ExpenseShare[] {
  // Ignore duplicate ids so nobody is charged twice.
  const sharerIds = [...new Set(expense.sharedByIds)]
  const totalCentavos = Math.round(expense.amount * 100)

  if (
    sharerIds.length === 0 ||
    !Number.isFinite(totalCentavos) ||
    totalCentavos <= 0
  ) {
    return []
  }

  const baseCentavos = Math.floor(totalCentavos / sharerIds.length)
  const leftover = totalCentavos - baseCentavos * sharerIds.length

  return sharerIds.map((participantId, index) => ({
    expenseId: expense.id,
    participantId,
    amount: (baseCentavos + (index < leftover ? 1 : 0)) / 100,
  }))
}