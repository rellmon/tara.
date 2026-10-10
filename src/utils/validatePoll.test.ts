import { describe, expect, it } from 'vitest'
import { cleanPollOptions, validatePoll } from './validatePoll'

describe('validatePoll', () => {
  it('accepts a question with two or more options', () => {
    const errors = validatePoll({
      question: 'Where should we go?',
      options: ['La Union', 'Tagaytay'],
    })

    expect(errors).toEqual({})
  })

  it('requires a question', () => {
    expect(validatePoll({ question: '   ', options: ['A', 'B'] }).question).toBeDefined()
  })

  it('needs at least two non-blank options', () => {
    expect(validatePoll({ question: 'Q', options: ['A'] }).options).toBeDefined()
    expect(validatePoll({ question: 'Q', options: ['A', '  ', ''] }).options).toBeDefined()
  })

  it('rejects duplicate options, ignoring case and spaces', () => {
    const errors = validatePoll({
      question: 'Q',
      options: ['La Union', '  la union '],
    })

    expect(errors.options).toBeDefined()
  })

  it('rejects more than 10 options', () => {
    const options = Array.from({ length: 11 }, (_, i) => `Option ${i}`)

    expect(validatePoll({ question: 'Q', options }).options).toBeDefined()
  })

  it('rejects a question or option that is too long', () => {
    expect(validatePoll({ question: 'x'.repeat(121), options: ['A', 'B'] }).question).toBeDefined()
    expect(validatePoll({ question: 'Q', options: ['x'.repeat(61), 'B'] }).options).toBeDefined()
  })
})

describe('cleanPollOptions', () => {
  it('trims options and drops blank ones', () => {
    expect(cleanPollOptions(['  A ', '', 'B', '   '])).toEqual(['A', 'B'])
  })
})