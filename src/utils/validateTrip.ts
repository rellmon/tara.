import { isValid, parseISO } from 'date-fns'

export interface TripFormInput {
  title: string
  destination: string
  startDate: string
  endDate: string
  travelerCount: number
  estimatedBudgetPerPerson: number
}

export type TripFormErrors = Partial<Record<keyof TripFormInput, string>>

export function validateTripForm(input: TripFormInput): TripFormErrors {
  const errors: TripFormErrors = {}

  if (input.title.trim() === '') {
    errors.title = 'Trip title is required.'
  }

  if (input.destination.trim() === '') {
    errors.destination = 'Destination is required.'
  }

  const start = parseISO(input.startDate)
  const end = parseISO(input.endDate)

  if (input.startDate === '' || !isValid(start)) {
    errors.startDate = 'Please choose a valid start date.'
  }

  if (input.endDate === '' || !isValid(end)) {
    errors.endDate = 'Please choose a valid end date.'
  }

  if (!errors.startDate && !errors.endDate && start > end) {
    errors.endDate = 'End date cannot be before the start date.'
  }

  if (
    !Number.isInteger(input.travelerCount) ||
    input.travelerCount < 1
  ) {
    errors.travelerCount = 'Enter at least 1 traveler (whole number).'
  }

  if (
    !Number.isFinite(input.estimatedBudgetPerPerson) ||
    input.estimatedBudgetPerPerson < 0
  ) {
    errors.estimatedBudgetPerPerson = 'Budget must be 0 or more.'
  }

  return errors
}