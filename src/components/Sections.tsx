import { useEffect, useState } from 'react'
import { wedding, type WeddingEvent } from '../config/wedding'
import { photoCredits } from '../config/credits'
import { formatEventDate, timeUntil } from '../lib/dates'
import { photos } from '../lib/photos'
import { canNativeShare, copyLink, nativeShare, whatsappContactHref, whatsappShareHref } from '../lib/share'
import { ArcadeLine, Divider, Lantern, RoyalFrame } from './Ornament'

/** Splits text on ﷻ / ﷺ so the honorific renders in the Arabic face. */
function withHonorifics(text: string) {
  return text.split(/(ﷻ|ﷺ)/).map((part, i) =>
    part === 'ﷻ' || part === 'ﷺ' ? (
      <span key={i} className="honorific" lang="ar">
        {part}
      </span>
    ) : (
      part
    ),
  )
}

export function InvitationText({ greeting }: { greeting: string }) {
  return (
    <section id="invitation" className="band" aria-labelledby="intro-title" tabIndex={-1}>
      <ArcadeLine />
      <div className="paper-card">
        <RoyalFrame />
        <p className="eyebrow">{greeting}</p>
        <h2 id="intro-title" className="visually-hidden">
          Invitation
        </h2>
        <p className="lead">{withHonorifics('With the blessings of Allah ﷻ, and together with our families, we request the honour of your presence at the Nikkah and Reception of')}</p>
        <div className="couple">
          <div className="person">
            <p className="person__name gold-foil">{wedding.groom.name}</p>
            <p className="person__parent">son of {wedding.groom.father}</p>
          </div>
          <p className="couple__amp" aria-hidden="true">
            &amp;
          </p>
          <span className="visually-hidden">and</span>
          <div className="person">
            <p className="person__name gold-foil">{wedding.bride.name}</p>
            <p className="person__parent">daughter of {wedding.bride.father}</p>
          </div>
        </div>
        <Divider />
      </div>
    </section>
  )
}

/** Full-bleed parallax photograph of the Prophet's Mosque at night. */
export function PhotoBand() {
  return (
    <section className="photo-band" aria-label="Al-Madinah al-Munawwarah">
      <div className="photo-band__media" data-parallax>
        <img src={photos.night.src} srcSet={photos.night.srcSet} sizes="100vw" alt="Masjid an-Nabawi lit up at night, its minarets glowing above the marble courtyard" loading="lazy" decoding="async" />
      </div>
      <div className="photo-band__text">
        <p className="photo-band__ar gold-foil" lang="ar" dir="rtl">
          المدينة المنورة
        </p>
        <p className="eyebrow">
          Al-Madinah al-Munawwarah
          <br />
          The Radiant City
        </p>
        <p className="photo-band__line">{withHonorifics('Our Nikkah, in the city of the Prophet ﷺ')}</p>
      </div>
    </section>
  )
}

const eventPhoto: Record<WeddingEvent['id'], { src: string; srcSet: string; alt: string }> = {
  nikkah: { ...photos.dome, alt: 'The Green Dome and minarets of Masjid an-Nabawi at evening' },
  reception: { ...photos.umbrella, alt: 'An open umbrella canopy in the courtyard of Masjid an-Nabawi' },
}

