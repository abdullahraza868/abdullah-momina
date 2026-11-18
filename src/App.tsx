import { useCallback, useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { wedding } from './config/wedding'
import { readGuestFromUrl } from './lib/guest'
import { prefersReducedMotion } from './lib/motion'
import { ArtDefs } from './components/art/Defs'
import { Gatefold } from './components/Gatefold'
import { Celebrations, Closing, Gallery, InvitationText, PhotoBand, Remembrance } from './components/Sections'
import { Rsvp } from './components/Rsvp'
import { AudioToggle } from './components/AudioToggle'
import { photos } from './lib/photos'

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
        onEnter: (els) => gsap.fromTo(els, { autoAlpha: 0, y: 36 }, { autoAlpha: 1, y: 0, duration: 1.0, stagger: 0.14, ease: 'power3.out' }),
      })
      // Arch-framed photos open like a doorway: the mask grows from the base.
      gsap.set('.reveal-arch', { autoAlpha: 0 })
      ScrollTrigger.batch('.reveal-arch', {
        start: 'top 90%',
        once: true,
        onEnter: (els) =>
          gsap.fromTo(
            els,
            { autoAlpha: 0, clipPath: 'inset(100% 0% 0% 0%)', y: 30 },
            { autoAlpha: 1, clipPath: 'inset(0% 0% 0% 0%)', y: 0, duration: 1.3, stagger: 0.18, ease: 'power3.inOut', clearProps: 'clipPath' },
          ),
      })
      // Gentle parallax on full-bleed photographs.
      gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
        gsap.fromTo(el, { yPercent: -10 }, { yPercent: 10, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } })
      })
      ScrollTrigger.refresh()
    }, mainRef)
    return () => ctx.revert()
  }, [opened])

  return (
    <>
      <ArtDefs />
      <main ref={mainRef} className={`page ${opened ? 'is-opened' : ''}`}>
        <div className="stage" style={{ '--hero': `url(${photos.hero.src})` } as React.CSSProperties}>
          <Gatefold greeting={greeting} onOpened={onOpened} />
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
