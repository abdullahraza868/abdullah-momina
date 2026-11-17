"""
Builds the revealed-scene backdrop: an original golden-hour illustration of
Masjid an-Nabawi (Green Dome, tiered minarets, lit arcade, courtyard umbrellas,
marble floor with reflections). Writes scripts/madinah-dusk.svg, then renders it
with headless Chrome to src/assets/madinah-dusk.webp.

Usage:  python3 scripts/build_scene.py [path-to-chrome]
Coordinates are in a 400 x 800 portrait frame (same as the card).
"""
import asyncio, io, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
SVG_OUT = os.path.join(HERE, 'madinah-dusk.svg')
WEBP_OUT = os.path.join(ROOT, 'src', 'assets', 'madinah-dusk.webp')

GROUND = 540      # base of the mosque facade
FACADE_TOP = 455


def minaret(x, top, s=1.0, far=False):
    """Tiered minaret: square base, three shafts with balconies, lantern, cap, crescent."""
    w = 13 * s
    h = FACADE_TOP - top
    y1 = FACADE_TOP - h * 0.36
    y2 = y1 - h * 0.30
    y3 = y2 - h * 0.17
    yl = y3 - h * 0.07
    g = 'url(#minaret)'
    out = [f'<g{" filter=\"url(#far)\" opacity=\".55\"" if far else ""}>']
    # base tower (rises from the roofline)
    out.append(f'<rect x="{x-w*0.95:.1f}" y="{FACADE_TOP-6}" width="{w*1.9:.1f}" height="{GROUND-FACADE_TOP+6}" fill="{g}"/>')
    # shafts
    for (ya, yb, k) in ((FACADE_TOP - 6, y1, 1.0), (y1, y2, 0.84), (y2, y3, 0.7)):
        out.append(f'<rect x="{x-w*k/2:.1f}" y="{yb:.1f}" width="{w*k:.1f}" height="{ya-yb:.1f}" fill="{g}"/>')
        # vertical fluting
        out.append(f'<path d="M{x-w*k*0.18:.1f} {yb+3:.1f}V{ya-2:.1f}M{x+w*k*0.18:.1f} {yb+3:.1f}V{ya-2:.1f}" stroke="#BFA27A" stroke-width=".35" opacity=".55"/>')
    # balconies with lights
    for (yb, k) in ((y1, 1.0), (y2, 0.84), (y3, 0.7)):
        bw = w * k * 1.55
        out.append(f'<rect x="{x-bw/2:.1f}" y="{yb-2.6:.1f}" width="{bw:.1f}" height="3.6" fill="#E9D5B0"/>')
        out.append(f'<rect x="{x-bw/2:.1f}" y="{yb+0.6:.1f}" width="{bw:.1f}" height="1.4" fill="#B99B6E"/>')
        out.append(f'<path d="M{x-bw/2+1:.1f} {yb-2.6:.1f}l{bw/2-1:.1f} 5 l{bw/2-1:.1f} -5" fill="#CDB38A" opacity=".5"/>')
        if not far:
            out.append(f'<circle cx="{x:.1f}" cy="{yb-4:.1f}" r="{2.2*s:.1f}" fill="#FFE2A0" filter="url(#glow)" opacity=".9"/>')
    # lantern, cap, finial
    lw = w * 0.56
    out.append(f'<rect x="{x-lw/2:.1f}" y="{yl:.1f}" width="{lw:.1f}" height="{y3-yl:.1f}" fill="{g}"/>')
    out.append(f'<path d="M{x-lw/2-1:.1f} {yl:.1f}C{x-lw/2:.1f} {yl-6*s:.1f} {x-1:.1f} {yl-9*s:.1f} {x:.1f} {yl-15*s:.1f}C{x+1:.1f} {yl-9*s:.1f} {x+lw/2:.1f} {yl-6*s:.1f} {x+lw/2+1:.1f} {yl:.1f}Z" fill="url(#silverDome)"/>')
    fy = yl - 15 * s
    out.append(f'<path d="M{x:.1f} {fy:.1f}V{fy-8*s:.1f}" stroke="url(#goldV)" stroke-width="{1.1*s:.1f}"/>')
    out.append(f'<circle cx="{x:.1f}" cy="{fy-3*s:.1f}" r="{1.4*s:.1f}" fill="#D9B86E"/>')
    cr = 3.4 * s
    out.append(f'<path d="M{x-cr:.1f} {fy-10*s:.1f}a{cr:.1f} {cr:.1f} 0 1 0 {cr*2:.1f} 0a{cr*0.78:.1f} {cr*0.78:.1f} 0 1 1 {-cr*2:.1f} 0Z" fill="#E2C27A"/>')
    out.append('</g>')
    return '\n'.join(out)


