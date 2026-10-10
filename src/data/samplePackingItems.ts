import type { PackingItem } from '../types/packing'

export const samplePackingItems: PackingItem[] = [
  { id: 'sample-pack-1', tripId: 'sample-la-union', name: 'Wallet', category: 'essentials', packed: true },
  { id: 'sample-pack-2', tripId: 'sample-la-union', name: 'Valid ID', category: 'essentials', packed: true },
  { id: 'sample-pack-3', tripId: 'sample-la-union', name: 'Phone charger', category: 'essentials', packed: false },
  { id: 'sample-pack-4', tripId: 'sample-la-union', name: 'Power bank', category: 'essentials', packed: false },
  { id: 'sample-pack-5', tripId: 'sample-la-union', name: 'Swimwear', category: 'clothing', packed: false },
  { id: 'sample-pack-6', tripId: 'sample-la-union', name: 'Sleepwear', category: 'clothing', packed: true },
  { id: 'sample-pack-7', tripId: 'sample-la-union', name: 'Sunscreen', category: 'personal', packed: false },
  { id: 'sample-pack-8', tripId: 'sample-la-union', name: 'Toiletries', category: 'personal', packed: false },
  { id: 'sample-pack-9', tripId: 'sample-la-union', name: 'Camera', category: 'equipment', packed: false },
]