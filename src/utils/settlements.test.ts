import { describe, expect, it } from 'vitest'
import type { Balance } from './balances'
import { getSettlements } from './settlements'

function bal(id: string, name: string, net: number): Balance {
  return { participantId: id, name, paid: 0, share: 0, net }
}

const sampleTrip: Balance[] = [
  bal('alex', 'Alex', 1660),
  bal('jamie', 'Jamie', -340),
  bal('sam', 'Sam', 1460),
  bal('taylor', 'Taylor', -1540),
  bal('riley', 'Riley', -1240),
]

describe('getSettlements', () => {
  it('handles the dinner example: three people each pay Alex ₱300', () => {
    const settlements = getSettlements([
      bal('alex', 'Alex', 900),
      bal('jamie', 'Jamie', -300),
      bal('sam', 'Sam', -300),
      bal('taylor', 'Taylor', -300),
      bal('riley', 'Riley', 0),
    ])

    expect(settlements).toEqual([
      { fromId: 'jamie', fromName: 'Jamie', toId: 'alex', toName: 'Alex', amount: 300 },
      { fromId: 'sam', fromName: 'Sam', toId: 'alex', toName: 'Alex', amount: 300 },
      { fromId: 'taylor', fromName: 'Taylor', toId: 'alex', toName: 'Alex', amount: 300 },
    ])
  })

  it('returns no payments when everyone is settled', () => {
    expect(getSettlements([bal('a', 'A', 0), bal('b', 'B', 0)])).toEqual([])
    expect(getSettlements([])).toEqual([])
  })

  it('matches biggest debtor with biggest creditor (sample trip)', () => {
    expect(getSettlements(sampleTrip)).toEqual([
      { fromId: 'taylor', fromName: 'Taylor', toId: 'alex', toName: 'Alex', amount: 1540 },
      { fromId: 'riley', fromName: 'Riley', toId: 'alex', toName: 'Alex', amount: 120 },
      { fromId: 'riley', fromName: 'Riley', toId: 'sam', toName: 'Sam', amount: 1120 },
      { fromId: 'jamie', fromName: 'Jamie', toId: 'sam', toName: 'Sam', amount: 340 },
    ])
  })

  it('handles leftover centavos exactly', () => {
    const settlements = getSettlements([
      bal('alex', 'Alex', 66.66),
      bal('jamie', 'Jamie', -33.33),
      bal('sam', 'Sam', -33.33),
    ])

    expect(settlements.map((s) => [s.fromId, s.toId, s.amount])).toEqual([
      ['jamie', 'alex', 33.33],
      ['sam', 'alex', 33.33],
    ])
  })

  it('leaves every person at exactly zero after the payments', () => {
    const net = new Map(
      sampleTrip.map((b) => [b.participantId, Math.round(b.net * 100)]),
    )

    for (const s of getSettlements(sampleTrip)) {
      const cents = Math.round(s.amount * 100)
      net.set(s.fromId, (net.get(s.fromId) ?? 0) + cents)
      net.set(s.toId, (net.get(s.toId) ?? 0) - cents)
    }

    expect([...net.values()].every((value) => value === 0)).toBe(true)
  })

  it('never pays yourself and uses at most (people - 1) payments', () => {
    const settlements = getSettlements(sampleTrip)

    expect(settlements.every((s) => s.fromId !== s.toId && s.amount > 0)).toBe(true)
    expect(settlements.length).toBeLessThanOrEqual(sampleTrip.length - 1)
  })
})