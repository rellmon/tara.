export const ACTIVITY_CATEGORIES = [
  'transportation',
  'food',
  'accommodation',
  'sightseeing',
  'adventure',
  'shopping',
  'free-time',
  'other',
] as const

export type ActivityCategory = (typeof ACTIVITY_CATEGORIES)[number]

export interface ItineraryActivity {
  id: string
  tripId: string
  date: string // "YYYY-MM-DD"
  title: string
  locationName: string // "" if none
  startTime: string // "HH:mm" (24-hour)
  endTime: string // "HH:mm", or "" if none
  description: string
  estimatedCost: number // in PHP, 0 or more
  category: ActivityCategory
  notes: string
  url: string // booking or reference link, "" if none
  completed: boolean
}