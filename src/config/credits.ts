/**
 * Internal record only (not displayed on the site).
 * Photographs of Masjid an-Nabawi used on the site. The Pexels photos are
 * free to use under the Pexels licence (attribution appreciated, not required).
 * Cropped and colour-graded for this site (scripts/grade_photos.py).
 */
export interface PhotoCredit {
  id: string
  title: string
  author: string
  license: string
  licenseUrl: string | null
  source: string | null
}

export const photoCredits: PhotoCredit[] = [
  { id: 'hero', title: 'Masjid an-Nabawi courtyard', author: 'nfzzz', license: 'Pexels licence', licenseUrl: 'https://www.pexels.com/license/', source: 'https://www.pexels.com/photo/24284829/' },
  { id: 'domes', title: 'The Green Dome and minarets', author: 'Samet Kaplan', license: 'Pexels licence', licenseUrl: 'https://www.pexels.com/license/', source: 'https://www.pexels.com/photo/38498727/' },
  { id: 'lanterns', title: 'Lanterns and minaret at dusk', author: 'Earth Photart', license: 'Pexels licence', licenseUrl: 'https://www.pexels.com/license/', source: 'https://www.pexels.com/photo/35385107/' },
  { id: 'silhouette', title: 'Minaret at sunset', author: 'Kamera Yolcusu', license: 'Pexels licence', licenseUrl: 'https://www.pexels.com/license/', source: 'https://www.pexels.com/photo/39599259/' },
  { id: 'sunset', title: 'Masjid an-Nabawi at sunset', author: 'Supplied by the family', license: '', licenseUrl: null, source: null },
]

/** Background audio (internal record). */
export const audioCredit = {
  title: 'Bismillah Tere Naam Se Shuru',
  author: 'Kailash Kher (album: Azaan)',
  license: 'Supplied by the family',
  source: null,
}
