import { useState } from 'react'
import { MapPin } from 'lucide-react'
import type { Trip } from '../../types/trip'
import { getTripTiming } from '../../utils/tripTiming'
import type { TripTimingKind } from '../../utils/tripTiming'

interface TripCoverProps {
  trip: Trip
  className?: string // height and rounding, e.g. "h-36"
}

const timingClasses: Record<TripTimingKind, string> = {
  upcoming: 'bg-white/90 text-brand-900',
  ongoing: 'bg-sunset text-charcoal',
  ended: 'bg-charcoal/80 text-white',
}

function TripCover({ trip, className = 'h-36' }: TripCoverProps) {
  // Remember which link failed to load, so a different link is tried again.
  const [failedUrl, setFailedUrl] = useState<string | null>(null)

  const image = trip.coverImage.trim()
  const showImage = image !== '' && failedUrl !== image
  const timing = getTripTiming(trip.startDate, trip.endDate)

  return (
    <div className={`relative overflow-hidden bg-sage ${className}`}>
      {showImage ? (
        <img
          src={image}
          alt=""
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setFailedUrl(image)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-sage-dark">
          <MapPin size={56} aria-hidden="true" />
        </div>
      )}

      <div className="relative flex h-full items-end justify-between gap-2 p-4">
        <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-medium capitalize text-brand-900">
          {trip.status}
        </span>
        {timing && (
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${timingClasses[timing.kind]}`}
          >
            {timing.label}
          </span>
        )}
      </div>
    </div>
  )
}

export default TripCover