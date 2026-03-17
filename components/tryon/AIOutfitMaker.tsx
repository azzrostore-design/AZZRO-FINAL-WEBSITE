"use client";

import { useState } from "react";
import Link from "next/link";
import {
  STORE_PRODUCTS,
  getProductsByCategory,
  buildOutfitFromOccasion,
  type StoreProduct,
} from "@/lib/storeProducts";

const CATEGORIES = ["All", "Tops", "Bottoms", "Outerwear", "Footwear", "Accessories", "Dresses"] as const;

const SLOT_MAP: { slot: string; label: string; emoji: string; categories: string[] }[] = [
  { slot: "Top",    label: "Top / Dress",  emoji: "👕", categories: ["Tops", "Dresses"] },
  { slot: "Bottom", label: "Bottoms",      emoji: "👖", categories: ["Bottoms"] },
  { slot: "Outer",  label: "Outerwear",    emoji: "🧥", categories: ["Outerwear"] },
  { slot: "Shoes",  label: "Footwear",     emoji: "👟", categories: ["Footwear"] },
  { slot: "Acc",    label: "Accessory",    emoji: "👜", categories: ["Accessories"] },
];

const OCCASIONS_QUICK = ["Casual", "Office", "Date", "Party", "Coffee", "Beach"];

export default function AIOutfitMaker() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [selectedItems, setSelectedItems] = useState<Record<string, StoreProduct>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generatedMsg, setGeneratedMsg] = useState("");
  const [saved, setSaved] = useState(false);
  const [activeSlot, setActiveSlot] = useState<string | null>(null);

  // ── Filtered products ──────────────────────────────────────────────────────
  const filtered = STORE_PRODUCTS.filter((p) => {
    const catMatch = activeCategory === "All" || p.category === activeCategory;
    const searchMatch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase());
    return catMatch && searchMatch && p.inStock;
  });

  // ── Add item to correct slot ───────────────────────────────────────────────
  const addToSlot = (product: StoreProduct) => {
    const slotDef = SLOT_MAP.find((s) => s.categories.includes(product.category));
    if (slotDef) {
      setSelectedItems((prev) => ({ ...prev, [slotDef.slot]: product }));
      setActiveSlot(slotDef.slot);
    }
  };

  const removeSlot = (slot: string) => {
    setSelectedItems((prev) => {
      const next = { ...prev };
      delete next[slot];
      return next;
    });
  };

  // ── AI generate outfit from a quick occasion ───────────────────────────────
  const generateOutfit = async (occasion?: string) => {
    setGenerating(true);
    setGeneratedMsg("");
    await new Promise((r) => setTimeout(r, 1600));

    const occ = occasion ?? "casual";
    const outfit = buildOutfitFromOccasion(occ);

    const mapped: Record<string, StoreProduct> = {};
    if (outfit.top)       mapped["Top"]    = outfit.top;
    if (outfit.bottom)    mapped["Bottom"] = outfit.bottom;
    if (outfit.outer)     mapped["Outer"]  = outfit.outer;
    if (outfit.shoes)     mapped["Shoes"]  = outfit.shoes;
    if (outfit.accessory) mapped["Acc"]    = outfit.accessory;

    setSelectedItems(mapped);
    setGeneratedMsg(`✦ AI styled a ${occ} outfit from Azzro store`);
    setGenerating(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const hasItems = Object.keys(selectedItems).length > 0;
  const totalPrice = Object.values(selectedItems).reduce((s, p) => s + p.price, 0);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#f8f6f2", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@500;700&display=swap" rel="stylesheet" />

      {/* ── Header ── */}
      <div style={{
        background: "#fff", padding: "18px 24px 14px", borderBottom: "1px solid #ece9e3",
        position: "sticky", top: 0, zIndex: 50,
      }}>
        <h1 style={{ margin: 0, fontSize: "20px", fontWeight: 700, fontFamily: "'Playfair Display', serif", color: "#1a1a1a" }}>
          AI Outfit Maker
        </h1>
        <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#888" }}>
          Pick from Azzro store · or let AI build it
        </p>
      </div>

      {/* ── AI Generate Quick Bar ── */}
      <div style={{
        background: "#fff", padding: "12px 20px", borderBottom: "1px solid #f0ede7",
        display: "flex", alignItems: "center", gap: "10px", overflowX: "auto",
      }}>
        <span style={{ fontSize: "12px", color: "#888", whiteSpace: "nowrap", fontWeight: 500 }}>
          AI Style for:
        </span>
        {OCCASIONS_QUICK.map((occ) => (
          <button key={occ} onClick={() => generateOutfit(occ.toLowerCase())}
            disabled={generating}
            style={{
              padding: "6px 14px", borderRadius: "20px", border: "1.5px solid #ece9e3",
              background: "#f8f6f2", fontSize: "12px", fontWeight: 500, cursor: "pointer",
              color: "#555", whiteSpace: "nowrap", flexShrink: 0,
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#1a1a1a"; (e.currentTarget as HTMLElement).style.color = "#fff"; (e.currentTarget as HTMLElement).style.borderColor = "#1a1a1a"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "#f8f6f2"; (e.currentTarget as HTMLElement).style.color = "#555"; (e.currentTarget as HTMLElement).style.borderColor = "#ece9e3"; }}
          >
            {occ}
          </button>
        ))}
        <button onClick={() => generateOutfit()}
          disabled={generating}
          style={{
            padding: "6px 18px", borderRadius: "20px", border: "none",
            background: "linear-gradient(135deg, #667eea, #764ba2)",
            color: "#fff", fontSize: "12px", fontWeight: 600, cursor: "pointer",
            whiteSpace: "nowrap", flexShrink: 0,
          }}>
          {generating ? "Styling..." : "✦ Surprise Me"}
        </button>
      </div>

      {/* ── Generated message ── */}
      {generatedMsg && (
        <div style={{
          background: "#f0faf4", borderBottom: "1px solid #c8e8d8",
          padding: "10px 20px", fontSize: "13px", color: "#2a7a4a", fontWeight: 500,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          {generatedMsg}
          <button onClick={() => setGeneratedMsg("")}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#888", fontSize: "16px" }}>
            ×
          </button>
        </div>
      )}

      {/* ── Category Filter ── */}
      <div style={{ background: "#fff", padding: "10px 16px 12px", borderBottom: "1px solid #f0ede7" }}>
        <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "2px" }}>
          {CATEGORIES.map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              style={{
                padding: "6px 16px", borderRadius: "20px", border: "none", cursor: "pointer",
                fontSize: "12px", fontWeight: 500, whiteSpace: "nowrap",
                background: activeCategory === cat ? "#1a1a1a" : "#f3f0ea",
                color: activeCategory === cat ? "#fff" : "#555",
                transition: "all 0.15s", flexShrink: 0,
              }}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── Main split layout ── */}
      <div className="outfit-maker-layout" style={{ display: "flex", flex: 1 }}>

        {/* Left: Outfit Canvas */}
        <div className="outfit-canvas" style={{
          width: "300px", minWidth: "260px", background: "#fff",
          borderRight: "1px solid #ece9e3", padding: "16px",
          display: "flex", flexDirection: "column", flexShrink: 0,
        }}>
          <div style={{ fontSize: "12px", color: "#aaa", marginBottom: "12px", textAlign: "center" }}>
            Tap item from catalog to add
          </div>

          {/* Slots */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", flex: 1 }}>
            {SLOT_MAP.map(({ slot, label, emoji }) => {
              const item = selectedItems[slot];
              return (
                <div key={slot}
                  onClick={() => setActiveSlot(activeSlot === slot ? null : slot)}
                  style={{
                    borderRadius: "12px",
                    border: activeSlot === slot ? "2px solid #1a1a1a" : item ? "2px solid #e0ddd8" : "2px dashed #ddd",
                    background: item ? "#faf9f7" : "#fff",
                    padding: "10px 12px", cursor: "pointer",
                    display: "flex", alignItems: "center", gap: "10px",
                    minHeight: "60px", transition: "all 0.2s",
                  }}>
                  {item ? (
                    <>
                      <img src={item.image} alt={item.name}
                        style={{ width: 44, height: 52, objectFit: "cover", borderRadius: "8px", flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: "12px", fontWeight: 600, color: "#1a1a1a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {item.name}
                        </div>
                        <div style={{ fontSize: "11px", color: "#e07070", fontWeight: 600 }}>
                          ₹{item.price.toLocaleString("en-IN")}
                        </div>
                        <div style={{ fontSize: "10px", color: "#aaa" }}>{item.brand}</div>
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); removeSlot(slot); }}
                        style={{ background: "none", border: "none", cursor: "pointer", color: "#ccc", fontSize: "18px", flexShrink: 0 }}>
                        ×
                      </button>
                    </>
                  ) : (
                    <>
                      <span style={{ fontSize: "20px" }}>{emoji}</span>
                      <span style={{ fontSize: "12px", color: "#bbb" }}>Add {label}</span>
                      <span style={{ marginLeft: "auto", color: "#ddd", fontSize: "18px" }}>+</span>
                    </>
                  )}
                </div>
              );
            })}
          </div>

          {/* Total + Actions */}
          {hasItems && (
            <div style={{
              marginTop: "14px", padding: "12px 14px", background: "#f8f6f2",
              borderRadius: "12px", marginBottom: "12px",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "12px", color: "#888" }}>Total</span>
                <span style={{ fontSize: "15px", fontWeight: 700, color: "#1a1a1a" }}>
                  ₹{totalPrice.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          )}

          <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
            <button onClick={handleSave} disabled={!hasItems}
              style={{
                flex: 1, padding: "11px 8px", background: hasItems ? "#1a1a1a" : "#ccc",
                color: "#fff", border: "none", borderRadius: "10px",
                fontSize: "12px", fontWeight: 600, cursor: hasItems ? "pointer" : "not-allowed",
              }}>
              {saved ? "✓ Saved!" : "Save Outfit"}
            </button>
            {hasItems && (
              <button
                style={{
                  flex: 1, padding: "11px 8px", background: "#fff",
                  border: "1.5px solid #1a1a1a", borderRadius: "10px",
                  fontSize: "12px", fontWeight: 600, cursor: "pointer", color: "#1a1a1a",
                }}>
                Shop All
              </button>
            )}
          </div>
        </div>

        {/* Right: Product Catalog */}
        <div style={{ flex: 1, padding: "16px", overflowY: "auto" }}>
          {/* Search */}
          <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Azzro store..."
            style={{
              width: "100%", padding: "10px 14px", border: "1.5px solid #ece9e3",
              borderRadius: "10px", fontSize: "13px", color: "#1a1a1a",
              background: "#fff", outline: "none", marginBottom: "14px",
              boxSizing: "border-box",
            }} />

          {/* Product grid */}
          <div className="product-grid" style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "10px",
          }}>
            {filtered.map((product) => {
              const isSelected = Object.values(selectedItems).some((s) => s.id === product.id);
              return (
                <div key={product.id} onClick={() => addToSlot(product)}
                  style={{
                    borderRadius: "12px", overflow: "hidden",
                    border: isSelected ? "2px solid #1a1a1a" : "2px solid transparent",
                    background: "#fff", cursor: "pointer", position: "relative",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)", transition: "all 0.15s",
                  }}>
                  {isSelected && (
                    <div style={{
                      position: "absolute", top: 6, right: 6, zIndex: 2,
                      background: "#1a1a1a", color: "#fff", width: 20, height: 20,
                      borderRadius: "50%", display: "flex", alignItems: "center",
                      justifyContent: "center", fontSize: "10px",
                    }}>✓</div>
                  )}
                  <img src={product.image} alt={product.name}
                    style={{ width: "100%", height: 100, objectFit: "cover" }} />
                  <div style={{ padding: "8px 10px 10px" }}>
                    <div style={{ fontSize: "11px", fontWeight: 600, color: "#1a1a1a", lineHeight: 1.3, marginBottom: "2px" }}>
                      {product.name}
                    </div>
                    <div style={{ fontSize: "10px", color: "#aaa", marginBottom: "4px" }}>
                      {product.brand}
                    </div>
                    <div style={{ fontSize: "11px", color: "#e07070", fontWeight: 700 }}>
                      ₹{product.price.toLocaleString("en-IN")}
                    </div>
                    {product.originalPrice && (
                      <div style={{ fontSize: "10px", color: "#bbb", textDecoration: "line-through" }}>
                        ₹{product.originalPrice.toLocaleString("en-IN")}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "40px 0", color: "#aaa", fontSize: "14px" }}>
              No products found. Try a different search.
            </div>
          )}
        </div>
      </div>

      {/* ── Responsive ── */}
      <style>{`
        @media (max-width: 768px) {
          .outfit-maker-layout {
            flex-direction: column !important;
          }
          .outfit-canvas {
            width: 100% !important;
            min-width: unset !important;
            border-right: none !important;
            border-bottom: 1px solid #ece9e3 !important;
            padding: 14px 16px !important;
          }
          .product-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        @media (max-width: 480px) {
          .product-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </div>
  );
}
