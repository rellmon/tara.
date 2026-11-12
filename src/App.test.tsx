import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import App from './App'
import ConfirmProvider from './components/ui/ConfirmProvider'

function renderApp(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <ConfirmProvider>
        <App />
      </ConfirmProvider>
    </MemoryRouter>,
  )
}

function readList(key: string): Array<Record<string, unknown>> {
  const raw = localStorage.getItem(key)
  return raw === null ? [] : (JSON.parse(raw) as Array<Record<string, unknown>>)
}

describe('persistence', () => {
  it('shows the sample trip on the first visit', () => {
    renderApp('/trips')

    expect(
      screen.getByRole('link', { name: 'Barkada La Union Escape' }),
    ).toBeInTheDocument()
  })

  it('keeps a created trip after the app is reloaded', async () => {
    const user = userEvent.setup()
    const firstVisit = renderApp('/trips/new')

    await user.type(screen.getByLabelText('Trip title'), 'Moalboal Sardine Run')
    await user.type(screen.getByLabelText('Destination'), 'Moalboal, Cebu')
    fireEvent.change(screen.getByLabelText('Start date'), {
      target: { value: '2026-12-10' },
    })
    fireEvent.change(screen.getByLabelText('End date'), {
      target: { value: '2026-12-12' },
    })
    await user.click(screen.getByRole('button', { name: 'Create trip' }))

    expect(
      await screen.findByRole('link', { name: 'Moalboal Sardine Run' }),
    ).toBeInTheDocument()
    expect(
      readList('tara.trips').some((trip) => trip.title === 'Moalboal Sardine Run'),
    ).toBe(true)

    // "Reload": throw the whole app away and start a fresh one.
    firstVisit.unmount()
    renderApp('/trips')

    expect(
      screen.getByRole('link', { name: 'Moalboal Sardine Run' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'Barkada La Union Escape' }),
    ).toBeInTheDocument()
  })

  it('does not crash on corrupted saved data, and repairs it', () => {
    localStorage.setItem('tara.trips', '{{{')

    renderApp('/trips')

    expect(
      screen.getByRole('link', { name: 'Barkada La Union Escape' }),
    ).toBeInTheDocument()
    expect(() => JSON.parse(localStorage.getItem('tara.trips') ?? '')).not.toThrow()
  })

  it('respects an empty saved list instead of restoring the sample trip', () => {
    localStorage.setItem('tara.trips', '[]')

    renderApp('/trips')

    expect(screen.getByRole('heading', { name: 'No trips yet' })).toBeInTheDocument()
    expect(
      screen.queryByRole('link', { name: 'Barkada La Union Escape' }),
    ).not.toBeInTheDocument()
  })

  it('deleting a trip removes everything attached to it, and nothing else', async () => {
    const user = userEvent.setup()
    renderApp('/trips/sample-la-union')

    const attachedLists = [
      'tara.activities',
      'tara.budgetItems',
      'tara.participants',
      'tara.expenses',
      'tara.packingItems',
    ]

    // Before: the sample trip has data in every list.
    for (const key of attachedLists) {
      expect(readList(key).some((item) => item.tripId === 'sample-la-union')).toBe(true)
    }
    expect(readList('tara.polls')).toHaveLength(2)
    expect(readList('tara.votes')).toHaveLength(7)

    await user.click(screen.getByRole('button', { name: 'Delete trip' }))
    const dialog = await screen.findByRole('dialog')
    await user.click(within(dialog).getByRole('button', { name: 'Delete trip' }))

    expect(
      await screen.findByRole('heading', { name: 'No trips yet' }),
    ).toBeInTheDocument()

    await waitFor(() => {
      expect(readList('tara.trips')).toEqual([])

      for (const key of attachedLists) {
        expect(readList(key).every((item) => item.tripId !== 'sample-la-union')).toBe(true)
      }

      // The poll tied to this trip goes with its votes. The trip-less poll stays.
      expect(readList('tara.polls').map((poll) => poll.id)).toEqual(['sample-poll-1'])
      const votes = readList('tara.votes')
      expect(votes).toHaveLength(4)
      expect(votes.every((vote) => vote.pollId === 'sample-poll-1')).toBe(true)
    })
  })
})