/** Seal medallion with monogram, and the silk tassel hanging from it. Original drawing. */
export function Tassel() {
  const threads = Array.from({ length: 15 }, (_, i) => 22 + i * 2.6)
  return (
    <svg className="tassel-svg" viewBox="0 0 84 190" aria-hidden="true" focusable="false">
      {/* Medallion: 8-point star seal. */}
      <g transform="translate(42 30)">
        <rect x="-22" y="-22" width="44" height="44" fill="url(#gold)" />
        <rect x="-22" y="-22" width="44" height="44" fill="url(#gold)" transform="rotate(45)" />
        <circle r="21" fill="#F7EEDC" stroke="url(#gold)" strokeWidth="1.4" />
        <circle r="17" fill="none" stroke="url(#gold)" strokeWidth="0.6" />
        <text y="5.5" textAnchor="middle" className="tassel-mono" fill="#8C6B3A">
          A&amp;M
        </text>
      </g>
      {/* Cord loop to the tassel head. */}
      <path d="M42 52V72" stroke="url(#gold-v)" strokeWidth="2.2" />
      {/* Head and band. */}
      <path d="M33 86C33 74 37 70 42 70C47 70 51 74 51 86Z" fill="url(#silk)" />
      <rect x="30" y="85" width="24" height="9" rx="2" fill="url(#gold)" />
      <path d="M30 89.5H54" stroke="#7E5F33" strokeWidth="0.5" opacity="0.7" />
      {/* Skirt of silk threads. */}
      <path d="M31 94H53L60 176C52 182 32 182 24 176Z" fill="url(#silk)" />
      {threads.map((x, i) => (
        <path key={i} d={`M${31 + (x - 22) * 0.6} 95L${x} 177`} stroke="#B49863" strokeWidth="0.45" opacity="0.6" />
      ))}
      <path d="M31 94H53L60 176C52 182 32 182 24 176Z" fill="none" stroke="#A58A55" strokeWidth="0.5" opacity="0.5" />
    </svg>
  )
}
