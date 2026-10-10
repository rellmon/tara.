import { BUDGET_CATEGORIES } from '../types/budget'
import type { BudgetCategory, BudgetItem } from '../types/budget'
import type { Expense } from '../types/expense'
import type { ItineraryActivity } from '../types/itinerary'
import type { Trip } from '../types/trip'
import { getEstimatedBreakdown } from './budget'
import { getSpendingByCategory, sumExpenses } from './expenseSummary'

export interface CategoryComparison {
  category: BudgetCategory
  estimated: number
  actual: number
  difference: number // estimated - actual; negative means overspent
}

export interface BudgetComparison {
  planned: number
  estimated: number
  actual: number
  rows: CategoryComparison[]
}

function toCentavos(amount: number): number {
  return Math.round(amount * 100)
}

export function getBudgetComparison(
  trip: Trip,
  activities: ItineraryActivity[],
  budgetItems: BudgetItem[],
  expenses: Expense[],
): BudgetComparison {
  const estimate = getEstimatedBreakdown(trip.id, activities, budgetItems)
  const tripExpenses = expenses.filter((expense) => expense.tripId === trip.id)
  const spentByCategory = getSpendingByCategory(tripExpenses)

  const rows: CategoryComparison[] = BUDGET_CATEGORIES.map((category) => {
    const estimated = estimate.byCategory[category]
    const actual = spentByCategory[category]

    return {
      category,
      estimated,
      actual,
      difference: (toCentavos(estimated) - toCentavos(actual)) / 100,
    }
  }).filter((row) => row.estimated > 0 || row.actual > 0)

  return {
    planned: toCentavos(trip.travelerCount * trip.estimatedBudgetPerPerson) / 100,
    estimated: estimate.total,
    actual: sumExpenses(tripExpenses),
    rows,
  }
}