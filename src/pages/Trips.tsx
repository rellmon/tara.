import { Link } from 'react-router-dom'
import { Luggage } from 'lucide-react'
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

      {trips.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-dashed border-line px-6 py-14 text-center">
          <Luggage
            size={40}
            className="mx-auto text-brand-500"
            aria-hidden="true"
          />
          <h2 className="mt-4 font-display text-2xl font-bold text-brand-900">
            No trips yet
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-muted">
            Pick a destination, gather your friends, and start the plan.
          </p>
          <Link
            to="/trips/new"
            className="mt-6 inline-block rounded-full bg-brand-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-700"
          >
            Plan your first trip
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {trips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Trips