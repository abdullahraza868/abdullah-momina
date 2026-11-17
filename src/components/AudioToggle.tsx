import { useEffect, useRef, useState } from 'react'
import { wedding } from '../config/wedding'

type State = 'checking' | 'unavailable' | 'paused' | 'playing'

/**
 * Optional nasheed. Never autoplays: audio is created and played only after
 * the guest presses the button. If the file is missing (or the server returns
 * an HTML fallback page instead of audio), the control is not shown.
 */
export function AudioToggle() {
  const [state, setState] = useState<State>('checking')
  const audio = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch(wedding.audioSrc, { method: 'HEAD' })
      .then((r) => {
        const type = r.headers.get('content-type') ?? ''
        if (!cancelled) setState(r.ok && type.startsWith('audio') ? 'paused' : 'unavailable')
      })
      .catch(() => !cancelled && setState('unavailable'))
    return () => {
      cancelled = true
      audio.current?.pause()
      audio.current = null
    }
  }, [])

  if (state === 'checking' || state === 'unavailable') return null

  const toggle = async () => {
    if (!audio.current) {
      const a = new Audio(wedding.audioSrc)
      a.loop = true
      a.volume = 0.55
      a.addEventListener('error', () => setState('unavailable'))
      audio.current = a
    }
    if (state === 'playing') {
      audio.current.pause()
      setState('paused')
    } else {
      try {
        await audio.current.play()
        setState('playing')
      } catch {
        setState('unavailable')
      }
    }
  }

  const playing = state === 'playing'
  return (
    <button type="button" className={`fab ${playing ? 'is-on' : ''}`} onClick={toggle} aria-pressed={playing} aria-label={playing ? 'Pause nasheed' : 'Play nasheed'}>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        {playing ? (
          <path d="M8 6V18M16 6V18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        ) : (
          <path d="M9 17.5V6.5L18 5V16M9 17.5A2.5 2.5 0 1 1 6.5 15A2.5 2.5 0 0 1 9 17.5ZM18 16A2.5 2.5 0 1 1 15.5 13.5A2.5 2.5 0 0 1 18 16Z" fill="none" stroke="currentColor" strokeWidth="1.4" />
        )}
      </svg>
    </button>
  )
}
