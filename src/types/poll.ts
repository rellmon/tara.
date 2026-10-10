export type PollStatus = 'open' | 'closed'

export interface PollOption {
  id: string
  label: string
}

export interface Poll {
  id: string
  tripId: string | null // null for a poll that isn't tied to a trip
  question: string
  options: PollOption[]
  status: PollStatus
  createdAt: string // ISO timestamp
}

// One person's vote in one poll. Changing a vote edits this record.
export interface Vote {
  id: string
  pollId: string
  optionId: string
  voterName: string // typed on this device; not a verified identity
}