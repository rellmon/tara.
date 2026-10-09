import { sampleBudgetItems } from '../data/sampleBudgetItems'
import type { BudgetItem } from '../types/budget'

const STORAGE_KEY = 'tara.budgetItems'

export function loadBudgetItems(): BudgetItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)

    // Nothing saved yet (first visit): start with the sample items.
    if (raw === null) return sampleBudgetItems

    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return sampleBudgetItems

    return parsed as BudgetItem[]
  } catch {
    return sampleBudgetItems
  }
}

export function saveBudgetItems(items: BudgetItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {
    // Storage may be full or blocked. Fail quietly.
  }
}