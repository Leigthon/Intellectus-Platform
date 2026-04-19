import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import Header from "../components/Header";
import { useMarketplaceAddedBanner } from "../context/MarketplaceAddedBannerContext";

/** Demo catalog — swap for API data when backend exists */
export const LISTINGS = [
  {
    id: "l1",
    title: "Advanced Calculus",
    subject: "Mathematics",
    level: "2nd year",
    course: "MAM2080W",
    price: 450,
    isbn: "978-0321995896",
    condition: "Like new",
    featured: true,
    image:
      "images/textbooks/1.AdvancedCalculus.png",
    description: "Latest edition. No highlighting; used one semester.",
  },
  {
    id: "l2",
    title: "Principles of Modern Physics",
    subject: "Physics",
    level: "1st year",
    course: "PHY1004F",
    price: 385,
    isbn: "978-1108473224",
    condition: "Good",
    featured: true,
    image:
      "images/textbooks/2.PrinciplesOfModernPhysics.png",
    description: "Light pencil notes in margins on two chapters.",
  },
  {
    id: "l3",
    title: "Engineering Graphics & Design",
    subject: "Engineering",
    level: "Grade 10",
    course: "Engineering and graphics design",
    price: 550,
    isbn: "978-0134418889",
    condition: "Good",
    featured: true,
    image:
      "images/textbooks/3.Screenshot 2026-04-18 at 00.43.03.png",
    description: "Includes drawing kit. Cover scuffed.",
  },
  {
    id: "l4",
    title: "Introduction to Algorithms",
    subject: "Computer Science",
    level: "2nd year",
    course: "CSC2001S",
    price: 620,
    isbn: "978-0262046305",
    condition: "Like new",
    featured: false,
    image:
      "images/textbooks/4.Introduction to Algorithms.png",
    description: "CLRS 4th ed. Purchased new; switched modules.",
  },
  {
    id: "l5",
    title: "Constitutional Law",
    subject: "Law",
    level: "3rd year",
    course: "LAW3010",
    price: 495,
    isbn: "978-0409349240",
    condition: "Fair",
    featured: false,
    image:
      "images/textbooks/5.Constitutional Law.png",
    description: "Tabbed for exam prep. Binding solid.",
  },
  {
    id: "l6",
    title: "Financial Accounting",
    subject: "Commerce",
    level: "1st year",
    course: "ACC1006F",
    price: 340,
    isbn: "978-1292356307",
    condition: "Good",
    featured: false,
    image:
      "images/textbooks/6.Financial Accounting.png",
    description: "Access code unused (verify with seller).",
  },
  {
    id: "l7",
    title: "Linear Algebra Done Right",
    subject: "Mathematics",
    level: "2nd year",
    course: "MAM2000W",
    price: 410,
    isbn: "978-3319110790",
    condition: "Like new",
    featured: false,
    image:
      "images/textbooks/7.Linear Algebra Done Right.png",
    description: "Third edition. No marks.",
  },
  {
    id: "l8",
    title: "Organic Chemistry",
    subject: "Chemistry",
    level: "2nd year",
    course: "CEM2003",
    price: 520,
    isbn: "978-1260571310",
    condition: "Good",
    featured: false,
    image:
      "images/textbooks/7.Organic Chemistry.png",
    description: "Solutions manual included.",
  },
  {
    id: "l9",
    title: "Research Methods in Psychology",
    subject: "Psychology",
    level: "Postgrad",
    course: "PSY5005W",
    price: 280,
    isbn: "978-1526418528",
    condition: "Good",
    featured: false,
    image:
      "images/textbooks/8.Research Methods in Psychology.png",
    description: "Honours module set; minimal notes.",
  },
];

export const formatPrice = (n) =>
  `R${n.toLocaleString("en-ZA", { maximumFractionDigits: 0 })}`;

export const CONTACT_EMAIL = "myintellectus@gmail.com";
export const WISHLIST_STORAGE_KEY = "intellectus-marketplace-wishlist";
export const BASKET_STORAGE_KEY = "intellectus-marketplace-basket";

