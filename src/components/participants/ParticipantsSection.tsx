import { useState } from 'react'
import type { FormEvent } from 'react'
import { Users } from 'lucide-react'
import Button from '../ui/Button'
import type { Participant } from '../../types/participant'
import type { Trip } from '../../types/trip'
import { validateParticipantName } from '../../utils/validateParticipant'

interface ParticipantsSectionProps {
  trip: Trip
  participants: Participant[]
  onAddParticipant: (participant: Participant) => void
  onDeleteParticipant: (participantId: string) => void
}

function ParticipantsSection({
  trip,
  participants,
  onAddParticipant,
  onDeleteParticipant,
}: ParticipantsSectionProps) {
  const [name, setName] = useState('')
  const [error, setError] = useState<string | undefined>(undefined)

  const tripParticipants = participants.filter(
    (participant) => participant.tripId === trip.id,
  )

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const validationError = validateParticipantName(
      name,
      tripParticipants.map((participant) => participant.name),
    )
    setError(validationError)
    if (validationError) return

    onAddParticipant({
      id: crypto.randomUUID(),
      tripId: trip.id,
      name: name.trim(),
    })
    setName('')
  }

  function handleDelete(participant: Participant) {
    const confirmed = window.confirm(
      `Remove "${participant.name}" from this trip?`,
    )
    if (!confirmed) return

    onDeleteParticipant(participant.id)
  }

  return (
    <section aria-labelledby="travelers-heading" className="mt-12">
      <h2
        id="travelers-heading"
        className="font-display text-2xl font-bold text-brand-900"
      >
        Travelers
      </h2>
      <p className="mt-1 text-sm text-muted">
        The people sharing this trip. You'll pick from them when recording
        expenses.
      </p>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="mt-5 rounded-2xl border border-line bg-white p-5"
      >
        <label htmlFor="participant-name" className="text-sm font-medium">
          Add a traveler
        </label>
        <div className="mt-1 flex flex-col gap-3 sm:flex-row">
          <input
            id="participant-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Alex"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? 'participant-name-error' : undefined}
            className="w-full rounded-xl border border-line bg-white px-4 py-2.5 text-charcoal focus-visible:outline-2 focus-visible:outline-brand-600"
          />
          <Button type="submit" className="shrink-0">
            Add traveler
          </Button>
        </div>
        {error && (
          <p id="participant-name-error" className="mt-1 text-sm text-red-700">
            {error}
          </p>
        )}
      </form>

      {tripParticipants.length === 0 ? (
        <p className="mt-4 rounded-2xl border border-dashed border-line p-5 text-sm text-muted">
          No travelers added yet.
        </p>
      ) : (
        <>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {tripParticipants.map((participant) => (
              <li
                key={participant.id}
                className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-white p-4"
              >
                <span className="flex min-w-0 items-center gap-2">
                  <Users
                    size={16}
                    className="shrink-0 text-brand-600"
                    aria-hidden="true"
                  />
                  <span className="break-words font-medium text-charcoal">
                    {participant.name}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => handleDelete(participant)}
                  aria-label={`Remove ${participant.name}`}
                  className="rounded-full px-3 py-1.5 text-sm font-medium text-red-700 transition-colors hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-red-700"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

          {tripParticipants.length !== trip.travelerCount && (
            <p className="mt-3 text-sm text-muted">
              {tripParticipants.length} listed, but this trip is set to{' '}
              {trip.travelerCount}{' '}
              {trip.travelerCount === 1 ? 'traveler' : 'travelers'}. Budget
              numbers use the trip's traveler count.
            </p>
          )}
        </>
      )}
    </section>
  )
}

export default ParticipantsSection