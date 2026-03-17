"use client";

import { useState } from "react";
import Link from "next/link";
import {
  STORE_PRODUCTS,
  getProductsByOccasion,
  buildOutfitFromOccasion,
  type StoreProduct,
} from "@/lib/storeProducts";

// ── Constants ─────────────────────────────────────────────────────────────────

const OCCASIONS = ["Date", "Coffee", "Interview", "Party", "Beach", "Casual", "Office", "Travel"];

const STYLE_TAGS = ["Minimal", "Timeless", "Bohemian", "Streetwear", "Trendy", "Elegant"];

const AI_STYLISTS = [
  {
    id: "eli",
    name: "Eli",
    style: "Minimal • Timeless",
    desc: "Clean lines, neutral palettes",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
    preferredTags: ["minimal", "timeless", "classic", "elegant"],
  },
  {
    id: "zara",
    name: "Zara",
    style: "Trendy • Bold",
    desc: "Fashion-forward, statement looks",
    avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop&crop=face",
    preferredTags: ["trendy", "streetwear", "bold"],
  },
  {
    id: "maya",
    name: "Maya",
    style: "Bohemian • Earthy",
    desc: "Natural textures, flowing silhouettes",
    avatar: "https://images.unsplash.com/photo-1502823403499-6ccfcef4fb453?w=100&h=100&fit=crop&crop=face",
    preferredTags: ["bohemian", "casual", "feminine"],
  },
];

// ── Types ─────────────────────────────────────────────────────────────────────

interface OutfitBundle {
  id: number;
  title: string;
  matchScore: number;
  products: StoreProduct[];
  liked: boolean;
  totalPrice: number;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function AISuggestions() {
  const [step, setStep] = useState<"stylist" | "request" | "results">("stylist");
  const [selectedStylist, setSelectedStylist] = useState(AI_STYLISTS[0]);
  const [selectedOccasion, setSelectedOccasion] = useState("");
  const [occasionOpen, setOccasionOpen] = useState(false);
  const [vibeText, setVibeText] = useState("");
  const [additionalPrompt, setAdditionalPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [outfits, setOutfits] = useState<OutfitBundle[]>([]);
  const [expandedOutfit, setExpandedOutfit] = useState<number | null>(null);

  // ── Generate outfits from store products ──────────────────────────────────

  const generateOutfits = async () => {
    if (!selectedOccasion) return;
    setLoading(true);
    setStep("results");
    await new Promise((r) => setTimeout(r, 1800));

    const bundles: OutfitBundle[] = [];

    for (let i = 0; i < 3; i++) {
      const outfit = buildOutfitFromOccasion(selectedOccasion);
      const products = Object.values(outfit).filter(Boolean) as StoreProduct[];

      // Filter by stylist preferred tags where possible
      const stylistFiltered = products.map((p) => {
        const stylistMatch = STORE_PRODUCTS.find(
          (sp) =>
            sp.category === p.category &&
            sp.occasions.includes(selectedOccasion.toLowerCase()) &&
            selectedStylist.preferredTags.some((t) => sp.tags.includes(t)) &&
            sp.inStock
        );
        return stylistMatch ?? p;
      });

      const unique = Array.from(new Map(stylistFiltered.map((p) => [p.id, p])).values());
      const totalPrice = unique.reduce((sum, p) => sum + p.price, 0);
      const score = Math.round(78 + Math.random() * 18);

      bundles.push({
        id: i + 1,
        title: i === 0
          ? `Perfect ${selectedOccasion} Look`
          : i === 1
          ? `Casual ${selectedOccasion} Vibe`
          : `Chic ${selectedOccasion} Edit`,
        matchScore: score,
        products: unique,
        liked: false,
        totalPrice,
      });
    }

    setOutfits(bundles);
    setLoading(false);
  };

  const toggleLike = (id: number) =>
    setOutfits((prev) => prev.map((o) => (o.id === id ? { ...o, liked: !o.liked } : o)));

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#f8f6f2", minHeight: "100vh" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@500;700&display=swap" rel="stylesheet" />

      {/* ── Header ── */}
      <div style={{
        background: "#fff", padding: "20px 24px 16px", borderBottom: "1px solid #ece9e3",
        display: "flex", alignItems: "center", gap: "12px", position: "sticky", top: 0, zIndex: 50,
      }}>
        {step !== "stylist" && (
          <button onClick={() => setStep(step === "results" ? "request" : "stylist")}
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: "22px", color: "#1a1a1a" }}>
            ←
          </button>
        )}
        <div>
          <h1 style={{ margin: 0, fontSize: "20px", fontWeight: 700, fontFamily: "'Playfair Display', serif", color: "#1a1a1a" }}>
            AI Suggestions
          </h1>
          <p style={{ margin: 0, fontSize: "12px", color: "#888" }}>Outfits from Azzro store</p>
        </div>
      </div>

