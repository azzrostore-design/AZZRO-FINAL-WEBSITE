"use client";

import Link from "next/link";

const AI_FEATURES = [
  {
    id: "fit-me",
    title: "FIT ME",
    subtitle: "Virtual Try-On",
    description: "Upload your selfie and see how any outfit looks on you in seconds.",
    href: "/products/fit-me",
    gradient: "linear-gradient(135deg, #1a1a1a 0%, #3d3d3d 100%)",
    textColor: "#fff",
    accentColor: "#f5d06e",
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=300&fit=crop",
    tag: "Most Popular",
    tagBg: "#f5d06e",
    tagColor: "#1a1a1a",
  },
  {
    id: "ai-suggestions",
    title: "AI Suggestions",
    subtitle: "Personalized Styling",
    description: "Get outfit suggestions tailored to your body type, occasion, and style preferences.",
    href: "/components/tryon/AISuggestions",
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    textColor: "#fff",
    accentColor: "#c8d4ff",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=300&fit=crop",
    tag: "New",
    tagBg: "#fff",
    tagColor: "#667eea",
  },
  {
    id: "outfit-maker",
    title: "AI Outfit Maker",
    subtitle: "Mix & Match Wardrobe",
    description: "Drag and drop your wardrobe items to create perfect outfit combinations with AI help.",
    href: "/components/tryon/AIOutfitMaker",
    gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    textColor: "#fff",
    accentColor: "#ffe0f0",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=300&fit=crop",
    tag: "New",
    tagBg: "#fff",
    tagColor: "#f5576c",
  },
  {
    id: "color-analysis",
    title: "Color Analysis",
    subtitle: "Discover Your Palette",
    description: "Upload a selfie or select your skin tone to get your personalized color season and palette.",
    href: "/components/tryon/ColorAnalysis",
    gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    textColor: "#1a1a1a",
    accentColor: "#1a1a1a",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=300&fit=crop",
    tag: "New",
    tagBg: "#1a1a1a",
    tagColor: "#fff",
  },
];

const QUICK_STATS = [
  { label: "Outfits Created", value: "2.4M+" },
  { label: "Happy Users", value: "180K+" },
  { label: "Style Accuracy", value: "94%" },
];

export default function AITryOnHub() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#f8f6f2", minHeight: "100vh" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,500;0,700;1,500&display=swap" rel="stylesheet" />

      {/* Hero Section */}
      <div style={{
        background: "#1a1a1a",
        padding: "48px 24px 40px",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Decorative blur */}
        <div style={{
          position: "absolute", top: -40, right: -40,
          width: 200, height: 200, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(245,208,110,0.15), transparent)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: -20, left: -20,
          width: 150, height: 150, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(102,126,234,0.15), transparent)",
          pointerEvents: "none",
        }} />

        <div style={{ position: "relative" }}>
          <div style={{
            display: "inline-block", background: "rgba(245,208,110,0.15)",
            border: "1px solid rgba(245,208,110,0.3)", borderRadius: "20px",
            padding: "4px 14px", fontSize: "11px", fontWeight: 600,
            color: "#f5d06e", letterSpacing: "0.08em", marginBottom: "16px",
          }}>
            AZZRO AI STUDIO
          </div>
          <h1 style={{
            margin: "0 0 12px", fontSize: "32px", fontWeight: 700,
            fontFamily: "'Playfair Display', serif", color: "#fff", lineHeight: 1.2,
          }}>
            Your Personal<br />
            <em style={{ color: "#f5d06e", fontStyle: "italic" }}>AI Stylist</em>
          </h1>
          <p style={{ margin: "0 0 28px", fontSize: "14px", color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>
            Four powerful tools to elevate your style game — try on, analyze, and create looks that turn heads.
          </p>

          {/* Stats Row */}
          <div style={{ display: "flex", gap: "24px" }}>
            {QUICK_STATS.map((stat) => (
              <div key={stat.label}>
                <div style={{ fontSize: "18px", fontWeight: 700, color: "#fff" }}>{stat.value}</div>
                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)" }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      <div style={{ padding: "24px" }}>
        <h2 style={{ margin: "0 0 20px", fontSize: "16px", fontWeight: 700, color: "#1a1a1a" }}>
          Choose a Feature
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {AI_FEATURES.map((feature, index) => (
            <Link
              key={feature.id}
              href={feature.href}
              style={{ textDecoration: "none" }}
            >
              <div
                style={{
                  borderRadius: "20px",
                  overflow: "hidden",
                  background: "#fff",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 32px rgba(0,0,0,0.14)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)";
                }}
              >
                {/* Image Banner */}
                <div style={{ position: "relative", height: index === 0 ? 160 : 120 }}>
                  <img
                    src={feature.image}
                    alt={feature.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  <div style={{
                    position: "absolute", inset: 0,
                    background: feature.gradient,
                    opacity: 0.75,
                  }} />
                  <div style={{ position: "absolute", inset: 0, padding: "16px 20px", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                    <div style={{
                      display: "inline-block", alignSelf: "flex-start",
                      background: feature.tagBg, borderRadius: "20px",
                      padding: "2px 10px", fontSize: "10px", fontWeight: 700,
                      color: feature.tagColor, marginBottom: "8px",
                      letterSpacing: "0.04em",
                    }}>
                      {feature.tag}
                    </div>
                    <h3 style={{
                      margin: 0, fontSize: index === 0 ? "24px" : "20px",
                      fontWeight: 800, fontFamily: "'Playfair Display', serif",
                      color: feature.textColor, letterSpacing: "-0.02em",
                    }}>
                      {feature.title}
                    </h3>
                    <p style={{ margin: "2px 0 0", fontSize: "11px", color: `${feature.textColor}99` }}>
                      {feature.subtitle}
                    </p>
                  </div>
                </div>

                {/* Card Body */}
                <div style={{ padding: "16px 20px 20px", display: "flex", alignItems: "center", gap: "12px" }}>
                  <p style={{ margin: 0, fontSize: "13px", color: "#666", lineHeight: 1.5, flex: 1 }}>
                    {feature.description}
                  </p>
                  <div style={{
                    width: 36, height: 36, borderRadius: "50%",
                    background: "#f3f0ea", display: "flex", alignItems: "center",
                    justifyContent: "center", fontSize: "16px", flexShrink: 0,
                  }}>
                    →
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom Note */}
        <div style={{
          marginTop: "28px", padding: "16px 20px",
          background: "#fff", borderRadius: "14px",
          display: "flex", alignItems: "center", gap: "12px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        }}>
          <div style={{ fontSize: "20px" }}>
            <img
              src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=40&h=40&fit=crop&crop=face"
              alt="AI"
              style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover" }}
            />
          </div>
          <div>
            <div style={{ fontSize: "13px", fontWeight: 600, color: "#1a1a1a" }}>Powered by Azzro AI</div>
            <div style={{ fontSize: "11px", color: "#aaa" }}>Real-time styling intelligence, just for you</div>
          </div>
        </div>
      </div>
    </div>
  );
}
