export const BUDGET_CATEGORIES = [
  'transportation',
  'accommodation',
  'food',
  'activities',
  'shopping',
  'emergency',
  'other',
] as const

export type BudgetCategory = (typeof BUDGET_CATEGORIES)[number]

export const BUDGET_CATEGORY_LABELS: Record<BudgetCategory, string> = {
  transportation: 'Transportation',
  accommodation: 'Accommodation',
  food: 'Food and drinks',
  activities: 'Activities',
  shopping: 'Shopping',
  emergency: 'Emergency funds',
  other: 'Other expenses',
}

export interface BudgetItem {
  id: string
  tripId: string
  name: string
  category: BudgetCategory
  amount: number // group total in PHP, 0 or more
}