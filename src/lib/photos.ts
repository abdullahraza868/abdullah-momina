import hero1200 from '../assets/photos/hero-1200.webp'
import hero720 from '../assets/photos/hero-720.webp'
import night1600 from '../assets/photos/night-1600.webp'
import night900 from '../assets/photos/night-900.webp'
import dome840 from '../assets/photos/dome-840.webp'
import umbrella1200 from '../assets/photos/umbrella-1200.webp'
import aerial1400 from '../assets/photos/aerial-1400.webp'

export const photos = {
  hero: { src: hero1200, srcSet: `${hero720} 720w, ${hero1200} 1200w` },
  night: { src: night1600, srcSet: `${night900} 900w, ${night1600} 1600w` },
  dome: { src: dome840, srcSet: `${dome840} 840w` },
  umbrella: { src: umbrella1200, srcSet: `${umbrella1200} 1200w` },
  aerial: { src: aerial1400, srcSet: `${aerial1400} 1400w` },
} as const
