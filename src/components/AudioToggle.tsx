import { nasheed, useNasheedState } from '../lib/nasheed'

/** Floating control for the background nasheed (shown once the invitation is open). */
export function AudioToggle() {
  const state = useNasheedState()
  if (state === 'unavailable') return null
  const playing = state === 'playing'
  return (
    <button type="button" className={`fab fab--audio ${playing ? 'is-on' : ''}`} onClick={() => nasheed.toggle()} aria-pressed={playing} aria-label={playing ? 'Pause nasheed' : 'Play nasheed'}>
      {playing ? (
        <span className="eq" aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
        </span>
      ) : (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M9 17.5V6.5L18 5V16M9 17.5A2.5 2.5 0 1 1 6.5 15A2.5 2.5 0 0 1 9 17.5ZM18 16A2.5 2.5 0 1 1 15.5 13.5A2.5 2.5 0 0 1 18 16Z" fill="none" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      )}
    </button>
  )
}
