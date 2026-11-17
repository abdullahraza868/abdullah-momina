import { archPath, Star8 } from './Defs'

/**
 * The closed gatefold, drawn as one 400×800 artwork. Each door renders this
 * same face and clips its half, so the seam falls exactly down the centre.
 * Decorative only (aria-hidden); the accessible control is the pull button.
 */
export function CardFace({ greeting }: { greeting: string }) {
  const outer = archPath(52, 348, 300, 92, 742)
  const inner = archPath(64, 336, 304, 112, 730)
  const greetSize = greeting.length > 28 ? 11 : 12.5
  return (
    <svg className="card-face" viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <rect width="400" height="800" fill="url(#ivory)" />
      {/* Embossed lattice: a light and a dark copy, offset to read as relief. */}
      <rect width="400" height="800" fill="url(#khatam-dark)" opacity="0.55" transform="translate(0.7 0.8)" />
      <rect width="400" height="800" fill="url(#khatam-light)" opacity="0.95" transform="translate(-0.5 -0.6)" />

      {/* Smooth arch panel pressed into the card. */}
      <path d={outer + ' Z'} fill="url(#ivory-glow)" />
      <path d={outer} fill="none" stroke="#FFFDF7" strokeWidth="2" transform="translate(-0.8 -0.8)" opacity="0.9" />
      <path d={outer} fill="none" stroke="url(#gold)" strokeWidth="1.6" />
      <path d={inner} fill="none" stroke="url(#gold)" strokeWidth="0.7" opacity="0.8" />
      <Star8 cx={200} cy={66} r={7} />
      <circle cx="200" cy="66" r="15" fill="none" stroke="url(#gold)" strokeWidth="0.6" opacity="0.7" />

      {/* Corner stars. */}
      {[
        [26, 26],
        [374, 26],
        [26, 774],
        [374, 774],
      ].map(([x, y]) => (
        <Star8 key={`${x}-${y}`} cx={x} cy={y} r={4.5} opacity={0.85} />
      ))}
      <rect x="12" y="12" width="376" height="776" fill="none" stroke="url(#gold)" strokeWidth="0.6" opacity="0.55" />

      {/* Inside the arch: Bismillah, greeting and title. */}
      <text x="200" y="196" textAnchor="middle" className="cf-arabic" fill="#8C6B3A">
        بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
      </text>
      <text x="200" y="262" textAnchor="middle" className="cf-caps" fill="#6B5B49" style={{ fontSize: greetSize }}>
        {greeting}
      </text>
      <text x="200" y="318" textAnchor="middle" className="cf-script" fill="#8C6B3A">
        You are invited
      </text>
      <text x="200" y="352" textAnchor="middle" className="cf-serif" fill="#6B5B49">
        to the Nikkah &amp; Reception of
      </text>

      <text x="200" y="656" textAnchor="middle" className="cf-names" fill="#3D3024">
        Abdullah <tspan fill="#B08D57">&amp;</tspan> Momina
      </text>
      <text x="200" y="686" textAnchor="middle" className="cf-caps" fill="#6B5B49" style={{ fontSize: 11, letterSpacing: '0.16em' }}>
        18 · 19 December 2026 · Madinah
      </text>
      <path d="M150 708H250" stroke="#B08D57" strokeWidth="0.7" />
      <Star8 cx={200} cy={708} r={3} />
    </svg>
  )
}

/** Inside of each gatefold panel, seen only briefly while the doors swing. */
export function CardInside() {
  return (
    <svg className="card-face" viewBox="0 0 200 800" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <rect width="200" height="800" fill="#EFE5D2" />
      <rect width="200" height="800" fill="url(#khatam-gold)" opacity="0.12" />
      <rect x="10" y="10" width="180" height="780" fill="none" stroke="url(#gold)" strokeWidth="0.8" opacity="0.6" />
    </svg>
  )
}
