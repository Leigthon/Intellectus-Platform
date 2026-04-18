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
  PaymentChoiceCard,
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

const MarketplaceBasketPage = () => {
  const { showBasketAdded, showWishlistAdded } = useMarketplaceAddedBanner();
  const [basketIds, setBasketIds] = useState(() =>
    readStoredIdList(BASKET_STORAGE_KEY)
  );
  const [wishlistIds, setWishlistIds] = useState(() =>
    readStoredIdList(WISHLIST_STORAGE_KEY)
  );
  const basketIdsRef = useRef(basketIds);
  const wishlistIdsRef = useRef(wishlistIds);
  const [paymentStructure, setPaymentStructure] = useState("full");
  const [paymentChannel, setPaymentChannel] = useState("online");
  const [selectedListing, setSelectedListing] = useState(null);

  const basketItems = useMemo(() => {
    const map = new Map(LISTINGS.map((item) => [item.id, item]));
    return basketIds.map((id) => map.get(id)).filter(Boolean);
  }, [basketIds]);
  const basketSubtotal = useMemo(
    () => basketItems.reduce((sum, item) => sum + item.price, 0),
    [basketItems]
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(BASKET_STORAGE_KEY, JSON.stringify(basketIds));
  }, [basketIds]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistIds));
  }, [wishlistIds]);

  useEffect(() => {
    basketIdsRef.current = basketIds;
  }, [basketIds]);
  useEffect(() => {
    wishlistIdsRef.current = wishlistIds;
  }, [wishlistIds]);

  const paymentStructureLabel =
    paymentStructure === "six_months" ? "Pay over 6 months" : "Pay full amount";
  const paymentChannelLabel =
    paymentChannel === "in_person" ? "In-person payment" : "Online payment";

  const basketInterestMailto = () => {
    if (basketItems.length === 0) return "#";
    const lines = basketItems
      .map(
        (item, i) =>
          `${i + 1}. ${item.title} — ${formatPrice(item.price)} (ID: ${item.id}, ${item.condition})`
      )
      .join("\n");
    const installmentLine =
      paymentStructure === "six_months"
        ? `Estimated per month (6 months): ${formatPrice(Math.ceil(basketSubtotal / 6))}\n`
        : "";
    const body = `Hi,\n\nI'd like to express interest in the following marketplace textbooks:\n\n${lines}\n\nSubtotal: ${formatPrice(basketSubtotal)}\n\nPreferred payment: ${paymentStructureLabel}\nPreferred settlement: ${paymentChannelLabel}\n${installmentLine}\nPlease confirm availability, pricing, and next steps.\n\n`;
    const subject = encodeURIComponent(
      `Marketplace basket — ${basketItems.length} item${basketItems.length !== 1 ? "s" : ""}`
    );
    return `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${encodeURIComponent(body)}`;
  };

  const clearBasket = () => setBasketIds([]);
  const removeFromBasket = (id) => {
    setBasketIds((prev) => prev.filter((x) => x !== id));
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
          background: "#eff6ff",
        }}
      >
        <div style={{ maxWidth: "1120px", margin: "0 auto" }}>
          <Link
            to="/marketplace"
            style={{
              fontSize: "14px",
              fontWeight: 700,
              color: "#1d4ed8",
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
          background: "#eff6ff",
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
                  color: "#1d4ed8",
                  fontWeight: 700,
                  fontSize: "12px",
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                }}
              >
                Your basket
              </span>
              <h1
                style={{
                  marginTop: "10px",
                  fontSize: "26px",
                  fontWeight: 800,
                  color: "#111827",
                }}
              >
                Express interest for multiple items ({basketItems.length})
              </h1>
              <p style={{ margin: "8px 0 0", fontSize: "14px", color: "#4b5563" }}>
                Add textbooks here, choose how you’d like to pay, then send one message with every title listed.
              </p>
            </div>
            {basketItems.length > 0 && (
              <button
                type="button"
                onClick={clearBasket}
                style={{
                  border: "none",
                  background: "transparent",
                  textDecoration: "underline",
                  color: "#1d4ed8",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Clear basket
              </button>
            )}
          </div>

          <div
            style={{
              borderRadius: "20px",
              border: "1px solid rgba(29,78,216,0.2)",
              background: "#ffffff",
              padding: "20px 22px",
              marginBottom: "20px",
            }}
          >
            <p
              style={{
                margin: "0 0 12px",
                fontSize: "13px",
                fontWeight: 700,
                color: "#111827",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}
            >
              Payment options
            </p>
            <p style={{ margin: "0 0 14px", fontSize: "13px", color: "#6b7280" }}>
              Select how you prefer to pay and how you’ll settle. We’ll include this in your enquiry email.
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "12px",
              }}
            >
              <PaymentChoiceCard
                title="Pay full amount"
                description="One payment for the full basket subtotal."
                selected={paymentStructure === "full"}
                onClick={() => setPaymentStructure("full")}
              />
              <PaymentChoiceCard
                title="Pay over 6 months"
                description="Spread the cost across six monthly instalments (subject to approval)."
                selected={paymentStructure === "six_months"}
                onClick={() => setPaymentStructure("six_months")}
              />
              <PaymentChoiceCard
                title="Online payment"
                description="Card or approved online methods."
                selected={paymentChannel === "online"}
                onClick={() => setPaymentChannel("online")}
              />
              <PaymentChoiceCard
                title="In-person payment"
                description="Pay at pickup or an Intellectus location."
                selected={paymentChannel === "in_person"}
                onClick={() => setPaymentChannel("in_person")}
              />
            </div>
          </div>

          {basketItems.length === 0 ? (
            <div
              style={{
                borderRadius: "20px",
                border: "1px dashed rgba(29,78,216,0.45)",
                background: "#ffffff",
                padding: "34px 24px",
                textAlign: "center",
              }}
            >
              <p style={{ margin: "0 0 16px", color: "#374151", fontSize: "15px" }}>
                Your basket is empty. Use “Add to basket” on any listing to build a multi-item enquiry.
              </p>
              <Link
                to="/marketplace"
                style={{
                  display: "inline-block",
                  padding: "10px 20px",
                  borderRadius: "999px",
                  background: "linear-gradient(135deg, #4f46e5, #2563eb)",
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
            <>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                  gap: "18px",
                  marginBottom: "20px",
                }}
              >
                {basketItems.map((book) => (
                  <div
                    key={`basket-${book.id}`}
                    style={{
                      borderRadius: "18px",
                      border: "1px solid rgba(29,78,216,0.2)",
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
                            background: "#1d4ed8",
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
                        <button
                          type="button"
                          onClick={() => removeFromBasket(book.id)}
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

              <div
                style={{
                  borderRadius: "20px",
                  background: "#0f172a",
                  color: "#f9fafb",
                  padding: "20px 22px",
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "16px",
                }}
              >
                <div>
                  <p style={{ margin: 0, fontSize: "13px", color: "#94a3b8" }}>
                    Basket subtotal
                  </p>
                  <p style={{ margin: "6px 0 0", fontSize: "24px", fontWeight: 800 }}>
                    {formatPrice(basketSubtotal)}
                  </p>
                  {paymentStructure === "six_months" && (
                    <p style={{ margin: "8px 0 0", fontSize: "13px", color: "#cbd5e1" }}>
                      Approx. {formatPrice(Math.ceil(basketSubtotal / 6))} / month × 6 (indicative)
                    </p>
                  )}
                  <p style={{ margin: "10px 0 0", fontSize: "12px", color: "#94a3b8" }}>
                    {paymentStructureLabel} · {paymentChannelLabel}
                  </p>
                </div>
                <a
                  href={basketInterestMailto()}
                  style={{
                    display: "inline-block",
                    padding: "12px 22px",
                    borderRadius: "999px",
                    background: "linear-gradient(135deg, #2563eb, #0ea5e9)",
                    color: "#ffffff",
                    fontSize: "14px",
                    fontWeight: 800,
                    textDecoration: "none",
                    textAlign: "center",
                  }}
                >
                  Express interest for all items
                </a>
              </div>
              <p
                style={{
                  marginTop: "12px",
                  fontSize: "12px",
                  color: "#6b7280",
                  textAlign: "center",
                }}
              >
                Opens your email to {CONTACT_EMAIL} with every listing and your payment preferences.
              </p>
            </>
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

export default MarketplaceBasketPage;
