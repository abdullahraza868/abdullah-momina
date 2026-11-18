import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from '../lib/gsap'
import { addFrameDraw } from '../lib/scrollFx'
import { wedding } from '../config/wedding'
import { formatEventDate } from '../lib/dates'
import { prefersReducedMotion } from '../lib/motion'
import { Birds, Couple } from './art/Couple'
import { RoyalFrame, SkylineLine } from './Ornament'
import { photos } from '../lib/photos'
import { nasheed } from '../lib/nasheed'
import { CardFace, CardInside } from './art/CardFace'
import { Tassel } from './art/Tassel'

type Phase = 'closed' | 'opening' | 'open'

const PULL_THRESHOLD = 64 // px of downward drag that opens the card
const PULL_MAX = 150
const TAP_SLOP = 6

interface Props {
  /** Line above the card, e.g. "An invitation for Ahmed". */
  invite: string
  onOpened: () => void
}

/** Size the opened card takes: full screen on phones, a tall card on larger screens. */
function expandedSize() {
  const w = window.innerWidth
  const h = window.innerHeight
  if (w < 640 || h < 560) return { width: w, height: h, radius: 0 }
  const ch = Math.min(h * 0.9, 920)
  return { width: ch / 2, height: ch, radius: 6 }
}

/**
 * The invitation object: a closed gatefold card. Pull the tassel (drag),
 * tap it, or press Enter/Space/↓ on it, and the two panels swing open on
 * the arch scene. With prefers-reduced-motion the panels simply fade.
 */
