"use client";

import { useState, useMemo } from "react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid,
} from "recharts";

// ─── COLOURS ─────────────────────────────────────────────────────────────────
const P = "#7c3aed"; // purple
const PL = "#9333ea";
const B = "#3b82f6"; // blue
const G = "#10b981"; // green

// ─── STATIC DATA ─────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id:"dashboard", emoji:"📊", label:"Dashboard" },
  { id:"products",  emoji:"📦", label:"Products",  badge:"145", bc:"#dbeafe", bt:"#1e40af" },
  { id:"orders",    emoji:"🛍️", label:"Orders",    badge:"12",  bc:"#fee2e2", bt:"#991b1b" },
  { id:"inventory", emoji:"🏭", label:"Inventory" },
  { id:"payments",  emoji:"💳", label:"Payments" },
  { id:"analytics", emoji:"📈", label:"Analytics" },
  { id:"marketing", emoji:"📣", label:"Marketing" },
  { id:"customers", emoji:"👥", label:"Customers" },
  { id:"returns",   emoji:"↩️", label:"Returns",  badge:"3",   bc:"#fff7ed", bt:"#c2410c" },
  { id:"settings",  emoji:"⚙️", label:"Settings" },
  { id:"support",   emoji:"🎧", label:"Support" },
];

const STATUS_CFG = {
  pending:   { bg:"#fef3c7", color:"#92400e", label:"Pending" },
  confirmed: { bg:"#dbeafe", color:"#1e40af", label:"Confirmed" },
  shipped:   { bg:"#e0e7ff", color:"#4338ca", label:"Shipped" },
  delivered: { bg:"#d1fae5", color:"#065f46", label:"Delivered" },
  cancelled: { bg:"#fee2e2", color:"#991b1b", label:"Cancelled" },
};

const INIT_ORDERS = [
  { id:"#AZ10234", customer:"Priya Sharma",  email:"priya@email.com",  product:"Designer Kurti",  qty:1, amount:"₹1,299", amtRaw:1299,  status:"confirmed", date:"Jan 30, 2026" },
  { id:"#AZ10235", customer:"Rahul Verma",   email:"rahul@email.com",  product:"Cotton Shirt",    qty:2, amount:"₹1,798", amtRaw:1798,  status:"shipped",   date:"Jan 30, 2026" },
  { id:"#AZ10236", customer:"Anjali Reddy",  email:"anjali@email.com", product:"Silk Saree",      qty:1, amount:"₹2,499", amtRaw:2499,  status:"pending",   date:"Jan 29, 2026" },
  { id:"#AZ10237", customer:"Vikram Singh",  email:"vikram@email.com", product:"Denim Jeans",     qty:1, amount:"₹1,599", amtRaw:1599,  status:"delivered", date:"Jan 29, 2026" },
  { id:"#AZ10238", customer:"Neha Kapoor",   email:"neha@email.com",   product:"Ethnic Kurti",    qty:2, amount:"₹2,598", amtRaw:2598,  status:"confirmed", date:"Jan 28, 2026" },
  { id:"#AZ10239", customer:"Arjun Menon",   email:"arjun@email.com",  product:"Cotton Shirt",    qty:1, amount:"₹899",   amtRaw:899,   status:"cancelled", date:"Jan 28, 2026" },
];

const INIT_PRODUCTS = [
  { id:1, name:"Designer Ethnic Kurti", sku:"WM-KUR-001", price:"₹1,299", priceRaw:1299, stock:45, views:234, sold:12, status:"active",    img:"https://images.unsplash.com/photo-1596783074918-c84cb06531ca?w=400", category:"Women's Wear" },
  { id:2, name:"Casual Cotton Shirt",   sku:"MN-SHT-002", price:"₹899",   priceRaw:899,  stock:78, views:189, sold:8,  status:"active",    img:"https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400", category:"Men's Wear" },
  { id:3, name:"Premium Silk Saree",    sku:"WM-SAR-003", price:"₹2,499", priceRaw:2499, stock:3,  views:567, sold:23, status:"low_stock", img:"https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400", category:"Women's Wear" },
  { id:4, name:"Classic Denim Jeans",   sku:"MN-JNS-004", price:"₹1,599", priceRaw:1599, stock:92, views:412, sold:18, status:"active",    img:"https://images.unsplash.com/photo-1542272604-787c3835535d?w=400", category:"Men's Wear" },
  { id:5, name:"Kids Summer Dress",     sku:"KD-DRS-005", price:"₹749",   priceRaw:749,  stock:0,  views:98,  sold:5,  status:"out_stock", img:"https://images.unsplash.com/photo-1518831959646-742c3a14ebf5?w=400", category:"Kids Wear" },
  { id:6, name:"Leather Handbag",       sku:"AC-BAG-006", price:"₹3,299", priceRaw:3299, stock:22, views:321, sold:14, status:"active",    img:"https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400", category:"Accessories" },
];

const INIT_CUSTOMERS = [
  { id:"#C001", name:"Priya Sharma",  email:"priya@email.com",  orders:8,  spent:"₹12,450", lastOrder:"Jan 30, 2026", status:"active" },
  { id:"#C002", name:"Rahul Verma",   email:"rahul@email.com",  orders:5,  spent:"₹7,890",  lastOrder:"Jan 30, 2026", status:"active" },
  { id:"#C003", name:"Anjali Reddy",  email:"anjali@email.com", orders:12, spent:"₹28,700", lastOrder:"Jan 29, 2026", status:"active" },
  { id:"#C004", name:"Vikram Singh",  email:"vikram@email.com", orders:3,  spent:"₹4,200",  lastOrder:"Jan 29, 2026", status:"inactive" },
  { id:"#C005", name:"Neha Kapoor",   email:"neha@email.com",   orders:6,  spent:"₹9,100",  lastOrder:"Jan 28, 2026", status:"active" },
];

const INIT_RETURNS = [
  { id:"#RET-001", order:"#AZ10210", customer:"Meera Nair",    product:"Silk Saree",   amount:"₹2,499", reason:"Size issue",    status:"pending",  date:"Jan 28, 2026" },
  { id:"#RET-002", order:"#AZ10198", customer:"Sana Khan",     product:"Kurti Set",    amount:"₹1,850", reason:"Damaged item",  status:"approved", date:"Jan 25, 2026" },
  { id:"#RET-003", order:"#AZ10185", customer:"Ravi Teja",     product:"Denim Jeans",  amount:"₹1,599", reason:"Wrong color",   status:"pending",  date:"Jan 22, 2026" },
];

const PAYMENTS_DATA = [
  { date:"Jan 29, 2026", txnId:"TXN2026012901", type:"Withdrawal", amount:"₹50,000", status:"delivered" },
  { date:"Jan 22, 2026", txnId:"TXN2026012201", type:"Withdrawal", amount:"₹75,000", status:"delivered" },
  { date:"Jan 15, 2026", txnId:"TXN2026011501", type:"Settlement", amount:"₹1,20,670",status:"delivered" },
  { date:"Jan 08, 2026", txnId:"TXN2026010801", type:"Settlement", amount:"₹98,450",  status:"delivered" },
];

const SALES_DATA = [
  { day:"Mon", revenue:12000 }, { day:"Tue", revenue:19000 },
  { day:"Wed", revenue:15000 }, { day:"Thu", revenue:25000 },
  { day:"Fri", revenue:22000 }, { day:"Sat", revenue:30000 },
  { day:"Sun", revenue:28000 },
];
const REVENUE_DATA = [
  { week:"Week 1", revenue:45000 }, { week:"Week 2", revenue:52000 },
  { week:"Week 3", revenue:61000 }, { week:"Week 4", revenue:87670 },
];
const CATEGORY_DATA = [
  { name:"Women Wear", value:45, color:"#9333ea" },
  { name:"Men Wear",   value:25, color:"#3b82f6" },
  { name:"Kids Wear",  value:20, color:"#10b981" },
  { name:"Accessories",value:10, color:"#fbbf24" },
];
const TRAFFIC_DATA = [
  { name:"Direct",  value:35, color:"#9333ea" },
  { name:"Search",  value:30, color:"#3b82f6" },
  { name:"Social",  value:20, color:"#10b981" },
  { name:"Referral",value:15, color:"#f59e0b" },
];
const TOP_ANALYTICS = [
  { name:"Premium Silk Saree",    img:"https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=50", sales:"23 units", revenue:"₹57,477", views:567, conv:"4.1%" },
  { name:"Classic Denim Jeans",   img:"https://images.unsplash.com/photo-1542272604-787c3835535d?w=50",    sales:"18 units", revenue:"₹28,782", views:412, conv:"4.4%" },
  { name:"Designer Ethnic Kurti", img:"https://images.unsplash.com/photo-1596783074918-c84cb06531ca?w=50", sales:"12 units", revenue:"₹15,588", views:234, conv:"5.1%" },
];

const SIZES = ["XS","S","M","L","XL","XXL"];
const SETTINGS_MENU = ["Store Profile","Account Settings","Notifications","Security","Shipping Settings","Tax Settings"];

// ─── SHARED UI ────────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const s = STATUS_CFG[status] || STATUS_CFG.pending;
  return (
    <span style={{ background:s.bg, color:s.color, padding:"3px 10px",
      borderRadius:12, fontSize:11, fontWeight:700, textTransform:"uppercase",
      letterSpacing:"0.04em" }}>{s.label}</span>
  );
}

