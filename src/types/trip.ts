export type TripStatus =
  | 'planning'
  | 'upcoming'
  | 'ongoing'
  | 'completed'
  | 'archived'

export interface Trip {
  id: string
  title: string
  destination: string
  startDate: string // "YYYY-MM-DD"
  endDate: string // "YYYY-MM-DD"
  description: string
  coverImage: string
  status: TripStatus
  travelerCount: number
  estimatedBudgetPerPerson: number // in PHP
}