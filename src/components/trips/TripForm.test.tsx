import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TripForm from './TripForm'
import type { TripFormValues } from './TripForm'

describe('TripForm', () => {
  it('shows errors and does not submit when the form is empty', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn<(values: TripFormValues) => void>()
    render(<TripForm onSubmit={onSubmit} />)

    await user.click(screen.getByRole('button', { name: 'Create trip' }))

    expect(screen.getByText('Trip title is required.')).toBeInTheDocument()
    expect(screen.getByText('Destination is required.')).toBeInTheDocument()
    expect(screen.getByText('Please choose a valid start date.')).toBeInTheDocument()
    expect(screen.getByText('Please choose a valid end date.')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('rejects a title made only of spaces', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn<(values: TripFormValues) => void>()
    render(<TripForm onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText('Trip title'), '   ')
    await user.click(screen.getByRole('button', { name: 'Create trip' }))

    expect(screen.getByText('Trip title is required.')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('rejects an end date before the start date', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn<(values: TripFormValues) => void>()
    render(<TripForm onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText('Trip title'), 'Barkada La Union Escape')
    await user.type(screen.getByLabelText('Destination'), 'San Juan, La Union')
    fireEvent.change(screen.getByLabelText('Start date'), {
      target: { value: '2026-11-16' },
    })
    fireEvent.change(screen.getByLabelText('End date'), {
      target: { value: '2026-11-14' },
    })
    await user.click(screen.getByRole('button', { name: 'Create trip' }))

    expect(
      screen.getByText('End date cannot be before the start date.'),
    ).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('rejects zero travelers and a negative budget', async () => {
    const user = userEvent.setup()
    render(<TripForm onSubmit={vi.fn()} />)

    const travelers = screen.getByLabelText('Number of travelers')
    await user.clear(travelers)
    await user.type(travelers, '0')
    await user.type(screen.getByLabelText('Budget per person (₱)'), '-500')
    await user.click(screen.getByRole('button', { name: 'Create trip' }))

    expect(
      screen.getByText('Enter at least 1 traveler (whole number).'),
    ).toBeInTheDocument()
    expect(screen.getByText('Budget must be 0 or more.')).toBeInTheDocument()
  })

  it('rejects a cover image that is not an http or https link', async () => {
    const user = userEvent.setup()
    render(<TripForm onSubmit={vi.fn()} />)

    await user.type(
      screen.getByLabelText('Cover image link (optional)'),
      'javascript:alert(1)',
    )
    await user.click(screen.getByRole('button', { name: 'Create trip' }))

    expect(
      screen.getByText('Enter a full link starting with http:// or https://.'),
    ).toBeInTheDocument()
  })

  it('submits clean values, with numbers converted from text', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn<(values: TripFormValues) => void>()
    render(<TripForm onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText('Trip title'), '  Barkada La Union Escape ')
    await user.type(screen.getByLabelText('Destination'), 'San Juan, La Union')
    fireEvent.change(screen.getByLabelText('Start date'), {
      target: { value: '2026-11-14' },
    })
    fireEvent.change(screen.getByLabelText('End date'), {
      target: { value: '2026-11-16' },
    })
    const travelers = screen.getByLabelText('Number of travelers')
    await user.clear(travelers)
    await user.type(travelers, '5')
    await user.type(screen.getByLabelText('Budget per person (₱)'), '15000')
    await user.click(screen.getByRole('button', { name: 'Create trip' }))

    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(onSubmit).toHaveBeenCalledWith({
      title: 'Barkada La Union Escape',
      destination: 'San Juan, La Union',
      startDate: '2026-11-14',
      endDate: '2026-11-16',
      description: '',
      coverImage: '',
      travelerCount: 5,
      estimatedBudgetPerPerson: 15000,
    })
  })

  it('opens pre-filled with the saved values when editing', () => {
    render(
      <TripForm
        onSubmit={vi.fn()}
        submitLabel="Save changes"
        initialValues={{
          title: 'Barkada La Union Escape',
          destination: 'San Juan, La Union',
          startDate: '2026-11-14',
          endDate: '2026-11-16',
          description: 'A three-day beach trip.',
          coverImage: '',
          travelerCount: 5,
          estimatedBudgetPerPerson: 15000,
        }}
      />,
    )

    expect(screen.getByLabelText('Trip title')).toHaveValue('Barkada La Union Escape')
    expect(screen.getByLabelText('Start date')).toHaveValue('2026-11-14')
    expect(screen.getByLabelText('Number of travelers')).toHaveValue(5)
    expect(screen.getByLabelText('Budget per person (₱)')).toHaveValue(15000)
    expect(screen.getByRole('button', { name: 'Save changes' })).toBeInTheDocument()
  })
})