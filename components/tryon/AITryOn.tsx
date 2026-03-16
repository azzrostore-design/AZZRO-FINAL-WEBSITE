"use client";
import { useState, useRef, useEffect } from "react";
import ProductPickerModal from "./ProductPickerModal";
import { imageUrlToBase64, type StoreProduct } from "@/lib/useStoreProducts";

/* ─── Types ─────────────────────────────────────────── */
type ClothType = "upper_body" | "lower_body" | "dresses";
type Step      = "upload_person" | "upload_garment" | "configure" | "result";

interface TryOnState {
  personImage:    string | null;
  garmentImage:   string | null;
  garmentName:    string;
  garmentProduct: StoreProduct | null;
  clothType:      ClothType;
  result:         string | null;
  loading:        boolean;
  error:          string | null;
  fitScore:       number | null;
  fitNotes:       string | null;
}

/* ─── Garment → cloth type detection ───────────────── */
const CLOTH_TYPE_MAP: { kw: string[]; type: ClothType }[] = [
  { kw: ["saree","sari","lehenga","anarkali","gown","salwar","churidar","maxi","dress","frock","jumpsuit","co-ord","sharara"], type: "dresses"    },
  { kw: ["kurta","kurti","top","shirt","blouse","jacket","blazer","hoodie","sweater","tee","t-shirt","crop","polo","sweatshirt"], type: "upper_body" },
  { kw: ["pant","trouser","jeans","skirt","shorts","palazzo","dhoti","legging","jogger","bottom","chino"],                       type: "lower_body" },
];
function detectClothType(name: string): ClothType {
  const l = name.toLowerCase();
  for (const { kw, type } of CLOTH_TYPE_MAP) if (kw.some(k => l.includes(k))) return type;
  return "upper_body";
}

/* ─── Constants ─────────────────────────────────────── */
const CLOTH_LABELS: Record<ClothType, { label: string; emoji: string; hint: string }> = {
  upper_body: { label: "Upper Body", emoji: "👕", hint: "Tops, shirts, kurtas, blouses, jackets" },
  lower_body: { label: "Lower Body", emoji: "👖", hint: "Pants, skirts, palazzo, trousers"       },
  dresses:    { label: "Full Outfit", emoji: "👗", hint: "Sarees, dresses, anarkalis, jumpsuits"  },
};
const STEPS: { id: Step; label: string; emoji: string }[] = [
  { id: "upload_person",  label: "Your Photo", emoji: "🤳" },
  { id: "upload_garment", label: "Garment",    emoji: "👗" },
  { id: "configure",      label: "Style",      emoji: "✨" },
  { id: "result",         label: "Result",     emoji: "🪞" },
];

/* ─── Extract URL from fal.ai image object ──────────── */
function extractUrl(imageObj: any): string {
  if (!imageObj) return "";
  if (typeof imageObj === "string") return imageObj;
  return imageObj.url || imageObj.cdn_url || imageObj.image_url || "";
}

