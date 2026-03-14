"use client";

import { useState } from "react";
import AISuggestions from "@/components/tryon/AISuggestions";
import AIOutfitMaker from "@/components/tryon/AIOutfitMaker";
import ColorAnalysis from "@/components/tryon/ColorAnalysis";

const features = [
  {
    id: "suggestions",
    title: "AI Suggestions",
    desc: "Try Outfits Virtually",
    bg: "linear-gradient(135deg, #FDE8EC 0%, #FACDD5 100%)",
    accent: "#D4607A",
  },
  {
    id: "outfit-maker",
    title: "AI Outfit Maker",
    desc: "AI created new looks",
    bg: "linear-gradient(135deg, #EAF0FF 0%, #D4E0FF 100%)",
    accent: "#3A5BD9",
  },
  {
    id: "tryon",
    title: "AI Try On",
    desc: "Instant try on",
    bg: "linear-gradient(135deg, #E6F9F0 0%, #CCF0DF 100%)",
    accent: "#1A8F52",
  },
  {
    id: "color-analysis",
    title: "Color Analysis",
    desc: "Find best colors",
    bg: "linear-gradient(135deg, #FEF8E8 0%, #FDF0C8 100%)",
    accent: "#B07800",
  },
];

const svgs: Record<string, React.ReactElement> = {
  suggestions: (
    <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
      <ellipse cx="40" cy="72" rx="22" ry="6" fill="#D4607A" opacity="0.2"/>
      <rect x="26" y="32" width="28" height="36" rx="6" fill="#2d3a8c"/>
      <ellipse cx="40" cy="22" rx="10" ry="12" fill="#f5c89a"/>
      <ellipse cx="40" cy="12" rx="10" ry="6" fill="#3d2b1f"/>
      <rect x="14" y="34" width="12" height="18" rx="6" fill="#2d3a8c"/>
      <rect x="54" y="34" width="12" height="18" rx="6" fill="#2d3a8c"/>
      <rect x="27" y="64" width="10" height="14" rx="5" fill="#1a2470"/>
      <rect x="43" y="64" width="10" height="14" rx="5" fill="#1a2470"/>
    </svg>
  ),
  "outfit-maker": (
    <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
      <rect x="18" y="14" width="44" height="56" rx="5" fill="#f0ede8"/>
      <rect x="24" y="24" width="32" height="3" rx="1.5" fill="#ddd"/>
      <rect x="24" y="32" width="24" height="3" rx="1.5" fill="#ddd"/>
      <rect x="24" y="40" width="28" height="3" rx="1.5" fill="#ddd"/>
      <rect x="48" y="8" width="24" height="28" rx="4" fill="#e8e0d8"/>
      <rect x="52" y="13" width="16" height="14" rx="3" fill="#c8bfb5"/>
    </svg>
  ),
  tryon: (
    <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
      <path d="M22 20 L22 55 Q22 65 30 68 L36 68 L40 45 L44 68 L50 68 Q58 65 58 55 L58 20 Z" fill="#4a6fa5"/>
      <rect x="20" y="16" width="40" height="8" rx="2" fill="#3a5f95"/>
      <path d="M28 28 Q28 36 34 38" stroke="#3a5f95" strokeWidth="1.5" fill="none"/>
      <path d="M52 28 Q52 36 46 38" stroke="#3a5f95" strokeWidth="1.5" fill="none"/>
    </svg>
  ),
  "color-analysis": (
    <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
      <circle cx="30" cy="44" r="20" fill="#2d3a8c" opacity="0.85"/>
      <circle cx="50" cy="44" r="20" fill="#c0485a" opacity="0.7"/>
      <circle cx="40" cy="58" r="20" fill="#f4a261" opacity="0.7"/>
    </svg>
  ),
};

export default function AIFeaturesSection() {
  const [activeFeature, setActiveFeature] = useState<string | null>(null);

  return (
    <>
      <section className="w-full px-4 md:px-8 py-8 bg-white">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-[#1a1a1a] tracking-tight">
              ✨ AI Fashion Studio
            </h2>
            <p className="text-sm text-[#888] mt-0.5">Powered by AI — just for you</p>
          </div>
        </div>

        {/* 4 cols desktop | 2 cols mobile */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {features.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFeature(f.id)}
              className="group relative rounded-2xl overflow-hidden text-left focus:outline-none hover:-translate-y-1 hover:shadow-xl transition-all duration-200"
              style={{ background: f.bg, minHeight: "150px" }}
            >
              <div className="p-4 relative z-10">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white/60" style={{ color: f.accent }}>
                  AI
                </span>
                <h3 className="font-bold text-[#1a1a1a] text-sm mt-2 leading-tight">{f.title}</h3>
                <p className="text-[11px] text-[#666] mt-0.5">{f.desc}</p>
              </div>
              <div className="absolute bottom-0 right-0 w-20 h-20 opacity-80">
                {svgs[f.id]}
              </div>
              <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/70 items-center justify-center hidden group-hover:flex" style={{ color: f.accent }}>
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Modal Overlay */}
      {activeFeature && (
        <div
          className="fixed inset-0 z-[999] bg-black/60 flex items-end md:items-center justify-center"
          onClick={() => setActiveFeature(null)}
        >
          <div
            className="relative bg-white w-full md:w-[430px] rounded-t-3xl md:rounded-3xl overflow-y-auto"
            style={{ maxHeight: "92vh" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* X Close */}
            <button
              onClick={() => setActiveFeature(null)}
              className="absolute top-4 right-4 z-50 w-9 h-9 rounded-full bg-[#F5F3EF] flex items-center justify-center shadow-md"
            >
              <svg width="16" height="16" fill="none" stroke="#1a1a1a" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>

            {(activeFeature === "suggestions" || activeFeature === "tryon") && (
              <AISuggestions onBack={() => setActiveFeature(null)} />
            )}
            {activeFeature === "outfit-maker" && (
              <AIOutfitMaker onBack={() => setActiveFeature(null)} />
            )}
            {activeFeature === "color-analysis" && (
              <ColorAnalysis onBack={() => setActiveFeature(null)} />
            )}
          </div>
        </div>
      )}
    </>
  );
}