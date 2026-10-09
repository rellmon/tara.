import { sampleTrips } from '../data/sampleTrips'
import TripCard from '../components/trips/TripCard'

function Trips() {
  return (
    <div>
      <h1 className="font-display text-4xl font-bold text-brand-600">My Trips</h1>
      <p className="mt-2 text-muted">All your barkada adventures in one place.</p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {sampleTrips.map((trip) => (
          <TripCard key={trip.id} trip={trip} />
        ))}
      </div>
    </div>
  )
}

export default Trips