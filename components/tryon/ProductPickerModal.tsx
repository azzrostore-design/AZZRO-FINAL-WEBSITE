// components/tryon/ProductPickerModal.tsx
"use client";
import { useState, useEffect, useRef } from "react";
import { fetchStoreProducts, type StoreProduct, CATEGORIES } from "@/lib/useStoreProducts";

interface Props {
  onSelect: (product: StoreProduct) => void;
  onClose:  () => void;
  title?:   string;
}

export default function ProductPickerModal({ onSelect, onClose, title = "Select from Store" }: Props) {
  const [products, setProducts]   = useState<StoreProduct[]>([]);
  const [filtered, setFiltered]   = useState<StoreProduct[]>([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");
  const [category, setCategory]   = useState("All");
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchStoreProducts({ limit: 50 }).then(p => {
      setProducts(p); setFiltered(p); setLoading(false);
    });
    setTimeout(() => searchRef.current?.focus(), 150);
  }, []);

  useEffect(() => {
    let list = products;
    if (category !== "All") list = list.filter(p => p.category.toLowerCase() === category.toLowerCase());
    if (search.trim())       list = list.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    setFiltered(list);
  }, [search, category, products]);

  return (
    <div style={{ position:"fixed", inset:0, zIndex:9999, display:"flex", alignItems:"flex-end", justifyContent:"center", background:"rgba(0,0,0,0.5)" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background:"#FAFAF8", borderRadius:"24px 24px 0 0", width:"100%", maxWidth:680, maxHeight:"85vh", display:"flex", flexDirection:"column", overflow:"hidden" }}>

        {/* Handle + Header */}
        <div style={{ padding:"12px 20px 0", background:"#fff", borderBottom:"1px solid #F0EDE8" }}>
          <div style={{ width:40, height:4, borderRadius:2, background:"#E0E0E0", margin:"0 auto 14px" }} />
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:20, fontWeight:700, color:"#1A1A1A" }}>{title}</div>
            <button onClick={onClose} style={{ width:32, height:32, borderRadius:"50%", border:"1px solid #E8E4DF", background:"#fff", fontSize:16, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#555" }}>✕</button>
          </div>

          {/* Search */}
          <div style={{ display:"flex", alignItems:"center", background:"#F5F0EA", borderRadius:14, padding:"10px 14px", gap:8, marginBottom:12 }}>
            <span style={{ fontSize:16, color:"#B0ABA5" }}>🔍</span>
            <input ref={searchRef} value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search products…"
              style={{ flex:1, border:"none", background:"transparent", outline:"none", fontSize:14, fontFamily:"'DM Sans',sans-serif", color:"#1A1A1A" }} />
            {search && <button onClick={()=>setSearch("")} style={{ background:"none", border:"none", cursor:"pointer", color:"#B0ABA5", fontSize:16 }}>✕</button>}
          </div>

          {/* Category chips */}
          <div style={{ display:"flex", gap:8, overflowX:"auto", paddingBottom:12, scrollbarWidth:"none" }}>
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={()=>setCategory(cat)}
                style={{ flexShrink:0, padding:"6px 14px", borderRadius:20, fontSize:12, fontWeight:600, border:"1.5px solid", borderColor:category===cat?"#1A1A1A":"#E8E4DF", background:category===cat?"#1A1A1A":"#fff", color:category===cat?"#fff":"#555", cursor:"pointer", textTransform:"capitalize", transition:"all 0.2s" }}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div style={{ flex:1, overflowY:"auto", padding:16 }}>
          {loading ? (
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:200, gap:10, color:"#B0ABA5" }}>
              <div style={{ width:24, height:24, borderRadius:"50%", border:"2px solid #F0EDE8", borderTop:"2px solid #C9A96E", animation:"spin 1s linear infinite" }} />
              Loading products…
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign:"center", padding:"40px 20px", color:"#B0ABA5" }}>
              <div style={{ fontSize:40, marginBottom:10 }}>🔍</div>
              <div style={{ fontSize:14, fontWeight:600 }}>No products found</div>
            </div>
          ) : (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(140px, 1fr))", gap:12 }}>
              {filtered.map(product => (
                <div key={product.id} onClick={() => onSelect(product)}
                  style={{ borderRadius:16, overflow:"hidden", background:"#fff", border:"1.5px solid #F0EDE8", cursor:"pointer", transition:"all 0.2s", boxShadow:"0 1px 6px rgba(0,0,0,0.05)" }}
                  onMouseEnter={e=>(e.currentTarget.style.borderColor="#C9A96E")}
                  onMouseLeave={e=>(e.currentTarget.style.borderColor="#F0EDE8")}>
                  <div style={{ aspectRatio:"3/4", overflow:"hidden", background:"#F5F0EA" }}>
                    <img src={product.image} alt={product.name} style={{ width:"100%", height:"100%", objectFit:"cover" }}
                      onError={e=>{(e.target as HTMLImageElement).src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='260' viewBox='0 0 200 260'%3E%3Crect width='200' height='260' fill='%23F5F0EA'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' fill='%23C9A96E' font-size='40'%3E👗%3C/text%3E%3C/svg%3E"}} />
                  </div>
                  <div style={{ padding:"10px 10px 12px" }}>
                    <div style={{ fontSize:12, fontWeight:600, color:"#1A1A1A", lineHeight:1.3, marginBottom:4, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>{product.name}</div>
                    <div style={{ fontSize:13, fontWeight:700, color:"#C9A96E" }}>₹{product.price.toLocaleString()}</div>
                    {product.brand && <div style={{ fontSize:10, color:"#8B8B8B", marginTop:2 }}>{product.brand}</div>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    </div>
  );
}
