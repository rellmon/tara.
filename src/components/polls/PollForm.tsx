import { useState } from 'react'
import type { FormEvent } from 'react'
import { Plus, X } from 'lucide-react'
import Button from '../ui/Button'
import type { Trip } from '../../types/trip'
import {
  MAX_POLL_OPTIONS,
  MIN_POLL_OPTIONS,
  cleanPollOptions,
  validatePoll,
} from '../../utils/validatePoll'
import type { PollErrors } from '../../utils/validatePoll'

export interface PollFormValues {
  question: string
  options: string[] // trimmed, non-blank
  tripId: string | null
}

interface PollFormProps {
  trips: Trip[]
  onSubmit: (values: PollFormValues) => void
}

interface OptionRow {
  id: string
  label: string
}

const inputClasses =
  'mt-1 w-full rounded-xl border border-line bg-white px-4 py-2.5 text-charcoal focus-visible:outline-2 focus-visible:outline-brand-600'

function blankRows(): OptionRow[] {
  return Array.from({ length: MIN_POLL_OPTIONS }, () => ({
    id: crypto.randomUUID(),
    label: '',
  }))
}

function PollForm({ trips, onSubmit }: PollFormProps) {
  const [question, setQuestion] = useState('')
  const [rows, setRows] = useState<OptionRow[]>(blankRows)
  const [tripId, setTripId] = useState('')
  const [errors, setErrors] = useState<PollErrors>({})

  function updateRow(id: string, label: string) {
    setRows((previous) =>
      previous.map((row) => (row.id === id ? { ...row, label } : row)),
    )
  }

  function addRow() {
    setRows((previous) => [...previous, { id: crypto.randomUUID(), label: '' }])
  }

  function removeRow(id: string) {
    setRows((previous) => previous.filter((row) => row.id !== id))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const options = cleanPollOptions(rows.map((row) => row.label))
    const values = { question: question.trim(), options }

    const validationErrors = validatePoll(values)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    onSubmit({ ...values, tripId: tripId === '' ? null : tripId })

    setQuestion('')
    setRows(blankRows())
    setTripId('')
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-4 rounded-2xl border border-line bg-white p-5"
    >
      <div>
        <label htmlFor="poll-question" className="text-sm font-medium">
          Question
        </label>
        <input
          id="poll-question"
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Where should we go this weekend?"
          aria-invalid={errors.question ? true : undefined}
          aria-describedby={errors.question ? 'poll-question-error' : undefined}
          className={inputClasses}
        />
        {errors.question && (
          <p id="poll-question-error" className="mt-1 text-sm text-red-700">
            {errors.question}
          </p>
        )}
      </div>

      <fieldset
        aria-describedby={errors.options ? 'poll-options-error' : undefined}
      >
        <legend className="text-sm font-medium">Options</legend>
        <ul className="mt-2 space-y-3">
          {rows.map((row, index) => (
            <li key={row.id} className="flex items-end gap-2">
              <div className="min-w-0 flex-1">
                <label
                  htmlFor={`poll-option-${row.id}`}
                  className="text-sm text-muted"
                >
                  Option {index + 1}
                </label>
                <input
                  id={`poll-option-${row.id}`}
                  type="text"
                  value={row.label}
                  onChange={(e) => updateRow(row.id, e.target.value)}
                  placeholder={index === 0 ? 'La Union' : ''}
                  className={inputClasses}
                />
              </div>
              {rows.length > MIN_POLL_OPTIONS && (
                <button
                  type="button"
                  onClick={() => removeRow(row.id)}
                  aria-label={`Remove option ${index + 1}`}
                  className="mb-0.5 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-red-700 transition-colors hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-red-700"
                >
                  <X size={18} aria-hidden="true" />
                </button>
              )}
            </li>
          ))}
        </ul>
        {errors.options && (
          <p id="poll-options-error" className="mt-2 text-sm text-red-700">
            {errors.options}
          </p>
        )}
        <Button
          type="button"
          variant="ghost"
          onClick={addRow}
          disabled={rows.length >= MAX_POLL_OPTIONS}
          className="mt-2"
        >
          <Plus size={16} aria-hidden="true" />
          Add option
        </Button>
      </fieldset>

      <div>
        <label htmlFor="poll-trip" className="text-sm font-medium">
          Attach to a trip (optional)
        </label>
        <select
          id="poll-trip"
          value={tripId}
          onChange={(e) => setTripId(e.target.value)}
          className={inputClasses}
        >
          <option value="">No trip</option>
          {trips.map((trip) => (
            <option key={trip.id} value={trip.id}>
              {trip.title}
            </option>
          ))}
        </select>
      </div>

      <Button type="submit" size="lg">
        Create poll
      </Button>
    </form>
  )
}

export default PollForm