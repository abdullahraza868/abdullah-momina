/**
 * Single source of truth for every wedding fact shown on the invitation.
 * Edit this file (and only this file) to change names, events or venues.
 *
 * Rules: never invent a fact. Anything unknown stays `null` and the UI
 * shows a graceful "to be announced" state instead.
 */

export interface Venue {
  name: string
  /** Free-text address line shown under the venue name. */
  address: string | null
  /** Full Google Maps URL. Leave null to hide the directions button. */
  mapUrl: string | null
}

export interface WeddingEvent {
  id: 'nikkah' | 'reception'
  title: string
  /** ISO date (YYYY-MM-DD), interpreted in `timezone`. */
  date: string
  /** Human-readable time. Never a guessed clock time. */
  timeLabel: string
  city: string
  /** null = venue not yet confirmed. */
  venue: Venue | null
}

export const wedding = {
  groom: { name: 'Abdullah Raza', shortName: 'Abdullah', father: 'Muhammad Raza' },
  bride: { name: 'Momina Ashraf', shortName: 'Momina', father: 'Muhammad Ashraf' },

  /** Used by the countdown. Saudi Arabia is UTC+3 all year (no DST). */
  timezone: 'Asia/Riyadh',

  /**
   * The Nikkah is "after Asr" with no fixed clock time, so the countdown
   * counts down to the start of the Nikkah *day* in Madinah (00:00 Asia/Riyadh).
   * If an exact time is ever confirmed, change this to e.g. '2026-12-18T15:30:00+03:00'.
   */
  countdownTarget: '2026-12-18T00:00:00+03:00',

  events: [
    {
      id: 'nikkah',
      title: 'Nikkah',
      date: '2026-12-18',
      timeLabel: 'After Asr prayer',
      city: 'Madinah, Saudi Arabia',
      venue: {
        name: 'Masjid an-Nabawi',
        address: null,
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=Masjid%20an-Nabawi%2C%20Madinah%2C%20Saudi%20Arabia',
      },
    },
    {
      id: 'reception',
      title: 'Reception',
      date: '2026-12-19',
      timeLabel: '6:00 PM – 11:00 PM',
      city: 'Madinah, Saudi Arabia',
      // Venue not yet finalised. Replace null with { name, address, mapUrl } once booked.
      venue: null,
    },
  ] satisfies WeddingEvent[],

  contact: {
    display: '+92 321 4975065',
    /** E.164 without "+", used for tel: and wa.me links. */
    e164: '923214975065',
  },

  remembrance: {
    lines: [
      'In loving memory of a cherished father and uncle, whose love and presence remain forever in our hearts.',
      'May Allah ﷻ shower him with His mercy and grant him the highest place in Jannatul Firdaus.',
    ],
  },

  /** Recommended RSVP deadline — confirm before sending. null hides the line. */
  rsvpBy: '2026-12-05' as string | null,

  /** Optional audio. Missing file is handled gracefully; never autoplays. */
  audioSrc: '/audio/nasheed.mp3',

  defaultGreeting: 'Dear Family & Friends',
} as const

export type Wedding = typeof wedding
