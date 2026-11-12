import type { Poll, Vote } from '../types/poll'

const MAX_VOTER_NAME_LENGTH = 40

function normalize(name: string): string {
  return name.trim().toLowerCase()
}

export interface OptionResult {
  optionId: string
  label: string
  votes: number
  percent: number // whole number from 0 to 100
}

export interface PollResults {
  options: OptionResult[] // same order as the poll's options
  total: number
  leaderIds: string[] // option(s) with the most votes; empty when nobody voted
}

export function getPollResults(poll: Poll, votes: Vote[]): PollResults {
  const counts = new Map<string, number>()
  for (const option of poll.options) {
    counts.set(option.id, 0)
  }

  // Votes for other polls or for removed options are ignored.
  for (const vote of votes) {
    if (vote.pollId !== poll.id) continue
    const current = counts.get(vote.optionId)
    if (current !== undefined) counts.set(vote.optionId, current + 1)
  }

  let total = 0
  for (const count of counts.values()) {
    total += count
  }

  const options = poll.options.map((option) => {
    const optionVotes = counts.get(option.id) ?? 0

    return {
      optionId: option.id,
      label: option.label,
      votes: optionVotes,
      percent: total === 0 ? 0 : Math.round((optionVotes / total) * 100),
    }
  })

  const most = Math.max(0, ...options.map((option) => option.votes))
  const leaderIds =
    most > 0
      ? options
          .filter((option) => option.votes === most)
          .map((option) => option.optionId)
      : []

  return { options, total, leaderIds }
}

// The existing vote by this name in this poll, if any.
export function findVote(
  votes: Vote[],
  pollId: string,
  voterName: string,
): Vote | undefined {
  const key = normalize(voterName)
  if (key === '') return undefined

  return votes.find(
    (vote) => vote.pollId === pollId && normalize(vote.voterName) === key,
  )
}

// Returns an error message, or undefined when the vote is allowed.
export function getVoteError(
  poll: Poll,
  optionId: string,
  voterName: string,
): string | undefined {
  if (poll.status !== 'open') {
    return 'Voting is closed for this poll.'
  }

  const name = voterName.trim()
  if (name === '') {
    return 'Enter your name to vote.'
  }
  if (name.length > MAX_VOTER_NAME_LENGTH) {
    return `Name must be ${MAX_VOTER_NAME_LENGTH} characters or fewer.`
  }

  if (!poll.options.some((option) => option.id === optionId)) {
    return 'Choose an option to vote for.'
  }

  return undefined
}

// Adds a vote, or changes the existing vote by the same name.
// Invalid votes (closed poll, no name, unknown option) return the list unchanged.
export function applyVote(
  votes: Vote[],
  poll: Poll,
  optionId: string,
  voterName: string,
  newVoteId: string,
): Vote[] {
  if (getVoteError(poll, optionId, voterName) !== undefined) return votes

  const existing = findVote(votes, poll.id, voterName)
  if (existing) {
    return votes.map((vote) =>
      vote.id === existing.id ? { ...vote, optionId } : vote,
    )
  }

  return [
    ...votes,
    { id: newVoteId, pollId: poll.id, optionId, voterName: voterName.trim() },
  ]
}