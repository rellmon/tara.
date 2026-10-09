import type { BudgetCategory } from '../../types/budget'

interface CategoryColor {
  stroke: string // for the chart slice
  swatch: string // for the legend dot
}

// Full class names so Tailwind can detect them.
export const budgetCategoryColors: Record<BudgetCategory, CategoryColor> = {
  transportation: { stroke: 'stroke-sky-500', swatch: 'bg-sky-500' },
  accommodation: { stroke: 'stroke-violet-500', swatch: 'bg-violet-500' },
  food: { stroke: 'stroke-orange-500', swatch: 'bg-orange-500' },
  activities: { stroke: 'stroke-emerald-500', swatch: 'bg-emerald-500' },
  shopping: { stroke: 'stroke-pink-500', swatch: 'bg-pink-500' },
  emergency: { stroke: 'stroke-rose-500', swatch: 'bg-rose-500' },
  other: { stroke: 'stroke-stone-500', swatch: 'bg-stone-500' },
}