import { describe, expect, it } from 'vitest'
import { validateTripForm } from './validateTrip'
import type { TripFormInput } from './validateTrip'

function makeInput(overrides: Partial<TripFormInput> = {}): TripFormInput {
  return {
    title: 'Barkada La Union Escape',
    destination: 'San Juan, La Union',
    startDate: '2026-11-14',
    endDate: '2026-11-16',
    coverImage: '',
    travelerCount: 5,
    estimatedBudgetPerPerson: 15000,
    ...overrides,
  }
}

describe('validateTripForm', () => {
  it('accepts a valid trip with no cover image', () => {
    expect(validateTripForm(makeInput())).toEqual({})
  })

  it('accepts an https cover image link', () => {
    const errors = validateTripForm(
      makeInput({ coverImage: 'https://example.com/photo.jpg' }),
    )

    expect(errors.coverImage).toBeUndefined()
  })

  it('rejects a cover image that is not a link', () => {
    expect(validateTripForm(makeInput({ coverImage: 'beach photo' })).coverImage).toBeDefined()
  })

  it('rejects cover image links that are not http or https', () => {
    for (const coverImage of ['javascript:alert(1)', 'ftp://example.com/a.jpg', 'file:///etc/passwd']) {
      expect(validateTripForm(makeInput({ coverImage })).coverImage).toBeDefined()
    }
  })

  it('rejects an overly long cover image link', () => {
    const coverImage = `https://example.com/${'a'.repeat(500)}`

    expect(validateTripForm(makeInput({ coverImage })).coverImage).toBeDefined()
  })

  it('rejects an end date before the start date', () => {
    const errors = validateTripForm(
      makeInput({ startDate: '2026-11-16', endDate: '2026-11-14' }),
    )

    expect(errors.endDate).toBeDefined()
  })
})