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
import { loadTrips, saveTrips } from './services/tripStorage'
import type { ItineraryActivity } from './types/itinerary'
import type { Trip } from './types/trip'

function App() {
  const [trips, setTrips] = useState<Trip[]>(loadTrips)
  const [activities, setActivities] =
    useState<ItineraryActivity[]>(loadActivities)

  useEffect(() => {
    saveTrips(trips)
  }, [trips])

  useEffect(() => {
    saveActivities(activities)
  }, [activities])

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
  }

  function addActivity(activity: ItineraryActivity) {
    setActivities((previousActivities) => [...previousActivities, activity])
  }

  function updateActivity(updatedActivity: ItineraryActivity) {
    setActivities((previousActivities) =>
      previousActivities.map((activity) =>
        activity.id === updatedActivity.id ? updatedActivity : activity,
      ),
    )
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
              onDeleteTrip={deleteTrip}
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