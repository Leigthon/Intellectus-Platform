import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import { useMarketplaceAddedBanner } from "../context/MarketplaceAddedBannerContext";
import {
  LISTINGS,
  formatPrice,
  CONTACT_EMAIL,
  BASKET_STORAGE_KEY,
  WISHLIST_STORAGE_KEY,
  readStoredIdList,
  ListingDetailModal,
} from "./Marketplace";

const interestMailto = (listing) => {
  const subject = encodeURIComponent(
    `Marketplace: ${listing.title} (${listing.id})`
  );
  const body = encodeURIComponent(
    `Hi,\n\nI'm interested in "${listing.title}" (${formatPrice(listing.price)}, ${listing.condition}).\nListing ID: ${listing.id}\n\n`
  );
  return `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
};

const MarketplaceWishlistPage = () => {
  const { showBasketAdded, showWishlistAdded } = useMarketplaceAddedBanner();
  const [wishlistIds, setWishlistIds] = useState(() =>
    readStoredIdList(WISHLIST_STORAGE_KEY)
  );
  const [basketIds, setBasketIds] = useState(() =>
    readStoredIdList(BASKET_STORAGE_KEY)
  );
  const basketIdsRef = useRef(basketIds);
  const wishlistIdsRef = useRef(wishlistIds);
  const [selectedListing, setSelectedListing] = useState(null);

  const wishlistItems = useMemo(() => {
    const map = new Map(LISTINGS.map((item) => [item.id, item]));
    return wishlistIds.map((id) => map.get(id)).filter(Boolean);
  }, [wishlistIds]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistIds));
  }, [wishlistIds]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(BASKET_STORAGE_KEY, JSON.stringify(basketIds));
  }, [basketIds]);

  useEffect(() => {
    basketIdsRef.current = basketIds;
  }, [basketIds]);
  useEffect(() => {
    wishlistIdsRef.current = wishlistIds;
  }, [wishlistIds]);

  const clearWishlist = () => setWishlistIds([]);
  const removeFromWishlist = (id) => {
    setWishlistIds((prev) => prev.filter((x) => x !== id));
  };
  const addToWishlist = (id) => {
    if (wishlistIdsRef.current.includes(id)) return;
    setWishlistIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
    showWishlistAdded();
  };
  const toggleWishlist = (id) => {
    const wasIn = wishlistIdsRef.current.includes(id);
    setWishlistIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
    if (!wasIn) showWishlistAdded();
  };
  const isInWishlist = (id) => wishlistIds.includes(id);
  const addToBasket = (id) => {
    if (basketIdsRef.current.includes(id)) return;
    setBasketIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
    showBasketAdded();
  };
  const toggleBasket = (id) => {
    const wasIn = basketIdsRef.current.includes(id);
    setBasketIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
    if (!wasIn) showBasketAdded();
  };
  const isInBasket = (id) => basketIds.includes(id);

  return (
    <div style={{ minHeight: "100vh", background: "#f3f4f6" }}>
      <Header />

      <section
        style={{
          padding: "88px 16px 24px",
          background: "#e1b3b3ff",
        }}
      >
        <div style={{ maxWidth: "1120px", margin: "0 auto" }}>
          <Link
            to="/marketplace"
            style={{
              fontSize: "14px",
              fontWeight: 700,
              color: "#c34838ff",
              textDecoration: "none",
            }}
          >
            ← Back to marketplace
          </Link>
        </div>
      </section>

      <section
        style={{
          padding: "0 16px 80px",
          background: "#e1b3b3ff",
        }}
      >
        <div style={{ maxWidth: "1120px", margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: "20px",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            <div>
              <span
                style={{
                  color: "#fa371dff",
                  fontWeight: 700,
                  fontSize: "12px",
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                }}
              >
                Your wishlist
              </span>
              <h1
                style={{
                  marginTop: "10px",
                  fontSize: "clamp(1.25rem, 4vw, 1.625rem)",
                  fontWeight: 800,
                  color: "#111827",
                }}
              >
                Saved textbooks ({wishlistItems.length})
              </h1>
            </div>
            {wishlistItems.length > 0 && (
              <button
                type="button"
                onClick={clearWishlist}
                style={{
                  border: "none",
                  background: "transparent",
                  textDecoration: "underline",
                  color: "#c34838ff",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Clear wishlist
              </button>
            )}
          </div>

          {wishlistItems.length === 0 ? (
            <div
              style={{
                borderRadius: "20px",
                border: "1px dashed rgba(237, 40, 40, 0.45)",
                background: "#ffffff",
                padding: "34px 24px",
                textAlign: "center",
              }}
            >
              <p style={{ margin: "0 0 16px", color: "#374151", fontSize: "15px" }}>
                Your wishlist is empty. Tap &quot;Add to wishlist&quot; on any listing to save it.
              </p>
              <Link
                to="/marketplace"
                style={{
                  display: "inline-block",
                  padding: "10px 20px",
                  borderRadius: "999px",
                  background: "linear-gradient(135deg, #dc2626, #b91c1c)",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "14px",
                  textDecoration: "none",
                }}
              >
                Browse textbooks
              </Link>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: "18px",
              }}
            >
              {wishlistItems.map((book) => (
                <div
                  key={`wish-${book.id}`}
                  style={{
                    borderRadius: "18px",
                    border: "1px solid rgba(255, 36, 36, 0.2)",
                    background: "#ffffff",
                    padding: "14px",
                    display: "flex",
                    gap: "12px",
                    alignItems: "center",
                  }}
                >
                  <img
                    src={book.image}
                    alt={book.title}
                    style={{
                      width: "62px",
                      height: "62px",
                      borderRadius: "10px",
                      objectFit: "cover",
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        margin: 0,
                        fontWeight: 700,
                        color: "#111827",
                        fontSize: "14px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {book.title}
                    </p>
                    <p style={{ margin: "3px 0 0", fontSize: "13px", color: "#6b7280" }}>
                      {book.subject} · {book.level}
                    </p>
                    <p style={{ margin: "3px 0 0", fontSize: "14px", color: "#111827" }}>
                      {formatPrice(book.price)}
                    </p>
                    <div style={{ marginTop: "8px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      <button
                        type="button"
                        onClick={() => setSelectedListing(book)}
                        style={{
                          border: "none",
                          background: "#15803d",
                          color: "#fff",
                          borderRadius: "999px",
                          padding: "6px 10px",
                          fontSize: "12px",
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        View
                      </button>
                      <a
                        href={interestMailto(book)}
                        style={{
                          border: "1px solid rgba(22,101,52,0.35)",
                          color: "#166534",
                          borderRadius: "999px",
                          padding: "5px 10px",
                          fontSize: "12px",
                          fontWeight: 700,
                          textDecoration: "none",
                        }}
                      >
                        Contact
                      </a>
                      <button
                        type="button"
                        onClick={() => removeFromWishlist(book.id)}
                        style={{
                          border: "none",
                          background: "transparent",
                          color: "#b91c1c",
                          fontSize: "12px",
                          fontWeight: 700,
                          cursor: "pointer",
                          textDecoration: "underline",
                          padding: 0,
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {selectedListing && (
        <ListingDetailModal
          listing={selectedListing}
          onClose={() => setSelectedListing(null)}
          interestMailto={interestMailto}
          formatPrice={formatPrice}
          onToggleWishlist={() => toggleWishlist(selectedListing.id)}
          isWishlisted={isInWishlist(selectedListing.id)}
          onAddToWishlist={() => addToWishlist(selectedListing.id)}
          onToggleBasket={() => toggleBasket(selectedListing.id)}
          isInBasket={isInBasket(selectedListing.id)}
          onAddToBasket={() => addToBasket(selectedListing.id)}
        />
      )}
    </div>
  );
};

export default MarketplaceWishlistPage;
