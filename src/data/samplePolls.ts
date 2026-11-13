import type { Poll, Vote } from '../types/poll'
import { sampleDates } from './sampleDates'

export const samplePolls: Poll[] = [
  {
    id: 'sample-poll-1',
    tripId: null,
    question: 'Where should we go this weekend?',
    options: [
      { id: 'sample-opt-1a', label: 'La Union' },
      { id: 'sample-opt-1b', label: 'Tagaytay' },
      { id: 'sample-opt-1c', label: 'Batangas' },
      { id: 'sample-opt-1d', label: 'Baguio' },
    ],
    status: 'open',
    createdAt: sampleDates.daysAgoAt(2, 10, 0),
  },
  {
    id: 'sample-poll-2',
    tripId: 'sample-la-union',
    question: 'What should we do on Day 2?',
    options: [
      { id: 'sample-opt-2a', label: 'Surf lesson' },
      { id: 'sample-opt-2b', label: 'Food trip in San Fernando' },
      { id: 'sample-opt-2c', label: 'Sunset at the lighthouse' },
    ],
    status: 'closed',
    createdAt: sampleDates.daysAgoAt(5, 8, 30),
  },
]

export const sampleVotes: Vote[] = [
  { id: 'sample-vote-1', pollId: 'sample-poll-1', optionId: 'sample-opt-1a', voterName: 'Alex' },
  { id: 'sample-vote-2', pollId: 'sample-poll-1', optionId: 'sample-opt-1b', voterName: 'Jamie' },
  { id: 'sample-vote-3', pollId: 'sample-poll-1', optionId: 'sample-opt-1a', voterName: 'Sam' },
  { id: 'sample-vote-4', pollId: 'sample-poll-1', optionId: 'sample-opt-1d', voterName: 'Taylor' },
  { id: 'sample-vote-5', pollId: 'sample-poll-2', optionId: 'sample-opt-2a', voterName: 'Alex' },
  { id: 'sample-vote-6', pollId: 'sample-poll-2', optionId: 'sample-opt-2a', voterName: 'Jamie' },
  { id: 'sample-vote-7', pollId: 'sample-poll-2', optionId: 'sample-opt-2b', voterName: 'Riley' },
]