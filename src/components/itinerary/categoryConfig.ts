import {
  BedDouble,
  Camera,
  Car,
  Mountain,
  ShoppingBag,
  Sun,
  Tag,
  Utensils,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { ActivityCategory } from '../../types/itinerary'

interface CategoryStyle {
  label: string
  icon: LucideIcon
  classes: string // background and text color for the pill
}

export const categoryConfig: Record<ActivityCategory, CategoryStyle> = {
  transportation: {
    label: 'Transportation',
    icon: Car,
    classes: 'bg-sky-100 text-sky-900',
  },
  food: {
    label: 'Food',
    icon: Utensils,
    classes: 'bg-orange-100 text-orange-900',
  },
  accommodation: {
    label: 'Accommodation',
    icon: BedDouble,
    classes: 'bg-violet-100 text-violet-900',
  },
  sightseeing: {
    label: 'Sightseeing',
    icon: Camera,
    classes: 'bg-emerald-100 text-emerald-900',
  },
  adventure: {
    label: 'Adventure',
    icon: Mountain,
    classes: 'bg-rose-100 text-rose-900',
  },
  shopping: {
    label: 'Shopping',
    icon: ShoppingBag,
    classes: 'bg-pink-100 text-pink-900',
  },
  'free-time': {
    label: 'Free time',
    icon: Sun,
    classes: 'bg-yellow-100 text-yellow-900',
  },
  other: {
    label: 'Other',
    icon: Tag,
    classes: 'bg-sage text-brand-900',
  },
}