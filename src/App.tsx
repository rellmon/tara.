import { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import Trips from './pages/Trips'
import CreateTrip from './pages/CreateTrip'
import TripDetails from './pages/TripDetails'
import EditTrip from './pages/EditTrip'
import type { Trip } from './types/trip'
import { loadTrips, saveTrips } from './services/tripStorage'
import Dashboard from './pages/Dashboard'

function App() {
  const [trips, setTrips] = useState<Trip[]>(loadTrips)

  useEffect(() => {
    saveTrips(trips)
  }, [trips])

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
          element={<TripDetails trips={trips} onDeleteTrip={deleteTrip} />}
        />
        <Route
          path="/trips/:tripId/edit"
          element={<EditTrip trips={trips} onUpdateTrip={updateTrip} />}
        />
      </Route>
    </Routes>
  )
}

export default App