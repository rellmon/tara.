export const MIN_POLL_OPTIONS = 2
export const MAX_POLL_OPTIONS = 10
const MAX_QUESTION_LENGTH = 120
const MAX_OPTION_LENGTH = 60

export interface PollInput {
  question: string
  options: string[]
}

export type PollErrors = Partial<Record<keyof PollInput, string>>

// Trims every option and drops the blank ones.
export function cleanPollOptions(options: string[]): string[] {
  return options.map((option) => option.trim()).filter((option) => option !== '')
}

export function validatePoll(input: PollInput): PollErrors {
  const errors: PollErrors = {}

  const question = input.question.trim()
  if (question === '') {
    errors.question = 'Question is required.'
  } else if (question.length > MAX_QUESTION_LENGTH) {
    errors.question = `Question must be ${MAX_QUESTION_LENGTH} characters or fewer.`
  }

  const labels = cleanPollOptions(input.options)

  if (labels.length < MIN_POLL_OPTIONS) {
    errors.options = `Add at least ${MIN_POLL_OPTIONS} options.`
  } else if (labels.length > MAX_POLL_OPTIONS) {
    errors.options = `Use ${MAX_POLL_OPTIONS} options or fewer.`
  } else if (labels.some((label) => label.length > MAX_OPTION_LENGTH)) {
    errors.options = `Each option must be ${MAX_OPTION_LENGTH} characters or fewer.`
  } else if (
    new Set(labels.map((label) => label.toLowerCase())).size !== labels.length
  ) {
    errors.options = 'Each option must be different.'
  }

  return errors
}