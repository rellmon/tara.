export interface BudgetItemInput {
  name: string
  amount: number
}

export type BudgetItemErrors = Partial<Record<keyof BudgetItemInput, string>>

export function validateBudgetItem(input: BudgetItemInput): BudgetItemErrors {
  const errors: BudgetItemErrors = {}

  if (input.name.trim() === '') {
    errors.name = 'Item name is required.'
  }

  if (!Number.isFinite(input.amount) || input.amount < 0) {
    errors.amount = 'Enter an amount of 0 or more.'
  }

  return errors
}