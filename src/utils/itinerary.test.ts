import { describe, expect, it } from 'vitest'
import { makeActivity } from '../test/factories'
import type { ItineraryActivity } from '../types/itinerary'
import {
  activitiesOverlap,
  findOverlaps,
  formatDayLabel,
  formatTime,
  getTripDays,
  insertActivityByTime,
  moveActivity,
  reorderActivity,
  sortByStartTime,
} from './itinerary'

function ids(list: ItineraryActivity[]): string[] {
  return list.map((activity) => activity.id)
}

// An activity with only a start time (and optionally an end time).
function at(startTime: string, endTime = ''): ItineraryActivity {
  return makeActivity({ startTime, endTime })
}

describe('getTripDays', () => {
  it('lists every day from start to end', () => {
    expect(getTripDays('2026-11-14', '2026-11-16')).toEqual([
      '2026-11-14',
      '2026-11-15',
      '2026-11-16',
    ])
  })

  it('returns one day for a one-day trip', () => {
    expect(getTripDays('2026-11-14', '2026-11-14')).toEqual(['2026-11-14'])
  })

  it('crosses month boundaries', () => {
    expect(getTripDays('2026-11-29', '2026-12-02')).toEqual([
      '2026-11-29',
      '2026-11-30',
      '2026-12-01',
      '2026-12-02',
    ])
  })

  it('returns nothing when the end is before the start', () => {
    expect(getTripDays('2026-11-16', '2026-11-14')).toEqual([])
  })

  it('returns nothing for invalid dates', () => {
    expect(getTripDays('', '2026-11-16')).toEqual([])
    expect(getTripDays('nope', '2026-11-16')).toEqual([])
  })
})

describe('sortByStartTime', () => {
  const list = [
    makeActivity({ id: 'c', startTime: '18:30' }),
    makeActivity({ id: 'a', startTime: '08:00' }),
    makeActivity({ id: 'b', startTime: '12:00' }),
  ]

  it('orders by start time, earliest first', () => {
    expect(ids(sortByStartTime(list))).toEqual(['a', 'b', 'c'])
  })

  it('does not change the original list', () => {
    sortByStartTime(list)

    expect(ids(list)).toEqual(['c', 'a', 'b'])
  })
})

describe('formatTime and formatDayLabel', () => {
  it('shows 12-hour times', () => {
    expect(formatTime('14:00')).toBe('2:00 PM')
    expect(formatTime('08:05')).toBe('8:05 AM')
    expect(formatTime('00:00')).toBe('12:00 AM')
    expect(formatTime('12:00')).toBe('12:00 PM')
  })

  it('returns an invalid time unchanged', () => {
    expect(formatTime('nope')).toBe('nope')
    expect(formatTime('25:00')).toBe('25:00')
  })

  it('labels a day with its weekday', () => {
    expect(formatDayLabel('2026-11-14')).toBe('Sat, Nov 14')
    expect(formatDayLabel('2026-12-01')).toBe('Tue, Dec 1')
  })
})

describe('activitiesOverlap', () => {
  it('detects overlapping ranges', () => {
    expect(activitiesOverlap(at('16:00', '18:00'), at('16:30', '17:30'))).toBe(true)
    expect(activitiesOverlap(at('16:00', '18:00'), at('17:00', '19:00'))).toBe(true)
  })

  it('detects a range inside another', () => {
    expect(activitiesOverlap(at('09:00', '17:00'), at('12:00', '13:00'))).toBe(true)
  })

  it('does not count back-to-back activities as overlapping', () => {
    expect(activitiesOverlap(at('12:00', '13:00'), at('13:00', '14:00'))).toBe(false)
    expect(activitiesOverlap(at('12:00', '13:00'), at('13:00'))).toBe(false)
  })

  it('does not count activities that are far apart', () => {
    expect(activitiesOverlap(at('08:00', '09:00'), at('14:00', '15:00'))).toBe(false)
    expect(activitiesOverlap(at('08:00'), at('14:00'))).toBe(false)
  })

  it('counts the same start time as overlapping, even without end times', () => {
    expect(activitiesOverlap(at('10:00'), at('10:00'))).toBe(true)
  })

  it('treats an activity with no end time as a single moment', () => {
    expect(activitiesOverlap(at('16:00', '18:00'), at('17:00'))).toBe(true)
    expect(activitiesOverlap(at('16:00', '18:00'), at('15:00'))).toBe(false)
    expect(activitiesOverlap(at('16:00', '18:00'), at('18:00'))).toBe(false)
  })

  it('gives the same answer whichever activity comes first', () => {
    const pairs: Array<[ItineraryActivity, ItineraryActivity]> = [
      [at('16:00', '18:00'), at('17:00')],
      [at('12:00', '13:00'), at('13:00', '14:00')],
      [at('09:00', '17:00'), at('12:00', '13:00')],
      [at('10:00'), at('10:00')],
    ]

    for (const [a, b] of pairs) {
      expect(activitiesOverlap(a, b)).toBe(activitiesOverlap(b, a))
    }
  })
})

