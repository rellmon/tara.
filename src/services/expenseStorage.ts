import { sampleExpenses } from '../data/sampleExpenses'
import type { Expense } from '../types/expense'

const STORAGE_KEY = 'tara.expenses'

export function loadExpenses(): Expense[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)

    // Nothing saved yet (first visit): start with the sample expenses.
    if (raw === null) return sampleExpenses

    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return sampleExpenses

    return parsed as Expense[]
  } catch {
    return sampleExpenses
  }
}

export function saveExpenses(expenses: Expense[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses))
  } catch {
    // Storage may be full or blocked. Fail quietly.
  }
}