import { Link } from 'react-router-dom'
import { CalendarDays, MapPin, Users, Wallet } from 'lucide-react'
import type { Trip } from '../../types/trip'
import { formatCurrency, formatDateRange } from '../../utils/format'

interface TripCardProps {
  trip: Trip
}

function TripCard({ trip }: TripCardProps) {
  return (
    <article className="relative overflow-hidden rounded-2xl border border-line bg-white">
      <div className="flex h-36 items-end bg-sage p-4">
        <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-medium capitalize text-brand-900">
          {trip.status}
        </span>
      </div>

      <div className="p-5">
        <h2 className="break-words font-display text-xl font-bold text-brand-900">
          <Link
            to={`/trips/${trip.id}`}
            className="hover:text-brand-600 focus-visible:outline-2 focus-visible:outline-brand-600 after:absolute after:inset-0"
          >
            {trip.title}
          </Link>
        </h2>

        <ul className="mt-3 space-y-2 text-sm text-muted">
          <li className="flex items-start gap-2">
            <MapPin size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
            <span className="break-words">{trip.destination}</span>
          </li>
          <li className="flex items-start gap-2">
            <CalendarDays
              size={16}
              className="mt-0.5 shrink-0"
              aria-hidden="true"
            />
            <span>{formatDateRange(trip.startDate, trip.endDate)}</span>
          </li>
          <li className="flex items-start gap-2">
            <Users size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
            <span>{trip.travelerCount} travelers</span>
          </li>
          <li className="flex items-start gap-2">
            <Wallet size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
            <span>{formatCurrency(trip.estimatedBudgetPerPerson)} per person</span>
          </li>
        </ul>
      </div>
    </article>
  )
}

export default TripCard