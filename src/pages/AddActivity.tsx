import { Link, useParams, useSearchParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import ActivityForm from '../components/itinerary/ActivityForm'
import type { ActivityFormValues } from '../components/itinerary/ActivityForm'
import type { Trip } from '../types/trip'
import { getTripDays } from '../utils/itinerary'

interface AddActivityProps {
  trips: Trip[]
}

function AddActivity({ trips }: AddActivityProps) {
  const { tripId } = useParams()
  const [searchParams] = useSearchParams()
  const trip = trips.find((t) => t.id === tripId)

  if (!trip) {
    return (
      <div className="py-16 text-center">
        <h1 className="font-display text-3xl font-bold text-brand-900">
          Trip not found
        </h1>
        <Link
          to="/trips"
          className="mt-6 inline-block rounded-full bg-brand-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-700"
        >
          Back to My Trips
        </Link>
      </div>
    )
  }

  const days = getTripDays(trip.startDate, trip.endDate)
  const requestedDate = searchParams.get('date') ?? ''
  const defaultDate = days.includes(requestedDate) ? requestedDate : (days[0] ?? '')

  function handleSubmit(values: ActivityFormValues) {
    console.log('Activity submitted:', values)
  }

  return (
    <div className="mx-auto max-w-xl">
      <Link
        to={`/trips/${trip.id}`}
        className="inline-flex items-center gap-2 text-sm font-medium text-brand-700 hover:text-brand-900"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        Back to trip
      </Link>
      <h1 className="mt-4 font-display text-4xl font-bold text-brand-600">
        Add activity
      </h1>
      <p className="mt-2 mb-8 text-muted">{trip.title}</p>
      <ActivityForm
        days={days}
        defaultDate={defaultDate}
        onSubmit={handleSubmit}
      />
    </div>
  )
}

export default AddActivity