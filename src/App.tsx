import { useCallback, useEffect, useRef, useState } from 'react'
import { setupScrollFx } from './lib/scrollFx'
import { gsap } from './lib/gsap'
import { wedding } from './config/wedding'
import { readGuestFromUrl } from './lib/guest'
import { ArtDefs } from './components/art/Defs'
import { RoyalDefs } from './components/Ornament'
import { Gatefold } from './components/Gatefold'
import { Celebrations, Closing, Gallery, InvitationText, PhotoBand, Remembrance } from './components/Sections'
import { Rsvp } from './components/Rsvp'
import { AudioToggle } from './components/AudioToggle'
import { photos } from './lib/photos'

export default function App() {
  const [guest] = useState(() => readGuestFromUrl())
  const [opened, setOpened] = useState(false)
  const mainRef = useRef<HTMLElement>(null)
  const greeting = guest ? `Dear ${guest}` : wedding.defaultGreeting

  const onOpened = useCallback(() => setOpened(true), [])

  // Scroll choreography for the story (skipped for reduced motion inside setupScrollFx).
  useEffect(() => {
    // One gentle "peek" if the guest hasn't scrolled shortly after opening,
    // so it's obvious there is more below the first screen.
    if (!opened || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let tween: gsap.core.Timeline | null = null
    const events = ['wheel', 'touchstart', 'keydown', 'pointerdown'] as const
    const cancel = () => {
      window.clearTimeout(timer)
      tween?.kill()
      events.forEach((ev) => window.removeEventListener(ev, cancel))
    }
    events.forEach((ev) => window.addEventListener(ev, cancel, { passive: true }))
    const timer = window.setTimeout(() => {
      if (window.scrollY > 8) return cancel()
      tween = gsap
        .timeline({ onComplete: cancel })
        .to(window, { scrollTo: 110, duration: 0.7, ease: 'power2.out' })
        .to(window, { scrollTo: 0, duration: 0.8, ease: 'power2.inOut' }, '+=0.35')
    }, 5200)
    return cancel
  }, [opened])

  useEffect(() => {
    if (!opened || !mainRef.current) return
    return setupScrollFx(mainRef.current)
  }, [opened])

  return (
    <>
      <ArtDefs />
      <RoyalDefs />
      <div className="scroll-progress" aria-hidden="true" />
      <div className="ambient-dust" aria-hidden="true" />
      <main ref={mainRef} className={`page ${opened ? 'is-opened' : ''}`}>
        <div className="stage" style={{ '--hero': `url(${photos.hero.src})` } as React.CSSProperties}>
          <Gatefold invite={guest ? `An invitation for ${guest}` : 'You are cordially invited'} onOpened={onOpened} />
        </div>
        <div className="story" hidden={!opened}>
          <InvitationText greeting={greeting} />
          <PhotoBand />
          <Celebrations />
          <Remembrance />
          <Gallery />
          <Rsvp guestName={guest} />
          <Closing />
        </div>
      </main>
      {opened && (
        <div className="fabs">
          <AudioToggle />
        </div>
      )}
    </>
  )
}