def umbrella(x, y=518, s=1.0):
    """The courtyard's open tensile umbrellas, seen from the front."""
    w = 40 * s
    pole_bottom = y + 70 * s
    hem = y + 12 * s
    scallops = 4
    seg = (2 * w) / scallops
    hem_path = ''.join(f'Q{x-w+seg*(i+0.5):.1f} {hem+5*s:.1f} {x-w+seg*(i+1):.1f} {hem:.1f}' for i in range(scallops))
    out = ['<g>']
    out.append(f'<rect x="{x-1.6*s:.1f}" y="{y:.1f}" width="{3.2*s:.1f}" height="{pole_bottom-y:.1f}" fill="url(#pole)"/>')
    out.append(f'<ellipse cx="{x:.1f}" cy="{pole_bottom:.1f}" rx="{5*s:.1f}" ry="{1.4*s:.1f}" fill="#B9A07A" opacity=".6"/>')
    # canopy: underside glow, then the fabric
    out.append(f'<path d="M{x-w:.1f} {hem:.1f}{hem_path}L{x:.1f} {y+4*s:.1f}Z" fill="url(#umbrellaUnder)"/>')
    out.append(f'<path d="M{x-w:.1f} {hem:.1f}Q{x-w*0.5:.1f} {y+2*s:.1f} {x:.1f} {y-4*s:.1f}Q{x+w*0.5:.1f} {y+2*s:.1f} {x+w:.1f} {hem:.1f}{"".join(f"Q{x+w-seg*(i+0.5):.1f} {hem+5*s:.1f} {x+w-seg*(i+1):.1f} {hem:.1f}" for i in range(scallops))}Z" fill="url(#umbrella)"/>')
    out.append(f'<path d="M{x:.1f} {y-4*s:.1f}V{hem+3*s:.1f}M{x-w*0.5:.1f} {y+3*s:.1f}L{x-w*0.5:.1f} {hem+4*s:.1f}M{x+w*0.5:.1f} {y+3*s:.1f}L{x+w*0.5:.1f} {hem+4*s:.1f}" stroke="#D8CCB8" stroke-width=".5" opacity=".8"/>')
    out.append(f'<circle cx="{x:.1f}" cy="{hem+2*s:.1f}" r="{3*s:.1f}" fill="#FFE4A8" filter="url(#glow)" opacity=".85"/>')
    out.append('</g>')
    return '\n'.join(out)


def arcade():
    """Facade: parapet, cornice, a row of glowing pointed arches and a central gate."""
    out = []
    out.append(f'<rect x="0" y="{FACADE_TOP}" width="400" height="{GROUND-FACADE_TOP}" fill="url(#facade)"/>')
    # parapet crenellation
    merlons = ''.join(f'<rect x="{i*8+1:.1f}" y="{FACADE_TOP-5}" width="5" height="5" fill="#E7D2AC"/>' for i in range(50))
    out.append(merlons)
    out.append(f'<rect x="0" y="{FACADE_TOP+5}" width="400" height="2.2" fill="#C9AC80" opacity=".8"/>')
    out.append(f'<rect x="0" y="{FACADE_TOP+12}" width="400" height="1" fill="#BFA176" opacity=".5"/>')
    # small upper windows
    for i in range(25):
        cx = 8 + i * 16
        out.append(f'<path d="M{cx-2.4:.1f} {FACADE_TOP+24}V{FACADE_TOP+18}Q{cx:.1f} {FACADE_TOP+14} {cx+2.4:.1f} {FACADE_TOP+18}V{FACADE_TOP+24}Z" fill="url(#archGlow)" opacity=".85"/>')
    # main arches
    for i in range(16):
        cx = 12.5 + i * 25
        if abs(cx - 200) < 20:
            continue
        top = FACADE_TOP + 34
        out.append(f'<path d="M{cx-8:.1f} {GROUND}V{top+8}C{cx-8:.1f} {top+2} {cx-3:.1f} {top-2} {cx:.1f} {top-5}C{cx+3:.1f} {top-2} {cx+8:.1f} {top+2} {cx+8:.1f} {top+8}V{GROUND}Z" fill="url(#archGlow)"/>')
        out.append(f'<path d="M{cx-9.5:.1f} {GROUND}V{top+8}C{cx-9.5:.1f} {top+1} {cx-3.5:.1f} {top-3.5} {cx:.1f} {top-7}C{cx+3.5:.1f} {top-3.5} {cx+9.5:.1f} {top+1} {cx+9.5:.1f} {top+8}V{GROUND}" fill="none" stroke="#C7A877" stroke-width=".8"/>')
        out.append(f'<rect x="{cx-12.5:.1f}" y="{top-9}" width="1.4" height="{GROUND-top+9}" fill="#D9C29C" opacity=".7"/>')
    # central gate
    gt = FACADE_TOP + 16
    out.append(f'<rect x="178" y="{gt-6}" width="44" height="{GROUND-gt+6}" fill="#E9D5B0"/>')
    out.append(f'<rect x="178" y="{gt-6}" width="44" height="{GROUND-gt+6}" fill="none" stroke="#C3A372" stroke-width=".8"/>')
    out.append(f'<path d="M187 {GROUND}V{gt+20}C187 {gt+8} 195 {gt+3} 200 {gt-1}C205 {gt+3} 213 {gt+8} 213 {gt+20}V{GROUND}Z" fill="url(#archGlow)"/>')
    out.append(f'<path d="M184.5 {GROUND}V{gt+20}C184.5 {gt+6} 194 {gt} 200 {gt-4}C206 {gt} 215.5 {gt+6} 215.5 {gt+20}V{GROUND}" fill="none" stroke="#B99A68" stroke-width="1"/>')
    for k in range(5):
        out.append(f'<rect x="{181+k*9:.1f}" y="{gt-11}" width="4.5" height="5" fill="#E7D2AC"/>')
    return '\n'.join(out)


