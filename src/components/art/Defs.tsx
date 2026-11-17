/**
 * Shared SVG definitions (patterns, gradients) rendered once, hidden.
 * Original artwork: an 8-point-star (khatam) lattice, pointed-arch frames
 * and gold gradients. Nothing here is derived from the reference's assets.
 */
export function ArtDefs() {
  return (
    <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: 'absolute' }}>
      <defs>
        {/* One 40×40 tile: two overlapping squares (8-point star) joined by a cross lattice. */}
        <g id="khatam-tile">
          <rect x="13" y="13" width="14" height="14" />
          <rect x="13" y="13" width="14" height="14" transform="rotate(45 20 20)" />
          <path d="M20 10.1V0M20 29.9V40M10.1 20H0M29.9 20H40" />
          <circle cx="20" cy="20" r="2.2" />
        </g>
        <pattern id="khatam-light" width="40" height="40" patternUnits="userSpaceOnUse">
          <use href="#khatam-tile" fill="none" stroke="#FFFDF6" strokeWidth="1.1" />
        </pattern>
        <pattern id="khatam-dark" width="40" height="40" patternUnits="userSpaceOnUse">
          <use href="#khatam-tile" fill="none" stroke="#CDBC9C" strokeWidth="1.1" />
        </pattern>
        <pattern id="khatam-gold" width="40" height="40" patternUnits="userSpaceOnUse">
          <use href="#khatam-tile" fill="none" stroke="#B08D57" strokeWidth="0.8" />
        </pattern>

        <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#D8BE86" />
          <stop offset="0.45" stopColor="#B08D57" />
          <stop offset="0.7" stopColor="#E3CC97" />
          <stop offset="1" stopColor="#8C6B3A" />
        </linearGradient>
        <linearGradient id="gold-v" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#E6D1A0" />
          <stop offset="0.5" stopColor="#B08D57" />
          <stop offset="1" stopColor="#7E5F33" />
        </linearGradient>
        <linearGradient id="ivory" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FAF5EB" />
          <stop offset="1" stopColor="#EFE5D2" />
        </linearGradient>
        <radialGradient id="ivory-glow" cx="0.5" cy="0.45" r="0.6">
          <stop offset="0" stopColor="#FFFCF5" />
          <stop offset="1" stopColor="#F1E7D4" />
        </radialGradient>
        <linearGradient id="silk" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#C9B07C" />
          <stop offset="0.35" stopColor="#F2E5C4" />
          <stop offset="0.6" stopColor="#E2CD9E" />
          <stop offset="1" stopColor="#B4975F" />
        </linearGradient>
      </defs>
    </svg>
  )
}

/** Pointed (two-centred) arch path, reused by card, scene and event cards. */
export function archPath(x0: number, x1: number, spring: number, apex: number, bottom: number): string {
  const cx = (x0 + x1) / 2
  const w = x1 - x0
  return [
    `M${x0} ${bottom}`,
    `V${spring}`,
    `C${x0} ${spring - (spring - apex) * 0.62} ${cx - w * 0.2} ${apex + (spring - apex) * 0.28} ${cx} ${apex}`,
    `C${cx + w * 0.2} ${apex + (spring - apex) * 0.28} ${x1} ${spring - (spring - apex) * 0.62} ${x1} ${spring}`,
    `V${bottom}`,
  ].join(' ')
}

/** Small 8-point star used as finials and dividers. */
export function Star8({ cx, cy, r, fill = 'url(#gold)', opacity = 1 }: { cx: number; cy: number; r: number; fill?: string; opacity?: number }) {
  const s = r * 1.414
  return (
    <g opacity={opacity}>
      <rect x={cx - r} y={cy - r} width={r * 2} height={r * 2} fill={fill} />
      <rect x={cx - r} y={cy - r} width={r * 2} height={r * 2} fill={fill} transform={`rotate(45 ${cx} ${cy})`} />
      <circle cx={cx} cy={cy} r={s * 0.32} fill="#FBF6EC" opacity="0.9" />
    </g>
  )
}