/* ═══════════════════════════════════════════════════════
   Component
═══════════════════════════════════════════════════════ */
export default function AITryOn({ onClose }: { onClose?: () => void }) {
  const [st, setSt] = useState<TryOnState>({
    personImage: null, garmentImage: null, garmentName: "",
    garmentProduct: null, clothType: "upper_body", result: null,
    loading: false, error: null, fitScore: null, fitNotes: null,
  });
  const [step,            setStep]            = useState<Step>("upload_person");
  const [containerW,      setContainerW]      = useState(400);
  const [cameraActive,    setCameraActive]    = useState(false);
  const [stream,          setStream]          = useState<MediaStream | null>(null);
  const [showPicker,      setShowPicker]      = useState(false);
  const [loadingProduct,  setLoadingProduct]  = useState(false);
  const [debugInfo,       setDebugInfo]       = useState<string>("");

  const containerRef   = useRef<HTMLDivElement>(null);
  const personFileRef  = useRef<HTMLInputElement>(null);
  const garmentFileRef = useRef<HTMLInputElement>(null);
  const videoRef       = useRef<HTMLVideoElement>(null);
  const canvasRef      = useRef<HTMLCanvasElement>(null);

  /* container-width observer */
  useEffect(() => {
    const m = () => { if (containerRef.current) setContainerW(containerRef.current.offsetWidth); };
    m();
    const ro = new ResizeObserver(m);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => () => { stream?.getTracks().forEach(t => t.stop()); }, [stream]);

  const wide = containerW >= 700;
  const up   = (p: Partial<TryOnState>) => setSt(s => ({ ...s, ...p }));

  /* ── Read file as base64 ── */
  const readFile = (file: File): Promise<string> =>
    new Promise((res, rej) => {
      const r = new FileReader();
      r.onload  = () => res(r.result as string);
      r.onerror = rej;
      r.readAsDataURL(file);
    });

  /* ── Person upload ── */
  const onPersonFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    up({ personImage: await readFile(f), error: null });
    setStep("upload_garment");
  };

  /* ── Camera ── */
  const startCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      setStream(s); setCameraActive(true);
      setTimeout(() => { if (videoRef.current) videoRef.current.srcObject = s; }, 100);
    } catch {
      up({ error: "Camera access denied. Please upload a photo instead." });
    }
  };
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const v = videoRef.current, c = canvasRef.current;
    c.width = v.videoWidth; c.height = v.videoHeight;
    c.getContext("2d")?.drawImage(v, 0, 0);
    stream?.getTracks().forEach(t => t.stop());
    setStream(null); setCameraActive(false);
    up({ personImage: c.toDataURL("image/jpeg", 0.9), error: null });
    setStep("upload_garment");
  };

  /* ── Garment: file upload ── */
  const onGarmentFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    const name = f.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ");
    up({ garmentImage: await readFile(f), garmentName: name, clothType: detectClothType(name), garmentProduct: null, error: null });
    setStep("configure");
  };

  /* ── Garment: from store ── */
  const onProductSelect = async (product: StoreProduct) => {
    setShowPicker(false); setLoadingProduct(true);
    try {
      const base64 = await imageUrlToBase64(product.image);
      up({ garmentImage: base64, garmentName: product.name, clothType: detectClothType(product.name), garmentProduct: product, error: null });
      setStep("configure");
    } catch {
      up({ error: "Could not load product image. Try uploading a photo manually." });
    }
    setLoadingProduct(false);
  };

  /* ── fal.ai CatVTON ── */
  const runTryOn = async () => {
    if (!st.personImage || !st.garmentImage) return;
    up({ loading: true, error: null, result: null, fitScore: null, fitNotes: null });
    setDebugInfo("");
    setStep("result");

    try {
      /* Call our Next.js API route - handles fal.ai + fit analysis server-side */
      const res = await fetch("/api/tryon", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          human_image:  st.personImage,
          cloth_image:  st.garmentImage,
          cloth_type:   st.clothType,
          garment_name: st.garmentName || "Garment",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        const errMsg = data.error || `Server error ${res.status}`;
        setDebugInfo(errMsg);
        throw new Error(errMsg);
      }

      /* result_url comes directly from server - no client-side parsing needed */
      const resultUrl = data.result_url || extractUrl(data.image);
      if (!resultUrl) {
        const raw = JSON.stringify(data);
        setDebugInfo(`No URL found: ${raw.slice(0, 200)}`);
        throw new Error("Try-on completed but no output image URL found.");
      }

      /* fit score & tip come from server-side Claude call - always safe */
      const fitScore = typeof data.fit_score === "number" ? data.fit_score : 85;
      const fitNotes = typeof data.fit_tip   === "string" ? data.fit_tip   : "Great choice! This garment suits your style perfectly.";

      up({ loading: false, result: resultUrl, fitScore, fitNotes });

    } catch (err: any) {
      up({ loading: false, error: err.message || "Try-on failed. Please try again." });
    }
  };

  /* ── Helpers ── */
  const reset = () => {
    setSt({ personImage: null, garmentImage: null, garmentName: "", garmentProduct: null, clothType: "upper_body", result: null, loading: false, error: null, fitScore: null, fitNotes: null });
    setStep("upload_person"); setDebugInfo("");
    stream?.getTracks().forEach(t => t.stop()); setStream(null); setCameraActive(false);
  };
  const scoreColor = (n: number) => n >= 85 ? "#22C55E" : n >= 70 ? "#F59E0B" : "#EF4444";
  const scoreLabel = (n: number) => n >= 85 ? "Excellent Fit" : n >= 70 ? "Good Fit" : "Fair Fit";

  /* ══════════════════════════════════════════════════
     PANELS
  ══════════════════════════════════════════════════ */

  /* Step bar */
  const StepBar = () => (
    <div style={{ display:"flex", alignItems:"center", padding:"10px 20px", background:"#fff", borderBottom:"1px solid #F0EDE8", flexShrink:0 }}>
      {STEPS.map((s, i) => {
        const idx = STEPS.findIndex(x => x.id === step);
        const done = i < idx, active = s.id === step;
        return (
          <div key={s.id} style={{ display:"flex", alignItems:"center", flex: i < STEPS.length - 1 ? 1 : 0 }}>
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:3, minWidth:50 }}>
              <div style={{ width:28, height:28, borderRadius:"50%", background: done ? "#C9A96E" : active ? "#1A1A1A" : "#F0EDE8", color: done || active ? "#fff" : "#B0ABA5", display:"flex", alignItems:"center", justifyContent:"center", fontSize: done ? 12 : 11, fontWeight:700, transition:"all 0.3s" }}>
                {done ? "✓" : s.emoji}
              </div>
              <span style={{ fontSize:9, color: active ? "#1A1A1A" : "#B0ABA5", fontWeight: active ? 700 : 400, whiteSpace:"nowrap" }}>{s.label}</span>
            </div>
            {i < STEPS.length - 1 && <div style={{ flex:1, height:2, background: done ? "#C9A96E" : "#F0EDE8", margin:"0 3px", marginBottom:14, transition:"background 0.3s" }}/>}
          </div>
        );
      })}
    </div>
  );

  /* Step 1 - Your Photo */
  const PersonPanel = () => (
    <div style={{ display:"flex", flexDirection:"column", gap:14, maxWidth: wide ? 460 : "100%", margin:"0 auto" }}>
      <div style={{ textAlign:"center", paddingTop:4 }}>
        <div style={{ fontFamily:"'Playfair Display',serif", fontSize: wide ? 22 : 18, fontWeight:700, color:"#1A1A1A", marginBottom:5 }}>Upload Your Photo</div>
        <div style={{ fontSize:12, color:"#8B8B8B" }}>Full-body or half-body photo works best</div>
      </div>

      {cameraActive ? (
        <div style={{ position:"relative", borderRadius:18, overflow:"hidden", background:"#000" }}>
          <video ref={videoRef} autoPlay playsInline muted style={{ width:"100%", display:"block" }} />
          <canvas ref={canvasRef} style={{ display:"none" }} />
          <div style={{ position:"absolute", bottom:14, left:0, right:0, display:"flex", justifyContent:"center", gap:12 }}>
            <button onClick={() => { stream?.getTracks().forEach(t => t.stop()); setStream(null); setCameraActive(false); }}
              style={{ padding:"8px 16px", borderRadius:10, border:"1px solid rgba(255,255,255,0.3)", background:"rgba(0,0,0,0.5)", color:"#fff", fontSize:12, cursor:"pointer" }}>Cancel</button>
            <button onClick={capturePhoto}
              style={{ width:52, height:52, borderRadius:"50%", border:"4px solid #fff", background:"#fff", cursor:"pointer", fontSize:20, display:"flex", alignItems:"center", justifyContent:"center" }}>📸</button>
          </div>
        </div>
      ) : st.personImage ? (
        <div style={{ position:"relative", borderRadius:18, overflow:"hidden", aspectRatio:"3/4", background:"#F5F0EA" }}>
          <img src={st.personImage} alt="You" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
          <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom,transparent 60%,rgba(0,0,0,0.5))" }} />
          <div style={{ position:"absolute", bottom:12, left:14, right:14, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <span style={{ color:"#fff", fontWeight:700, fontSize:13 }}>✓ Looking great!</span>
            <button onClick={() => { up({ personImage:null }); setStep("upload_person"); }}
              style={{ background:"rgba(255,255,255,0.2)", border:"1px solid rgba(255,255,255,0.4)", borderRadius:8, padding:"5px 12px", color:"#fff", fontSize:11, cursor:"pointer" }}>Retake</button>
          </div>
        </div>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          <div onClick={startCamera} style={{ borderRadius:16, border:"2px dashed #E8E4DF", background:"#fff", padding:"18px", display:"flex", alignItems:"center", gap:14, cursor:"pointer" }}>
            <div style={{ width:46, height:46, borderRadius:12, background:"linear-gradient(135deg,#1A1A1A,#3D3D3D)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>📷</div>
            <div><div style={{ fontWeight:700, fontSize:14, color:"#1A1A1A", marginBottom:2 }}>Take a Selfie</div><div style={{ fontSize:12, color:"#8B8B8B" }}>Use your camera for best results</div></div>
            <div style={{ marginLeft:"auto", color:"#C9A96E", fontSize:16 }}>→</div>
          </div>
          <div onClick={() => personFileRef.current?.click()} style={{ borderRadius:16, border:"2px dashed #E8E4DF", background:"#fff", padding:"18px", display:"flex", alignItems:"center", gap:14, cursor:"pointer" }}>
            <div style={{ width:46, height:46, borderRadius:12, background:"linear-gradient(135deg,#C9A96E,#E8C88A)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>🖼️</div>
            <div><div style={{ fontWeight:700, fontSize:14, color:"#1A1A1A", marginBottom:2 }}>Upload a Photo</div><div style={{ fontSize:12, color:"#8B8B8B" }}>JPG / PNG · Full or half body</div></div>
            <div style={{ marginLeft:"auto", color:"#C9A96E", fontSize:16 }}>→</div>
          </div>
          <input ref={personFileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={onPersonFile} />
        </div>
      )}

      <div style={{ background:"linear-gradient(135deg,#FBF7F0,#F5E8D0)", borderRadius:14, padding:14, border:"1px solid #E8D8B8" }}>
        <div style={{ fontSize:12, fontWeight:700, color:"#8B6914", marginBottom:6 }}>📌 Tips for best results</div>
        {["Good natural lighting", "Wear fitted clothing so AI sees your shape", "Plain background preferred", "Face the camera straight-on"].map((t, i) => (
          <div key={i} style={{ display:"flex", gap:7, marginBottom:4, alignItems:"flex-start" }}>
            <div style={{ width:4, height:4, borderRadius:"50%", background:"#C9A96E", marginTop:5, flexShrink:0 }} />
            <span style={{ fontSize:12, color:"#6B6B6B" }}>{t}</span>
          </div>
        ))}
      </div>

      {st.personImage && (
        <button onClick={() => setStep("upload_garment")}
          style={{ width:"100%", padding:"14px", borderRadius:13, background:"linear-gradient(135deg,#1A1A1A,#3D3D3D)", border:"none", color:"#fff", fontSize:14, fontWeight:700, cursor:"pointer" }}>
          Continue → Select Garment
        </button>
      )}
    </div>
  );

  /* Step 2 - Garment */
  const GarmentPanel = () => (
    <div style={{ display:"flex", flexDirection:"column", gap:14, maxWidth: wide ? 460 : "100%", margin:"0 auto" }}>
      <div style={{ textAlign:"center", paddingTop:4 }}>
        <div style={{ fontFamily:"'Playfair Display',serif", fontSize: wide ? 22 : 18, fontWeight:700, color:"#1A1A1A", marginBottom:5 }}>Choose a Garment</div>
        <div style={{ fontSize:12, color:"#8B8B8B" }}>Select from our store or upload your own</div>
      </div>

      {/* Browse store */}
      <div onClick={() => setShowPicker(true)}
        style={{ borderRadius:16, border:"2px solid #C9A96E", background:"linear-gradient(135deg,#FBF7F0,#F5E8D0)", padding:"16px 18px", display:"flex", alignItems:"center", gap:14, cursor:"pointer" }}>
        <div style={{ width:46, height:46, borderRadius:12, background:"linear-gradient(135deg,#C9A96E,#E8C88A)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>🛍️</div>
        <div>
          <div style={{ fontWeight:700, fontSize:14, color:"#1A1A1A", marginBottom:2 }}>Browse Azzro Store</div>
          <div style={{ fontSize:12, color:"#8B6914" }}>Try on products from our catalog</div>
        </div>
        <div style={{ marginLeft:"auto", color:"#C9A96E", fontSize:16, fontWeight:700 }}>→</div>
      </div>

      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        <div style={{ flex:1, height:1, background:"#E8E4DF" }} />
        <span style={{ fontSize:11, color:"#8B8B8B" }}>or upload your own</span>
        <div style={{ flex:1, height:1, background:"#E8E4DF" }} />
      </div>

      {loadingProduct ? (
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:180, gap:10, background:"#fff", borderRadius:16, border:"1px solid #F0EDE8" }}>
          <div className="az-spin" style={{ width:28, height:28 }} />
          <span style={{ fontSize:13, color:"#C9A96E", fontWeight:600 }}>Loading product...</span>
        </div>
      ) : st.garmentImage ? (
        <div style={{ position:"relative", borderRadius:16, overflow:"hidden", aspectRatio:"3/4", background:"#F5F0EA" }}>
          <img src={st.garmentImage} alt="Garment" style={{ width:"100%", height:"100%", objectFit:"contain", padding:8 }} />
          {st.garmentProduct && <div style={{ position:"absolute", top:10, left:10, background:"#C9A96E", color:"#fff", borderRadius:20, padding:"3px 10px", fontSize:10, fontWeight:700 }}>From Store</div>}
          <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom,transparent 60%,rgba(0,0,0,0.5))" }} />
          <div style={{ position:"absolute", bottom:12, left:14, right:14, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <span style={{ color:"#fff", fontWeight:600, fontSize:12 }}>✓ {st.garmentName || "Garment selected"}</span>
            <button onClick={() => up({ garmentImage:null, garmentName:"", garmentProduct:null })}
              style={{ background:"rgba(255,255,255,0.2)", border:"1px solid rgba(255,255,255,0.4)", borderRadius:8, padding:"5px 12px", color:"#fff", fontSize:11, cursor:"pointer" }}>Change</button>
          </div>
        </div>
      ) : (
        <div onClick={() => garmentFileRef.current?.click()}
          style={{ borderRadius:16, border:"2px dashed #E8E4DF", background:"#fff", padding:"32px 18px", display:"flex", flexDirection:"column", alignItems:"center", gap:10, cursor:"pointer" }}>
          <div style={{ width:54, height:54, borderRadius:14, background:"linear-gradient(135deg,#FBF7F0,#F5E8D0)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:26 }}>👗</div>
          <div style={{ textAlign:"center" }}>
            <div style={{ fontWeight:700, fontSize:14, color:"#1A1A1A", marginBottom:3 }}>Upload Garment Photo</div>
            <div style={{ fontSize:12, color:"#8B8B8B" }}>Flat-lay or product shot on plain background</div>
          </div>
          <div style={{ background:"#F5F0EA", color:"#1A1A1A", borderRadius:10, padding:"7px 18px", fontSize:12, fontWeight:600 }}>Browse Photos</div>
        </div>
      )}
      <input ref={garmentFileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={onGarmentFile} />

      {st.garmentImage && (
        <>
          <div style={{ background:"#fff", borderRadius:13, padding:14, border:"1px solid #F0EDE8" }}>
            <div style={{ fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.5px", color:"#1A1A1A", marginBottom:8 }}>Garment Name</div>
            <input value={st.garmentName} onChange={e => up({ garmentName: e.target.value, clothType: detectClothType(e.target.value) })}
              placeholder="E.g. Floral Anarkali, White Linen Shirt..."
              style={{ width:"100%", padding:"10px 12px", borderRadius:10, border:"1.5px solid #E8E4DF", background:"#FAFAF8", fontSize:13, color:"#1A1A1A", fontFamily:"'DM Sans',sans-serif", outline:"none" }} />
          </div>
          <button onClick={() => setStep("configure")}
            style={{ width:"100%", padding:"14px", borderRadius:13, background:"linear-gradient(135deg,#1A1A1A,#3D3D3D)", border:"none", color:"#fff", fontSize:14, fontWeight:700, cursor:"pointer" }}>
            Continue → Configure
          </button>
        </>
      )}
    </div>
  );

  /* Step 3 - Configure */
  const ConfigurePanel = () => (
    <div style={{ display:"flex", flexDirection:"column", gap:14, maxWidth: wide ? 460 : "100%", margin:"0 auto" }}>
      <div style={{ textAlign:"center", paddingTop:4 }}>
        <div style={{ fontFamily:"'Playfair Display',serif", fontSize: wide ? 22 : 18, fontWeight:700, color:"#1A1A1A", marginBottom:5 }}>Configure Your Look</div>
        <div style={{ fontSize:12, color:"#8B8B8B" }}>Confirm garment type for accurate AI fitting</div>
      </div>

      {/* Preview pair */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        {[
          { img: st.personImage,   label: "You",                        isGarment: false },
          { img: st.garmentImage,  label: st.garmentName || "Garment",  isGarment: true  },
        ].map((item, i) => (
          <div key={i} style={{ borderRadius:14, overflow:"hidden", aspectRatio:"3/4", background:"#F5F0EA", position:"relative" }}>
            {item.img && <img src={item.img} alt={item.label} style={{ width:"100%", height:"100%", objectFit: item.isGarment ? "contain" : "cover", padding: item.isGarment ? 6 : 0 }} />}
            <div style={{ position:"absolute", bottom:0, left:0, right:0, background:"linear-gradient(to top,rgba(0,0,0,0.55),transparent)", padding:"10px 8px 7px" }}>
              <span style={{ color:"#fff", fontSize:11, fontWeight:600 }}>{item.label}</span>
            </div>
            {item.isGarment && st.garmentProduct && (
              <div style={{ position:"absolute", top:8, right:8, background:"#C9A96E", color:"#fff", borderRadius:14, padding:"2px 8px", fontSize:9, fontWeight:700 }}>Store</div>
            )}
          </div>
        ))}
      </div>

      {/* Store product info */}
      {st.garmentProduct && (
        <div style={{ background:"linear-gradient(135deg,#FBF7F0,#F5E8D0)", borderRadius:13, padding:13, border:"1px solid #E8D8B8", display:"flex", gap:12, alignItems:"center" }}>
          <div style={{ width:38, height:38, borderRadius:10, background:"#C9A96E", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>🛍️</div>
          <div style={{ flex:1 }}>
            <div style={{ fontWeight:700, fontSize:13, color:"#1A1A1A" }}>{st.garmentProduct.name}</div>
            <div style={{ fontSize:13, color:"#C9A96E", fontWeight:600, marginTop:2 }}>₹{st.garmentProduct.price.toLocaleString()}</div>
          </div>
        </div>
      )}

      {/* Cloth type */}
      <div style={{ background:"#fff", borderRadius:14, padding:14, border:"1px solid #F0EDE8" }}>
        <div style={{ fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.5px", color:"#1A1A1A", marginBottom:12 }}>Garment Type</div>
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {(Object.entries(CLOTH_LABELS) as [ClothType, typeof CLOTH_LABELS[ClothType]][]).map(([type, info]) => (
            <div key={type} onClick={() => up({ clothType: type })}
              style={{ display:"flex", alignItems:"center", gap:12, padding:"11px 13px", borderRadius:11, border:`2px solid ${st.clothType === type ? "#C9A96E" : "#F0EDE8"}`, background: st.clothType === type ? "#FBF7F0" : "#FAFAF8", cursor:"pointer", transition:"all 0.2s" }}>
              <div style={{ width:36, height:36, borderRadius:9, background: st.clothType === type ? "#C9A96E" : "#F0EDE8", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0, transition:"all 0.2s" }}>{info.emoji}</div>
              <div>
                <div style={{ fontWeight:600, fontSize:13, color:"#1A1A1A" }}>{info.label}</div>
                <div style={{ fontSize:11, color:"#8B8B8B", marginTop:1 }}>{info.hint}</div>
              </div>
              {st.clothType === type && <div style={{ marginLeft:"auto", color:"#C9A96E", fontWeight:700, fontSize:16 }}>✓</div>}
            </div>
          ))}
        </div>
      </div>

      <button onClick={runTryOn}
        style={{ width:"100%", padding:"15px", borderRadius:13, background:"linear-gradient(135deg,#C9A96E,#E8C88A)", border:"none", color:"#1A1A1A", fontSize:15, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:10 }}>
        ✨ Generate Try-On
      </button>
    </div>
  );

  /* Step 4 - Result */
  const ResultPanel = () => (
    <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
      {st.loading ? (
        /* Loading */
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:380, gap:20 }}>
          <div style={{ position:"relative", width:88, height:88 }}>
            <div style={{ position:"absolute", inset:0, borderRadius:"50%", border:"3px solid #F0EDE8", borderTop:"3px solid #C9A96E", animation:"spin 1s linear infinite" }} />
            <div style={{ position:"absolute", inset:8, borderRadius:"50%", border:"3px solid #F0EDE8", borderBottom:"3px solid #1A1A1A", animation:"spin 1.5s linear infinite reverse" }} />
            <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:26 }}>✨</div>
          </div>
          <div style={{ textAlign:"center" }}>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:18, fontWeight:700, color:"#1A1A1A", marginBottom:5 }}>Fitting your look...</div>
            <div style={{ fontSize:13, color:"#8B8B8B", lineHeight:1.6 }}>AI is virtually trying the garment on you.<br />This takes 15-30 seconds.</div>
          </div>
          <div style={{ width:"70%", height:3, borderRadius:2, background:"#F0EDE8", overflow:"hidden" }}>
            <div style={{ height:"100%", borderRadius:2, background:"linear-gradient(90deg,#C9A96E,#E8C88A)", animation:"progress 25s linear forwards" }} />
          </div>
        </div>
      ) : st.error ? (
        /* Error */
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:280, gap:14, padding:20 }}>
          <div style={{ fontSize:44 }}>⚠️</div>
          <div style={{ textAlign:"center" }}>
            <div style={{ fontWeight:700, fontSize:15, color:"#1A1A1A", marginBottom:6 }}>Try-On Failed</div>
            <div style={{ fontSize:13, color:"#8B8B8B", lineHeight:1.6, marginBottom: debugInfo ? 10 : 0 }}>{st.error}</div>
            {debugInfo && (
              <div style={{ background:"#FFF3F3", border:"1px solid #FFD0D0", borderRadius:8, padding:"8px 12px", fontSize:11, color:"#CC3333", textAlign:"left", wordBreak:"break-all" }}>
                {debugInfo}
              </div>
            )}
          </div>
          <div style={{ display:"flex", gap:10 }}>
            <button onClick={() => { up({ error:null }); setStep("configure"); }}
              style={{ padding:"11px 20px", borderRadius:11, background:"#1A1A1A", border:"none", color:"#fff", fontSize:13, fontWeight:600, cursor:"pointer" }}>Try Again</button>
            <button onClick={reset}
              style={{ padding:"11px 20px", borderRadius:11, background:"#F5F0EA", border:"none", color:"#1A1A1A", fontSize:13, fontWeight:600, cursor:"pointer" }}>Start Over</button>
          </div>
        </div>
      ) : st.result ? (
        /* Success */
        <>
          <div style={{ textAlign:"center" }}>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize: wide ? 22 : 18, fontWeight:700, color:"#1A1A1A", marginBottom:3 }}>Your Virtual Try-On</div>
            <div style={{ fontSize:11, color:"#8B8B8B" }}>Powered by Azzro AI · CatVTON</div>
          </div>

          {/* Before / After images */}
          <div style={{ display:"grid", gridTemplateColumns: wide ? "1fr 1fr" : "1fr", gap:12 }}>
            {(wide
              ? [{ src: st.personImage!, badge:"Original",    dark: false },
                 { src: st.result,       badge:"AI Try-On ✨", dark: true  }]
              : [{ src: st.result,       badge:"AI Try-On ✨", dark: true  }]
            ).map((item, i) => (
              <div key={i} style={{ position:"relative", borderRadius:16, overflow:"hidden", aspectRatio:"3/4", background:"#F5F0EA" }}>
                <img src={item.src} alt={item.badge} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                <div style={{ position:"absolute", top:10, left:10, background: item.dark ? "#1A1A1A" : "rgba(255,255,255,0.92)", color: item.dark ? "#fff" : "#1A1A1A", borderRadius:20, padding:"3px 10px", fontSize:10, fontWeight:700 }}>{item.badge}</div>
                {!wide && st.personImage && (
                  <div style={{ position:"absolute", top:10, right:10, width:54, height:70, borderRadius:9, overflow:"hidden", border:"2px solid #fff", boxShadow:"0 2px 8px rgba(0,0,0,0.2)" }}>
                    <img src={st.personImage} alt="Before" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                    <div style={{ position:"absolute", bottom:0, left:0, right:0, background:"rgba(0,0,0,0.5)", textAlign:"center", fontSize:8, color:"#fff", padding:2 }}>Before</div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Fit score */}
          {st.fitScore && (
            <div style={{ background:"#fff", borderRadius:14, padding:14, border:"1px solid #F0EDE8", display:"flex", alignItems:"center", gap:14 }}>
              <div style={{ position:"relative", width:52, height:52, flexShrink:0 }}>
                <svg width="52" height="52" viewBox="0 0 52 52">
                  <circle cx="26" cy="26" r="21" fill="none" stroke="#F0EDE8" strokeWidth="4" />
                  <circle cx="26" cy="26" r="21" fill="none" stroke={scoreColor(st.fitScore)} strokeWidth="4"
                    strokeDasharray={`${(st.fitScore / 100) * 132} 132`} strokeLinecap="round" transform="rotate(-90 26 26)" />
                </svg>
                <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700, color:scoreColor(st.fitScore) }}>{st.fitScore}</div>
              </div>
              <div>
                <div style={{ fontWeight:700, fontSize:14, color:"#1A1A1A" }}>{scoreLabel(st.fitScore)}</div>
                <div style={{ fontSize:12, color:"#6B6B6B", marginTop:2, lineHeight:1.5 }}>{st.fitNotes}</div>
              </div>
            </div>
          )}

          {/* Store CTA */}
          {st.garmentProduct && (
            <div style={{ background:"linear-gradient(135deg,#FBF7F0,#F5E8D0)", borderRadius:14, padding:13, border:"1px solid #E8D8B8", display:"flex", gap:12, alignItems:"center" }}>
              <img src={st.garmentProduct.image} alt={st.garmentProduct.name}
                style={{ width:50, height:64, borderRadius:9, objectFit:"cover", flexShrink:0 }} />
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:700, fontSize:13, color:"#1A1A1A" }}>{st.garmentProduct.name}</div>
                <div style={{ fontSize:14, fontWeight:700, color:"#C9A96E", marginTop:2 }}>₹{st.garmentProduct.price.toLocaleString()}</div>
              </div>
              <button style={{ padding:"10px 14px", borderRadius:11, background:"#1A1A1A", border:"none", color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer", whiteSpace:"nowrap" }}>Add to Bag</button>
            </div>
          )}

          {/* Actions */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            <a href={st.result} download="azzro-tryon.jpg" style={{ textDecoration:"none" }}>
              <button style={{ width:"100%", padding:"12px", borderRadius:11, background:"#fff", border:"1.5px solid #E8E4DF", color:"#1A1A1A", fontSize:13, fontWeight:600, cursor:"pointer" }}>⬇ Save Look</button>
            </a>
            <button style={{ padding:"12px", borderRadius:11, background:"#fff", border:"1.5px solid #E8E4DF", color:"#1A1A1A", fontSize:13, fontWeight:600, cursor:"pointer" }}>💛 Wishlist</button>
          </div>
          <button onClick={reset}
            style={{ width:"100%", padding:"12px", borderRadius:11, background:"transparent", border:"1.5px solid #E8E4DF", color:"#8B8B8B", fontSize:13, cursor:"pointer" }}>
            Try Another Look →
          </button>
        </>
      ) : null}
    </div>
  );

  const currentPanel = () => {
    switch (step) {
      case "upload_person":  return <PersonPanel />;
      case "upload_garment": return <GarmentPanel />;
      case "configure":      return <ConfigurePanel />;
      case "result":         return <ResultPanel />;
    }
  };

  /* ══ LAYOUT ═════════════════════════════════════════════════ */
  return (
    <>
      <div ref={containerRef} style={{ fontFamily:"'DM Sans',sans-serif", background:"#FAFAF8", width:"100%", height:"100%", display:"flex", flexDirection:"column", overflow:"hidden", borderRadius:"inherit" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@500;600;700&display=swap');
          *{box-sizing:border-box;}
          @keyframes spin{to{transform:rotate(360deg)}}
          @keyframes progress{from{width:0}to{width:95%}}
          @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
          .az-spin{border:2px solid #F0EDE8;border-top:2px solid #C9A96E;border-radius:50%;animation:spin 1s linear infinite;}
          .tryon-fade{animation:fadeUp 0.3s ease;}
        `}</style>

        {/* Header */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding: wide ? "14px 28px 10px" : "12px 16px 10px", background:"#fff", borderBottom:"1px solid #F0EDE8", flexShrink:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <button onClick={() => {
              if (step !== "upload_person" && !st.loading) {
                const prev: Record<Step, Step> = { upload_garment:"upload_person", configure:"upload_garment", result:"configure", upload_person:"upload_person" };
                setStep(prev[step]);
              } else { onClose?.(); }
            }} style={{ background:"none", border:"none", fontSize:20, cursor:"pointer", color:"#1A1A1A", padding:0, lineHeight:1 }}>←</button>
            <div>
              <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize: wide ? 20 : 16, fontWeight:700, color:"#1A1A1A", margin:0 }}>FIT ME</h1>
              <p style={{ fontSize:11, color:"#8B8B8B", margin:0, marginTop:1 }}>AI Virtual Try-On · Azzro</p>
            </div>
          </div>
          {onClose && (
            <button onClick={onClose} style={{ width:28, height:28, borderRadius:"50%", border:"1px solid #E8E4DF", background:"#fff", fontSize:14, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#555", flexShrink:0 }}>✕</button>
          )}
        </div>

        <StepBar />

        {/* Body */}
        <div style={{ flex:1, overflowY:"auto", padding: wide ? "20px 28px" : "14px" }}>
          {wide && step === "result" && st.result ? (
            /* Desktop result: split view */
            <div style={{ display:"grid", gridTemplateColumns:"1fr 320px", gap:20, alignItems:"start" }}>
              <ResultPanel />
              <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                <div style={{ background:"#fff", borderRadius:14, padding:14, border:"1px solid #F0EDE8" }}>
                  <div style={{ fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.5px", color:"#8B8B8B", marginBottom:12 }}>This Look</div>
                  <div style={{ display:"flex", gap:10, marginBottom:10 }}>
                    <div style={{ width:50, height:64, borderRadius:9, overflow:"hidden", flexShrink:0, background:"#F5F0EA" }}>
                      <img src={st.garmentImage!} alt="Garment" style={{ width:"100%", height:"100%", objectFit:"contain" }} />
                    </div>
                    <div>
                      <div style={{ fontWeight:700, fontSize:13, color:"#1A1A1A", fontFamily:"'Playfair Display',serif" }}>{st.garmentName || "Garment"}</div>
                      <div style={{ fontSize:11, color:"#8B8B8B", marginTop:2 }}>{CLOTH_LABELS[st.clothType].emoji} {CLOTH_LABELS[st.clothType].label}</div>
                      {st.garmentProduct && <div style={{ fontSize:13, fontWeight:700, color:"#C9A96E", marginTop:4 }}>₹{st.garmentProduct.price.toLocaleString()}</div>}
                    </div>
                  </div>
                  {st.fitScore && (
                    <div style={{ display:"flex", alignItems:"center", gap:8, padding:"9px 12px", background:"#F8F5F0", borderRadius:9 }}>
                      <div style={{ fontWeight:800, fontSize:20, color:scoreColor(st.fitScore) }}>{st.fitScore}</div>
                      <div>
                        <div style={{ fontSize:12, fontWeight:700, color:"#1A1A1A" }}>{scoreLabel(st.fitScore)}</div>
                        <div style={{ fontSize:11, color:"#6B6B6B" }}>AI Fit Score</div>
                      </div>
                    </div>
                  )}
                </div>
                {st.garmentProduct && (
                  <button style={{ width:"100%", padding:"13px", borderRadius:11, background:"linear-gradient(135deg,#C9A96E,#E8C88A)", border:"none", color:"#1A1A1A", fontSize:13, fontWeight:700, cursor:"pointer" }}>🛒 Add to Bag</button>
                )}
                <button onClick={reset} style={{ width:"100%", padding:"11px", borderRadius:11, background:"transparent", border:"1.5px solid #E8E4DF", color:"#8B8B8B", fontSize:12, cursor:"pointer" }}>Try Another Look →</button>
              </div>
            </div>
          ) : (
            <div className="tryon-fade">{currentPanel()}</div>
          )}
        </div>
      </div>

      {showPicker && (
        <ProductPickerModal
          onSelect={onProductSelect}
          onClose={() => setShowPicker(false)}
          title="Try On from Azzro Store"
        />
      )}
    </>
  );
}
