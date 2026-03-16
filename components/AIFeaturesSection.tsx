"use client";
import { useState } from "react";
import AITryOn from "./tryon/AITryOn";
import AIOutfitMaker from "./tryon/AIOutfitMaker";
import AISuggestions from "./tryon/AISuggestions";
import ColorAnalysis from "./tryon/ColorAnalysis";

type Panel = "tryon" | "outfitmaker" | "suggestions" | "coloranalysis" | null;

const CARDS: { id: Panel; label: string; sub: string; bg: string; iconBg: string; icon: string }[] = [
  { id: "suggestions",   label: "AI Suggestions",  sub: "Try Outfits Virtually", bg: "#FDE8E8", iconBg: "#F4B8B8", icon: "👗" },
  { id: "outfitmaker",   label: "AI Outfit Maker",  sub: "AI created new looks",  bg: "#E8ECF8", iconBg: "#C8D0F0", icon: "✨" },
  { id: "tryon",         label: "AI Try On",        sub: "Instant try on",        bg: "#E0F2ED", iconBg: "#A8DDD0", icon: "🪞" },
  { id: "coloranalysis", label: "Color Analysis",   sub: "Find best colors",      bg: "#FEF3DC", iconBg: "#F9D98A", icon: "🎨" },
];

export default function AIFeaturesSection() {
  const [active, setActive] = useState<Panel>(null);

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
    <section style={{ padding: "24px 0", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@500;600;700&display=swap');
        *{box-sizing:border-box;}

        .ai-card{transition:transform 0.2s ease,box-shadow 0.2s ease;cursor:pointer;}
        .ai-card:hover{transform:translateY(-3px);box-shadow:0 8px 32px rgba(0,0,0,0.10);}

        .ai-modal-overlay{
          position:fixed;inset:0;z-index:99999;
          background:rgba(0,0,0,0.5);
          display:flex;align-items:center;justify-content:center;
          padding:20px;
          animation:aiOverlayIn 0.2s ease;
        }
        @keyframes aiOverlayIn{from{opacity:0}to{opacity:1}}

        .ai-modal-box{
          background:#FAFAF8;
          border-radius:24px;
          width:100%;
          max-width:920px;
          height:88vh;
          max-height:840px;
          overflow:hidden;
          display:flex;
          flex-direction:column;
          box-shadow:0 24px 80px rgba(0,0,0,0.25);
          animation:aiModalIn 0.25s ease;
        }
        @keyframes aiModalIn{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}

        @media(max-width:640px){
          .ai-modal-overlay{align-items:flex-end;padding:0;}
          .ai-modal-box{border-radius:24px 24px 0 0;height:93vh;max-height:93vh;max-width:100%;}
        }

        .ai-cards-grid{
          display:grid;
          grid-template-columns:repeat(4,1fr);
          gap:14px;
        }
        @media(max-width:900px){
          .ai-cards-grid{grid-template-columns:repeat(2,1fr);}
        }
        @media(max-width:480px){
          .ai-cards-grid{grid-template-columns:repeat(2,1fr);gap:10px;}
        }
      `}</style>

      {/* Section header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: 22 }}>✨</span>
          <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 700, color: "#1A1A1A" }}>
            AI Fashion Studio
          </span>
        </div>
        <p style={{ fontSize: 13, color: "#8B8B8B", margin: 0 }}>Powered by AI — just for you</p>
      </div>

      {/* Cards */}
      <div className="ai-cards-grid">
        {CARDS.map(card => (
          <div
            key={card.id}
            className="ai-card"
            onClick={() => setActive(card.id)}
            style={{
              background:    card.bg,
              borderRadius:  18,
              padding:       "18px 16px 14px",
              position:      "relative",
              minHeight:     120,
              display:       "flex",
              flexDirection: "column",
              justifyContent:"space-between",
            }}
          >
            {/* AI badge */}
            <div style={{
              position:     "absolute",
              top:          12,
              left:         12,
              background:   "rgba(255,255,255,0.75)",
              borderRadius: 6,
              padding:      "2px 8px",
              fontSize:     10,
              fontWeight:   700,
              color:        "#555",
              letterSpacing:"0.4px",
            }}>AI</div>

            {/* Icon circle */}
            <div style={{
              position:       "absolute",
              bottom:         12,
              right:          12,
              width:          56,
              height:         56,
              borderRadius:   "50%",
              background:     card.iconBg,
              display:        "flex",
              alignItems:     "center",
              justifyContent: "center",
              fontSize:       26,
            }}>{card.icon}</div>

            {/* Text */}
            <div style={{ paddingTop: 30 }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: "#1A1A1A", marginBottom: 4 }}>{card.label}</div>
              <div style={{ fontSize: 12, color: "#6B6B6B" }}>{card.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {active !== null && (
        <div
          className="ai-modal-overlay"
          onClick={e => { if (e.target === e.currentTarget) setActive(null); }}
        >
          <div className="ai-modal-box">
            {renderPanel()}
          </div>
        </div>
      )}
    </section>
  );
}
