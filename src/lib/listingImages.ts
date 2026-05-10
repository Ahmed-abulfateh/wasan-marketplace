import type { Listing } from '../types'

const normalizeImageUrl = (value: string) => {
  const trimmedValue = String(value ?? '').trim()

  if (!trimmedValue) {
    return ''
  }

  const compactValue = trimmedValue
    .replace(/^["']+|["']+$/g, '')
    .replace(/,+$/g, '')
    .replace(/\s+/g, '')
  const withProtocol = compactValue.startsWith('//') ? `https:${compactValue}` : compactValue
  const withHttpsForBareDomain = /^[a-z0-9.-]+\.[a-z]{2,}(?:\/|$)/i.test(withProtocol)
    ? `https://${withProtocol}`
    : withProtocol
  const httpsPreferred = withHttpsForBareDomain.replace(/^http:\/\//i, 'https://')

  try {
    const parsed = new URL(httpsPreferred)
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return ''
    }

    return parsed.toString()
  } catch {
    return ''
  }
}

const getListingImages = (listing: Pick<Listing, 'imageUrl' | 'imageUrls'>) => {
  const imageUrls = Array.isArray(listing.imageUrls)
    ? listing.imageUrls
      .map((value) => normalizeImageUrl(value))
      .filter(Boolean)
    : []

  if (imageUrls.length > 0) {
    return Array.from(new Set(imageUrls)).slice(0, 6)
  }

  const fallbackImageUrl = normalizeImageUrl(listing.imageUrl)

  return fallbackImageUrl ? [fallbackImageUrl] : []
}

export { getListingImages }