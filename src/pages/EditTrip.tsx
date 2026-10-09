import { Link, useNavigate, useParams } from 'react-router-dom'
import TripForm from '../components/trips/TripForm'
import type { TripFormValues } from '../components/trips/TripForm'
import type { Trip } from '../types/trip'

interface EditTripProps {
  trips: Trip[]
  onUpdateTrip: (trip: Trip) => void
}

function EditTrip({ trips, onUpdateTrip }: EditTripProps) {
  const { tripId } = useParams()
  const navigate = useNavigate()
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

  function handleSubmit(values: TripFormValues) {
    onUpdateTrip({ ...trip!, ...values })
    navigate(`/trips/${trip!.id}`)
  }

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="font-display text-4xl font-bold text-brand-600">
        Edit trip
      </h1>
      <p className="mt-2 mb-8 text-muted">Update the details for {trip.title}.</p>
      <TripForm
        initialValues={trip}
        onSubmit={handleSubmit}
        submitLabel="Save changes"
      />
    </div>
  )
}

export default EditTrip