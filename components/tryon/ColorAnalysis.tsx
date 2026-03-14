"use client";

import { useState } from "react";

interface Props {
  onBack: () => void;
}

const skinTones = [
  { id: "fair", label: "Fair", hex: "#FDDBB4", season: "Winter / Summer" },
  { id: "light", label: "Light", hex: "#F5C89A", season: "Spring / Summer" },
  { id: "medium", label: "Medium", hex: "#E0A87C", season: "Spring / Autumn" },
  { id: "tan", label: "Tan", hex: "#C68642", season: "Autumn / Summer" },
  { id: "deep", label: "Deep", hex: "#8D5524", season: "Autumn / Winter" },
  { id: "rich", label: "Rich", hex: "#4A2912", season: "Winter / Deep" },
];

const colorPalettes: Record<string, {
  best: { color: string; name: string; why: string }[];
  avoid: { color: string; name: string }[];
  season: string;
  desc: string;
}> = {
  fair: {
    season: "Cool Winter",
    desc: "Your cool undertones shine with high-contrast, vivid shades.",
    best: [
      { color: "#1C3A6B", name: "Navy Blue", why: "Creates stunning contrast" },
      { color: "#8B0000", name: "Deep Red", why: "Adds rich warmth" },
      { color: "#1B5E20", name: "Forest Green", why: "Balances your complexion" },
      { color: "#4A148C", name: "Deep Purple", why: "Enhances cool tones" },
      { color: "#212121", name: "Jet Black", why: "Bold & striking" },
      { color: "#880E4F", name: "Berry", why: "Romantic & vibrant" },
    ],
    avoid: [
      { color: "#FFF9C4", name: "Pale Yellow" },
      { color: "#FFCCBC", name: "Peach" },
      { color: "#F8BBD0", name: "Baby Pink" },
    ],
  },
  light: {
    season: "Light Spring",
    desc: "Soft, warm, and delicate tones complement your natural glow.",
    best: [
      { color: "#81C784", name: "Soft Sage", why: "Gentle & flattering" },
      { color: "#64B5F6", name: "Sky Blue", why: "Bright & refreshing" },
      { color: "#F06292", name: "Warm Pink", why: "Adds lovely color" },
      { color: "#FFB74D", name: "Peach", why: "Enhances warmth" },
      { color: "#A5D6A7", name: "Mint", why: "Fresh & glowing" },
      { color: "#CE93D8", name: "Lavender", why: "Soft & romantic" },
    ],
    avoid: [
      { color: "#212121", name: "Jet Black" },
      { color: "#4E342E", name: "Dark Brown" },
      { color: "#37474F", name: "Charcoal" },
    ],
  },
  medium: {
    season: "True Autumn",
    desc: "Earth tones and warm hues mirror your natural radiance.",
    best: [
      { color: "#BF360C", name: "Burnt Orange", why: "Mirrors warmth perfectly" },
      { color: "#6D4C41", name: "Warm Brown", why: "Natural harmony" },
      { color: "#F9A825", name: "Mustard", why: "Glowing complement" },
      { color: "#558B2F", name: "Olive Green", why: "Earthy & rich" },
      { color: "#4E342E", name: "Chocolate", why: "Deep & sophisticated" },
      { color: "#E65100", name: "Terracotta", why: "Stunning warmth" },
    ],
    avoid: [
      { color: "#B0BEC5", name: "Light Gray" },
      { color: "#E1F5FE", name: "Pale Blue" },
      { color: "#F3E5F5", name: "Pastel Purple" },
    ],
  },
  tan: {
    season: "Warm Summer",
    desc: "Jewel tones and saturated shades bring out your luminosity.",
    best: [
      { color: "#0D47A1", name: "Royal Blue", why: "Bold contrast" },
      { color: "#1B5E20", name: "Emerald", why: "Rich & vibrant" },
      { color: "#B71C1C", name: "Crimson", why: "Powerful energy" },
      { color: "#4527A0", name: "Violet", why: "Luxurious depth" },
      { color: "#F57F17", name: "Golden", why: "Warm luminosity" },
      { color: "#006064", name: "Teal", why: "Striking complement" },
    ],
    avoid: [
      { color: "#FFF8E1", name: "Cream" },
      { color: "#FCE4EC", name: "Blush Pink" },
      { color: "#E8F5E9", name: "Mint White" },
    ],
  },
  deep: {
    season: "Deep Autumn",
    desc: "Rich, bold colors create beautiful contrast with your complexion.",
    best: [
      { color: "#FF6F00", name: "Deep Orange", why: "Vibrant & striking" },
      { color: "#FFCA28", name: "Golden Yellow", why: "Luminous glow" },
      { color: "#00695C", name: "Deep Teal", why: "Luxurious depth" },
      { color: "#AD1457", name: "Magenta", why: "Bold & beautiful" },
      { color: "#558B2F", name: "Rich Olive", why: "Natural harmony" },
      { color: "#6A1B9A", name: "Deep Plum", why: "Regal elegance" },
    ],
    avoid: [
      { color: "#E0E0E0", name: "Light Gray" },
      { color: "#FFCCBC", name: "Pale Peach" },
      { color: "#B3E5FC", name: "Light Blue" },
    ],
  },
  rich: {
    season: "Deep Winter",
    desc: "Bright jewel tones and stark contrasts amplify your power.",
    best: [
      { color: "#FFFFFF", name: "Pure White", why: "Maximum contrast" },
      { color: "#FF1744", name: "Bright Red", why: "Electric energy" },
      { color: "#00B0FF", name: "Electric Blue", why: "Vivid & striking" },
      { color: "#00E676", name: "Emerald Green", why: "Bold vibrancy" },
      { color: "#AA00FF", name: "Neon Violet", why: "Dramatic impact" },
      { color: "#FFD600", name: "Vivid Yellow", why: "Radiant warmth" },
    ],
    avoid: [
      { color: "#EFEBE9", name: "Beige" },
      { color: "#D7CCC8", name: "Taupe" },
      { color: "#FFF9C4", name: "Pastel Yellow" },
    ],
  },
};

