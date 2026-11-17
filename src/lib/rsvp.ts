/**
 * RSVP integration boundary.
 *
 * The front end only knows one thing: an HTTPS endpoint (a deployed Google
 * Apps Script Web App) set at build time via VITE_RSVP_ENDPOINT. Swapping the
 * backend later means changing this file only.
 *
 * We POST JSON as text/plain so the browser sends a "simple" CORS request and
 * Apps Script does not need to answer a preflight.
 */

export type Attendance = 'attending' | 'declined'

export interface RsvpInput {
  name: string
  attendance: Attendance | ''
  guests: number
  adults: number
  children: number
  message: string
  /** Honeypot: humans never fill this. */
  website: string
}

export interface RsvpPayload extends Omit<RsvpInput, 'attendance' | 'website'> {
  attendance: Attendance
  submissionId: string
  submittedAt: string
  guestParam: string | null
  userAgent: string
}

export type RsvpErrors = Partial<Record<'name' | 'attendance' | 'guests' | 'adults' | 'children' | 'message', string>>

export const RSVP_LIMITS = { nameMax: 80, messageMax: 500, guestsMax: 15 } as const

export function rsvpEndpoint(): string | null {
  const url = (import.meta.env.VITE_RSVP_ENDPOINT as string | undefined)?.trim()
  return url && /^https:\/\//.test(url) ? url : null
}

export function validateRsvp(input: RsvpInput): RsvpErrors {
  const errors: RsvpErrors = {}
  const name = input.name.trim()
  if (name.length < 2) errors.name = 'Please enter your name.'
  else if (name.length > RSVP_LIMITS.nameMax) errors.name = `Please keep the name under ${RSVP_LIMITS.nameMax} characters.`

  if (!input.attendance) errors.attendance = 'Please let us know if you can attend.'

  if (input.attendance === 'attending') {
    const { guests, adults, children } = input
    const isInt = (n: number) => Number.isInteger(n) && n >= 0
    if (!isInt(guests) || guests < 1) errors.guests = 'At least 1 guest, including yourself.'
    else if (guests > RSVP_LIMITS.guestsMax) errors.guests = `For more than ${RSVP_LIMITS.guestsMax} guests, please message us directly.`
    if (!isInt(adults) || adults < 1) errors.adults = 'At least 1 adult.'
    if (!isInt(children)) errors.children = 'Enter 0 or more.'
    if (!errors.guests && !errors.adults && !errors.children && adults + children !== guests) {
      errors.adults = `Adults + children should add up to ${guests}.`
    }
  }

  if (input.message.length > RSVP_LIMITS.messageMax) errors.message = `Please keep the message under ${RSVP_LIMITS.messageMax} characters.`
  return errors
}

const STORAGE_KEY = 'ar-mm-rsvp'

export interface StoredRsvp {
  submissionId: string
  name: string
  attendance: Attendance
  at: string
}

export function getStoredRsvp(): StoredRsvp | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as StoredRsvp) : null
  } catch {
    return null
  }
}

function storeRsvp(r: StoredRsvp) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(r))
  } catch {
    /* private mode etc. — duplicate protection then relies on the server */
  }
}

export function clearStoredRsvp() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    /* ignore */
  }
}

function newId(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

export class RsvpError extends Error {
  readonly kind: 'not-configured' | 'network' | 'server'
  constructor(kind: 'not-configured' | 'network' | 'server', message: string) {
    super(message)
    this.kind = kind
  }
}

/**
 * Submits an RSVP. A submissionId is generated per attempt-series and reused
 * on retry so the server can ignore duplicates of the same submission.
 */
export async function submitRsvp(input: RsvpInput, opts: { submissionId?: string; guestParam: string | null; timeoutMs?: number }): Promise<StoredRsvp> {
  const endpoint = rsvpEndpoint()
  if (!endpoint) throw new RsvpError('not-configured', 'RSVP is not connected yet.')

  // Honeypot filled → pretend success, send nothing.
  const submissionId = opts.submissionId ?? newId()
  if (input.website.trim()) return { submissionId, name: input.name.trim(), attendance: input.attendance as Attendance, at: new Date().toISOString() }

  const attending = input.attendance === 'attending'
  const payload: RsvpPayload = {
    name: input.name.trim(),
    attendance: input.attendance as Attendance,
    guests: attending ? input.guests : 0,
    adults: attending ? input.adults : 0,
    children: attending ? input.children : 0,
    message: input.message.trim(),
    submissionId,
    submittedAt: new Date().toISOString(),
    guestParam: opts.guestParam,
    userAgent: navigator.userAgent.slice(0, 200),
  }

  const ctrl = new AbortController()
  const timer = window.setTimeout(() => ctrl.abort(), opts.timeoutMs ?? 15000)
  let res: Response
  try {
    res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
      signal: ctrl.signal,
      redirect: 'follow',
    })
  } catch {
    throw new RsvpError('network', 'We could not reach the RSVP service. Please check your connection and try again.')
  } finally {
    window.clearTimeout(timer)
  }

  let body: { ok?: boolean; error?: string } = {}
  try {
    body = await res.json()
  } catch {
    /* non-JSON */
  }
  if (!res.ok || body.ok !== true) {
    throw new RsvpError('server', body.error || 'Something went wrong while saving your reply. Please try again.')
  }

  const stored: StoredRsvp = { submissionId, name: payload.name, attendance: payload.attendance, at: payload.submittedAt }
  storeRsvp(stored)
  return stored
}
