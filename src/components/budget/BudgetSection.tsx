import { useState } from 'react'
import type { FormEvent } from 'react'
import Button from '../ui/Button'
import { BUDGET_CATEGORIES, BUDGET_CATEGORY_LABELS } from '../../types/budget'
import type { BudgetCategory, BudgetItem } from '../../types/budget'
import type { Trip } from '../../types/trip'
import { formatCurrency } from '../../utils/format'
import { validateBudgetItem } from '../../utils/validateBudgetItem'
import type { BudgetItemErrors } from '../../utils/validateBudgetItem'

interface BudgetSectionProps {
  trip: Trip
  items: BudgetItem[]
  onAddItem: (item: BudgetItem) => void
  onDeleteItem: (itemId: string) => void
}

const inputClasses =
  'mt-1 w-full rounded-xl border border-line bg-white px-4 py-2.5 text-charcoal focus-visible:outline-2 focus-visible:outline-brand-600'

function BudgetSection({
  trip,
  items,
  onAddItem,
  onDeleteItem,
}: BudgetSectionProps) {
  const [name, setName] = useState('')
  const [category, setCategory] = useState<BudgetCategory>('transportation')
  const [amount, setAmount] = useState('')
  const [errors, setErrors] = useState<BudgetItemErrors>({})

  const tripItems = items.filter((item) => item.tripId === trip.id)
  const itemsTotal = tripItems.reduce((sum, item) => sum + item.amount, 0)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const values = {
      name: name.trim(),
      amount: amount === '' ? NaN : Number(amount),
    }

    const validationErrors = validateBudgetItem(values)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) return

    onAddItem({
      id: crypto.randomUUID(),
      tripId: trip.id,
      name: values.name,
      category,
      amount: values.amount,
    })

    // Clear the fields, but keep the category for quick repeated entry.
    setName('')
    setAmount('')
  }

  function handleDelete(item: BudgetItem) {
    const confirmed = window.confirm(
      `Delete "${item.name}"? This can't be undone.`,
    )
    if (!confirmed) return

    onDeleteItem(item.id)
  }

  return (
    <section aria-labelledby="budget-heading" className="mt-12">
      <h2
        id="budget-heading"
        className="font-display text-2xl font-bold text-brand-900"
      >
        Budget
      </h2>
      <p className="mt-1 text-sm text-muted">
        Group costs that aren't part of a specific activity.
      </p>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="mt-5 space-y-4 rounded-2xl border border-line bg-white p-5"
      >
        <div>
          <label htmlFor="budget-name" className="text-sm font-medium">
            Item name
          </label>
          <input
            id="budget-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Van rental"
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? 'budget-name-error' : undefined}
            className={inputClasses}
          />
          {errors.name && (
            <p id="budget-name-error" className="mt-1 text-sm text-red-700">
              {errors.name}
            </p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="budget-category" className="text-sm font-medium">
              Category
            </label>
            <select
              id="budget-category"
              value={category}
              onChange={(e) => setCategory(e.target.value as BudgetCategory)}
              className={inputClasses}
            >
              {BUDGET_CATEGORIES.map((item) => (
                <option key={item} value={item}>
                  {BUDGET_CATEGORY_LABELS[item]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="budget-amount" className="text-sm font-medium">
              Group total (₱)
            </label>
            <input
              id="budget-amount"
              type="number"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="5000"
              aria-invalid={errors.amount ? true : undefined}
              aria-describedby={
                errors.amount ? 'budget-amount-error' : undefined
              }
              className={inputClasses}
            />
            {errors.amount && (
              <p
                id="budget-amount-error"
                className="mt-1 text-sm text-red-700"
              >
                {errors.amount}
              </p>
            )}
          </div>
        </div>

        <Button type="submit">Add budget item</Button>
      </form>

      {tripItems.length === 0 ? (
        <p className="mt-4 rounded-2xl border border-dashed border-line p-5 text-sm text-muted">
          No budget items yet.
        </p>
      ) : (
        <>
          <ul className="mt-4 space-y-3">
            {tripItems.map((item) => (
              <li
                key={item.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-white p-4"
              >
                <div className="min-w-0">
                  <p className="break-words font-medium text-charcoal">
                    {item.name}
                  </p>
                  <p className="text-sm text-muted">
                    {BUDGET_CATEGORY_LABELS[item.category] ??
                      BUDGET_CATEGORY_LABELS.other}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-brand-900">
                    {formatCurrency(item.amount)}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDelete(item)}
                    aria-label={`Delete ${item.name}`}
                    className="rounded-full px-3 py-1.5 text-sm font-medium text-red-700 transition-colors hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-red-700"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-right text-sm text-muted">
            Items total:{' '}
            <span className="font-semibold text-brand-900">
              {formatCurrency(itemsTotal)}
            </span>
          </p>
        </>
      )}
    </section>
  )
}

export default BudgetSection