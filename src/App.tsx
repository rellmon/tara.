import { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Trips from './pages/Trips'
import CreateTrip from './pages/CreateTrip'
import TripDetails from './pages/TripDetails'
import EditTrip from './pages/EditTrip'
import AddActivity from './pages/AddActivity'
import EditActivity from './pages/EditActivity'
import { loadActivities, saveActivities } from './services/activityStorage'
import { loadBudgetItems, saveBudgetItems } from './services/budgetStorage'
import { loadExpenses, saveExpenses } from './services/expenseStorage'
import {
  loadParticipants,
  saveParticipants,
} from './services/participantStorage'
import { loadTrips, saveTrips } from './services/tripStorage'
import {
  insertActivityByTime,
  moveActivity,
  reorderActivity,
} from './utils/itinerary'
import type { BudgetItem } from './types/budget'
import type { Expense } from './types/expense'
import type { ItineraryActivity } from './types/itinerary'
import type { Participant } from './types/participant'
import type { Trip } from './types/trip'

function App() {
  const [trips, setTrips] = useState<Trip[]>(loadTrips)
  const [activities, setActivities] =
    useState<ItineraryActivity[]>(loadActivities)
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>(loadBudgetItems)
  const [participants, setParticipants] =
    useState<Participant[]>(loadParticipants)
  const [expenses, setExpenses] = useState<Expense[]>(loadExpenses)

  useEffect(() => {
    saveTrips(trips)
  }, [trips])

  useEffect(() => {
    saveActivities(activities)
  }, [activities])

  useEffect(() => {
    saveBudgetItems(budgetItems)
  }, [budgetItems])

  useEffect(() => {
    saveParticipants(participants)
  }, [participants])

  useEffect(() => {
    saveExpenses(expenses)
  }, [expenses])

  function addTrip(trip: Trip) {
    setTrips((previousTrips) => [trip, ...previousTrips])
  }

  function updateTrip(updatedTrip: Trip) {
    setTrips((previousTrips) =>
      previousTrips.map((trip) =>
        trip.id === updatedTrip.id ? updatedTrip : trip,
      ),
    )
  }

  function deleteTrip(tripId: string) {
    setTrips((previousTrips) =>
      previousTrips.filter((trip) => trip.id !== tripId),
    )
    setActivities((previousActivities) =>
      previousActivities.filter((activity) => activity.tripId !== tripId),
    )
    setBudgetItems((previousItems) =>
      previousItems.filter((item) => item.tripId !== tripId),
    )
    setParticipants((previousParticipants) =>
      previousParticipants.filter((participant) => participant.tripId !== tripId),
    )
    setExpenses((previousExpenses) =>
      previousExpenses.filter((expense) => expense.tripId !== tripId),
    )
  }

  function addActivity(activity: ItineraryActivity) {
    setActivities((previousActivities) =>
      insertActivityByTime(previousActivities, activity),
    )
  }

  function updateActivity(updatedActivity: ItineraryActivity) {
    setActivities((previousActivities) => {
      const existing = previousActivities.find(
        (activity) => activity.id === updatedActivity.id,
      )
      if (!existing) return previousActivities

      // If the day or start time changed, put it where it now fits.
      // Otherwise keep its current position (it may have been reordered).
      const needsReposition =
        existing.date !== updatedActivity.date ||
        existing.startTime !== updatedActivity.startTime

      if (!needsReposition) {
        return previousActivities.map((activity) =>
          activity.id === updatedActivity.id ? updatedActivity : activity,
        )
      }

      return insertActivityByTime(
        previousActivities.filter(
          (activity) => activity.id !== updatedActivity.id,
        ),
        updatedActivity,
      )
    })
  }

  function deleteActivity(activityId: string) {
    setActivities((previousActivities) =>
      previousActivities.filter((activity) => activity.id !== activityId),
    )
  }

  function handleMoveActivity(activityId: string, direction: -1 | 1) {
    setActivities((previousActivities) =>
      moveActivity(previousActivities, activityId, direction),
    )
  }

  function handleReorderActivity(activeId: string, overId: string) {
    setActivities((previousActivities) =>
      reorderActivity(previousActivities, activeId, overId),
    )
  }

  function addBudgetItem(item: BudgetItem) {
    setBudgetItems((previousItems) => [...previousItems, item])
  }

  function deleteBudgetItem(itemId: string) {
    setBudgetItems((previousItems) =>
      previousItems.filter((item) => item.id !== itemId),
    )
  }

  function addParticipant(participant: Participant) {
    setParticipants((previousParticipants) => [
      ...previousParticipants,
      participant,
    ])
  }

  function deleteParticipant(participantId: string) {
    setParticipants((previousParticipants) =>
      previousParticipants.filter(
        (participant) => participant.id !== participantId,
      ),
    )
  }

  function addExpense(expense: Expense) {
    setExpenses((previousExpenses) => [...previousExpenses, expense])
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard trips={trips} />} />
        <Route path="/trips" element={<Trips trips={trips} />} />
        <Route path="/trips/new" element={<CreateTrip onAddTrip={addTrip} />} />
        <Route
          path="/trips/:tripId"
          element={
            <TripDetails
              trips={trips}
              activities={activities}
              budgetItems={budgetItems}
              participants={participants}
              expenses={expenses}
              onDeleteTrip={deleteTrip}
              onDeleteActivity={deleteActivity}
              onMoveActivity={handleMoveActivity}
              onReorderActivity={handleReorderActivity}
              onAddBudgetItem={addBudgetItem}
              onDeleteBudgetItem={deleteBudgetItem}
              onAddParticipant={addParticipant}
              onDeleteParticipant={deleteParticipant}
              onAddExpense={addExpense}
            />
          }
        />
        <Route
          path="/trips/:tripId/edit"
          element={<EditTrip trips={trips} onUpdateTrip={updateTrip} />}
        />
        <Route
          path="/trips/:tripId/activities/new"
          element={<AddActivity trips={trips} onAddActivity={addActivity} />}
        />
        <Route
          path="/trips/:tripId/activities/:activityId/edit"
          element={
            <EditActivity
              trips={trips}
              activities={activities}
              onUpdateActivity={updateActivity}
            />
          }
        />
      </Route>
    </Routes>
  )
}

export default App