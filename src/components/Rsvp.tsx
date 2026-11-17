import { useId, useRef, useState } from 'react'
import { wedding } from '../config/wedding'
import { formatEventDate } from '../lib/dates'
import {
  clearStoredRsvp,
  getStoredRsvp,
  RSVP_LIMITS,
  rsvpEndpoint,
  RsvpError,
  submitRsvp,
  validateRsvp,
  type RsvpErrors,
  type RsvpInput,
  type StoredRsvp,
} from '../lib/rsvp'
import { whatsappContactHref } from '../lib/share'

type Status = 'idle' | 'submitting' | 'success' | 'error'

export function Rsvp({ guestName }: { guestName: string | null }) {
  const [stored, setStored] = useState<StoredRsvp | null>(getStoredRsvp)
  const [form, setForm] = useState<RsvpInput>({
    name: guestName ?? '',
    attendance: '',
    guests: 1,
    adults: 1,
    children: 0,
    message: '',
    website: '',
  })
  const [errors, setErrors] = useState<RsvpErrors>({})
  const [status, setStatus] = useState<Status>('idle')
  const [serverError, setServerError] = useState('')
  const submissionId = useRef<string | undefined>(undefined)
  const inFlight = useRef(false)
  const statusRef = useRef<HTMLDivElement>(null)
  const uid = useId()
  const configured = rsvpEndpoint() !== null
  const by = wedding.rsvpBy ? formatEventDate(wedding.rsvpBy) : null

  const set = <K extends keyof RsvpInput>(key: K, value: RsvpInput[K]) => {
    setForm((f) => {
      const next = { ...f, [key]: value }
      // Keep adults in step with total guests when the guest changes the total.
      if (key === 'guests') next.adults = Math.max(1, (value as number) - next.children)
      if (key === 'children') next.adults = Math.max(1, next.guests - (value as number))
      return next
    })
    if (errors[key as keyof RsvpErrors]) setErrors((e) => ({ ...e, [key]: undefined }))
  }

  const num = (v: string) => (v === '' ? NaN : Number(v))

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (inFlight.current) return // duplicate-click protection
    const errs = validateRsvp(form)
    setErrors(errs)
    if (Object.values(errs).some(Boolean)) {
      const first = Object.keys(errs).find((k) => errs[k as keyof RsvpErrors])
      document.getElementById(`${uid}-${first}`)?.focus()
      return
    }
    inFlight.current = true
    setStatus('submitting')
    setServerError('')
    submissionId.current ??= crypto.randomUUID?.()
    try {
      const saved = await submitRsvp(form, { submissionId: submissionId.current, guestParam: guestName })
      setStored(saved)
      setStatus('success')
      submissionId.current = undefined
    } catch (err) {
      setStatus('error')
      setServerError(err instanceof RsvpError ? err.message : 'Something went wrong. Please try again.')
    } finally {
      inFlight.current = false
      requestAnimationFrame(() => statusRef.current?.focus())
    }
  }

  if (stored) {
    return (
      <section className="section section--rsvp reveal-up" aria-labelledby="rsvp-title">
        <p className="eyebrow">RSVP</p>
        <h2 id="rsvp-title" className="section__title">
          JazakAllah khair
        </h2>
        <div ref={statusRef} tabIndex={-1} className="rsvp-done" role="status">
          <p className="lead">
            {stored.attendance === 'attending'
              ? `Thank you, ${stored.name}. We have received your reply and look forward to celebrating with you.`
              : `Thank you, ${stored.name}. You will be missed, and we are grateful for your duas.`}
          </p>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => {
              clearStoredRsvp()
              setStored(null)
              setStatus('idle')
            }}
          >
            Send another reply
          </button>
        </div>
      </section>
    )
  }

  const attending = form.attendance === 'attending'
  const busy = status === 'submitting'
  const err = (k: keyof RsvpErrors) =>
    errors[k] ? (
      <p id={`${uid}-${k}-err`} className="field__error">
        {errors[k]}
      </p>
    ) : null
  const described = (k: keyof RsvpErrors) => (errors[k] ? `${uid}-${k}-err` : undefined)

  return (
    <section className="section section--rsvp reveal-up" aria-labelledby="rsvp-title">
      <p className="eyebrow">RSVP</p>
      <h2 id="rsvp-title" className="section__title">
        Kindly reply
      </h2>
      {by && <p className="fineprint">Please reply by {`${by.day} ${by.month} ${by.year}`}</p>}

      {!configured && (
        <p className="notice" role="note">
          Online replies are not switched on yet. Please reply on{' '}
          <a href={whatsappContactHref()} target="_blank" rel="noopener noreferrer">
            WhatsApp
          </a>{' '}
          or call {wedding.contact.display}.
        </p>
      )}

      <form className="rsvp" onSubmit={onSubmit} noValidate aria-busy={busy}>
        <div className="field">
          <label htmlFor={`${uid}-name`}>Your name</label>
          <input
            id={`${uid}-name`}
            name="name"
            autoComplete="name"
            maxLength={RSVP_LIMITS.nameMax}
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            aria-invalid={!!errors.name}
            aria-describedby={described('name')}
            required
          />
          {err('name')}
        </div>

        <fieldset className="field field--choice" aria-describedby={described('attendance')}>
          <legend>Will you attend?</legend>
          <div className="choices" id={`${uid}-attendance`} tabIndex={-1}>
            <label className={`choice ${form.attendance === 'attending' ? 'is-on' : ''}`}>
              <input type="radio" name="attendance" value="attending" checked={form.attendance === 'attending'} onChange={() => set('attendance', 'attending')} />
              <span>Joyfully attending</span>
            </label>
            <label className={`choice ${form.attendance === 'declined' ? 'is-on' : ''}`}>
              <input type="radio" name="attendance" value="declined" checked={form.attendance === 'declined'} onChange={() => set('attendance', 'declined')} />
              <span>Unable to attend</span>
            </label>
          </div>
          {err('attendance')}
        </fieldset>

        {attending && (
          <div className="field-row">
            <div className="field">
              <label htmlFor={`${uid}-guests`}>Total guests</label>
              <input
                id={`${uid}-guests`}
                type="number"
                inputMode="numeric"
                min={1}
                max={RSVP_LIMITS.guestsMax}
                value={Number.isNaN(form.guests) ? '' : form.guests}
                onChange={(e) => set('guests', num(e.target.value))}
                aria-invalid={!!errors.guests}
                aria-describedby={described('guests') ?? `${uid}-guests-hint`}
              />
              <p id={`${uid}-guests-hint`} className="field__hint">
                Including you
              </p>
              {err('guests')}
            </div>
            <div className="field">
              <label htmlFor={`${uid}-adults`}>Adults</label>
              <input
                id={`${uid}-adults`}
                type="number"
                inputMode="numeric"
                min={1}
                value={Number.isNaN(form.adults) ? '' : form.adults}
                onChange={(e) => set('adults', num(e.target.value))}
                aria-invalid={!!errors.adults}
                aria-describedby={described('adults')}
              />
              {err('adults')}
            </div>
            <div className="field">
              <label htmlFor={`${uid}-children`}>Children</label>
              <input
                id={`${uid}-children`}
                type="number"
                inputMode="numeric"
                min={0}
                value={Number.isNaN(form.children) ? '' : form.children}
                onChange={(e) => set('children', num(e.target.value))}
                aria-invalid={!!errors.children}
                aria-describedby={described('children')}
              />
              {err('children')}
            </div>
          </div>
        )}

        <div className="field">
          <label htmlFor={`${uid}-message`}>
            A message for the couple <span className="optional">(optional)</span>
          </label>
          <textarea
            id={`${uid}-message`}
            rows={3}
            maxLength={RSVP_LIMITS.messageMax}
            value={form.message}
            onChange={(e) => set('message', e.target.value)}
            aria-invalid={!!errors.message}
            aria-describedby={described('message')}
          />
          {err('message')}
        </div>

        {/* Honeypot, hidden from people and assistive tech. */}
        <div className="hp" aria-hidden="true">
          <label>
            Website
            <input tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => set('website', e.target.value)} />
          </label>
        </div>

        <button type="submit" className="btn btn--solid" disabled={busy || !configured}>
          {busy ? 'Sending…' : 'Send reply'}
        </button>

        <div ref={statusRef} tabIndex={-1} className="rsvp-status" role="status" aria-live="polite">
          {status === 'error' && <p className="field__error">{serverError}</p>}
        </div>
      </form>
    </section>
  )
}