def roof_domes():
    out = []
    for x in (36, 112, 138, 164, 300, 326, 352):
        out.append(f'<path d="M{x-10} {FACADE_TOP}A10 9 0 0 1 {x+10} {FACADE_TOP}Z" fill="url(#silverDome)"/>')
        out.append(f'<path d="M{x} {FACADE_TOP-9}V{FACADE_TOP-13}" stroke="#C9A866" stroke-width=".8"/>')
    return '\n'.join(out)


def green_dome():
    cx = 244
    drum_top = 414
    out = []
    # neighbouring silver dome on its drum
    out.append(f'<rect x="168" y="428" width="34" height="{FACADE_TOP-428}" fill="url(#drum)"/>')
    out.append(f'<path d="M166 429C166 410 176 401 185 397C194 401 204 410 204 429Z" fill="url(#silverDome)"/>')
    out.append('<path d="M185 397V389" stroke="url(#goldV)" stroke-width="1"/><path d="M182.4 386a2.6 2.6 0 1 0 5.2 0a2 2 0 1 1 -5.2 0Z" fill="#E2C27A"/>')
    # drum with small arched windows
    out.append(f'<rect x="{cx-30}" y="{drum_top}" width="60" height="{FACADE_TOP-drum_top}" fill="url(#drum)"/>')
    out.append(f'<rect x="{cx-33}" y="{drum_top-3}" width="66" height="4" fill="#E2CCA4"/>')
    for i in range(6):
        wx = cx - 25 + i * 10
        out.append(f'<path d="M{wx-2.2:.1f} {FACADE_TOP-6}V{drum_top+14}Q{wx:.1f} {drum_top+9} {wx+2.2:.1f} {drum_top+14}V{FACADE_TOP-6}Z" fill="url(#archGlow)" opacity=".9"/>')
    # the Green Dome: slightly pointed, ribbed
    d = f'M{cx-31} {drum_top-2}C{cx-31} {drum_top-30} {cx-16} {drum_top-48} {cx} {drum_top-56}C{cx+16} {drum_top-48} {cx+31} {drum_top-30} {cx+31} {drum_top-2}Z'
    out.append(f'<path d="{d}" fill="url(#greenDome)"/>')
    for k in (-20, -10, 0, 10, 20):
        out.append(f'<path d="M{cx+k*1.45:.1f} {drum_top-2}Q{cx+k*0.9:.1f} {drum_top-34} {cx} {drum_top-56}" fill="none" stroke="#1E4C38" stroke-width=".5" opacity=".55"/>')
    out.append(f'<path d="M{cx-22} {drum_top-30}Q{cx-14} {drum_top-48} {cx-2} {drum_top-54}" stroke="#9BD0B2" stroke-width="2" opacity=".35" fill="none"/>')
    fy = drum_top - 56
    out.append(f'<rect x="{cx-2.2}" y="{fy-7}" width="4.4" height="7" fill="#2E6F52"/>')
    out.append(f'<path d="M{cx} {fy-7}V{fy-20}" stroke="url(#goldV)" stroke-width="1.3"/>')
    out.append(f'<circle cx="{cx}" cy="{fy-11}" r="1.8" fill="#D9B86E"/>')
    out.append(f'<path d="M{cx-4.5} {fy-24}a4.5 4.5 0 1 0 9 0a3.5 3.5 0 1 1 -9 0Z" fill="#E6C67E"/>')
    return '\n'.join(out)


