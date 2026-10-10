import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, CalendarDays, MapPin, Users, Wallet } from 'lucide-react'
import BudgetSection from '../components/budget/BudgetSection'
import DailyBudget from '../components/budget/DailyBudget'
import EstimatedBreakdown from '../components/budget/EstimatedBreakdown'
import ExpensesSection from '../components/expenses/ExpensesSection'
import ItinerarySection from '../components/itinerary/ItinerarySection'
import ParticipantsSection from '../components/participants/ParticipantsSection'
import type { BudgetItem } from '../types/budget'
import type { Expense } from '../types/expense'
import type { ItineraryActivity } from '../types/itinerary'
import type { Participant } from '../types/participant'
import type { Trip } from '../types/trip'
import { formatCurrency, formatDateRange } from '../utils/format'

interface TripDetailsProps {
  trips: Trip[]
  activities: ItineraryActivity[]
  budgetItems: BudgetItem[]
  participants: Participant[]
  expenses: Expense[]
  onDeleteTrip: (tripId: string) => void
  onDeleteActivity: (activityId: string) => void
  onMoveActivity: (activityId: string, direction: -1 | 1) => void
  onReorderActivity: (activeId: string, overId: string) => void
  onAddBudgetItem: (item: BudgetItem) => void
  onDeleteBudgetItem: (itemId: string) => void
  onAddParticipant: (participant: Participant) => void
  onDeleteParticipant: (participantId: string) => void
  onAddExpense: (expense: Expense) => void
}

function TripDetails({
  trips,
  activities,
  budgetItems,
  participants,
  expenses,
  onDeleteTrip,
  onDeleteActivity,
  onMoveActivity,
  onReorderActivity,
  onAddBudgetItem,
  onDeleteBudgetItem,
  onAddParticipant,
  onDeleteParticipant,
  onAddExpense,
}: TripDetailsProps) {
  const { tripId } = useParams()
  const navigate = useNavigate()
  const trip = trips.find((t) => t.id === tripId)

  if (!trip) {
    return (
      <div className="py-16 text-center">
        <h1 className="font-display text-3xl font-bold text-brand-900">
          Trip not found
        </h1>
        <p className="mt-2 text-muted">
          This trip doesn't exist or may have been removed.
        </p>
        <Link
          to="/trips"
          className="mt-6 inline-block rounded-full bg-brand-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-700"
        >
          Back to My Trips
        </Link>
      </div>
    )
  }

  function handleDelete() {
    const confirmed = window.confirm(
      `Delete "${trip!.title}"? This can't be undone.`,
    )
    if (!confirmed) return

    onDeleteTrip(trip!.id)
    navigate('/trips')
  }

  const totalBudget = trip.travelerCount * trip.estimatedBudgetPerPerson

  return (
    <div>
      <Link
        to="/trips"
        className="inline-flex items-center gap-2 text-sm font-medium text-brand-700 hover:text-brand-900"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        My Trips
      </Link>

      <div className="mt-4 flex h-48 items-end rounded-3xl bg-sage p-6">
        <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-medium capitalize text-brand-900">
          {trip.status}
        </span>
      </div>

      <h1 className="mt-6 break-words font-display text-4xl font-bold text-brand-900">
        {trip.title}
      </h1>
      {trip.description && (
        <p className="mt-2 max-w-2xl break-words text-muted">
          {trip.description}
        </p>
      )}

      <div className="mt-5 flex flex-wrap gap-3">
        <Link
          to={`/trips/${trip.id}/edit`}
          className="rounded-full bg-sage px-5 py-2.5 text-sm font-medium text-brand-900 transition-colors hover:bg-sage-dark"
        >
          Edit trip
        </Link>
        <button
          type="button"
          onClick={handleDelete}
          className="rounded-full px-5 py-2.5 text-sm font-medium text-red-700 transition-colors hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-red-700"
        >
          Delete trip
        </button>
      </div>

      <dl className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-line bg-white p-5">
          <dt className="flex items-center gap-2 text-sm text-muted">
            <MapPin size={16} aria-hidden="true" />
            Destination
          </dt>
          <dd className="mt-1 break-words font-semibold">{trip.destination}</dd>
        </div>
        <div className="rounded-2xl border border-line bg-white p-5">
          <dt className="flex items-center gap-2 text-sm text-muted">
            <CalendarDays size={16} aria-hidden="true" />
            Dates
          </dt>
          <dd className="mt-1 font-semibold">
            {formatDateRange(trip.startDate, trip.endDate)}
          </dd>
        </div>
        <div className="rounded-2xl border border-line bg-white p-5">
          <dt className="flex items-center gap-2 text-sm text-muted">
            <Users size={16} aria-hidden="true" />
            Travelers
          </dt>
          <dd className="mt-1 font-semibold">{trip.travelerCount}</dd>
        </div>
        <div className="rounded-2xl border border-line bg-white p-5">
          <dt className="flex items-center gap-2 text-sm text-muted">
            <Wallet size={16} aria-hidden="true" />
            Estimated budget
          </dt>
          <dd className="mt-1 break-words font-semibold">
            {formatCurrency(totalBudget)}
          </dd>
          <dd className="text-sm text-muted">
            {formatCurrency(trip.estimatedBudgetPerPerson)} per person
          </dd>
        </div>
      </dl>

      <ParticipantsSection
        trip={trip}
        participants={participants}
        expenses={expenses}
        onAddParticipant={onAddParticipant}
        onDeleteParticipant={onDeleteParticipant}
      />

      <EstimatedBreakdown
        trip={trip}
        activities={activities}
        budgetItems={budgetItems}
      />

      <DailyBudget
        trip={trip}
        activities={activities}
        budgetItems={budgetItems}
      />

      <BudgetSection
        trip={trip}
        items={budgetItems}
        onAddItem={onAddBudgetItem}
        onDeleteItem={onDeleteBudgetItem}
      />

      <ExpensesSection
        trip={trip}
        expenses={expenses}
        participants={participants}
        onAddExpense={onAddExpense}
      />

      <ItinerarySection
        trip={trip}
        activities={activities}
        onDeleteActivity={onDeleteActivity}
        onMoveActivity={onMoveActivity}
        onReorderActivity={onReorderActivity}
      />
    </div>
  )
}

export default TripDetails