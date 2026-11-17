import { archPath, Star8 } from './Defs'

/**
 * Background artwork revealed when the gatefold opens: an ivory mehraab
 * framing a dusk sky over a soft, generic skyline, with a polished floor.
 * Text is rendered as HTML on top (see Gatefold) for accessibility.
 */
export function ArchScene() {
  const opening = archPath(74, 326, 330, 118, 660)
  const openingInset = archPath(86, 314, 334, 136, 660)
  const wall = `M0 0H400V660H0Z ${opening} Z`
  return (
    <svg className="arch-scene" viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="dusk" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#C9AE93" />
          <stop offset="0.3" stopColor="#E2C9AB" />
          <stop offset="0.6" stopColor="#F5DFBF" />
          <stop offset="0.74" stopColor="#F7DDB5" />
          <stop offset="1" stopColor="#EAD2AE" />
        </linearGradient>
        <radialGradient id="sun" cx="200" cy="585" r="250" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FFF8E7" stopOpacity="1" />
          <stop offset="0.12" stopColor="#FFF1D6" stopOpacity="1" />
          <stop offset="0.55" stopColor="#F2D7AE" stopOpacity="0.35" />
          <stop offset="1" stopColor="#F2D7AE" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#EADCC5" />
          <stop offset="1" stopColor="#D8C6A8" />
        </linearGradient>
        <linearGradient id="reflect" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFF6E3" stopOpacity="0.85" />
          <stop offset="1" stopColor="#FFF6E3" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="wall" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F8F2E6" />
          <stop offset="0.5" stopColor="#F2E9D8" />
          <stop offset="1" stopColor="#E9DDC7" />
        </linearGradient>
        <clipPath id="opening-clip">
          <path d={opening + ' Z'} />
        </clipPath>
      </defs>

      {/* Sky and light, seen through the arch. */}
      <g clipPath="url(#opening-clip)">
        <rect width="400" height="800" fill="url(#dusk)" />
        <rect width="400" height="800" fill="url(#sun)" />
        {/* Distant skyline: a dome and slender minarets, kept faint and generic. */}
        <g fill="#CBAE86" opacity="0.42" transform="translate(200 588) scale(0.72) translate(-200 -572)">
          <path d="M60 572V556H120V572Z" />
          <path d="M150 572V548C150 520 176 500 200 494C224 500 250 520 250 548V572Z" />
          <rect x="196" y="480" width="8" height="16" />
          <path d="M262 572V560H340V572Z" />
          <rect x="118" y="470" width="9" height="102" />
          <path d="M116 470L122.5 452L129 470Z" />
          <rect x="114" y="500" width="17" height="4" />
          <rect x="273" y="470" width="9" height="102" />
          <path d="M271 470L277.5 452L284 470Z" />
          <rect x="269" y="500" width="17" height="4" />
        </g>
        <rect x="0" y="588" width="400" height="80" fill="url(#floor)" />
        <path d="M170 588H230L280 660H120Z" fill="url(#reflect)" opacity="0.8" />
      </g>

      {/* Ivory wall with a faint gold khatam fretwork. */}
      <path d={wall} fill="url(#wall)" fillRule="evenodd" />
      <path d={wall} fill="url(#khatam-gold)" fillRule="evenodd" opacity="0.13" />
      <path d={wall} fill="url(#khatam-light)" fillRule="evenodd" opacity="0.6" transform="translate(-0.5 -0.5)" />

      {/* Arch mouldings. */}
      <path d={opening} fill="none" stroke="#FFFDF7" strokeWidth="3" transform="translate(-1 -1)" opacity="0.8" />
      <path d={opening} fill="none" stroke="url(#gold)" strokeWidth="2.4" />
      <path d={openingInset} fill="none" stroke="url(#gold)" strokeWidth="0.8" opacity="0.75" />
      <path d={archPath(58, 342, 326, 96, 660)} fill="none" stroke="url(#gold)" strokeWidth="0.9" opacity="0.7" />
      <Star8 cx={200} cy={72} r={8} />
      <Star8 cx={40} cy={150} r={5} opacity={0.75} />
      <Star8 cx={360} cy={150} r={5} opacity={0.75} />

      {/* Polished floor in front of the arch. */}
      <rect x="0" y="660" width="400" height="140" fill="url(#floor)" />
      <rect x="0" y="660" width="400" height="5" fill="url(#gold)" opacity="0.7" />
      <path d="M140 665H260L320 800H80Z" fill="url(#reflect)" opacity="0.55" />
      <path d="M0 720H400M0 770H400" stroke="#CDB894" strokeWidth="0.6" opacity="0.5" />
    </svg>
  )
}
