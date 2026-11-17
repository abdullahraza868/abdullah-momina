import { wedding } from '../config/wedding'

/** Formats an ISO date (YYYY-MM-DD) as e.g. "Friday, 18 December 2026" without timezone drift. */
export function formatEventDate(iso: string): { weekday: string; day: string; month: string; year: string; full: string } {
  // Noon UTC keeps the calendar date stable in every timezone.
  const d = new Date(`${iso}T12:00:00Z`)
  const opts = { timeZone: 'UTC' } as const
  const weekday = d.toLocaleDateString('en-GB', { ...opts, weekday: 'long' })
  const day = d.toLocaleDateString('en-GB', { ...opts, day: 'numeric' })
  const month = d.toLocaleDateString('en-GB', { ...opts, month: 'long' })
  const year = d.toLocaleDateString('en-GB', { ...opts, year: 'numeric' })
  return { weekday, day, month, year, full: `${weekday}, ${day} ${month} ${year}` }
}

export interface Remaining {
  days: number
  hours: number
  minutes: number
  seconds: number
  done: boolean
}

export function timeUntil(target: string = wedding.countdownTarget, now: number = Date.now()): Remaining {
  const diff = new Date(target).getTime() - now
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true }
  const s = Math.floor(diff / 1000)
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
    done: false,
  }
}
