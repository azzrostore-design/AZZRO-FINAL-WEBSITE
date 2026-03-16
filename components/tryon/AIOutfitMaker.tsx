"use client";
import { useState, useEffect, useRef } from "react";

const STYLISTS = [
  { id:"eli",  name:"Eli",  style:"Minimal · Timeless",  avatar:"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face" },
  { id:"zara", name:"Zara", style:"Bold · Contemporary", avatar:"https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&h=80&fit=crop&crop=face" },
  { id:"mia",  name:"Mia",  style:"Boho · Earthy",       avatar:"https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&h=80&fit=crop&crop=face" },
  { id:"riya", name:"Riya", style:"Ethnic · Fusion",     avatar:"https://images.unsplash.com/photo-1504703395950-b89145a5425b?w=80&h=80&fit=crop&crop=face" },
];
const OCCASIONS   = ["Date Night","Office Wear","Coffee Hangout","Wedding Guest","Beach Day","Party","Festival","Casual Errands","Gym / Active","Travel"];
const STYLE_VIBES = ["Minimal","Bold","Elegant","Casual","Boho","Street","Ethnic","Luxe"];

export default function AIOutfitMaker({ onClose }: { onClose?: () => void }) {
  const [stylist, setStylist]       = useState(STYLISTS[0]);
  const [showPicker, setShowPicker] = useState(false);
  const [occasion, setOccasion]     = useState("");
  const [showDrop, setShowDrop]     = useState(false);
  const [styleVibe, setStyleVibe]   = useState("");
  const [prompt, setPrompt]         = useState("");
  const [loading, setLoading]       = useState(false);
  const [outfits, setOutfits]       = useState<any[]>([]);
  // containerWidth drives the layout — measured from the actual rendered container
  const [containerW, setContainerW] = useState(400);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const measure = () => {
      if (containerRef.current) setContainerW(containerRef.current.offsetWidth);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  // wide = true when our actual container is ≥ 680px
  const wide = containerW >= 680;

  const makeOutfits = async () => {
    if (!occasion) return;
    setLoading(true); setOutfits([]);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          model:"claude-sonnet-4-20250514", max_tokens:1000,
          messages:[{ role:"user", content:`You are ${stylist.name} (${stylist.style}). Generate 3 outfit suggestions. Occasion: ${occasion}. Vibe: ${styleVibe||"any"}. Notes: ${prompt||"none"}. Respond ONLY valid JSON no markdown: {"outfits":[{"name":"Name","items":["item1","item2","item3"],"vibe":"tag","color":"#hexcolor","emoji":"👗","tip":"short tip"}]}` }],
        }),
      });
      const data = await res.json();
      const txt = data.content?.map((c:any)=>c.text||"").join("")||"";
      setOutfits(JSON.parse(txt.replace(/```json|```/g,"").trim()).outfits||[]);
    } catch {
      setOutfits([{ name:"Casual Glam", items:["White linen shirt","High-waist trousers","Block heels"], vibe:"Minimal", color:"#D4B896", emoji:"✨", tip:"Add gold hoops to elevate the look." }]);
    }
    setLoading(false);
  };

  /* ─── sub-components ─── */
  const StylistCard = () => (
    <div style={{ background:"#fff", borderRadius:16, padding:16, border:"1px solid #F0EDE8", boxShadow:"0 1px 8px rgba(0,0,0,0.05)" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ position:"relative", flexShrink:0 }}>
            <img src={stylist.avatar} alt={stylist.name} style={{ width:48, height:48, borderRadius:"50%", objectFit:"cover", border:"2px solid #C9A96E" }} />
            <div style={{ position:"absolute", bottom:-2, right:-2, background:"#C9A96E", borderRadius:"50%", width:16, height:16, display:"flex", alignItems:"center", justifyContent:"center", fontSize:9 }}>✨</div>
          </div>
          <div>
            <div style={{ fontSize:11, color:"#8B8B8B", marginBottom:1 }}>Your AI Stylist</div>
            <div style={{ fontWeight:700, fontSize:16, color:"#1A1A1A", fontFamily:"'Playfair Display',serif" }}>{stylist.name}</div>
            <div style={{ fontSize:11, color:"#8B8B8B" }}>{stylist.style}</div>
          </div>
        </div>
        <button onClick={()=>setShowPicker(!showPicker)} style={{ background:"#F5F0EA", border:"none", borderRadius:10, padding:"7px 14px", fontSize:12, fontWeight:600, color:"#1A1A1A", cursor:"pointer", whiteSpace:"nowrap" }}>
          {showPicker?"Done":"Change"}
        </button>
      </div>
      {showPicker && (
        <div style={{ marginTop:14, display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
          {STYLISTS.map(s=>(
            <div key={s.id} onClick={()=>{setStylist(s);setShowPicker(false);}}
              style={{ display:"flex", alignItems:"center", gap:8, padding:"9px 10px", borderRadius:12, border:`2px solid ${stylist.id===s.id?"#C9A96E":"#F0EDE8"}`, cursor:"pointer", background:stylist.id===s.id?"#FBF7F0":"#fff" }}>
              <img src={s.avatar} alt={s.name} style={{ width:32, height:32, borderRadius:"50%", objectFit:"cover" }} />
              <div>
                <div style={{ fontWeight:600, fontSize:12, color:"#1A1A1A" }}>{s.name}</div>
                <div style={{ fontSize:10, color:"#8B8B8B" }}>{s.style.split("·")[0].trim()}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const FormFields = () => (
    <>
      {/* Occasion dropdown */}
      <div style={{ background:"#fff", borderRadius:16, padding:16, border:"1px solid #F0EDE8", boxShadow:"0 1px 8px rgba(0,0,0,0.05)" }}>
        <div style={{ fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.5px", color:"#1A1A1A", marginBottom:12 }}>Outfit Request</div>
        <div style={{ position:"relative", marginBottom:12 }}>
          <div onClick={()=>setShowDrop(!showDrop)} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 14px", borderRadius:12, border:`1.5px solid ${occasion?"#C9A96E":"#E8E4DF"}`, background:"#FAFAF8", cursor:"pointer" }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <span>🎭</span>
              <span style={{ fontSize:14, color:occasion?"#1A1A1A":"#B0ABA5", fontWeight:occasion?500:400 }}>{occasion||"Select Occasion"}</span>
            </div>
            <span style={{ color:"#8B8B8B", fontSize:11, display:"inline-block", transform:showDrop?"rotate(180deg)":"none", transition:"transform 0.2s" }}>▼</span>
          </div>
          {showDrop && (
            <div style={{ position:"absolute", top:"105%", left:0, right:0, background:"#fff", borderRadius:14, boxShadow:"0 8px 32px rgba(0,0,0,0.12)", zIndex:100, border:"1px solid #F0EDE8", overflow:"hidden", maxHeight:220, overflowY:"auto" }}>
              {OCCASIONS.map(o=>(
                <div key={o} onClick={()=>{setOccasion(o);setShowDrop(false);}}
                  style={{ padding:"11px 16px", fontSize:13, cursor:"pointer", color:occasion===o?"#C9A96E":"#1A1A1A", fontWeight:occasion===o?600:400, borderBottom:"1px solid #F8F5F1" }}>
                  {o}
                </div>
              ))}
            </div>
          )}
        </div>
        <div style={{ fontSize:12, color:"#8B8B8B", fontWeight:500, marginBottom:8 }}>Style Vibe</div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:7 }}>
          {STYLE_VIBES.map(v=>(
            <button key={v} onClick={()=>setStyleVibe(styleVibe===v?"":v)}
              style={{ padding:"6px 13px", borderRadius:20, fontSize:12, fontWeight:500, border:"1.5px solid #E8E4DF", background:styleVibe===v?"#1A1A1A":"#fff", color:styleVibe===v?"#fff":"#555", cursor:"pointer", transition:"all 0.2s" }}>
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Prompt */}
      <div style={{ background:"#fff", borderRadius:16, padding:16, border:"1px solid #F0EDE8", boxShadow:"0 1px 8px rgba(0,0,0,0.05)" }}>
        <div style={{ fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.5px", color:"#1A1A1A", marginBottom:10 }}>Additional Details</div>
        <textarea value={prompt} onChange={e=>setPrompt(e.target.value.slice(0,200))} placeholder="E.g. I love flowy silhouettes, no heels please…" maxLength={200}
          style={{ width:"100%", padding:"12px 14px", borderRadius:12, border:"1.5px solid #E8E4DF", background:"#FAFAF8", fontSize:13, color:"#1A1A1A", resize:"none", height:80, fontFamily:"'DM Sans',sans-serif", outline:"none" }} />
        <div style={{ textAlign:"right", fontSize:11, color:"#B0ABA5", marginTop:4 }}>{prompt.length}/200</div>
      </div>

      {/* CTA */}
      <button onClick={makeOutfits} disabled={!occasion||loading}
        style={{ width:"100%", padding:"15px", borderRadius:14, background:occasion?"linear-gradient(135deg,#1A1A1A,#3D3D3D)":"#E8E4DF", border:"none", color:occasion?"#fff":"#B0ABA5", fontSize:15, fontWeight:700, cursor:occasion?"pointer":"not-allowed", display:"flex", alignItems:"center", justifyContent:"center", gap:10, transition:"all 0.2s" }}>
        {loading?<><div className="az-spin"/>Styling your outfits…</>:"✨ Make Outfits"}
      </button>
    </>
  );

  const ResultsArea = () => (
    <>
      {!outfits.length && !loading && (
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:wide?400:160, background:"#fff", borderRadius:16, border:"2px dashed #E8E4DF", color:"#C0BAB3", gap:10 }}>
          <div style={{ fontSize:44 }}>✨</div>
          <div style={{ fontSize:14, fontWeight:600 }}>Outfits will appear here</div>
          <div style={{ fontSize:12 }}>Select an occasion &amp; click Make Outfits</div>
        </div>
      )}
      {loading && (
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:wide?400:160, background:"#fff", borderRadius:16, border:"1px solid #F0EDE8", color:"#C0BAB3", gap:14 }}>
          <div className="az-spin" style={{ width:36,height:36,borderWidth:3 }}/>
          <div style={{ fontSize:14,fontWeight:600,color:"#C9A96E" }}>Styling your outfits…</div>
        </div>
      )}
      {outfits.length>0 && (
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          <div style={{ fontSize:12,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.5px",color:"#8B8B8B" }}>Your Looks</div>
          {outfits.map((outfit,i)=>(
            <div key={i} className="az-card" style={{ animationDelay:`${i*0.1}s`, background:"#fff", borderRadius:16, padding:16, boxShadow:"0 2px 16px rgba(0,0,0,0.06)", border:"1px solid #F0EDE8" }}>
              <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:10 }}>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <div style={{ width:40,height:40,borderRadius:10,background:outfit.color||"#C9A96E",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0 }}>{outfit.emoji}</div>
                  <div>
                    <div style={{ fontWeight:700,fontSize:15,color:"#1A1A1A",fontFamily:"'Playfair Display',serif" }}>{outfit.name}</div>
                    <div style={{ fontSize:11,color:"#8B8B8B",marginTop:1 }}>{outfit.vibe}</div>
                  </div>
                </div>
                <button style={{ background:"#F5F0EA",border:"none",borderRadius:8,padding:"5px 10px",fontSize:11,fontWeight:600,color:"#C9A96E",cursor:"pointer",whiteSpace:"nowrap" }}>Save</button>
              </div>
              <div style={{ display:"flex",flexDirection:"column",gap:5,marginBottom:10 }}>
                {outfit.items?.map((item:string,j:number)=>(
                  <div key={j} style={{ display:"flex",alignItems:"center",gap:7,fontSize:13,color:"#3D3D3D" }}>
                    <div style={{ width:5,height:5,borderRadius:"50%",background:outfit.color||"#C9A96E",flexShrink:0 }}/>
                    {item}
                  </div>
                ))}
              </div>
              {outfit.tip&&(
                <div style={{ background:"#F8F5F0",borderRadius:10,padding:"9px 12px",display:"flex",gap:8,marginBottom:10 }}>
                  <span style={{ fontSize:14 }}>💡</span>
                  <span style={{ fontSize:12,color:"#6B6B6B",lineHeight:1.5 }}>{outfit.tip}</span>
                </div>
              )}
              <button style={{ width:"100%",padding:"10px",borderRadius:10,background:"transparent",border:`1.5px solid ${outfit.color||"#C9A96E"}`,color:outfit.color||"#C9A96E",fontSize:13,fontWeight:600,cursor:"pointer" }}>
                Try On Virtually →
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );

  return (
    <div ref={containerRef} style={{ fontFamily:"'DM Sans',sans-serif", background:"#FAFAF8", width:"100%", height:"100%", display:"flex", flexDirection:"column", overflow:"hidden", borderRadius:"inherit" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@500;600;700&display=swap');
        *{box-sizing:border-box;}
        .az-card{animation:slideUp 0.4s ease forwards;opacity:0;}
        @keyframes slideUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        .az-spin{width:20px;height:20px;border:2px solid rgba(255,255,255,0.3);border-top:2px solid white;border-radius:50%;animation:spin 1s linear infinite;flex-shrink:0;}
        @keyframes spin{to{transform:rotate(360deg)}}
      `}</style>

      {/* ── Header (always visible) ── */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:wide?"18px 28px 14px":"14px 20px 12px", background:"#fff", borderBottom:"1px solid #F0EDE8", flexShrink:0 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <button onClick={onClose} style={{ background:"none",border:"none",fontSize:20,cursor:"pointer",color:"#1A1A1A",lineHeight:1,padding:0 }}>←</button>
          <div>
            <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:wide?22:18, fontWeight:700, color:"#1A1A1A", margin:0 }}>AI Outfit Maker</h1>
            <p style={{ fontSize:12, color:"#8B8B8B", margin:0, marginTop:1 }}>Styled by your personal AI stylist</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} style={{ width:32,height:32,borderRadius:"50%",border:"1px solid #E8E4DF",background:"#fff",fontSize:16,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"#555",flexShrink:0 }}>✕</button>
        )}
      </div>

      {/* ── Body ── */}
      <div style={{ flex:1, overflowY:"auto", padding:wide?"20px 28px":"16px" }}>
        {wide ? (
          /* Desktop two-column inside the modal */
          <div style={{ display:"grid", gridTemplateColumns:"320px 1fr", gap:20, alignItems:"start" }}>
            {/* Left — form */}
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              <div style={{ fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.8px",color:"#A0A0A0" }}>Configure your look</div>
              <StylistCard/>
              <FormFields/>
            </div>
            {/* Right — results */}
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              <div style={{ fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.8px",color:"#A0A0A0" }}>Your looks</div>
              <ResultsArea/>
            </div>
          </div>
        ) : (
          /* Mobile single column */
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <StylistCard/>
            <FormFields/>
            <ResultsArea/>
          </div>
        )}
      </div>
    </div>
  );
}
