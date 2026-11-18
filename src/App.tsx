import { useCallback, useEffect, useRef, useState } from 'react'
import { setupScrollFx } from './lib/scrollFx'
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
