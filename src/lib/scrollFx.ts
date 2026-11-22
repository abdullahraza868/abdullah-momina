import { gsap, ScrollTrigger, SplitText } from './gsap'

/**
 * Scroll choreography for everything after the gatefold opens.
 * All effects live inside one gsap.matchMedia() so they are skipped entirely
 * for prefers-reduced-motion and fully reverted (SplitText included) on cleanup.
 * Effects replay in reverse when scrolling back up ("play none none reverse").
 */
export function setupScrollFx(root: HTMLElement): () => void {
  const mm = gsap.matchMedia()
  const toggle = (trigger: Element, start = 'top 82%') => ({ trigger, start, toggleActions: 'play none none reverse' as const })

  mm.add('(prefers-reduced-motion: no-preference)', () => {
    const $ = <T extends Element = HTMLElement>(sel: string) => gsap.utils.toArray<T>(sel, root)

    // Reading progress: a gold hairline across the top of the screen.
    gsap.fromTo('.scroll-progress', { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: root, start: 'top top', end: 'bottom bottom', scrub: 0.3 } })

    // The opened card recedes as the story begins.
    const stage = root.querySelector('.stage')
    if (stage) {
      gsap.to('.gatefold', { scale: 0.9, yPercent: -4, opacity: 0.25, filter: 'blur(2px)', ease: 'none', scrollTrigger: { trigger: stage, start: 'top top', end: 'bottom top', scrub: true } })
    }

    // Gold arcade lines draw outward from the centre.
    $('.arcade-line').forEach((el) => {
      gsap.fromTo(el.querySelectorAll('.rf-draw'), { drawSVG: '50% 50%' }, { drawSVG: '0% 100%', duration: 1.8, ease: 'power2.inOut', scrollTrigger: toggle(el, 'top 90%') })
    })

    // Eyebrows: letters gather in from a wide tracking.
    $('.eyebrow').forEach((el) => {
      gsap.fromTo(el, { letterSpacing: '0.9em', autoAlpha: 0 }, { letterSpacing: '0.32em', autoAlpha: 1, duration: 1.4, ease: 'power3.out', scrollTrigger: toggle(el, 'top 90%') })
    })

    // Titles rise letter by letter out of a mask.
    $('.night-title').forEach((el) => {
      const split = SplitText.create(el, { type: 'words,chars', mask: 'words' })
      gsap.from(split.chars, { yPercent: 120, rotate: 6, autoAlpha: 0, duration: 0.9, stagger: 0.022, ease: 'power4.out', scrollTrigger: toggle(el, 'top 88%') })
    })

    // Paragraphs bloom in word by word.
    $('.lead, .memory__line, .memory__dua, .photo-band__line, .event__note').forEach((el) => {
      const split = SplitText.create(el, { type: 'words' })
      gsap.from(split.words, { autoAlpha: 0, y: 12, filter: 'blur(6px)', duration: 0.8, stagger: 0.035, ease: 'power2.out', scrollTrigger: toggle(el, 'top 88%') })
    })

    // Script names are revealed left to right, like ink.
    $('.person__name, .memory__name, .event__title, .monogram, .gallery__caption').forEach((el) => {
      gsap.fromTo(
        el,
        { clipPath: 'inset(-20% 100% -20% 0%)', filter: 'blur(4px)' },
        { clipPath: 'inset(-20% 0% -20% 0%)', filter: 'blur(0px)', duration: 1.8, ease: 'power3.inOut', scrollTrigger: toggle(el, 'top 88%') },
      )
    })

    // Paper cards tilt up into place, then their royal frame draws itself.
    $('.paper-card').forEach((card) => {
      const tl = gsap.timeline({ scrollTrigger: toggle(card, 'top 85%') })
      tl.from(card, { rotateX: 16, y: 110, scale: 0.92, autoAlpha: 0, transformPerspective: 1200, transformOrigin: '50% 100%', duration: 1.5, ease: 'expo.out' })
      addFrameDraw(tl, card, 0.35)
    })

    // Event cards swing in from either side; their photos settle from a zoom.
    $('.event').forEach((card, i) => {
      gsap.from(card, {
        x: i % 2 ? 70 : -70,
        rotateY: i % 2 ? -14 : 14,
        y: 60,
        autoAlpha: 0,
        transformPerspective: 1200,
        duration: 1.5,
        ease: 'expo.out',
        scrollTrigger: toggle(card, 'top 88%'),
      })
      const img = card.querySelector('img')
      if (img) gsap.fromTo(img, { scale: 1.35 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: card, start: 'top bottom', end: 'center center', scrub: true } })
      const day = card.querySelector<HTMLElement>('.event__day')
      if (day) {
        const target = Number(day.textContent) || 0
        const counter = { v: 1 }
        gsap.to(counter, {
          v: target,
          duration: 1.6,
          ease: 'power2.out',
          snap: { v: 1 },
          onUpdate: () => (day.textContent = String(Math.round(counter.v))),
          scrollTrigger: toggle(card, 'top 75%'),
        })
      }
    })

    // Countdown units flip up one after another.
    $('.countdown').forEach((el) => {
      gsap.from(el.children, { rotateX: -90, y: 30, autoAlpha: 0, transformPerspective: 600, transformOrigin: '50% 100%', duration: 1.1, stagger: 0.14, ease: 'back.out(1.6)', scrollTrigger: toggle(el, 'top 88%') })
    })

    // Dividers: the rule draws outward, the star spins in.
    $('.divider').forEach((el) => {
      const tl = gsap.timeline({ scrollTrigger: toggle(el, 'top 92%') })
      tl.from(el.querySelectorAll('path'), { drawSVG: '50% 50%', duration: 1.2, ease: 'power2.inOut' }).from(el.querySelectorAll('g, circle'), { scale: 0, rotate: 180, transformOrigin: '50% 50%', duration: 0.9, ease: 'back.out(2)', stagger: 0.05 }, 0.3)
    })

    // Full-bleed photograph: parallax drift and a slow zoom; Arabic title wipes in right to left.
    $('.photo-band').forEach((band) => {
      const media = band.querySelector('.photo-band__media')
      if (media) {
        gsap.fromTo(media, { yPercent: -12, scale: 1.25 }, { yPercent: 12, scale: 1.02, ease: 'none', scrollTrigger: { trigger: band, start: 'top bottom', end: 'bottom top', scrub: true } })
      }
      const ar = band.querySelector('.photo-band__ar')
      if (ar) gsap.fromTo(ar, { clipPath: 'inset(-30% 0% -30% 100%)' }, { clipPath: 'inset(-30% 0% -30% 0%)', duration: 2, ease: 'power3.inOut', scrollTrigger: toggle(band, 'top 55%') })
    })

    // The lantern swings in on its chain and settles.
    $('.lantern').forEach((el) => {
      gsap.from(el, { rotate: 24, y: -60, autoAlpha: 0, transformOrigin: '50% 0%', duration: 2.6, ease: 'elastic.out(1, 0.28)', scrollTrigger: toggle(el, 'top 88%') })
    })

    // Gallery: each arch opens like a doorway, then its photograph drifts.
    $('.gallery__item').forEach((item, i) => {
      const frame = item.querySelector('.gallery__frame')
      const img = item.querySelector('img')
      gsap.fromTo(
        frame,
        { clipPath: 'inset(100% 0% 0% 0% round 999px 999px 8px 8px)', autoAlpha: 0 },
        { clipPath: 'inset(0% 0% 0% 0% round 0px 0px 0px 0px)', autoAlpha: 1, duration: 1.4, delay: i * 0.15, ease: 'power3.inOut', clearProps: 'clipPath', scrollTrigger: toggle(item, 'top 92%') },
      )
      if (img) gsap.fromTo(img, { scale: 1.3, yPercent: -6 }, { scale: 1.05, yPercent: 6, ease: 'none', scrollTrigger: { trigger: item, start: 'top bottom', end: 'bottom top', scrub: true } })
    })

    // Form fields and buttons arrive in a gentle cascade.
    $('.rsvp').forEach((form) => {
      gsap.from(form.children, { y: 26, autoAlpha: 0, duration: 0.8, stagger: 0.08, ease: 'power3.out', scrollTrigger: toggle(form, 'top 85%') })
    })
    $('.actions').forEach((el) => {
      gsap.from(el.children, { y: 24, scale: 0.9, autoAlpha: 0, duration: 0.9, stagger: 0.1, ease: 'back.out(1.8)', scrollTrigger: toggle(el, 'top 92%') })
    })
    $('.contact, .credits, .fineprint, .person__parent, .event__date span:not(.event__day), .event__time, .event__venue, .event__city').forEach((el) => {
      gsap.from(el, { y: 14, autoAlpha: 0, duration: 0.9, ease: 'power2.out', scrollTrigger: toggle(el, 'top 94%') })
    })
  })

  // Layout can shift after fonts and photographs load; re-measure so triggers fire where they should.
  let raf = 0
  const refresh = () => {
    cancelAnimationFrame(raf)
    raf = requestAnimationFrame(() => ScrollTrigger.refresh())
  }
  document.fonts?.ready.then(refresh)
  const imgs = Array.from(root.querySelectorAll('img'))
  imgs.forEach((img) => !img.complete && img.addEventListener('load', refresh, { once: true }))
  window.addEventListener('load', refresh)
  refresh()

  return () => {
    cancelAnimationFrame(raf)
    window.removeEventListener('load', refresh)
    imgs.forEach((img) => img.removeEventListener('load', refresh))
    mm.revert()
  }
}

