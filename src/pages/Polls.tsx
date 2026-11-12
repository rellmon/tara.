import { useState } from 'react'
import PollCard from '../components/polls/PollCard'
import PollForm from '../components/polls/PollForm'
import type { PollFormValues } from '../components/polls/PollForm'
import { useConfirm } from '../components/ui/useConfirm'
import type { Poll, Vote } from '../types/poll'
import type { Trip } from '../types/trip'

interface PollsProps {
  polls: Poll[]
  votes: Vote[]
  trips: Trip[]
  onAddPoll: (poll: Poll) => void
  onDeletePoll: (pollId: string) => void
  onCastVote: (pollId: string, optionId: string, voterName: string) => void
  onClosePoll: (pollId: string) => void
}

function Polls({
  polls,
  votes,
  trips,
  onAddPoll,
  onDeletePoll,
  onCastVote,
  onClosePoll,
}: PollsProps) {
  const confirm = useConfirm()
  const [voterName, setVoterName] = useState('')

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

  async function handleDelete(poll: Poll) {
    const confirmed = await confirm({
      title: 'Delete this poll?',
      message: `"${poll.question}" and its votes will be deleted. This can't be undone.`,
      confirmLabel: 'Delete poll',
      destructive: true,
    })
    if (!confirmed) return

    onDeletePoll(poll.id)
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-bold tracking-tight text-brand-900 sm:text-4xl">Polls</h1>
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

      <div className="mt-4 max-w-md">
        <label htmlFor="voter-name" className="text-sm font-medium">
          Your name (to vote)
        </label>
        <input
          id="voter-name"
          type="text"
          value={voterName}
          onChange={(e) => setVoterName(e.target.value)}
          placeholder="Alex"
          className="mt-1 w-full rounded-xl border border-line bg-white px-4 py-2.5 text-charcoal focus-visible:outline-2 focus-visible:outline-brand-600"
        />
        <p className="mt-1 text-xs text-muted">
          Typed on this device. It isn't a verified identity, so anyone using
          this browser can vote under any name.
        </p>
      </div>

      {sortedPolls.length === 0 ? (
        <p className="mt-4 rounded-2xl border border-dashed border-line p-5 text-sm text-muted">
          No polls yet. Create your first one above.
        </p>
      ) : (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {sortedPolls.map((poll) => (
            <PollCard
              key={poll.id}
              poll={poll}
              votes={votes}
              tripTitle={tripTitle(poll.tripId)}
              voterName={voterName}
              onCastVote={onCastVote}
              onClosePoll={onClosePoll}
              onDeletePoll={handleDelete}
            />
          ))}
        </ul>
      )}
    </div>
  )
}

export default Polls