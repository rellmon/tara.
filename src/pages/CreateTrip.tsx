import TripForm from '../components/trips/TripForm'
import type { TripFormValues } from '../components/trips/TripForm'

function CreateTrip() {
  function handleSubmit(values: TripFormValues) {
    console.log('Form submitted:', values)
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