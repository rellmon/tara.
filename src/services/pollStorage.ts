import { samplePolls, sampleVotes } from '../data/samplePolls'
import type { Poll, Vote } from '../types/poll'

const POLLS_KEY = 'tara.polls'
const VOTES_KEY = 'tara.votes'

function loadList<T>(key: string, fallback: T[]): T[] {
  try {
    const raw = localStorage.getItem(key)

    // Nothing saved yet (first visit): start with the sample data.
    if (raw === null) return fallback

    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return fallback

    return parsed as T[]
  } catch {
    return fallback
  }
}

function saveList<T>(key: string, list: T[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(list))
  } catch {
    // Storage may be full or blocked. Fail quietly.
  }
}

export function loadPolls(): Poll[] {
  return loadList<Poll>(POLLS_KEY, samplePolls)
}

export function savePolls(polls: Poll[]): void {
  saveList(POLLS_KEY, polls)
}

export function loadVotes(): Vote[] {
  return loadList<Vote>(VOTES_KEY, sampleVotes)
}

export function saveVotes(votes: Vote[]): void {
  saveList(VOTES_KEY, votes)
}