import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import Trips from './pages/Trips'
import CreateTrip from './pages/CreateTrip'
import { sampleTrips } from './data/sampleTrips'
import type { Trip } from './types/trip'
import TripDetails from './pages/TripDetails'

function App() {
  const [trips, setTrips] = useState<Trip[]>(sampleTrips)

  function addTrip(trip: Trip) {
    setTrips((previousTrips) => [trip, ...previousTrips])
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/trips" element={<Trips trips={trips} />} />
        <Route path="/trips/new" element={<CreateTrip onAddTrip={addTrip} />} />
        <Route path="/trips/:tripId" element={<TripDetails trips={trips} />} />
      </Route>
    </Routes>
  )
}

export default App