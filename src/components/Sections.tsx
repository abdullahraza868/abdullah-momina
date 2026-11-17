import { useEffect, useState } from 'react'
import { wedding, type WeddingEvent } from '../config/wedding'
import { formatEventDate, timeUntil } from '../lib/dates'
import { canNativeShare, copyLink, nativeShare, whatsappContactHref, whatsappShareHref } from '../lib/share'
import { ArchFrame, Divider } from './Ornament'

export function InvitationText({ greeting }: { greeting: string }) {
  return (
    <section id="invitation" className="section section--intro" aria-labelledby="intro-title" tabIndex={-1}>
      <p className="eyebrow">{greeting}</p>
      <h2 id="intro-title" className="visually-hidden">
        Invitation
      </h2>
      <p className="lead">
        With the blessings of Allah&nbsp;<span className="honorific" lang="ar">ﷻ</span>, together with our families, we request the honour of your presence at the Nikkah and Reception of
      </p>
      <div className="couple">
        <div className="person">
          <p className="person__name">{wedding.groom.name}</p>
          <p className="person__parent">son of {wedding.groom.father}</p>
        </div>
        <p className="couple__amp" aria-hidden="true">
          &amp;
        </p>
        <span className="visually-hidden">and</span>
        <div className="person">
          <p className="person__name">{wedding.bride.name}</p>
          <p className="person__parent">daughter of {wedding.bride.father}</p>
        </div>
      </div>
      <Divider />
    </section>
  )
}

function EventCard({ event }: { event: WeddingEvent }) {
  const d = formatEventDate(event.date)
  const venue = event.venue
  return (
    <article className="event reveal-up" aria-labelledby={`ev-${event.id}`}>
      <ArchFrame />
      <div className="event__body">
        <p className="eyebrow">{event.id === 'nikkah' ? 'The ceremony' : 'The celebration'}</p>
        <h3 id={`ev-${event.id}`} className="event__title">
          {event.title}
        </h3>
        <p className="event__date">
          <span className="event__weekday">{d.weekday}</span>
          <span className="event__day">{d.day}</span>
          <span className="event__month">
            {d.month} {d.year}
          </span>
        </p>
        <p className="event__time">{event.timeLabel}</p>
        <Divider className="divider--sm" />
        {venue ? (
          <>
            <p className="event__venue">{venue.name}</p>
            {venue.address && <p className="event__address">{venue.address}</p>}
            <p className="event__city">{event.city}</p>
            {venue.mapUrl && (
              <a className="btn btn--ghost" href={venue.mapUrl} target="_blank" rel="noopener noreferrer">
                Directions
                <span className="visually-hidden"> to {venue.name} (opens Google Maps)</span>
              </a>
            )}
          </>
        ) : (
          <>
            <p className="event__venue event__venue--tba">Venue to be announced</p>
            <p className="event__city">{event.city}</p>
            <p className="event__note">We will share the venue and directions here soon.</p>
          </>
        )}
      </div>
    </article>
  )
}

export function Events() {
  return (
    <section className="section" aria-labelledby="events-title">
      <p className="eyebrow">Save the dates</p>
      <h2 id="events-title" className="section__title">
        The Celebrations
      </h2>
      <div className="events">
        {wedding.events.map((e) => (
          <EventCard key={e.id} event={e} />
        ))}
      </div>
    </section>
  )
}

export function Countdown() {
  const [r, setR] = useState(() => timeUntil())
  useEffect(() => {
    const id = window.setInterval(() => setR(timeUntil()), 1000)
    return () => window.clearInterval(id)
  }, [])
  const nikkah = formatEventDate(wedding.events[0].date)
  const units: [number, string][] = [
    [r.days, r.days === 1 ? 'Day' : 'Days'],
    [r.hours, 'Hours'],
    [r.minutes, 'Minutes'],
    [r.seconds, 'Seconds'],
  ]
  return (
    <section className="section section--countdown reveal-up" aria-labelledby="cd-title">
      <p className="eyebrow">Counting the days</p>
      <h2 id="cd-title" className="section__title">
        Until the Nikkah
      </h2>
      {r.done ? (
        <p className="lead">Alhamdulillah, the day has arrived.</p>
      ) : (
        <>
          <div className="countdown" aria-hidden="true">
            {units.map(([n, label]) => (
              <div key={label} className="countdown__unit">
                <span className="countdown__num">{String(n).padStart(2, '0')}</span>
                <span className="countdown__label">{label}</span>
              </div>
            ))}
          </div>
          <p className="visually-hidden">
            {r.days} days to go until {nikkah.full}.
          </p>
        </>
      )}
      <p className="fineprint">
        {nikkah.weekday}, {nikkah.day} {nikkah.month} {nikkah.year} · Madinah time
      </p>
    </section>
  )
}

export function Remembrance() {
  return (
    <section className="section section--memory reveal-up" aria-label="In loving memory">
      <Divider />
      {wedding.remembrance.lines.map((line, i) => (
        <p key={i} className={i === 0 ? 'memory__line' : 'memory__dua'}>
          {line.split('ﷻ').flatMap((part, j) =>
            j === 0
              ? [part]
              : [
                  <span key={j} className="honorific" lang="ar">
                    ﷻ
                  </span>,
                  part,
                ],
          )}
        </p>
      ))}
    </section>
  )
}

export function Closing() {
  const [copied, setCopied] = useState<'idle' | 'ok' | 'fail'>('idle')
  const [hasShare] = useState(canNativeShare)
  const onCopy = async () => {
    setCopied((await copyLink()) ? 'ok' : 'fail')
    window.setTimeout(() => setCopied('idle'), 2500)
  }
  return (
    <footer className="section section--closing reveal-up" aria-labelledby="closing-title">
      <h2 id="closing-title" className="section__title">
        We look forward to celebrating with you
      </h2>
      <p className="lead">Please keep us in your duas.</p>
      <div className="actions">
        <a className="btn" href={whatsappShareHref()} target="_blank" rel="noopener noreferrer">
          Share on WhatsApp
        </a>
        <button type="button" className="btn btn--ghost" onClick={onCopy}>
          {copied === 'ok' ? 'Link copied' : copied === 'fail' ? 'Copy failed' : 'Copy link'}
        </button>
        {hasShare && (
          <button type="button" className="btn btn--ghost" onClick={() => void nativeShare()}>
            Share…
          </button>
        )}
      </div>
      <p className="visually-hidden" role="status" aria-live="polite">
        {copied === 'ok' ? 'Invitation link copied to clipboard.' : copied === 'fail' ? 'Could not copy the link.' : ''}
      </p>
      <div className="contact">
        <p className="eyebrow">Questions</p>
        <p>
          <a href={`tel:+${wedding.contact.e164}`}>{wedding.contact.display}</a>
          <span aria-hidden="true"> · </span>
          <a href={whatsappContactHref()} target="_blank" rel="noopener noreferrer">
            WhatsApp
          </a>
        </p>
      </div>
      <p className="monogram" aria-hidden="true">
        A <span>&amp;</span> M
      </p>
    </footer>
  )
}
