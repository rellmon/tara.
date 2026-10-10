import type { Expense } from '../types/expense'
import type { Participant } from '../types/participant'
import { splitExpenseEqually } from './splitExpense'

export interface Balance {
  participantId: string
  name: string
  paid: number // total paid out of pocket
  share: number // total of this person's shares across all expenses
  net: number // paid - share. Positive: is owed. Negative: owes.
}

// Expenses with no valid shares (no sharers, zero or invalid amount) are
// ignored entirely, so balances always add up to zero.
// Only people in `participants` get a row.
export function getBalances(
  expenses: Expense[],
  participants: Participant[],
): Balance[] {
  const paidCentavos = new Map<string, number>()
  const shareCentavos = new Map<string, number>()
  for (const participant of participants) {
    paidCentavos.set(participant.id, 0)
    shareCentavos.set(participant.id, 0)
  }

  for (const expense of expenses) {
    const shares = splitExpenseEqually(expense)
    if (shares.length === 0) continue

    let expenseCentavos = 0
    for (const share of shares) {
      const centavos = Math.round(share.amount * 100)
      expenseCentavos += centavos

      const current = shareCentavos.get(share.participantId)
      if (current !== undefined) {
        shareCentavos.set(share.participantId, current + centavos)
      }
    }

    const paidSoFar = paidCentavos.get(expense.paidById)
    if (paidSoFar !== undefined) {
      paidCentavos.set(expense.paidById, paidSoFar + expenseCentavos)
    }
  }

  return participants.map((participant) => {
    const paid = paidCentavos.get(participant.id) ?? 0
    const share = shareCentavos.get(participant.id) ?? 0

    return {
      participantId: participant.id,
      name: participant.name,
      paid: paid / 100,
      share: share / 100,
      net: (paid - share) / 100,
    }
  })
}