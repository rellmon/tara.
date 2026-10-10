import type { Balance } from './balances'

export interface Settlement {
  fromId: string
  fromName: string
  toId: string
  toName: string
  amount: number // in PHP, greater than 0
}

interface Party {
  id: string
  name: string
  centavos: number // always positive here
}

// Turns balances into a short list of payments that settles everyone.
// Greedy: the biggest debtor pays the biggest creditor first.
export function getSettlements(balances: Balance[]): Settlement[] {
  const creditors: Party[] = []
  const debtors: Party[] = []

  for (const balance of balances) {
    const centavos = Math.round(balance.net * 100)

    if (centavos > 0) {
      creditors.push({ id: balance.participantId, name: balance.name, centavos })
    } else if (centavos < 0) {
      debtors.push({
        id: balance.participantId,
        name: balance.name,
        centavos: -centavos,
      })
    }
  }

  // Biggest first. The sort is stable, so ties keep the original order.
  creditors.sort((a, b) => b.centavos - a.centavos)
  debtors.sort((a, b) => b.centavos - a.centavos)

  const settlements: Settlement[] = []
  let d = 0
  let c = 0

  while (d < debtors.length && c < creditors.length) {
    const debtor = debtors[d]
    const creditor = creditors[c]
    const centavos = Math.min(debtor.centavos, creditor.centavos)

    settlements.push({
      fromId: debtor.id,
      fromName: debtor.name,
      toId: creditor.id,
      toName: creditor.name,
      amount: centavos / 100,
    })

    debtor.centavos -= centavos
    creditor.centavos -= centavos

    if (debtor.centavos === 0) d++
    if (creditor.centavos === 0) c++
  }

  return settlements
}