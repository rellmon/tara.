import { sampleTrips } from '../data/sampleTrips'

function Trips() {
  const trip = sampleTrips[0]

  return (
    <div>
      <h1 className="font-display text-4xl font-bold text-brand-600">My Trips</h1>
      <p className="mt-4 font-semibold">{trip.title}</p>
      <p className="text-muted">
        {trip.destination} · {trip.startDate} to {trip.endDate}
      </p>
      <p className="text-muted">
        {trip.travelerCount} travelers · ₱{trip.estimatedBudgetPerPerson} each
      </p>
    </div>
  )
}

export default Trips