function SBtn({ children, onClick, variant="primary", sm=false, type="button", full=false }) {
  const base = { border:"none", borderRadius:8, fontFamily:"inherit",
    fontSize: sm ? 13 : 14, fontWeight:600, cursor:"pointer",
    padding: sm ? "6px 14px" : "9px 20px",
    display:"inline-flex", alignItems:"center", gap:6, transition:"all .18s",
    width: full ? "100%" : "auto", justifyContent: full ? "center" : "flex-start" };
  const V = {
    primary:   { background:`linear-gradient(135deg,${PL},${B})`, color:"#fff", boxShadow:"0 4px 12px rgba(147,51,234,.25)" },
    outline:   { background:"transparent", color:P, border:`2px solid ${P}` },
    gray:      { background:"#f3f4f6", color:"#374151" },
    green:     { background:"transparent", color:G, border:`2px solid ${G}` },
    danger:    { background:"#fee2e2", color:"#991b1b" },
    white:     { background:"#fff", color:P, border:`1px solid #e5e7eb` },
  };
  return (
    <button type={type} onClick={onClick} style={{ ...base, ...V[variant] }}
      onMouseOver={e => e.currentTarget.style.opacity=".88"}
      onMouseOut={e => e.currentTarget.style.opacity="1"}
    >{children}</button>
  );
}

function ActionBtn({ icon, color="#6b7280", onClick, title }) {
  return (
    <button title={title} onClick={onClick}
      style={{ background:"none", border:"none", cursor:"pointer", color, padding:"2px 5px",
        fontSize:16, transition:"all .15s", borderRadius:4 }}
      onMouseOver={e => e.currentTarget.style.opacity=".7"}
      onMouseOut={e => e.currentTarget.style.opacity="1"}
    >{icon}</button>
  );
}

function SearchBar({ value, onChange, placeholder }) {
  return (
    <div style={{ display:"flex", alignItems:"center", border:"1px solid #e5e7eb",
      borderRadius:8, padding:"7px 12px", background:"#fff", flex:1, minWidth:180 }}>
      <span style={{ marginRight:6, color:"#9ca3af" }}>🔍</span>
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ border:"none", outline:"none", width:"100%", fontFamily:"inherit", fontSize:13, background:"transparent" }} />
      {value && <button onClick={() => onChange("")} style={{ background:"none", border:"none",
        cursor:"pointer", color:"#9ca3af", fontSize:"1rem", lineHeight:1, padding:0 }}>×</button>}
    </div>
  );
}

function Sel({ value, onChange, options, style={} }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)}
      style={{ border:"1px solid #e5e7eb", borderRadius:8, padding:"7px 12px",
        fontFamily:"inherit", fontSize:13, background:"#fff", cursor:"pointer",
        outline:"none", ...style }}>
      {options.map(o => <option key={o}>{o}</option>)}
    </select>
  );
}

function Pager({ page, total, set }) {
  if (total <= 1) return null;
  return (
    <div style={{ display:"flex", justifyContent:"center", alignItems:"center", gap:6, marginTop:20 }}>
      <button onClick={() => set(Math.max(1,page-1))} disabled={page===1}
        style={{ padding:"6px 12px", border:"1px solid #e5e7eb", borderRadius:8,
          background:"#fff", cursor:page===1?"not-allowed":"pointer", fontFamily:"inherit", fontWeight:600 }}>←</button>
      {Array.from({length:total},(_,i)=>i+1).map(p=>(
        <button key={p} onClick={()=>set(p)} style={{ padding:"6px 12px", border:"none",
          background:p===page?P:"#fff", color:p===page?"#fff":"#374151",
          borderRadius:8, cursor:"pointer", fontFamily:"inherit", fontWeight:700,
          border: p!==page?"1px solid #e5e7eb":"none" }}>{p}</button>
      ))}
      <button onClick={() => set(Math.min(total,page+1))} disabled={page===total}
        style={{ padding:"6px 12px", border:"1px solid #e5e7eb", borderRadius:8,
          background:"#fff", cursor:page===total?"not-allowed":"pointer", fontFamily:"inherit", fontWeight:600 }}>→</button>
    </div>
  );
}

function Toggle({ checked, onChange }) {
  return (
    <div onClick={() => onChange(!checked)} style={{
      position:"relative", width:46, height:23, borderRadius:23,
      background:checked?P:"#d1d5db", cursor:"pointer",
      transition:"background .22s", flexShrink:0 }}>
      <div style={{ position:"absolute", top:2.5,
        left:checked?25:2.5, width:18, height:18, borderRadius:"50%",
        background:"#fff", transition:"left .22s",
        boxShadow:"0 1px 3px rgba(0,0,0,.2)" }} />
    </div>
  );
}

function Card({ children, style={}, p=24 }) {
  return <div style={{ background:"#fff", borderRadius:12,
    boxShadow:"0 1px 6px rgba(0,0,0,.07)", padding:p, ...style }}>{children}</div>;
}

function TH({ children }) {
  return <th style={{ textAlign:"left", padding:"12px 16px", fontSize:12,
    fontWeight:700, color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.05em",
    background:"#f9fafb", borderBottom:"1px solid #f0f0f0" }}>{children}</th>;
}
function TD({ children, style={} }) {
  return <td style={{ padding:"12px 16px", fontSize:13, borderBottom:"1px solid #f9fafb", ...style }}>{children}</td>;
}
function TR({ children, onClick }) {
  return <tr style={{ transition:"background .12s", cursor:onClick?"pointer":"default" }}
    onMouseOver={e=>e.currentTarget.style.background="#fafafa"}
    onMouseOut={e=>e.currentTarget.style.background="#fff"}
    onClick={onClick}>{children}</tr>;
}

function SectionTitle({ title, sub }) {
  return (
    <div style={{ marginBottom:24 }}>
      <h2 style={{ fontSize:26, fontWeight:700, color:"#1f2937", margin:0 }}>{title}</h2>
      {sub && <p style={{ color:"#6b7280", fontSize:14, marginTop:4 }}>{sub}</p>}
    </div>
  );
}

function Toast({ msg, onClose }) {
  return (
    <div style={{ position:"fixed", bottom:24, right:24, background:"#1f2937", color:"#fff",
      padding:"12px 18px", borderRadius:10, fontSize:13, fontWeight:500, zIndex:9999,
      display:"flex", alignItems:"center", gap:10, boxShadow:"0 8px 24px rgba(0,0,0,.2)",
      animation:"fadeUp .25s ease", maxWidth:340 }}>
      <span style={{ color:"#10b981", fontSize:16 }}>✓</span>
      <span style={{ flex:1 }}>{msg}</span>
      <button onClick={onClose} style={{ background:"none", border:"none",
        color:"rgba(255,255,255,.5)", cursor:"pointer", fontSize:16, padding:0 }}>×</button>
    </div>
  );
}

