import { describe, expect, it } from 'vitest'
import { getTripTiming } from './tripTiming'

describe('getTripTiming', () => {
  it('counts the days until a future trip', () => {
    expect(getTripTiming('2026-11-14', '2026-11-16', '2026-11-10')).toEqual({
      kind: 'upcoming',
      label: 'In 4 days',
    })
  })

  it('says Tomorrow the day before the trip', () => {
    expect(getTripTiming('2026-11-14', '2026-11-16', '2026-11-13')?.label).toBe(
      'Tomorrow',
    )
  })

  it('is ongoing on the first, middle, and last day', () => {
    for (const today of ['2026-11-14', '2026-11-15', '2026-11-16']) {
      expect(getTripTiming('2026-11-14', '2026-11-16', today)).toEqual({
        kind: 'ongoing',
        label: 'Happening now',
      })
    }
  })

  it('is ongoing for a one-day trip on that day', () => {
    expect(getTripTiming('2026-11-14', '2026-11-14', '2026-11-14')?.kind).toBe(
      'ongoing',
    )
  })

  it('is ended the day after the trip', () => {
    expect(getTripTiming('2026-11-14', '2026-11-16', '2026-11-17')).toEqual({
      kind: 'ended',
      label: 'Ended',
    })
  })

  it('returns null for invalid dates', () => {
    expect(getTripTiming('', '2026-11-16', '2026-11-10')).toBeNull()
    expect(getTripTiming('2026-11-14', 'nope', '2026-11-10')).toBeNull()
  })
})