/**
 * The couple, seen from behind, standing hand in hand in the courtyard.
 * Groom: ivory sherwani and turban. Bride: deep-rose lehenga, sheer dupatta
 * over her head. Drawn in the same 400×800 frame as the backdrop so it lines
 * up under `preserveAspectRatio="xMidYMid slice"`. Decorative (aria-hidden).
 */
export function Couple({ placement = 'translate(196 588) scale(0.84) translate(-203 -745)' }: { placement?: string }) {
  return (
    <svg className="couple-art" viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="cp-sherwani" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#FBF3E3" />
          <stop offset="0.55" stopColor="#EADBC0" />
          <stop offset="1" stopColor="#C9B28C" />
        </linearGradient>
        <linearGradient id="cp-turban" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F6E6C3" />
          <stop offset="1" stopColor="#C8A86E" />
        </linearGradient>
        <linearGradient id="cp-lehenga" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#B05A66" />
          <stop offset="0.5" stopColor="#8E3B49" />
          <stop offset="1" stopColor="#62232F" />
        </linearGradient>
        <linearGradient id="cp-dupatta" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#E8B7A6" stopOpacity="0.92" />
          <stop offset="1" stopColor="#B86F70" stopOpacity="0.85" />
        </linearGradient>
        <linearGradient id="cp-skin" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#D9A57E" />
          <stop offset="1" stopColor="#A9734F" />
        </linearGradient>
        <filter id="cp-blur" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.4" />
        </filter>
        <filter id="cp-reflect-blur" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="1.6" />
        </filter>
        <linearGradient id="cp-reflect-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id="cp-reflect-mask" maskUnits="userSpaceOnUse" x="0" y="745" width="400" height="400">
          <rect x="0" y="745" width="400" height="220" fill="url(#cp-reflect-fade)" />
        </mask>
      </defs>

      <g transform={placement}>
      {/* Reflection on the wet marble. */}
      <g mask="url(#cp-reflect-mask)" filter="url(#cp-reflect-blur)" opacity="0.6">
        <use href="#cp-figures" transform="translate(0 1490) scale(1 -1)" />
      </g>
      <ellipse cx="203" cy="744" rx="54" ry="4.5" fill="#2A2018" opacity="0.35" filter="url(#cp-blur)" />
      <g id="cp-figures">

      {/* ---------- Groom ---------- */}
      <g className="cp-groom">
        {/* churidar legs and khussa */}
        <path d="M166 694L168 739H177L178 694Z" fill="#EADFCB" />
        <path d="M180 694L181 739H190L191 694Z" fill="#DCCDB2" />
        <path d="M165 738Q171 744 179 741L178 737H167Z" fill="#B48A4C" />
        <path d="M179 738Q186 744 193 741L191 737H181Z" fill="#9C7640" />
        {/* left arm (hanging) */}
        <path d="M157 596C151 616 150 642 152 670C153 676 160 677 161 670C162 646 163 622 165 602Z" fill="url(#cp-sherwani)" />
        <ellipse cx="156.5" cy="673" rx="4.2" ry="5.5" fill="url(#cp-skin)" />
        {/* sherwani body */}
        <path
          d="M160 592C164 586 172 583 179 583C186 583 194 586 198 592L200 640C201 660 203 680 204 698L156 698C157 680 158 660 159 640Z"
          fill="url(#cp-sherwani)"
        />
        {/* back seam, side slits, gold hem and collar */}
        <path d="M179 590V698" stroke="#C8AE80" strokeWidth="0.7" opacity="0.7" />
        <path d="M158 670L160 698M202 670L200 698" stroke="#BFA373" strokeWidth="0.6" opacity="0.7" />
        <path d="M156 693L204 693L204 698L156 698Z" fill="#C9A35F" opacity="0.85" />
        <path d="M157.5 695.5H202.5" stroke="#F3DFA9" strokeWidth="0.6" strokeDasharray="1.5 2" />
        <path d="M172 584Q179 588 186 584L186 581Q179 584 172 581Z" fill="#C9A35F" />
        {/* right arm reaching to the bride */}
        <path d="M197 596C202 612 206 632 209 654C210 660 203 663 201 657C198 638 194 618 191 604Z" fill="url(#cp-sherwani)" />
        {/* neck and head */}
        <rect x="174" y="572" width="10" height="12" rx="3" fill="url(#cp-skin)" />
        <path d="M170 570C170 577 174 580 179 580C184 580 188 577 188 570Z" fill="#3A2B21" />
        <ellipse cx="168.4" cy="573.5" rx="1.7" ry="2.6" fill="#C08B63" />
        <ellipse cx="189.6" cy="573.5" rx="1.7" ry="2.6" fill="#B07C56" />
        {/* turban (pagri) with hanging tail */}
        <path d="M167 572C164.5 556 171 545 179.5 545C188 545 194 556 191.5 572C188 575.5 171 575.5 167 572Z" fill="url(#cp-turban)" />
        <path d="M168 556Q179 550 191 556M167.5 561Q179 555 191.5 561M167.5 566Q179 560.5 191.5 566" stroke="#B4914F" strokeWidth="0.6" fill="none" />
        <path d="M184 562C188 576 189 592 187 610L183 610C184 594 183 578 180 564Z" fill="url(#cp-turban)" opacity="0.95" />
        <path d="M183 608H187.5V612H182.5Z" fill="#C9A35F" />
        {/* rim light from the low sun */}
        <path d="M160 594L158 650L156 698" stroke="#FFF3D2" strokeWidth="0.9" opacity="0.7" fill="none" />
      </g>

      {/* ---------- Bride ---------- */}
      <g className="cp-bride">
        {/* lehenga */}
        <path d="M212 640C220 636 236 636 244 640C252 670 264 704 274 742C250 750 214 750 190 742C198 706 206 672 212 640Z" fill="url(#cp-lehenga)" />
        {/* pleats */}
        <path d="M218 642L208 744M226 641L222 747M234 641L238 747M241 642L254 745" stroke="#5B1F2A" strokeWidth="0.6" opacity="0.45" />
        {/* embroidered hem */}
        <path d="M193 732C214 739 250 739 271 732L274 742C250 750 214 750 190 742Z" fill="#C9A35F" />
        <path d="M193 736.5C214 743 250 743 272 736.5" stroke="#F3DFA9" strokeWidth="0.7" strokeDasharray="1.2 2.2" fill="none" />
        {/* bodice */}
        <path d="M214 600C218 594 236 594 240 600L244 641C236 637 220 637 212 641Z" fill="#8E3B49" />
        {/* left arm reaching to the groom */}
        <path d="M216 602C212 620 210 640 208 656C207 663 215 664 216 658C218 640 221 622 224 608Z" fill="#9A4553" />
        <circle cx="206.5" cy="660" r="4.6" fill="url(#cp-skin)" />
        {/* head */}
        {/* dupatta over head and down the back */}
        <path
          d="M215 574C214 558 220 551 227 551C235 551 241 559 240 574C246 588 250 610 248 636C240 640 216 640 207 634C206 610 209 588 215 574Z"
          fill="url(#cp-dupatta)"
        />
        <path d="M215 574C214 558 220 551 227 551C235 551 241 559 240 574" stroke="#E6C27A" strokeWidth="1.1" fill="none" />
        <path d="M207 634C216 640 240 640 248 636" stroke="#E6C27A" strokeWidth="1.2" fill="none" />
        <path d="M209 632C218 637 238 637 246.5 633" stroke="#F6E2AE" strokeWidth="0.7" strokeDasharray="1 2" fill="none" />
        {/* trailing end of the dupatta, which sways */}
        <g className="cp-dupatta-tail">
          <path d="M244 600C254 626 262 662 268 700C271 720 278 734 286 742C276 745 266 742 262 736C256 708 250 670 240 628Z" fill="url(#cp-dupatta)" opacity="0.88" />
          <path d="M244 600C254 626 262 662 268 700C271 720 278 734 286 742" stroke="#E6C27A" strokeWidth="1" fill="none" />
        </g>
        {/* rim light */}
        <path d="M215 576C210 592 208 612 207 634" stroke="#FFF1D6" strokeWidth="0.9" opacity="0.65" fill="none" />
      </g>
      </g>
      </g>
    </svg>
  )
}

/** A few birds drifting across the sky. Each bird flaps via CSS. */
export function Birds() {
  return (
    <div className="birds" aria-hidden="true">
      {[0, 1, 2, 3].map((i) => (
        <span key={i} className={`bird bird--${i}`}>
          <svg viewBox="0 0 24 10">
            <path d="M0 4Q6 0 12 6Q18 0 24 4Q18 2 12 8Q6 2 0 4Z" fill="currentColor" />
          </svg>
        </span>
      ))}
    </div>
  )
}