function EventCard({ event }: { event: WeddingEvent }) {
  const d = formatEventDate(event.date)
  const venue = event.venue
  const img = eventPhoto[event.id]
  return (
    <article className="event" aria-labelledby={`ev-${event.id}`}>
      <div className="event__window arch-mask">
        <img src={img.src} srcSet={img.srcSet} sizes="(min-width: 760px) 340px, 90vw" alt={img.alt} loading="lazy" decoding="async" />
      </div>
      <div className="event__body">
        <p className="eyebrow">{event.id === 'nikkah' ? 'The ceremony' : 'The celebration'}</p>
        <h3 id={`ev-${event.id}`} className="event__title">
          {event.title}
        </h3>
        <p className="event__date">
          <span className="event__weekday">{d.weekday}</span>
          <span className="event__day gold-foil">{d.day}</span>
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
              <a className="btn btn--gold" href={venue.mapUrl} target="_blank" rel="noopener noreferrer">
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

function Countdown() {
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
    <div className="countdown-block" role="group" aria-labelledby="cd-title">
      <p className="eyebrow">Counting the days</p>
      <h2 id="cd-title" className="night-title">
        Until the Nikkah
      </h2>
      {r.done ? (
        <p className="lead lead--light">Alhamdulillah, the day has arrived.</p>
      ) : (
        <>
          <div className="countdown" aria-hidden="true">
            {units.map(([n, label]) => (
              <div key={label} className="countdown__unit">
                <span className="countdown__num gold-foil">{String(n).padStart(2, '0')}</span>
                <span className="countdown__label">{label}</span>
              </div>
            ))}
          </div>
          <p className="visually-hidden">
            {r.days} days to go until {nikkah.full}.
          </p>
        </>
      )}
      <p className="fineprint fineprint--light">
        {nikkah.weekday}, {nikkah.day} {nikkah.month} {nikkah.year} · Madinah time
      </p>
    </div>
  )
}

/** Night section: the two events and the countdown, on deep navy with gold. */
export function Celebrations() {
  return (
    <section className="band" aria-labelledby="events-title">
      <ArcadeLine />
      <div className="wrap">
        <p className="eyebrow">Save the dates</p>
        <h2 id="events-title" className="night-title">
          The Celebrations
        </h2>
        <div className="events">
          {wedding.events.map((e) => (
            <EventCard key={e.id} event={e} />
          ))}
        </div>
        <Countdown />
      </div>
    </section>
  )
}

export function Remembrance() {
  return (
    <section className="band band--memory" aria-label="In loving memory">
      <div className="wrap wrap--narrow">
        <Lantern />
        {wedding.remembrance.lines.map((line, i) => (
          <p key={i} className={i === 0 ? 'memory__line' : 'memory__dua'}>
            {withHonorifics(line)}
          </p>
        ))}
      </div>
    </section>
  )
}

/** Three arch-framed photographs of Masjid an-Nabawi. */
export function Gallery() {
  const items = [
    { ...photos.aerial, alt: 'Masjid an-Nabawi from above, the Green Dome among white domes and minarets', caption: 'The Green Dome' },
    { ...photos.dome, alt: 'Evening over the courtyard of Masjid an-Nabawi', caption: 'Evening in the courtyard' },
    { ...photos.umbrella, alt: 'The great umbrellas of the courtyard, opened', caption: 'The umbrellas of the Haram' },
  ]
  return (
    <section className="band" aria-labelledby="gallery-title">
      <ArcadeLine />
      <div className="wrap">
        <p className="eyebrow">Masjid an-Nabawi</p>
        <h2 id="gallery-title" className="night-title">
          Where we say Qubool
        </h2>
        <ul className="gallery">
          {items.map((it) => (
            <li key={it.caption} className="gallery__item">
              <div className="gallery__frame arch-mask">
                <img src={it.src} srcSet={it.srcSet} sizes="(min-width: 760px) 300px, 70vw" alt={it.alt} loading="lazy" decoding="async" />
              </div>
              <p className="gallery__caption">{it.caption}</p>
            </li>
          ))}
        </ul>
      </div>
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
    <footer className="band band--closing" aria-labelledby="closing-title">
      <ArcadeLine />
      <div className="wrap">
        <p className="monogram gold-foil" aria-hidden="true">
          A <span>&amp;</span> M
        </p>
        <h2 id="closing-title" className="night-title">
          We look forward to celebrating with you
        </h2>
        <p className="lead lead--light">Please keep us in your duas.</p>
        <div className="actions">
          <a className="btn btn--gold" href={whatsappShareHref()} target="_blank" rel="noopener noreferrer">
            Share on WhatsApp
          </a>
          <button type="button" className="btn btn--outline-light" onClick={onCopy}>
            {copied === 'ok' ? 'Link copied' : copied === 'fail' ? 'Copy failed' : 'Copy link'}
          </button>
          {hasShare && (
            <button type="button" className="btn btn--outline-light" onClick={() => void nativeShare()}>
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
        <details className="credits">
          <summary>Photo credits</summary>
          <ul>
            {photoCredits.map((c) => (
              <li key={c.id}>
                <a href={c.source} target="_blank" rel="noopener noreferrer">
                  {c.title}
                </a>{' '}
                by {c.author},{' '}
                {c.licenseUrl ? (
                  <a href={c.licenseUrl} target="_blank" rel="noopener noreferrer">
                    {c.license}
                  </a>
                ) : (
                  c.license
                )}
                , via Wikimedia Commons. Cropped and colour-graded.
              </li>
            ))}
          </ul>
        </details>
      </div>
    </footer>
  )
}
