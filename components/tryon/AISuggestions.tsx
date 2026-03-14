"use client";

import { useState } from "react";

interface Props {
  onBack: () => void;
}

const outfits = [
  {
    id: 1,
    title: "Casual Chic",
    items: ["White Oversized Tee", "High-waist Jeans", "White Sneakers"],
    tags: ["Casual", "Everyday"],
    color: "#FFE8EC",
    accent: "#c0485a",
    emoji: "👗",
    match: 96,
  },
  {
    id: 2,
    title: "Office Ready",
    items: ["Blazer", "Tailored Trousers", "Loafers"],
    tags: ["Formal", "Work"],
    color: "#EAF0FF",
    accent: "#3a5bd9",
    emoji: "💼",
    match: 91,
  },
  {
    id: 3,
    title: "Weekend Vibes",
    items: ["Floral Midi Dress", "Strappy Sandals", "Tote Bag"],
    tags: ["Boho", "Weekend"],
    color: "#E8F9F0",
    accent: "#1a8f52",
    emoji: "🌸",
    match: 88,
  },
  {
    id: 4,
    title: "Date Night",
    items: ["Slip Dress", "Heeled Mules", "Mini Bag"],
    tags: ["Elegant", "Evening"],
    color: "#FFF0F8",
    accent: "#a0288c",
    emoji: "✨",
    match: 85,
  },
];

const moods = ["All", "Casual", "Formal", "Boho", "Elegant", "Sporty"];

export default function AISuggestions({ onBack }: Props) {
  const [selectedMood, setSelectedMood] = useState("All");
  const [liked, setLiked] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [photoUploaded, setPhotoUploaded] = useState(false);

  const filtered = selectedMood === "All"
    ? outfits
    : outfits.filter(o => o.tags.includes(selectedMood));

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1200);
  };

  return (
    <div className="min-h-screen bg-[#F7F5F2] font-['DM_Sans',sans-serif]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,600;1,500&display=swap');
        * { box-sizing: border-box; }
        .outfit-card { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .outfit-card:hover { transform: translateY(-3px); box-shadow: 0 16px 40px rgba(0,0,0,0.1); }
        .mood-pill { transition: all 0.2s ease; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner { animation: spin 0.8s linear infinite; }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
        .pulse { animation: pulse 1s ease infinite; }
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
            <h1 className="text-2xl font-['Playfair_Display'] font-semibold text-[#1a1a1a]">AI Suggestions</h1>
            <p className="text-xs text-[#888]">Personalized for your style</p>
          </div>
        </div>

        {/* Upload Photo Banner */}
        <div className="mx-5 mb-4">
          {!photoUploaded ? (
            <button
              onClick={() => setPhotoUploaded(true)}
              className="w-full rounded-2xl border-2 border-dashed border-[#ddd] p-4 flex items-center gap-3 text-left hover:border-[#1a1a1a] transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-[#F5F3EF] flex items-center justify-center text-2xl">📸</div>
              <div>
                <p className="text-sm font-semibold text-[#1a1a1a]">Upload your photo</p>
                <p className="text-xs text-[#888]">Get outfits tailored to your body type</p>
              </div>
              <svg className="ml-auto" width="18" height="18" fill="none" stroke="#aaa" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </button>
          ) : (
            <div className="w-full rounded-2xl bg-gradient-to-r from-[#E8F9F0] to-[#D0F0E0] p-4 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-2xl">✅</div>
              <div>
                <p className="text-sm font-semibold text-[#1a8f52]">Photo uploaded!</p>
                <p className="text-xs text-[#555]">Suggestions are now personalized</p>
              </div>
            </div>
          )}
        </div>

        {/* Mood Filter */}
        <div className="px-5 mb-4">
          <p className="text-xs text-[#888] font-medium mb-2 uppercase tracking-wider">Filter by mood</p>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {moods.map((mood) => (
              <button
                key={mood}
                onClick={() => setSelectedMood(mood)}
                className={`mood-pill flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                  selectedMood === mood
                    ? "bg-[#1a1a1a] text-white border-[#1a1a1a]"
                    : "bg-white text-[#555] border-[#E0DDD8]"
                }`}
              >
                {mood}
              </button>
            ))}
          </div>
        </div>

        {/* Outfits */}
        <div className="px-5 pb-24">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <div className="spinner w-8 h-8 border-2 border-[#1a1a1a] border-t-transparent rounded-full"/>
              <p className="text-sm text-[#888] pulse">Finding your perfect outfits...</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {filtered.map((outfit) => (
                <div
                  key={outfit.id}
                  className="outfit-card rounded-3xl overflow-hidden"
                  style={{ background: outfit.color }}
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-white/60 flex items-center justify-center text-2xl">
                          {outfit.emoji}
                        </div>
                        <div>
                          <h3 className="font-semibold text-[#1a1a1a] text-base">{outfit.title}</h3>
                          <div className="flex gap-1 mt-0.5">
                            {outfit.tags.map(t => (
                              <span key={t} className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/50" style={{ color: outfit.accent }}>
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-[#1a1a1a]">{outfit.match}%</div>
                        <div className="text-[10px] text-[#666]">match</div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5 mb-4">
                      {outfit.items.map((item, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full" style={{ background: outfit.accent }}/>
                          <span className="text-sm text-[#444]">{item}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <button
                        className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
                        style={{ background: outfit.accent }}
                      >
                        Try On Virtually
                      </button>
                      <button
                        onClick={() => setLiked(prev => prev.includes(outfit.id) ? prev.filter(id => id !== outfit.id) : [...prev, outfit.id])}
                        className="w-10 h-10 rounded-xl bg-white/60 flex items-center justify-center text-lg"
                      >
                        {liked.includes(outfit.id) ? "❤️" : "🤍"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={handleRefresh}
            className="w-full mt-4 py-3.5 rounded-2xl border-2 border-[#1a1a1a] text-sm font-semibold text-[#1a1a1a] flex items-center justify-center gap-2 hover:bg-[#1a1a1a] hover:text-white transition-all"
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M23 4v6h-6M1 20v-6h6"/>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
            </svg>
            Generate New Suggestions
          </button>
        </div>

      </div>
    </div>
  );
}