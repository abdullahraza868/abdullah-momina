/** Thin gold rule with a central 8-point star. */
export function Divider({ className = '' }: { className?: string }) {
  return (
    <svg className={`divider ${className}`} viewBox="0 0 240 16" aria-hidden="true" focusable="false">
      <path d="M0 8H100M140 8H240" stroke="#B08D57" strokeWidth="0.8" />
      <g transform="translate(120 8)">
        <rect x="-5" y="-5" width="10" height="10" fill="url(#gold)" />
        <rect x="-5" y="-5" width="10" height="10" fill="url(#gold)" transform="rotate(45)" />
        <circle r="2.3" fill="#FBF6EC" />
      </g>
      <circle cx="104" cy="8" r="1.4" fill="url(#gold)" />
      <circle cx="136" cy="8" r="1.4" fill="url(#gold)" />
    </svg>
  )
}

/** Pointed-arch outline that frames event cards; stretches to its box. */
export function ArchFrame() {
  return (
    <svg className="arch-frame" viewBox="0 0 300 400" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <path
        d="M2 398V120C2 70 90 26 150 2C210 26 298 70 298 120V398Z"
        fill="rgba(255, 252, 245, 0.72)"
        stroke="url(#gold)"
        strokeWidth="1.2"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M10 390V124C10 78 92 38 150 14C208 38 290 78 290 124V390Z"
        fill="none"
        stroke="url(#gold)"
        strokeWidth="0.6"
        opacity="0.6"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

/** Islamic-geometric corner piece; place four, rotated, on a framed card. */
export function Corner({ className = '' }: { className?: string }) {
  return (
    <svg className={`corner ${className}`} viewBox="0 0 80 80" aria-hidden="true" focusable="false">
      <path d="M2 78V2H78" fill="none" stroke="url(#gold)" strokeWidth="1.2" />
      <path d="M9 78V9H78" fill="none" stroke="url(#gold)" strokeWidth="0.6" opacity="0.7" />
      <g transform="translate(22 22)">
        <rect x="-9" y="-9" width="18" height="18" fill="none" stroke="url(#gold)" strokeWidth="1" />
        <rect x="-9" y="-9" width="18" height="18" fill="none" stroke="url(#gold)" strokeWidth="1" transform="rotate(45)" />
        <circle r="3.2" fill="url(#gold)" />
      </g>
      <path d="M35 9Q45 16 55 9M9 35Q16 45 9 55" fill="none" stroke="url(#gold)" strokeWidth="0.7" />
      <circle cx="62" cy="9" r="1.6" fill="url(#gold)" />
      <circle cx="9" cy="62" r="1.6" fill="url(#gold)" />
    </svg>
  )
}

export function Frame() {
  return (
    <>
      <Corner className="corner--tl" />
      <Corner className="corner--tr" />
      <Corner className="corner--bl" />
      <Corner className="corner--br" />
    </>
  )
}

/**
 * A row of pointed arches used as the edge between an ivory and a night
 * section — like looking out through the mosque's arcade.
 */
export function ArcadeEdge({ flip = false }: { flip?: boolean }) {
  const n = 9
  const w = 1200 / n
  let d = 'M0 0H1200V60'
  for (let i = n - 1; i >= 0; i--) {
    const x0 = i * w
    const x1 = x0 + w
    const cx = (x0 + x1) / 2
    d += `L${x1 - 6} 60V34C${x1 - 6} 18 ${cx + 22} 8 ${cx} 2C${cx - 22} 8 ${x0 + 6} 18 ${x0 + 6} 34V60`
  }
  d += 'L0 60Z'
  return (
    <svg className={`arcade-edge ${flip ? 'arcade-edge--flip' : ''}`} viewBox="0 0 1200 60" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <path d={d} />
    </svg>
  )
}

/** Hanging lantern (fanoos) with a soft glow, for the remembrance. */
export function Lantern() {
  return (
    <svg className="lantern" viewBox="0 0 80 150" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id="lantern-glow" cx="0.5" cy="0.62" r="0.5">
          <stop offset="0" stopColor="#FFE9B0" stopOpacity="0.95" />
          <stop offset="0.6" stopColor="#F2C97A" stopOpacity="0.35" />
          <stop offset="1" stopColor="#F2C97A" stopOpacity="0" />
        </radialGradient>
      </defs>
      <path d="M40 0V22" stroke="#B08D57" strokeWidth="1" />
      <circle cx="40" cy="92" r="40" fill="url(#lantern-glow)" className="lantern__glow" />
      <path d="M30 26H50L46 34H34Z" fill="url(#gold)" />
      <path d="M40 18L46 26H34Z" fill="url(#gold)" />
      <path d="M28 36H52L58 70L52 112H28L22 70Z" fill="rgba(255, 236, 190, 0.35)" stroke="url(#gold)" strokeWidth="1.4" />
      <path d="M40 36V112M22 70H58M28 36L40 70L52 36M28 112L40 70L52 112" fill="none" stroke="#B08D57" strokeWidth="0.6" opacity="0.7" />
      <ellipse cx="40" cy="80" rx="5" ry="9" fill="#FFF3CF" className="lantern__flame" />
      <path d="M26 112H54L50 120H30Z" fill="url(#gold)" />
      <path d="M40 120V132" stroke="#B08D57" strokeWidth="1" />
      <circle cx="40" cy="136" r="3" fill="url(#gold)" />
    </svg>
  )
}
