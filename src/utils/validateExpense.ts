import { isValid, parseISO } from 'date-fns'

export interface ExpenseInput {
  name: string
  amount: number
  date: string
  paidById: string
  sharedByIds: string[]
}

export type ExpenseErrors = Partial<Record<keyof ExpenseInput, string>>

export function validateExpense(
  input: ExpenseInput,
  participantIds: string[],
): ExpenseErrors {
  const errors: ExpenseErrors = {}

  if (input.name.trim() === '') {
    errors.name = 'Expense name is required.'
  }

  if (!Number.isFinite(input.amount) || input.amount <= 0) {
    errors.amount = 'Enter an amount greater than 0.'
  } else if (Math.abs(input.amount * 100 - Math.round(input.amount * 100)) > 1e-6) {
    errors.amount = 'Use at most 2 decimal places.'
  }

  if (input.date === '' || !isValid(parseISO(input.date))) {
    errors.date = 'Please choose a valid date.'
  }

  if (!participantIds.includes(input.paidById)) {
    errors.paidById = 'Choose who paid.'
  }

  if (input.sharedByIds.length === 0) {
    errors.sharedByIds = 'Choose at least one person to share the cost.'
  } else if (!input.sharedByIds.every((id) => participantIds.includes(id))) {
    errors.sharedByIds = 'Some selected people are not on this trip.'
  }

  return errors
}