/** Draws a RoyalFrame: rules sweep out, tendrils draw, medallions spin in, leaves bloom. */
export function addFrameDraw(tl: gsap.core.Timeline, scope: Element, at: number) {
  const frame = scope.querySelector('.royal-frame')
  if (!frame) return
  tl.fromTo(frame.querySelectorAll('.rf-line'), { clipPath: 'inset(50% 50% 50% 50%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'power3.inOut', stagger: 0.12 }, at)
    .fromTo(frame.querySelectorAll('.rf-medallion'), { scale: 0, rotate: -180, transformOrigin: '50% 50%' }, { scale: 1, rotate: 0, duration: 1.1, ease: 'back.out(1.8)', stagger: 0.08 }, at + 0.2)
    .fromTo(frame.querySelectorAll('.rf-draw path'), { drawSVG: '0%' }, { drawSVG: '100%', duration: 1.6, ease: 'power2.out', stagger: 0.02 }, at + 0.35)
    .fromTo(frame.querySelectorAll('.rf-leaves > *'), { scale: 0, transformOrigin: '50% 50%' }, { scale: 1, duration: 0.6, ease: 'back.out(2.5)', stagger: 0.015 }, at + 0.8)
    .fromTo(frame.querySelectorAll('.rf-crest'), { autoAlpha: 0, y: -10 }, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out' }, at + 0.3)
}
