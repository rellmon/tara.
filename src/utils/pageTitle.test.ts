import { describe, expect, it } from 'vitest'
import { getPageTitle } from './pageTitle'

describe('getPageTitle', () => {
  it('has a title for each main page', () => {
    expect(getPageTitle('/')).toBe('Tara — plan trips with your barkada')
    expect(getPageTitle('/dashboard')).toBe('Dashboard · Tara')
    expect(getPageTitle('/trips')).toBe('My Trips · Tara')
    expect(getPageTitle('/trips/new')).toBe('New trip · Tara')
    expect(getPageTitle('/polls')).toBe('Polls · Tara')
  })

  it('has titles for trip and activity pages', () => {
    expect(getPageTitle('/trips/abc-123')).toBe('Trip details · Tara')
    expect(getPageTitle('/trips/abc-123/edit')).toBe('Edit trip · Tara')
    expect(getPageTitle('/trips/abc-123/activities/new')).toBe('Add activity · Tara')
    expect(getPageTitle('/trips/abc/activities/xyz/edit')).toBe('Edit activity · Tara')
  })

  it('ignores a trailing slash', () => {
    expect(getPageTitle('/trips/')).toBe('My Trips · Tara')
  })

  it('falls back to a not-found title for unknown paths', () => {
    expect(getPageTitle('/about')).toBe('Page not found · Tara')
    expect(getPageTitle('/trips/abc/unknown')).toBe('Page not found · Tara')
  })
})