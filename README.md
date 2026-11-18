# Abdullah & Momina — Digital Wedding Invitation

An interactive invitation for the Nikkah and Reception of **Abdullah Raza** and **Momina Ashraf**, Madinah, 18–19 December 2026.

The invitation *is* the site. Guests receive a closed ivory gatefold card. They pull the silk tassel (or tap it, or press Enter/Space/↓), and the two panels swing open onto a dusk mehraab with the couple's names. The story continues below with the events, a countdown, a remembrance, RSVP and sharing.

Creative reference: Bulawa Studio, "Mehraab / The Arch". It was used for the interaction idea only (pull a tassel, open a gatefold onto an arch). All artwork here is original vector work: an 8-point-star (khatam) lattice, a pointed arch, and a seal and tassel. No assets, branding or code were taken from the reference.

## Quick start

```bash
npm install
npm run dev            # http://localhost:5173
npm run build          # static site → dist/
npm run preview        # serve dist/ locally
npm run build:single   # one self-contained HTML file → dist-single/ (for private previews)
```

Requires Node 20+.

## Where things live

| What | File |
| --- | --- |
| **Every wedding fact** (names, dates, venues, contact, remembrance text, RSVP-by date, audio path) | `src/config/wedding.ts` |
| Closed card artwork | `src/components/art/CardFace.tsx` |
| Revealed arch scene | `src/components/art/ArchScene.tsx` |
| Seal + tassel | `src/components/art/Tassel.tsx` |
| Opening interaction + choreography | `src/components/Gatefold.tsx` |
| Content sections (invitation, events, countdown, remembrance, closing) | `src/components/Sections.tsx` |
| RSVP form | `src/components/Rsvp.tsx` |
| RSVP integration boundary (the only file that talks to the backend) | `src/lib/rsvp.ts` |
| Google Apps Script backend | `apps-script/Code.gs` |
| Styles | `src/styles.css` |

## Still needed before sending

1. **Reception venue.** In `src/config/wedding.ts`, replace `venue: null` on the reception event with:
   ```ts
   venue: { name: 'Venue name', address: 'Street, district', mapUrl: 'https://maps.app.goo.gl/…' },
   ```
   Until then the card shows "Venue to be announced" and no map button.
2. ~~RSVP endpoint~~ **Done (18 Nov 2026).** Set in `.env.production`; tested live (save, duplicate ignored, invalid rejected).
3. **RSVP deadline.** `rsvpBy` is set to `2026-12-05` as a recommendation. Confirm it or change it (`null` hides the line).
4. **Nasheed (optional).** See "Audio" below.
5. **Copy check.** The invitation wording ("With the blessings of Allah ﷻ, together with our families…") lives in `src/components/Sections.tsx`. The closing line ("Please keep us in your duas") is in the same file. The bride's line reads "daughter of Muhammad Ashraf" exactly as in the brief. If the family would prefer "daughter of the late Muhammad Ashraf", change it in the same file.

## RSVP: Google Sheet + Apps Script

1. Create a new Google Sheet (for example "Wedding RSVPs").
2. **Extensions → Apps Script**. Delete the sample code and paste in all of `apps-script/Code.gs`. Save.
3. **Deploy → New deployment → Select type: Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Deploy, then approve the permissions prompt. It only asks for access to this spreadsheet.
4. Copy the **Web app URL** (it ends in `/exec`). Opening it in a browser should show `{"ok":true,"service":"wedding-rsvp"}`.
5. Create `.env.local` in the project root:
   ```
   VITE_RSVP_ENDPOINT=https://script.google.com/macros/s/XXXXXXXX/exec
   ```
   On a hosting provider, add the same variable in its environment settings. Then rebuild.
6. Send yourself a test RSVP. A row should appear in a tab named **RSVPs**. The header row is created automatically.

How it works:
- The browser POSTs JSON as `text/plain`. That avoids a CORS preflight, which Apps Script can't answer.
- Each reply gets a `submissionId`. Retries reuse the same ID, and the script ignores IDs it has already stored, so a flaky connection can't create duplicate rows. The submit button is also locked while a reply is sending, and a hidden honeypot field filters out simple bots.
- The server checks everything again (name length, attendance, adults + children = guests, guest cap). It also stores text that starts with `= + - @` as plain text, so nothing a guest types can run as a spreadsheet formula.
- After a successful reply, the guest sees a thank-you. On that device the thank-you stays after a reload, and a "Send another reply" button lets them reply again.
- **If you change `Code.gs` later**, go to Deploy → Manage deployments → Edit → Version: *New version*. That keeps the same URL.

## Photographs

The photographs of Masjid an-Nabawi were chosen by the family.
- Four come from Pexels: nfzzz, Samet Kaplan, Earth Photart and Kamera Yolcusu. The Pexels licence allows free use, and attribution is appreciated but not required.
- The sunset photo (`scripts/photo-sources/sunset.png`) was supplied by the family.

