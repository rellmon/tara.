import { describe, expect, it } from 'vitest'
import type { Poll, Vote } from '../types/poll'
import { applyVote, getPollResults, getVoteError } from './polls'

const poll: Poll = {
  id: 'p1',
  tripId: null,
  question: 'Where?',
  options: [
    { id: 'o1', label: 'La Union' },
    { id: 'o2', label: 'Tagaytay' },
    { id: 'o3', label: 'Baguio' },
  ],
  status: 'open',
  createdAt: '2026-10-08T10:00:00.000Z',
}

const closedPoll: Poll = { ...poll, status: 'closed' }

function vote(id: string, optionId: string, voterName: string, pollId = 'p1'): Vote {
  return { id, pollId, optionId, voterName }
}

describe('getPollResults', () => {
  it('counts votes and rounds percentages', () => {
    const results = getPollResults(poll, [
      vote('v1', 'o1', 'A'),
      vote('v2', 'o1', 'B'),
      vote('v3', 'o2', 'C'),
      vote('v4', 'o3', 'D'),
    ])

    expect(results.total).toBe(4)
    expect(results.options.map((o) => [o.votes, o.percent])).toEqual([
      [2, 50],
      [1, 25],
      [1, 25],
    ])
    expect(results.leaderIds).toEqual(['o1'])
  })

  it('shows zeros and no leader when nobody voted', () => {
    const results = getPollResults(poll, [])

    expect(results.total).toBe(0)
    expect(results.options.every((o) => o.votes === 0 && o.percent === 0)).toBe(true)
    expect(results.leaderIds).toEqual([])
  })

  it('reports a tie', () => {
    const results = getPollResults(poll, [vote('v1', 'o1', 'A'), vote('v2', 'o2', 'B')])

    expect(results.leaderIds).toEqual(['o1', 'o2'])
  })

  it('ignores votes from other polls and for unknown options', () => {
    const results = getPollResults(poll, [
      vote('v1', 'o1', 'A'),
      vote('v2', 'missing', 'B'),
      vote('v3', 'o1', 'C', 'other-poll'),
    ])

    expect(results.total).toBe(1)
    expect(results.options[0].votes).toBe(1)
  })
})

describe('getVoteError', () => {
  it('accepts a valid vote', () => {
    expect(getVoteError(poll, 'o1', 'Alex')).toBeUndefined()
  })

  it('rejects votes on a closed poll', () => {
    expect(getVoteError(closedPoll, 'o1', 'Alex')).toBeDefined()
  })

  it('requires a name, including not just spaces', () => {
    expect(getVoteError(poll, 'o1', '')).toBeDefined()
    expect(getVoteError(poll, 'o1', '   ')).toBeDefined()
  })

  it('rejects a name that is too long', () => {
    expect(getVoteError(poll, 'o1', 'x'.repeat(41))).toBeDefined()
  })

  it('rejects an option that is not in the poll', () => {
    expect(getVoteError(poll, 'nope', 'Alex')).toBeDefined()
  })
})

describe('applyVote', () => {
  it('adds a new vote with a trimmed name', () => {
    expect(applyVote([], poll, 'o1', '  Alex ', 'v1')).toEqual([
      { id: 'v1', pollId: 'p1', optionId: 'o1', voterName: 'Alex' },
    ])
  })

  it('changes an existing vote (same name, any case) instead of adding one', () => {
    const existing = [vote('v1', 'o1', 'Alex')]
    const result = applyVote(existing, poll, 'o2', ' alex ', 'new-id')

    expect(result).toEqual([
      { id: 'v1', pollId: 'p1', optionId: 'o2', voterName: 'Alex' },
    ])
  })

  it('leaves votes in other polls alone, even for the same name', () => {
    const existing = [vote('v9', 'o1', 'Alex', 'other-poll')]
    const result = applyVote(existing, poll, 'o2', 'Alex', 'v1')

    expect(result).toHaveLength(2)
    expect(result[0]).toEqual(existing[0])
    expect(result[1].pollId).toBe('p1')
  })

  it('ignores a vote on a closed poll', () => {
    const existing = [vote('v1', 'o1', 'Alex')]

    expect(applyVote(existing, closedPoll, 'o2', 'Alex', 'x')).toBe(existing)
  })

  it('does not modify the original list', () => {
    const existing = [vote('v1', 'o1', 'Alex')]
    const copy = JSON.parse(JSON.stringify(existing))

    applyVote(existing, poll, 'o2', 'Alex', 'n')

    expect(existing).toEqual(copy)
  })
})