import { sampleParticipants } from '../data/sampleParticipants'
import type { Participant } from '../types/participant'

const STORAGE_KEY = 'tara.participants'

export function loadParticipants(): Participant[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)

    // Nothing saved yet (first visit): start with the sample participants.
    if (raw === null) return sampleParticipants

    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return sampleParticipants

    return parsed as Participant[]
  } catch {
    return sampleParticipants
  }
}

export function saveParticipants(participants: Participant[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(participants))
  } catch {
    // Storage may be full or blocked. Fail quietly.
  }
}