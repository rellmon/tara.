import { describe, expect, it, vi } from 'vitest'
import { sampleActivities } from '../data/sampleActivities'
import { sampleBudgetItems } from '../data/sampleBudgetItems'
import { sampleExpenses } from '../data/sampleExpenses'
import { samplePackingItems } from '../data/samplePackingItems'
import { sampleParticipants } from '../data/sampleParticipants'
import { samplePolls, sampleVotes } from '../data/samplePolls'
import { sampleTrips } from '../data/sampleTrips'
import { loadActivities, saveActivities } from './activityStorage'
import { loadBudgetItems, saveBudgetItems } from './budgetStorage'
import { loadExpenses, saveExpenses } from './expenseStorage'
import { loadPackingItems, savePackingItems } from './packingStorage'
import { loadParticipants, saveParticipants } from './participantStorage'
import { loadPolls, loadVotes, savePolls, saveVotes } from './pollStorage'
import { loadTrips, saveTrips } from './tripStorage'

interface StorageCase {
  name: string
  key: string
  sample: unknown[]
  load: () => unknown
  saveSample: () => void
  saveEmpty: () => void
}

// Wraps one load/save pair so every service can be tested the same way.
function makeCase<T>(
  name: string,
  key: string,
  sample: T[],
  load: () => T[],
  save: (items: T[]) => void,
): StorageCase {
  return {
    name,
    key,
    sample,
    load,
    saveSample: () => save(sample),
    saveEmpty: () => save([]),
  }
}

const cases: StorageCase[] = [
  makeCase('trips', 'tara.trips', sampleTrips, loadTrips, saveTrips),
  makeCase('activities', 'tara.activities', sampleActivities, loadActivities, saveActivities),
  makeCase('budget items', 'tara.budgetItems', sampleBudgetItems, loadBudgetItems, saveBudgetItems),
  makeCase('participants', 'tara.participants', sampleParticipants, loadParticipants, saveParticipants),
  makeCase('expenses', 'tara.expenses', sampleExpenses, loadExpenses, saveExpenses),
  makeCase('packing items', 'tara.packingItems', samplePackingItems, loadPackingItems, savePackingItems),
  makeCase('polls', 'tara.polls', samplePolls, loadPolls, savePolls),
  makeCase('votes', 'tara.votes', sampleVotes, loadVotes, saveVotes),
]

describe('storage keys', () => {
  it('are all different, so one list can never overwrite another', () => {
    expect(new Set(cases.map((c) => c.key)).size).toBe(cases.length)
  })
})

describe.each(cases)('$name storage', ({ key, sample, load, saveSample, saveEmpty }) => {
  it('starts with the sample data on the first visit', () => {
    expect(load()).toEqual(sample)
  })

  it('saves under its own key', () => {
    saveSample()

    expect(JSON.parse(localStorage.getItem(key) ?? 'null')).toEqual(sample)
  })

  it('keeps an empty saved list empty instead of bringing the samples back', () => {
    saveEmpty()

    expect(load()).toEqual([])
  })

  it('falls back to the samples when the saved text is not valid JSON', () => {
    localStorage.setItem(key, '{{{')

    expect(load()).toEqual(sample)
  })

  it('falls back to the samples when the saved data is not a list', () => {
    localStorage.setItem(key, '{"a":1}')

    expect(load()).toEqual(sample)
  })

  it('does not crash when reading is blocked', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('storage blocked')
    })

    expect(load()).toEqual(sample)
  })

  it('does not crash when saving is blocked', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('storage full')
    })

    expect(() => saveSample()).not.toThrow()
  })
})