// ─── ADD PRODUCT MODAL ───────────────────────────────────────────────────────
function AddProductModal({ open, onClose, onSave }) {
  const [form, setForm] = useState({ name:"", sku:"", desc:"", category:"", subcat:"", brand:"", mrp:"", price:"", stock:"", colors:"", weight:"", length:"", width:"" });
  const [sizes, setSizes] = useState([]);
  if (!open) return null;

  const upd = (k,v) => setForm(p=>({...p,[k]:v}));
  const toggleSize = s => setSizes(p => p.includes(s) ? p.filter(x=>x!==s) : [...p,s]);

  const inputStyle = { width:"100%", border:"1px solid #e5e7eb", borderRadius:8,
    padding:"8px 12px", outline:"none", fontSize:13, fontFamily:"inherit", boxSizing:"border-box" };
  const LB = ({ c }) => <label style={{ display:"block", fontSize:12, fontWeight:600,
    color:"#374151", marginBottom:5 }}>{c}</label>;

  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, zIndex:1000,
      background:"rgba(0,0,0,.52)", display:"flex", alignItems:"center",
      justifyContent:"center", padding:16 }}>
      <div onClick={e=>e.stopPropagation()} style={{ background:"#fff", borderRadius:16,
        width:"100%", maxWidth:820, maxHeight:"92vh", overflowY:"auto",
        boxShadow:"0 25px 60px rgba(0,0,0,.3)" }}>

        {/* Header */}
        <div style={{ position:"sticky", top:0, background:"#fff",
          borderBottom:"1px solid #e5e7eb", padding:"16px 24px",
          display:"flex", justifyContent:"space-between", alignItems:"center", zIndex:10 }}>
          <h3 style={{ fontSize:20, fontWeight:700, color:"#1f2937", margin:0 }}>Add New Product</h3>
          <button onClick={onClose} style={{ background:"none", border:"none",
            cursor:"pointer", color:"#9ca3af", fontSize:24, lineHeight:1 }}>×</button>
        </div>

        <div style={{ padding:24 }}>
          {/* Images */}
          <div style={{ marginBottom:24 }}>
            <LB c="Product Images" />
            <div style={{ border:"2px dashed #cbd5e1", borderRadius:8, padding:36,
              textAlign:"center", cursor:"pointer", transition:"all .2s" }}
              onMouseOver={e=>{e.currentTarget.style.borderColor=P;e.currentTarget.style.background="#faf5ff";}}
              onMouseOut={e=>{e.currentTarget.style.borderColor="#cbd5e1";e.currentTarget.style.background="";}} >
              <div style={{ fontSize:40, marginBottom:8 }}>☁️</div>
              <p style={{ fontWeight:600, color:"#4b5563", margin:0 }}>Click to upload or drag & drop</p>
              <p style={{ fontSize:12, color:"#9ca3af", marginTop:4 }}>PNG, JPG up to 5MB · Max 10 images</p>
              <input type="file" multiple accept="image/*" style={{ display:"none" }} />
            </div>
          </div>

          {/* Basic Info */}
          <div style={{ borderTop:"1px solid #e5e7eb", paddingTop:20, marginBottom:20 }}>
            <h4 style={{ fontWeight:700, color:"#1f2937", marginBottom:14 }}>Basic Information</h4>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
              <div><LB c="Product Name *" /><input value={form.name} onChange={e=>upd("name",e.target.value)} style={inputStyle} placeholder="e.g. Designer Silk Kurti" /></div>
              <div><LB c="SKU *" /><input value={form.sku} onChange={e=>upd("sku",e.target.value)} style={inputStyle} placeholder="e.g. WM-KUR-001" /></div>
            </div>
            <div style={{ marginBottom:14 }}>
              <LB c="Description *" />
              <textarea rows={3} value={form.desc} onChange={e=>upd("desc",e.target.value)}
                style={{ ...inputStyle, resize:"vertical" }} placeholder="Detailed product description..." />
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:14 }}>
              <div><LB c="Category *" />
                <select value={form.category} onChange={e=>upd("category",e.target.value)} style={{ ...inputStyle, background:"#fff", cursor:"pointer" }}>
                  <option value="">Select Category</option>
                  {["Women's Wear","Men's Wear","Kids Wear","Accessories"].map(o=><option key={o}>{o}</option>)}
                </select>
              </div>
              <div><LB c="Sub-Category *" />
                <select value={form.subcat} onChange={e=>upd("subcat",e.target.value)} style={{ ...inputStyle, background:"#fff", cursor:"pointer" }}>
                  <option value="">Select Sub-Category</option>
                  {["Kurtas","Sarees","Dresses","Tops","Shirts","Jeans"].map(o=><option key={o}>{o}</option>)}
                </select>
              </div>
              <div><LB c="Brand" /><input value={form.brand} onChange={e=>upd("brand",e.target.value)} style={inputStyle} placeholder="e.g. Style Store" /></div>
            </div>
          </div>

          {/* Pricing */}
          <div style={{ borderTop:"1px solid #e5e7eb", paddingTop:20, marginBottom:20 }}>
            <h4 style={{ fontWeight:700, color:"#1f2937", marginBottom:14 }}>Pricing & Inventory</h4>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:14 }}>
              <div><LB c="MRP *" /><input type="number" value={form.mrp} onChange={e=>upd("mrp",e.target.value)} style={inputStyle} placeholder="2999" /></div>
              <div><LB c="Selling Price *" /><input type="number" value={form.price} onChange={e=>upd("price",e.target.value)} style={inputStyle} placeholder="1299" /></div>
              <div><LB c="Stock Quantity *" /><input type="number" value={form.stock} onChange={e=>upd("stock",e.target.value)} style={inputStyle} placeholder="50" /></div>
            </div>
          </div>

          {/* Variants */}
          <div style={{ borderTop:"1px solid #e5e7eb", paddingTop:20, marginBottom:20 }}>
            <h4 style={{ fontWeight:700, color:"#1f2937", marginBottom:14 }}>Product Variants</h4>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
              <div>
                <LB c="Available Sizes" />
                <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginTop:4 }}>
                  {SIZES.map(s=>(
                    <label key={s} style={{ display:"flex", alignItems:"center", gap:5,
                      cursor:"pointer", userSelect:"none", fontSize:13 }}>
                      <input type="checkbox" checked={sizes.includes(s)} onChange={()=>toggleSize(s)} /> {s}
                    </label>
                  ))}
                </div>
              </div>
              <div><LB c="Available Colors" /><input value={form.colors} onChange={e=>upd("colors",e.target.value)} style={inputStyle} placeholder="e.g. Red, Blue, Green" /></div>
            </div>
          </div>

          {/* Shipping */}
          <div style={{ borderTop:"1px solid #e5e7eb", paddingTop:20, marginBottom:24 }}>
            <h4 style={{ fontWeight:700, color:"#1f2937", marginBottom:14 }}>Shipping Information</h4>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:14 }}>
              <div><LB c="Weight (kg)" /><input type="number" value={form.weight} onChange={e=>upd("weight",e.target.value)} style={inputStyle} placeholder="0.5" /></div>
              <div><LB c="Length (cm)" /><input type="number" value={form.length} onChange={e=>upd("length",e.target.value)} style={inputStyle} placeholder="30" /></div>
              <div><LB c="Width (cm)" /><input type="number" value={form.width} onChange={e=>upd("width",e.target.value)} style={inputStyle} placeholder="20" /></div>
            </div>
          </div>

          {/* Footer */}
          <div style={{ borderTop:"1px solid #e5e7eb", paddingTop:16,
            display:"flex", justifyContent:"flex-end", gap:10 }}>
            <SBtn variant="gray" onClick={onClose}>Cancel</SBtn>
            <SBtn variant="gray" onClick={() => onSave(form, "draft")}>Save as Draft</SBtn>
            <SBtn variant="primary" onClick={() => onSave(form, "publish")}>✓ Publish Product</SBtn>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── DASHBOARD ───────────────────────────────────────────────────────────────
