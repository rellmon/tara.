import { CalendarDays, MapPin, Users, Wallet } from 'lucide-react'
import type { Trip } from '../../types/trip'
import { formatCurrency, formatDateRange } from '../../utils/format'

interface TripCardProps {
  trip: Trip
}

function TripCard({ trip }: TripCardProps) {
  return (
    <article className="overflow-hidden rounded-2xl border border-line bg-white">
      <div className="flex h-36 items-end bg-sage p-4">
        <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-medium capitalize text-brand-900">
          {trip.status}
        </span>
      </div>

      <div className="p-5">
        <h2 className="font-display text-xl font-bold text-brand-900">
          {trip.title}
        </h2>

        <ul className="mt-3 space-y-2 text-sm text-muted">
          <li className="flex items-center gap-2">
            <MapPin size={16} aria-hidden="true" />
            {trip.destination}
          </li>
          <li className="flex items-center gap-2">
            <CalendarDays size={16} aria-hidden="true" />
            {formatDateRange(trip.startDate, trip.endDate)}
          </li>
          <li className="flex items-center gap-2">
            <Users size={16} aria-hidden="true" />
            {trip.travelerCount} travelers
          </li>
          <li className="flex items-center gap-2">
            <Wallet size={16} aria-hidden="true" />
            {formatCurrency(trip.estimatedBudgetPerPerson)} per person
          </li>
        </ul>
      </div>
    </article>
  )
}

export default TripCard