      {/* ── Step 1: Choose Stylist ── */}
      {step === "stylist" && (
        <div style={{ padding: "24px", maxWidth: 640, margin: "0 auto" }}>
          <h2 style={{ fontSize: "16px", fontWeight: 600, color: "#1a1a1a", marginBottom: "6px" }}>Choose Your AI Stylist</h2>
          <p style={{ fontSize: "13px", color: "#888", marginBottom: "24px" }}>Each stylist curates from Azzro's catalog differently</p>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {AI_STYLISTS.map((stylist) => (
              <div key={stylist.id} onClick={() => setSelectedStylist(stylist)}
                style={{
                  background: "#fff", borderRadius: "16px", padding: "18px 20px",
                  display: "flex", alignItems: "center", gap: "16px", cursor: "pointer",
                  border: selectedStylist.id === stylist.id ? "2px solid #1a1a1a" : "2px solid transparent",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.06)", transition: "all 0.2s",
                }}>
                <div style={{ position: "relative" }}>
                  <img src={stylist.avatar} alt={stylist.name}
                    style={{ width: 60, height: 60, borderRadius: "50%", objectFit: "cover" }} />
                  {selectedStylist.id === stylist.id && (
                    <div style={{
                      position: "absolute", bottom: 0, right: 0, width: 20, height: 20,
                      borderRadius: "50%", background: "#1a1a1a", color: "#fff",
                      display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px",
                    }}>✓</div>
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "16px", fontWeight: 700, color: "#1a1a1a" }}>{stylist.name}</div>
                  <div style={{ fontSize: "12px", color: "#888", marginBottom: "6px" }}>{stylist.style}</div>
                  <div style={{ fontSize: "11px", background: "#f3f0ea", display: "inline-block", padding: "2px 10px", borderRadius: "20px", color: "#555" }}>
                    {stylist.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button onClick={() => setStep("request")}
            style={{
              width: "100%", padding: "16px", background: "#1a1a1a", color: "#fff",
              border: "none", borderRadius: "14px", fontSize: "15px", fontWeight: 600,
              cursor: "pointer", marginTop: "32px",
            }}>
            Continue with {selectedStylist.name}
          </button>
        </div>
      )}

