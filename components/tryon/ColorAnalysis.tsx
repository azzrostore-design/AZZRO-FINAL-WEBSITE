"use client";
import { useState, useRef, useEffect } from "react";

const SKIN_TONES = [
  { id:"fair",   label:"Fair",   color:"#FDDBB4", season:"Winter / Spring" },
  { id:"light",  label:"Light",  color:"#F0C896", season:"Spring / Summer" },
  { id:"medium", label:"Medium", color:"#D9A876", season:"Summer / Autumn" },
  { id:"tan",    label:"Tan",    color:"#BE8A5C", season:"Autumn / Winter" },
  { id:"deep",   label:"Deep",   color:"#8B5E3C", season:"Deep Winter" },
  { id:"rich",   label:"Rich",   color:"#5C3520", season:"Deep Autumn" },
];

const PALETTES: Record<string,{season:string;desc:string;best:string[];avoid:string[];neutrals:string[]}> = {
  fair:   {season:"Winter / Spring",  desc:"Crisp, cool, icy tones with high contrast.",    best:["#B8D4F0","#E8B4D4","#D4E8B4","#F0E8B4","#B4D4E8","#F5B4C8"], avoid:["#8B4513","#D2691E","#CD853F","#A0522D"], neutrals:["#F5F5F5","#E0E0E0","#2D2D2D","#1A1A1A"]},
  light:  {season:"Spring / Summer",  desc:"Warm peachy and golden tones make you glow.",   best:["#FFD4A0","#FFA08C","#FFE0B0","#B4E8D4","#FFB4C8","#E8D4B4"], avoid:["#4B0082","#000080","#006400","#8B0000"], neutrals:["#FFF8F0","#F5E8D8","#8B7355","#5C4A32"]},
  medium: {season:"Summer / Autumn",  desc:"Earth tones and warm jewel hues complement.",   best:["#CC6600","#FF8C42","#D4A043","#8B6914","#CC5500","#E8A050"], avoid:["#F5F5DC","#FFFACD","#E0E0E0","#C0C0C0"], neutrals:["#F5E8D0","#E8D0B0","#8B6914","#4A3520"]},
  tan:    {season:"Autumn / Winter",  desc:"Rich, earthy, and jewel tones align beautifully.",best:["#CC3300","#8B0000","#6B3A2A","#CC6600","#4A3520","#8B4513"], avoid:["#E0E8F0","#B0C4DE","#E8E8E8","#D8D8D8"], neutrals:["#3D2B1A","#6B4423","#CC8840","#F5DEB3"]},
  deep:   {season:"Deep Winter",      desc:"Bold vivid colors celebrate your radiant complexion.",best:["#FF4500","#FFD700","#FF1493","#00CED1","#7B68EE","#32CD32"], avoid:["#808080","#A9A9A9","#D3D3D3","#DCDCDC"], neutrals:["#1A1A1A","#2D2D2D","#F5F5F5","#FFFFFF"]},
  rich:   {season:"Deep Autumn",      desc:"Deep jewel tones bring out your warmth.",         best:["#8B1A1A","#CC5500","#8B6914","#4B6741","#8B1A8B","#1A3A8B"], avoid:["#FFE4E1","#FFDAB9","#E8E8E8","#FFFAF0"], neutrals:["#2D1A0D","#5C3520","#CC8840","#F0DEC0"]},
};

