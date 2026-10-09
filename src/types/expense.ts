import type { BudgetCategory } from './budget'

export interface Expense {
  id: string
  tripId: string
  name: string
  amount: number // total paid in PHP, greater than 0
  category: BudgetCategory
  date: string // "YYYY-MM-DD"
  paidById: string // a Participant id
  sharedByIds: string[] // Participant ids who share the cost (equal split)
  notes: string // "" if none
}