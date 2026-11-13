import type { Trip } from '../types/trip'
import { sampleDates } from './sampleDates'

export const sampleTrips: Trip[] = [
  {
    id: 'sample-la-union',
    title: 'Barkada La Union Escape',
    destination: 'San Juan, La Union',
    startDate: sampleDates.tripStart,
    endDate: sampleDates.tripEnd,
    description:
      'A three-day beach trip with surfing, food trips, and sunset watching.',
    coverImage: '',
    status: 'planning',
    travelerCount: 5,
    estimatedBudgetPerPerson: 15000,
  },
]