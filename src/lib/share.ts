import { wedding } from '../config/wedding'

/** The link guests share: the current page without the personal ?guest= value. */
export function shareUrl(): string {
  const url = new URL(window.location.href)
  url.searchParams.delete('guest')
  url.hash = ''
  return url.toString()
}

export function shareText(): string {
  return `You are warmly invited to the Nikkah and Reception of ${wedding.groom.name} & ${wedding.bride.name}, 18–19 December 2026, Madinah.`
}

export function whatsappShareHref(): string {
  return `https://wa.me/?text=${encodeURIComponent(`${shareText()}\n${shareUrl()}`)}`
}

export function whatsappContactHref(): string {
  return `https://wa.me/${wedding.contact.e164}`
}

export function canNativeShare(): boolean {
  return typeof navigator !== 'undefined' && typeof navigator.share === 'function'
}

export async function nativeShare(): Promise<'shared' | 'cancelled' | 'unsupported'> {
  if (!canNativeShare()) return 'unsupported'
  try {
    await navigator.share({ title: `${wedding.groom.shortName} & ${wedding.bride.shortName}`, text: shareText(), url: shareUrl() })
    return 'shared'
  } catch {
    return 'cancelled'
  }
}

export async function copyLink(): Promise<boolean> {
  const text = shareUrl()
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    /* fall through to legacy path */
  }
  try {
    const ta = document.createElement('textarea')
    ta.value = text
    ta.setAttribute('readonly', '')
    ta.style.position = 'fixed'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    const ok = document.execCommand('copy')
    ta.remove()
    return ok
  } catch {
    return false
  }
}
