import { useState } from 'react'
import type { FormEvent } from 'react'
import Button from '../ui/Button'
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

interface PackingSectionProps {
  trip: Trip
  items: PackingItem[]
  onAddItem: (item: PackingItem) => void
  onToggleItem: (itemId: string) => void
}

const inputClasses =
  'mt-1 w-full rounded-xl border border-line bg-white px-4 py-2.5 text-charcoal focus-visible:outline-2 focus-visible:outline-brand-600'

function PackingSection({
  trip,
  items,
  onAddItem,
  onToggleItem,
}: PackingSectionProps) {
  const [name, setName] = useState('')
  const [category, setCategory] = useState<PackingCategory>('essentials')
  const [error, setError] = useState<string | undefined>(undefined)

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
                    <li key={item.id}>
                      <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-2xl border border-line bg-white px-4 py-2">
                        <input
                          type="checkbox"
                          checked={item.packed}
                          onChange={() => onToggleItem(item.id)}
                          className="h-5 w-5 shrink-0 accent-brand-600"
                        />
                        <span
                          className={`min-w-0 break-words ${
                            item.packed
                              ? 'text-muted line-through'
                              : 'text-charcoal'
                          }`}
                        >
                          {item.name}
                        </span>
                      </label>
                    </li>
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