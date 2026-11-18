"""Crops and colour-grades the photographs in scripts/photo-sources/ into
src/assets/photos/*.webp (see src/config/credits.ts for sources).

Usage: python3 scripts/grade_photos.py
"""
import os
import numpy as np
from PIL import Image, ImageEnhance, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, 'photo-sources')
OUT = os.path.join(os.path.dirname(HERE), 'src', 'assets', 'photos')
os.makedirs(OUT, exist_ok=True)
for f in os.listdir(OUT):
    os.remove(os.path.join(OUT, f))


def load(name):
    return Image.open(os.path.join(SRC, name)).convert('RGB')


def crop_frac(im, x0, y0, x1, y1):
    w, h = im.size
    return im.crop((int(x0 * w), int(y0 * h), int(x1 * w), int(y1 * h)))


def grade(im, warmth=(1.04, 0.96), contrast=1.05, sat=1.06):
    r, g, b = im.split()
    r = r.point(lambda v: min(255, int(v * warmth[0])))
    b = b.point(lambda v: int(v * warmth[1]))
    im = Image.merge('RGB', (r, g, b))
    im = ImageEnhance.Contrast(im).enhance(contrast)
    return ImageEnhance.Color(im).enhance(sat)


def golden_hour(im, strength=0.75, horizon=0.47):
    """Soft-light a vertical tint: deep blue-violet sky easing to peach at the horizon."""
    a = np.asarray(im).astype(np.float32) / 255
    h = a.shape[0]
    y = np.linspace(0, 1, h)[:, None]
    top, mid, low = np.array([0.2, 0.24, 0.42]), np.array([0.98, 0.72, 0.48]), np.array([0.8, 0.66, 0.52])
    t1 = np.clip(y / horizon, 0, 1)
    t2 = np.clip((y - horizon) / (1 - horizon), 0, 1)
    tint = np.where(y < horizon, top + (mid - top) * t1, mid + (low - mid) * t2)[:, None, :]
    sl = np.where(tint <= 0.5, a - (1 - 2 * tint) * a * (1 - a), a + (2 * tint - 1) * (np.sqrt(a) - a))
    out = a * (1 - strength) + sl * strength
    return Image.fromarray((np.clip(out, 0, 1) * 255).astype('uint8'))


def smooth_sky(im, until=0.55):
    """Soften sensor grain in the sky only, fading out towards the buildings."""
    blurred = im.filter(ImageFilter.GaussianBlur(2.2))
    w, h = im.size
    mask = Image.linear_gradient('L').resize((w, h))  # 0 at top → 255 at bottom
    mask = mask.point(lambda v: 0 if v < 255 * (until - 0.15) else (255 if v > 255 * until else int((v - 255 * (until - 0.15)) / (255 * 0.15) * 255)))
    return Image.composite(im, blurred, mask)


def save(im, name, q, widths):
    for w in widths:
        x = im if im.width <= w else im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
        p = os.path.join(OUT, f'{name}-{w}.webp')
        x.save(p, 'WEBP', quality=q, method=6)
        print(p, x.size, os.path.getsize(p) // 1024, 'KB')


# Opening scene: empty plaza, Green Dome, reflective marble (portrait 1:2).
plaza = load('plaza.jpg')
W, H = plaza.size
top = int(0.06 * H)
cw = (H - top) // 2
cx = int(0.42 * W)
hero = plaza.crop((cx - cw // 2, top, cx + cw // 2, H))
hero = smooth_sky(hero, 0.5)
hero = golden_hour(hero, 0.75, 0.5)
hero = ImageEnhance.Contrast(hero).enhance(1.06)
hero = ImageEnhance.Color(hero).enhance(1.08)
save(hero, 'hero', 72, (1200, 720))

# Full-bleed band: sunset with lit minarets.
save(grade(load('sunset.png'), (1.02, 0.98), 1.04, 1.04), 'sunset', 80, (1400, 900))

# Nikkah card window: the Green Dome and silver dome close-up (4:3).
save(grade(crop_frac(load('domes.jpg'), 0.2, 0.04, 0.92, 0.04 + 0.72 * 2576 / 1717 * 0.75)), 'domes', 80, (900,))

# Reception card window: lantern columns and minaret at dusk (4:3).
lan = load('lanterns.jpg')
save(grade(crop_frac(lan, 0.05, 0.24, 0.95, 0.24 + 0.9 * 1932 / 2576 * 0.75)), 'lanterns', 80, (900,))

# Gallery (portrait arches, 3:4.2).
sil = load('silhouette.jpg')
save(grade(crop_frac(sil, 0.024, 0.0, 0.976, 1.0), (1.03, 0.97)), 'silhouette', 78, (700,))
save(grade(crop_frac(lan, 0.12, 0.08, 0.88, 0.08 + 0.76 * 1932 / 2576 * 1.4)), 'lanterns-tall', 78, (700,))
save(grade(crop_frac(load('domes.jpg'), 0.52, 0.02, 0.96, 0.02 + 0.44 * 2576 / 1717 * 1.4)), 'dome-tall', 78, (700,))
