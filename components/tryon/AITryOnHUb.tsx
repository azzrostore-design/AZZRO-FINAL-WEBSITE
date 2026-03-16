"use client";
import { useState, useRef, useEffect } from "react";
import AITryOn from "./AITryOn";
import AIOutfitMaker from "./AIOutfitMaker";
import AISuggestions from "./AISuggestions";
import ColorAnalysis from "./ColorAnalysis";

/* ── Which panel is open ── */
type ActivePanel = "tryon" | "outfitmaker" | "suggestions" | "coloranalysis" | null;

/* ── Card definitions ── */
const CARDS = [
  {
    id:       "suggestions" as ActivePanel,
    label:    "AI Suggestions",
    sub:      "Try Outfits Virtually",
    bg:       "#FDE8E8",
    iconBg:   "#F4B8B8",
    icon:     "👗",
    ai:       true,
  },
  {
    id:       "outfitmaker" as ActivePanel,
    label:    "AI Outfit Maker",
    sub:      "AI created new looks",
    bg:       "#E8ECF8",
    iconBg:   "#C8D0F0",
    icon:     "✨",
    ai:       true,
  },
  {
    id:       "tryon" as ActivePanel,        // ← this is the key fix
    label:    "AI Try On",
    sub:      "Instant try on",
    bg:       "#E0F2ED",
    iconBg:   "#A8DDD0",
    icon:     "🪞",
    ai:       true,
  },
  {
    id:       "coloranalysis" as ActivePanel,
    label:    "Color Analysis",
    sub:      "Find best colors",
    bg:       "#FEF3DC",
    iconBg:   "#F9D98A",
    icon:     "🎨",
    ai:       true,
  },
];

export default function AITryOnHub() {
  const [active, setActive]       = useState<ActivePanel>(null);
  const [containerW, setContainerW] = useState(800);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const m = () => { if (containerRef.current) setContainerW(containerRef.current.offsetWidth); };
    m();
    const ro = new ResizeObserver(m);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const wide = containerW >= 768;

  /* ── Render active panel ── */
  const renderPanel = () => {
    const props = { onClose: () => setActive(null) };
    switch (active) {
      case "tryon":         return <AITryOn        {...props} />;
      case "outfitmaker":   return <AIOutfitMaker  {...props} />;
      case "suggestions":   return <AISuggestions  {...props} />;
      case "coloranalysis": return <ColorAnalysis  {...props} />;
      default:              return null;
    }
  };

  return (
    <div ref={containerRef} style={{ fontFamily: "'DM Sans', sans-serif", width: "100%" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@500;600;700&display=swap');
        *{box-sizing:border-box;}
        .az-card-hover:hover{transform:translateY(-3px);box-shadow:0 8px 32px rgba(0,0,0,0.10)!important;}
        .az-card-hover{transition:transform 0.2s ease,box-shadow 0.2s ease;}

        /* Modal overlay */
        .az-modal-overlay{
          position:fixed;inset:0;z-index:9999;
          background:rgba(0,0,0,0.45);
          display:flex;align-items:center;justify-content:center;
          padding:16px;
          animation:fadeOverlay 0.2s ease;
        }
        @keyframes fadeOverlay{from{opacity:0}to{opacity:1}}

        /* Modal box */
        .az-modal-box{
          background:#FAFAF8;
          border-radius:24px;
          width:100%;
          max-width:900px;
          height:90vh;
          max-height:820px;
          overflow:hidden;
          display:flex;
          flex-direction:column;
          box-shadow:0 24px 80px rgba(0,0,0,0.22);
          animation:slideModal 0.25s ease;
        }
        @keyframes slideModal{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}

        /* Mobile: bottom sheet */
        @media(max-width:640px){
          .az-modal-overlay{align-items:flex-end;padding:0;}
          .az-modal-box{border-radius:24px 24px 0 0;height:92vh;max-height:92vh;max-width:100%;}
        }
      `}</style>

      {/* ── Section header ── */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: 20 }}>✨</span>
          <span style={{ fontFamily: "'Playfair Display',serif", fontSize: wide ? 22 : 18, fontWeight: 700, color: "#1A1A1A" }}>AI Fashion Studio</span>
        </div>
        <p style={{ fontSize: 13, color: "#8B8B8B", margin: 0 }}>Powered by AI — just for you</p>
      </div>

      {/* ── Cards grid ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: wide ? "repeat(4, 1fr)" : "repeat(2, 1fr)",
        gap: 14,
      }}>
        {CARDS.map(card => (
          <div
            key={card.id}
            className="az-card-hover"
            onClick={() => setActive(card.id)}
            style={{
              background:   card.bg,
              borderRadius: 18,
              padding:      "18px 16px 14px",
              cursor:       "pointer",
              position:     "relative",
              minHeight:    120,
              display:      "flex",
              flexDirection:"column",
              justifyContent:"space-between",
            }}
          >
            {/* AI badge */}
            {card.ai && (
              <div style={{
                position:   "absolute",
                top:        12,
                left:       12,
                background: "rgba(255,255,255,0.7)",
                borderRadius: 6,
                padding:    "2px 7px",
                fontSize:   10,
                fontWeight: 700,
                color:      "#555",
                letterSpacing: "0.3px",
              }}>AI</div>
            )}

            {/* Icon */}
            <div style={{
              position:     "absolute",
              bottom:       12,
              right:        12,
              width:        56,
              height:       56,
              borderRadius: "50%",
              background:   card.iconBg,
              display:      "flex",
              alignItems:   "center",
              justifyContent:"center",
              fontSize:     26,
            }}>{card.icon}</div>

            {/* Text */}
            <div style={{ paddingTop: 28 }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: "#1A1A1A", marginBottom: 4 }}>{card.label}</div>
              <div style={{ fontSize: 12, color: "#6B6B6B" }}>{card.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Modal overlay ── */}
      {active && (
        <div
          className="az-modal-overlay"
          onClick={e => { if (e.target === e.currentTarget) setActive(null); }}
        >
          <div className="az-modal-box">
            {renderPanel()}
          </div>
        </div>
      )}
    </div>
  );
}
