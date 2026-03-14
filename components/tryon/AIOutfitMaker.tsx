"use client";

import { useState } from "react";

interface Props {
  onBack: () => void;
}

const categories = [
  { id: "wedding", label: "Wedding", emoji: "💍", color: "#FFF0F8", accent: "#c060a0" },
  { id: "office", label: "Office", emoji: "💼", color: "#EAF0FF", accent: "#3a5bd9" },
  { id: "college", label: "College", emoji: "🎓", color: "#E8F9F0", accent: "#1a8f52" },
  { id: "party", label: "Party", emoji: "🎉", color: "#FFF8E0", accent: "#b07800" },
  { id: "casual", label: "Casual", emoji: "☀️", color: "#FFE8EC", accent: "#c0485a" },
  { id: "sport", label: "Sport", emoji: "🏃", color: "#E8F4FF", accent: "#0070c0" },
  { id: "beach", label: "Beach", emoji: "🏖️", color: "#E8FFF8", accent: "#008060" },
  { id: "dinner", label: "Dinner", emoji: "🍷", color: "#F4E8FF", accent: "#7030a0" },
];

const outfitsByCategory: Record<string, { outfit: string[]; desc: string; style: string }[]> = {
  wedding: [
    { outfit: ["Flowy Maxi Dress", "Strappy Heels", "Floral Clutch", "Pearl Earrings"], desc: "Garden Wedding Guest", style: "Romantic & Feminine" },
    { outfit: ["Pastel Midi Dress", "Block Heels", "Wristlet", "Delicate Necklace"], desc: "Church Wedding Look", style: "Classic Elegance" },
  ],
  office: [
    { outfit: ["Tailored Blazer", "Straight-leg Trousers", "White Blouse", "Pointed Loafers"], desc: "Corporate Chic", style: "Power Dressing" },
    { outfit: ["Pencil Skirt", "Tucked Silk Blouse", "Kitten Heels", "Structured Tote"], desc: "Smart Professional", style: "Polished & Refined" },
  ],
  college: [
    { outfit: ["Cropped Hoodie", "High-waist Cargo Pants", "White Sneakers", "Mini Backpack"], desc: "Campus Cool", style: "Effortless Casual" },
    { outfit: ["Graphic Tee", "Mom Jeans", "Chunky Sneakers", "Baseball Cap"], desc: "Streetwear Flex", style: "Bold & Relaxed" },
  ],
  party: [
    { outfit: ["Sequin Mini Dress", "Strappy Heels", "Clutch Bag", "Statement Earrings"], desc: "Night Out", style: "Glam & Dazzling" },
    { outfit: ["Satin Slip Dress", "Mule Heels", "Mini Bag", "Layered Chains"], desc: "Cocktail Party", style: "Sleek & Sultry" },
  ],
  casual: [
    { outfit: ["White Linen Top", "Relaxed Jeans", "Canvas Sneakers", "Crossbody Bag"], desc: "Weekend Errands", style: "Laid-back Cool" },
    { outfit: ["Wrap Dress", "Flat Sandals", "Straw Bag", "Sunglasses"], desc: "Brunch Ready", style: "Breezy & Chic" },
  ],
  sport: [
    { outfit: ["Sports Bra", "High-waist Leggings", "Running Shoes", "Cap"], desc: "Gym Session", style: "Athleisure" },
    { outfit: ["Moisture-wicking Tee", "Joggers", "Trail Shoes", "Sport Socks"], desc: "Outdoor Run", style: "Performance Fit" },
  ],
  beach: [
    { outfit: ["Floral Bikini", "Linen Cover-up", "Flip Flops", "Oversized Hat"], desc: "Beach Day", style: "Tropical Vibes" },
    { outfit: ["One-piece Swimsuit", "Sarong Wrap", "Espadrilles", "Wicker Bag"], desc: "Resort Chic", style: "Vacation Ready" },
  ],
  dinner: [
    { outfit: ["Satin Midi Dress", "Block Heel Sandals", "Evening Clutch", "Drop Earrings"], desc: "Fine Dining", style: "Understated Luxury" },
    { outfit: ["Velvet Blazer", "Wide-leg Trousers", "Heeled Boots", "Gold Accessories"], desc: "Romantic Dinner", style: "Sophisticated Edge" },
  ],
};

