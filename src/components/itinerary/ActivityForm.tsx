import { useState } from 'react'
import type { FormEvent } from 'react'
import Button from '../ui/Button'
import { ACTIVITY_CATEGORIES } from '../../types/itinerary'
import type { ActivityCategory } from '../../types/itinerary'
import { formatDayLabel } from '../../utils/itinerary'

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

function categoryLabel(category: ActivityCategory): string {
  const spaced = category.replace('-', ' ')
  return spaced.charAt(0).toUpperCase() + spaced.slice(1)
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

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    onSubmit({
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
    })
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
          className={inputClasses}
        />
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
            className={inputClasses}
          >
            {days.map((day, index) => (
              <option key={day} value={day}>
                Day {index + 1} · {formatDayLabel(day)}
              </option>
            ))}
          </select>
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
                {categoryLabel(item)}
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
            className={inputClasses}
          />
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
            className={inputClasses}
          />
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
            Estimated cost (₱)
          </label>
          <input
            id="estimatedCost"
            type="number"
            min="0"
            value={estimatedCost}
            onChange={(e) => setEstimatedCost(e.target.value)}
            placeholder="0"
            className={inputClasses}
          />
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
          className={inputClasses}
        />
      </div>

      <Button type="submit" size="lg">
        {submitLabel}
      </Button>
    </form>
  )
}

export default ActivityForm