def floor():
    out = [f'<rect x="0" y="{GROUND}" width="400" height="{800-GROUND}" fill="url(#floor)"/>']
    vx, vy = 200, 470
    for i in range(-14, 15):
        bx = 200 + i * 46
        out.append(f'<path d="M{vx + (bx-vx)*((GROUND-vy)/(800-vy)):.1f} {GROUND}L{bx} 800" stroke="#C9B08A" stroke-width=".45" opacity=".45"/>')
    y = GROUND + 4
    step = 4
    while y < 800:
        out.append(f'<path d="M0 {y:.1f}H400" stroke="#C9B08A" stroke-width=".4" opacity=".35"/>')
        step *= 1.32
        y += step
    return '\n'.join(out)


def mosque_group():
    parts = []
    parts.append(minaret(122, 362, 0.65, far=True))
    parts.append(minaret(290, 358, 0.65, far=True))
    parts.append(roof_domes())
    parts.append(green_dome())
    parts.append(minaret(158, 350, 0.8))
    parts.append(minaret(326, 334, 0.85))
    parts.append(minaret(26, 278, 1.1))
    parts.append(minaret(72, 318, 0.95))
    parts.append(minaret(374, 278, 1.1))
    parts.append(arcade())
    return '\n'.join(parts)


def svg():
    mosque = mosque_group()
    umbrellas = '\n'.join(umbrella(x, 520, s) for x, s in ((36, 1.25), (120, 1.08), (280, 1.08), (364, 1.25)))
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 800" width="400" height="800">
<defs>
  <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#E9D6C2"/><stop offset=".25" stop-color="#F0DCC2"/>
    <stop offset=".45" stop-color="#F3D7B2"/><stop offset=".56" stop-color="#F7D4A0"/>
    <stop offset=".64" stop-color="#FBDCA6"/><stop offset="1" stop-color="#F3D9B0"/>
  </linearGradient>
  <radialGradient id="sun" cx="150" cy="430" r="320" gradientUnits="userSpaceOnUse">
    <stop offset="0" stop-color="#FFF9E8"/><stop offset=".08" stop-color="#FFF1CF" stop-opacity=".95"/>
    <stop offset=".3" stop-color="#F9CF8E" stop-opacity=".55"/><stop offset="1" stop-color="#F6D29A" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="haze" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#FFF4DD" stop-opacity="0"/><stop offset=".7" stop-color="#FFF1D6" stop-opacity=".55"/>
    <stop offset="1" stop-color="#FFF1D6" stop-opacity="0"/>
  </linearGradient>
  <linearGradient id="facade" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#F1DCB6"/><stop offset=".45" stop-color="#E9D0A6"/><stop offset="1" stop-color="#DCC096"/>
  </linearGradient>
  <radialGradient id="archGlow" cx=".5" cy=".75" r=".8">
    <stop offset="0" stop-color="#FFEFC6"/><stop offset=".55" stop-color="#F6CC83"/><stop offset="1" stop-color="#D99A55"/>
  </radialGradient>
  <linearGradient id="minaret" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#F7EAD1"/><stop offset=".5" stop-color="#E8D3AE"/><stop offset="1" stop-color="#CCB088"/>
  </linearGradient>
  <linearGradient id="drum" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#F3E1C0"/><stop offset="1" stop-color="#D7BC92"/>
  </linearGradient>
  <radialGradient id="greenDome" cx=".32" cy=".3" r=".9">
    <stop offset="0" stop-color="#6BB28F"/><stop offset=".45" stop-color="#33795A"/><stop offset="1" stop-color="#1D4A37"/>
  </radialGradient>
  <radialGradient id="silverDome" cx=".3" cy=".3" r=".9">
    <stop offset="0" stop-color="#FBF7F0"/><stop offset=".55" stop-color="#D9D2C5"/><stop offset="1" stop-color="#A9A194"/>
  </radialGradient>
  <linearGradient id="goldV" x1="0" y1="0" x2="0" y2="1" gradientUnits="userSpaceOnUse">
    <stop offset="0" stop-color="#F0D896"/><stop offset="1" stop-color="#A9844A"/>
  </linearGradient>
  <linearGradient id="umbrella" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#FFFDF8"/><stop offset="1" stop-color="#EDE3D2"/>
  </linearGradient>
  <linearGradient id="umbrellaUnder" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#F9DFA9"/><stop offset="1" stop-color="#E8C88F"/>
  </linearGradient>
  <linearGradient id="pole" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#E9DFCF"/><stop offset="1" stop-color="#BFB29C"/>
  </linearGradient>
  <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#EEDDBF"/><stop offset=".4" stop-color="#E6D2AE"/><stop offset="1" stop-color="#D3BB93"/>
  </linearGradient>
  <linearGradient id="reflectFade" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset=".55" stop-color="#fff" stop-opacity="0"/>
  </linearGradient>
  <radialGradient id="vignette" cx=".5" cy=".55" r=".75">
    <stop offset=".6" stop-color="#3D3024" stop-opacity="0"/><stop offset="1" stop-color="#3D3024" stop-opacity=".22"/>
  </radialGradient>
  <mask id="reflectMask"><rect x="0" y="{GROUND}" width="400" height="{800-GROUND}" fill="url(#reflectFade)"/></mask>
  <filter id="glow" x="-200%" y="-200%" width="500%" height="500%"><feGaussianBlur stdDeviation="2.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  <filter id="far"><feGaussianBlur stdDeviation=".7"/></filter>
  <filter id="soft"><feGaussianBlur stdDeviation="2.4"/></filter>
  <filter id="hazeBlur"><feGaussianBlur stdDeviation="6"/></filter>
