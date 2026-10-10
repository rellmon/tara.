import type { PackingCategory } from '../types/packing'

export interface PackingTemplateItem {
  name: string
  category: PackingCategory
}

export interface PackingTemplate {
  id: string
  name: string
  items: PackingTemplateItem[]
}

export const PACKING_TEMPLATES: PackingTemplate[] = [
  {
    id: 'beach',
    name: 'Beach',
    items: [
      { name: 'Swimwear', category: 'clothing' },
      { name: 'Flip-flops', category: 'clothing' },
      { name: 'Cap or hat', category: 'clothing' },
      { name: 'Beach towel', category: 'personal' },
      { name: 'Sunscreen', category: 'personal' },
      { name: 'Sunglasses', category: 'personal' },
      { name: 'Dry bag', category: 'equipment' },
      { name: 'Snorkel set', category: 'equipment' },
    ],
  },
  {
    id: 'hiking',
    name: 'Hiking',
    items: [
      { name: 'Water bottle', category: 'essentials' },
      { name: 'First aid kit', category: 'essentials' },
      { name: 'Hiking shoes', category: 'clothing' },
      { name: 'Rain jacket', category: 'clothing' },
      { name: 'Extra socks', category: 'clothing' },
      { name: 'Insect repellent', category: 'personal' },
      { name: 'Trail snacks', category: 'personal' },
      { name: 'Headlamp', category: 'equipment' },
      { name: 'Trekking poles', category: 'equipment' },
    ],
  },
  {
    id: 'overnight',
    name: 'Overnight stay',
    items: [
      { name: 'Wallet', category: 'essentials' },
      { name: 'Valid ID', category: 'essentials' },
      { name: 'Phone charger', category: 'essentials' },
      { name: 'Power bank', category: 'essentials' },
      { name: 'Change of clothes', category: 'clothing' },
      { name: 'Underwear', category: 'clothing' },
      { name: 'Sleepwear', category: 'clothing' },
      { name: 'Toiletries', category: 'personal' },
      { name: 'Towel', category: 'personal' },
    ],
  },
]