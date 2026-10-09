import { BUDGET_CATEGORIES } from '../types/budget'
import type { BudgetCategory, BudgetItem } from '../types/budget'
import type { ActivityCategory, ItineraryActivity } from '../types/itinerary'

// Which budget category each activity category counts toward.
export const ACTIVITY_TO_BUDGET_CATEGORY: Record<
  ActivityCategory,
  BudgetCategory
> = {
  transportation: 'transportation',
  food: 'food',
  accommodation: 'accommodation',
  sightseeing: 'activities',
  adventure: 'activities',
  shopping: 'shopping',
  'free-time': 'activities',
  other: 'other',
}

export interface EstimatedBreakdown {
  byCategory: Record<BudgetCategory, number>
  total: number
}

function toCentavos(amount: number): number {
  return Math.round(amount * 100)
}

export function getEstimatedBreakdown(
  tripId: string,
  activities: ItineraryActivity[],
  budgetItems: BudgetItem[],
): EstimatedBreakdown {
  // Work in whole centavos to avoid floating-point drift.
  const centavos = {} as Record<BudgetCategory, number>
  for (const category of BUDGET_CATEGORIES) {
    centavos[category] = 0
  }

  for (const item of budgetItems) {
    if (item.tripId !== tripId) continue
    const category = item.category in centavos ? item.category : 'other'
    centavos[category] += toCentavos(item.amount)
  }

  for (const activity of activities) {
    if (activity.tripId !== tripId) continue
    const category = ACTIVITY_TO_BUDGET_CATEGORY[activity.category] ?? 'other'
    centavos[category] += toCentavos(activity.estimatedCost)
  }

  const byCategory = {} as Record<BudgetCategory, number>
  let totalCentavos = 0
  for (const category of BUDGET_CATEGORIES) {
    byCategory[category] = centavos[category] / 100
    totalCentavos += centavos[category]
  }

  return { byCategory, total: totalCentavos / 100 }
}

// The share each traveler pays, rounded UP to the next centavo so the
// shares always cover the total. Returns 0 for an invalid traveler count.
export function getCostPerPerson(total: number, travelerCount: number): number {
  if (!Number.isInteger(travelerCount) || travelerCount < 1) return 0

  return Math.ceil(toCentavos(total) / travelerCount) / 100
}