/**
 * Photographs of Masjid an-Nabawi from Wikimedia Commons, used under their
 * free licences. Cropped and colour-graded for this site (scripts/grade_photos.py).
 * CC BY licences require this attribution to stay visible on the site.
 */
export interface PhotoCredit {
  id: 'hero' | 'night' | 'dome' | 'umbrella' | 'aerial'
  title: string
  author: string
  license: string
  licenseUrl: string | null
  source: string
}

export const photoCredits: PhotoCredit[] = [
  {
    id: 'hero',
    title: 'Masjid an-Nabawi at dusk',
    author: 'Wurzelgnohm',
    license: 'CC0',
    licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
    source: 'https://commons.wikimedia.org/wiki/File:MasjidNabawi.jpg',
  },
  {
    id: 'night',
    title: 'The Enlightened City',
    author: 'Omar Chatriwala',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0/',
    source: 'https://commons.wikimedia.org/wiki/File:The_Enlightened_City.jpg',
  },
  {
    id: 'dome',
    title: 'Madina Haram at evening',
    author: 'Ahmed Medineli',
    license: 'Public domain',
    licenseUrl: null,
    source: 'https://commons.wikimedia.org/wiki/File:Madina_Haram_at_evening.jpg',
  },
  {
    id: 'umbrella',
    title: 'Masjid Nabawi (Umroh Ramadhan 2023)-59',
    author: 'Indonesiagood',
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    source: 'https://commons.wikimedia.org/wiki/File:Masjid_Nabawi_(Umroh_Ramadhan_2023)-59.jpg',
  },
  {
    id: 'aerial',
    title: "Al-Masjid An-Nabawi (Bird's Eye View)",
    author: 'Konevi',
    license: 'CC0',
    licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
    source: "https://commons.wikimedia.org/wiki/File:Al-Masjid_An-Nabawi_(Bird%27s_Eye_View).jpg",
  },
]
