"use client";

import { useState } from "react";
import AISuggestions from "./AISuggestions";
import AIOutfitMaker from "./AIOutfitMaker";
import ColorAnalysis from "./ColorAnalysis";

type ActiveFeature = null | "suggestions" | "outfit-maker" | "color-analysis";

export default function AITryOnHub() {
  const [activeFeature, setActiveFeature] = useState<ActiveFeature>(null);

  if (activeFeature === "suggestions") {
    return <AISuggestions onBack={() => setActiveFeature(null)} />;
  }
  if (activeFeature === "outfit-maker") {
    return <AIOutfitMaker onBack={() => setActiveFeature(null)} />;
  }
  if (activeFeature === "color-analysis") {
    return <ColorAnalysis onBack={() => setActiveFeature(null)} />;
  }

  return (
    <div className="min-h-screen bg-[#F7F5F2] font-['DM_Sans',sans-serif]">
      {/* Google Font Import */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,600;1,500&display=swap');
        
        * { box-sizing: border-box; }
        
        .feature-card {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .feature-card:active {
          transform: scale(0.97);
        }
        .feature-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(0,0,0,0.12);
        }
        .pill-tag {
          animation: fadeSlideIn 0.4s ease both;
        }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .week-card {
          transition: background 0.2s;
        }
        .week-card:hover {
          background: #ede9e3;
        }
        .avatar-ring {
          background: linear-gradient(135deg, #f4a261, #e76f51);
          padding: 2px;
          border-radius: 50%;
        }
      `}</style>

      {/* Max width container for mobile-feel */}
      <div className="max-w-[430px] mx-auto min-h-screen bg-white shadow-2xl relative overflow-hidden">

        {/* Header */}
        <div className="px-5 pt-14 pb-2 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-['Playfair_Display'] font-semibold text-[#1a1a1a]">
              Fits
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="bg-[#1a1a1a] text-white text-xs font-semibold px-4 py-1.5 rounded-full">
              Upgrade
            </button>
            <button className="w-8 h-8 flex items-center justify-center text-[#1a1a1a]">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
            </button>
            <button className="w-8 h-8 flex items-center justify-center text-[#1a1a1a]">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Stories / Avatars */}
        <div className="px-5 py-3 flex gap-4 overflow-x-auto scrollbar-hide">
          {[
            { label: "Your OOTD", emoji: "👗", color: "#FFE0D0" },
            { label: "_trishwushres", emoji: "✈️", color: "#D0E8FF" },
            { label: "myglam", emoji: "💄", color: "#F0D0FF" },
            { label: "stylist", emoji: "🎀", color: "#D0FFE8" },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5 cursor-pointer flex-shrink-0">
              <div className="avatar-ring">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-2xl"
                  style={{ background: item.color }}
                >
                  {item.emoji}
                </div>
              </div>
              <span className="text-[11px] text-[#555] font-medium text-center w-16 truncate">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Your Week */}
        <div className="px-5 mt-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-[#1a1a1a]">Your Week</h2>
            <button className="text-sm text-[#888] font-medium">Planner</button>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {["Sun, 3rd Aug", "Mon, 4th Aug", "Tue, 5th Aug", "Wed, 6th Aug"].map((day, i) => (
              <div
                key={i}
                className="week-card aspect-square rounded-2xl bg-[#F5F3EF] flex flex-col items-center justify-center cursor-pointer border border-[#ede9e3]"
              >
                <span className="text-lg text-[#999] mb-1">+</span>
                <span className="text-[9px] text-[#aaa] text-center leading-tight px-1">{day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Features Grid */}
        <div className="px-5 mt-6">
          <div className="grid grid-cols-2 gap-3">

            {/* AI Suggestions */}
            <div
              className="feature-card rounded-3xl overflow-hidden cursor-pointer relative"
              style={{ background: "linear-gradient(135deg, #FFE8EC 0%, #FFD6DE 100%)", minHeight: "160px" }}
              onClick={() => setActiveFeature("suggestions")}
            >
              <div className="p-4">
                <span className="text-xs font-semibold text-[#c0485a] bg-white/50 px-2 py-0.5 rounded-full">AI</span>
                <h3 className="font-semibold text-[#1a1a1a] text-sm mt-2 leading-tight">AI Suggestions</h3>
                <p className="text-[11px] text-[#666] mt-0.5">Try Outfits Virtually</p>
              </div>
              <div className="absolute bottom-0 right-0">
                <div className="w-24 h-24 opacity-90">
                  <svg viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <ellipse cx="48" cy="80" rx="28" ry="8" fill="#f9c0c8" opacity="0.5"/>
                    <rect x="32" y="30" width="32" height="44" rx="8" fill="#2d3a8c"/>
                    <rect x="38" y="20" width="20" height="22" rx="10" fill="#f9d5c5"/>
                    <rect x="28" y="34" width="10" height="20" rx="5" fill="#2d3a8c"/>
                    <rect x="58" y="34" width="10" height="20" rx="5" fill="#2d3a8c"/>
                    <rect x="32" y="74" width="12" height="16" rx="6" fill="#3d4daa"/>
                    <rect x="52" y="74" width="12" height="16" rx="6" fill="#3d4daa"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* AI Outfit Maker */}
            <div
              className="feature-card rounded-3xl overflow-hidden cursor-pointer relative"
              style={{ background: "linear-gradient(135deg, #EAF0FF 0%, #D8E4FF 100%)", minHeight: "160px" }}
              onClick={() => setActiveFeature("outfit-maker")}
            >
              <div className="p-4">
                <span className="text-xs font-semibold text-[#3a5bd9] bg-white/50 px-2 py-0.5 rounded-full">AI</span>
                <h3 className="font-semibold text-[#1a1a1a] text-sm mt-2 leading-tight">AI Outfit Maker</h3>
                <p className="text-[11px] text-[#666] mt-0.5">AI created new looks</p>
              </div>
              <div className="absolute bottom-0 right-0">
                <div className="w-24 h-24 opacity-90">
                  <svg viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <ellipse cx="48" cy="80" rx="28" ry="8" fill="#c8d8f9" opacity="0.5"/>
                    <rect x="30" y="28" width="36" height="48" rx="6" fill="#f5f5f0"/>
                    <rect x="35" y="36" width="26" height="3" rx="1.5" fill="#ddd"/>
                    <rect x="35" y="44" width="20" height="3" rx="1.5" fill="#ddd"/>
                    <rect x="35" y="52" width="24" height="3" rx="1.5" fill="#ddd"/>
                    <rect x="56" y="20" width="18" height="22" rx="4" fill="#e8e0d8"/>
                    <rect x="60" y="24" width="10" height="10" rx="2" fill="#c8bfb5"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* AI Try On */}
            <div
              className="feature-card rounded-3xl overflow-hidden cursor-pointer relative"
              style={{ background: "linear-gradient(135deg, #E8F9F0 0%, #D0F0E0 100%)", minHeight: "160px" }}
              onClick={() => setActiveFeature("suggestions")}
            >
              <div className="p-4">
                <span className="text-xs font-semibold text-[#1a8f52] bg-white/50 px-2 py-0.5 rounded-full">AI</span>
                <h3 className="font-semibold text-[#1a1a1a] text-sm mt-2 leading-tight">AI Try On</h3>
                <p className="text-[11px] text-[#666] mt-0.5">Instant try on</p>
              </div>
              <div className="absolute bottom-0 right-0">
                <div className="w-24 h-24 opacity-90">
                  <svg viewBox="0 0 96 96" fill="none">
                    <ellipse cx="48" cy="80" rx="28" ry="8" fill="#a8e8c8" opacity="0.5"/>
                    <rect x="30" y="44" width="36" height="34" rx="4" fill="#8b7355"/>
                    <rect x="36" y="52" width="24" height="4" rx="2" fill="#6b5335"/>
                    <rect x="36" y="60" width="18" height="4" rx="2" fill="#6b5335"/>
                    <rect x="36" y="36" width="24" height="12" rx="6" fill="#dcc8a0"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Color Analysis */}
            <div
              className="feature-card rounded-3xl overflow-hidden cursor-pointer relative"
              style={{ background: "linear-gradient(135deg, #FFF8E8 0%, #FFEFC8 100%)", minHeight: "160px" }}
              onClick={() => setActiveFeature("color-analysis")}
            >
              <div className="p-4">
                <span className="text-xs font-semibold text-[#b07800] bg-white/50 px-2 py-0.5 rounded-full">AI</span>
                <h3 className="font-semibold text-[#1a1a1a] text-sm mt-2 leading-tight">Color Analysis</h3>
                <p className="text-[11px] text-[#666] mt-0.5">Find best colors</p>
              </div>
              <div className="absolute bottom-0 right-0">
                <div className="w-24 h-24 opacity-90">
                  <svg viewBox="0 0 96 96" fill="none">
                    <circle cx="40" cy="50" r="18" fill="#2d3a8c" opacity="0.85"/>
                    <circle cx="58" cy="50" r="18" fill="#c0485a" opacity="0.7"/>
                    <circle cx="49" cy="65" r="18" fill="#f4a261" opacity="0.7"/>
                  </svg>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Popular this week */}
        <div className="px-5 mt-6 pb-24">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-[#1a1a1a]">Popular this week</h2>
            <button className="text-sm text-[#888] font-medium">More</button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { bg: "#EEE8E0", emoji: "👖", label: "Jeans" },
              { bg: "#E8EEF8", emoji: "👔", label: "Formal" },
              { bg: "#F8E8EE", emoji: "👗", label: "Dress" },
            ].map((item, i) => (
              <div key={i} className="rounded-2xl overflow-hidden cursor-pointer" style={{ background: item.bg }}>
                <div className="aspect-square flex items-center justify-center text-4xl">
                  {item.emoji}
                </div>
                <div className="px-2 pb-2 text-xs font-medium text-[#444] text-center">{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Nav */}
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-[#F0EDE8] px-8 py-3 flex items-center justify-between z-50">
          <button className="flex flex-col items-center gap-1 text-[#1a1a1a]">
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            <span className="text-[10px] font-semibold">Home</span>
          </button>

          <button
            className="w-14 h-14 rounded-full bg-[#1a1a1a] text-white flex items-center justify-center shadow-lg -mt-6"
            onClick={() => setActiveFeature("outfit-maker")}
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </button>

          <button className="flex flex-col items-center gap-1 text-[#aaa]">
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            <span className="text-[10px] font-medium">Profile</span>
          </button>
        </div>

      </div>
    </div>
  );
}