function DashboardSection({ navigate, openModal }) {
  const METRICS = [
    { icon:"💰", label:"Total Revenue",    value:"₹2,45,670", badge:"+23%", bgA:"#4ade80", bgB:"#16a34a", bColor:"#059669", bBg:"#dcfce7", note:"This month" },
    { icon:"🛒", label:"Total Orders",     value:"287",        badge:"+15%", bgA:"#60a5fa", bgB:"#2563eb", bColor:"#2563eb", bBg:"#dbeafe", note:"Active: 12" },
    { icon:"📦", label:"Products Listed",  value:"145",        badge:"145",  bgA:"#c084fc", bgB:"#9333ea", bColor:"#7c3aed", bBg:"#f5f3ff", note:"12 low stock" },
    { icon:"📈", label:"Conversion Rate",  value:"3.2%",       badge:"+5%",  bgA:"#fb923c", bgB:"#ea580c", bColor:"#d97706", bBg:"#fff7ed", note:"From 2.8%" },
  ];

  return (
    <div>
      <SectionTitle title="Dashboard Overview" sub="Welcome back! Here's what's happening with your store." />

      {/* Metrics */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(210px,1fr))", gap:18, marginBottom:24 }}>
        {METRICS.map(m => (
          <Card key={m.label} style={{ transition:"all .22s", cursor:"default" }}
            onMouseOver={e=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow="0 12px 24px rgba(0,0,0,.12)";}}
            onMouseOut={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="0 1px 6px rgba(0,0,0,.07)";}}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14 }}>
              <div style={{ width:46, height:46, background:`linear-gradient(135deg,${m.bgA},${m.bgB})`,
                borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>{m.icon}</div>
              <span style={{ background:m.bBg, color:m.bColor, fontSize:11, fontWeight:700,
                padding:"3px 8px", borderRadius:6 }}>{m.badge}</span>
            </div>
            <p style={{ color:"#6b7280", fontSize:12, margin:"0 0 2px" }}>{m.label}</p>
            <p style={{ fontSize:26, fontWeight:700, color:"#1f2937", margin:"0 0 2px" }}>{m.value}</p>
            <p style={{ fontSize:11, color:"#9ca3af", margin:0 }}>{m.note}</p>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:18, marginBottom:24 }}>
        <Card>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
            <h3 style={{ fontWeight:700, fontSize:15, color:"#1f2937", margin:0 }}>Sales Overview</h3>
            <Sel value="Last 7 days" onChange={()=>{}} options={["Last 7 days","Last 30 days","Last 90 days"]} />
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={SALES_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize:12 }} />
              <YAxis tick={{ fontSize:11 }} tickFormatter={v=>`₹${v/1000}k`} />
              <Tooltip formatter={v=>[`₹${v.toLocaleString()}`,"Revenue"]} />
              <Line type="monotone" dataKey="revenue" stroke={P} strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <h3 style={{ fontWeight:700, fontSize:15, color:"#1f2937", marginBottom:14 }}>Top Categories</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={CATEGORY_DATA} cx="50%" cy="50%" innerRadius={48} outerRadius={78} dataKey="value">
                {CATEGORY_DATA.map((d,i)=><Cell key={i} fill={d.color} />)}
              </Pie>
              <Legend wrapperStyle={{ fontSize:12 }} />
              <Tooltip formatter={v=>[`${v}%`]} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Recent orders + Quick actions */}
      <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:18 }}>
        <Card p={0}>
          <div style={{ padding:"16px 20px", borderBottom:"1px solid #f0f0f0",
            display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <h3 style={{ fontWeight:700, fontSize:15, color:"#1f2937", margin:0 }}>Recent Orders</h3>
            <button onClick={() => navigate("orders")} style={{ background:"none", border:"none",
              color:P, fontSize:13, cursor:"pointer", fontFamily:"inherit", fontWeight:600 }}>View All →</button>
          </div>
          <div style={{ padding:0, overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead><tr><TH>Order ID</TH><TH>Customer</TH><TH>Product</TH><TH>Amount</TH><TH>Status</TH></tr></thead>
              <tbody>
                {INIT_ORDERS.slice(0,4).map(o=>(
                  <TR key={o.id} onClick={()=>navigate("orders")}>
                    <TD style={{ color:P, fontWeight:600 }}>{o.id}</TD>
                    <TD>{o.customer}</TD>
                    <TD style={{ color:"#6b7280" }}>{o.product}</TD>
                    <TD style={{ fontWeight:700 }}>{o.amount}</TD>
                    <TD><StatusBadge status={o.status} /></TD>
                  </TR>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card>
          <h3 style={{ fontWeight:700, fontSize:15, color:"#1f2937", marginBottom:14 }}>Quick Actions</h3>
          <div style={{ display:"flex", flexDirection:"column", gap:9 }}>
            <SBtn full variant="primary"  onClick={() => { navigate("products"); openModal(); }}>➕ Add New Product</SBtn>
            <SBtn full variant="outline"  onClick={() => navigate("products")}>📤 Bulk Upload</SBtn>
            <SBtn full variant="green"    onClick={() => navigate("marketing")}>🏷️ Create Offer</SBtn>
            <SBtn full variant="gray"     onClick={() => navigate("analytics")}>📥 Download Reports</SBtn>
          </div>
          <div style={{ marginTop:18, background:"linear-gradient(to right,#fef3c7,#fde68a)",
            borderRadius:10, padding:14, border:"2px solid #f59e0b" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
              <span style={{ fontSize:26 }}>🏆</span>
              <div>
                <p style={{ fontWeight:700, color:"#92400e", fontSize:13, margin:0 }}>Gold Seller</p>
                <p style={{ fontSize:11, color:"#b45309", margin:0 }}>250 points to Platinum</p>
              </div>
            </div>
            <div style={{ background:"#fcd34d", borderRadius:99, height:7 }}>
              <div style={{ width:"65%", height:"100%", background:"#d97706", borderRadius:99 }} />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─── PRODUCTS ────────────────────────────────────────────────────────────────
function ProductsSection({ openModal, showToast }) {
  const [products, setProducts] = useState(INIT_PRODUCTS);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("All Categories");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [page, setPage] = useState(1);
  const PER = 4;

  const filtered = useMemo(() => products.filter(p => {
    const ms = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const mc = catFilter === "All Categories" || p.category === catFilter;
    const statusMap = { "All Status":true, "Active":p.status==="active", "Low Stock":p.status==="low_stock", "Out of Stock":p.status==="out_stock" };
    return ms && mc && (statusMap[statusFilter] ?? true);
  }), [products, search, catFilter, statusFilter]);

  const pages = Math.max(1, Math.ceil(filtered.length/PER));
  const rows = filtered.slice((page-1)*PER, page*PER);

  const statusMeta = {
    active:    { label:"Active",      bg:"#22c55e", color:"#fff" },
    low_stock: { label:"Low Stock",   bg:"#ef4444", color:"#fff" },
    out_stock: { label:"Out of Stock",bg:"#6b7280", color:"#fff" },
  };

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:22 }}>
        <SectionTitle title="Product Management" sub="Manage your product catalog" />
        <SBtn variant="primary" onClick={openModal}>➕ Add Product</SBtn>
      </div>

      <Card style={{ marginBottom:16, padding:14 }}>
        <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
          <SearchBar value={search} onChange={v=>{setSearch(v);setPage(1);}} placeholder="Search products…" />
          <Sel value={catFilter} onChange={v=>{setCatFilter(v);setPage(1);}} options={["All Categories","Women's Wear","Men's Wear","Kids Wear","Accessories"]} />
          <Sel value={statusFilter} onChange={v=>{setStatusFilter(v);setPage(1);}} options={["All Status","Active","Low Stock","Out of Stock"]} />
          {(search||catFilter!=="All Categories"||statusFilter!=="All Status") &&
            <SBtn variant="gray" sm onClick={()=>{setSearch("");setCatFilter("All Categories");setStatusFilter("All Status");setPage(1);}}>↺ Reset</SBtn>}
        </div>
      </Card>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:16 }}>
        {rows.length === 0
          ? <div style={{ gridColumn:"1/-1", textAlign:"center", padding:"3rem", color:"#9ca3af" }}>No products found</div>
          : rows.map(p => {
            const sm = statusMeta[p.status];
            return (
              <div key={p.id} style={{ background:"#fff", borderRadius:12, overflow:"hidden",
                boxShadow:"0 1px 6px rgba(0,0,0,.08)", transition:"all .22s" }}
                onMouseOver={e=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow="0 12px 24px rgba(0,0,0,.13)";}}
                onMouseOut={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="0 1px 6px rgba(0,0,0,.08)";}}>
                <div style={{ position:"relative" }}>
                  <img src={p.img} alt={p.name} style={{ width:"100%", height:170, objectFit:"cover" }} />
                  <span style={{ position:"absolute", top:8, right:8, background:sm.bg,
                    color:sm.color, fontSize:10, fontWeight:700, padding:"3px 8px", borderRadius:99 }}>{sm.label}</span>
                </div>
                <div style={{ padding:14 }}>
                  <h4 style={{ fontWeight:700, color:"#1f2937", marginBottom:2, fontSize:14 }}>{p.name}</h4>
                  <p style={{ fontSize:12, color:"#9ca3af", marginBottom:8 }}>SKU: {p.sku}</p>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                    <span style={{ fontSize:17, fontWeight:700, color:P }}>{p.price}</span>
                    <span style={{ fontSize:12, color:p.status==="low_stock"?"#dc2626":p.status==="out_stock"?"#6b7280":"#6b7280", fontWeight:600 }}>
                      {p.stock === 0 ? "Out of Stock" : `Stock: ${p.stock}`}
                    </span>
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:"#9ca3af", marginBottom:12 }}>
                    <span>👁 {p.views} views</span>
                    <span>🛒 {p.sold} sold</span>
                  </div>
                  <div style={{ display:"flex", gap:8 }}>
                    <button onClick={() => showToast(`Editing: ${p.name}`)} style={{ flex:1, background:P, color:"#fff",
                      border:"none", borderRadius:8, padding:"7px 0", fontSize:12, fontWeight:600,
                      cursor:"pointer", fontFamily:"inherit" }}>✏️ Edit</button>
                    <button onClick={() => showToast(`Viewing: ${p.name}`)} style={{ flex:1, background:"#f3f4f6", color:"#374151",
                      border:"none", borderRadius:8, padding:"7px 0", fontSize:12, fontWeight:600,
                      cursor:"pointer", fontFamily:"inherit" }}>👁 View</button>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
      <Pager page={page} total={pages} set={setPage} />
    </div>
  );
}

// ─── ORDERS ──────────────────────────────────────────────────────────────────
function OrdersSection({ showToast }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [page, setPage] = useState(1);
  const PER = 4;

  const ORDER_STATS = [
    { label:"Pending",   val:INIT_ORDERS.filter(o=>o.status==="pending").length,   color:"#d97706" },
    { label:"Confirmed", val:INIT_ORDERS.filter(o=>o.status==="confirmed").length, color:"#2563eb" },
    { label:"Shipped",   val:INIT_ORDERS.filter(o=>o.status==="shipped").length,   color:P },
    { label:"Delivered", val:INIT_ORDERS.filter(o=>o.status==="delivered").length, color:"#059669" },
    { label:"Cancelled", val:INIT_ORDERS.filter(o=>o.status==="cancelled").length, color:"#dc2626" },
  ];

  const filtered = useMemo(() => INIT_ORDERS.filter(o => {
    const ms = o.id.toLowerCase().includes(search.toLowerCase()) || o.customer.toLowerCase().includes(search.toLowerCase());
    const mst = statusFilter==="All Status" || o.status===statusFilter.toLowerCase();
    return ms && mst;
  }), [search, statusFilter]);

  const pages = Math.max(1, Math.ceil(filtered.length/PER));
  const rows = filtered.slice((page-1)*PER, page*PER);

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:22 }}>
        <SectionTitle title="Order Management" sub="Track and manage all your orders" />
        <SBtn variant="gray" onClick={() => showToast("Exporting orders as CSV…")}>📥 Export</SBtn>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:12, marginBottom:20 }}>
        {ORDER_STATS.map(s => (
          <Card key={s.label} p={14} style={{ textAlign:"center" }}>
            <p style={{ color:"#6b7280", fontSize:12, margin:"0 0 4px" }}>{s.label}</p>
            <p style={{ fontSize:22, fontWeight:700, color:s.color, margin:0 }}>{s.val}</p>
          </Card>
        ))}
      </div>

      <Card style={{ marginBottom:16, padding:14 }}>
        <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
          <SearchBar value={search} onChange={v=>{setSearch(v);setPage(1);}} placeholder="Search by Order ID or customer…" />
          <Sel value={statusFilter} onChange={v=>{setStatusFilter(v);setPage(1);}} options={["All Status","Pending","Confirmed","Shipped","Delivered","Cancelled"]} />
          {(search||statusFilter!=="All Status") &&
            <SBtn variant="gray" sm onClick={()=>{setSearch("");setStatusFilter("All Status");setPage(1);}}>↺ Reset</SBtn>}
        </div>
      </Card>

      <Card p={0}>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr><TH>Order ID</TH><TH>Date</TH><TH>Customer</TH><TH>Product</TH><TH>Amount</TH><TH>Status</TH><TH>Actions</TH></tr>
            </thead>
            <tbody>
              {rows.length===0
                ? <tr><td colSpan={7} style={{ textAlign:"center", padding:"3rem", color:"#9ca3af" }}>No orders found</td></tr>
                : rows.map(o => (
                  <TR key={o.id}>
                    <TD style={{ color:P, fontWeight:700 }}>{o.id}</TD>
                    <TD style={{ color:"#6b7280" }}>{o.date}</TD>
                    <TD>
                      <p style={{ margin:0, fontWeight:600, fontSize:13 }}>{o.customer}</p>
                      <p style={{ margin:0, fontSize:11, color:"#9ca3af" }}>{o.email}</p>
                    </TD>
                    <TD style={{ color:"#6b7280" }}>{o.product} (x{o.qty})</TD>
                    <TD style={{ fontWeight:700 }}>{o.amount}</TD>
                    <TD><StatusBadge status={o.status} /></TD>
                    <TD>
                      <div style={{ display:"flex", gap:4, alignItems:"center" }}>
                        <ActionBtn icon="👁️" color={P}    title="View"  onClick={()=>showToast(`Viewing ${o.id}`)} />
                        {o.status==="confirmed" && <ActionBtn icon="🚚" color={B} title="Ship" onClick={()=>showToast(`Shipping ${o.id}`)} />}
                        {o.status==="pending"   && <>
                          <ActionBtn icon="✅" color="#059669" title="Confirm"  onClick={()=>showToast(`Confirmed ${o.id}`)} />
                          <ActionBtn icon="❌" color="#dc2626" title="Cancel"   onClick={()=>showToast(`Cancelled ${o.id}`)} />
                        </>}
                        <ActionBtn icon="🖨️" color="#6b7280" title="Print" onClick={()=>showToast(`Printing ${o.id}`)} />
                      </div>
                    </TD>
                  </TR>
                ))}
            </tbody>
          </table>
        </div>
        <div style={{ padding:"0 16px 16px" }}><Pager page={page} total={pages} set={setPage} /></div>
      </Card>
    </div>
  );
}

