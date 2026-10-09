import { useState } from 'react'
import type { FormEvent } from 'react'
import Button from '../ui/Button'
import { validateTripForm } from '../../utils/validateTrip'
import type { TripFormErrors } from '../../utils/validateTrip'

export interface TripFormValues {
  title: string
  destination: string
  startDate: string
  endDate: string
  description: string
  travelerCount: number
  estimatedBudgetPerPerson: number
}

interface TripFormProps {
  onSubmit: (values: TripFormValues) => void
  initialValues?: TripFormValues
  submitLabel?: string
}

const inputClasses =
  'mt-1 w-full rounded-xl border border-line bg-white px-4 py-2.5 text-charcoal focus-visible:outline-2 focus-visible:outline-brand-600'

const errorClasses = 'mt-1 text-sm text-red-700'

function TripForm({
  onSubmit,
  initialValues,
  submitLabel = 'Create trip',
}: TripFormProps) {
  const [title, setTitle] = useState(initialValues?.title ?? '')
  const [destination, setDestination] = useState(initialValues?.destination ?? '')
  const [startDate, setStartDate] = useState(initialValues?.startDate ?? '')
  const [endDate, setEndDate] = useState(initialValues?.endDate ?? '')
  const [description, setDescription] = useState(initialValues?.description ?? '')
  const [travelerCount, setTravelerCount] = useState(
    String(initialValues?.travelerCount ?? 2),
  )
  const [budget, setBudget] = useState(
    initialValues ? String(initialValues.estimatedBudgetPerPerson) : '',
  )
  const [errors, setErrors] = useState<TripFormErrors>({})

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const values: TripFormValues = {
      title: title.trim(),
      destination: destination.trim(),
      startDate,
      endDate,
      description: description.trim(),
      travelerCount: Number(travelerCount),
      estimatedBudgetPerPerson: budget === '' ? 0 : Number(budget),
    }

    const validationErrors = validateTripForm(values)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) return

    onSubmit(values)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div>
        <label htmlFor="title" className="text-sm font-medium">
          Trip title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Barkada La Union Escape"
          aria-invalid={errors.title ? true : undefined}
          aria-describedby={errors.title ? 'title-error' : undefined}
          className={inputClasses}
        />
        {errors.title && (
          <p id="title-error" className={errorClasses}>
            {errors.title}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="destination" className="text-sm font-medium">
          Destination
        </label>
        <input
          id="destination"
          type="text"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="San Juan, La Union"
          aria-invalid={errors.destination ? true : undefined}
          aria-describedby={errors.destination ? 'destination-error' : undefined}
          className={inputClasses}
        />
        {errors.destination && (
          <p id="destination-error" className={errorClasses}>
            {errors.destination}
          </p>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="startDate" className="text-sm font-medium">
            Start date
          </label>
          <input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            aria-invalid={errors.startDate ? true : undefined}
            aria-describedby={errors.startDate ? 'startDate-error' : undefined}
            className={inputClasses}
          />
          {errors.startDate && (
            <p id="startDate-error" className={errorClasses}>
              {errors.startDate}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="endDate" className="text-sm font-medium">
            End date
          </label>
          <input
            id="endDate"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            aria-invalid={errors.endDate ? true : undefined}
            aria-describedby={errors.endDate ? 'endDate-error' : undefined}
            className={inputClasses}
          />
          {errors.endDate && (
            <p id="endDate-error" className={errorClasses}>
              {errors.endDate}
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="travelerCount" className="text-sm font-medium">
            Number of travelers
          </label>
          <input
            id="travelerCount"
            type="number"
            min="1"
            value={travelerCount}
            onChange={(e) => setTravelerCount(e.target.value)}
            aria-invalid={errors.travelerCount ? true : undefined}
            aria-describedby={
              errors.travelerCount ? 'travelerCount-error' : undefined
            }
            className={inputClasses}
          />
          {errors.travelerCount && (
            <p id="travelerCount-error" className={errorClasses}>
              {errors.travelerCount}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="budget" className="text-sm font-medium">
            Budget per person (₱)
          </label>
          <input
            id="budget"
            type="number"
            min="0"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="15000"
            aria-invalid={errors.estimatedBudgetPerPerson ? true : undefined}
            aria-describedby={
              errors.estimatedBudgetPerPerson ? 'budget-error' : undefined
            }
            className={inputClasses}
          />
          {errors.estimatedBudgetPerPerson && (
            <p id="budget-error" className={errorClasses}>
              {errors.estimatedBudgetPerPerson}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="description" className="text-sm font-medium">
          Short description
        </label>
        <textarea
          id="description"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="A three-day beach trip with surfing and food trips."
          className={inputClasses}
        />
      </div>

      <Button type="submit" size="lg">
        {submitLabel}
      </Button>
    </form>
  )
}

export default TripForm