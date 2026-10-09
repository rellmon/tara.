import type { BudgetItem } from '../types/budget'

export const sampleBudgetItems: BudgetItem[] = [
  {
    id: 'sample-budget-1',
    tripId: 'sample-la-union',
    name: 'Beach house, 2 nights',
    category: 'accommodation',
    amount: 15000,
  },
  {
    id: 'sample-budget-2',
    tripId: 'sample-la-union',
    name: 'Van rental and fuel',
    category: 'transportation',
    amount: 12000,
  },
  {
    id: 'sample-budget-3',
    tripId: 'sample-la-union',
    name: 'Tolls and parking',
    category: 'transportation',
    amount: 2500,
  },
  {
    id: 'sample-budget-4',
    tripId: 'sample-la-union',
    name: 'Groceries for cooking',
    category: 'food',
    amount: 4000,
  },
  {
    id: 'sample-budget-5',
    tripId: 'sample-la-union',
    name: 'Emergency fund',
    category: 'emergency',
    amount: 5000,
  },
]