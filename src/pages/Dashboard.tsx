import { Link } from 'react-router-dom'
import TripCard from '../components/trips/TripCard'
import { getUpcomingTrips } from '../utils/tripFilters'
import type { Trip } from '../types/trip'

interface DashboardProps {
  trips: Trip[]
}

function Dashboard({ trips }: DashboardProps) {
    const upcomingTrips = getUpcomingTrips(trips)
  return (
    <div className="space-y-10">
      {/* Welcome */}
      <section>
        <p className="text-sm font-medium text-brand-600">Dashboard</p>
        <h1 className="mt-1 font-display text-4xl font-bold text-brand-900">
          Tara na! Where to next?
        </h1>
        <p className="mt-2 max-w-xl text-muted">
          Here's a quick look at your barkada's plans.
        </p>
      </section>

      {/* Summary */}
      <section aria-labelledby="summary-heading">
        <h2 id="summary-heading" className="sr-only">
          Summary
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {['Total trips', 'Upcoming', 'Completed', 'Estimated spending'].map(
            (label) => (
              <div
                key={label}
                className="rounded-2xl border border-line bg-white p-5"
              >
                <p className="text-sm text-muted">{label}</p>
                <p className="mt-1 font-display text-3xl font-bold text-brand-900">
                  –
                </p>
              </div>
            ),
          )}
        </div>
      </section>

      {/* Upcoming trips + quick actions */}
      <div className="grid gap-8 lg:grid-cols-3">
        <section aria-labelledby="upcoming-heading" className="lg:col-span-2">
            <h2
                id="upcoming-heading"
                className="font-display text-2xl font-bold text-brand-900"
            >
                Upcoming trips
            </h2>

            {upcomingTrips.length === 0 ? (
                <div className="mt-4 rounded-2xl border border-dashed border-line p-8 text-center">
                <p className="text-muted">No upcoming trips yet.</p>
                <Link
                    to="/trips/new"
                    className="mt-4 inline-block rounded-full bg-brand-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-700"
                >
                    Plan a trip
                </Link>
                </div>
            ) : (
                <div className="mt-4 grid gap-5 sm:grid-cols-2">
                {upcomingTrips.map((trip) => (
                    <TripCard key={trip.id} trip={trip} />
                ))}
                </div>
            )}
        </section>

        <section aria-labelledby="actions-heading">
          <h2
            id="actions-heading"
            className="font-display text-2xl font-bold text-brand-900"
          >
            Quick actions
          </h2>
          <div className="mt-4 rounded-2xl border border-dashed border-line p-8 text-center text-muted">
            Quick actions will appear here.
          </div>
        </section>
      </div>
    </div>
  )
}

export default Dashboard