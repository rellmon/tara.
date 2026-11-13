import type { Expense } from '../types/expense'
import { sampleDates } from './sampleDates'

const everyone = [
  'sample-p-alex',
  'sample-p-jamie',
  'sample-p-sam',
  'sample-p-taylor',
  'sample-p-riley',
]

export const sampleExpenses: Expense[] = [
  {
    id: 'sample-exp-1',
    tripId: 'sample-la-union',
    name: 'Gasoline',
    amount: 2000,
    category: 'transportation',
    date: sampleDates.tripDay(0),
    paidById: 'sample-p-alex',
    sharedByIds: everyone,
    notes: '',
  },
  {
    id: 'sample-exp-2',
    tripId: 'sample-la-union',
    name: 'Grocery',
    amount: 1200,
    category: 'food',
    date: sampleDates.tripDay(-1),
    paidById: 'sample-p-jamie',
    sharedByIds: everyone,
    notes: 'Snacks and breakfast for the house.',
  },
  {
    id: 'sample-exp-3',
    tripId: 'sample-la-union',
    name: 'Accommodation deposit',
    amount: 3000,
    category: 'accommodation',
    date: sampleDates.tripDay(-25),
    paidById: 'sample-p-sam',
    sharedByIds: everyone,
    notes: '',
  },
  {
    id: 'sample-exp-4',
    tripId: 'sample-la-union',
    name: 'Dinner at the beach',
    amount: 1200,
    category: 'food',
    date: sampleDates.tripDay(0),
    paidById: 'sample-p-alex',
    sharedByIds: [
      'sample-p-alex',
      'sample-p-jamie',
      'sample-p-sam',
      'sample-p-taylor',
    ],
    notes: 'Riley skipped dinner.',
  },
]