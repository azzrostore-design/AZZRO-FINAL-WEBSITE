"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { STORE_PRODUCTS, type StoreProduct } from "@/lib/storeProducts";

// ── Skin tones ────────────────────────────────────────────────────────────────

const SKIN_TONES = [
  { id: "fair",   label: "Fair",   color: "#FDDBB4" },
  { id: "light",  label: "Light",  color: "#E8B98A" },
  { id: "medium", label: "Medium", color: "#C8864E" },
  { id: "tan",    label: "Tan",    color: "#A0622A" },
  { id: "deep",   label: "Deep",   color: "#7A3E10" },
  { id: "rich",   label: "Rich",   color: "#3D1E0A" },
];

// ── Color season data (palette + recommended product tags) ────────────────────

const COLOR_SEASONS: Record<string, {
  season: string;
  desc: string;
  accent: string;
  neutrals: string[];
  power: string[];
  avoid: string[];
  tip: string;
  recommendTags: string[];
  recommendColors: string[];
}> = {
  fair: {
    season: "Spring / Light",
    desc: "Warm peachy undertones. Light, clear colors create harmony with your radiance.",
    accent: "#e8b4c4",
    neutrals: ["#FAFAF8", "#F5ECD7", "#EAD5C0", "#D4B896"],
    power:   ["#E8B4C4", "#A8D4C2", "#B8D4F0", "#F5D06E"],
    avoid:   ["#2a2a2a", "#8B0000", "#4A0080", "#1C4A1C"],
    tip: "Peach, coral, and warm pastels are your power shades.",
    recommendTags: ["minimal", "feminine", "elegant"],
    recommendColors: ["Ivory", "Dusty Rose", "Sage", "White"],
  },
  light: {
    season: "Summer / Light",
    desc: "Cool muted tones suit your complexion. Soft blended colors enhance your elegance.",
    accent: "#b4c8e8",
    neutrals: ["#F8F8FA", "#E8E4F0", "#D4C8DC", "#C0B4C8"],
    power:   ["#B4C8E8", "#C8B4E8", "#E8C8D4", "#B4D4C8"],
    avoid:   ["#FF6600", "#FFD700", "#8B4513", "#FF4500"],
    tip: "Cool-toned pastels are your signature. Avoid warm oranges.",
    recommendTags: ["minimal", "classic", "elegant"],
    recommendColors: ["White", "Ivory", "Sage", "Indigo"],
  },
  medium: {
    season: "Spring / Warm",
    desc: "Warm undertones shine with golden and earthy palettes.",
    accent: "#d4a84b",
    neutrals: ["#F5ECD7", "#E8D4B8", "#C4A882", "#A08858"],
    power:   ["#D4A84B", "#E87840", "#C85A2A", "#8FB86A"],
    avoid:   ["#E8E4F0", "#B4B8E8", "#D4E8F0"],
    tip: "Gold accessories and warm earth tones are perfect for you.",
    recommendTags: ["bohemian", "trendy", "casual"],
    recommendColors: ["Mustard", "Camel", "Olive", "Tan"],
  },
  tan: {
    season: "Autumn / Warm",
    desc: "Rich earthy colors complement your warm undertones beautifully.",
    accent: "#c47820",
    neutrals: ["#E8D4B0", "#C4A870", "#A08040", "#806030"],
    power:   ["#C47820", "#8B4513", "#2D5A1B", "#8B0000"],
    avoid:   ["#F0F8FF", "#E8F4F0", "#F5F0E8"],
    tip: "Burnt orange, mustard and forest green make you glow.",
    recommendTags: ["streetwear", "casual", "bohemian"],
    recommendColors: ["Mustard", "Olive", "Camel", "Brown"],
  },
  deep: {
    season: "Autumn / Deep",
    desc: "Rich bold colors complement your complexion. Jewel tones are your best ally.",
    accent: "#8b2252",
    neutrals: ["#3A2828", "#5A4040", "#7A5858", "#A08070"],
    power:   ["#8B2252", "#1A5A8A", "#2A7A2A", "#8B6914"],
    avoid:   ["#F5F5DC", "#FFFAF0", "#F0FFF0"],
    tip: "Rich jewel tones and metallic accents are perfect.",
    recommendTags: ["elegant", "classic", "office"],
    recommendColors: ["Black", "Indigo", "Gold", "Multicolor"],
  },
  rich: {
    season: "Winter / Deep",
    desc: "Bold saturated colors are yours to command. High-contrast is your signature.",
    accent: "#4a1a7a",
    neutrals: ["#1A1A1A", "#2A2A2A", "#404040", "#F5F5F5"],
    power:   ["#4A1A7A", "#1A2A7A", "#7A1A1A", "#1A7A4A"],
    avoid:   ["#F5DEB3", "#FFDEAD", "#DEB887"],
    tip: "Black & white, jewel tones, and metallics are brilliant on you.",
    recommendTags: ["classic", "timeless", "elegant", "minimal"],
    recommendColors: ["Black", "White", "Gold", "Indigo"],
  },
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function ColorAnalysis() {
  const [step, setStep] = useState<"input" | "loading" | "results">("input");
  const [selectedTone, setSelectedTone] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const palette = selectedTone ? COLOR_SEASONS[selectedTone] : null;

  // ── Recommended products from store ───────────────────────────────────────
  const recommendedProducts: StoreProduct[] = palette
    ? STORE_PRODUCTS.filter(
        (p) =>
          p.inStock &&
          (palette.recommendColors.includes(p.color) ||
            palette.recommendTags.some((t) => p.tags.includes(t)))
      ).slice(0, 8)
    : [];

  // ── Upload handler ─────────────────────────────────────────────────────────
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setUploadedImage(ev.target?.result as string);
      setAnalyzing(true);
      setTimeout(() => {
        setSelectedTone("medium"); // AI-detected — replace with real skin tone API
        setAnalyzing(false);
      }, 1800);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!selectedTone) return;
    setStep("loading");
    await new Promise((r) => setTimeout(r, 1800));
    setStep("results");
  };

  const Swatch = ({ color, size = 44 }: { color: string; size?: number }) => (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: color, border: "2px solid rgba(255,255,255,0.6)",
      boxShadow: "0 2px 8px rgba(0,0,0,0.12)", flexShrink: 0,
    }} />
  );

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#f8f6f2", minHeight: "100vh" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@500;700&display=swap" rel="stylesheet" />

      {/* ── Header ── */}
      <div style={{
        background: "#fff", padding: "20px 24px 16px", borderBottom: "1px solid #ece9e3",
        position: "sticky", top: 0, zIndex: 50,
      }}>
        {step !== "input" && (
          <button onClick={() => setStep("input")}
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: "22px", display: "block", marginBottom: "4px", color: "#1a1a1a" }}>
            ←
          </button>
        )}
        <h1 style={{ margin: 0, fontSize: "20px", fontWeight: 700, fontFamily: "'Playfair Display', serif", color: "#1a1a1a" }}>
          Color Analysis
        </h1>
        <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#888" }}>Discover your palette · Shop your colors</p>
      </div>

      {/* ── Step 1: Input ── */}
      {step === "input" && (
        <div style={{ padding: "24px", maxWidth: 560, margin: "0 auto" }}>

          {/* Upload */}
          <div style={{
            background: "#fff", borderRadius: "16px", padding: "20px",
            marginBottom: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div style={{
                width: 56, height: 56, borderRadius: "12px", overflow: "hidden",
                background: "#f3f0ea", flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {uploadedImage
                  ? <img src={uploadedImage} alt="selfie" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : <span style={{ fontSize: "24px" }}>📷</span>
                }
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "15px", fontWeight: 600, color: "#1a1a1a" }}>Use your selfie</div>
                <div style={{ fontSize: "12px", color: "#888" }}>
                  {analyzing ? "Detecting your skin tone..." : "AI detects skin tone automatically"}
                </div>
                {analyzing && (
                  <div style={{ marginTop: "6px", height: 3, background: "#f0ede7", borderRadius: 2, overflow: "hidden" }}>
                    <div style={{ height: "100%", background: "#1a1a1a", borderRadius: 2, animation: "progress 1.8s ease-in-out forwards" }} />
                  </div>
                )}
              </div>
              {!analyzing && (
                <button onClick={() => fileRef.current?.click()}
                  style={{
                    background: "#1a1a1a", color: "#fff", border: "none",
                    borderRadius: "10px", padding: "10px 18px", fontSize: "13px",
                    fontWeight: 600, cursor: "pointer",
                  }}>
                  Upload
                </button>
              )}
              <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageUpload} />
            </div>
          </div>

          {/* Manual tone select */}
          <p style={{ fontSize: "12px", fontWeight: 600, color: "#888", letterSpacing: "0.05em", marginBottom: "14px" }}>
            OR SELECT YOUR SKIN TONE
          </p>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "32px" }}>
            {SKIN_TONES.map((tone) => (
              <div key={tone.id} onClick={() => setSelectedTone(tone.id)}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", cursor: "pointer" }}>
                <div style={{
                  width: 52, height: 52, borderRadius: "14px", background: tone.color,
                  border: selectedTone === tone.id ? "3px solid #1a1a1a" : "3px solid transparent",
                  boxShadow: selectedTone === tone.id ? "0 0 0 2px #fff, 0 0 0 4px #1a1a1a" : "0 2px 8px rgba(0,0,0,0.12)",
                  transition: "all 0.2s",
                }} />
                <span style={{ fontSize: "11px", color: "#666", fontWeight: selectedTone === tone.id ? 600 : 400 }}>
                  {tone.label}
                </span>
              </div>
            ))}
          </div>

          <button onClick={handleAnalyze} disabled={!selectedTone}
            style={{
              width: "100%", padding: "16px",
              background: selectedTone ? "#1a1a1a" : "#e0ddd8",
              color: selectedTone ? "#fff" : "#aaa",
              border: "none", borderRadius: "14px", fontSize: "15px",
              fontWeight: 600, cursor: selectedTone ? "pointer" : "not-allowed",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
            }}>
            ✦ Analyze My Colors
          </button>

          <style>{`@keyframes progress { from { width: 0% } to { width: 100% } }`}</style>
        </div>
      )}

      {/* ── Loading ── */}
      {step === "loading" && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: "20px" }}>
          <div style={{
            width: 80, height: 80, borderRadius: "50%",
            background: `radial-gradient(circle, ${SKIN_TONES.find(t => t.id === selectedTone)?.color || "#e8b98a"}, #f8f6f2)`,
            animation: "pulse 1.2s ease-in-out infinite",
          }} />
          <p style={{ color: "#888", fontSize: "15px", fontWeight: 500 }}>Analyzing your color palette...</p>
          <style>{`@keyframes pulse { 0%,100%{transform:scale(1);opacity:0.8}50%{transform:scale(1.1);opacity:1} }`}</style>
        </div>
      )}

      {/* ── Results ── */}
      {step === "results" && palette && (
        <div style={{ padding: "24px", maxWidth: 720, margin: "0 auto" }}>

          {/* Season card */}
          <div style={{
            background: "#fff", borderRadius: "20px", padding: "20px",
            marginBottom: "18px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            borderLeft: `4px solid ${palette.accent}`,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
              <div style={{
                width: 48, height: 48, borderRadius: "50%",
                background: SKIN_TONES.find(t => t.id === selectedTone)?.color,
                border: "2px solid #fff", boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              }} />
              <div>
                <div style={{ fontSize: "18px", fontWeight: 700, fontFamily: "'Playfair Display', serif", color: "#1a1a1a" }}>
                  {palette.season}
                </div>
                <div style={{ fontSize: "12px", color: "#888" }}>Your color season</div>
              </div>
            </div>
            <p style={{ fontSize: "13px", color: "#555", lineHeight: 1.6, margin: 0 }}>{palette.desc}</p>
          </div>

          {/* Neutrals */}
          <div style={{ background: "#fff", borderRadius: "16px", padding: "18px 20px", marginBottom: "14px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <div style={{ fontSize: "13px", fontWeight: 700, color: "#1a1a1a", marginBottom: "12px" }}>Your Neutrals</div>
            <div style={{ display: "flex", gap: "12px" }}>
              {palette.neutrals.map((c, i) => <Swatch key={i} color={c} />)}
            </div>
          </div>

          {/* Power colors */}
          <div style={{ background: "#fff", borderRadius: "16px", padding: "18px 20px", marginBottom: "14px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <div style={{ fontSize: "13px", fontWeight: 700, color: "#1a1a1a", marginBottom: "12px" }}>Power Colors ✦</div>
            <div style={{ display: "flex", gap: "12px" }}>
              {palette.power.map((c, i) => <Swatch key={i} color={c} />)}
            </div>
          </div>

          {/* Stylist tip */}
          <div style={{
            background: `${palette.accent}18`,
            borderRadius: "14px", padding: "16px 20px", marginBottom: "20px",
            border: `1.5px solid ${palette.accent}40`,
          }}>
            <div style={{ fontSize: "13px", fontWeight: 700, color: "#1a1a1a", marginBottom: "6px" }}>✦ Stylist Tip</div>
            <p style={{ margin: 0, fontSize: "13px", color: "#555", lineHeight: 1.6 }}>{palette.tip}</p>
          </div>

          {/* ── Shop Your Colors — from Azzro store ── */}
          <div style={{ marginBottom: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
              <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "#1a1a1a" }}>
                Shop Your Colors
              </h3>
              <span style={{ fontSize: "12px", color: "#888" }}>From Azzro store</span>
            </div>

            <div className="color-products-grid" style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "12px",
            }}>
              {recommendedProducts.map((product) => (
                <Link key={product.id} href={product.slug} style={{ textDecoration: "none" }}>
                  <div style={{
                    background: "#fff", borderRadius: "14px", overflow: "hidden",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.06)", cursor: "pointer",
                    transition: "transform 0.15s",
                  }}
                    onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"}
                    onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.transform = "translateY(0)"}
                  >
                    {/* Color dot match */}
                    <div style={{ position: "relative" }}>
                      <img src={product.image} alt={product.name}
                        style={{ width: "100%", height: 120, objectFit: "cover" }} />
                      <div style={{
                        position: "absolute", top: 6, left: 6,
                        width: 12, height: 12, borderRadius: "50%",
                        background: product.colorHex,
                        border: "2px solid #fff",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
                      }} />
                    </div>
                    <div style={{ padding: "8px 10px 10px" }}>
                      <div style={{ fontSize: "11px", fontWeight: 600, color: "#1a1a1a", lineHeight: 1.3, marginBottom: "2px" }}>
                        {product.name}
                      </div>
                      <div style={{ fontSize: "10px", color: "#aaa", marginBottom: "4px" }}>{product.brand}</div>
                      <div style={{ fontSize: "11px", color: "#e07070", fontWeight: 700 }}>
                        ₹{product.price.toLocaleString("en-IN")}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {recommendedProducts.length === 0 && (
              <div style={{ textAlign: "center", padding: "24px", color: "#aaa", fontSize: "13px" }}>
                No matching products found in store right now.
              </div>
            )}
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: "12px" }}>
            <button onClick={() => setStep("input")}
              style={{
                flex: 1, padding: "14px", background: "#fff",
                border: "1.5px solid #ece9e3", borderRadius: "14px",
                fontSize: "14px", fontWeight: 600, cursor: "pointer", color: "#1a1a1a",
              }}>
              Try Again
            </button>
            <button
              style={{
                flex: 1, padding: "14px", background: "#1a1a1a",
                border: "none", borderRadius: "14px",
                fontSize: "14px", fontWeight: 600, cursor: "pointer", color: "#fff",
              }}>
              Shop All My Colors
            </button>
          </div>

          {/* Responsive */}
          <style>{`
            @media (max-width: 600px) {
              .color-products-grid {
                grid-template-columns: repeat(2, 1fr) !important;
              }
            }
          `}</style>
        </div>
      )}
    </div>
  );
}
