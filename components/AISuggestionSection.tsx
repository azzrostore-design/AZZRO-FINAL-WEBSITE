"use client";

import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";

// ─── Existing components with correct onBack prop type ─────────────────────

interface WithOnBack {
  onBack: () => void;
}

const AISuggestions = dynamic<WithOnBack>(() => import("@/components/tryon/AISuggestions"), { ssr: false });
const AIOutfitMaker = dynamic<WithOnBack>(() => import("@/components/tryon/AIOutfitMaker"), { ssr: false });
const ColorAnalysis = dynamic<WithOnBack>(() => import("@/components/tryon/ColorAnalysis"), { ssr: false });

// ─── Types ────────────────────────────────────────────────────────────────────

interface Feature {
  id: string;
  title: string;
  desc: string;
  bg: string;
  accent: string;
}

interface Message {
  id: string;
  role: "assistant" | "user";
  content: string;
}

interface OutfitData {
  id: string;
  items: string[];
  style: string;
  score: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const features: Feature[] = [
  { id: "suggestions",    title: "AI Suggestions",   desc: "Try Outfits Virtually",        bg: "linear-gradient(135deg, #FDE8EC 0%, #FACDD5 100%)", accent: "#D4607A" },
  { id: "outfit-maker",   title: "Outfit Maker",      desc: "Create Your Look",             bg: "linear-gradient(135deg, #E8F0FE 0%, #D0E3FF 100%)", accent: "#4A7CF7" },
  { id: "color-analysis", title: "Color Analysis",    desc: "Find Your Palette",            bg: "linear-gradient(135deg, #E8FAF0 0%, #C8F0D8 100%)", accent: "#2E9E5B" },
  { id: "fashion-chat",   title: "Fashion Assistant", desc: "Chat With AI Stylist",         bg: "linear-gradient(135deg, #FEF3E8 0%, #FDDCB5 100%)", accent: "#D4820A" },
  { id: "outfit-request", title: "Outfit Builder",    desc: "Generate Outfits by Occasion", bg: "linear-gradient(135deg, #F3E8FE 0%, #E2C8FF 100%)", accent: "#8B3CF7" },
];

const OCCASIONS = ["Date", "Coffee", "Interview", "Party", "Beach", "Wedding", "Casual"];

const MOCK_OUTFITS: Record<string, OutfitData[]> = {
  Date:      [{ id: "0", items: ["Midi slip dress", "Strappy heels", "Mini shoulder bag", "Pendant necklace"], style: "Romantic", score: 91.2 }, { id: "1", items: ["High-waist trousers", "Silk blouse", "Block heels", "Structured bag"], style: "Chic", score: 87.5 }],
  Coffee:    [{ id: "2", items: ["White flared pants", "Floral blouse", "Sandals", "Sunglasses"], style: "Elegant", score: 41.9 }, { id: "3", items: ["Straight jeans", "Linen top", "White sneakers", "Mini tote"], style: "Casual", score: 83.0 }],
  Interview: [{ id: "4", items: ["Tailored blazer", "Straight trousers", "Oxford shoes", "Classic watch"], style: "Professional", score: 95.0 }, { id: "5", items: ["Pencil skirt", "Button-down shirt", "Block heel pumps", "Briefcase bag"], style: "Corporate", score: 88.7 }],
  Party:     [{ id: "6", items: ["Mini sequin dress", "Strappy sandals", "Clutch bag", "Statement earrings"], style: "Glam", score: 93.4 }, { id: "7", items: ["Wide-leg trousers", "Crop top", "Platform boots", "Gold necklace"], style: "Trendy", score: 79.2 }],
  Beach:     [{ id: "8", items: ["Linen co-ord set", "Flat sandals", "Woven tote", "Shell earrings"], style: "Resort", score: 89.1 }, { id: "9", items: ["Crochet cover-up", "Bikini set", "Flip flops", "Straw hat"], style: "Boho", score: 76.8 }],
  Wedding:   [{ id: "10", items: ["Floral midi dress", "Block heels", "Clutch bag", "Pearl earrings"], style: "Elegant", score: 92.3 }, { id: "11", items: ["Pastel suit", "Cami top", "Pointed flats", "Dainty bracelet"], style: "Modern", score: 85.6 }],
  Casual:    [{ id: "12", items: ["Mom jeans", "Oversized tee", "Chunky sneakers", "Canvas tote"], style: "Relaxed", score: 78.4 }, { id: "13", items: ["Linen trousers", "Stripe top", "Loafers", "Crossbody bag"], style: "Smart Casual", score: 82.1 }],
};

const CHAT_RESPONSES: Record<string, string> = {
  coffee:    "For a coffee date: high-waisted straight jeans, a tucked ivory blouse, white sneakers or loafers, mini tote and gold earrings. Effortlessly chic! ☕✨",
  interview: "For an interview: tailored navy trousers, crisp white button-down or structured blazer, block-heel pumps, minimal accessories. You'll radiate confidence! 💼",
  beach:     "Beach party vibes! Flowy linen co-ord in terracotta, crochet cover-up, strappy sandals, woven bag and shell earrings. Vacation-ready! 🌊🐚",
  date:      "For a first date: midi slip dress in champagne or dusty rose, strappy heels, mini shoulder bag, delicate pendant necklace. Soft and unforgettable! 🌹",
  party:     "For a party: mini sequin dress or wide-leg trousers with a crop top, platform boots, gold accessories. Bring the glam! 🎉",
  wedding:   "For a wedding: floral midi dress, block heels, clutch bag, pearl earrings. Elegant and appropriate! 💐",
};

const QUICK_SUGGESTIONS = [
  "Suggest a casual outfit for a coffee date ☕",
  "Recommend an interview outfit 💼",
  "What to wear for a beach party? 🌊",
  "Style tips for a first date 🌹",
];

const STYLISTS = [
  { name: "Eli",  tagline: "Minimal • Timeless", emoji: "👩" },
  { name: "Nova", tagline: "Bold • Eclectic",    emoji: "👩‍🦰" },
  { name: "Kai",  tagline: "Street • Urban",     emoji: "🧑" },
];

// ─── FashionChat ──────────────────────────────────────────────────────────────

function FashionChat() {
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", role: "assistant", content: "Hello! How can I assist you with your outfit today? 😊" },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const getResponse = (text: string): string => {
    const lower = text.toLowerCase();
    for (const [key, val] of Object.entries(CHAT_RESPONSES)) {
      if (lower.includes(key)) return val;
    }
    return "Great question! Build your look around one hero piece — a statement blazer, flowy dress, or well-fitted trousers. Layer with neutrals and one accent accessory. Want more specific advice? 🎨";
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { id: Date.now().toString(), role: "user", content: text }]);
    setInput("");
    setIsTyping(true);
    setShowSuggestions(false);
    await new Promise(r => setTimeout(r, 1200));
    setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: getResponse(text) }]);
    setIsTyping(false);
  };

  return (
    <div className="flex flex-col h-[620px] w-full max-w-sm mx-auto bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100">
      <div className="px-5 pt-5 pb-4 border-b border-gray-100 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-300 to-orange-500 flex items-center justify-center text-white text-sm font-bold">AI</div>
        <div>
          <p className="text-[14px] font-semibold text-gray-900">AI Fashion Assistant</p>
          <p className="text-[11px] text-emerald-500 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />Online</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gray-50/50">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed shadow-sm ${msg.role === "user" ? "bg-gray-900 text-white rounded-br-md" : "bg-sky-100 text-gray-800 rounded-bl-md"}`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-sky-100 px-4 py-3 rounded-2xl rounded-bl-md shadow-sm flex gap-1 items-center">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]" />
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {showSuggestions && (
        <div className="px-4 py-2 bg-white border-t border-gray-100">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Quick Suggestions</p>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {QUICK_SUGGESTIONS.map(s => (
              <button key={s} onClick={() => sendMessage(s)} className="flex-shrink-0 text-[11px] bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-full transition-colors whitespace-nowrap">
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="px-4 py-3 bg-white border-t border-gray-100 flex items-center gap-2">
        <input
          type="text" value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") sendMessage(input); }}
          placeholder="Ask me anything about fashion..."
          className="flex-1 text-[13px] bg-gray-100 rounded-full px-4 py-2.5 outline-none text-gray-800 placeholder-gray-400"
        />
        <button onClick={() => sendMessage(input)} disabled={!input.trim()} className="w-9 h-9 rounded-full bg-gray-900 disabled:bg-gray-300 flex items-center justify-center transition-colors flex-shrink-0">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// ─── OutfitRequestForm ────────────────────────────────────────────────────────

function OutfitRequestForm() {
  const [stylistIdx, setStylistIdx] = useState(0);
  const [occasion, setOccasion] = useState("");
  const [vibe, setVibe] = useState("");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [outfits, setOutfits] = useState<OutfitData[] | null>(null);
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const stylist = STYLISTS[stylistIdx];

  const handleMakeOutfits = async () => {
    if (!occasion) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setOutfits(MOCK_OUTFITS[occasion] ?? MOCK_OUTFITS["Casual"]);
    setLoading(false);
  };

  if (outfits) {
    return (
      <div className="w-full max-w-sm mx-auto bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100">
        <div className="px-5 pt-5 pb-4 border-b border-gray-100 flex items-center justify-between">
          <button onClick={() => setOutfits(null)} className="text-gray-400 hover:text-gray-700 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <h2 className="text-[15px] font-semibold text-gray-900">Suggested Outfits</h2>
          <div className="w-5" />
        </div>
        <div className="overflow-y-auto max-h-[560px] p-4 space-y-4">
          {outfits.map(outfit => (
            <div key={outfit.id} className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
              <div className="grid grid-cols-2 gap-2 p-3 h-44">
                <div className="rounded-xl bg-stone-200 flex items-center justify-center text-4xl">👗</div>
                <div className="grid grid-rows-2 gap-2">
                  <div className="rounded-xl bg-stone-100 flex items-center justify-center text-2xl">👜</div>
                  <div className="rounded-xl bg-stone-100 flex items-center justify-center text-2xl">👠</div>
                </div>
              </div>
              <div className="px-4 pb-4">
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Items</p>
                <p className="text-[13px] text-gray-800 mb-3">{outfit.items.join(", ")}</p>
                <div className="flex items-center justify-between">
                  <div className="flex gap-3">
                    <div><p className="text-[11px] text-gray-400">Style</p><p className="text-[12px] font-medium text-gray-700">{outfit.style}</p></div>
                    <div className="w-px h-6 bg-gray-200" />
                    <div><p className="text-[11px] text-gray-400">Score</p><p className="text-[12px] font-medium text-gray-700">{outfit.score}%</p></div>
                  </div>
                  <button
                    onClick={() => setLiked(prev => ({ ...prev, [outfit.id]: !prev[outfit.id] }))}
                    className={`px-4 py-1.5 rounded-full text-[12px] font-medium border transition-all ${liked[outfit.id] ? "bg-rose-500 text-white border-rose-500" : "bg-white text-gray-700 border-gray-200"}`}
                  >
                    {liked[outfit.id] ? "♥ Liked" : "♡ Like"}
                  </button>
                </div>
              </div>
            </div>
          ))}
          <p className="text-center text-[12px] text-gray-400 pb-2">Styled by {stylist.name} • {stylist.tagline}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm mx-auto bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100">
      <div className="px-5 pt-5 pb-4 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-[15px] font-semibold text-gray-900">Outfit Suggestions</h2>
        <span className="text-[11px] text-gray-400">I&apos;m your personal AI stylist</span>
      </div>
      <div className="overflow-y-auto max-h-[560px]">
        <div className="flex flex-col items-center pt-6 pb-4 px-5">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-stone-200 to-stone-300 flex items-center justify-center text-3xl shadow-md mb-3 border-2 border-white ring-2 ring-gray-100">
            {stylist.emoji}
          </div>
          <p className="text-[15px] font-semibold text-gray-900">{stylist.name}</p>
          <p className="text-[12px] text-gray-500 mt-0.5">{stylist.tagline}</p>
          <button onClick={() => setStylistIdx(i => (i + 1) % STYLISTS.length)} className="mt-3 px-4 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-[12px] font-medium text-gray-700 transition-colors">
            Change Stylist
          </button>
        </div>

        <div className="px-5 pb-6 space-y-4">
          <p className="text-[12px] font-semibold text-gray-700 uppercase tracking-wider">Outfit Request</p>

          <div className="relative">
            <button type="button" onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-xl text-[13px] text-gray-700 hover:border-gray-300 transition-colors">
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                {occasion || <span className="text-gray-400">Select Occasion</span>}
              </span>
              <svg className={`w-4 h-4 text-gray-400 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            {dropdownOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-2xl shadow-xl border border-gray-100 z-20 overflow-hidden">
                  <p className="text-[12px] font-semibold text-gray-400 uppercase tracking-wider text-center px-4 pt-3 pb-2 border-b border-gray-100">Select Occasion</p>
                  {OCCASIONS.map(o => (
                    <button key={o} type="button" onClick={() => { setOccasion(o); setDropdownOpen(false); }}
                      className={`w-full px-4 py-3 text-[14px] text-center hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 ${occasion === o ? "font-semibold text-gray-900" : "text-gray-600"}`}>
                      {o}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl">
            <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
            <input type="text" value={vibe} onChange={e => setVibe(e.target.value)} placeholder="E.g first date dinner, casual vibe"
              className="flex-1 text-[13px] outline-none text-gray-800 placeholder-gray-400 bg-transparent" />
          </div>

          <div>
            <p className="text-[12px] font-semibold text-gray-700 uppercase tracking-wider mb-2">Additional Prompt</p>
            <textarea value={prompt} onChange={e => setPrompt(e.target.value.slice(0, 200))} placeholder="Add more details (optional)" rows={3}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-[13px] text-gray-800 placeholder-gray-400 outline-none resize-none focus:border-gray-300 transition-colors" />
            <p className="text-[11px] text-gray-400 mt-1">{prompt.length}/200 characters</p>
          </div>

          <button onClick={handleMakeOutfits} disabled={!occasion || loading}
            className="w-full py-3.5 rounded-2xl bg-gray-900 disabled:bg-gray-300 text-white text-[14px] font-semibold tracking-wide transition-all hover:bg-gray-800 active:scale-[0.98] flex items-center justify-center gap-2">
            {loading ? (
              <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Styling...</>
            ) : "✨ Make Outfits"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Section ─────────────────────────────────────────────────────────────

export default function AIFeaturesSection() {
  const [activeFeature, setActiveFeature] = useState<string | null>(null);

  const handleBack = () => setActiveFeature(null);

  const renderFeatureContent = () => {
    switch (activeFeature) {
      case "suggestions":    return <AISuggestions onBack={handleBack} />;
      case "outfit-maker":   return <AIOutfitMaker onBack={handleBack} />;
      case "color-analysis": return <ColorAnalysis onBack={handleBack} />;
      case "fashion-chat":   return <FashionChat />;
      case "outfit-request": return <OutfitRequestForm />;
      default:               return null;
    }
  };

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-3">AI Fashion Features</h2>
          <p className="text-gray-500 text-lg">Powered by AI, designed for you</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-12">
          {features.map(feature => (
            <button key={feature.id}
              onClick={() => setActiveFeature(activeFeature === feature.id ? null : feature.id)}
              className={`relative p-5 rounded-2xl text-left transition-all duration-200 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] ${activeFeature === feature.id ? "shadow-lg scale-[1.02]" : "shadow-sm"}`}
              style={{ background: feature.bg, outline: activeFeature === feature.id ? `2px solid ${feature.accent}` : "none" }}
            >
              <p className="text-[15px] font-semibold mb-1" style={{ color: feature.accent }}>{feature.title}</p>
              <p className="text-[12px] text-gray-600">{feature.desc}</p>
              {activeFeature === feature.id && (
                <div className="absolute top-3 right-3 w-2 h-2 rounded-full" style={{ backgroundColor: feature.accent }} />
              )}
            </button>
          ))}
        </div>

        {activeFeature && <div className="flex justify-center mt-4">{renderFeatureContent()}</div>}
        {!activeFeature && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-lg">Select a feature above to get started ✨</p>
          </div>
        )}
      </div>
    </section>
  );
}
