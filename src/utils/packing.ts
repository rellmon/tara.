import type { PackingItem } from '../types/packing'

export interface PackingProgress {
  packed: number
  total: number
  percent: number // whole number from 0 to 100
}

export function getPackingProgress(items: PackingItem[]): PackingProgress {
  const total = items.length
  const packed = items.filter((item) => item.packed).length
  const percent = total === 0 ? 0 : Math.round((packed / total) * 100)

  return { packed, total, percent }
}

const MAX_ITEM_NAME_LENGTH = 60

// Returns an error message, or undefined when the name is valid.
export function validatePackingItemName(name: string): string | undefined {
  const trimmed = name.trim()

  if (trimmed === '') {
    return 'Item name is required.'
  }

  if (trimmed.length > MAX_ITEM_NAME_LENGTH) {
    return `Item name must be ${MAX_ITEM_NAME_LENGTH} characters or fewer.`
  }

  return undefined
}