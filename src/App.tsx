import { Route, Routes } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import Trips from './pages/Trips'
import CreateTrip from './pages/CreateTrip'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/trips" element={<Trips />} />
        <Route path="/trips/new" element={<CreateTrip />} />
      </Route>
    </Routes>
  )
}

export default App