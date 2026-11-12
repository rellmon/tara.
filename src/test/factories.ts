import type { BudgetItem } from '../types/budget'
import type { Expense } from '../types/expense'
import type { ItineraryActivity } from '../types/itinerary'
import type { Trip } from '../types/trip'

// Each helper builds a valid object, so a test only spells out what it cares about.

export function makeActivity(
  overrides: Partial<ItineraryActivity> = {},
): ItineraryActivity {
  return {
    id: 'a1',
    tripId: 't1',
    date: '2026-11-14',
    title: 'Activity',
    locationName: '',
    startTime: '09:00',
    endTime: '',
    description: '',
    estimatedCost: 0,
    category: 'sightseeing',
    notes: '',
    url: '',
    completed: false,
    ...overrides,
  }
}

export function makeBudgetItem(overrides: Partial<BudgetItem> = {}): BudgetItem {
  return {
    id: 'b1',
    tripId: 't1',
    name: 'Item',
    category: 'other',
    amount: 0,
    ...overrides,
  }
}

export function makeExpense(overrides: Partial<Expense> = {}): Expense {
  return {
    id: 'e1',
    tripId: 't1',
    name: 'Expense',
    amount: 100,
    category: 'other',
    date: '2026-11-14',
    paidById: 'p1',
    sharedByIds: ['p1'],
    notes: '',
    ...overrides,
  }
}

export function makeTrip(overrides: Partial<Trip> = {}): Trip {
  return {
    id: 't1',
    title: 'Trip',
    destination: 'Somewhere',
    startDate: '2026-11-14',
    endDate: '2026-11-16',
    description: '',
    coverImage: '',
    status: 'planning',
    travelerCount: 2,
    estimatedBudgetPerPerson: 1000,
    ...overrides,
  }
}