// ─── ANALYTICS ───────────────────────────────────────────────────────────────
function AnalyticsSection() {
  const [period, setPeriod] = useState("Today");
  const PERIODS = ["Today","Last 7 Days","Last 30 Days","This Month","Custom Range"];
  const METRICS = [
    { label:"Total Visitors",   value:"12,543", change:"↑ 12.5%", icon:"👥" },
    { label:"Page Views",       value:"45,678", change:"↑ 8.3%",  icon:"👁️" },
    { label:"Avg. Order Value", value:"₹1,456", change:"↑ 5.2%",  icon:"💰" },
    { label:"Customer Rating",  value:"4.6/5.0",change:"↑ 0.3",   icon:"⭐" },
  ];

  return (
    <div>
      <SectionTitle title="Analytics & Reports" sub="Detailed insights into your store performance" />

      <Card style={{ marginBottom:20, padding:14 }}>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          {PERIODS.map(p => (
            <button key={p} onClick={() => setPeriod(p)} style={{ padding:"7px 14px", borderRadius:8,
              border:"1px solid #e5e7eb", background:period===p?P:"#fff",
              color:period===p?"#fff":"#374151", fontWeight:600, cursor:"pointer",
              fontFamily:"inherit", fontSize:13, transition:"all .15s" }}>{p}</button>
          ))}
        </div>
      </Card>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))", gap:16, marginBottom:24 }}>
        {METRICS.map(m => (
          <Card key={m.label}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
              <p style={{ color:"#6b7280", fontSize:13, margin:0 }}>{m.label}</p>
              <span style={{ fontSize:18 }}>{m.icon}</span>
            </div>
            <p style={{ fontSize:24, fontWeight:700, color:"#1f2937", margin:"0 0 4px" }}>{m.value}</p>
            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
              <span style={{ color:"#059669", fontSize:12, fontWeight:600 }}>{m.change}</span>
              <span style={{ color:"#9ca3af", fontSize:11 }}>vs last period</span>
            </div>
          </Card>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:24 }}>
        <Card>
          <h3 style={{ fontWeight:700, fontSize:15, color:"#1f2937", marginBottom:14 }}>Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={REVENUE_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="week" tick={{ fontSize:12 }} />
              <YAxis tick={{ fontSize:11 }} tickFormatter={v=>`₹${v/1000}k`} />
              <Tooltip formatter={v=>[`₹${v.toLocaleString()}`,"Revenue"]} />
              <Bar dataKey="revenue" fill="rgba(147,51,234,.85)" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <h3 style={{ fontWeight:700, fontSize:15, color:"#1f2937", marginBottom:14 }}>Traffic Sources</h3>
          <ResponsiveContainer width="100%" height={230}>
            <PieChart>
              <Pie data={TRAFFIC_DATA} cx="50%" cy="50%" outerRadius={88} dataKey="value">
                {TRAFFIC_DATA.map((d,i)=><Cell key={i} fill={d.color} />)}
              </Pie>
              <Legend wrapperStyle={{ fontSize:12 }} />
              <Tooltip formatter={v=>[`${v}%`]} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card p={0}>
        <div style={{ padding:"14px 20px", borderBottom:"1px solid #f0f0f0" }}>
          <h3 style={{ fontWeight:700, fontSize:15, color:"#1f2937", margin:0 }}>Top Performing Products</h3>
        </div>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead><tr><TH>Product</TH><TH>Sales</TH><TH>Revenue</TH><TH>Views</TH><TH>Conv. Rate</TH></tr></thead>
          <tbody>
            {TOP_ANALYTICS.map(p => (
              <TR key={p.name}>
                <TD>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <img src={p.img} alt={p.name} style={{ width:38, height:38, borderRadius:6, objectFit:"cover" }} />
                    <span style={{ fontWeight:600, fontSize:13 }}>{p.name}</span>
                  </div>
                </TD>
                <TD>{p.sales}</TD>
                <TD style={{ fontWeight:700 }}>{p.revenue}</TD>
                <TD>{p.views}</TD>
                <TD style={{ color:"#059669", fontWeight:700 }}>{p.conv}</TD>
              </TR>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

// ─── PAYMENTS ────────────────────────────────────────────────────────────────
function PaymentsSection({ showToast }) {
  return (
    <div>
      <SectionTitle title="Payments & Settlements" sub="Manage your earnings and payment history" />

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:16, marginBottom:24 }}>
        <div style={{ background:"linear-gradient(135deg,#4ade80,#16a34a)", borderRadius:12,
          padding:22, color:"#fff", boxShadow:"0 4px 16px rgba(22,163,74,.25)" }}>
          <p style={{ fontSize:13, opacity:.9, margin:"0 0 6px" }}>Available Balance</p>
          <p style={{ fontSize:26, fontWeight:700, margin:"0 0 14px" }}>₹45,230</p>
          <button onClick={() => showToast("Withdrawal request submitted!")}
            style={{ background:"#fff", color:"#16a34a", border:"none", borderRadius:8,
              padding:"7px 14px", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
            Withdraw Now
          </button>
        </div>
        {[
          { label:"Pending Clearance", value:"₹12,450",    sub:"Clears on Feb 5, 2026",   icon:"⏰" },
          { label:"This Month",        value:"₹2,45,670",  sub:"Total earnings",           icon:"📅" },
          { label:"Lifetime Earnings", value:"₹12,45,890", sub:"Since Jan 2026",           icon:"📈" },
        ].map(c => (
          <Card key={c.label}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
              <p style={{ color:"#6b7280", fontSize:13, margin:0 }}>{c.label}</p>
              <span style={{ fontSize:16 }}>{c.icon}</span>
            </div>
            <p style={{ fontSize:22, fontWeight:700, color:"#1f2937", margin:"0 0 4px" }}>{c.value}</p>
            <p style={{ fontSize:11, color:"#9ca3af", margin:0 }}>{c.sub}</p>
          </Card>
        ))}
      </div>

      <Card style={{ marginBottom:16 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
          <h3 style={{ fontWeight:700, fontSize:15, color:"#1f2937", margin:0 }}>Payment History</h3>
          <button onClick={() => showToast("Downloading statement…")}
            style={{ background:"none", border:"none", color:P, fontSize:13,
              cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", gap:4 }}>
            📥 Download Statement
          </button>
        </div>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead><tr><TH>Date</TH><TH>Transaction ID</TH><TH>Type</TH><TH>Amount</TH><TH>Status</TH><TH>Actions</TH></tr></thead>
            <tbody>
              {PAYMENTS_DATA.map(p => (
                <TR key={p.txnId}>
                  <TD>{p.date}</TD>
                  <TD style={{ fontFamily:"monospace", fontSize:12 }}>{p.txnId}</TD>
                  <TD>{p.type}</TD>
                  <TD style={{ fontWeight:700, color:"#059669" }}>{p.amount}</TD>
                  <TD><StatusBadge status={p.status} /></TD>
                  <TD><ActionBtn icon="🧾" color={P} title="View Receipt" onClick={()=>showToast(`Receipt for ${p.txnId}`)} /></TD>
                </TR>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card>
        <h3 style={{ fontWeight:700, fontSize:15, color:"#1f2937", marginBottom:14 }}>Bank Account Details</h3>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
          {[["Account Holder","Style Store Pvt Ltd"],["Account Number","XXXX XXXX XXXX 4567"],["Bank Name","HDFC Bank"],["IFSC Code","HDFC0001234"]].map(([l,v])=>(
            <div key={l}>
              <p style={{ fontSize:12, color:"#6b7280", margin:"0 0 2px" }}>{l}</p>
              <p style={{ fontSize:14, fontWeight:700, color:"#1f2937", margin:0 }}>{v}</p>
            </div>
          ))}
        </div>
        <button onClick={() => showToast("Bank details update form coming soon")}
          style={{ background:"none", border:"none", color:P, fontSize:13,
            cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", gap:4 }}>
          ✏️ Update Bank Details
        </button>
      </Card>
    </div>
  );
}

// ─── CUSTOMERS ───────────────────────────────────────────────────────────────
function CustomersSection({ showToast }) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const PER = 4;

  const filtered = useMemo(() => INIT_CUSTOMERS.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  ), [search]);

  const pages = Math.max(1, Math.ceil(filtered.length/PER));
  const rows = filtered.slice((page-1)*PER, page*PER);

  return (
    <div>
      <SectionTitle title="Customers" sub="Your customer database" />
      <Card style={{ marginBottom:16, padding:14 }}>
        <SearchBar value={search} onChange={v=>{setSearch(v);setPage(1);}} placeholder="Search customers…" />
      </Card>
      <Card p={0}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead><tr><TH>ID</TH><TH>Name</TH><TH>Email</TH><TH>Orders</TH><TH>Total Spent</TH><TH>Last Order</TH><TH>Status</TH><TH>Actions</TH></tr></thead>
          <tbody>
            {rows.map(c => (
              <TR key={c.id}>
                <TD style={{ fontFamily:"monospace", fontSize:11 }}>{c.id}</TD>
                <TD style={{ fontWeight:600 }}>{c.name}</TD>
                <TD style={{ color:"#9ca3af", fontSize:12 }}>{c.email}</TD>
                <TD>{c.orders}</TD>
                <TD style={{ fontWeight:700 }}>{c.spent}</TD>
                <TD style={{ color:"#9ca3af", fontSize:12 }}>{c.lastOrder}</TD>
                <TD>
                  <span style={{ background:c.status==="active"?"#d1fae5":"#f3f4f6",
                    color:c.status==="active"?"#065f46":"#6b7280",
                    padding:"3px 10px", borderRadius:12, fontSize:11, fontWeight:700, textTransform:"uppercase" }}>
                    {c.status}
                  </span>
                </TD>
                <TD>
                  <div style={{ display:"flex", gap:4 }}>
                    <ActionBtn icon="👁️" color={P}       title="View"  onClick={()=>showToast(`Viewing ${c.name}`)} />
                    <ActionBtn icon="✉️" color="#6b7280" title="Email" onClick={()=>showToast(`Emailing ${c.name}`)} />
                  </div>
                </TD>
              </TR>
            ))}
          </tbody>
        </table>
        <div style={{ padding:"0 16px 16px" }}><Pager page={page} total={pages} set={setPage} /></div>
      </Card>
    </div>
  );
}

// ─── RETURNS ─────────────────────────────────────────────────────────────────
function ReturnsSection({ showToast }) {
  const [returns, setReturns] = useState(INIT_RETURNS);

  const approve = (id) => {
    setReturns(p => p.map(r => r.id===id ? { ...r, status:"approved" } : r));
    showToast("Return approved — refund initiated");
  };
  const reject = (id) => {
    setReturns(p => p.map(r => r.id===id ? { ...r, status:"rejected" } : r));
    showToast("Return rejected");
  };

  const statusStyle = {
    pending:  { bg:"#fef3c7", color:"#92400e" },
    approved: { bg:"#d1fae5", color:"#065f46" },
    rejected: { bg:"#fee2e2", color:"#991b1b" },
  };

  return (
    <div>
      <SectionTitle title="Returns & Refunds" sub="Handle return requests from your customers" />
      <Card p={0}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead><tr><TH>Return ID</TH><TH>Order</TH><TH>Customer</TH><TH>Product</TH><TH>Amount</TH><TH>Reason</TH><TH>Status</TH><TH>Actions</TH></tr></thead>
          <tbody>
            {returns.map(r => {
              const ss = statusStyle[r.status];
              return (
                <TR key={r.id}>
                  <TD style={{ fontFamily:"monospace", fontSize:11 }}>{r.id}</TD>
                  <TD style={{ color:P, fontWeight:600 }}>{r.order}</TD>
                  <TD style={{ fontWeight:600 }}>{r.customer}</TD>
                  <TD style={{ color:"#6b7280" }}>{r.product}</TD>
                  <TD style={{ fontWeight:700 }}>{r.amount}</TD>
                  <TD style={{ color:"#6b7280", fontSize:12 }}>{r.reason}</TD>
                  <TD>
                    <span style={{ background:ss.bg, color:ss.color, padding:"3px 10px",
                      borderRadius:12, fontSize:11, fontWeight:700, textTransform:"uppercase" }}>{r.status}</span>
                  </TD>
                  <TD>
                    {r.status==="pending" ? (
                      <div style={{ display:"flex", gap:4 }}>
                        <ActionBtn icon="✅" color="#059669" title="Approve" onClick={()=>approve(r.id)} />
                        <ActionBtn icon="❌" color="#dc2626" title="Reject"  onClick={()=>reject(r.id)} />
                      </div>
                    ) : (
                      <ActionBtn icon="👁️" color={P} title="View" onClick={()=>showToast(`Viewing ${r.id}`)} />
                    )}
                  </TD>
                </TR>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

// ─── SETTINGS ────────────────────────────────────────────────────────────────
function SettingsSection({ showToast }) {
  const [activeMenu, setActiveMenu] = useState(0);
  const [form, setForm] = useState({ storeName:"Style Store", desc:"Premium fashion destination for modern ethnic and western wear. Quality guaranteed!", email:"store@stylestore.com", phone:"+91 98765 43210", address:"123 Fashion Street, Commercial Complex, Hyderabad - 500081" });
  const [toggles, setToggles] = useState({ newOrders:true, lowStock:true, newReviews:false, promotions:true });
  const upd = (k,v) => setForm(p=>({...p,[k]:v}));

  const inputStyle = { width:"100%", border:"1px solid #e5e7eb", borderRadius:8,
    padding:"8px 12px", outline:"none", fontSize:13, fontFamily:"inherit", boxSizing:"border-box" };
  const LB = ({ c }) => <label style={{ display:"block", fontSize:12, fontWeight:600,
    color:"#374151", marginBottom:5 }}>{c}</label>;

  return (
    <div>
      <SectionTitle title="Settings" sub="Manage your store and account settings" />
      <div style={{ display:"grid", gridTemplateColumns:"240px 1fr", gap:18 }}>
        <Card p={10}>
          {SETTINGS_MENU.map((m,i) => (
            <button key={m} onClick={() => setActiveMenu(i)} style={{
              width:"100%", display:"flex", alignItems:"center", gap:8,
              padding:"10px 12px", borderRadius:8, border:"none",
              background: activeMenu===i ? "#f5f3ff" : "transparent",
              color: activeMenu===i ? P : "#374151",
              fontWeight: activeMenu===i ? 700 : 400,
              cursor:"pointer", fontFamily:"inherit", fontSize:13, textAlign:"left",
              transition:"all .15s" }}>
              {["🏪","👤","🔔","🛡️","🚚","🧾"][i]} {m}
            </button>
          ))}
        </Card>

        <Card>
          <h3 style={{ fontSize:18, fontWeight:700, color:"#1f2937", marginBottom:20 }}>{SETTINGS_MENU[activeMenu]}</h3>

          {activeMenu === 0 && (
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              <div><LB c="Store Name" /><input value={form.storeName} onChange={e=>upd("storeName",e.target.value)} style={inputStyle} /></div>
              <div><LB c="Store Description" /><textarea rows={3} value={form.desc} onChange={e=>upd("desc",e.target.value)} style={{ ...inputStyle, resize:"vertical" }} /></div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                <div><LB c="Business Email" /><input type="email" value={form.email} onChange={e=>upd("email",e.target.value)} style={inputStyle} /></div>
                <div><LB c="Contact Number" /><input type="tel" value={form.phone} onChange={e=>upd("phone",e.target.value)} style={inputStyle} /></div>
              </div>
              <div><LB c="Business Address" /><textarea rows={2} value={form.address} onChange={e=>upd("address",e.target.value)} style={{ ...inputStyle, resize:"vertical" }} /></div>
              <div>
                <LB c="Store Logo" />
                <div style={{ border:"2px dashed #d1d5db", borderRadius:8, padding:20,
                  textAlign:"center", cursor:"pointer" }}>
                  <span style={{ fontSize:32 }}>☁️</span>
                  <p style={{ fontSize:13, color:"#6b7280", margin:"4px 0 0" }}>Click to upload · PNG, JPG up to 2MB</p>
                </div>
              </div>
              <div style={{ display:"flex", justifyContent:"flex-end", gap:10 }}>
                <SBtn variant="gray">Cancel</SBtn>
                <SBtn variant="primary" onClick={() => showToast("Store profile saved!")}>Save Changes</SBtn>
              </div>
            </div>
          )}

          {activeMenu === 2 && (
            <div style={{ display:"grid", gap:14 }}>
              {[
                { key:"newOrders", label:"New Orders",        desc:"Get notified when a new order is placed" },
                { key:"lowStock",  label:"Low Stock Alerts",  desc:"Alert when product stock falls below 5" },
                { key:"newReviews",label:"New Reviews",       desc:"Notify when a customer leaves a review" },
                { key:"promotions",label:"Promotions & Offers",desc:"News about promotions and platform offers" },
              ].map(t => (
                <div key={t.key} style={{ display:"flex", justifyContent:"space-between",
                  alignItems:"center", padding:"12px 14px", background:"#f9fafb", borderRadius:8 }}>
                  <div>
                    <div style={{ fontWeight:600, color:"#1f2937", fontSize:14 }}>{t.label}</div>
                    <div style={{ fontSize:12, color:"#6b7280" }}>{t.desc}</div>
                  </div>
                  <Toggle checked={toggles[t.key]} onChange={() => {
                    setToggles(p=>({...p,[t.key]:!p[t.key]}));
                    showToast(`${t.label} notifications ${!toggles[t.key] ? "enabled" : "disabled"}`);
                  }} />
                </div>
              ))}
            </div>
          )}

          {activeMenu !== 0 && activeMenu !== 2 && (
            <div style={{ textAlign:"center", padding:"3rem 1rem", color:"#9ca3af" }}>
              <div style={{ fontSize:48, marginBottom:12, opacity:.2 }}>⚙️</div>
              <p style={{ fontSize:14, margin:0 }}>This section is coming soon.</p>
              <SBtn variant="primary" style={{ marginTop:16 }} onClick={() => showToast("Request submitted!")}>Request Early Access</SBtn>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

// ─── INVENTORY ───────────────────────────────────────────────────────────────
function InventorySection({ showToast }) {
  return (
    <div>
      <SectionTitle title="Inventory Management" sub="Track your stock levels" />
      <Card p={0}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead><tr><TH>Product</TH><TH>SKU</TH><TH>Category</TH><TH>Stock</TH><TH>Status</TH><TH>Actions</TH></tr></thead>
          <tbody>
            {INIT_PRODUCTS.map(p => {
              const stockColor = p.stock===0?"#dc2626":p.stock<10?"#d97706":"#059669";
              const stockLabel = p.stock===0?"Out of Stock":p.stock<10?"Low Stock":"In Stock";
              return (
                <TR key={p.id}>
                  <TD style={{ fontWeight:600 }}>{p.name}</TD>
                  <TD style={{ fontFamily:"monospace", fontSize:12, color:"#9ca3af" }}>{p.sku}</TD>
                  <TD>{p.category}</TD>
                  <TD style={{ fontWeight:700, color:stockColor, fontSize:16 }}>{p.stock}</TD>
                  <TD>
                    <span style={{ background:`${stockColor}18`, color:stockColor,
                      padding:"3px 10px", borderRadius:12, fontSize:11, fontWeight:700, textTransform:"uppercase" }}>
                      {stockLabel}
                    </span>
                  </TD>
                  <TD>
                    <SBtn sm variant="outline" onClick={() => showToast(`Restocking ${p.name}…`)}>+ Restock</SBtn>
                  </TD>
                </TR>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

// ─── SUPPORT ─────────────────────────────────────────────────────────────────
function SupportSection({ showToast }) {
  const TICKETS = [
    { id:"#TKT-001", customer:"Priya Sharma",  subject:"Wrong item delivered",        priority:"high",   status:"open",     date:"Jan 30, 2026" },
    { id:"#TKT-002", customer:"Rahul Verma",   subject:"Refund not received",          priority:"medium", status:"open",     date:"Jan 29, 2026" },
    { id:"#TKT-003", customer:"Anjali Reddy",  subject:"Package damaged in transit",   priority:"high",   status:"resolved", date:"Jan 28, 2026" },
    { id:"#TKT-004", customer:"Vikram Singh",  subject:"Size exchange request",        priority:"low",    status:"open",     date:"Jan 27, 2026" },
  ];
  const priorityStyle = {
    high:   { bg:"#fee2e2", color:"#991b1b" },
    medium: { bg:"#fff7ed", color:"#c2410c" },
    low:    { bg:"#f0fdf4", color:"#166534" },
  };

  return (
    <div>
      <SectionTitle title="Support Tickets" sub="Manage customer support requests" />
      <Card p={0}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead><tr><TH>Ticket ID</TH><TH>Customer</TH><TH>Subject</TH><TH>Priority</TH><TH>Status</TH><TH>Date</TH><TH>Actions</TH></tr></thead>
          <tbody>
            {TICKETS.map(t => {
              const ps = priorityStyle[t.priority];
              return (
                <TR key={t.id}>
                  <TD style={{ fontFamily:"monospace", fontSize:11 }}>{t.id}</TD>
                  <TD style={{ fontWeight:600 }}>{t.customer}</TD>
                  <TD style={{ color:"#6b7280", fontSize:13 }}>{t.subject}</TD>
                  <TD>
                    <span style={{ background:ps.bg, color:ps.color, padding:"2px 8px",
                      borderRadius:10, fontSize:11, fontWeight:700, textTransform:"uppercase" }}>{t.priority}</span>
                  </TD>
                  <TD>
                    <span style={{ background:t.status==="open"?"#fef3c7":"#d1fae5",
                      color:t.status==="open"?"#92400e":"#065f46",
                      padding:"2px 8px", borderRadius:10, fontSize:11, fontWeight:700, textTransform:"uppercase" }}>
                      {t.status}
                    </span>
                  </TD>
                  <TD style={{ color:"#9ca3af", fontSize:12 }}>{t.date}</TD>
                  <TD>
                    <div style={{ display:"flex", gap:4 }}>
                      <ActionBtn icon="👁️" color={P}       title="View"  onClick={()=>showToast(`Opening ${t.id}`)} />
                      <ActionBtn icon="✅" color="#059669" title="Resolve" onClick={()=>showToast(`${t.id} resolved`)} />
                    </div>
                  </TD>
                </TR>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

// ─── MARKETING ───────────────────────────────────────────────────────────────
function MarketingSection({ showToast }) {
  const [campaigns] = useState([
    { name:"Summer Sale 2026",      type:"Discount",   discount:"20%",  status:"active",   reach:"2,400", start:"Jan 15", end:"Feb 15" },
    { name:"New Year Bundle Offer", type:"Bundle",     discount:"15%",  status:"ended",    reach:"5,100", start:"Jan 1",  end:"Jan 10" },
    { name:"Valentine's Day Promo", type:"Coupon",     discount:"₹200", status:"upcoming", reach:"—",     start:"Feb 7",  end:"Feb 14" },
  ]);
  const statusStyle = {
    active:   { bg:"#d1fae5", color:"#065f46" },
    ended:    { bg:"#f3f4f6", color:"#6b7280" },
    upcoming: { bg:"#dbeafe", color:"#1e40af" },
  };

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:22 }}>
        <SectionTitle title="Marketing Campaigns" sub="Create and manage your promotions" />
        <SBtn variant="primary" onClick={() => showToast("Campaign builder coming soon!")}>➕ New Campaign</SBtn>
      </div>
      <Card p={0}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead><tr><TH>Campaign</TH><TH>Type</TH><TH>Discount</TH><TH>Duration</TH><TH>Est. Reach</TH><TH>Status</TH><TH>Actions</TH></tr></thead>
          <tbody>
            {campaigns.map(c => {
              const ss = statusStyle[c.status];
              return (
                <TR key={c.name}>
                  <TD style={{ fontWeight:600 }}>{c.name}</TD>
                  <TD style={{ color:"#6b7280" }}>{c.type}</TD>
                  <TD style={{ fontWeight:700, color:P }}>{c.discount}</TD>
                  <TD style={{ fontSize:12, color:"#6b7280" }}>{c.start} → {c.end}</TD>
                  <TD>{c.reach}</TD>
                  <TD>
                    <span style={{ background:ss.bg, color:ss.color, padding:"3px 10px",
                      borderRadius:12, fontSize:11, fontWeight:700, textTransform:"uppercase" }}>{c.status}</span>
                  </TD>
                  <TD>
                    <div style={{ display:"flex", gap:4 }}>
                      <ActionBtn icon="✏️" color={P} title="Edit"   onClick={()=>showToast(`Editing ${c.name}`)} />
                      <ActionBtn icon="📊" color={B} title="Stats"  onClick={()=>showToast(`Stats for ${c.name}`)} />
                    </div>
                  </TD>
                </TR>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

// ─── SECTION ROUTER ──────────────────────────────────────────────────────────
function SectionRouter({ section, navigate, openModal, showToast }) {
  const Placeholder = ({ title, sub, icon }) => (
    <div>
      <SectionTitle title={title} sub={sub} />
      <Card style={{ textAlign:"center", padding:"4rem 1rem" }}>
        <div style={{ fontSize:56, marginBottom:14, opacity:.2 }}>{icon}</div>
        <p style={{ fontSize:14, color:"#9ca3af", margin:0 }}>Module coming soon.</p>
      </Card>
    </div>
  );

  switch(section) {
    case "dashboard": return <DashboardSection navigate={navigate} openModal={openModal} />;
    case "products":  return <ProductsSection  openModal={openModal} showToast={showToast} />;
    case "orders":    return <OrdersSection    showToast={showToast} />;
    case "analytics": return <AnalyticsSection />;
    case "payments":  return <PaymentsSection  showToast={showToast} />;
    case "customers": return <CustomersSection showToast={showToast} />;
    case "returns":   return <ReturnsSection   showToast={showToast} />;
    case "settings":  return <SettingsSection  showToast={showToast} />;
    case "inventory": return <InventorySection showToast={showToast} />;
    case "marketing": return <MarketingSection showToast={showToast} />;
    case "support":   return <SupportSection   showToast={showToast} />;
    default:          return <DashboardSection navigate={navigate} openModal={openModal} />;
  }
}

// ─── ROOT PAGE ────────────────────────────────────────────────────────────────
export default function VendorDashboard() {
  const [section, setSection]   = useState("dashboard");
  const [modalOpen, setModal]   = useState(false);
  const [sidebarOpen, setSidebar] = useState(false);
  const [search, setSearch]     = useState("");
  const [toast, setToast]       = useState(null);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const navigate = (id) => {
    setSection(id);
    setSidebar(false);
    if (typeof window !== "undefined") window.scrollTo({ top:0, behavior:"smooth" });
  };

  const handleSearch = (e) => {
    if (e.key !== "Enter" || !search.trim()) return;
    const match = NAV_ITEMS.find(n => n.label.toLowerCase().includes(search.toLowerCase()));
    if (match) { navigate(match.id); setSearch(""); }
    else showToast(`No section found for "${search}"`);
  };

  const handleSaveProduct = (form, mode) => {
    setModal(false);
    if (mode === "publish") showToast(`Product "${form.name || "New Product"}" published successfully!`);
    else showToast(`Product "${form.name || "New Product"}" saved as draft`);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        body{font-family:'Inter',sans-serif;background:#f9fafb;color:#1f2937}
        @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        .sb-scroll::-webkit-scrollbar{width:4px}
        .sb-scroll::-webkit-scrollbar-thumb{background:rgba(255,255,255,.2);border-radius:4px}
        @media(max-width:1024px){
          .sidebar{transform:translateX(-100%)!important}
          .sidebar.open{transform:translateX(0)!important}
          .main-area{margin-left:0!important}
        }
        @media(max-width:768px){
          .hdr-search{display:none!important}
          .usr-name{display:none!important}
        }
      `}</style>

      {/* TOP NAV */}
      <nav style={{ background:"#fff", boxShadow:"0 1px 4px rgba(0,0,0,.08)",
        position:"fixed", top:0, left:0, right:0, zIndex:50, height:64 }}>
        <div style={{ padding:"0 22px", height:"100%", display:"flex",
          alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <button onClick={() => setSidebar(p=>!p)}
              style={{ background:"none", border:"none", cursor:"pointer", fontSize:20,
                color:"#6b7280", display:"none", padding:4 }} className="hamburger-btn">☰</button>
            <h1 style={{ fontSize:22, fontWeight:800,
              background:`linear-gradient(to right,${PL},${B})`,
              WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", margin:0 }}>AZZRO</h1>
            <span style={{ fontSize:13, color:"#9ca3af" }}>Seller Portal</span>
          </div>

          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div className="hdr-search" style={{ position:"relative" }}>
              <span style={{ position:"absolute", left:11, top:"50%", transform:"translateY(-50%)",
                color:"#9ca3af", fontSize:14 }}>🔍</span>
              <input value={search} onChange={e=>setSearch(e.target.value)} onKeyDown={handleSearch}
                placeholder="Search sections… press Enter"
                style={{ border:"1px solid #e5e7eb", borderRadius:8, padding:"7px 14px 7px 34px",
                  outline:"none", fontSize:13, width:260, fontFamily:"inherit" }} />
            </div>

            <div style={{ position:"relative" }}>
              <button onClick={() => showToast("5 new notifications")}
                style={{ background:"none", border:"none", cursor:"pointer",
                  padding:8, borderRadius:"50%", fontSize:20 }}>🔔
                <span style={{ position:"absolute", top:2, right:2, background:"#ef4444",
                  color:"#fff", borderRadius:"50%", width:17, height:17, display:"flex",
                  alignItems:"center", justifyContent:"center", fontSize:9, fontWeight:700 }}>5</span>
              </button>
            </div>
            <button onClick={() => showToast("Help centre coming soon")}
              style={{ background:"none", border:"none", cursor:"pointer", fontSize:18, padding:4 }}>❓</button>

            <button onClick={() => navigate("settings")}
              style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer",
                padding:"5px 10px", borderRadius:8, border:"none", background:"transparent",
                fontFamily:"inherit", transition:"background .15s" }}
              onMouseOver={e=>e.currentTarget.style.background="#f3f4f6"}
              onMouseOut={e=>e.currentTarget.style.background="transparent"}>
              <div style={{ width:33, height:33, borderRadius:"50%",
                background:`linear-gradient(to right,${PL},${B})`,
                display:"flex", alignItems:"center", justifyContent:"center",
                color:"#fff", fontWeight:700, fontSize:14 }}>S</div>
              <div className="usr-name">
                <p style={{ fontSize:13, fontWeight:600, color:"#1f2937", margin:0 }}>Style Store</p>
                <p style={{ fontSize:11, color:"#9ca3af", margin:0 }}>Gold Seller</p>
              </div>
              <span style={{ color:"#9ca3af", fontSize:10 }}>▼</span>
            </button>
          </div>
        </div>
      </nav>

      <div style={{ display:"flex", paddingTop:64 }}>
        {/* SIDEBAR */}
        <aside className={`sidebar sb-scroll${sidebarOpen?" open":""}`}
          style={{ width:256, background:"#fff", boxShadow:"2px 0 8px rgba(0,0,0,.06)",
            height:"calc(100vh - 64px)", position:"fixed", top:64, left:0, overflowY:"auto",
            zIndex:40, transition:"transform .25s" }}>
          <div style={{ padding:14 }}>
            {/* Revenue card */}
            <div style={{ background:`linear-gradient(to right,${PL},${B})`,
              borderRadius:10, padding:16, color:"#fff", marginBottom:14 }}>
              <p style={{ fontSize:12, opacity:.9, margin:"0 0 2px" }}>This Month</p>
              <p style={{ fontSize:20, fontWeight:700, margin:"0 0 2px" }}>₹2,45,670</p>
              <p style={{ fontSize:11, opacity:.75, margin:0 }}>+23% from last month</p>
            </div>

            {/* Nav items */}
            <nav style={{ display:"flex", flexDirection:"column", gap:2 }}>
              {NAV_ITEMS.map(item => {
                const active = section === item.id;
                return (
                  <button key={item.id} onClick={() => navigate(item.id)} style={{
                    display:"flex", alignItems:"center", gap:10,
                    padding:"9px 12px", borderRadius:8, border:"none",
                    background: active ? `linear-gradient(135deg,${PL},${B})` : "transparent",
                    color: active ? "#fff" : "#374151",
                    fontWeight: active ? 600 : 400,
                    cursor:"pointer", fontFamily:"inherit", fontSize:13, textAlign:"left",
                    transition:"all .15s" }}
                    onMouseOver={e => { if(!active) e.currentTarget.style.background="#f3f4f6"; }}
                    onMouseOut={e => { if(!active) e.currentTarget.style.background="transparent"; }}>
                    <span style={{ fontSize:15 }}>{item.emoji}</span>
                    <span style={{ flex:1 }}>{item.label}</span>
                    {item.badge && (
                      <span style={{ background:item.bc, color:item.bt, fontSize:10,
                        fontWeight:700, padding:"1px 6px", borderRadius:99 }}>{item.badge}</span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Upgrade banner */}
            <div style={{ marginTop:16, background:"linear-gradient(135deg,#fbbf24,#f97316)",
              borderRadius:10, padding:14, color:"#fff" }}>
              <p style={{ fontWeight:700, fontSize:12, margin:"0 0 3px" }}>Upgrade to Platinum</p>
              <p style={{ fontSize:11, opacity:.9, margin:"0 0 8px" }}>Get 3% extra discount on fees</p>
              <button onClick={() => showToast("Upgrade info coming soon!")}
                style={{ background:"#fff", color:"#ea580c", border:"none", borderRadius:99,
                  padding:"3px 10px", fontSize:11, fontWeight:700,
                  cursor:"pointer", fontFamily:"inherit" }}>Learn More</button>
            </div>
          </div>
        </aside>

        {/* MAIN */}
        <main className="main-area" style={{ marginLeft:256, flex:1,
          padding:28, minHeight:"calc(100vh - 64px)" }}>
          <SectionRouter section={section} navigate={navigate}
            openModal={() => setModal(true)} showToast={showToast} />
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div onClick={() => setSidebar(false)}
          style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.42)", zIndex:39 }} />
      )}

      {/* Add Product Modal */}
      <AddProductModal open={modalOpen} onClose={() => setModal(false)} onSave={handleSaveProduct} />

      {/* Toast */}
      {toast && <Toast msg={toast} onClose={() => setToast(null)} />}
    </>
  );
}
