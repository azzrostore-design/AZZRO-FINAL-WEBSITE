"use client";

import Link from "next/link";

const FEATURES = [
  {
    id: "suggestions",
    title: "AI Suggestions",
    subtitle: "Try Outfits Virtually",
    href: "/ai-suggestions",
    bg: "#fce4e4",
    badgeBg: "#e07070",
    img: "/images/ai-suggestions.png",
    fallback: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=200&h=220&fit=crop&crop=top",
  },
  {
    id: "outfit-maker",
    title: "AI Outfit Maker",
    subtitle: "AI created new looks",
    href: "/ai-outfit-maker",
    bg: "#e4eaf8",
    badgeBg: "#7a90d4",
    img: "/images/ai-outfit-maker.png",
    fallback: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=200&h=220&fit=crop&crop=top",
  },
  {
    id: "color-analysis",
    title: "Color Analysis",
    subtitle: "Find best colors",
    href: "/color-analysis",
    bg: "#fdf5d8",
    badgeBg: "#c89030",
    img: "/images/color-analysis.png",
    fallback: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=200&h=220&fit=crop&crop=top",
  },
];

export default function AIFeaturesSection() {
  return (
    <section
      style={{
        padding: "28px 20px 36px",
        background: "#ffffff",
        fontFamily: "'DM Sans', 'Inter', system-ui, sans-serif",
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      {/* Header */}
      <div style={{ marginBottom: "18px" }}>
        <h2
          style={{
            margin: "0 0 3px",
            fontSize: "18px",
            fontWeight: 700,
            color: "#1a1a1a",
            display: "flex",
            alignItems: "center",
            gap: "7px",
          }}
        >
          <span style={{ color: "#f5a623", fontSize: "16px" }}>✦</span>
          AI Fashion Studio
        </h2>
        <p style={{ margin: 0, fontSize: "13px", color: "#aaa", fontWeight: 400 }}>
          Powered by AI — just for you
        </p>
      </div>

      {/* Cards Grid */}
      <div
        className="aifs-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "14px",
        }}
      >
        {FEATURES.map((f) => (
          <Link key={f.id} href={f.href} style={{ textDecoration: "none" }}>
            <div
              className="aifs-card"
              style={{
                background: f.bg,
                borderRadius: "18px",
                padding: "16px 14px 0 16px",
                minHeight: "165px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                cursor: "pointer",
                position: "relative",
                overflow: "hidden",
                transition: "transform 0.18s ease, box-shadow 0.18s ease",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = "translateY(-5px)";
                el.style.boxShadow = "0 12px 30px rgba(0,0,0,0.11)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = "translateY(0)";
                el.style.boxShadow = "none";
              }}
            >
              {/* Badge + Text */}
              <div>
                <div
                  style={{
                    display: "inline-block",
                    background: f.badgeBg,
                    color: "#fff",
                    fontSize: "9px",
                    fontWeight: 700,
                    letterSpacing: "0.07em",
                    padding: "2px 8px",
                    borderRadius: "5px",
                    marginBottom: "9px",
                  }}
                >
                  AI
                </div>
                <div
                  style={{
                    fontSize: "15px",
                    fontWeight: 700,
                    color: "#1a1a1a",
                    lineHeight: 1.25,
                  }}
                >
                  {f.title}
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#666",
                    marginTop: "3px",
                    fontWeight: 400,
                  }}
                >
                  {f.subtitle}
                </div>
              </div>

              {/* Image — bottom right */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  width: "100px",
                  height: "120px",
                  overflow: "hidden",
                  borderRadius: "12px 0 18px 0",
                }}
              >
                <img
                  src={f.img}
                  alt={f.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "top center",
                    display: "block",
                  }}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = f.fallback;
                  }}
                />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Responsive styles */}
      <style>{`
        /* Tablet */
        @media (max-width: 900px) {
          .aifs-grid {
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 12px !important;
          }
        }

        /* Mobile — 1 column full width */
        @media (max-width: 600px) {
          .aifs-grid {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
          }
          .aifs-card {
            min-height: 110px !important;
            flex-direction: row !important;
            align-items: center !important;
            padding: 14px 100px 14px 16px !important;
          }
        }
      `}</style>
    </section>
  );
}
