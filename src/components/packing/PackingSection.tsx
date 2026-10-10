import { useState } from 'react'
import type { FormEvent } from 'react'
import Button from '../ui/Button'
import PackingItemRow from './PackingItemRow'
import { PACKING_TEMPLATES } from '../../data/packingTemplates'
import {
  PACKING_CATEGORIES,
  PACKING_CATEGORY_LABELS,
} from '../../types/packing'
import type { PackingCategory, PackingItem } from '../../types/packing'
import type { Trip } from '../../types/trip'
import {
  getPackingProgress,
  validatePackingItemName,
} from '../../utils/packing'
import { getNewTemplateItems } from '../../utils/packingTemplates'

interface PackingSectionProps {
  trip: Trip
  items: PackingItem[]
  onAddItem: (item: PackingItem) => void
  onToggleItem: (itemId: string) => void
  onUpdateItem: (item: PackingItem) => void
  onDeleteItem: (itemId: string) => void
}

const inputClasses =
  'mt-1 w-full rounded-xl border border-line bg-white px-4 py-2.5 text-charcoal focus-visible:outline-2 focus-visible:outline-brand-600'

function PackingSection({
  trip,
  items,
  onAddItem,
  onToggleItem,
  onUpdateItem,
  onDeleteItem,
}: PackingSectionProps) {
  const [name, setName] = useState('')
  const [category, setCategory] = useState<PackingCategory>('essentials')
  const [error, setError] = useState<string | undefined>(undefined)
  const [templateId, setTemplateId] = useState(PACKING_TEMPLATES[0].id)
  const [templateMessage, setTemplateMessage] = useState<string | undefined>(
    undefined,
  )

  const tripItems = items.filter((item) => item.tripId === trip.id)
  const progress = getPackingProgress(tripItems)

  const groups = PACKING_CATEGORIES.map((groupCategory) => ({
    category: groupCategory,
    items: tripItems.filter((item) => item.category === groupCategory),
  })).filter((group) => group.items.length > 0)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const validationError = validatePackingItemName(name)
    setError(validationError)
    if (validationError) return

    onAddItem({
      id: crypto.randomUUID(),
      tripId: trip.id,
      name: name.trim(),
      category,
      packed: false,
    })

    // Clear the name, but keep the category for quick repeated entry.
    setName('')
  }

  function handleApplyTemplate() {
    const template = PACKING_TEMPLATES.find((t) => t.id === templateId)
    if (!template) return

    const newItems = getNewTemplateItems(template, tripItems)

    for (const item of newItems) {
      onAddItem({
        id: crypto.randomUUID(),
        tripId: trip.id,
        name: item.name,
        category: item.category,
        packed: false,
      })
    }

    const skipped = template.items.length - newItems.length

    if (newItems.length === 0) {
      setTemplateMessage(
        `Everything from the ${template.name} template is already on your list.`,
      )
      return
    }

    setTemplateMessage(
      `Added ${newItems.length} ${newItems.length === 1 ? 'item' : 'items'} from the ${template.name} template.` +
        (skipped > 0 ? ` ${skipped} already on your list.` : ''),
    )
  }

  return (
    <section aria-labelledby="packing-heading" className="mt-12">
      <h2
        id="packing-heading"
        className="font-display text-2xl font-bold text-brand-900"
      >
        Packing list
      </h2>
      <p className="mt-1 text-sm text-muted">
        Tick things off as you pack them.
      </p>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="mt-5 space-y-4 rounded-2xl border border-line bg-white p-5"
      >
        <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
          <div>
            <label htmlFor="packing-name" className="text-sm font-medium">
              Item
            </label>
            <input
              id="packing-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Sunscreen"
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? 'packing-name-error' : undefined}
              className={inputClasses}
            />
            {error && (
              <p id="packing-name-error" className="mt-1 text-sm text-red-700">
                {error}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="packing-category" className="text-sm font-medium">
              Category
            </label>
            <select
              id="packing-category"
              value={category}
              onChange={(e) => setCategory(e.target.value as PackingCategory)}
              className={inputClasses}
            >
              {PACKING_CATEGORIES.map((item) => (
                <option key={item} value={item}>
                  {PACKING_CATEGORY_LABELS[item]}
                </option>
              ))}
            </select>
          </div>
        </div>
        <Button type="submit">Add item</Button>
      </form>

      <div className="mt-4 rounded-2xl border border-line bg-white p-5">
        <label htmlFor="packing-template" className="text-sm font-medium">
          Start from a template
        </label>
        <p className="mt-1 text-xs text-muted">
          Adds common items for the trip type. Items already on your list are
          skipped.
        </p>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <select
            id="packing-template"
            value={templateId}
            onChange={(e) => {
              setTemplateId(e.target.value)
              setTemplateMessage(undefined)
            }}
            className="w-full rounded-xl border border-line bg-white px-4 py-2.5 text-charcoal focus-visible:outline-2 focus-visible:outline-brand-600"
          >
            {PACKING_TEMPLATES.map((template) => (
              <option key={template.id} value={template.id}>
                {template.name} ({template.items.length} items)
              </option>
            ))}
          </select>
          <Button
            type="button"
            variant="secondary"
            onClick={handleApplyTemplate}
            className="shrink-0"
          >
            Add template items
          </Button>
        </div>
        {templateMessage && (
          <p role="status" className="mt-3 text-sm text-brand-700">
            {templateMessage}
          </p>
        )}
      </div>

      {tripItems.length === 0 ? (
        <p className="mt-4 rounded-2xl border border-dashed border-line p-5 text-sm text-muted">
          Nothing to pack yet. Add your first item above.
        </p>
      ) : (
        <>
          <div className="mt-5 rounded-2xl border border-line bg-white p-5">
            <p className="text-sm text-muted" aria-live="polite">
              <span className="font-display text-xl font-bold text-brand-900">
                {progress.packed} of {progress.total}
              </span>{' '}
              packed ({progress.percent}%)
            </p>
            <div
              className="mt-3 h-2 overflow-hidden rounded-full bg-sage"
              role="progressbar"
              aria-label="Packing progress"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progress.percent}
            >
              <div
                className="h-full rounded-full bg-brand-500 transition-all"
                style={{ width: `${progress.percent}%` }}
              />
            </div>
          </div>

          <div className="mt-4 space-y-6">
            {groups.map((group) => (
              <div key={group.category}>
                <h3 className="text-sm font-semibold text-brand-900">
                  {PACKING_CATEGORY_LABELS[group.category]}
                </h3>
                <ul className="mt-2 space-y-2">
                  {group.items.map((item) => (
                    <PackingItemRow
                      key={item.id}
                      item={item}
                      onToggle={onToggleItem}
                      onUpdate={onUpdateItem}
                      onDelete={onDeleteItem}
                    />
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  )
}

export default PackingSection