export default function ColorAnalysis({ onBack }: Props) {
  const [selectedTone, setSelectedTone] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(false);

  const handleAnalyze = () => {
    if (!selectedTone) return;
    setAnalyzing(true);
    setResult(false);
    setTimeout(() => {
      setAnalyzing(false);
      setResult(true);
    }, 2000);
  };

  const palette = selectedTone ? colorPalettes[selectedTone] : null;

  return (
    <div className="min-h-screen bg-[#F7F5F2] font-['DM_Sans',sans-serif]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,600;1,500&display=swap');
        * { box-sizing: border-box; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .fade-in { animation: fadeIn 0.5s ease both; }
        @keyframes colorPop { 0% { transform: scale(0); opacity: 0; } 60% { transform: scale(1.15); } 100% { transform: scale(1); opacity: 1; } }
        .color-pop { animation: colorPop 0.4s ease both; }
        @keyframes rotateScan { 0% { transform: translateX(-100%); } 100% { transform: translateX(200%); } }
        .scan-line { animation: rotateScan 1.5s ease infinite; }
        .tone-btn { transition: all 0.2s ease; }
        .tone-btn:hover { transform: scale(1.08); }
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
            <h1 className="text-2xl font-['Playfair_Display'] font-semibold text-[#1a1a1a]">Color Analysis</h1>
            <p className="text-xs text-[#888]">Discover your best color palette</p>
          </div>
        </div>

        {/* Upload option */}
        <div className="mx-5 mb-5">
          <div className="rounded-2xl bg-gradient-to-r from-[#FFF8E8] to-[#FFEFC8] p-4 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-2xl flex-shrink-0">📷</div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-[#1a1a1a]">Use your selfie</p>
              <p className="text-xs text-[#666]">AI detects your skin tone automatically</p>
            </div>
            <button className="bg-[#1a1a1a] text-white text-xs font-semibold px-3 py-2 rounded-xl flex-shrink-0">
              Upload
            </button>
          </div>
        </div>

        {/* Manual tone selection */}
        <div className="px-5 mb-5">
          <p className="text-xs font-semibold text-[#888] uppercase tracking-wider mb-3">Or select your skin tone</p>
          <div className="grid grid-cols-6 gap-2">
            {skinTones.map((tone) => (
              <button
                key={tone.id}
                onClick={() => { setSelectedTone(tone.id); setResult(false); }}
                className="tone-btn flex flex-col items-center gap-1"
              >
                <div
                  className="w-12 h-12 rounded-2xl shadow-sm transition-all"
                  style={{
                    background: tone.hex,
                    boxShadow: selectedTone === tone.id ? `0 0 0 3px #1a1a1a, 0 0 0 5px ${tone.hex}` : "0 2px 8px rgba(0,0,0,0.1)"
                  }}
                />
                <span className="text-[9px] text-[#666] font-medium">{tone.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Analyze Button */}
        <div className="px-5 mb-6">
          <button
            onClick={handleAnalyze}
            disabled={!selectedTone || analyzing}
            className={`w-full py-4 rounded-2xl font-semibold text-sm transition-all ${
              selectedTone && !analyzing
                ? "bg-[#1a1a1a] text-white"
                : "bg-[#E0DDD8] text-[#aaa] cursor-not-allowed"
            }`}
          >
            {analyzing ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin" width="16" height="16" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" strokeOpacity="0.2"/><path d="M12 2a10 10 0 0 1 10 10"/>
                </svg>
                Analyzing your colors...
              </span>
            ) : "🎨 Analyze My Colors"}
          </button>
        </div>

        {/* Analyzing Loader */}
        {analyzing && (
          <div className="px-5 pb-10">
            <div className="rounded-3xl bg-[#F5F3EF] p-6 text-center overflow-hidden relative">
              <div className="absolute inset-0 overflow-hidden rounded-3xl">
                <div className="scan-line absolute inset-y-0 w-20 bg-gradient-to-r from-transparent via-[#1a1a1a]/10 to-transparent"/>
              </div>
              <div className="text-4xl mb-3">🔬</div>
              <p className="font-semibold text-[#1a1a1a] text-sm">Analyzing your undertones...</p>
              <p className="text-xs text-[#888] mt-1">Matching seasonal palette</p>
              <div className="flex justify-center gap-2 mt-4">
                {["Warm", "Cool", "Neutral"].map((t, i) => (
                  <div
                    key={t}
                    className="px-3 py-1 rounded-full text-xs font-medium bg-white text-[#666]"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  >
                    {t}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {result && palette && selectedTone && (
          <div className="px-5 pb-24 fade-in">

            {/* Season Badge */}
            <div className="rounded-3xl bg-gradient-to-r from-[#FFF8E8] to-[#FFE8C8] p-5 mb-5 flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl flex-shrink-0 shadow-lg"
                style={{ background: skinTones.find(t => t.id === selectedTone)?.hex }}
              />
              <div>
                <p className="text-xs text-[#b07800] font-semibold uppercase tracking-wider">Your Season</p>
                <h3 className="font-['Playfair_Display'] text-xl font-semibold text-[#1a1a1a]">{palette.season}</h3>
                <p className="text-xs text-[#666] mt-0.5">{palette.desc}</p>
              </div>
            </div>

            {/* Best Colors */}
            <p className="text-xs font-semibold text-[#888] uppercase tracking-wider mb-3">Your Best Colors ✨</p>
            <div className="grid grid-cols-3 gap-3 mb-5">
              {palette.best.map((c, i) => (
                <div
                  key={i}
                  className="color-pop rounded-2xl overflow-hidden"
                  style={{ animationDelay: `${i * 0.08}s` }}
                >
                  <div className="h-16 w-full" style={{ background: c.color }}/>
                  <div className="p-2 bg-[#F5F3EF]">
                    <p className="text-[11px] font-semibold text-[#1a1a1a]">{c.name}</p>
                    <p className="text-[9px] text-[#888] leading-tight">{c.why}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Colors to Avoid */}
            <p className="text-xs font-semibold text-[#888] uppercase tracking-wider mb-3">Colors to Avoid ⚠️</p>
            <div className="flex gap-3 mb-5">
              {palette.avoid.map((c, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-2xl" style={{ background: c.color, border: "1px solid #e0ddd8" }}/>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-0.5 bg-red-500 rotate-45 rounded-full"/>
                      <div className="absolute w-8 h-0.5 bg-red-500 -rotate-45 rounded-full"/>
                    </div>
                  </div>
                  <span className="text-[9px] text-[#888] text-center font-medium">{c.name}</span>
                </div>
              ))}
            </div>

            {/* Style Tips */}
            <div className="rounded-3xl bg-[#F5F3EF] p-4 mb-4">
              <p className="text-sm font-semibold text-[#1a1a1a] mb-2">💡 Styling Tips</p>
              <ul className="space-y-1.5">
                {[
                  "Start with your best colors as your base outfit pieces",
                  "Add accents of secondary colors through accessories",
                  "Avoid avoid-colors near your face (neckline, scarves)",
                ].map((tip, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#b07800] mt-0.5">•</span>
                    <span className="text-xs text-[#555]">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button className="w-full py-3.5 rounded-2xl bg-[#1a1a1a] text-white text-sm font-semibold flex items-center justify-center gap-2">
              <svg width="16" height="16" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                <polyline points="16 6 12 2 8 6"/>
                <line x1="12" y1="2" x2="12" y2="15"/>
              </svg>
              Save My Color Palette
            </button>
          </div>
        )}

      </div>
    </div>
  );
}