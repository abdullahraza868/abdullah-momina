/** Deep maroon wax seal stamped with a gold A&M, and the silk tassel hanging from it. Original drawing. */
export function Tassel() {
  const threads = Array.from({ length: 15 }, (_, i) => 22 + i * 2.6)
  // Wax blob: a circle with a gently irregular, pressed edge.
  const blob = Array.from({ length: 24 }, (_, i) => {
    const a = (i / 24) * Math.PI * 2
    const r = 27 + Math.sin(i * 2.7) * 1.6 + Math.cos(i * 1.3) * 1.1
    return `${(42 + Math.cos(a) * r).toFixed(1)} ${(32 + Math.sin(a) * r).toFixed(1)}`
  })
  return (
    <svg className="tassel-svg" viewBox="0 0 84 200" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id="wax" cx="0.38" cy="0.32" r="0.75">
          <stop offset="0" stopColor="#B23A4B" />
          <stop offset="0.55" stopColor="#7A1E2C" />
          <stop offset="1" stopColor="#4A0E19" />
        </radialGradient>
        <linearGradient id="wax-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F6E4AA" />
          <stop offset="0.5" stopColor="#C9A35F" />
          <stop offset="1" stopColor="#F1DA9C" />
        </linearGradient>
      </defs>
      {/* Cord loop down to the tassel head. */}
      <path d="M42 56V80" stroke="#A9864F" strokeWidth="2.4" />
      <path d="M42 56V80" stroke="#EEDDB4" strokeWidth="0.8" strokeDasharray="1.6 1.6" />
      {/* Head and band. */}
      <path d="M33 94C33 82 37 78 42 78C47 78 51 82 51 94Z" fill="url(#silk)" />
      <rect x="30" y="93" width="24" height="9" rx="2" fill="url(#gold)" />
      <path d="M30 97.5H54" stroke="#7E5F33" strokeWidth="0.5" opacity="0.7" />
      {/* Skirt of silk threads. */}
      <path d="M31 102H53L60 186C52 192 32 192 24 186Z" fill="url(#silk)" />
      {threads.map((x, i) => (
        <path key={i} d={`M${31 + (x - 22) * 0.6} 103L${x} 187`} stroke="#B49863" strokeWidth="0.45" opacity="0.6" />
      ))}
      {/* Wax seal. */}
      <path d={`M${blob.join('L')}Z`} fill="url(#wax)" />
      <circle cx="42" cy="32" r="20" fill="none" stroke="#5A1220" strokeWidth="1.4" opacity="0.6" />
      <circle cx="42" cy="32" r="19" fill="none" stroke="url(#wax-gold)" strokeWidth="1" />
      <circle cx="42" cy="32" r="15.5" fill="none" stroke="url(#wax-gold)" strokeWidth="0.5" strokeDasharray="1 1.6" />
      <text x="42" y="37.5" textAnchor="middle" className="tassel-mono" fill="url(#wax-gold)">
        A&amp;M
      </text>
      <ellipse cx="34" cy="20" rx="7" ry="3.5" fill="#fff" opacity="0.14" transform="rotate(-28 34 20)" />
    </svg>
  )
}
