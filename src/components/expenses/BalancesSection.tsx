import type { Expense } from '../../types/expense'
import type { Participant } from '../../types/participant'
import type { Trip } from '../../types/trip'
import { getBalances } from '../../utils/balances'
import { formatCurrencyExact } from '../../utils/format'
import { getSettlements } from '../../utils/settlements'

interface BalancesSectionProps {
  trip: Trip
  expenses: Expense[]
  participants: Participant[]
}

function BalancesSection({ trip, expenses, participants }: BalancesSectionProps) {
  const tripExpenses = expenses.filter((expense) => expense.tripId === trip.id)
  const tripParticipants = participants.filter(
    (participant) => participant.tripId === trip.id,
  )

  if (tripExpenses.length === 0 || tripParticipants.length === 0) return null

  const balances = getBalances(tripExpenses, tripParticipants)
  const settlements = getSettlements(balances)

  return (
    <section aria-labelledby="balances-heading" className="mt-12">
      <h2
        id="balances-heading"
        className="font-display text-2xl font-bold text-brand-900"
      >
        Balances
      </h2>
      <p className="mt-1 text-sm text-muted">
        Paid minus each person's share of every expense.
      </p>

      <ul className="mt-4 space-y-3">
        {balances.map((balance) => {
          const isOwed = balance.net > 0
          const owes = balance.net < 0

          return (
            <li
              key={balance.participantId}
              className="rounded-2xl border border-line bg-white p-4"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="break-words font-medium text-charcoal">
                  {balance.name}
                </p>
                <p
                  className={`font-semibold ${
                    isOwed
                      ? 'text-brand-700'
                      : owes
                        ? 'text-amber-800'
                        : 'text-muted'
                  }`}
                >
                  {isOwed && `Is owed ${formatCurrencyExact(balance.net)}`}
                  {owes && `Owes ${formatCurrencyExact(Math.abs(balance.net))}`}
                  {!isOwed && !owes && 'Settled up'}
                </p>
              </div>
              <dl className="mt-2 grid grid-cols-2 gap-2 text-sm">
                <div>
                  <dt className="text-xs text-muted">Paid</dt>
                  <dd className="break-words text-charcoal">
                    {formatCurrencyExact(balance.paid)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-muted">Share of expenses</dt>
                  <dd className="break-words text-charcoal">
                    {formatCurrencyExact(balance.share)}
                  </dd>
                </div>
              </dl>
            </li>
          )
        })}
      </ul>

      <h3 className="mt-8 font-display text-xl font-bold text-brand-900">
        Settle up
      </h3>

      {settlements.length === 0 ? (
        <p className="mt-3 rounded-2xl border border-dashed border-line p-5 text-sm text-muted">
          Everyone is settled up.
        </p>
      ) : (
        <ul className="mt-3 space-y-3">
          {settlements.map((settlement) => (
            <li
              key={`${settlement.fromId}-${settlement.toId}`}
              className="flex flex-wrap items-baseline justify-between gap-2 rounded-2xl border border-line bg-white p-4"
            >
              <p className="break-words text-charcoal">
                <span className="font-medium">{settlement.fromName}</span> pays{' '}
                <span className="font-medium">{settlement.toName}</span>
              </p>
              <p className="font-semibold text-brand-900">
                {formatCurrencyExact(settlement.amount)}
              </p>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-3 text-xs text-muted">
        Suggested payments based on the recorded expenses. Tara doesn't move
        money or track repayments yet.
      </p>
    </section>
  )
}

export default BalancesSection