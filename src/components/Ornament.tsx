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
