import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { useMarketplace } from '../context/MarketplaceContext'
import { getListingImages } from '../lib/listingImages'
import type { Listing } from '../types'

type ListingCardProps = {
  listing: Listing
}

function ListingCard({ listing }: ListingCardProps) {
  const { copy, formatCurrency, translateCatalogText, translateListingStatus } = useLanguage()
  const { cartIds, favoriteIds, listingStatuses, toggleCart, toggleFavorite } =
    useMarketplace()

  const isFavorite = favoriteIds.includes(listing.id)
  const isInCart = cartIds.includes(listing.id)
  const currentStatus = listingStatuses[listing.id] ?? listing.status
  const listingImages = getListingImages(listing)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [failedImageIndexes, setFailedImageIndexes] = useState<number[]>([])

  useEffect(() => {
    setActiveImageIndex(0)
    setFailedImageIndexes([])
  }, [listing.id])

  const currentImageIndex = listingImages.findIndex((_, index) => index >= activeImageIndex && !failedImageIndexes.includes(index))
  const fallbackImageIndex = listingImages.findIndex((_, index) => !failedImageIndexes.includes(index))
  const resolvedImageIndex = currentImageIndex >= 0 ? currentImageIndex : fallbackImageIndex
  const activeImage = resolvedImageIndex >= 0 ? listingImages[resolvedImageIndex] : ''

  const handleImageError = () => {
    if (resolvedImageIndex < 0) {
      return
    }

    setFailedImageIndexes((current) => {
      if (current.includes(resolvedImageIndex)) {
        return current
      }

      return [...current, resolvedImageIndex]
    })
    setActiveImageIndex(resolvedImageIndex + 1)
  }

  return (
    <article className="listing-card">
      {activeImage ? (
        <div className="listing-image-stage">
          <img
            className="listing-image-media"
            src={activeImage}
            alt={translateCatalogText(listing.title)}
            loading="lazy"
            onError={handleImageError}
          />
          {listingImages.length > 1 ? (
            <div className="listing-image-dots" aria-hidden="true">
              {listingImages.map((imageUrl, index) => (
                <span
                  key={`${listing.id}-${imageUrl}`}
                  className={index === resolvedImageIndex ? 'listing-image-dot listing-image-dot-active' : 'listing-image-dot'}
                />
              ))}
            </div>
          ) : null}
        </div>
      ) : (
        <div className="listing-image-placeholder" aria-hidden="true" />
      )}
      <div className="listing-card-body">
        <div className="listing-topline">
          <p className="card-label">{translateCatalogText(listing.category)}</p>
          <span className="badge">{translateCatalogText(listing.trust)}</span>
        </div>
        <h3>
          <Link className="listing-link" to={`/browse/${listing.id}`}>
            {translateCatalogText(listing.title)}
          </Link>
        </h3>
        <p className="seller-name">{listing.seller}</p>
        <p>{translateCatalogText(listing.meta)}</p>
        <div className="listing-meta-grid">
          <span>{translateCatalogText(listing.shipping)}</span>
          <span>{copy.common.sellerScore(listing.reviewScore.toFixed(1))}</span>
          <span>{translateListingStatus(currentStatus)}</span>
        </div>
        <div className="listing-footer">
          <strong>{formatCurrency(listing.price)}</strong>
          <span>{copy.common.inStock(listing.inventory)}</span>
        </div>
        <div className="card-actions">
          <button type="button" className="button button-ghost" onClick={() => toggleFavorite(listing.id)}>
            {isFavorite ? copy.product.savedToFavorites : copy.common.save}
          </button>
          <button type="button" className="button button-secondary" onClick={() => toggleCart(listing.id)}>
            {isInCart ? copy.product.removeFromCart : copy.product.addToCart}
          </button>
        </div>
      </div>
    </article>
  )
}

export default ListingCard