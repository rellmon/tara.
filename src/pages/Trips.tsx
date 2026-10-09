import { Link } from 'react-router-dom'
import TripCard from '../components/trips/TripCard'
import type { Trip } from '../types/trip'

interface TripsProps {
  trips: Trip[]
}

function Trips({ trips }: TripsProps) {
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-bold text-brand-600">
            My Trips
          </h1>
          <p className="mt-2 text-muted">
            All your barkada adventures in one place.
          </p>
        </div>
        <Link
          to="/trips/new"
          className="rounded-full bg-brand-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-700"
        >
          New trip
        </Link>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {trips.map((trip) => (
          <TripCard key={trip.id} trip={trip} />
        ))}
      </div>
    </div>
  )
}

export default Trips