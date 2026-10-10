import { describe, expect, it } from 'vitest'
import { PACKING_TEMPLATES } from '../data/packingTemplates'
import type { PackingTemplate } from '../data/packingTemplates'
import { PACKING_CATEGORIES } from '../types/packing'
import type { PackingItem } from '../types/packing'
import { getNewTemplateItems } from './packingTemplates'

const template: PackingTemplate = {
  id: 'test',
  name: 'Test',
  items: [
    { name: 'Sunscreen', category: 'personal' },
    { name: 'Towel', category: 'personal' },
    { name: 'Swimwear', category: 'clothing' },
  ],
}

function existing(name: string): PackingItem {
  return { id: name, tripId: 't1', name, category: 'essentials', packed: false }
}

describe('getNewTemplateItems', () => {
  it('returns every template item when the list is empty', () => {
    expect(getNewTemplateItems(template, [])).toEqual(template.items)
  })

  it('skips items already on the list, ignoring case and spaces', () => {
    const result = getNewTemplateItems(template, [
      existing('  sunscreen '),
      existing('SWIMWEAR'),
    ])

    expect(result.map((item) => item.name)).toEqual(['Towel'])
  })

  it('returns nothing when everything is already on the list', () => {
    const result = getNewTemplateItems(template, [
      existing('Sunscreen'),
      existing('Towel'),
      existing('Swimwear'),
    ])

    expect(result).toEqual([])
  })
})

describe('PACKING_TEMPLATES data', () => {
  it('has valid categories, non-empty names, and no duplicates per template', () => {
    for (const t of PACKING_TEMPLATES) {
      const names = t.items.map((item) => item.name.trim().toLowerCase())

      expect(new Set(names).size).toBe(names.length)
      for (const item of t.items) {
        expect(item.name.trim()).not.toBe('')
        expect(PACKING_CATEGORIES).toContain(item.category)
      }
    }
  })
})