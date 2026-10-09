import { useNavigate } from 'react-router-dom'
import TripForm from '../components/trips/TripForm'
import type { TripFormValues } from '../components/trips/TripForm'
import type { Trip } from '../types/trip'

interface CreateTripProps {
  onAddTrip: (trip: Trip) => void
}

function CreateTrip({ onAddTrip }: CreateTripProps) {
  const navigate = useNavigate()

  function handleSubmit(values: TripFormValues) {
    const newTrip: Trip = {
      id: crypto.randomUUID(),
      coverImage: '',
      status: 'planning',
      ...values,
    }

    onAddTrip(newTrip)
    navigate('/trips')
  }

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="font-display text-4xl font-bold text-brand-600">
        Plan a new trip
      </h1>
      <p className="mt-2 mb-8 text-muted">Tara na! Tell us where you're headed.</p>
      <TripForm onSubmit={handleSubmit} />
    </div>
  )
}

export default CreateTrip