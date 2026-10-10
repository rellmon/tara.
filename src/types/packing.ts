export const PACKING_CATEGORIES = [
  'essentials',
  'clothing',
  'personal',
  'equipment',
] as const

export type PackingCategory = (typeof PACKING_CATEGORIES)[number]

export const PACKING_CATEGORY_LABELS: Record<PackingCategory, string> = {
  essentials: 'Essentials',
  clothing: 'Clothing',
  personal: 'Personal items',
  equipment: 'Optional equipment',
}

export interface PackingItem {
  id: string
  tripId: string
  name: string
  category: PackingCategory
  packed: boolean
}