export default function ColorAnalysis({ onClose }: { onClose?: () => void }) {
  const [selectedTone, setSelectedTone]   = useState("");
  const [analyzed, setAnalyzed]           = useState(false);
  const [loading, setLoading]             = useState(false);
  const [aiResult, setAiResult]           = useState<any>(null);
  const [uploadedImage, setUploadedImage] = useState<string|null>(null);
  const [containerW, setContainerW]       = useState(400);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileRef      = useRef<HTMLInputElement>(null);

  useEffect(()=>{
    const measure = ()=>{ if(containerRef.current) setContainerW(containerRef.current.offsetWidth); };
    measure();
    const ro = new ResizeObserver(measure);
    if(containerRef.current) ro.observe(containerRef.current);
    return ()=>ro.disconnect();
  },[]);

  const wide    = containerW >= 680;
  const palette = selectedTone ? PALETTES[selectedTone] : null;
  const tone    = selectedTone ? SKIN_TONES.find(t=>t.id===selectedTone) : null;

  const analyze = async () => {
    if(!selectedTone && !uploadedImage) return;
    setLoading(true);
    try {
      const userContent: any[] = uploadedImage
        ? [
            {type:"image",source:{type:"base64",media_type:"image/jpeg",data:uploadedImage.split(",")[1]}},
            {type:"text",text:`Analyze skin tone and give fashion color advice. Return ONLY JSON: {"season":"Winter","undertone":"Cool","skinTone":"Fair","bestColors":["Navy","Ivory","Ruby","Emerald"],"avoidColors":["Orange","Yellow-green"],"outfit_tip":"Styling insight","celebrity":"Celebrity with similar coloring","confidence":92}`}
          ]
        : [{type:"text",text:`For ${tone?.label} (${tone?.season}) skin, give fashion color advice as JSON: {"season":"${tone?.season}","undertone":"Warm","skinTone":"${tone?.label}","bestColors":["c1","c2","c3","c4"],"avoidColors":["c1","c2"],"outfit_tip":"Specific tip","celebrity":"Bollywood or Hollywood celeb","confidence":89}`}];

      const res = await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,system:"You are a professional color analysis expert. Respond ONLY valid JSON no markdown.",messages:[{role:"user",content:userContent}]}),
      });
      const data = await res.json();
      const txt  = data.content?.map((c:any)=>c.text||"").join("")||"";
      setAiResult(JSON.parse(txt.replace(/```json|```/g,"").trim()));
    } catch { setAiResult(null); }
    setAnalyzed(true); setLoading(false);
  };

  const handleUpload = (e:React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if(!file) return;
    const reader = new FileReader();
    reader.onload = ()=>{ setUploadedImage(reader.result as string); setSelectedTone(""); setAnalyzed(false); setAiResult(null); };
    reader.readAsDataURL(file);
  };

  /* ─── Config panel (left on desktop, top on mobile) ─── */
  const ConfigPanel = () => (
    <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
      {/* Upload */}
      <div style={{ background:"#fff", borderRadius:16, padding:16, border:"1px solid #F0EDE8" }}>
        <div style={{ fontSize:12,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.5px",color:"#1A1A1A",marginBottom:12 }}>AI Photo Analysis</div>
        {uploadedImage ? (
          <div style={{ position:"relative",borderRadius:14,overflow:"hidden",height:150 }}>
            <img src={uploadedImage} alt="Uploaded" style={{ width:"100%",height:"100%",objectFit:"cover" }}/>
            <div style={{ position:"absolute",inset:0,background:"linear-gradient(to bottom,transparent 50%,rgba(0,0,0,0.5))" }}/>
            <div style={{ position:"absolute",bottom:12,left:12,right:12,display:"flex",justifyContent:"space-between",alignItems:"center" }}>
              <span style={{ color:"#fff",fontWeight:600,fontSize:13 }}>✓ Photo uploaded</span>
              <button onClick={()=>{setUploadedImage(null);setAnalyzed(false);setAiResult(null);}} style={{ background:"rgba(255,255,255,0.2)",border:"1px solid rgba(255,255,255,0.4)",borderRadius:8,padding:"5px 10px",color:"#fff",fontSize:11,cursor:"pointer" }}>Change</button>
            </div>
          </div>
        ) : (
          <div onClick={()=>fileRef.current?.click()} style={{ borderRadius:14,border:"2px dashed #E8E4DF",background:"#FAFAF8",padding:"20px 16px",display:"flex",flexDirection:"column",alignItems:"center",gap:8,cursor:"pointer" }}>
            <div style={{ width:46,height:46,borderRadius:12,background:"linear-gradient(135deg,#FBF7F0,#F5E8D0)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24 }}>📷</div>
            <div style={{ textAlign:"center" }}>
              <div style={{ fontWeight:700,fontSize:13,color:"#1A1A1A",marginBottom:2 }}>Upload Your Selfie</div>
              <div style={{ fontSize:11,color:"#8B8B8B" }}>AI detects your skin tone automatically</div>
            </div>
            <div style={{ background:"#C9A96E",color:"#fff",borderRadius:10,padding:"7px 18px",fontSize:12,fontWeight:600 }}>Upload Photo</div>
          </div>
        )}
        <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={handleUpload}/>
      </div>

      {/* Divider */}
      <div style={{ display:"flex",alignItems:"center",gap:10 }}>
        <div style={{ flex:1,height:1,background:"#E8E4DF" }}/>
        <span style={{ fontSize:11,color:"#8B8B8B",fontWeight:500 }}>or select manually</span>
        <div style={{ flex:1,height:1,background:"#E8E4DF" }}/>
      </div>

      {/* Tone grid */}
      <div style={{ background:"#fff",borderRadius:16,padding:16,border:"1px solid #F0EDE8" }}>
        <div style={{ fontSize:12,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.5px",color:"#1A1A1A",marginBottom:12 }}>Your Skin Tone</div>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:8 }}>
          {SKIN_TONES.map(t=>(
            <div key={t.id} onClick={()=>{setSelectedTone(t.id);setUploadedImage(null);setAnalyzed(false);setAiResult(null);}} style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:5,cursor:"pointer" }}>
              <div style={{ width:40,height:40,borderRadius:12,background:t.color,border:`3px solid ${selectedTone===t.id?"#1A1A1A":"transparent"}`,boxShadow:selectedTone===t.id?"0 0 0 2px #C9A96E":"none",transition:"all 0.2s" }}/>
              <span style={{ fontSize:9,color:selectedTone===t.id?"#1A1A1A":"#8B8B8B",fontWeight:selectedTone===t.id?700:400,textAlign:"center" }}>{t.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Selection preview */}
      {(selectedTone||uploadedImage) && !analyzed && (
        <div style={{ background:"#fff",borderRadius:14,padding:14,border:"1px solid #F0EDE8",display:"flex",alignItems:"center",gap:10 }}>
          <div style={{ width:44,height:44,borderRadius:12,background:tone?tone.color:"linear-gradient(135deg,#FDD8B0,#D4956A)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:tone?undefined:20,flexShrink:0 }}>
            {!tone&&"🤳"}
          </div>
          <div>
            <div style={{ fontWeight:700,fontSize:14,fontFamily:"'Playfair Display',serif",color:"#1A1A1A" }}>{tone?`${tone.label} Skin Tone`:"Photo Ready"}</div>
            <div style={{ fontSize:11,color:"#8B8B8B" }}>{tone?tone.season:"AI will analyze from photo"}</div>
          </div>
        </div>
      )}

      {/* Quick preview */}
      {selectedTone && palette && !analyzed && (
        <div style={{ background:"#fff",borderRadius:14,padding:14,border:"1px solid #F0EDE8" }}>
          <div style={{ fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.5px",color:"#8B8B8B",marginBottom:10 }}>Preview — Best Colors</div>
          <div style={{ display:"flex",gap:7,flexWrap:"wrap" }}>
            {palette.best.map((c,i)=><div key={i} style={{ width:36,height:36,borderRadius:10,background:c,boxShadow:"0 2px 6px rgba(0,0,0,0.1)" }}/>)}
          </div>
        </div>
      )}

      {/* Button */}
      <button onClick={analyze} disabled={(!selectedTone&&!uploadedImage)||loading}
        style={{ width:"100%",padding:"15px",borderRadius:14,background:(selectedTone||uploadedImage)?"linear-gradient(135deg,#C9A96E,#E8C88A)":"#E8E4DF",border:"none",color:(selectedTone||uploadedImage)?"#1A1A1A":"#B0ABA5",fontSize:14,fontWeight:700,cursor:(selectedTone||uploadedImage)?"pointer":"not-allowed",display:"flex",alignItems:"center",justifyContent:"center",gap:10 }}>
        {loading?<><div className="ca-spin"/>Analyzing…</>:"🎨 Analyze My Colors"}
      </button>
    </div>
  );

  /* ─── Results panel ─── */
  const ResultsPanel = () => (
    <>
      {!analyzed && !loading && (
        <div style={{ display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:wide?420:160,background:"#fff",borderRadius:16,border:"2px dashed #E8E4DF",color:"#C0BAB3",gap:10 }}>
          <div style={{ fontSize:44 }}>🎨</div>
          <div style={{ fontSize:14,fontWeight:600 }}>Your palette will appear here</div>
          <div style={{ fontSize:12 }}>Select skin tone or upload a photo</div>
        </div>
      )}
      {loading && (
        <div style={{ display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:wide?420:160,background:"#fff",borderRadius:16,border:"1px solid #F0EDE8",color:"#C0BAB3",gap:14 }}>
          <div className="ca-spin" style={{ width:36,height:36,borderWidth:3 }}/>
          <div style={{ fontSize:14,fontWeight:600,color:"#C9A96E" }}>Analyzing your colors…</div>
        </div>
      )}
      {analyzed && (palette||aiResult) && (
        <div className="ca-fade" style={{ display:"flex",flexDirection:"column",gap:14 }}>
          {/* Season hero */}
          <div style={{ background:"linear-gradient(135deg,#1A1A1A,#3D3D3D)",borderRadius:18,padding:wide?22:18,color:"#fff" }}>
            <div style={{ fontSize:10,color:"rgba(255,255,255,0.5)",textTransform:"uppercase",letterSpacing:"1px",marginBottom:6 }}>Your Color Season</div>
            <div style={{ fontFamily:"'Playfair Display',serif",fontSize:wide?28:22,fontWeight:700,marginBottom:6 }}>{aiResult?.season||palette?.season}</div>
            <div style={{ fontSize:12,color:"rgba(255,255,255,0.7)",lineHeight:1.6 }}>{aiResult?.outfit_tip||palette?.desc}</div>
            {aiResult?.confidence && (
              <div style={{ marginTop:14,display:"flex",alignItems:"center",gap:8 }}>
                <div style={{ flex:1,height:3,borderRadius:2,background:"rgba(255,255,255,0.15)" }}>
                  <div style={{ width:`${aiResult.confidence}%`,height:"100%",borderRadius:2,background:"#C9A96E",transition:"width 1s ease" }}/>
                </div>
                <span style={{ fontSize:12,color:"#C9A96E",fontWeight:700 }}>{aiResult.confidence}%</span>
              </div>
            )}
          </div>

          {/* Best */}
          <div style={{ background:"#fff",borderRadius:16,padding:16,border:"1px solid #F0EDE8" }}>
            <div style={{ display:"flex",alignItems:"center",gap:7,marginBottom:12 }}>
              <div style={{ width:24,height:24,borderRadius:7,background:"#F0FBF0",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12 }}>✓</div>
              <div style={{ fontWeight:700,fontSize:14,color:"#1A1A1A" }}>Your Best Colors</div>
            </div>
            <div style={{ display:"flex",gap:8,flexWrap:"wrap" }}>
              {aiResult?.bestColors?.length
                ? aiResult.bestColors.map((c:string,i:number)=>(
                    <div key={i} style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:5 }}>
                      <div style={{ width:44,height:44,borderRadius:12,background:`hsl(${i*55},45%,60%)`,boxShadow:"0 2px 8px rgba(0,0,0,0.1)" }}/>
                      <span style={{ fontSize:9,color:"#6B6B6B",textAlign:"center",maxWidth:48 }}>{c}</span>
                    </div>
                  ))
                : palette?.best.map((c,i)=><div key={i} style={{ width:44,height:44,borderRadius:12,background:c,boxShadow:"0 2px 8px rgba(0,0,0,0.1)" }}/>)
              }
            </div>
          </div>

          {/* Neutrals */}
          {palette?.neutrals && (
            <div style={{ background:"#fff",borderRadius:16,padding:16,border:"1px solid #F0EDE8" }}>
              <div style={{ display:"flex",alignItems:"center",gap:7,marginBottom:12 }}>
                <div style={{ width:24,height:24,borderRadius:7,background:"#F5F5F5",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12 }}>◑</div>
                <div style={{ fontWeight:700,fontSize:14,color:"#1A1A1A" }}>Your Neutrals</div>
              </div>
              <div style={{ display:"flex",gap:8 }}>
                {palette.neutrals.map((c,i)=><div key={i} style={{ width:44,height:44,borderRadius:12,background:c,boxShadow:"0 2px 8px rgba(0,0,0,0.1)",border:["#F5F5F5","#FFF8F0","#FFFFFF"].includes(c)?"1px solid #E8E4DF":"none" }}/>)}
              </div>
            </div>
          )}

          {/* Avoid */}
          <div style={{ background:"#fff",borderRadius:16,padding:16,border:"1px solid #F0EDE8" }}>
            <div style={{ display:"flex",alignItems:"center",gap:7,marginBottom:12 }}>
              <div style={{ width:24,height:24,borderRadius:7,background:"#FFF0F0",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12 }}>✕</div>
              <div style={{ fontWeight:700,fontSize:14,color:"#1A1A1A" }}>Colors to Avoid</div>
            </div>
            <div style={{ display:"flex",gap:8,flexWrap:"wrap" }}>
              {aiResult?.avoidColors?.length
                ? aiResult.avoidColors.map((c:string,i:number)=>(
                    <div key={i} style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:5 }}>
                      <div style={{ width:44,height:44,borderRadius:12,background:`hsl(${i*80+20},40%,55%)`,opacity:0.5,position:"relative",boxShadow:"0 2px 8px rgba(0,0,0,0.1)" }}>
                        <div style={{ position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,color:"#fff" }}>✕</div>
                      </div>
                      <span style={{ fontSize:9,color:"#6B6B6B",textAlign:"center",maxWidth:48 }}>{c}</span>
                    </div>
                  ))
                : palette?.avoid.map((c,i)=>(
                    <div key={i} style={{ width:44,height:44,borderRadius:12,background:c,opacity:0.5,position:"relative",boxShadow:"0 2px 8px rgba(0,0,0,0.1)" }}>
                      <div style={{ position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,color:"rgba(255,255,255,0.8)",borderRadius:12 }}>✕</div>
                    </div>
                  ))
              }
            </div>
          </div>

          {/* Celebrity */}
          {aiResult?.celebrity && (
            <div style={{ background:"linear-gradient(135deg,#FBF7F0,#F5E8D0)",borderRadius:16,padding:16,border:"1px solid #E8D8B8",display:"flex",gap:12,alignItems:"center" }}>
              <div style={{ width:44,height:44,borderRadius:12,background:"#C9A96E",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0 }}>⭐</div>
              <div>
                <div style={{ fontSize:10,color:"#8B8B8B",textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:3 }}>Similar Coloring To</div>
                <div style={{ fontWeight:700,fontSize:15,color:"#1A1A1A",fontFamily:"'Playfair Display',serif" }}>{aiResult.celebrity}</div>
              </div>
            </div>
          )}

          <button style={{ width:"100%",padding:"15px",borderRadius:14,background:"linear-gradient(135deg,#1A1A1A,#3D3D3D)",border:"none",color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer" }}>
            Shop My Color Palette →
          </button>
        </div>
      )}
    </>
  );

  return (
    <div ref={containerRef} style={{ fontFamily:"'DM Sans',sans-serif",background:"#FAFAF8",width:"100%",height:"100%",display:"flex",flexDirection:"column",overflow:"hidden",borderRadius:"inherit" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@500;600;700&display=swap');
        *{box-sizing:border-box;}
        .ca-fade{animation:fadeIn 0.5s ease;}
        @keyframes fadeIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        .ca-spin{width:20px;height:20px;border:2px solid #F0EDE8;border-top:2px solid #C9A96E;border-radius:50%;animation:spin 1s linear infinite;flex-shrink:0;}
        @keyframes spin{to{transform:rotate(360deg)}}
      `}</style>

      {/* Header */}
      <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:wide?"18px 28px 14px":"14px 20px 12px",background:"#fff",borderBottom:"1px solid #F0EDE8",flexShrink:0 }}>
        <div style={{ display:"flex",alignItems:"center",gap:10 }}>
          <button onClick={onClose} style={{ background:"none",border:"none",fontSize:20,cursor:"pointer",color:"#1A1A1A",lineHeight:1,padding:0 }}>←</button>
          <div>
            <h1 style={{ fontFamily:"'Playfair Display',serif",fontSize:wide?22:18,fontWeight:700,color:"#1A1A1A",margin:0 }}>Color Analysis</h1>
            <p style={{ fontSize:12,color:"#8B8B8B",margin:0,marginTop:1 }}>Discover your perfect color palette</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} style={{ width:30,height:30,borderRadius:"50%",border:"1px solid #E8E4DF",background:"#fff",fontSize:15,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"#555",flexShrink:0 }}>✕</button>
        )}
      </div>

      {/* Body */}
      <div style={{ flex:1,overflowY:"auto",padding:wide?"20px 28px":"16px" }}>
        {wide ? (
          <div style={{ display:"grid",gridTemplateColumns:"320px 1fr",gap:20,alignItems:"start" }}>
            <div>
              <div style={{ fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.8px",color:"#A0A0A0",marginBottom:14 }}>Configure analysis</div>
              <ConfigPanel/>
            </div>
            <div>
              <div style={{ fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.8px",color:"#A0A0A0",marginBottom:14 }}>Your palette</div>
              <ResultsPanel/>
            </div>
          </div>
        ) : (
          <div style={{ display:"flex",flexDirection:"column",gap:14 }}>
            <ConfigPanel/>
            <ResultsPanel/>
          </div>
        )}
      </div>
    </div>
  );
}
