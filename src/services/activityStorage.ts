import { sampleActivities } from '../data/sampleActivities'
import type { ItineraryActivity } from '../types/itinerary'

const STORAGE_KEY = 'tara.activities'

export function loadActivities(): ItineraryActivity[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)

    // Nothing saved yet (first visit): start with the sample activities.
    if (raw === null) return sampleActivities

    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return sampleActivities

    return parsed as ItineraryActivity[]
  } catch {
    return sampleActivities
  }
}

export function saveActivities(activities: ItineraryActivity[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(activities))
  } catch {
    // Storage may be full or blocked. Fail quietly.
  }
}