import { useState } from 'react'
import type { FormEvent } from 'react'
import Button from '../ui/Button'
import { ACTIVITY_CATEGORIES } from '../../types/itinerary'
import type { ActivityCategory } from '../../types/itinerary'
import { formatDayLabel } from '../../utils/itinerary'
import { validateActivity } from '../../utils/validateActivity'
import type { ActivityFormErrors } from '../../utils/validateActivity'
import { categoryConfig } from './categoryConfig'

export interface ActivityFormValues {
  date: string
  title: string
  locationName: string
  startTime: string
  endTime: string
  description: string
  estimatedCost: number
  category: ActivityCategory
  notes: string
  url: string
}

interface ActivityFormProps {
  days: string[]
  defaultDate: string
  onSubmit: (values: ActivityFormValues) => void
  initialValues?: ActivityFormValues
  submitLabel?: string
}

const inputClasses =
  'mt-1 w-full rounded-xl border border-line bg-white px-4 py-2.5 text-charcoal focus-visible:outline-2 focus-visible:outline-brand-600'

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null
  return (
    <p id={id} className="mt-1 text-sm text-red-700">
      {message}
    </p>
  )
}

function ActivityForm({
  days,
  defaultDate,
  onSubmit,
  initialValues,
  submitLabel = 'Add activity',
}: ActivityFormProps) {
  const [date, setDate] = useState(defaultDate)
  const [title, setTitle] = useState(initialValues?.title ?? '')
  const [locationName, setLocationName] = useState(
    initialValues?.locationName ?? '',
  )
  const [startTime, setStartTime] = useState(initialValues?.startTime ?? '')
  const [endTime, setEndTime] = useState(initialValues?.endTime ?? '')
  const [description, setDescription] = useState(
    initialValues?.description ?? '',
  )
  const [estimatedCost, setEstimatedCost] = useState(
    initialValues ? String(initialValues.estimatedCost) : '',
  )
  const [category, setCategory] = useState<ActivityCategory>(
    initialValues?.category ?? 'sightseeing',
  )
  const [notes, setNotes] = useState(initialValues?.notes ?? '')
  const [url, setUrl] = useState(initialValues?.url ?? '')
  const [errors, setErrors] = useState<ActivityFormErrors>({})

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const values: ActivityFormValues = {
      date,
      title: title.trim(),
      locationName: locationName.trim(),
      startTime,
      endTime,
      description: description.trim(),
      estimatedCost: estimatedCost === '' ? 0 : Number(estimatedCost),
      category,
      notes: notes.trim(),
      url: url.trim(),
    }

    const validationErrors = validateActivity(values, days)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) return

    onSubmit(values)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div>
        <label htmlFor="title" className="text-sm font-medium">
          Activity title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Surf lesson"
          aria-invalid={errors.title ? true : undefined}
          aria-describedby={errors.title ? 'title-error' : undefined}
          className={inputClasses}
        />
        <FieldError id="title-error" message={errors.title} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="date" className="text-sm font-medium">
            Day
          </label>
          <select
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            aria-invalid={errors.date ? true : undefined}
            aria-describedby={errors.date ? 'date-error' : undefined}
            className={inputClasses}
          >
            {days.map((day, index) => (
              <option key={day} value={day}>
                Day {index + 1} · {formatDayLabel(day)}
              </option>
            ))}
          </select>
          <FieldError id="date-error" message={errors.date} />
        </div>
        <div>
          <label htmlFor="category" className="text-sm font-medium">
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value as ActivityCategory)}
            className={inputClasses}
          >
            {ACTIVITY_CATEGORIES.map((item) => (
              <option key={item} value={item}>
                {categoryConfig[item].label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="startTime" className="text-sm font-medium">
            Start time
          </label>
          <input
            id="startTime"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            aria-invalid={errors.startTime ? true : undefined}
            aria-describedby={errors.startTime ? 'startTime-error' : undefined}
            className={inputClasses}
          />
          <FieldError id="startTime-error" message={errors.startTime} />
        </div>
        <div>
          <label htmlFor="endTime" className="text-sm font-medium">
            End time (optional)
          </label>
          <input
            id="endTime"
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            aria-invalid={errors.endTime ? true : undefined}
            aria-describedby={errors.endTime ? 'endTime-error' : undefined}
            className={inputClasses}
          />
          <FieldError id="endTime-error" message={errors.endTime} />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="locationName" className="text-sm font-medium">
            Location (optional)
          </label>
          <input
            id="locationName"
            type="text"
            value={locationName}
            onChange={(e) => setLocationName(e.target.value)}
            placeholder="Urbiztondo Beach"
            className={inputClasses}
          />
        </div>
        <div>
          <label htmlFor="estimatedCost" className="text-sm font-medium">
            Estimated cost, whole group (₱)
          </label>
          <input
            id="estimatedCost"
            type="number"
            min="0"
            value={estimatedCost}
            onChange={(e) => setEstimatedCost(e.target.value)}
            placeholder="0"
            aria-invalid={errors.estimatedCost ? true : undefined}
            aria-describedby={
              errors.estimatedCost ? 'estimatedCost-error' : undefined
            }
            className={inputClasses}
          />
          <FieldError id="estimatedCost-error" message={errors.estimatedCost} />
        </div>
      </div>

      <div>
        <label htmlFor="description" className="text-sm font-medium">
          Description (optional)
        </label>
        <textarea
          id="description"
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={inputClasses}
        />
      </div>

      <div>
        <label htmlFor="notes" className="text-sm font-medium">
          Notes (optional)
        </label>
        <textarea
          id="notes"
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className={inputClasses}
        />
      </div>

      <div>
        <label htmlFor="url" className="text-sm font-medium">
          Booking or reference link (optional)
        </label>
        <input
          id="url"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://"
          aria-invalid={errors.url ? true : undefined}
          aria-describedby={errors.url ? 'url-error' : undefined}
          className={inputClasses}
        />
        <FieldError id="url-error" message={errors.url} />
      </div>

      <Button type="submit" size="lg">
        {submitLabel}
      </Button>
    </form>
  )
}

export default ActivityForm