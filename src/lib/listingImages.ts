import type { Listing } from '../types'

const normalizeImageUrl = (value: string) => {
  const trimmedValue = String(value ?? '').trim()

  if (!trimmedValue) {
    return ''
  }

  const withProtocol = trimmedValue.startsWith('//') ? `https:${trimmedValue}` : trimmedValue
  const httpsPreferred = withProtocol.replace(/^http:\/\//i, 'https://')

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