</defs>

<rect width="400" height="800" fill="url(#sky)"/>
<rect width="400" height="800" fill="url(#sun)"/>
<circle cx="150" cy="430" r="19" fill="#FFFBF0" opacity=".98" filter="url(#soft)"/>
<!-- faint high clouds -->
<g fill="#FFF3DC" opacity=".5" filter="url(#hazeBlur)">
  <ellipse cx="90" cy="300" rx="90" ry="7"/><ellipse cx="300" cy="270" rx="110" ry="6"/><ellipse cx="220" cy="380" rx="120" ry="8"/>
</g>
<!-- distant city -->
<g fill="#E0C29C" opacity=".55" filter="url(#far)">
  <path d="M0 470V452H30V446H62V456H96V440H110V456H140V450H190V444H230V452H262V438H276V452H320V446H352V454H400V470Z"/>
</g>

<g id="mosque">
{mosque}
</g>
<rect x="0" y="{FACADE_TOP-40}" width="400" height="60" fill="url(#haze)" opacity=".55"/>

{floor()}
<!-- reflection of the mosque on polished marble -->
<g mask="url(#reflectMask)" opacity=".42" filter="url(#soft)">
  <use href="#mosque" transform="translate(0 {GROUND*2}) scale(1 -1)"/>
</g>
<ellipse cx="160" cy="{GROUND+16}" rx="150" ry="12" fill="#FFF0CF" opacity=".55" filter="url(#hazeBlur)"/>

{umbrellas}

<rect width="400" height="800" fill="url(#vignette)"/>
</svg>'''


async def render(chrome):
    from playwright.async_api import async_playwright
    from PIL import Image
    with open(SVG_OUT) as f:
        doc = f.read()
    html = f'<html><body style="margin:0;background:#000">{doc.replace("width=\"400\" height=\"800\"", "width=\"1080\" height=\"2160\"")}</body></html>'
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path=chrome)
        pg = await b.new_page(viewport={'width': 1080, 'height': 2160})
        await pg.set_content(html)
        await pg.wait_for_timeout(300)
        png = await pg.screenshot(clip={'x': 0, 'y': 0, 'width': 1080, 'height': 2160})
        await b.close()
    os.makedirs(os.path.dirname(WEBP_OUT), exist_ok=True)
    Image.open(io.BytesIO(png)).convert('RGB').save(WEBP_OUT, 'WEBP', quality=80, method=6)
    print('wrote', WEBP_OUT, os.path.getsize(WEBP_OUT) // 1024, 'KB')


if __name__ == '__main__':
    with open(SVG_OUT, 'w') as f:
        f.write(svg())
    asyncio.run(render(sys.argv[1] if len(sys.argv) > 1 else '/usr/bin/google-chrome'))
