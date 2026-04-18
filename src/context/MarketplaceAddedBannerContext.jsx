import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Link } from "react-router-dom";

const MarketplaceAddedBannerContext = createContext(null);

const AUTO_DISMISS_MS = 8000;

export function MarketplaceAddedBannerProvider({ children }) {
  const [basketOpen, setBasketOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const basketTimerRef = useRef(null);
  const wishlistTimerRef = useRef(null);

  const clearBasketTimer = useCallback(() => {
    if (basketTimerRef.current) {
      window.clearTimeout(basketTimerRef.current);
      basketTimerRef.current = null;
    }
  }, []);

  const clearWishlistTimer = useCallback(() => {
    if (wishlistTimerRef.current) {
      window.clearTimeout(wishlistTimerRef.current);
      wishlistTimerRef.current = null;
    }
  }, []);

  const showBasketAdded = useCallback(() => {
    setBasketOpen(true);
    clearBasketTimer();
    basketTimerRef.current = window.setTimeout(() => {
      setBasketOpen(false);
      basketTimerRef.current = null;
    }, AUTO_DISMISS_MS);
  }, [clearBasketTimer]);

  const showWishlistAdded = useCallback(() => {
    setWishlistOpen(true);
    clearWishlistTimer();
    wishlistTimerRef.current = window.setTimeout(() => {
      setWishlistOpen(false);
      wishlistTimerRef.current = null;
    }, AUTO_DISMISS_MS);
  }, [clearWishlistTimer]);

  const dismissBasket = useCallback(() => {
    clearBasketTimer();
    setBasketOpen(false);
  }, [clearBasketTimer]);

  const dismissWishlist = useCallback(() => {
    clearWishlistTimer();
    setWishlistOpen(false);
  }, [clearWishlistTimer]);

  useEffect(() => {
    return () => {
      clearBasketTimer();
      clearWishlistTimer();
    };
  }, [clearBasketTimer, clearWishlistTimer]);

  const value = useMemo(
    () => ({
      basketOpen,
      wishlistOpen,
      showBasketAdded,
      showWishlistAdded,
      dismissBasket,
      dismissWishlist,
    }),
    [
      basketOpen,
      wishlistOpen,
      showBasketAdded,
      showWishlistAdded,
      dismissBasket,
      dismissWishlist,
    ]
  );

  return (
    <MarketplaceAddedBannerContext.Provider value={value}>
      {children}
    </MarketplaceAddedBannerContext.Provider>
  );
}

export function useMarketplaceAddedBanner() {
  const ctx = useContext(MarketplaceAddedBannerContext);
  if (!ctx) {
    throw new Error(
      "useMarketplaceAddedBanner must be used within MarketplaceAddedBannerProvider"
    );
  }
  return ctx;
}

export function MarketplaceAddedBanners() {
  const {
    basketOpen,
    wishlistOpen,
    dismissBasket,
    dismissWishlist,
  } = useMarketplaceAddedBanner();

  if (!basketOpen && !wishlistOpen) return null;

  return (
    <div
      className="fixed top-16 left-0 right-0 z-40 flex flex-col border-b border-slate-200/90 shadow-md"
      role="region"
      aria-label="Marketplace updates"
    >
      {wishlistOpen && (
        <div className="flex flex-wrap items-center justify-between gap-2 gap-y-2 bg-rose-50 px-4 py-2.5 sm:px-6">
          <p className="text-sm font-medium text-slate-800">
            Saved to your wishlist.
          </p>
          <div className="flex items-center gap-3">
            <Link
              to="/marketplace/wishlist"
              className="text-sm font-bold text-rose-700 underline decoration-rose-400 underline-offset-2 hover:text-rose-900"
            >
              View wishlist
            </Link>
            <button
              type="button"
              onClick={dismissWishlist}
              className="rounded-md px-2 py-1 text-sm font-semibold text-slate-600 hover:bg-rose-100 hover:text-slate-900"
              aria-label="Dismiss wishlist notice"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
      {basketOpen && (
        <div className="flex flex-wrap items-center justify-between gap-2 gap-y-2 bg-blue-50 px-4 py-2.5 sm:px-6">
          <p className="text-sm font-medium text-slate-800">
            Added to your basket.
          </p>
          <div className="flex items-center gap-3">
            <Link
              to="/marketplace/basket"
              className="text-sm font-bold text-blue-700 underline decoration-blue-400 underline-offset-2 hover:text-blue-900"
            >
              View basket
            </Link>
            <button
              type="button"
              onClick={dismissBasket}
              className="rounded-md px-2 py-1 text-sm font-semibold text-slate-600 hover:bg-blue-100 hover:text-slate-900"
              aria-label="Dismiss basket notice"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
