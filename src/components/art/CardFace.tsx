import { archPath, Star8 } from './Defs'
import { CornerArt } from '../Ornament'

/**
 * The closed gatefold, drawn as one 400×800 artwork. Each door renders this
 * same face and clips its half, so the seam falls exactly down the centre.
 * Decorative only (aria-hidden); the accessible controls are the seal and the
 * "Open invitation" button.
 */
export function CardFace() {
  const outer = archPath(58, 342, 300, 92, 742)
  const inner = archPath(70, 330, 304, 112, 730)
  return (
    <svg className="card-face" viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="cf-foil" x1="0" y1="0" x2="1" y2="0.3">
          <stop offset="0" stopColor="#8C6B3A" />
          <stop offset="0.3" stopColor="#C9A35F" />
          <stop offset="0.5" stopColor="#7E5F30" />
          <stop offset="0.72" stopColor="#B8924F" />
          <stop offset="1" stopColor="#6E5124" />
        </linearGradient>
        <radialGradient id="cf-panel" cx="0.5" cy="0.42" r="0.62">
          <stop offset="0" stopColor="#FFFDF7" />
          <stop offset="1" stopColor="#F3EADA" />
        </radialGradient>
      </defs>
      <rect width="400" height="800" fill="url(#ivory)" />
      {/* Embossed khatam lattice. */}
      <rect width="400" height="800" fill="url(#khatam-dark)" opacity="0.5" transform="translate(0.7 0.8)" />
      <rect width="400" height="800" fill="url(#khatam-light)" opacity="0.95" transform="translate(-0.5 -0.6)" />

      {/* Royal frame: double rules and filigree corners. */}
      <rect x="16" y="16" width="368" height="768" fill="none" stroke="url(#gold)" strokeWidth="1.6" />
      <rect x="24" y="24" width="352" height="752" fill="none" stroke="url(#gold)" strokeWidth="0.6" opacity="0.75" />
      <CornerArt transform="translate(4.8 4.8) scale(0.7)" />
      <CornerArt transform="translate(395.2 4.8) scale(-0.7 0.7)" />
      <CornerArt transform="translate(4.8 795.2) scale(0.7 -0.7)" />
      <CornerArt transform="translate(395.2 795.2) scale(-0.7 -0.7)" />

      {/* Smooth arch panel pressed into the card. */}
      <path d={outer + ' Z'} fill="url(#cf-panel)" />
      <path d={outer} fill="none" stroke="#FFFDF7" strokeWidth="2" transform="translate(-0.8 -0.8)" opacity="0.9" />
      <path d={outer} fill="none" stroke="url(#gold)" strokeWidth="1.8" />
      <path d={inner} fill="none" stroke="url(#gold)" strokeWidth="0.7" opacity="0.8" />
      <Star8 cx={200} cy={66} r={8} />
      <circle cx="200" cy="66" r="17" fill="none" stroke="url(#gold)" strokeWidth="0.7" opacity="0.7" />

      <text x="200" y="182" textAnchor="middle" className="cf-arabic" fill="#8C6B3A">
        بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
      </text>
      <text x="200" y="232" textAnchor="middle" className="cf-caps" fill="#6B5B49">
        The wedding of
      </text>
      <text x="200" y="292" textAnchor="middle" className="cf-script" fill="url(#cf-foil)">
        Abdullah
      </text>
      <text x="200" y="322" textAnchor="middle" className="cf-amp" fill="#B08D57">
        &amp;
      </text>
      <text x="200" y="364" textAnchor="middle" className="cf-script" fill="url(#cf-foil)">
        Momina
      </text>

      <text x="200" y="626" textAnchor="middle" className="cf-caps" fill="#6B5B49">
        Nikkah &amp; Reception
      </text>
      <text x="200" y="660" textAnchor="middle" className="cf-date" fill="#3D3024">
        18 · 19 December 2026
      </text>
      <text x="200" y="690" textAnchor="middle" className="cf-serif" fill="#8C6B3A">
        Madinah al-Munawwarah
      </text>
      <path d="M150 710H190M210 710H250" stroke="#B08D57" strokeWidth="0.7" />
      <Star8 cx={200} cy={710} r={3.2} />
    </svg>
  )
}

/** Inside of each gatefold panel, seen only briefly while the doors swing. */
export function CardInside() {
  return (
    <svg className="card-face" viewBox="0 0 200 800" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <rect width="200" height="800" fill="#EFE5D2" />
      <rect width="200" height="800" fill="url(#khatam-gold)" opacity="0.12" />
      <rect x="10" y="10" width="180" height="780" fill="none" stroke="#B08D57" strokeWidth="0.8" opacity="0.6" />
    </svg>
  )
}
