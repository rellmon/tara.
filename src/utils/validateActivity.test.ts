import { describe, expect, it } from 'vitest'
import { validateActivity } from './validateActivity'
import type { ActivityInput } from './validateActivity'

const days = ['2026-11-14', '2026-11-15', '2026-11-16']

function makeInput(overrides: Partial<ActivityInput> = {}): ActivityInput {
  return {
    date: '2026-11-14',
    title: 'Surf lesson',
    startTime: '09:00',
    endTime: '',
    estimatedCost: 0,
    url: '',
    ...overrides,
  }
}

describe('validateActivity', () => {
  it('accepts a valid activity', () => {
    expect(validateActivity(makeInput(), days)).toEqual({})
  })

  it('requires a title, including not just spaces', () => {
    expect(validateActivity(makeInput({ title: '' }), days).title).toBeDefined()
    expect(validateActivity(makeInput({ title: '   ' }), days).title).toBeDefined()
  })

  it('requires a day that is part of the trip', () => {
    expect(validateActivity(makeInput({ date: '2026-11-20' }), days).date).toBeDefined()
    expect(validateActivity(makeInput({ date: '' }), days).date).toBeDefined()
    expect(validateActivity(makeInput({ date: '2026-11-16' }), days).date).toBeUndefined()
  })

  it('rejects invalid start times', () => {
    for (const startTime of ['', '24:00', '12:60', '7:00', '9am', 'nope']) {
      expect(validateActivity(makeInput({ startTime }), days).startTime).toBeDefined()
    }
  })

  it('accepts the first and last minute of the day', () => {
    for (const startTime of ['00:00', '23:59']) {
      expect(validateActivity(makeInput({ startTime }), days).startTime).toBeUndefined()
    }
  })

  it('does not require an end time', () => {
    expect(validateActivity(makeInput({ endTime: '' }), days).endTime).toBeUndefined()
  })

  it('rejects an end time that is not after the start time', () => {
    const equal = validateActivity(makeInput({ startTime: '10:00', endTime: '10:00' }), days)
    const before = validateActivity(makeInput({ startTime: '10:00', endTime: '09:30' }), days)

    expect(equal.endTime).toBeDefined()
    expect(before.endTime).toBeDefined()
  })

  it('accepts an end time after the start time', () => {
    const errors = validateActivity(makeInput({ startTime: '10:00', endTime: '10:01' }), days)

    expect(errors.endTime).toBeUndefined()
  })

  it('rejects an end time with an invalid format', () => {
    expect(validateActivity(makeInput({ endTime: '25:00' }), days).endTime).toBeDefined()
  })

  it('does not report an end time problem while the start time is invalid', () => {
    const errors = validateActivity(makeInput({ startTime: '', endTime: '10:00' }), days)

    expect(errors.startTime).toBeDefined()
    expect(errors.endTime).toBeUndefined()
  })

  it('rejects negative and non-numeric costs', () => {
    for (const estimatedCost of [-1, -0.01, NaN, Infinity]) {
      expect(validateActivity(makeInput({ estimatedCost }), days).estimatedCost).toBeDefined()
    }
  })

  it('accepts a cost of zero or with centavos', () => {
    for (const estimatedCost of [0, 350.5]) {
      expect(validateActivity(makeInput({ estimatedCost }), days).estimatedCost).toBeUndefined()
    }
  })

  it('accepts no link, or a full http or https link', () => {
    for (const url of ['', 'http://example.com', 'https://example.com/book?id=1']) {
      expect(validateActivity(makeInput({ url }), days).url).toBeUndefined()
    }
  })

  it('rejects links that are incomplete or use another scheme', () => {
    for (const url of ['facebook.com', 'javascript:alert(1)', 'ftp://example.com/a', 'not a link']) {
      expect(validateActivity(makeInput({ url }), days).url).toBeDefined()
    }
  })
})