      {/* ── Step 2: Request ── */}
      {step === "request" && (
        <div style={{ padding: "24px", maxWidth: 640, margin: "0 auto" }}>
          {/* Stylist mini card */}
          <div style={{
            background: "#fff", borderRadius: "14px", padding: "16px 20px",
            display: "flex", alignItems: "center", gap: "14px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)", marginBottom: "24px",
          }}>
            <img src={selectedStylist.avatar} alt={selectedStylist.name}
              style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover" }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "14px", fontWeight: 700, color: "#1a1a1a" }}>{selectedStylist.name}</div>
              <div style={{ fontSize: "11px", color: "#aaa" }}>{selectedStylist.style} • AI Stylist ✦</div>
            </div>
            <button onClick={() => setStep("stylist")}
              style={{ background: "#f3f0ea", border: "none", borderRadius: "20px", padding: "6px 14px", fontSize: "12px", color: "#555", cursor: "pointer", fontWeight: 500 }}>
              Change
            </button>
          </div>

          {/* Occasion */}
          <label style={{ fontSize: "14px", fontWeight: 600, color: "#1a1a1a", display: "block", marginBottom: "10px" }}>
            Select Occasion
          </label>
          <div onClick={() => setOccasionOpen(!occasionOpen)}
            style={{
              background: "#fff", borderRadius: "12px", padding: "14px 16px",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              border: "1.5px solid #ece9e3", cursor: "pointer", marginBottom: "4px",
            }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span>👗</span>
              <span style={{ fontSize: "14px", color: selectedOccasion ? "#1a1a1a" : "#bbb" }}>
                {selectedOccasion || "Choose an occasion"}
              </span>
            </div>
            <span style={{ color: "#888", transition: "0.2s", transform: occasionOpen ? "rotate(180deg)" : "none" }}>▾</span>
          </div>
          {occasionOpen && (
            <div style={{
              background: "#fff", borderRadius: "12px", border: "1.5px solid #ece9e3",
              overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.1)", marginBottom: "16px",
            }}>
              {OCCASIONS.map((occ) => (
                <div key={occ} onClick={() => { setSelectedOccasion(occ); setOccasionOpen(false); }}
                  style={{
                    padding: "12px 16px", fontSize: "14px", cursor: "pointer",
                    fontWeight: selectedOccasion === occ ? 600 : 400,
                    background: selectedOccasion === occ ? "#f8f6f2" : "transparent",
                    borderBottom: "1px solid #f0ede7", color: "#1a1a1a",
                  }}>
                  {occ}
                </div>
              ))}
            </div>
          )}

          {/* Vibe */}
          <input value={vibeText} onChange={(e) => setVibeText(e.target.value)}
            placeholder="Describe the vibe... (e.g. boho summer dinner)"
            style={{
              width: "100%", padding: "14px 16px", background: "#fff",
              border: "1.5px solid #ece9e3", borderRadius: "12px", fontSize: "14px",
              color: "#1a1a1a", outline: "none", marginBottom: "16px", boxSizing: "border-box",
            }} />

          {/* Additional prompt */}
          <label style={{ fontSize: "14px", fontWeight: 600, color: "#1a1a1a", display: "block", marginBottom: "8px" }}>
            Additional Notes <span style={{ color: "#aaa", fontWeight: 400 }}>(optional)</span>
          </label>
          <textarea value={additionalPrompt} onChange={(e) => setAdditionalPrompt(e.target.value.slice(0, 200))}
            placeholder="Body type, color preferences, budget..."
            rows={3}
            style={{
              width: "100%", padding: "14px 16px", background: "#fff",
              border: "1.5px solid #ece9e3", borderRadius: "12px", fontSize: "14px",
              color: "#1a1a1a", outline: "none", resize: "none", boxSizing: "border-box", marginBottom: "4px",
            }} />
          <div style={{ fontSize: "11px", color: "#bbb", textAlign: "right", marginBottom: "28px" }}>
            {additionalPrompt.length}/200
          </div>

          <button onClick={generateOutfits} disabled={!selectedOccasion}
            style={{
              width: "100%", padding: "16px",
              background: selectedOccasion ? "#1a1a1a" : "#ccc",
              color: "#fff", border: "none", borderRadius: "14px",
              fontSize: "15px", fontWeight: 600, cursor: selectedOccasion ? "pointer" : "not-allowed",
            }}>
            ✦ Generate Outfits from Store
          </button>
        </div>
      )}

