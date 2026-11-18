"""Crops and colour-grades the Wikimedia Commons photos (see src/config/credits.ts)
from scripts/photo-sources/*_raw.webp into src/assets/photos/*.webp."""
import os
from PIL import Image, ImageEnhance
HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, 'photo-sources')
OUT = os.path.join(os.path.dirname(HERE), 'src', 'assets', 'photos')
os.makedirs(OUT, exist_ok=True)

def warm(im, r=1.04, b=0.96):
    rr, gg, bb = im.split()
    rr = rr.point(lambda v: min(255, int(v * r)))
    bb = bb.point(lambda v: int(v * b))
    return Image.merge('RGB', (rr, gg, bb))

def grade(im, warmth=(1.04, 0.96), contrast=1.06, sat=1.06, bright=1.0):
    im = warm(im.convert('RGB'), *warmth)
    im = ImageEnhance.Contrast(im).enhance(contrast)
    im = ImageEnhance.Color(im).enhance(sat)
    return ImageEnhance.Brightness(im).enhance(bright)

def save(im, name, q, widths):
    for w in widths:
        x = im if im.width <= w else im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
        p = os.path.join(OUT, f'{name}-{w}.webp')
        x.save(p, 'WEBP', quality=q, method=6)
        print(p, x.size, os.path.getsize(p) // 1024, 'KB')

src = lambda n: Image.open(os.path.join(SRC, f'{n}_raw.webp'))

save(grade(src('hero'), (1.05, 0.95), 1.08, 1.08), 'hero', 78, (1200, 720))
save(grade(src('night'), (1.02, 0.97), 1.05, 1.0), 'night', 74, (1600, 900))
pano = src('pano').crop((1120, 0, 1960, 475))
save(grade(pano, (1.05, 0.95), 1.05, 1.08), 'dome', 82, (840,))
um = src('umbrella')
save(grade(um, (1.05, 0.95), 1.04, 1.0), 'umbrella', 76, (1200,))
save(grade(src('aerial'), (1.05, 0.95), 1.06, 1.06), 'aerial', 76, (1400,))
