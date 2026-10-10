import { describe, expect, it } from 'vitest'
import type { PackingItem } from '../types/packing'
import { getPackingProgress, validatePackingItemName } from './packing'

function makeItems(packedCount: number, total: number): PackingItem[] {
  return Array.from({ length: total }, (_, i) => ({
    id: `i${i}`,
    tripId: 't1',
    name: `Item ${i}`,
    category: 'essentials',
    packed: i < packedCount,
  }))
}

describe('getPackingProgress', () => {
  it('rounds 8 of 12 packed to 67%', () => {
    expect(getPackingProgress(makeItems(8, 12))).toEqual({
      packed: 8,
      total: 12,
      percent: 67,
    })
  })

  it('is 0% for an empty list (no division by zero)', () => {
    expect(getPackingProgress([])).toEqual({ packed: 0, total: 0, percent: 0 })
  })

  it('is 100% when everything is packed', () => {
    expect(getPackingProgress(makeItems(5, 5)).percent).toBe(100)
  })

  it('is 0% when nothing is packed', () => {
    expect(getPackingProgress(makeItems(0, 5)).percent).toBe(0)
  })
})

describe('validatePackingItemName', () => {
  it('rejects empty and whitespace-only names', () => {
    expect(validatePackingItemName('')).toBeDefined()
    expect(validatePackingItemName('   ')).toBeDefined()
  })

  it('rejects names that are too long', () => {
    expect(validatePackingItemName('x'.repeat(61))).toBeDefined()
  })

  it('accepts a normal name', () => {
    expect(validatePackingItemName('Sunscreen')).toBeUndefined()
  })
})