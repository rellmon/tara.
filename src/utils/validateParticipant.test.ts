import { describe, expect, it } from 'vitest'
import { validateParticipantName } from './validateParticipant'

describe('validateParticipantName', () => {
  it('accepts a normal name', () => {
    expect(validateParticipantName('Alex', [])).toBeUndefined()
    expect(validateParticipantName('Alex', ['Jamie', 'Sam'])).toBeUndefined()
  })

  it('requires a name, including not just spaces', () => {
    expect(validateParticipantName('', [])).toBeDefined()
    expect(validateParticipantName('   ', [])).toBeDefined()
  })

  it('allows 40 characters and rejects 41', () => {
    expect(validateParticipantName('x'.repeat(40), [])).toBeUndefined()
    expect(validateParticipantName('x'.repeat(41), [])).toBeDefined()
  })

  it('ignores spaces around a name when checking its length', () => {
    expect(validateParticipantName(`  ${'x'.repeat(40)}  `, [])).toBeUndefined()
  })

  it('rejects a duplicate, whatever the capitalization or spacing', () => {
    expect(validateParticipantName('Alex', ['Alex'])).toMatch(/already/)
    expect(validateParticipantName('alex', ['Alex'])).toBeDefined()
    expect(validateParticipantName('  ALEX ', ['alex'])).toBeDefined()
  })

  it('treats saved names with stray spaces as duplicates too', () => {
    expect(validateParticipantName('Alex', ['  alex  '])).toBeDefined()
  })
})