export function readStoredIdList(key) {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

const MarketplacePage = () => {
  const { showBasketAdded, showWishlistAdded } = useMarketplaceAddedBanner();
  const browseRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [subjectFilters, setSubjectFilters] = useState([]);
  const [levelFilters, setLevelFilters] = useState([]);
  const [priceMax, setPriceMax] = useState("");
  const [selectedListing, setSelectedListing] = useState(null);
  const [wishlistIds, setWishlistIds] = useState(() =>
    readStoredIdList(WISHLIST_STORAGE_KEY)
  );
  const [basketIds, setBasketIds] = useState(() =>
    readStoredIdList(BASKET_STORAGE_KEY)
  );
  const basketIdsRef = useRef(basketIds);
  const wishlistIdsRef = useRef(wishlistIds);

  const uniqueSubjects = useMemo(
    () => [...new Set(LISTINGS.map((l) => l.subject))].sort(),
    []
  );
  const uniqueLevels = useMemo(
    () => [...new Set(LISTINGS.map((l) => l.level))].sort(),
    []
  );

  const maxListingPrice = useMemo(
    () => Math.max(...LISTINGS.map((l) => l.price)),
    []
  );

  const filteredListings = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const maxP =
      priceMax === "" ? null : Number.parseFloat(String(priceMax).replace(",", "."));

    return LISTINGS.filter((item) => {
      if (q) {
        const blob = [
          item.title,
          item.subject,
          item.level,
          item.course,
          item.isbn,
          item.description,
        ]
          .join(" ")
          .toLowerCase();
        if (!blob.includes(q)) return false;
      }
      if (
        subjectFilters.length > 0 &&
        !subjectFilters.includes(item.subject)
      ) {
        return false;
      }
      if (levelFilters.length > 0 && !levelFilters.includes(item.level)) {
        return false;
      }
      if (maxP !== null && !Number.isNaN(maxP) && item.price > maxP) {
        return false;
      }
      return true;
    });
  }, [searchQuery, subjectFilters, levelFilters, priceMax]);

  const featuredListings = useMemo(
    () => LISTINGS.filter((l) => l.featured),
    []
  );
  const wishlistItems = useMemo(() => {
    const map = new Map(LISTINGS.map((item) => [item.id, item]));
    return wishlistIds.map((id) => map.get(id)).filter(Boolean);
  }, [wishlistIds]);
  const basketItems = useMemo(() => {
    const map = new Map(LISTINGS.map((item) => [item.id, item]));
    return basketIds.map((id) => map.get(id)).filter(Boolean);
  }, [basketIds]);

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

  const scrollToBrowse = () => {
    browseRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSearchSubmit = () => {
    scrollToBrowse();
  };

  const toggleSubject = (s) => {
    setSubjectFilters((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };

  const toggleLevel = (lvl) => {
    setLevelFilters((prev) =>
      prev.includes(lvl) ? prev.filter((x) => x !== lvl) : [...prev, lvl]
    );
  };

  const clearFilters = () => {
    setSubjectFilters([]);
    setLevelFilters([]);
    setPriceMax("");
    setSearchQuery("");
  };

  const interestMailto = (listing) => {
    const subject = encodeURIComponent(
      `Marketplace: ${listing.title} (${listing.id})`
    );
    const body = encodeURIComponent(
      `Hi,\n\nI'm interested in "${listing.title}" (${formatPrice(listing.price)}, ${listing.condition}).\nListing ID: ${listing.id}\n\n`
    );
    return `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
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
          position: "relative",
          padding: "clamp(56px, 12vw, 72px) clamp(12px, 4vw, 16px) clamp(56px, 12vw, 80px)",
          backgroundColor: "#f3faf6",
          backgroundImage: [
            /* Green wash — same corner energy as before, over a soft veil */
            "radial-gradient(circle at top left, rgba(131, 215, 158, 0.62), rgba(249, 250, 251, 0.55) 48%, rgba(131, 215, 158, 0.22) 100%)",
            "linear-gradient(180deg, rgba(255,255,255,0.88) 0%, rgba(249,250,251,0.45) 55%, rgba(236, 253, 245, 0.35) 100%)",
            `url("${import.meta.env.BASE_URL}images/marketplace-hero-textbooks.jpg")`,
          ].join(", "),
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div
          style={{
            maxWidth: "1120px",
            margin: "0 auto",
            display: "grid",
            gap: "clamp(24px, 5vw, 40px)",
            alignItems: "center",
            width: "100%",
            minWidth: 0,
          }}
        >
          <div style={{ minWidth: 0 }}>
            <h1
              style={{
                marginTop: "clamp(3.5rem, 12vw, 5rem)",
                marginBottom: "clamp(1.25rem, 4vw, 3rem)",
                marginLeft: "0",
                fontSize: "clamp(1.5rem, 5.5vw, 2.5rem)",
                lineHeight: 1.15,
                fontWeight: 900,
                color: "#4b4949ff",
              }}
              className="text-center sm:text-left"
            >
              What are you looking for?
            </h1>

            <div
              style={{
                marginTop: "26px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                flexWrap: "wrap",
                width: "100%",
                minWidth: 0,
              }}
            >
              <div style={{ flex: "1 1 260px", minWidth: 0 }}>
                <MarketplaceSearchBar
                  value={searchQuery}
                  onChange={setSearchQuery}
                  onSubmit={handleSearchSubmit}
                  onFiltersClick={() => setShowFilters((v) => !v)}
                  filtersActive={
                    showFilters ||
                    subjectFilters.length > 0 ||
                    levelFilters.length > 0 ||
                    priceMax !== ""
                  }
                />
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  flexShrink: 0,
                }}
              >
                <Link
                  to="/marketplace/basket"
                  style={{
                    border: "1px solid rgba(29,78,216,0.45)",
                    borderRadius: "999px",
                    padding: "10px 16px",
                    background: "#ffffff",
                    color: "#1d4ed8",
                    fontSize: "13px",
                    fontWeight: 700,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    boxShadow: "0 8px 24px rgba(15,23,42,0.08)",
                    textDecoration: "none",
                    display: "inline-block",
                  }}
                >
                  Basket ({basketItems.length})
                </Link>
                <Link
                  to="/marketplace/wishlist"
                  style={{
                    border: "1px solid rgba(22,101,52,0.45)",
                    borderRadius: "999px",
                    padding: "10px 16px",
                    background: "#ffffff",
                    color: "#c83117ff",
                    fontSize: "13px",
                    fontWeight: 700,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    boxShadow: "0 8px 24px rgba(15,23,42,0.08)",
                    textDecoration: "none",
                    display: "inline-block",
                  }}
                >
                  Wishlist ({wishlistItems.length})
                </Link>
              </div>
            </div>

            {showFilters && (
              <div
                style={{
                  marginTop: "20px",
                  padding: "20px 22px",
                  borderRadius: "20px",
                  background: "#ffffff",
                  border: "1px solid rgba(209,213,219,0.9)",
                  boxShadow: "0 16px 40px rgba(15,23,42,0.08)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "16px",
                    flexWrap: "wrap",
                    gap: "10px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: 700,
                      color: "#000000ff",
                    }}
                  >
                    Filters
                  </span>
                  <button
                    type="button"
                    onClick={clearFilters}
                    style={{
                      border: "none",
                      background: "transparent",
                      color: "#09430cff",
                      fontSize: "13px",
                      fontWeight: 600,
                      cursor: "pointer",
                      textDecoration: "underline",
                    }}
                  >
                    Clear all
                  </button>
                </div>

                <p
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "#000000ff",
                    marginBottom: "8px",
                  }}
                >
                  Subject
                </p>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "8px",
                    marginBottom: "18px",
                  }}
                >
                  {uniqueSubjects.map((s) => (
                    <FilterChip
                      key={s}
                      label={s}
                      active={subjectFilters.includes(s)}
                      onClick={() => toggleSubject(s)}
                    />
                  ))}
                </div>

                <p
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "#040404ff",
                    marginBottom: "8px",
                  }}
                >
                  Year / level
                </p>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "8px",
                    marginBottom: "18px",
                  }}
                >
                  {uniqueLevels.map((lvl) => (
                    <FilterChip
                      key={lvl}
                      label={lvl}
                      active={levelFilters.includes(lvl)}
                      onClick={() => toggleLevel(lvl)}
                    />
                  ))}
                </div>

                <p
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "#6b7280",
                    marginBottom: "8px",
                  }}
                >
                  Max price (ZAR)
                </p>
                <input
                  type="number"
                  min={0}
                  placeholder={`e.g. ${maxListingPrice}`}
                  value={priceMax}
                  onChange={(e) => setPriceMax(e.target.value)}
                  style={{
                    width: "100%",
                    maxWidth: "220px",
                    padding: "10px 12px",
                    borderRadius: "12px",
                    border: "1px solid rgba(209,213,219,0.9)",
                    fontSize: "14px",
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </section>

      <section
        id="about-us"
        style={{
          padding: "64px 16px 72px",
          background: "#f9fbf93d",
        }}
      >
        <div style={{ maxWidth: "1120px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <span
              style={{
                color: "#9ca3af",
                fontWeight: 600,
                fontSize: "12px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
              }}
            >
              About us
            </span>
            <h2
              style={{
                marginTop: "12px",
                fontSize: "28px",
                fontWeight: 800,
                color: "#111827",
              }}
            >
              Discover who we are and why we built Intellectus Marketplace.
            </h2>
          </div>

          <div
            style={{
              borderRadius: "22px",
              overflow: "hidden",
              border: "1px solid rgba(148,163,184,0.45)",
              background: "#0f172a",
              boxShadow: "0 16px 36px rgba(15,23,42,0.08)",
            }}
          >
            <div
              style={{
                aspectRatio: "16 / 9",
                width: "100%",
                background: "#0f172a",
              }}
            >
              <video
                controls
                autoPlay
                muted
                playsInline
                preload="metadata"
                poster="/media/Screenshot%202026-03-13%20at%2011.58.54.png"
                style={{
                  width: "100%",
                  height: "100%",
                  display: "block",
                  objectFit: "cover",
                }}
              >
                <source src={`${import.meta.env.BASE_URL}images/about.mp4`} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>

          <p
            style={{
              marginTop: "18px",
              fontSize: "15px",
              color: "#4b5563",
              lineHeight: 1.7,
              textAlign: "center",
              maxWidth: "840px",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Intellectus Marketplace helps students buy and sell textbooks at fair
            prices in a trusted academic community. We make quality learning
            resources more accessible so every student can start strong each term.
          </p>
        </div>
      </section>

      <section
        id="featured"
        style={{
          padding: "64px 16px 80px",
          background: "#34f91515",
        }}
      >
        <div style={{ maxWidth: "1120px", margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              gap: "16px",
              marginBottom: "28px",
              flexWrap: "wrap",
            }}
          >
            <div>
              <span
                style={{
                  color: "#18431bff",
                  fontWeight: 600,
                  fontSize: "12px",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                }}
              >
                Featured textbooks
              </span>
              <h2
                style={{
                  marginTop: "10px",
                  fontSize: "28px",
                  fontWeight: 800,
                  color: "#111827",
                }}
              >
                Top deals from students near you.
              </h2>
            </div>
            <button
              type="button"
              onClick={() => {
                scrollToBrowse();
                browseRef.current?.focus?.();
              }}
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: "#1e6117ff",
                textDecoration: "none",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              Browse all listings →
            </button>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
              gap: "20px",
            }}
          >
            {featuredListings.map((book) => (
              <ListingCard
                key={book.id}
                book={book}
                onView={() => setSelectedListing(book)}
                onToggleWishlist={() => toggleWishlist(book.id)}
                isWishlisted={isInWishlist(book.id)}
                onToggleBasket={() => toggleBasket(book.id)}
                isInBasket={isInBasket(book.id)}
              />
            ))}
          </div>
        </div>
      </section>

      <section
        ref={browseRef}
        id="browse"
        tabIndex={-1}
        style={{
          padding: "64px 16px 80px",
          background: "#f9fafb",
          outline: "none",
        }}
      >
        <div style={{ maxWidth: "1120px", margin: "0 auto" }}>
          <div style={{ marginBottom: "24px" }}>
            <span
              style={{
                color: "#343434ff",
                fontWeight: 600,
                fontSize: "12px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
              }}
            >
              All listings
            </span>
            <h2
              style={{
                marginTop: "10px",
                fontSize: "26px",
                fontWeight: 800,
                color: "#111827",
              }}
            >
              {searchQuery.trim() ||
              subjectFilters.length ||
              levelFilters.length ||
              priceMax !== ""
                ? "Matching textbooks"
                : "Every textbook on the marketplace"}
            </h2>
            <p style={{ marginTop: "8px", fontSize: "14px", color: "#6b7280" }}>
              {filteredListings.length} result
              {filteredListings.length !== 1 ? "s" : ""}
              {searchQuery.trim() ? ` for “${searchQuery.trim()}”` : ""}
            </p>
          </div>

          {filteredListings.length === 0 ? (
            <div
              style={{
                padding: "48px 24px",
                textAlign: "center",
                borderRadius: "20px",
                background: "#ffffff",
                border: "1px dashed rgba(148,163,184,0.8)",
              }}
            >
              <p style={{ fontSize: "16px", color: "#374151", marginBottom: "12px" }}>
                No textbooks match your search or filters.
              </p>
              <button
                type="button"
                onClick={clearFilters}
                style={{
                  padding: "10px 20px",
                  borderRadius: "999px",
                  border: "none",
                  background: "linear-gradient(135deg, #4f46e5, #2563eb)",
                  color: "#fff",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Clear filters and search
              </button>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
                gap: "20px",
              }}
            >
              {filteredListings.map((book) => (
                <ListingCard
                  key={book.id}
                  book={book}
                  onView={() => setSelectedListing(book)}
                  onToggleWishlist={() => toggleWishlist(book.id)}
                  isWishlisted={isInWishlist(book.id)}
                  onToggleBasket={() => toggleBasket(book.id)}
                  isInBasket={isInBasket(book.id)}
                />
              ))}
            </div>
          )}
        </div>
      </section>


     


      <section
        id="how-it-works"
        style={{
          padding: "64px 16px 72px",
          background: "#353635ff",
          color: "#e5e7eb",
        }}
      >
         <style>{`
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-12px);
          }
        }
        .bounce-section {
          animation: bounce 3s ease-in-out infinite;
        }
      `}</style>
      <section
        
      >
        <div
          className="bounce-section"
          style={{
            maxWidth: "960px",
            margin: "0 auto",
            marginBottom:"2rem",
            borderRadius: "24px",
            padding: "28px 24px 30px",
            background: "linear-gradient(135deg, #13301dff, #519e35ff)",
            boxShadow: "0 24px 60px rgba(15, 42, 33, 0.6)",
            textAlign: "center",
            color: "#f9fafb",
          }}
        >
          <h2
            style={{
              fontSize: "26px",
              fontWeight: 900,
            }}
          >
            Ready to join the student textbook marketplace?
          </h2>
          <p
            style={{
              marginTop: "10px",
              fontSize: "15px",
              color: "#e5e7eb",
            }}
          >
            Save money on your next semester or turn your old textbooks into
            extra income — all in one trusted platform.
          </p>
          <div
            style={{
              marginTop: "22px",
              display: "flex",
              justifyContent: "center",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            <button
              type="button"
              onClick={scrollToBrowse}
              style={{
                padding: "11px 22px",
                borderRadius: "999px",
                backgroundColor: "#ffffff",
                color: "#050812ff",
                fontSize: "14px",
                fontWeight: 700,
                textDecoration: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              Start buying
            </button>
            <a
              href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("List a textbook on Intellectus Marketplace")}`}
              style={{
                padding: "11px 22px",
                borderRadius: "999px",
                border: "1px solid rgba(191,219,254,0.9)",
                color: "#f9fafb",
                fontSize: "14px",
                fontWeight: 700,
                textDecoration: "none",
                backgroundColor: "rgba(15,23,42,0.15)",
              }}
            >
              Start selling
            </a>
          </div>
        </div>
      </section>
        <div
          style={{
            maxWidth: "1120px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "40px",
          }}
        >
          <div>
            <h2
              style={{
                fontSize: "26px",
                fontWeight: 800,
                color: "#f9fafb",
                marginBottom: "18px",
              }}
            >
              How buying works
            </h2>
            <Step
              number="01"
              title="Search your course"
              description="Filter by subject, year, or module to find the exact textbook you need."
            />
            <Step
              number="02"
              title="Chat & confirm"
              description="Message the seller to confirm condition, edition, and pickup or delivery."
            />
            <Step
              number="03"
              title="Pay and get your book"
              description="Complete payment securely and get your book in time for class."
            />
          </div>
          <div id="how-to-list">
            <h2
              style={{
                fontSize: "26px",
                fontWeight: 800,
                color: "#f9fafb",
                marginBottom: "18px",
              }}
            >
              How selling works
            </h2>
            <Step
              number="01"
              title="Snap & list"
              description="Take a clear photo, add the title, edition, and your price."
            />
            <Step
              number="02"
              title="Reach students"
              description="Your listing appears to students searching for that textbook."
            />
            <Step
              number="03"
              title="Hand over & get paid"
              description="Drop of your book at your nearest Intellectus location, or request a pick up and receive your payment securely."
            />
          </div>
        </div>
      </section>

      <section
        style={{
          padding: "64px 16px 72px",
          background: "#f9fafb",
        }}
      >
        <div
          style={{
            maxWidth: "960px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "32px",
            alignItems: "center",
          }}
        >
          <div>
            <span
              style={{
                color: "#9ca3af",
                fontWeight: 600,
                fontSize: "12px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
              }}
            >
              What students say
            </span>
            <h2
              style={{
                marginTop: "12px",
                fontSize: "26px",
                fontWeight: 800,
                color: "#111827",
              }}
            >
              “I cut my textbook costs in half this semester.”
            </h2>
            <p
              style={{
                marginTop: "12px",
                fontSize: "15px",
                color: "#4b5563",
                lineHeight: 1.6,
              }}
            >
              “I found all my core textbooks from other students at my
              university. The process was quick, safe, and way cheaper than
              buying new.”
            </p>
            <p
              style={{
                marginTop: "10px",
                fontSize: "14px",
                color: "#6b7280",
              }}
            >
              — Sarah, 2nd year Engineering student
            </p>
          </div>
          <div
            style={{
              borderRadius: "20px",
              padding: "18px 18px 20px",
              background: "#ffffff",
              border: "1px solid rgba(209,213,219,0.9)",
              boxShadow: "0 16px 40px rgba(15,23,42,0.08)",
            }}
          >
            <p
              style={{
                fontSize: "14px",
                color: "#4b5563",
                lineHeight: 1.6,
              }}
            >
              “As a sponsor, it’s powerful to see exactly how our support helps
              students access the resources they need. The marketplace makes the
              impact very real.”
            </p>
            <p
              style={{
                marginTop: "10px",
                fontSize: "14px",
                color: "#94979eff",
              }}
            >
              — David, Corporate Sponsor
            </p>
          </div>
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

