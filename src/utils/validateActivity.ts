export interface ActivityInput {
  date: string
  title: string
  startTime: string
  endTime: string
  estimatedCost: number
  url: string
}

export type ActivityFormErrors = Partial<Record<keyof ActivityInput, string>>

// "HH:mm" in 24-hour time, e.g. "08:00" or "23:59"
const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/

function isValidUrl(value: string): boolean {
  try {
    const parsed = new URL(value)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

export function validateActivity(
  input: ActivityInput,
  tripDays: string[],
): ActivityFormErrors {
  const errors: ActivityFormErrors = {}

  if (input.title.trim() === '') {
    errors.title = 'Activity title is required.'
  }

  if (!tripDays.includes(input.date)) {
    errors.date = 'Please choose a day within the trip.'
  }

  if (!TIME_PATTERN.test(input.startTime)) {
    errors.startTime = 'Please enter a valid start time.'
  }

  if (input.endTime !== '') {
    if (!TIME_PATTERN.test(input.endTime)) {
      errors.endTime = 'Please enter a valid end time.'
    } else if (!errors.startTime && input.endTime <= input.startTime) {
      errors.endTime = 'End time must be after the start time.'
    }
  }

  if (!Number.isFinite(input.estimatedCost) || input.estimatedCost < 0) {
    errors.estimatedCost = 'Cost must be 0 or more.'
  }

  if (input.url !== '' && !isValidUrl(input.url)) {
    errors.url = 'Enter a full link starting with http:// or https://.'
  }

  return errors
}