describe('findOverlaps', () => {
  it('records each overlap on both activities', () => {
    const a = makeActivity({ id: 'a', startTime: '16:00', endTime: '18:00' })
    const b = makeActivity({ id: 'b', startTime: '16:30', endTime: '17:30' })
    const c = makeActivity({ id: 'c', startTime: '20:00' })

    const result = findOverlaps([a, b, c])

    expect(Object.keys(result).sort()).toEqual(['a', 'b'])
    expect(ids(result.a)).toEqual(['b'])
    expect(ids(result.b)).toEqual(['a'])
  })

  it('returns nothing when no activities overlap', () => {
    const list = [
      makeActivity({ id: 'a', startTime: '08:00', endTime: '09:00' }),
      makeActivity({ id: 'b', startTime: '09:00', endTime: '10:00' }),
    ]

    expect(findOverlaps(list)).toEqual({})
  })

  it('lists every conflict when three activities overlap', () => {
    const a = makeActivity({ id: 'a', startTime: '09:00', endTime: '12:00' })
    const b = makeActivity({ id: 'b', startTime: '10:00', endTime: '11:00' })
    const c = makeActivity({ id: 'c', startTime: '10:30', endTime: '11:30' })

    const result = findOverlaps([a, b, c])

    expect(ids(result.a)).toEqual(['b', 'c'])
    expect(ids(result.b)).toEqual(['a', 'c'])
    expect(ids(result.c)).toEqual(['a', 'b'])
  })
})

describe('insertActivityByTime', () => {
  const A = makeActivity({ id: 'A', startTime: '08:00' })
  const B = makeActivity({ id: 'B', startTime: '12:00' })
  const C = makeActivity({ id: 'C', date: '2026-11-15', startTime: '09:00' })
  const D = makeActivity({ id: 'D', startTime: '18:00' })
  const list = [A, B, C, D]

  it('puts a new activity between earlier and later ones on its day', () => {
    const result = insertActivityByTime(list, makeActivity({ id: 'N', startTime: '10:00' }))

    expect(ids(result)).toEqual(['A', 'N', 'B', 'C', 'D'])
  })

  it('puts it before everything when it is the earliest', () => {
    const result = insertActivityByTime(list, makeActivity({ id: 'N', startTime: '07:00' }))

    expect(ids(result)).toEqual(['N', 'A', 'B', 'C', 'D'])
  })

  it('puts it after the last activity of its day when it is the latest', () => {
    const result = insertActivityByTime(list, makeActivity({ id: 'N', startTime: '19:00' }))

    expect(ids(result)).toEqual(['A', 'B', 'C', 'D', 'N'])
  })

  it('goes to the end of the list when its day has nothing yet', () => {
    const result = insertActivityByTime(
      list,
      makeActivity({ id: 'N', date: '2026-11-16', startTime: '09:00' }),
    )

    expect(ids(result)).toEqual(['A', 'B', 'C', 'D', 'N'])
  })

  it('goes after an existing activity with the same start time', () => {
    const result = insertActivityByTime(list, makeActivity({ id: 'N', startTime: '08:00' }))

    expect(ids(result)).toEqual(['A', 'N', 'B', 'C', 'D'])
  })

  it('ignores another trip that has the same date', () => {
    const X = makeActivity({ id: 'X', tripId: 't2', startTime: '09:00' })

    const result = insertActivityByTime([A, X, B], makeActivity({ id: 'N', startTime: '09:30' }))

    expect(ids(result)).toEqual(['A', 'N', 'X', 'B'])
  })

  it('does not change the original list', () => {
    insertActivityByTime(list, makeActivity({ id: 'N', startTime: '10:00' }))

    expect(ids(list)).toEqual(['A', 'B', 'C', 'D'])
  })
})

describe('moveActivity', () => {
  const A = makeActivity({ id: 'A' })
  const B = makeActivity({ id: 'B' })
  const C = makeActivity({ id: 'C', date: '2026-11-15' })
  const D = makeActivity({ id: 'D' })
  const list = [A, B, C, D]

  it('moves down by swapping with the next activity of the same day', () => {
    expect(ids(moveActivity(list, 'B', 1))).toEqual(['A', 'D', 'C', 'B'])
  })

  it('moves up by swapping with the previous activity of the same day', () => {
    expect(ids(moveActivity(list, 'B', -1))).toEqual(['B', 'A', 'C', 'D'])
  })

  it('does nothing at the edges of a day', () => {
    expect(moveActivity(list, 'A', -1)).toBe(list)
    expect(moveActivity(list, 'D', 1)).toBe(list)
  })

  it('does nothing for an unknown activity', () => {
    expect(moveActivity(list, 'nope', 1)).toBe(list)
  })

  it('does not treat another trip on the same date as a neighbor', () => {
    const X = makeActivity({ id: 'X', tripId: 't2' })

    expect(ids(moveActivity([A, X, B], 'A', 1))).toEqual(['B', 'X', 'A'])
  })
})

describe('reorderActivity', () => {
  const A = makeActivity({ id: 'A' })
  const X = makeActivity({ id: 'X', date: '2026-11-15' })
  const B = makeActivity({ id: 'B' })
  const C = makeActivity({ id: 'C' })
  const list = [A, X, B, C]

  it('moves an activity up to where another one was dropped', () => {
    expect(ids(reorderActivity(list, 'C', 'A'))).toEqual(['C', 'X', 'A', 'B'])
  })

  it('moves an activity down to where another one was dropped', () => {
    expect(ids(reorderActivity(list, 'A', 'C'))).toEqual(['B', 'X', 'C', 'A'])
  })

  it('ignores a drop onto an activity from a different day', () => {
    expect(reorderActivity(list, 'A', 'X')).toBe(list)
  })

  it('ignores a drop on itself and unknown activities', () => {
    expect(reorderActivity(list, 'A', 'A')).toBe(list)
    expect(reorderActivity(list, 'A', 'nope')).toBe(list)
    expect(reorderActivity(list, 'nope', 'A')).toBe(list)
  })

  it('does not change the original list', () => {
    reorderActivity(list, 'C', 'A')

    expect(ids(list)).toEqual(['A', 'X', 'B', 'C'])
  })
})