const ListingCard = ({
  book,
  onView,
  onToggleWishlist,
  isWishlisted,
  onToggleBasket,
  isInBasket,
}) => (
  <div
    style={{
      borderRadius: "22px",
      padding: "14px 14px 18px",
      background: "#ffffff",
      border: "1px solid #18431b65",
      boxShadow: "0 18px 45px rgba(15,23,42,0.12)",
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      minWidth: 0,
    }}
  >
    <div
      style={{
        borderRadius: "16px",
        overflow: "hidden",
        background: "#e5e7eb",
        height: "180px",
      }}
    >
      <img
        src={book.image}
        alt={book.title}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
    </div>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "8px",
        flexWrap: "wrap",
      }}
    >
      <span
        style={{
          fontSize: "12px",
          fontWeight: 600,
          padding: "4px 10px",
          borderRadius: "999px",
          backgroundColor: "#e0e7ff",
          color: "#3730a3",
        }}
      >
        {book.subject}
      </span>
      <span
        style={{
          fontSize: "12px",
          fontWeight: 600,
          color: "#6b7280",
        }}
      >
        {book.level}
      </span>
      <span
        style={{
          fontSize: "14px",
          fontWeight: 700,
          color: "#111827",
          marginLeft: "auto",
        }}
      >
        {formatPrice(book.price)}
      </span>
    </div>
    <h3
      style={{
        fontSize: "15px",
        fontWeight: 700,
        color: "#111827",
      }}
    >
      {book.title}
    </h3>
    <button
      type="button"
      onClick={onView}
      style={{
        marginTop: "8px",
        width: "100%",
        padding: "10px 14px",
        borderRadius: "999px",
        border: "none",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: 600,
        color: "#ffffff",
        background: "linear-gradient(135deg, #15803d, #0d9488)",
      }}
    >
      View textbook
    </button>
    <button
      type="button"
      onClick={onToggleBasket}
      style={{
        width: "100%",
        padding: "10px 14px",
        borderRadius: "999px",
        border: isInBasket ? "1px solid #1d4ed8" : "1px solid rgba(29,78,216,0.45)",
        cursor: "pointer",
        fontSize: "13px",
        fontWeight: 700,
        color: isInBasket ? "#ffffff" : "#1d4ed8",
        background: isInBasket ? "#1d4ed8" : "#ffffff",
      }}
    >
      {isInBasket ? "In basket" : "Add to basket"}
    </button>
    <button
      type="button"
      onClick={onToggleWishlist}
      style={{
        width: "100%",
        padding: "10px 14px",
        borderRadius: "999px",
        border: isWishlisted ? "1px solid #eb2e2eff" : "1px solid rgba(172, 83, 83, 0.35)",
        cursor: "pointer",
        fontSize: "13px",
        fontWeight: 700,
        color: isWishlisted ? "#ffffff" : "#ff0000ff",
        background: isWishlisted ? "#f4300dff" : "#ffffff",
      }}
    >
      {isWishlisted ? "In wishlist" : "Add to wishlist"}
    </button>
  </div>
);