export default function AIOutfitMaker({ onBack }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [outfits, setOutfits] = useState<{ outfit: string[]; desc: string; style: string }[]>([]);
  const [activeOutfit, setActiveOutfit] = useState(0);

  const handleGenerate = () => {
    if (!selected) return;
    setGenerating(true);
    setTimeout(() => {
      setOutfits(outfitsByCategory[selected] || []);
      setGenerating(false);
      setActiveOutfit(0);
    }, 1500);
  };

  const cat = categories.find(c => c.id === selected);

  return (
    <div className="min-h-screen bg-[#F7F5F2] font-['DM_Sans',sans-serif]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,600;1,500&display=swap');
        * { box-sizing: border-box; }
        .cat-card { transition: all 0.2s ease; }
        .cat-card:hover { transform: scale(1.04); }
        .cat-card.active { box-shadow: 0 0 0 3px currentColor; }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        .shimmer {
          background: linear-gradient(90deg, #f0ede8 25%, #e4e0da 50%, #f0ede8 75%);
          background-size: 200% 100%;
          animation: shimmer 1.2s ease infinite;
        }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .slide-up { animation: slideUp 0.4s ease both; }
      `}</style>

      <div className="max-w-[430px] mx-auto min-h-screen bg-white shadow-2xl">

        {/* Header */}
        <div className="px-5 pt-14 pb-4 flex items-center gap-4">
          <button onClick={onBack} className="w-9 h-9 rounded-full bg-[#F5F3EF] flex items-center justify-center">
            <svg width="18" height="18" fill="none" stroke="#1a1a1a" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <div>
            <h1 className="text-2xl font-['Playfair_Display'] font-semibold text-[#1a1a1a]">AI Outfit Maker</h1>
            <p className="text-xs text-[#888]">Choose an occasion to get started</p>
          </div>
        </div>

        {/* Category Grid */}
        <div className="px-5 mb-5">
          <p className="text-xs font-semibold text-[#888] uppercase tracking-wider mb-3">Select Occasion</p>
          <div className="grid grid-cols-4 gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => { setSelected(cat.id); setOutfits([]); }}
                className={`cat-card rounded-2xl py-3 flex flex-col items-center gap-1.5 border-2 transition-all ${
                  selected === cat.id ? "border-[#1a1a1a] bg-[#1a1a1a]" : "border-transparent bg-[#F5F3EF]"
                }`}
              >
                <span className="text-2xl">{cat.emoji}</span>
                <span className={`text-[10px] font-semibold ${selected === cat.id ? "text-white" : "text-[#555]"}`}>
                  {cat.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <div className="px-5 mb-5">
          <button
            onClick={handleGenerate}
            disabled={!selected || generating}
            className={`w-full py-4 rounded-2xl font-semibold text-sm transition-all ${
              selected && !generating
                ? "bg-[#1a1a1a] text-white hover:bg-[#333]"
                : "bg-[#E0DDD8] text-[#aaa] cursor-not-allowed"
            }`}
          >
            {generating ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin" width="16" height="16" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                </svg>
                Creating your outfit...
              </span>
            ) : selected ? (
              `✨ Generate ${categories.find(c => c.id === selected)?.label} Outfits`
            ) : (
              "Select an occasion first"
            )}
          </button>
        </div>

        {/* Skeleton Loading */}
        {generating && (
          <div className="px-5 pb-24">
            {[1, 2].map(i => (
              <div key={i} className="rounded-3xl overflow-hidden mb-4">
                <div className="shimmer h-40 rounded-3xl mb-2"/>
                <div className="shimmer h-4 rounded-full w-3/4 mb-2"/>
                <div className="shimmer h-4 rounded-full w-1/2"/>
              </div>
            ))}
          </div>
        )}

        {/* Generated Outfits */}
        {!generating && outfits.length > 0 && cat && (
          <div className="px-5 pb-24 slide-up">
            <p className="text-xs font-semibold text-[#888] uppercase tracking-wider mb-3">
              Generated Outfits — {cat.label}
            </p>

            {/* Tab selector */}
            <div className="flex gap-2 mb-4">
              {outfits.map((o, i) => (
                <button
                  key={i}
                  onClick={() => setActiveOutfit(i)}
                  className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${
                    activeOutfit === i
                      ? "text-white"
                      : "bg-[#F5F3EF] text-[#555]"
                  }`}
                  style={activeOutfit === i ? { background: cat.accent } : {}}
                >
                  Look {i + 1}
                </button>
              ))}
            </div>

            {/* Active Outfit */}
            {outfits[activeOutfit] && (
              <div className="rounded-3xl overflow-hidden p-5" style={{ background: cat.color }}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-[#1a1a1a] text-base">{outfits[activeOutfit].desc}</h3>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-white/60 mt-1 inline-block" style={{ color: cat.accent }}>
                      {outfits[activeOutfit].style}
                    </span>
                  </div>
                  <div className="text-4xl">{cat.emoji}</div>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-4">
                  {outfits[activeOutfit].outfit.map((item, i) => (
                    <div key={i} className="bg-white/70 rounded-2xl p-3 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: cat.accent }}/>
                      <span className="text-xs font-medium text-[#333]">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <button
                    className="flex-1 py-3 rounded-xl text-sm font-semibold text-white"
                    style={{ background: cat.accent }}
                  >
                    Try This Look
                  </button>
                  <button className="w-11 h-11 rounded-xl bg-white/60 flex items-center justify-center text-xl">
                    🔖
                  </button>
                  <button className="w-11 h-11 rounded-xl bg-white/60 flex items-center justify-center">
                    <svg width="18" height="18" fill="none" stroke="#555" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                      <polyline points="16 6 12 2 8 6"/>
                      <line x1="12" y1="2" x2="12" y2="15"/>
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Regenerate */}
            <button
              onClick={handleGenerate}
              className="w-full mt-4 py-3.5 rounded-2xl border-2 border-[#1a1a1a] text-sm font-semibold text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white transition-all"
            >
              🔄 Regenerate Outfits
            </button>
          </div>
        )}

      </div>
    </div>
  );
}