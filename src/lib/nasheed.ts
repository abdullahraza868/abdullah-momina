import { useSyncExternalStore } from 'react'
import { wedding } from '../config/wedding'

/**
 * Background nasheed.
 *
 * Browsers (iOS Safari especially) only allow sound to start inside a user
 * gesture, so playback is started from the guest's own tap/pull that opens the
 * invitation — never on page load. A floating button lets them pause/resume.
 * It also pauses while the page is in the background.
 */
export type NasheedState = 'idle' | 'playing' | 'paused' | 'unavailable'

let audio: HTMLAudioElement | null = null
let state: NasheedState = 'idle'
let resumeOnVisible = false
let fadeTimer = 0
const listeners = new Set<() => void>()
const TARGET_VOLUME = 0.45

function set(next: NasheedState) {
  state = next
  listeners.forEach((l) => l())
}

function ensure(): HTMLAudioElement {
  if (audio) return audio
  audio = new Audio(wedding.audioSrc)
  audio.loop = true
  audio.preload = 'auto'
  audio.volume = 0
  audio.addEventListener('error', () => set('unavailable'))
  document.addEventListener('visibilitychange', () => {
    if (!audio) return
    if (document.hidden && state === 'playing') {
      resumeOnVisible = true
      audio.pause()
    } else if (!document.hidden && resumeOnVisible) {
      resumeOnVisible = false
      void audio.play().catch(() => {})
    }
  })
  return audio
}

function fadeTo(target: number, ms: number, done?: () => void) {
  const a = ensure()
  window.clearInterval(fadeTimer)
  const steps = Math.max(1, Math.round(ms / 50))
  const start = a.volume
  let i = 0
  fadeTimer = window.setInterval(() => {
    i++
    a.volume = Math.min(1, Math.max(0, start + ((target - start) * i) / steps))
    if (i >= steps) {
      window.clearInterval(fadeTimer)
      done?.()
    }
  }, 50)
}

export const nasheed = {
  /** Call synchronously from the opening gesture. Fades in gently. */
  start() {
    if (state === 'playing' || state === 'unavailable') return
    const a = ensure()
    a.volume = 0
    a.play()
      .then(() => {
        set('playing')
        fadeTo(TARGET_VOLUME, 3000)
      })
      .catch(() => set('paused')) // blocked or not yet loaded: the button can start it
  },
  toggle() {
    const a = ensure()
    if (state === 'playing') {
      set('paused')
      fadeTo(0, 400, () => a.pause())
    } else if (state !== 'unavailable') {
      a.play()
        .then(() => {
          set('playing')
          fadeTo(TARGET_VOLUME, 1200)
        })
        .catch(() => set('unavailable'))
    }
  },
  subscribe(l: () => void) {
    listeners.add(l)
    return () => listeners.delete(l)
  },
  get state() {
    return state
  },
}

export function useNasheedState(): NasheedState {
  return useSyncExternalStore(nasheed.subscribe, () => nasheed.state, () => 'idle')
}
