import { sampleTrips } from '../data/sampleTrips'
import type { Trip } from '../types/trip'

const STORAGE_KEY = 'tara.trips'

export function loadTrips(): Trip[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)

    // Nothing saved yet (first visit): start with the sample trip.
    if (raw === null) return sampleTrips

    const parsed: unknown = JSON.parse(raw)

    // Stored data must be an array, otherwise ignore it.
    if (!Array.isArray(parsed)) return sampleTrips

    return parsed as Trip[]
  } catch {
    // Invalid JSON or storage unavailable.
    return sampleTrips
  }
}

export function saveTrips(trips: Trip[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trips))
  } catch {
    // Storage may be full or blocked (e.g. private mode). Fail quietly.
  }
}

export function resetTrips(): Trip[] {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
  return sampleTrips
}