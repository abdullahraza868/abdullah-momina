/**
 * Reads an optional ?guest= value and returns a safe display name.
 * The value is untrusted: we strip anything that is not a letter, mark,
 * space or a small set of name punctuation, collapse whitespace and cap
 * the length. React escapes the output, so this is about tidiness and
 * preventing abuse (e.g. long spam strings or URLs in a shared link).
 */
const MAX_LEN = 40

export function sanitizeGuestName(raw: string | null | undefined): string | null {
  if (!raw) return null
  let value = raw.normalize('NFC')
  // Drop anything tag-like or link-like entirely rather than leaving fragments.
  value = value.replace(/<[^>]*>?/g, ' ').replace(/\b(?:https?:\/\/|www\.)\S*/gi, ' ')
  // Letters and combining marks in any script, plus spaces and . ' - &
  value = value.replace(/[^\p{L}\p{M}\s.'’\-&]/gu, '')
  value = value.replace(/\s+/g, ' ').trim()
  if (value.length > MAX_LEN) value = value.slice(0, MAX_LEN).trim()
  return value.length >= 2 ? value : null
}

export function readGuestFromUrl(search: string = window.location.search): string | null {
  try {
    return sanitizeGuestName(new URLSearchParams(search).get('guest'))
  } catch {
    return null
  }
}
