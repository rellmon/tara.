import { useState } from 'react'
import type { FormEvent } from 'react'
import Button from '../ui/Button'
import { useConfirm } from '../ui/useConfirm'
import type { Poll, Vote } from '../../types/poll'
import { formatShortDate } from '../../utils/format'
import { findVote, getPollResults, getVoteError } from '../../utils/polls'
import type { OptionResult } from '../../utils/polls'

interface PollCardProps {
  poll: Poll
  votes: Vote[]
  tripTitle?: string
  voterName: string
  onCastVote: (pollId: string, optionId: string, voterName: string) => void
  onClosePoll: (pollId: string) => void
  onDeletePoll: (poll: Poll) => void
}

function ResultRow({ result, badge }: { result: OptionResult; badge?: string }) {
  return (
    <span className="min-w-0 flex-1">
      <span className="flex flex-wrap items-baseline justify-between gap-x-3">
        <span className="break-words font-medium text-charcoal">
          {result.label}
          {badge && (
            <span className="ml-2 rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700">
              {badge}
            </span>
          )}
        </span>
        <span className="text-sm text-muted">
          {result.votes} {result.votes === 1 ? 'vote' : 'votes'} ·{' '}
          {result.percent}%
        </span>
      </span>
      <span
        className="mt-1.5 block h-2 overflow-hidden rounded-full bg-sage"
        aria-hidden="true"
      >
        <span
          className="block h-full rounded-full bg-brand-500"
          style={{ width: `${result.percent}%` }}
        />
      </span>
    </span>
  )
}

function PollCard({
  poll,
  votes,
  tripTitle,
  voterName,
  onCastVote,
  onClosePoll,
  onDeletePoll,
}: PollCardProps) {
  const confirm = useConfirm()
  const [choice, setChoice] = useState('')
  const [error, setError] = useState<string | undefined>(undefined)
  const [message, setMessage] = useState<string | undefined>(undefined)

  const isOpen = poll.status === 'open'
  const results = getPollResults(poll, votes)
  const existingVote = findVote(votes, poll.id, voterName)
  const existingOption = poll.options.find(
    (option) => option.id === existingVote?.optionId,
  )
  // The option picked just now, otherwise the one this person already voted for.
  const selected = choice !== '' ? choice : (existingVote?.optionId ?? '')

  function badgeFor(optionId: string): string | undefined {
    if (!results.leaderIds.includes(optionId)) return undefined
    if (results.leaderIds.length > 1) return 'Tied'
    return isOpen ? 'Leading' : 'Winner'
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage(undefined)

    const validationError = getVoteError(poll, selected, voterName)
    setError(validationError)
    if (validationError) return

    onCastVote(poll.id, selected, voterName)

    if (!existingVote) {
      setMessage('Vote recorded.')
    } else if (existingVote.optionId === selected) {
      setMessage('You already voted for that option.')
    } else {
      setMessage('Vote changed.')
    }
    setChoice('')
  }

  async function handleClose() {
    const confirmed = await confirm({
      title: 'Close this poll?',
      message: `Nobody will be able to vote or change votes on "${poll.question}" after this, and it can't be reopened.`,
      confirmLabel: 'Close poll',
    })
    if (!confirmed) return

    onClosePoll(poll.id)
  }

  const errorId = `poll-error-${poll.id}`

  return (
    <li className="rounded-2xl border border-line bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 className="min-w-0 break-words font-display text-lg font-bold text-brand-900">
          {poll.question}
        </h3>
        <span
          className={`rounded-full px-3 py-0.5 text-xs font-medium capitalize ${
            isOpen ? 'bg-brand-50 text-brand-700' : 'bg-sage text-brand-900'
          }`}
        >
          {poll.status}
        </span>
      </div>

      <p className="mt-1 text-sm text-muted">
        {tripTitle ? `Trip: ${tripTitle} · ` : ''}
        {formatShortDate(poll.createdAt)} · {results.total}{' '}
        {results.total === 1 ? 'vote' : 'votes'}
      </p>

      {isOpen ? (
        <form onSubmit={handleSubmit} noValidate className="mt-4">
          <fieldset aria-describedby={error ? errorId : undefined}>
            <legend className="sr-only">Your vote: {poll.question}</legend>
            <ul className="space-y-2">
              {results.options.map((result) => (
                <li key={result.optionId}>
                  <label className="flex min-h-11 cursor-pointer items-start gap-3 rounded-xl border border-line px-3 py-2 has-[:checked]:border-brand-600 has-[:checked]:bg-brand-50">
                    <input
                      type="radio"
                      name={`poll-vote-${poll.id}`}
                      value={result.optionId}
                      checked={selected === result.optionId}
                      onChange={() => {
                        setChoice(result.optionId)
                        setMessage(undefined)
                      }}
                      className="mt-1 h-5 w-5 shrink-0 accent-brand-600"
                    />
                    <ResultRow result={result} badge={badgeFor(result.optionId)} />
                  </label>
                </li>
              ))}
            </ul>
          </fieldset>

          {existingVote && existingOption && (
            <p className="mt-3 text-sm text-muted">
              {existingVote.voterName} voted for {existingOption.label}. Pick
              another option to change the vote.
            </p>
          )}
          {error && (
            <p id={errorId} role="alert" className="mt-3 text-sm text-red-700">
              {error}
            </p>
          )}
          {message && (
            <p role="status" className="mt-3 text-sm text-brand-700">
              {message}
            </p>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Button type="submit">
              {existingVote ? 'Change vote' : 'Vote'}
            </Button>
            <Button type="button" variant="ghost" onClick={handleClose}>
              Close poll
            </Button>
            <button
              type="button"
              onClick={() => onDeletePoll(poll)}
              aria-label={`Delete poll: ${poll.question}`}
              className="rounded-full px-3 py-1.5 text-sm font-medium text-red-700 transition-colors hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-red-700"
            >
              Delete
            </button>
          </div>
        </form>
      ) : (
        <>
          <ul className="mt-4 space-y-3">
            {results.options.map((result) => (
              <li key={result.optionId} className="flex">
                <ResultRow result={result} badge={badgeFor(result.optionId)} />
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm text-muted">Voting is closed.</p>
          <div className="mt-3">
            <button
              type="button"
              onClick={() => onDeletePoll(poll)}
              aria-label={`Delete poll: ${poll.question}`}
              className="rounded-full px-3 py-1.5 text-sm font-medium text-red-700 transition-colors hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-red-700"
            >
              Delete
            </button>
          </div>
        </>
      )}
    </li>
  )
}

export default PollCard