export const ListingDetailModal = ({
  listing,
  onClose,
  interestMailto,
  formatPrice,
  onToggleWishlist,
  isWishlisted,
  onAddToWishlist,
  onToggleBasket,
  isInBasket,
  onAddToBasket,
}) => {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="listing-modal-title"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        background: "rgba(15,23,42,0.55)",
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "480px",
          maxHeight: "90vh",
          overflowY: "auto",
          borderRadius: "24px",
          background: "#ffffff",
          boxShadow: "0 24px 60px rgba(15,23,42,0.35)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ position: "relative" }}>
          <div style={{ height: "200px", overflow: "hidden", background: "#e5e7eb" }}>
            <img
              src={listing.image}
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            style={{
              position: "absolute",
              top: "12px",
              right: "12px",
              width: "36px",
              height: "36px",
              borderRadius: "999px",
              border: "none",
              background: "rgba(255,255,255,0.95)",
              cursor: "pointer",
              fontSize: "18px",
              lineHeight: 1,
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            }}
          >
            ×
          </button>
        </div>
        <div style={{ padding: "22px 22px 24px" }}>
          <h2
            id="listing-modal-title"
            style={{
              fontSize: "20px",
              fontWeight: 800,
              color: "#111827",
              marginBottom: "8px",
            }}
          >
            {listing.title}
          </h2>
          <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "16px" }}>
            Listing ID: {listing.id} · {listing.course}
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
              marginBottom: "16px",
            }}
          >
            <span
              style={{
                fontSize: "12px",
                fontWeight: 600,
                padding: "4px 10px",
                borderRadius: "999px",
                backgroundColor: "#e0e7ff",
                color: "#3730a3",
              }}
            >
              {listing.subject}
            </span>
            <span
              style={{
                fontSize: "12px",
                fontWeight: 600,
                padding: "4px 10px",
                borderRadius: "999px",
                backgroundColor: "#f3f4f6",
                color: "#374151",
              }}
            >
              {listing.level}
            </span>
            <span
              style={{
                fontSize: "12px",
                fontWeight: 600,
                padding: "4px 10px",
                borderRadius: "999px",
                backgroundColor: "#ecfdf5",
                color: "#065f46",
              }}
            >
              {listing.condition}
            </span>
          </div>
          <p
            style={{
              fontSize: "22px",
              fontWeight: 800,
              color: "#111827",
              marginBottom: "12px",
            }}
          >
            {formatPrice(listing.price)}
          </p>
          <p style={{ fontSize: "14px", color: "#4b5563", lineHeight: 1.6 }}>
            {listing.description}
          </p>
          <p
            style={{
              fontSize: "13px",
              color: "#6b7280",
              marginTop: "12px",
              fontFamily: "ui-monospace, monospace",
            }}
          >
            ISBN {listing.isbn}
          </p>
          {/* <a
            href={interestMailto(listing)}
            style={{
              display: "block",
              marginTop: "20px",
              textAlign: "center",
              padding: "12px 16px",
              borderRadius: "999px",
              background: "linear-gradient(135deg, #15803d, #0d9488)",
              color: "#ffffff",
              fontSize: "14px",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            Express interest
          </a> */}

          <button
            type="button"
            onClick={isInBasket ? onToggleBasket : onAddToBasket}
            style={{
              display: "block",
              marginTop: "10px",
              width: "100%",
              textAlign: "center",
              padding: "12px 16px",
              borderRadius: "999px",
              background: isInBasket ? "#1d4ed8" : "#ffffff",
              color: isInBasket ? "#ffffff" : "#1d4ed8",
              fontSize: "14px",
              fontWeight: 700,
              border: "1px solid rgba(29,78,216,0.45)",
              cursor: "pointer",
            }}
          >
            {isInBasket ? "Remove from basket" : "Add to basket"}
          </button>
          <button
            type="button"
            onClick={isWishlisted ? onToggleWishlist : onAddToWishlist}
            style={{
              display: "block",
              marginTop: "10px",
              width: "100%",
              textAlign: "center",
              padding: "12px 16px",
              borderRadius: "999px",
              background: isWishlisted ? "#ef2b2bff" : "#ffffff",
              color: isWishlisted ? "#ffffff" : "#ff3535ff",
              fontSize: "14px",
              fontWeight: 700,
              border: "1px solid rgba(253, 42, 42, 0.45)",
              cursor: "pointer",
            }}
          >
            {isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          </button>
          
          <p
            style={{
              marginTop: "12px",
              fontSize: "12px",
              color: "#9ca3af",
              textAlign: "center",
            }}
          >
            Opens your email to {CONTACT_EMAIL}
          </p>
        </div>
      </div>
    </div>
  );
};