export function Gatefold({ invite, onOpened }: Props) {
  const [phase, setPhase] = useState<Phase>('closed')
  const [touched, setTouched] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
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
  // It also plays the welcome entrance: skyline draws, the card rises, the seal drops in.
  useLayoutEffect(() => {
    ctxRef.current = gsap.context(() => {
      if (prefersReducedMotion()) return
      const q = gsap.utils.selector(rootRef)
      gsap
        .timeline({ defaults: { ease: 'power3.out' } })
        .from(q('.gate-glow'), { autoAlpha: 0, scale: 0.6, duration: 2.2 }, 0)
        .fromTo(q('.skyline-line path'), { drawSVG: '50% 50%' }, { drawSVG: '0% 100%', duration: 2.6, ease: 'power2.inOut' }, 0.1)
        .from(q('.gate-eyebrow'), { autoAlpha: 0, letterSpacing: '0.9em', duration: 1.6 }, 0.3)
        .from(cardRef.current, { autoAlpha: 0, y: 70, rotateX: 18, scale: 0.92, transformPerspective: 1400, transformOrigin: '50% 100%', duration: 1.6, ease: 'expo.out' }, 0.25)
        .fromTo(q('.card-sheen'), { xPercent: -130 }, { xPercent: 130, duration: 1.8, ease: 'power2.inOut' }, 1.1)
        .from(q('.pull-layer .cord'), { scaleX: 0, transformOrigin: '50% 50%', duration: 1.0, ease: 'power3.inOut' }, 1.0)
        .from(q('.tassel'), { autoAlpha: 0, y: -60, scale: 1.5, duration: 1.0, ease: 'bounce.out' }, 1.3)
        .from(q('.gate-cta > *'), { autoAlpha: 0, y: 24, duration: 1.0, stagger: 0.15 }, 1.6)
    }, rootRef)
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
    // Start the nasheed inside the guest's own gesture (required by mobile browsers).
    nasheed.start()
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
      const target = expandedSize()
      const expand = () => {
        cardRef.current?.classList.add('is-expanded')
        setExpanded(true)
      }
      if (reduced) {
        expand()
        gsap
          .timeline({ onComplete: finish })
          .to(q('.gate-welcome, .gate-top, .gate-cta, .hand-hint'), { autoAlpha: 0, duration: 0.25 }, 0)
          .to(q('.pull-layer'), { autoAlpha: 0, duration: 0.25 })
          .to(q('.door'), { autoAlpha: 0, duration: 0.45 }, 0.1)
          .fromTo(lines, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5, stagger: 0.04 }, 0.3)
          .fromTo(q('.couple-layer, .scene-fx, .scene-card'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 }, 0.3)
        return
      }

      // Hand control back (scroll, focus) as soon as the doors are gone; the text keeps animating in.
      const master = gsap.timeline()
      master
        .to(q('.gate-top, .gate-cta, .hand-hint'), { autoAlpha: 0, y: 12, duration: 0.4, ease: 'power2.in' }, 0)
        .to(q('.gate-welcome'), { autoAlpha: 0, duration: 1.2 }, 0.2)
        .to(cardRef.current, { width: target.width, height: target.height, top: 0, bottom: 0, borderRadius: target.radius, duration: 0.85, ease: 'power3.inOut', onComplete: () => {
          expand()
          gsap.set(cardRef.current, { clearProps: 'width,height,top,bottom,borderRadius' })
        } }, 0.1)
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } })
      master.add(tl, 0.55)
      tl.to(tasselRef.current, { y: '+=40', duration: 0.28, ease: 'power2.in' })
        .to(q('.pull-layer'), { autoAlpha: 0, duration: 0.35 }, 0.12)
        .to([cordRef.current, cordHiRef.current], { attr: { d: 'M0 10 Q200 60 400 10' }, duration: 0.3 }, 0)
        .fromTo(q('.seam-light'), { scaleY: 0, autoAlpha: 0 }, { scaleY: 1, autoAlpha: 1, duration: 0.45, ease: 'power3.out' }, 0.2)
        .to(q('.door--left'), { rotationY: -104, duration: 1.45, ease: 'power3.inOut' }, 0.42)
        .to(q('.door--right'), { rotationY: 104, duration: 1.45, ease: 'power3.inOut' }, 0.42)
        .to(q('.door__shade'), { opacity: 0.45, duration: 1.0, ease: 'power1.in' }, 0.5)
        .to(q('.door'), { autoAlpha: 0, duration: 0.35, ease: 'power1.in' }, 1.5)
        .to(q('.seam-light'), { autoAlpha: 0, duration: 0.6 }, 0.9)
        // Camera settles back from the light as the doors part.
        .fromTo(q('.scene-art'), { scale: 1.14, filter: 'brightness(1.25) saturate(0.8)' }, { scale: 1, filter: 'brightness(1) saturate(1)', duration: 3.4, ease: 'power2.out' }, 0.45)
        .fromTo(q('.scene-fx'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 2.0, ease: 'power1.out' }, 1.0)
        // The couple step into the frame.
        .fromTo(q('.couple-layer'), { autoAlpha: 0, y: 26, scale: 1.04 }, { autoAlpha: 1, y: 0, scale: 1, duration: 2.0, ease: 'power3.out' }, 1.25)
        .fromTo(
          lines,
          { autoAlpha: 0, y: 16, filter: 'blur(6px)' },
          { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 1.0, stagger: 0.14, ease: 'power3.out', clearProps: 'filter' },
          1.5,
        )
        .fromTo(q('.scene-card'), { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 1.1, ease: 'power3.out' }, 2.3)
        .fromTo(q('.scene-event'), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.18 }, 2.6)
        .fromTo(q('.scene-card__rule'), { scaleY: 0 }, { scaleY: 1, duration: 0.9, ease: 'power2.inOut' }, 2.6)
        .fromTo(q('.sweep'), { xPercent: -120 }, { xPercent: 120, duration: 2.4, ease: 'power2.inOut' }, 1.0)
        .fromTo(q('.scroll-cue'), { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.6 }, 3.2)
      addFrameDraw(tl, rootRef.current!.querySelector('.scene')!, 1.3)
      tl.call(finish, [], 1.95)
    })
  }, [onOpened])

  // Pointer handling for the pull.
  const onPointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (phaseRef.current !== 'closed' || (e.pointerType === 'mouse' && e.button !== 0)) return
    swayRef.current?.pause()
    setTouched(true)
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
    <div ref={rootRef} className={`gate-stage is-${phase} ${touched ? 'is-touched' : ''}`}>
      {/* Welcome backdrop: spotlight, gold dust, skyline line drawing. */}
      <div className="gate-welcome" aria-hidden="true">
        <div className="gate-glow" />
        <div className="gate-dust" />
        <SkylineLine />
      </div>
      <div className="gate-top">
        <p className="gate-eyebrow">
          <span aria-hidden="true">✦</span> {invite} <span aria-hidden="true">✦</span>
        </p>
      </div>
    <div ref={cardRef} className={`gatefold is-${phase} ${expanded ? 'is-expanded' : ''}`}>
      {/* Revealed scene (always in the DOM; hidden from AT until open). */}
      <div className="scene" aria-hidden={!isOpen}>
        <div className="scene-art">
          <img className="scene-img" src={photos.hero.src} srcSet={photos.hero.srcSet} sizes="(min-width: 640px) 480px, 100vw" alt="" decoding="async" />
        </div>
        <div className="scene-shade" aria-hidden="true" />
        <div className="scene-fx" aria-hidden="true">
          <div className="sweep" />
          <Birds />
          <div className="motes" />
        </div>
        <div className="couple-layer">
          <Couple />
        </div>
        <RoyalFrame crest className="royal-frame--hero" />
        <div className="scene-text">
          <p className="reveal-line scene-bismillah" lang="ar" dir="rtl">
            بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
          </p>
          <p className="reveal-line scene-caps">Together with their families</p>
          <h1 ref={headingRef} tabIndex={-1} className="scene-names">
            <span className="reveal-line gold-foil">{wedding.groom.shortName}</span>
            <span className="reveal-line scene-amp">&amp;</span>
            <span className="reveal-line gold-foil">{wedding.bride.shortName}</span>
          </h1>
          <p className="reveal-line scene-invite">invite you to celebrate their union in Madinah</p>
        </div>
        <div className="scene-card">
          <span className="scene-card__star" aria-hidden="true" />
          <div className="scene-event">
            <p className="scene-event__name">{nikkahEv.title}</p>
            <p className="scene-event__day">{nikkah.weekday}</p>
            <p className="scene-event__date">
              {nikkah.day} {nikkah.month} {nikkah.year}
            </p>
            <p className="scene-event__time">{nikkahEv.timeLabel}</p>
            <p className="scene-event__place">{nikkahEv.venue?.name ?? 'Venue to be announced'}</p>
          </div>
          <span className="scene-card__rule" aria-hidden="true" />
          <div className="scene-event">
            <p className="scene-event__name">{receptionEv.title}</p>
            <p className="scene-event__day">{reception.weekday}</p>
            <p className="scene-event__date">
              {reception.day} {reception.month} {reception.year}
            </p>
            <p className="scene-event__time">{receptionEv.timeLabel}</p>
            <p className="scene-event__place">{receptionEv.venue?.name ?? 'Madinah'}</p>
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
              <CardFace />
            </div>
            <div className="door__back">
              <CardInside />
            </div>
            <div className="door__shade" />
          </div>
          <div className="door door--right" aria-hidden="true">
            <div className="door__face">
              <CardFace />
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
          <div className="card-sheen" aria-hidden="true" />
          <div className="hand-hint" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <circle className="hand-hint__ripple" cx="10.5" cy="4.5" r="3.5" />
              <path d="M9 11V4.5a1.5 1.5 0 0 1 3 0V10h.5V8.5a1.5 1.5 0 0 1 3 0V10.5h.5V9.5a1.5 1.5 0 0 1 3 0V15c0 3.3-2.2 6-5.5 6h-1.6c-1.6 0-3-.7-4-1.9L4.6 15.3a1.4 1.4 0 0 1 2.1-1.9L9 15.5Z" />
            </svg>
          </div>
        </>
      )}
    </div>
      {!isOpen && (
        <div className="gate-cta">
          <button type="button" className="open-cta" onClick={open} disabled={phase !== 'closed'}>
            <span className="open-cta__label">Open Invitation</span>
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path d="M3 8H13M9 4L13 8L9 12" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <p id="gate-hint" className="gate-hint">
            Tap the seal, or pull the tassel
          </p>
        </div>
      )}
    </div>
  )
}
