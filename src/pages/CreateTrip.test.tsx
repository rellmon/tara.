import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import CreateTrip from './CreateTrip'
import type { Trip } from '../types/trip'

function renderCreateTrip(onAddTrip: (trip: Trip) => void) {
  render(
    <MemoryRouter initialEntries={['/trips/new']}>
      <Routes>
        <Route path="/trips/new" element={<CreateTrip onAddTrip={onAddTrip} />} />
        <Route path="/trips" element={<p>Trips list page</p>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('CreateTrip', () => {
  it('creates a planning trip with a unique id and goes to My Trips', async () => {
    const user = userEvent.setup()
    const onAddTrip = vi.fn<(trip: Trip) => void>()
    renderCreateTrip(onAddTrip)

    await user.type(screen.getByLabelText('Trip title'), 'Barkada La Union Escape')
    await user.type(screen.getByLabelText('Destination'), 'San Juan, La Union')
    fireEvent.change(screen.getByLabelText('Start date'), {
      target: { value: '2026-11-14' },
    })
    fireEvent.change(screen.getByLabelText('End date'), {
      target: { value: '2026-11-16' },
    })
    await user.type(screen.getByLabelText('Budget per person (₱)'), '15000')
    await user.click(screen.getByRole('button', { name: 'Create trip' }))

    expect(onAddTrip).toHaveBeenCalledTimes(1)
    const trip = onAddTrip.mock.calls[0][0]
    expect(trip).toMatchObject({
      title: 'Barkada La Union Escape',
      destination: 'San Juan, La Union',
      status: 'planning',
      travelerCount: 2,
      estimatedBudgetPerPerson: 15000,
    })
    expect(trip.id.length).toBeGreaterThan(0)
    expect(screen.getByText('Trips list page')).toBeInTheDocument()
  })

  it('stays on the form and saves nothing when the form is invalid', async () => {
    const user = userEvent.setup()
    const onAddTrip = vi.fn<(trip: Trip) => void>()
    renderCreateTrip(onAddTrip)

    await user.click(screen.getByRole('button', { name: 'Create trip' }))

    expect(onAddTrip).not.toHaveBeenCalled()
    expect(screen.queryByText('Trips list page')).not.toBeInTheDocument()
    expect(screen.getByText('Trip title is required.')).toBeInTheDocument()
  })
})