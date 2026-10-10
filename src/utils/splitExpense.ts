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

// The shares for any expense: custom amounts when present, equal otherwise.
// Returns no shares if custom amounts are invalid or don't add up to the
// expense amount, so bad data can never create or lose money.
export function getExpenseShares(expense: Expense): ExpenseShare[] {
  if (expense.customShares === undefined) {
    return splitExpenseEqually(expense)
  }

  const totalCentavos = Math.round(expense.amount * 100)
  if (!Number.isFinite(totalCentavos) || totalCentavos <= 0) return []

  const shares: ExpenseShare[] = []
  let assignedCentavos = 0

  for (const participantId of new Set(expense.sharedByIds)) {
    const centavos = Math.round(expense.customShares[participantId] * 100)
    if (!Number.isFinite(centavos) || centavos <= 0) return []

    assignedCentavos += centavos
    shares.push({
      expenseId: expense.id,
      participantId,
      amount: centavos / 100,
    })
  }

  return assignedCentavos === totalCentavos ? shares : []
}