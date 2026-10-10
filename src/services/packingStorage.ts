import { samplePackingItems } from '../data/samplePackingItems'
import type { PackingItem } from '../types/packing'

const STORAGE_KEY = 'tara.packingItems'

export function loadPackingItems(): PackingItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)

    // Nothing saved yet (first visit): start with the sample items.
    if (raw === null) return samplePackingItems

    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return samplePackingItems

    return parsed as PackingItem[]
  } catch {
    return samplePackingItems
  }
}

export function savePackingItems(items: PackingItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {
    // Storage may be full or blocked. Fail quietly.
  }
}