const FilterChip = ({ label, active, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    style={{
      padding: "8px 14px",
      borderRadius: "999px",
      border: active ? "2px solid #18431bff" : "1px solid rgba(209,213,219,0.9)",
      background: active ? "#eef2ff" : "#ffffff",
      color: active ? "#18431bff" : "#374151",
      fontSize: "13px",
      fontWeight: 600,
      cursor: "pointer",
    }}
  >
    {label}
  </button>
);

const Step = ({ number, title, description }) => (
  <div style={{ marginBottom: "16px" }}>
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        marginBottom: "4px",
      }}
    >
      <span
        style={{
          fontSize: "11px",
          fontWeight: 700,
          padding: "4px 10px",
          borderRadius: "999px",
          backgroundColor: "rgba(248,250,252,0.08)",
          color: "#e5e7eb",
        }}
      >
        {number}
      </span>
      <span
        style={{
          fontSize: "14px",
          fontWeight: 600,
          color: "#e5e7eb",
        }}
      >
        {title}
      </span>
    </div>
    <p
      style={{
        fontSize: "14px",
        color: "#9ca3af",
        lineHeight: 1.5,
      }}
    >
      {description}
    </p>
  </div>
);

export const PaymentChoiceCard = ({ title, description, selected, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    style={{
      textAlign: "left",
      padding: "14px 16px",
      borderRadius: "14px",
      border: selected ? "2px solid #2563eb" : "1px solid rgba(148,163,184,0.7)",
      background: selected ? "#eff6ff" : "#f8fafc",
      cursor: "pointer",
      display: "flex",
      flexDirection: "column",
      gap: "6px",
    }}
  >
    <span style={{ fontSize: "14px", fontWeight: 800, color: "#0f172a" }}>{title}</span>
    <span style={{ fontSize: "12px", color: "#64748b", lineHeight: 1.45 }}>
      {description}
    </span>
  </button>
);

const MarketplaceSearchBar = ({
  value,
  onChange,
  onSubmit,
  onFiltersClick,
  filtersActive,
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit();
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        width: "100%",
        minWidth: 0,
        backgroundColor: "rgba(255,255,255,0.95)",
        borderRadius: "999px",
        padding: "6px 6px 6px 16px",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        flexWrap: "wrap",
        boxShadow: "0 16px 40px rgba(15,23,42,0.12)",
        border: "1px solid rgba(209,213,219,0.9)",
      }}
    >
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#9ca3af",
        }}
        aria-hidden
      >
        <Search size={18} strokeWidth={2} />
      </span>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        placeholder="Search textbooks by title, course, or ISBN"
        style={{
          flex: 1,
          minWidth: 0,
          border: "none",
          outline: "none",
          background: "transparent",
          fontSize: "14px",
          color: "#111827",
        }}
      />
      <button
        type="button"
        onClick={onFiltersClick}
        style={{
          border:
            filtersActive
              ? "2px solid #4f46e5"
              : "none",
          backgroundColor: filtersActive ? "#eef2ff" : "#e6fbeeff",
          color: filtersActive ? "#3730a3" : "#154929ff",
          fontSize: "12px",
          fontWeight: 600,
          padding: "6px 10px",
          borderRadius: "999px",
          cursor: "pointer",
          whiteSpace: "nowrap",
        }}
      >
        Filters
      </button>
      <button
        type="submit"
        style={{
          border: "none",
          borderRadius: "999px",
          padding: "8px 16px",
          background: "#1e5e37ff",
          color: "#ffffff",
          fontSize: "13px",
          fontWeight: 600,
          cursor: "pointer",
          whiteSpace: "nowrap",
        }}
      >
        Search
      </button>
    </form>
  );
};

export default MarketplacePage;
