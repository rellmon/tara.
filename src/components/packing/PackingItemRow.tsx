import { useState } from 'react'
import type { FormEvent } from 'react'
import Button from '../ui/Button'
import {
  PACKING_CATEGORIES,
  PACKING_CATEGORY_LABELS,
} from '../../types/packing'
import type { PackingCategory, PackingItem } from '../../types/packing'
import { validatePackingItemName } from '../../utils/packing'

interface PackingItemRowProps {
  item: PackingItem
  onToggle: (itemId: string) => void
  onUpdate: (item: PackingItem) => void
  onDelete: (itemId: string) => void
}

const inputClasses =
  'mt-1 w-full rounded-xl border border-line bg-white px-4 py-2.5 text-charcoal focus-visible:outline-2 focus-visible:outline-brand-600'

function PackingItemRow({
  item,
  onToggle,
  onUpdate,
  onDelete,
}: PackingItemRowProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(item.name)
  const [category, setCategory] = useState<PackingCategory>(item.category)
  const [error, setError] = useState<string | undefined>(undefined)

  function startEditing() {
    // Start from the item's current values every time.
    setName(item.name)
    setCategory(item.category)
    setError(undefined)
    setIsEditing(true)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const validationError = validatePackingItemName(name)
    setError(validationError)
    if (validationError) return

    onUpdate({ ...item, name: name.trim(), category })
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <li>
        <form
          onSubmit={handleSubmit}
          noValidate
          className="space-y-3 rounded-2xl border border-line bg-white p-4"
        >
          <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
            <div>
              <label
                htmlFor={`packing-edit-name-${item.id}`}
                className="text-sm font-medium"
              >
                Item
              </label>
              <input
                id={`packing-edit-name-${item.id}`}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                aria-invalid={error ? true : undefined}
                aria-describedby={
                  error ? `packing-edit-error-${item.id}` : undefined
                }
                className={inputClasses}
              />
              {error && (
                <p
                  id={`packing-edit-error-${item.id}`}
                  className="mt-1 text-sm text-red-700"
                >
                  {error}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor={`packing-edit-category-${item.id}`}
                className="text-sm font-medium"
              >
                Category
              </label>
              <select
                id={`packing-edit-category-${item.id}`}
                value={category}
                onChange={(e) => setCategory(e.target.value as PackingCategory)}
                className={inputClasses}
              >
                {PACKING_CATEGORIES.map((option) => (
                  <option key={option} value={option}>
                    {PACKING_CATEGORY_LABELS[option]}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button type="submit">Save changes</Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </li>
    )
  }

  return (
    <li className="flex flex-wrap items-center gap-x-2 rounded-2xl border border-line bg-white px-4 py-1">
      <label className="flex min-h-11 min-w-0 flex-1 cursor-pointer items-center gap-3 py-2">
        <input
          type="checkbox"
          checked={item.packed}
          onChange={() => onToggle(item.id)}
          className="h-5 w-5 shrink-0 accent-brand-600"
        />
        <span
          className={`min-w-0 break-words ${
            item.packed ? 'text-muted line-through' : 'text-charcoal'
          }`}
        >
          {item.name}
        </span>
      </label>
      <div className="flex gap-1">
        <button
          type="button"
          onClick={startEditing}
          aria-label={`Edit ${item.name}`}
          className="rounded-full px-3 py-1.5 text-sm font-medium text-brand-700 transition-colors hover:bg-brand-50 focus-visible:outline-2 focus-visible:outline-brand-600"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete(item.id)}
          aria-label={`Delete ${item.name}`}
          className="rounded-full px-3 py-1.5 text-sm font-medium text-red-700 transition-colors hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-red-700"
        >
          Delete
        </button>
      </div>
    </li>
  )
}

export default PackingItemRow