Sources are recorded in `src/config/credits.ts` (not shown on the site).

- The originals are stored in `scripts/photo-sources/`.
- `python3 scripts/grade_photos.py` crops and colour-grades them, then writes the web versions to `src/assets/photos/`. For the opening scene, it applies a blue-hour grade (deep navy sky, warm horizon) and gently smooths sensor grain.

The couple in the opening scene is an original illustration (`src/components/art/Couple.tsx`).

## Personal links

`https://your-site/?guest=Ahmed` changes the greeting to "Dear Ahmed" and pre-fills the RSVP name. The value is treated as untrusted:
- Tags and URLs are dropped.
- Only letters (in any script), spaces and `. ' - &` are kept.
- It's capped at 40 characters, and React escapes it when rendering.

The personal name appears above the closed card as "An invitation for Ahmed". Without `?guest`, it reads "You are cordially invited".

For WhatsApp, encode spaces: `?guest=Ahmed%20Khan` (most phones do this automatically). Later you could swap the name for an opaque ID (`?g=7f3a`) looked up in a small map, so the code is ready for that.

## Audio (background nasheed)

`public/audio/nasheed.mp3` is **"Bismillah Tere Naam Se Shuru"** (Kailash Kher, from the album *Azaan*), supplied by the family.
- It starts at 0:49 of the original track.
- It was re-encoded at 96 kbps with a 2.5-second fade-in and 4-second fade-out, so the loop is seamless.
- It was normalised to a quiet level (−24 LUFS), and the player then fades it in to only about 28% volume.
- Playback starts from the guest's opening tap, seal tap or tassel pull, never on page load, and then loops.
- The gold button in the bottom-right corner pauses and resumes it, and it pauses automatically while the page is in the background.
- To change the track, replace the file and keep the same name. To change the loudness, edit `TARGET_VOLUME` in `src/lib/nasheed.ts`.

## Countdown and dates

- The Nikkah has no fixed clock time ("after Asr"). The countdown therefore runs to the **start of 18 December in Madinah** (`2026-12-18T00:00:00+03:00`, `Asia/Riyadh`, which has no daylight saving). On the day itself it shows "Alhamdulillah, the day has arrived."
- If an exact time is confirmed later, set `countdownTarget` in the config.
- Calendar dates are formatted in a timezone-independent way, so every guest sees "Friday 18 December" wherever they are. This was tested in Karachi, Riyadh, Los Angeles and Auckland time.

## Motion, accessibility and fallbacks

- **Opening:** CSS 3D panels driven by a GSAP timeline. The tassel is pulled, a seam of light appears, the panels swing about 104° on their outer hinges and shade as they turn, the arch scene settles from a slight zoom, and the lines are revealed in sequence. There's no WebGL, so nothing needs a WebGL fallback, and the experience is identical everywhere.
- **Input:** drag the tassel (more than 64px opens it; less springs back), tap it, or use the keyboard (Tab to the tassel, then Enter, Space or ↓).
- **`prefers-reduced-motion`:** the panels simply crossfade, and the idle tassel sway, breathing hint and scroll fade-ups are all switched off.
- **Accessibility:**
  - Semantic headings, with the revealed names as the `h1`. Focus moves to it after opening.
  - Visible focus rings, labelled form fields, inline error messages linked to their fields, and a live region announcing RSVP status.
  - The countdown has a text equivalent.
  - Page scroll is locked only while the card is closed.
- **No JavaScript:** a `<noscript>` block shows the essential event details.
- **Cleanup:** GSAP work happens inside `gsap.context()` and is reverted on unmount, and ScrollTrigger instances are reverted with their context. Intervals, pointer capture and audio are released.

## Deployment

It's a static site, so any static host works.

- **Vercel / Netlify / Cloudflare Pages:**
  - Build command: `npm run build`
  - Output directory: `dist`
  - Environment variable: `VITE_RSVP_ENDPOINT`
- Use HTTPS, which these hosts give by default.
- For good WhatsApp link previews, add a 1200×630 `public/og.jpg` and an `og:image` meta tag in `index.html` once the final artwork is approved.

## What was and wasn't tested

Tested (headless Chrome, mobile 390×844 and desktop 1440×900):
- Opening by drag, tap and keyboard, with focus landing on the names.
- Reduced motion.
- The no-audio path.
- The Maps link.
- Personal-greeting sanitising.
- Countdown and dates across time zones.
- RSVP validation, network error, server error, loading state, double-submit protection, success, and persistence after reload. This was against a mocked endpoint, not a live Google deployment.
- The single-file build under a strict content-security policy.

Not yet tested: real iOS Safari and Android Chrome devices, and a live Apps Script deployment. Please open the site on both phones before sending.
