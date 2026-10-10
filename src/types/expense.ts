import type { BudgetCategory } from './budget'

export interface Expense {
  id: string
  tripId: string
  name: string
  amount: number // total paid in PHP, greater than 0
  category: BudgetCategory
  date: string // "YYYY-MM-DD"
  paidById: string // a Participant id
  sharedByIds: string[] // Participant ids who share the cost
  // Exact amount per person. When missing, the cost is split equally.
  customShares?: Record<string, number>
  notes: string // "" if none
}