import { useState } from 'react'
import type { FormEvent } from 'react'
import Button from '../ui/Button'

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
}

const inputClasses =
  'mt-1 w-full rounded-xl border border-line bg-white px-4 py-2.5 text-charcoal focus-visible:outline-2 focus-visible:outline-brand-600'

function TripForm({ onSubmit }: TripFormProps) {
  const [title, setTitle] = useState('')
  const [destination, setDestination] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [description, setDescription] = useState('')
  const [travelerCount, setTravelerCount] = useState('2')
  const [budget, setBudget] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    onSubmit({
      title: title.trim(),
      destination: destination.trim(),
      startDate,
      endDate,
      description: description.trim(),
      travelerCount: Number(travelerCount),
      estimatedBudgetPerPerson: Number(budget),
    })
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
          className={inputClasses}
        />
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
          className={inputClasses}
        />
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
            className={inputClasses}
          />
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
            className={inputClasses}
          />
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
            className={inputClasses}
          />
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
            className={inputClasses}
          />
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
        Create trip
      </Button>
    </form>
  )
}

export default TripForm