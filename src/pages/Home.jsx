import React, { useEffect, useRef, useState } from "react";

const platforms = [
  {
    id: "academy",
    name: "Intellectus Academy",
    tagline: "Personalized tutoring and academic support",
    description:
      "One-on-one and group tutoring tailored to each student’s goals, helping them own their academic success.",
    image: "/images/Tutoring.jpg", // update to your row image
    background: "#1ac8db",
    ctaLabel: "Explore Academy",
    ctaHref: "#academy",
  },
  {
    id: "funding",
    name: "Intellectus Funding",
    tagline: "Invest in talent",
    description:
      "Connects sponsors with students to fund tutoring sessions and essential learning resources.",
    image: "/images/Funding.jpg", // update to your row image
    background: "#e53935",
    ctaLabel: "Explore Funding",
    ctaHref: "#funding",
  },
  {
    id: "marketplace",
    name: "Intellectus Marketplace",
    tagline: "Textbooks made affordable",
    description:
      "A secure, flat-fee marketplace where students can buy and sell textbooks for less.",
    image: "/images/Marketplace.jpg", // update to your row image
    background: "#2e7d32",
    ctaLabel: "Visit Marketplace",
    ctaHref: "#marketplace",
  },
];

const Home = () => {
  const text =
    "INTELLECTUS ACADEMY        • INTELLECTUS FUNDING      • INTELLECTUS MARKETPLACE • ";
  const [offset, setOffset] = useState(0);
  const innerRef = useRef(null);

  useEffect(() => {
    const speed = 0.8; // pixels per frame
    let frameId;
    const step = () => {
      setOffset((prev) => {
        const width = innerRef.current?.scrollWidth || 0;
        const next = prev - speed;
        if (width && Math.abs(next) > width / 2) {
          return 0;
        }
        return next;
      });
      frameId = requestAnimationFrame(step);
    };
    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "white",
        /* Clear fixed App <Header /> so the marquee stays visible directly below it */
        paddingTop: "4rem",
      }}
    >
      {/* Marquee bar — scrolling strip (kept below global header) */}
      <div
        style={{
          width: "100%",
          background: "radial-gradient(circle at top left, #01d5ff2f, #4bfa0036, #ff140337 105%)",
          color: "black",
          padding: "12px 16px",
          fontSize: "14px",
          textTransform: "uppercase",
          overflow: "hidden",
          whiteSpace: "nowrap",
        }}
      >
        <div
          ref={innerRef}
          style={{
            display: "inline-block",
            transform: `translateX(${offset}px)`,
            willChange: "transform",
          }}
        >
          <span style={{ paddingRight: "4rem" }}>{text}</span>
          <span style={{ paddingRight: "4rem" }}>{text}</span>
          <span style={{ paddingRight: "4rem" }}>{text}</span>
          <span style={{ paddingRight: "4rem" }}>{text}</span>
          <span style={{ paddingRight: "4rem" }}>{text}</span>
          <span style={{ paddingRight: "4rem" }}>{text}</span>
        </div>
      </div>

     

      {/* About Intellectus section — education-themed background (local asset) */}
      <section
        id="about"
        style={{
          position: "relative",
          padding: "64px 16px 80px",
          backgroundColor: "#0b1220",
          backgroundImage: [
            "linear-gradient(115deg, rgba(248,250,252,0.97) 0%, rgba(248,250,252,0.92) 42%, rgba(248,250,252,0.55) 58%, rgba(11,18,32,0.15) 100%)",
            'url("/images/education-about-bg.jpg")',
          ].join(", "),
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div
          style={{
            maxWidth: "95%",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "minmax(0, 2fr) minmax(0, 3fr)",
            gap: "40px",
            alignItems: "center",
          }}
        >
          {/* Left: intro */}
          <div>
            <span
              style={{
                color: "#082769",
                fontWeight: 600,
                fontSize: "12px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
              }}
            >
              About Intellectus
            </span>
            <h2
              style={{
                marginTop: "12px",
                fontSize: "32px",
                lineHeight: 1.2,
                fontWeight: 900,
                color: "#111827",
              }}
            >
              Investing in the student journey, not just a single grade.
            </h2>
            <p
              style={{
                marginTop: "16px",
                color: "#374151",
                fontSize: "16px",
                lineHeight: 1.6,
              }}
            >
              Intellectus is built on a simple belief: when you invest in
              students, everyone wins.
              <br />
              <br />
              We connect learners, tutors, and corporate sponsors in one
              ecosystem so students can access the support, funding, and
              resources they need to thrive academically.
            </p>

            <button
              style={{
                marginTop: "24px",
                padding: "12px 20px",
                borderRadius: "999px",
                border: "none",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: 600,
                color: "#ffffff",
                background: "#082769ff",
                boxShadow: "0 12px 30px rgba(37,99,235,0.35)",
              }}
              onClick={() => {
                const el = document.querySelector("#funding");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Learn more about our mission
            </button>
          </div>

          {/* Right: three pillars */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "20px",
            }}
          >
          </div>
        </div>
        <p
          style={{
            maxWidth: "95%",
            margin: "28px auto 0",
            fontSize: "11px",
            color: "rgba(55,65,81,0.75)",
            lineHeight: 1.4,
          }}
        >
          Background: collaborative learning (Pexels — free to use under the Pexels licence).
        </p>
      </section>


       {/* Our Platforms cards */}
      <section
        style={{
          padding: "20px 16px 64px",
          background: "radial-gradient(circle at top left, #819bbfff, #d3dfeaff 95%)",
        }}
      >
        <div
          style={{
            maxWidth: "1120px",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              textAlign: "center",
              marginBottom: "20px",
            }}
          >
            <span
              style={{
                color: "#fcfdffff",
                fontWeight: 600,
                fontSize: "12px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
              }}
            >
              Our Ecosystem
            </span>
            <h2
              style={{
                marginTop: "12px",
                fontSize: "32px",
                fontWeight: 900,
                color: "#3b404fff",
              }}
            >
              More than tutoring. A full support system.
            </h2>
            <p
              style={{
                marginTop: "12px",
                color: "#4b5563",
                fontSize: "16px",
                maxWidth: "640px",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              Intellectus connects tutoring, funding, and textbooks so students
              get the support they need at every step of their academic journey.
            </p>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "24px",
              marginTop: "50px",
            }}
          >
            {platforms.map((platform) => (
              <article
                key={platform.id}
                style={{
                  background: "white",
                  borderRadius: "24px",
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 18px 45px rgba(15,23,42,0.08)",
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    padding: "24px 24px 20px",
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,
                  }}
                >
                  <div
                    style={{
                      marginBottom: "20px",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "999px",
                        background: "#f3f4f6",
                      }}
                    >
                      <img
                        src={platform.image}
                        alt={platform.name}
                        style={{
                          height: "55px",
                          width: "auto",
                          objectFit: "contain",
                        }}
                      />
                    </div>
                  </div>
                  <div style={{ flex: 1, textAlign: "left" }}>
                    <p
                      style={{
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "#4b5563",
                        marginBottom: "6px",
                      }}
                    >
                      {platform.tagline}
                    </p>
                    <p
                      style={{
                        fontSize: "14px",
                        color: "#6b7280",
                        lineHeight: 1.5,
                      }}
                    >
                      {platform.description}
                    </p>
                  </div>
                  <div style={{ marginTop: "16px" }}>
                    <a
                      href={platform.ctaHref}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "100%",
                        padding: "12px 16px",
                        borderRadius: "999px",
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "white",
                        textDecoration: "none",
                        backgroundColor: platform.background,
                        opacity: 0.8,
                      }}
                    >
                      {platform.ctaLabel}
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
