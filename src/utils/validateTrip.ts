import { isValid, parseISO } from 'date-fns'

export interface TripFormInput {
  title: string
  destination: string
  startDate: string
  endDate: string
  coverImage: string
  travelerCount: number
  estimatedBudgetPerPerson: number
}

export type TripFormErrors = Partial<Record<keyof TripFormInput, string>>

const MAX_COVER_URL_LENGTH = 500

// Only normal web links. Blocks things like "javascript:" and "file:".
function isHttpUrl(value: string): boolean {
  try {
    const parsed = new URL(value)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

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

  const cover = input.coverImage.trim()
  if (cover !== '') {
    if (cover.length > MAX_COVER_URL_LENGTH) {
      errors.coverImage = `Link must be ${MAX_COVER_URL_LENGTH} characters or fewer.`
    } else if (!isHttpUrl(cover)) {
      errors.coverImage = 'Enter a full link starting with http:// or https://.'
    }
  }

  if (!Number.isInteger(input.travelerCount) || input.travelerCount < 1) {
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