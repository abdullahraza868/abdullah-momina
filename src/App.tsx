import { useCallback, useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { wedding } from './config/wedding'
import { readGuestFromUrl } from './lib/guest'
import { prefersReducedMotion } from './lib/motion'
import { ArtDefs } from './components/art/Defs'
import { Gatefold } from './components/Gatefold'
import { Closing, Countdown, Events, InvitationText, Remembrance } from './components/Sections'
import { Rsvp } from './components/Rsvp'
import { AudioToggle } from './components/AudioToggle'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  const [guest] = useState(() => readGuestFromUrl())
  const [opened, setOpened] = useState(false)
  const mainRef = useRef<HTMLElement>(null)
  const greeting = guest ? `Dear ${guest}` : wedding.defaultGreeting

  const onOpened = useCallback(() => setOpened(true), [])

  // Gentle fade-up of sections as they scroll into view (skipped for reduced motion).
  useEffect(() => {
    if (!opened || prefersReducedMotion() || !mainRef.current) return
    const ctx = gsap.context(() => {
      gsap.set('.reveal-up', { autoAlpha: 0 })
      ScrollTrigger.batch('.reveal-up', {
        start: 'top 88%',
        once: true,
        onEnter: (els) => gsap.fromTo(els, { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out' }),
      })
      ScrollTrigger.refresh()
    }, mainRef)
    return () => ctx.revert()
  }, [opened])

  return (
    <>
      <ArtDefs />
      <main ref={mainRef} className={`page ${opened ? 'is-opened' : ''}`}>
        <div className="stage">
          <Gatefold greeting={greeting} onOpened={onOpened} />
        </div>
        <div className="story" hidden={!opened}>
          <InvitationText greeting={greeting} />
          <Events />
          <Countdown />
          <Remembrance />
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
