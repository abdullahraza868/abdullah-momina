import hero1200 from '../assets/photos/hero-1200.webp'
import hero720 from '../assets/photos/hero-720.webp'
import sunset1400 from '../assets/photos/sunset-1400.webp'
import sunset900 from '../assets/photos/sunset-900.webp'
import domes900 from '../assets/photos/domes-900.webp'
import lanterns900 from '../assets/photos/lanterns-900.webp'
import silhouette700 from '../assets/photos/silhouette-700.webp'
import lanternsTall700 from '../assets/photos/lanterns-tall-700.webp'
import domeTall700 from '../assets/photos/dome-tall-700.webp'

const one = (src: string, w: number) => ({ src, srcSet: `${src} ${w}w` })

export const photos = {
  hero: { src: hero1200, srcSet: `${hero720} 720w, ${hero1200} 1200w` },
  sunset: { src: sunset1400, srcSet: `${sunset900} 900w, ${sunset1400} 1400w` },
  domes: one(domes900, 900),
  lanterns: one(lanterns900, 900),
  silhouette: one(silhouette700, 700),
  lanternsTall: one(lanternsTall700, 700),
  domeTall: one(domeTall700, 700),
} as const