      {/* ── Step 3: Results ── */}
      {step === "results" && (
        <div style={{ padding: "24px", maxWidth: 720, margin: "0 auto" }}>
          <h2 style={{ fontSize: "16px", fontWeight: 600, color: "#1a1a1a", marginBottom: "2px" }}>
            Your Outfit Picks
          </h2>
          <p style={{ fontSize: "12px", color: "#888", marginBottom: "20px" }}>
            Styled by {selectedStylist.name} · {selectedOccasion} occasion · From Azzro store
          </p>

          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", padding: "60px 0" }}>
              <div style={{
                width: 48, height: 48, borderRadius: "50%",
                border: "3px solid #f0ede7", borderTopColor: "#1a1a1a",
                animation: "spin 0.8s linear infinite",
              }} />
              <p style={{ color: "#888", fontSize: "14px" }}>Curating from Azzro catalog...</p>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {outfits.map((outfit) => (
                <div key={outfit.id} style={{
                  background: "#fff", borderRadius: "20px", overflow: "hidden",
                  boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
                }}>
                  {/* Outfit header */}
                  <div style={{ padding: "18px 20px 12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ fontSize: "15px", fontWeight: 700, color: "#1a1a1a" }}>{outfit.title}</div>
                      <div style={{ fontSize: "12px", color: "#888", marginTop: "2px" }}>
                        {outfit.products.length} items · ₹{outfit.totalPrice.toLocaleString("en-IN")}
                      </div>
                    </div>
                    <div style={{
                      background: "#f0faf4", color: "#2a8a5a", borderRadius: "20px",
                      padding: "4px 12px", fontSize: "13px", fontWeight: 700,
                    }}>
                      {outfit.matchScore}% match
                    </div>
                  </div>

                  {/* Product scroll */}
                  <div style={{
                    display: "flex", gap: "10px", padding: "0 20px 16px",
                    overflowX: "auto", scrollbarWidth: "none",
                  }}>
                    {outfit.products.map((product) => (
                      <Link key={product.id} href={product.slug} style={{ textDecoration: "none", flexShrink: 0 }}>
                        <div style={{ width: 110, cursor: "pointer" }}>
                          <div style={{ borderRadius: "12px", overflow: "hidden", marginBottom: "8px", height: 130 }}>
                            <img src={product.image} alt={product.name}
                              style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          </div>
                          <div style={{ fontSize: "11px", fontWeight: 600, color: "#1a1a1a", lineHeight: 1.3 }}>
                            {product.name}
                          </div>
                          <div style={{ fontSize: "11px", color: "#e07070", fontWeight: 600, marginTop: "2px" }}>
                            ₹{product.price.toLocaleString("en-IN")}
                          </div>
                          <div style={{ fontSize: "10px", color: "#aaa" }}>{product.category}</div>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* See more toggle */}
                  <div
                    onClick={() => setExpandedOutfit(expandedOutfit === outfit.id ? null : outfit.id)}
                    style={{ padding: "0 20px 10px", cursor: "pointer" }}
                  >
                    <span style={{ fontSize: "12px", color: "#888", textDecoration: "underline" }}>
                      {expandedOutfit === outfit.id ? "Show less" : "View all items →"}
                    </span>
                  </div>

                  {/* Actions */}
                  <div style={{ padding: "12px 20px 18px", display: "flex", gap: "10px", borderTop: "1px solid #f3f0ea" }}>
                    <button onClick={() => toggleLike(outfit.id)}
                      style={{
                        flex: 1, padding: "10px", borderRadius: "10px",
                        border: "1.5px solid #ece9e3",
                        background: outfit.liked ? "#1a1a1a" : "#fff",
                        color: outfit.liked ? "#fff" : "#1a1a1a",
                        fontSize: "13px", fontWeight: 600, cursor: "pointer",
                      }}>
                      {outfit.liked ? "♥ Saved" : "♡ Save Look"}
                    </button>
                    <button
                      style={{
                        flex: 1, padding: "10px", borderRadius: "10px",
                        background: "#1a1a1a", border: "none",
                        color: "#fff", fontSize: "13px", fontWeight: 600, cursor: "pointer",
                      }}>
                      Shop All Items
                    </button>
                  </div>
                </div>
              ))}

              <button onClick={() => { setStep("request"); setOutfits([]); }}
                style={{
                  width: "100%", padding: "14px", background: "transparent",
                  border: "1.5px solid #1a1a1a", borderRadius: "14px",
                  fontSize: "14px", fontWeight: 600, cursor: "pointer", color: "#1a1a1a",
                }}>
                Try Another Occasion
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
