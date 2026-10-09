import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import ActivityForm from '../components/itinerary/ActivityForm'
import type { ActivityFormValues } from '../components/itinerary/ActivityForm'
import type { ItineraryActivity } from '../types/itinerary'
import type { Trip } from '../types/trip'
import { getTripDays } from '../utils/itinerary'

interface EditActivityProps {
  trips: Trip[]
  activities: ItineraryActivity[]
  onUpdateActivity: (activity: ItineraryActivity) => void
}

function EditActivity({
  trips,
  activities,
  onUpdateActivity,
}: EditActivityProps) {
  const { tripId, activityId } = useParams()
  const navigate = useNavigate()
  const trip = trips.find((t) => t.id === tripId)
  const activity = activities.find(
    (a) => a.id === activityId && a.tripId === tripId,
  )

  if (!trip || !activity) {
    return (
      <div className="py-16 text-center">
        <h1 className="font-display text-3xl font-bold text-brand-900">
          Activity not found
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

  const currentTripId = trip.id
  const currentActivity = activity
  const days = getTripDays(trip.startDate, trip.endDate)
  // If the trip's dates changed and this activity is now outside them,
  // preselect the first day so saving moves it back into the trip.
  const defaultDate = days.includes(activity.date)
    ? activity.date
    : (days[0] ?? '')

  function handleSubmit(values: ActivityFormValues) {
    onUpdateActivity({ ...currentActivity, ...values })
    navigate(`/trips/${currentTripId}`)
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
        Edit activity
      </h1>
      <p className="mt-2 mb-8 text-muted">{trip.title}</p>
      <ActivityForm
        days={days}
        defaultDate={defaultDate}
        initialValues={activity}
        onSubmit={handleSubmit}
        submitLabel="Save changes"
      />
    </div>
  )
}

export default EditActivity