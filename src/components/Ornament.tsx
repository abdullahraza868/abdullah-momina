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

/* ---------------- Royal frame ---------------- */

const RF_GOLD = 'url(#rf-gold)'

/** Ornate gold corner: medallion with an 8-point star and scrolling tendrils along both edges. */
function RoyalCorner({ pos }: { pos: 'tl' | 'tr' | 'bl' | 'br' }) {
  const id = `rf-arm-${pos}`
  return (
    <svg className={`rf-corner rf-corner--${pos}`} viewBox="0 0 140 140" aria-hidden="true" focusable="false">
      <g id={id} fill="none" stroke={RF_GOLD} strokeLinecap="round" className="rf-draw">
        <path d="M30 23C42 23 48 31 60 30C72 29 74 18 64 17C57 16.5 56 25 63 25.5" strokeWidth="1.3" />
        <path d="M60 30C70 34 82 33 90 27C96 22.5 104 23 108 27" strokeWidth="1" />
        <path d="M44 25.5C47 31 46 36 41 39C38 41 34 40 35 37" strokeWidth="0.9" />
        <path d="M78 32.5C80 37 84 39 88 38" strokeWidth="0.8" />
        <path d="M108 27C111 30 115 30 118 28" strokeWidth="0.8" />
      </g>
      <g className="rf-leaves" fill={RF_GOLD}>
        <ellipse cx="96" cy="21" rx="4.2" ry="1.7" transform="rotate(-22 96 21)" />
        <ellipse cx="52" cy="34.5" rx="3.6" ry="1.5" transform="rotate(30 52 34.5)" />
        <circle cx="122" cy="16" r="1.6" />
        <circle cx="130" cy="16" r="1" />
        <circle cx="88" cy="38" r="1.2" />
        <ellipse cx="21" cy="96" rx="1.7" ry="4.2" transform="rotate(22 21 96)" />
        <ellipse cx="34.5" cy="52" rx="1.5" ry="3.6" transform="rotate(-30 34.5 52)" />
        <circle cx="16" cy="122" r="1.6" />
        <circle cx="16" cy="130" r="1" />
        <circle cx="38" cy="88" r="1.2" />
        <path d="M27 27C34 30 38 34 41 41C34 38 30 34 27 27Z" />
        <circle cx="44" cy="44" r="1.8" />
      </g>
      <use href={`#${id}`} transform="matrix(0 1 1 0 0 0)" />
      <g className="rf-medallion" transform="translate(16 16)">
        <circle r="13" className="rf-fill" stroke={RF_GOLD} strokeWidth="1.4" />
        <circle r="9.5" fill="none" stroke={RF_GOLD} strokeWidth="0.6" />
        <g className="rf-star">
          <rect x="-6.5" y="-6.5" width="13" height="13" fill={RF_GOLD} />
          <rect x="-6.5" y="-6.5" width="13" height="13" fill={RF_GOLD} transform="rotate(45)" />
        </g>
        <circle r="2.6" className="rf-fill" />
      </g>
    </svg>
  )
}

/** Arch-shaped cartouche that sits on the top line of a frame. */
function Crest({ bottom = false }: { bottom?: boolean }) {
  return (
    <svg className={`rf-crest ${bottom ? 'rf-crest--bottom' : ''}`} viewBox="0 0 220 56" aria-hidden="true" focusable="false">
      <g fill="none" stroke={RF_GOLD} strokeLinecap="round" className="rf-draw">
        <path d="M84 44C70 44 62 34 50 36C40 38 40 48 48 48C54 48 54 41 49 41" strokeWidth="1.2" />
        <path d="M50 36C40 30 28 32 20 40" strokeWidth="0.9" />
        <path d="M136 44C150 44 158 34 170 36C180 38 180 48 172 48C166 48 166 41 171 41" strokeWidth="1.2" />
        <path d="M170 36C180 30 192 32 200 40" strokeWidth="0.9" />
      </g>
      <path d="M86 54V32C86 20 98 12 110 4C122 12 134 20 134 32V54Z" className="rf-fill" stroke={RF_GOLD} strokeWidth="1.4" />
      <path d="M92 54V33C92 23 101 16 110 10C119 16 128 23 128 33V54" fill="none" stroke={RF_GOLD} strokeWidth="0.6" />
      <g className="rf-star" transform="translate(110 36)">
        <rect x="-7" y="-7" width="14" height="14" fill={RF_GOLD} />
        <rect x="-7" y="-7" width="14" height="14" fill={RF_GOLD} transform="rotate(45)" />
        <circle r="3" className="rf-fill" />
      </g>
      <circle cx="16" cy="40" r="1.6" fill={RF_GOLD} />
      <circle cx="204" cy="40" r="1.6" fill={RF_GOLD} />
    </svg>
  )
}

/**
 * The royal frame used on every card and around the opening scene:
 * double gold rules, ornate corners and (optionally) crests top and bottom.
 */
export function RoyalFrame({ crest = false, className = '' }: { crest?: boolean; className?: string }) {
  return (
    <div className={`royal-frame ${className}`} aria-hidden="true">
      <span className="rf-line rf-line--outer" />
      <span className="rf-line rf-line--inner" />
      <RoyalCorner pos="tl" />
      <RoyalCorner pos="tr" />
      <RoyalCorner pos="bl" />
      <RoyalCorner pos="br" />
      {crest && <Crest />}
      {crest && <Crest bottom />}
    </div>
  )
}

/** Shared gradient for the royal ornaments (rendered once). */
export function RoyalDefs() {
  return (
    <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: 'absolute' }}>
      <defs>
        <linearGradient id="rf-gold" x1="0" y1="0" x2="140" y2="140" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#F6E4AA" />
          <stop offset="0.35" stopColor="#C9A35F" />
          <stop offset="0.6" stopColor="#F1DA9C" />
          <stop offset="1" stopColor="#A9844A" />
        </linearGradient>
      </defs>
    </svg>
  )
}

/** A gold line-drawing of an arcade, drawn on scroll between sections. */
export function ArcadeLine() {
  const n = 7
  const w = 600 / n
  let d = ''
  for (let i = 0; i < n; i++) {
    const x0 = i * w + 6
    const x1 = (i + 1) * w - 6
    const cx = (x0 + x1) / 2
    d += `M${x0} 70V40C${x0} 24 ${cx - 18} 14 ${cx} 6C${cx + 18} 14 ${x1} 24 ${x1} 40V70`
  }
  return (
    <svg className="arcade-line" viewBox="0 0 600 76" aria-hidden="true" focusable="false">
      <path d={d} fill="none" stroke="url(#rf-gold-wide)" strokeWidth="1.2" className="rf-draw" />
      <path d="M0 73H600" stroke="#C9A35F" strokeWidth="0.8" className="rf-draw" />
      <defs>
        <linearGradient id="rf-gold-wide" x1="0" y1="0" x2="600" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#C9A35F" stopOpacity="0" />
          <stop offset="0.2" stopColor="#E9D08F" />
          <stop offset="0.5" stopColor="#F6E4AA" />
          <stop offset="0.8" stopColor="#E9D08F" />
          <stop offset="1" stopColor="#C9A35F" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  )
}
