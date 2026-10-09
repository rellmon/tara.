import { Link } from 'react-router-dom'
import { sampleTrips } from '../data/sampleTrips'
import TripCard from '../components/trips/TripCard'

function Trips() {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
            <h1 className="font-display text-4xl font-bold text-brand-600">My Trips</h1>
            <p className="mt-2 text-muted">All your barkada adventures in one place.</p>
        </div>
        <Link
            to="/trips/new"
            className="rounded-full bg-brand-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-700"
        >
            New trip
        </Link>
    </div>
  )
}

export default Trips