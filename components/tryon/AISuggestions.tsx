"use client";
import { useState, useRef, useEffect } from "react";

const QUICK_CHIPS = [
  "Suggest a casual outfit ☕",
  "What to wear on a date? 💕",
  "Office look for tomorrow 💼",
  "Festival outfit ideas 🎪",
  "Beach day vibes 🌊",
  "Ethnic wear for a wedding 🌸",
];

type Outfit = { label:string; tag:string; match:number; items:string[]; color:string; accent:string; emoji:string; tip?:string };
type Message = { role:"user"|"assistant"; text?:string; outfits?:Outfit[]; isLoading?:boolean };

export default function AISuggestions({ onClose }: { onClose?: () => void }) {
  const [messages, setMessages] = useState<Message[]>([
    { role:"assistant", text:"Hi! I'm your personal Azzro fashion stylist. Tell me what you're looking for or pick a suggestion below! 👗✨" }
  ]);
  const [input, setInput]         = useState("");
  const [loading, setLoading]     = useState(false);
  const [containerW, setContainerW] = useState(400);
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef    = useRef<HTMLDivElement>(null);

  useEffect(()=>{
    const measure = () => { if(containerRef.current) setContainerW(containerRef.current.offsetWidth); };
    measure();
    const ro = new ResizeObserver(measure);
    if(containerRef.current) ro.observe(containerRef.current);
    return ()=>ro.disconnect();
  },[]);

  useEffect(()=>{ bottomRef.current?.scrollIntoView({behavior:"smooth"}); },[messages]);

  const wide = containerW >= 680;

  const send = async (text:string) => {
    if(!text.trim()||loading) return;
    setMessages(prev=>[...prev,{role:"user",text},{role:"assistant",isLoading:true}]);
    setInput(""); setLoading(true);
    try {
      const history = messages.filter(m=>!m.isLoading).map(m=>({role:m.role,content:m.text||""}));
      const res = await fetch("/api/ai",{
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          max_tokens:1000,
          system:`You are Azzro's AI fashion stylist. When user asks for outfit suggestions, write a short friendly reply then append:
OUTFITS_JSON:{"outfits":[{"label":"Name","tag":"Style · Occasion","match":95,"items":["item1","item2","item3"],"color":"#FDE8E8","accent":"#E84C6B","emoji":"👗","tip":"Brief tip"}]}
For general questions answer naturally without JSON.`,
          messages:[...history,{role:"user",content:text}],
        }),
      });
      const data = await res.json();
      const full = data.text||"";
      let replyText=full; let outfits:Outfit[]|undefined;
      if(full.includes("OUTFITS_JSON:")){
        const [pre,json]=full.split("OUTFITS_JSON:");
        replyText=pre.trim();
        try{ outfits=JSON.parse(json.trim()).outfits; }catch{}
      }
      setMessages(prev=>[...prev.filter(m=>!m.isLoading),{role:"assistant",text:replyText,outfits}]);
    } catch {
      setMessages(prev=>[...prev.filter(m=>!m.isLoading),{role:"assistant",text:"Sorry, connection issue. Try again! 💫"}]);
    }
    setLoading(false);
  };

  const OutfitCard = ({o}:{o:Outfit}) => (
    <div style={{ flexShrink:0, width:wide?190:165, background:"#fff", borderRadius:18, overflow:"hidden", boxShadow:"0 4px 16px rgba(0,0,0,0.08)", border:"1px solid #F0EDE8" }}>
      <div style={{ height:wide?170:150, background:o.color||"#F5F0EA", display:"flex", alignItems:"center", justifyContent:"center", position:"relative" }}>
        <span style={{ fontSize:wide?56:48 }}>{o.emoji}</span>
        <div style={{ position:"absolute",top:10,right:10,background:o.accent||"#C9A96E",color:"#fff",borderRadius:20,padding:"3px 8px",fontSize:10,fontWeight:700 }}>{o.match}%</div>
      </div>
      <div style={{ padding:"11px 13px" }}>
        <div style={{ fontWeight:700,fontSize:13,color:"#1A1A1A",marginBottom:2,fontFamily:"'Playfair Display',serif" }}>{o.label}</div>
        <div style={{ fontSize:10,color:o.accent||"#C9A96E",fontWeight:600,marginBottom:7 }}>{o.tag}</div>
        {o.items.map((item,k)=>(
          <div key={k} style={{ fontSize:11,color:"#6B6B6B",marginBottom:3,display:"flex",alignItems:"center",gap:5 }}>
            <div style={{ width:4,height:4,borderRadius:"50%",background:o.accent||"#C9A96E",flexShrink:0 }}/>
            {item}
          </div>
        ))}
        <button style={{ width:"100%",marginTop:9,padding:"7px 0",borderRadius:9,background:o.accent||"#C9A96E",border:"none",color:"#fff",fontSize:11,fontWeight:700,cursor:"pointer" }}>
          Try On →
        </button>
      </div>
    </div>
  );

  const ChatFeed = () => (
    <div style={{ flex:1,overflowY:"auto",padding:"16px 16px 0",display:"flex",flexDirection:"column",gap:14 }}>
      {messages.map((msg,i)=>(
        <div key={i} className="az-msg" style={{ display:"flex",flexDirection:"column",alignItems:msg.role==="user"?"flex-end":"flex-start",gap:8 }}>
          {msg.isLoading ? (
            <div style={{ background:"#fff",border:"1px solid #F0EDE8",borderRadius:"18px 18px 18px 4px",padding:"12px 16px" }}>
              <div style={{ display:"flex",gap:4 }}>
                {[0,1,2].map(n=><div key={n} className="az-dot" style={{ animationDelay:`${n*0.2}s`,width:7,height:7,borderRadius:"50%",background:"#C9A96E" }}/>)}
              </div>
            </div>
          ) : msg.text ? (
            <div style={{ maxWidth:"82%",padding:"11px 15px",borderRadius:msg.role==="user"?"18px 18px 4px 18px":"18px 18px 18px 4px",background:msg.role==="user"?"linear-gradient(135deg,#1A1A1A,#3D3D3D)":"#fff",color:msg.role==="user"?"#fff":"#1A1A1A",fontSize:13,lineHeight:1.6,boxShadow:"0 2px 8px rgba(0,0,0,0.06)",border:msg.role==="assistant"?"1px solid #F0EDE8":"none" }}>
              {msg.text}
            </div>
          ) : null}
          {msg.outfits&&msg.outfits.length>0 && (
            <div style={{ width:"100%",overflowX:"auto",paddingBottom:6 }}>
              <div style={{ display:"flex",gap:12,width:"max-content" }}>
                {msg.outfits.map((o,j)=><OutfitCard key={j} o={o}/>)}
              </div>
            </div>
          )}
        </div>
      ))}
      <div ref={bottomRef}/>
    </div>
  );

  const InputBar = () => (
    <div style={{ borderTop:"1px solid #F0EDE8",background:"#FAFAF8",flexShrink:0 }}>
      {/* Chips — horizontal scroll */}
      <div style={{ padding:"10px 14px 6px",overflowX:"auto",whiteSpace:"nowrap" }}>
        {QUICK_CHIPS.map(chip=>(
          <button key={chip} onClick={()=>send(chip)} style={{ display:"inline-block",marginRight:7,padding:"6px 13px",borderRadius:20,fontSize:12,fontWeight:500,border:"1.5px solid #E8E4DF",background:"#fff",color:"#3D3D3D",cursor:"pointer",whiteSpace:"nowrap" }}>
            {chip}
          </button>
        ))}
      </div>
      <div style={{ padding:"6px 14px 14px",display:"flex",gap:8,alignItems:"center" }}>
        <div style={{ flex:1,background:"#fff",borderRadius:22,border:"1.5px solid #E8E4DF",padding:"10px 16px",display:"flex",alignItems:"center" }}>
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send(input)} placeholder="Ask me anything about fashion…" style={{ flex:1,border:"none",outline:"none",fontSize:13,fontFamily:"'DM Sans',sans-serif",background:"transparent",color:"#1A1A1A" }}/>
        </div>
        <button onClick={()=>send(input)} disabled={!input.trim()||loading} style={{ width:42,height:42,borderRadius:"50%",background:input.trim()?"linear-gradient(135deg,#1A1A1A,#3D3D3D)":"#E8E4DF",border:"none",color:"#fff",fontSize:16,cursor:input.trim()?"pointer":"not-allowed",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
          ↑
        </button>
      </div>
    </div>
  );

  return (
    <div ref={containerRef} style={{ fontFamily:"'DM Sans',sans-serif",background:"#FAFAF8",width:"100%",height:"100%",display:"flex",flexDirection:"column",overflow:"hidden",borderRadius:"inherit" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@500;600;700&display=swap');
        *{box-sizing:border-box;}
        .az-msg{animation:msgIn 0.25s ease;}
        @keyframes msgIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        .az-dot{animation:dotBlink 1.4s ease infinite;}
        @keyframes dotBlink{0%,80%,100%{opacity:0.2;transform:scale(0.8)}40%{opacity:1;transform:scale(1)}}
      `}</style>

      {wide ? (
        /* ── Desktop: left sidebar + right chat ── */
        <div style={{ display:"flex",flex:1,overflow:"hidden" }}>
          {/* Sidebar */}
          <div style={{ width:260,background:"#fff",borderRight:"1px solid #F0EDE8",display:"flex",flexDirection:"column",padding:"22px 20px",gap:18,flexShrink:0,overflowY:"auto" }}>
            <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between" }}>
              <div>
                <div style={{ fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:700,color:"#1A1A1A" }}>AI Style Chat</div>
                <div style={{ display:"flex",alignItems:"center",gap:5,marginTop:4 }}>
                  <div style={{ width:7,height:7,borderRadius:"50%",background:"#4CAF50" }}/>
                  <span style={{ fontSize:11,color:"#6B6B6B" }}>Azzro Stylist · Online</span>
                </div>
              </div>
              {onClose&&<button onClick={onClose} style={{ width:30,height:30,borderRadius:"50%",border:"1px solid #E8E4DF",background:"#fff",fontSize:15,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"#555",flexShrink:0 }}>✕</button>}
            </div>
            <div style={{ width:56,height:56,borderRadius:16,background:"linear-gradient(135deg,#C9A96E,#E8C88A)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28 }}>✨</div>
            <div style={{ fontSize:13,color:"#6B6B6B",lineHeight:1.6 }}>Ask me anything about fashion — outfits, occasions, styling tips, or color matching.</div>
            <div>
              <div style={{ fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.7px",color:"#A0A0A0",marginBottom:10 }}>Quick Suggestions</div>
              <div style={{ display:"flex",flexDirection:"column",gap:7 }}>
                {QUICK_CHIPS.map(chip=>(
                  <button key={chip} onClick={()=>send(chip)} style={{ textAlign:"left",padding:"9px 12px",borderRadius:10,fontSize:12,fontWeight:500,border:"1.5px solid #E8E4DF",background:"#FAFAF8",color:"#3D3D3D",cursor:"pointer",lineHeight:1.4 }}>
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          </div>
          {/* Chat */}
          <div style={{ flex:1,display:"flex",flexDirection:"column",overflow:"hidden" }}>
            <ChatFeed/>
            <InputBar/>
          </div>
        </div>
      ) : (
        /* ── Mobile: stacked header + chat ── */
        <>
          <div style={{ padding:"14px 16px 12px",background:"#fff",borderBottom:"1px solid #F0EDE8",display:"flex",alignItems:"center",gap:10,flexShrink:0 }}>
            <button onClick={onClose} style={{ background:"none",border:"none",fontSize:20,cursor:"pointer",color:"#1A1A1A" }}>←</button>
            <div style={{ flex:1 }}>
              <div style={{ fontFamily:"'Playfair Display',serif",fontSize:17,fontWeight:700,color:"#1A1A1A" }}>AI Style Chat</div>
              <div style={{ display:"flex",alignItems:"center",gap:5,marginTop:2 }}>
                <div style={{ width:6,height:6,borderRadius:"50%",background:"#4CAF50" }}/>
                <span style={{ fontSize:11,color:"#6B6B6B" }}>Azzro Stylist · Online</span>
              </div>
            </div>
            <div style={{ width:34,height:34,borderRadius:"50%",background:"linear-gradient(135deg,#C9A96E,#E8C88A)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16 }}>✨</div>
          </div>
          <ChatFeed/>
          <InputBar/>
        </>
      )}
    </div>
  );
}
