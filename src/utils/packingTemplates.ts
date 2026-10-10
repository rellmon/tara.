import type { PackingTemplate, PackingTemplateItem } from '../data/packingTemplates'
import type { PackingItem } from '../types/packing'

function normalize(name: string): string {
  return name.trim().toLowerCase()
}

// The template items that are not already on the list.
// Names are compared ignoring upper/lower case and surrounding spaces.
export function getNewTemplateItems(
  template: PackingTemplate,
  existingItems: PackingItem[],
): PackingTemplateItem[] {
  const existingNames = new Set(existingItems.map((item) => normalize(item.name)))

  return template.items.filter((item) => !existingNames.has(normalize(item.name)))
}