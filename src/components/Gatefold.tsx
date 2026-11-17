import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { wedding } from '../config/wedding'
import { formatEventDate } from '../lib/dates'
import { prefersReducedMotion } from '../lib/motion'
import { Birds, Couple } from './art/Couple'
import sceneUrl from '../assets/madinah-dusk.webp'
import { CardFace, CardInside } from './art/CardFace'
import { Tassel } from './art/Tassel'

type Phase = 'closed' | 'opening' | 'open'

const PULL_THRESHOLD = 64 // px of downward drag that opens the card
const PULL_MAX = 150
const TAP_SLOP = 6

interface Props {
  greeting: string
  onOpened: () => void
}

/**
 * The invitation object: a closed gatefold card. Pull the tassel (drag),
 * tap it, or press Enter/Space/↓ on it, and the two panels swing open on
 * the arch scene. With prefers-reduced-motion the panels simply fade.
 */
export function Gatefold({ greeting, onOpened }: Props) {
  const [phase, setPhase] = useState<Phase>('closed')
  const rootRef = useRef<HTMLDivElement>(null)
  const pullRef = useRef<HTMLButtonElement>(null)
  const tasselRef = useRef<HTMLSpanElement>(null)
  const cordRef = useRef<SVGPathElement>(null)
  const cordHiRef = useRef<SVGPathElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const ctxRef = useRef<gsap.Context | null>(null)
  const swayRef = useRef<gsap.core.Tween | null>(null)
  const drag = useRef({ active: false, startY: 0, dy: 0, moved: false, pointerId: -1 })
  const phaseRef = useRef<Phase>('closed')

  const [nikkahEv, receptionEv] = wedding.events
  const nikkah = formatEventDate(nikkahEv.date)
  const reception = formatEventDate(receptionEv.date)

  // One GSAP context for the component; reverted (all tweens killed) on unmount.
  useLayoutEffect(() => {
    ctxRef.current = gsap.context(() => {}, rootRef)
    return () => ctxRef.current?.revert()
  }, [])

  // Lock page scroll while the card is closed.
  useEffect(() => {
    const el = document.documentElement
    if (phase === 'open') el.classList.remove('is-locked')
    else el.classList.add('is-locked')
    return () => el.classList.remove('is-locked')
  }, [phase])

  // Gentle idle sway of the tassel to invite a pull.
  useEffect(() => {
    if (phase !== 'closed' || prefersReducedMotion() || !ctxRef.current) return
    ctxRef.current.add(() => {
      swayRef.current = gsap.to(tasselRef.current, {
        rotation: 2.4,
        transformOrigin: '50% 0%',
        duration: 2.2,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: 1.2,
      })
    })
    return () => {
      swayRef.current?.kill()
      swayRef.current = null
    }
  }, [phase])

  const setCord = (dy: number) => {
    const d = `M0 10 Q200 ${10 + dy * 0.85} 400 10`
    cordRef.current?.setAttribute('d', d)
    cordHiRef.current?.setAttribute('d', d)
  }

  const open = useCallback(() => {
    if (phaseRef.current !== 'closed' || !ctxRef.current) return
    phaseRef.current = 'opening'
    setPhase('opening')
    swayRef.current?.kill()
    const reduced = prefersReducedMotion()
    const finish = () => {
      phaseRef.current = 'open'
      setPhase('open')
      onOpened()
      // Move focus to the revealed heading for keyboard and screen-reader users.
      requestAnimationFrame(() => headingRef.current?.focus({ preventScroll: true }))
    }

    ctxRef.current.add(() => {
      const q = gsap.utils.selector(rootRef)
      const lines = q('.reveal-line')
      if (reduced) {
        gsap
          .timeline({ onComplete: finish })
          .to(q('.pull-layer, .gate-hint'), { autoAlpha: 0, duration: 0.25 })
          .to(q('.door'), { autoAlpha: 0, duration: 0.45 }, 0.1)
          .fromTo(lines, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5, stagger: 0.04 }, 0.3)
          .fromTo(q('.couple-layer, .scene-fx'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 }, 0.3)
        return
      }

      // Hand control back (scroll, focus) as soon as the doors are gone; the text keeps animating in.
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } })
      tl.to(tasselRef.current, { y: '+=40', duration: 0.28, ease: 'power2.in' })
        .to(q('.pull-layer, .gate-hint'), { autoAlpha: 0, duration: 0.35 }, 0.12)
        .to([cordRef.current, cordHiRef.current], { attr: { d: 'M0 10 Q200 60 400 10' }, duration: 0.3 }, 0)
        .fromTo(q('.seam-light'), { scaleY: 0, autoAlpha: 0 }, { scaleY: 1, autoAlpha: 1, duration: 0.45, ease: 'power3.out' }, 0.2)
        .to(q('.door--left'), { rotationY: -104, duration: 1.45, ease: 'power3.inOut' }, 0.42)
        .to(q('.door--right'), { rotationY: 104, duration: 1.45, ease: 'power3.inOut' }, 0.42)
        .to(q('.door__shade'), { opacity: 0.45, duration: 1.0, ease: 'power1.in' }, 0.5)
        .to(q('.door'), { autoAlpha: 0, duration: 0.35, ease: 'power1.in' }, 1.5)
        .to(q('.seam-light'), { autoAlpha: 0, duration: 0.6 }, 0.9)
        // Camera settles back from the light as the doors part.
        .fromTo(q('.scene-art'), { scale: 1.16, filter: 'brightness(1.18)' }, { scale: 1, filter: 'brightness(1)', duration: 3.2, ease: 'power2.out' }, 0.45)
        .fromTo(q('.scene-fx'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 2.0, ease: 'power1.out' }, 1.0)
        // The couple step into the frame.
        .fromTo(q('.couple-layer'), { autoAlpha: 0, y: 26, scale: 1.04 }, { autoAlpha: 1, y: 0, scale: 1, duration: 2.0, ease: 'power3.out' }, 1.25)
        .fromTo(
          lines,
          { autoAlpha: 0, y: 16, filter: 'blur(6px)' },
          { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 1.0, stagger: 0.14, ease: 'power3.out', clearProps: 'filter' },
          1.5,
        )
        .fromTo(q('.scene-events__rule'), { scaleY: 0 }, { scaleY: 1, duration: 0.9, ease: 'power2.inOut' }, '-=0.9')
        .fromTo(q('.scroll-cue'), { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.6 }, '-=0.2')
      tl.call(finish, [], 1.95)
    })
  }, [onOpened])

  // Pointer handling for the pull.
  const onPointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (phaseRef.current !== 'closed' || (e.pointerType === 'mouse' && e.button !== 0)) return
    swayRef.current?.pause()
    gsap.set(tasselRef.current, { rotation: 0 })
    drag.current = { active: true, startY: e.clientY, dy: 0, moved: false, pointerId: e.pointerId }
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  const onPointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    const d = drag.current
    if (!d.active || e.pointerId !== d.pointerId) return
    const raw = Math.max(0, e.clientY - d.startY)
    // Resistance past the threshold, like pulling silk against a knot.
    const dy = raw < PULL_THRESHOLD ? raw : PULL_THRESHOLD + (raw - PULL_THRESHOLD) * 0.45
    d.dy = Math.min(dy, PULL_MAX)
    if (raw > TAP_SLOP) d.moved = true
    gsap.set(tasselRef.current, { y: d.dy })
    setCord(d.dy)
  }
  const endDrag = (e: React.PointerEvent<HTMLButtonElement>) => {
    const d = drag.current
    if (!d.active || e.pointerId !== d.pointerId) return
    d.active = false
    if (d.dy >= PULL_THRESHOLD) {
      open()
    } else if (d.moved) {
      // Not far enough: spring back.
      gsap.to(tasselRef.current, { y: 0, duration: 0.7, ease: 'elastic.out(1, 0.45)' })
      const proxy = { dy: d.dy }
      gsap.to(proxy, { dy: 0, duration: 0.7, ease: 'elastic.out(1, 0.45)', onUpdate: () => setCord(proxy.dy) })
      swayRef.current?.resume()
    }
  }
  // Click covers taps, Enter and Space. A completed drag already opened.
  const onClick = () => {
    if (drag.current.moved) {
      drag.current.moved = false
      return
    }
    open()
  }
  const onKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      open()
    }
  }

  const isOpen = phase === 'open'

  return (
    <div ref={rootRef} className={`gatefold is-${phase}`}>
      {/* Revealed scene (always in the DOM; hidden from AT until open). */}
      <div className="scene" aria-hidden={!isOpen}>
        <div className="scene-art">
          <img className="scene-img" src={sceneUrl} alt="" decoding="async" />
        </div>
        <div className="scene-fx" aria-hidden="true">
          <div className="rays" />
          <Birds />
          <div className="motes" />
        </div>
        <div className="couple-layer">
          <Couple />
        </div>
        <div className="scene-veil" aria-hidden="true" />
        <div className="scene-text">
          <p className="reveal-line scene-bismillah" lang="ar" dir="rtl">
            بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
          </p>
          <p className="reveal-line scene-caps">Together with their families</p>
          <h1 ref={headingRef} tabIndex={-1} className="scene-names">
            <span className="reveal-line">{wedding.groom.shortName}</span>
            <span className="reveal-line scene-amp">&amp;</span>
            <span className="reveal-line">{wedding.bride.shortName}</span>
          </h1>
          <p className="reveal-line scene-invite">invite you to celebrate their union</p>
          <div className="scene-events">
            <div className="scene-event reveal-line">
              <p className="scene-event__name">{nikkahEv.title}</p>
              <p className="scene-event__day">{nikkah.weekday}</p>
              <p className="scene-event__date">
                {nikkah.day} {nikkah.month} {nikkah.year}
              </p>
              <p className="scene-event__time">{nikkahEv.timeLabel}</p>
              <p className="scene-event__place">{nikkahEv.venue?.name ?? 'Venue to be announced'}</p>
            </div>
            <span className="scene-events__rule" aria-hidden="true" />
            <div className="scene-event reveal-line">
              <p className="scene-event__name">{receptionEv.title}</p>
              <p className="scene-event__day">{reception.weekday}</p>
              <p className="scene-event__date">
                {reception.day} {reception.month} {reception.year}
              </p>
              <p className="scene-event__time">{receptionEv.timeLabel}</p>
              <p className="scene-event__place">{receptionEv.venue?.name ?? 'Madinah'}</p>
            </div>
          </div>
        </div>
        <a className="scroll-cue" href="#invitation" tabIndex={isOpen ? 0 : -1}>
          <span>Scroll</span>
          <svg viewBox="0 0 12 16" aria-hidden="true">
            <path d="M6 1V14M1 9L6 14L11 9" fill="none" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        </a>
      </div>

      {!isOpen && (
        <>
          <div className="seam-light" aria-hidden="true" />
          <div className="door door--left" aria-hidden="true">
            <div className="door__face">
              <CardFace greeting={greeting} />
            </div>
            <div className="door__back">
              <CardInside />
            </div>
            <div className="door__shade" />
          </div>
          <div className="door door--right" aria-hidden="true">
            <div className="door__face">
              <CardFace greeting={greeting} />
            </div>
            <div className="door__back">
              <CardInside />
            </div>
            <div className="door__shade" />
          </div>

          <div className="pull-layer">
            <svg className="cord" viewBox="0 0 400 200" preserveAspectRatio="none" aria-hidden="true">
              <path ref={cordRef} d="M0 10 Q200 10 400 10" fill="none" stroke="#A9864F" strokeWidth="3" vectorEffect="non-scaling-stroke" />
              <path ref={cordHiRef} d="M0 10 Q200 10 400 10" fill="none" stroke="#EEDDB4" strokeWidth="1" vectorEffect="non-scaling-stroke" transform="translate(0 -0.6)" />
            </svg>
            <button
              ref={pullRef}
              type="button"
              className="pull"
              aria-label={`Open the invitation from ${wedding.groom.shortName} and ${wedding.bride.shortName}`}
              aria-describedby="gate-hint"
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
              onClick={onClick}
              onKeyDown={onKeyDown}
              disabled={phase !== 'closed'}
            >
              <span ref={tasselRef} className="tassel">
                <Tassel />
              </span>
            </button>
          </div>
          <p id="gate-hint" className="gate-hint">
            Pull the tassel to open
          </p>
        </>
      )}
    </div>
  )
}
