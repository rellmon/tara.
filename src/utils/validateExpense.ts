import { isValid, parseISO } from 'date-fns'
import { formatCurrencyExact } from './format'

export interface ExpenseInput {
  name: string
  amount: number
  date: string
  paidById: string
  sharedByIds: string[]
  customShares?: Record<string, number>
}

export type ExpenseErrors = Partial<Record<keyof ExpenseInput, string>>

function hasAtMostTwoDecimals(value: number): boolean {
  return Math.abs(value * 100 - Math.round(value * 100)) <= 1e-6
}

// Returns an error message, or undefined when the custom split is valid.
function validateCustomShares(
  total: number,
  shares: Record<string, number>,
  participantIds: string[],
): string | undefined {
  const entries = Object.entries(shares)

  if (entries.length === 0) {
    return 'Enter an amount for at least one person.'
  }

  let assignedCentavos = 0
  for (const [id, value] of entries) {
    if (!participantIds.includes(id)) {
      return 'Some selected people are not on this trip.'
    }
    if (!Number.isFinite(value) || value <= 0) {
      return 'Each share must be greater than 0. Leave a person blank if they are not sharing.'
    }
    if (!hasAtMostTwoDecimals(value)) {
      return 'Use at most 2 decimal places for each share.'
    }
    assignedCentavos += Math.round(value * 100)
  }

  if (assignedCentavos !== Math.round(total * 100)) {
    return `Shares add up to ${formatCurrencyExact(assignedCentavos / 100)}, but the expense is ${formatCurrencyExact(total)}.`
  }

  return undefined
}

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
  } else if (!hasAtMostTwoDecimals(input.amount)) {
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

  // The sum can only be checked against a valid amount.
  if (input.customShares !== undefined && !errors.amount) {
    const message = validateCustomShares(
      input.amount,
      input.customShares,
      participantIds,
    )
    if (message) errors.customShares = message
  }

  return errors
}