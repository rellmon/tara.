import PollForm from '../components/polls/PollForm'
import type { PollFormValues } from '../components/polls/PollForm'
import type { Poll, Vote } from '../types/poll'
import type { Trip } from '../types/trip'
import { formatShortDate } from '../utils/format'

interface PollsProps {
  polls: Poll[]
  votes: Vote[]
  trips: Trip[]
  onAddPoll: (poll: Poll) => void
  onDeletePoll: (pollId: string) => void
}

function Polls({ polls, votes, trips, onAddPoll, onDeletePoll }: PollsProps) {
  const sortedPolls = [...polls].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  )

  function tripTitle(tripId: string | null): string | undefined {
    if (tripId === null) return undefined
    return trips.find((trip) => trip.id === tripId)?.title
  }

  function handleCreate(values: PollFormValues) {
    onAddPoll({
      id: crypto.randomUUID(),
      tripId: values.tripId,
      question: values.question,
      options: values.options.map((label) => ({
        id: crypto.randomUUID(),
        label,
      })),
      status: 'open',
      createdAt: new Date().toISOString(),
    })
  }

  function handleDelete(poll: Poll) {
    const confirmed = window.confirm(
      `Delete "${poll.question}" and its votes? This can't be undone.`,
    )
    if (!confirmed) return

    onDeletePoll(poll.id)
  }

  return (
    <div>
      <h1 className="font-display text-4xl font-bold text-brand-600">Polls</h1>
      <p className="mt-2 max-w-2xl text-muted">
        Can't decide where to go? Make a poll.
      </p>
      <p className="mt-3 max-w-2xl rounded-2xl bg-sage px-4 py-3 text-sm text-brand-900">
        Polls are saved on this device only. Friends can't vote from their own
        phones until Tara has accounts and a shared database.
      </p>

      <div className="mt-8 max-w-xl">
        <PollForm trips={trips} onSubmit={handleCreate} />
      </div>

      <h2 className="mt-12 font-display text-2xl font-bold text-brand-900">
        Your polls
      </h2>

      {sortedPolls.length === 0 ? (
        <p className="mt-4 rounded-2xl border border-dashed border-line p-5 text-sm text-muted">
          No polls yet. Create your first one above.
        </p>
      ) : (
        <ul className="mt-4 grid gap-4 sm:grid-cols-2">
          {sortedPolls.map((poll) => {
            const voteCount = votes.filter((vote) => vote.pollId === poll.id).length
            const trip = tripTitle(poll.tripId)

            return (
              <li
                key={poll.id}
                className="rounded-2xl border border-line bg-white p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <h3 className="min-w-0 break-words font-display text-lg font-bold text-brand-900">
                    {poll.question}
                  </h3>
                  <span
                    className={`rounded-full px-3 py-0.5 text-xs font-medium capitalize ${
                      poll.status === 'open'
                        ? 'bg-brand-50 text-brand-700'
                        : 'bg-sage text-brand-900'
                    }`}
                  >
                    {poll.status}
                  </span>
                </div>

                <p className="mt-1 text-sm text-muted">
                  {trip ? `Trip: ${trip} · ` : ''}
                  {formatShortDate(poll.createdAt)} · {voteCount}{' '}
                  {voteCount === 1 ? 'vote' : 'votes'}
                </p>

                <ul className="mt-3 space-y-1 text-sm text-charcoal">
                  {poll.options.map((option) => (
                    <li key={option.id} className="break-words">
                      • {option.label}
                    </li>
                  ))}
                </ul>

                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => handleDelete(poll)}
                    aria-label={`Delete poll: ${poll.question}`}
                    className="rounded-full px-3 py-1.5 text-sm font-medium text-red-700 transition-colors hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-red-700"
                  >
                    Delete
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export default Polls