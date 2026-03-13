"use client";

import { useState, useMemo, useRef } from "react";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const C = {
  primary:  "#0A0E27",
  accent:   "#00D9FF",
  accentDk: "#00A8CC",
  success:  "#00E676",
  warning:  "#FFB800",
  danger:   "#FF3D71",
  bg:       "#F8FAFB",
  border:   "#E3E8EF",
  muted:    "#697586",
  text:     "#1F2937",
};

// ─── STATIC DATA ──────────────────────────────────────────────────────────────
const NAV_SECTIONS = [
  { title:"Main", items:[
    { id:"dashboard", icon:"📊", label:"Dashboard" },
    { id:"analytics", icon:"📈", label:"Analytics" },
  ]},
  { title:"Commerce", items:[
    { id:"sellers",   icon:"👥", label:"Sellers",   badge:12 },
    { id:"products",  icon:"📦", label:"Products" },
    { id:"orders",    icon:"🛒", label:"Orders",    badge:45 },
    { id:"customers", icon:"👤", label:"Customers" },
    { id:"inventory", icon:"📊", label:"Inventory" },
  ]},
  { title:"Finance", items:[
    { id:"payments", icon:"💳", label:"Payments" },
    { id:"finances", icon:"💰", label:"Finances" },
    { id:"invoices", icon:"📄", label:"Invoices" },
  ]},
  { title:"Marketing", items:[
    { id:"marketing",  icon:"📣", label:"Campaigns" },
    { id:"promotions", icon:"🎁", label:"Promotions" },
    { id:"coupons",    icon:"🎫", label:"Coupons" },
  ]},
  { title:"Operations", items:[
    { id:"shipping_zones", icon:"🚚", label:"Shipping Zones" },
    { id:"payment_gw",     icon:"💳", label:"Payment Gateway" },
    { id:"returns",        icon:"↩️", label:"Returns" },
  ]},
  { title:"Vendors", items:[
    { id:"vendor_dashboard", icon:"🏪", label:"Vendor Panel" },
    { id:"vendor_commissions", icon:"💹", label:"Commissions" },
    { id:"vendor_payouts",   icon:"🏦", label:"Payouts" },
  ]},
  { title:"Storefront", items:[
    { id:"homepage_editor", icon:"🎨", label:"Homepage Editor" },
    { id:"cms",        icon:"📝", label:"CMS" },
    { id:"media",      icon:"🖼️", label:"Media Library" },
    { id:"categories", icon:"📁", label:"Categories" },
  ]},
  { title:"Support", items:[
    { id:"tickets", icon:"🎫", label:"Tickets", badge:8 },
    { id:"reviews", icon:"⭐", label:"Reviews" },
    { id:"reports", icon:"📊", label:"Reports" },
  ]},
  { title:"System", items:[
    { id:"users",    icon:"👨‍💼", label:"Users & Roles" },
    { id:"rest_api", icon:"🔗", label:"REST API Keys" },
    { id:"settings", icon:"⚙️",  label:"Settings" },
    { id:"activity", icon:"📋", label:"Activity Log" },
  ]},
];

const INIT_STATS = [
  { icon:"💰", label:"Total Revenue",   value:"₹45.2L", change:"+12.5%", positive:true,  color:"blue" },
  { icon:"📦", label:"Total Orders",    value:"1,284",  change:"+8.2%",  positive:true,  color:"green" },
  { icon:"👥", label:"Active Sellers",  value:"247",    change:"+5.1%",  positive:true,  color:"orange" },
  { icon:"👤", label:"Total Customers", value:"8,456",  change:"+15.3%", positive:true,  color:"red" },
];

const INIT_SELLERS = [
  { id:"#SEL-001", name:"Fashion Hub India", contact:"Rajesh Kumar", revenue:"₹12.4L", products:234, rating:"4.8", status:"Active", commission:12 },
  { id:"#SEL-002", name:"Tech Store Pro",    contact:"Amit Patel",   revenue:"₹8.9L",  products:156, rating:"4.6", status:"Active", commission:10 },
  { id:"#SEL-003", name:"Home Decor World",  contact:"Sunita Verma", revenue:"₹6.2L",  products:98,  rating:"4.3", status:"Pending", commission:15 },
  { id:"#SEL-004", name:"Sports Arena",      contact:"Kiran Mehta",  revenue:"₹4.1L",  products:67,  rating:"4.1", status:"Suspended", commission:12 },
  { id:"#SEL-005", name:"Beauty Palace",     contact:"Nisha Gupta",  revenue:"₹3.5L",  products:45,  rating:"4.5", status:"Active", commission:14 },
];

const INIT_ORDERS = [
  { id:"#ORD-1234", customer:"Rajesh Kumar", amount:"₹2,499", status:"Delivered",  statusType:"success" },
  { id:"#ORD-1233", customer:"Priya Sharma", amount:"₹4,999", status:"Shipping",   statusType:"warning" },
  { id:"#ORD-1232", customer:"Amit Patel",   amount:"₹1,299", status:"Processing", statusType:"info" },
  { id:"#ORD-1231", customer:"Sneha Reddy",  amount:"₹8,750", status:"Cancelled",  statusType:"danger" },
  { id:"#ORD-1230", customer:"Deepak Singh", amount:"₹3,200", status:"Delivered",  statusType:"success" },
  { id:"#ORD-1229", customer:"Meena Iyer",   amount:"₹1,800", status:"Shipping",   statusType:"warning" },
];

const INIT_CUSTOMERS = [
  { id:"#CUS-001", name:"Rajesh Kumar", email:"rajesh@example.com", orders:12, spent:"₹24,500", joined:"Jan 2025", status:"Active" },
  { id:"#CUS-002", name:"Priya Sharma", email:"priya@example.com",  orders:8,  spent:"₹18,200", joined:"Mar 2025", status:"Active" },
  { id:"#CUS-003", name:"Amit Patel",   email:"amit@example.com",   orders:5,  spent:"₹9,800",  joined:"Jun 2025", status:"Active" },
  { id:"#CUS-004", name:"Sneha Reddy",  email:"sneha@example.com",  orders:3,  spent:"₹6,100",  joined:"Sep 2025", status:"Inactive" },
  { id:"#CUS-005", name:"Deepak Singh", email:"deepak@example.com", orders:15, spent:"₹31,000", joined:"Nov 2024", status:"Active" },
];

const INIT_PRODUCTS = [
  { id:"#PRD-001", name:"Designer Silk Kurti", sku:"WM-KUR-001", category:"Women", vendor:"Fashion Hub India", price:"₹1,299", mrp:"₹2,999", stock:45, status:"Active" },
  { id:"#PRD-002", name:"Wireless Earbuds Pro", sku:"TK-EAR-002", category:"Electronics", vendor:"Tech Store Pro", price:"₹2,499", mrp:"₹4,999", stock:5, status:"Active" },
  { id:"#PRD-003", name:"Ceramic Vase Set", sku:"HD-VAS-003", category:"Home Decor", vendor:"Home Decor World", price:"₹899", mrp:"₹1,599", stock:22, status:"Active" },
  { id:"#PRD-004", name:"Sports Water Bottle", sku:"SP-BOT-004", category:"Sports", vendor:"Sports Arena", price:"₹499", mrp:"₹999", stock:0, status:"Inactive" },
  { id:"#PRD-005", name:"Rose Gold Lipstick Kit", sku:"BP-LIP-005", category:"Beauty", vendor:"Beauty Palace", price:"₹699", mrp:"₹1,299", stock:78, status:"Active" },
];

const CATEGORIES = ["Women", "Men", "Kids", "Electronics", "Home Decor", "Sports", "Beauty", "Books", "Food"];
const SUB_CATEGORIES = {
  Women:["Kurtis","Sarees","Tops","Jeans","Dresses"],
  Men:["Shirts","T-Shirts","Trousers","Suits","Ethnic"],
  Kids:["Boys","Girls","Infants"],
  Electronics:["Mobiles","Laptops","Audio","Cameras","Accessories"],
  "Home Decor":["Living Room","Bedroom","Kitchen","Garden"],
  Sports:["Cricket","Football","Fitness","Swimming"],
  Beauty:["Skincare","Makeup","Haircare","Fragrance"],
  Books:["Fiction","Non-Fiction","Educational","Comics"],
  Food:["Snacks","Beverages","Organic","Spices"],
};

const ACTIVITY_LOG = [
  { icon:"📦", bg:"rgba(0,217,255,0.1)",  text:"New order #ORD-1284 placed by Deepak Singh",       time:"2 minutes ago" },
  { icon:"✅", bg:"rgba(0,230,118,0.1)",  text:"Seller Tech Store Pro approved by Admin",           time:"15 minutes ago" },
  { icon:"⚠️", bg:"rgba(255,184,0,0.1)", text:"Low stock alert: Wireless Earbuds (5 left)",        time:"1 hour ago" },
  { icon:"💬", bg:"rgba(255,61,113,0.1)", text:"New support ticket #TKT-892 received",              time:"2 hours ago" },
  { icon:"👤", bg:"rgba(0,230,118,0.1)", text:"New customer registration: Meena Iyer",             time:"3 hours ago" },
  { icon:"💰", bg:"rgba(0,217,255,0.1)", text:"Payment of ₹12,500 settled for Fashion Hub India",  time:"5 hours ago" },
];

const SETTINGS_TABS = ["General", "Payment Gateway", "Shipping", "Tax & GST", "Email / SMTP", "Security"];

// ─── COLOUR MAPS ──────────────────────────────────────────────────────────────
const colorMap = {
  blue:   { bg:"rgba(0,217,255,0.12)",   color:C.accent },
  green:  { bg:"rgba(0,230,118,0.12)",   color:C.success },
  orange: { bg:"rgba(255,184,0,0.12)",   color:C.warning },
  red:    { bg:"rgba(255,61,113,0.12)",  color:C.danger },
};
const badgeStyles = {
  success: { background:"rgba(0,230,118,0.12)",  color:C.success },
  warning: { background:"rgba(255,184,0,0.12)",  color:C.warning },
  danger:  { background:"rgba(255,61,113,0.12)", color:C.danger },
  info:    { background:"rgba(0,217,255,0.12)",  color:C.accent },
  neutral: { background:"#EEF2F6", color:"#4B5565" },
};
const sellerStatusStyle = {
  Active:    { background:"rgba(0,230,118,0.12)",  color:C.success },
  Pending:   { background:"rgba(255,184,0,0.12)",  color:C.warning },
  Suspended: { background:"rgba(255,61,113,0.12)", color:C.danger },
};


// ─── SHARED UI COMPONENTS ─────────────────────────────────────────────────────
function Badge({ type, children }) {
  const s = badgeStyles[type] || badgeStyles.neutral;
  return (
    <span style={{ display:"inline-flex", alignItems:"center", padding:"0.28rem 0.7rem",
      borderRadius:20, fontSize:"0.7rem", fontWeight:700, textTransform:"uppercase",
      letterSpacing:"0.05em", ...s }}>{children}</span>
  );
}

function Card({ header, children, style = {} }) {
  return (
    <div style={{ background:"white", borderRadius:"1rem", border:`1px solid ${C.border}`,
      marginBottom:"1.5rem", overflow:"hidden", ...style }}>
      {header && (
        <div style={{ padding:"1.1rem 1.4rem", borderBottom:`1px solid ${C.border}`,
          display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          {header}
        </div>
      )}
      <div style={{ padding:"1.4rem" }}>{children}</div>
    </div>
  );
}

function PrimaryBtn({ children, onClick, small = false, style = {}, type = "button" }) {
  return (
    <button type={type} onClick={onClick} style={{
      background:`linear-gradient(135deg,${C.accent},${C.accentDk})`,
      color:"white", border:"none", borderRadius:"0.5rem",
      padding: small ? "0.38rem 0.85rem" : "0.6rem 1.2rem",
      fontFamily:"inherit", fontSize: small ? "0.8rem" : "0.88rem",
      fontWeight:600, cursor:"pointer", display:"inline-flex", alignItems:"center",
      gap:"0.4rem", boxShadow:`0 4px 12px rgba(0,217,255,0.22)`,
      transition:"all 180ms", ...style }}
      onMouseOver={e => e.currentTarget.style.transform="translateY(-1px)"}
      onMouseOut={e => e.currentTarget.style.transform="translateY(0)"}
    >{children}</button>
  );
}

function SecondaryBtn({ children, onClick, small = false }) {
  return (
    <button onClick={onClick} style={{
      background:"#EEF2F6", color:"#364152", border:"none", borderRadius:"0.5rem",
      padding: small ? "0.38rem 0.85rem" : "0.6rem 1.2rem",
      fontFamily:"inherit", fontSize: small ? "0.8rem" : "0.88rem",
      fontWeight:600, cursor:"pointer", display:"inline-flex", alignItems:"center", gap:"0.4rem",
      transition:"all 180ms" }}
      onMouseOver={e => e.currentTarget.style.background="#E3E8EF"}
      onMouseOut={e => e.currentTarget.style.background="#EEF2F6"}
    >{children}</button>
  );
}

function DangerBtn({ children, onClick, small = false }) {
  return (
    <button onClick={onClick} style={{
      background:"rgba(255,61,113,0.1)", color:C.danger, border:`1px solid rgba(255,61,113,0.3)`, borderRadius:"0.5rem",
      padding: small ? "0.38rem 0.85rem" : "0.6rem 1.2rem",
      fontFamily:"inherit", fontSize: small ? "0.8rem" : "0.88rem",
      fontWeight:600, cursor:"pointer", display:"inline-flex", alignItems:"center", gap:"0.4rem",
      transition:"all 180ms" }}
      onMouseOver={e => { e.currentTarget.style.background=C.danger; e.currentTarget.style.color="white"; }}
      onMouseOut={e => { e.currentTarget.style.background="rgba(255,61,113,0.1)"; e.currentTarget.style.color=C.danger; }}
    >{children}</button>
  );
}

function ActionBtn({ icon, variant = "default", onClick, title }) {
  const c = variant === "danger"
    ? { bg:"rgba(255,61,113,0.1)", hover:C.danger }
    : { bg:"#EEF2F6",              hover:C.accent };
  return (
    <button title={title} onClick={onClick} style={{
      width:32, height:32, border:"none", background:c.bg, borderRadius:"0.375rem",
      cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center",
      fontSize:"0.88rem", transition:"all 150ms" }}
      onMouseOver={e => { e.currentTarget.style.background=c.hover; e.currentTarget.style.color="white"; e.currentTarget.style.transform="scale(1.08)"; }}
      onMouseOut={e => { e.currentTarget.style.background=c.bg; e.currentTarget.style.color=""; e.currentTarget.style.transform="scale(1)"; }}
    >{icon}</button>
  );
}

function SearchInput({ value, onChange, placeholder }) {
  return (
    <div style={{ display:"flex", alignItems:"center", background:"#EEF2F6",
      borderRadius:"0.5rem", padding:"0.42rem 0.85rem", flex:1, minWidth:180,
      border:`1px solid transparent`, transition:"border 200ms" }}>
      <span style={{ marginRight:"0.5rem", color:C.muted, fontSize:"0.9rem" }}>🔍</span>
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ border:"none", background:"transparent", outline:"none", width:"100%",
          fontFamily:"inherit", fontSize:"0.88rem" }} />
      {value && <button onClick={() => onChange("")} style={{ background:"none", border:"none",
        cursor:"pointer", color:C.muted, fontSize:"1.1rem", lineHeight:1, padding:0 }}>×</button>}
    </div>
  );
}

function Toggle({ checked, onChange }) {
  return (
    <div onClick={() => onChange(!checked)} style={{
      position:"relative", width:48, height:24, borderRadius:24,
      background: checked ? C.accent : "#CDD5DF",
      cursor:"pointer", transition:"background 250ms", flexShrink:0 }}>
      <div style={{ position:"absolute", top:3, left: checked ? 27 : 3,
        width:18, height:18, borderRadius:"50%", background:"white",
        transition:"left 250ms", boxShadow:"0 1px 3px rgba(0,0,0,0.2)" }} />
    </div>
  );
}

function Pagination({ current, total, onChange }) {
  return (
    <div style={{ display:"flex", gap:"0.4rem", alignItems:"center", justifyContent:"center", marginTop:"1.5rem" }}>
      <button onClick={() => onChange(Math.max(1, current-1))}
        style={{ width:36, height:36, border:`2px solid ${C.border}`, background:"white",
          borderRadius:"0.5rem", cursor:"pointer", fontWeight:700, fontSize:"0.9rem",
          fontFamily:"inherit", transition:"all 150ms" }}>←</button>
      {Array.from({ length:total }, (_, i) => i+1).map(p => (
        <button key={p} onClick={() => onChange(p)} style={{
          width:36, height:36,
          border: p !== current ? `2px solid ${C.border}` : "none",
          background: p === current ? C.accent : "white",
          color: p === current ? "white" : "inherit",
          borderRadius:"0.5rem", cursor:"pointer", fontWeight:700, fontFamily:"inherit",
          fontSize:"0.9rem", transition:"all 150ms" }}>{p}</button>
      ))}
      <button onClick={() => onChange(Math.min(total, current+1))}
        style={{ width:36, height:36, border:`2px solid ${C.border}`, background:"white",
          borderRadius:"0.5rem", cursor:"pointer", fontWeight:700, fontSize:"0.9rem",
          fontFamily:"inherit", transition:"all 150ms" }}>→</button>
    </div>
  );
}

function PageHeader({ title, breadcrumb, action }) {
  return (
    <div style={{ marginBottom:"2rem", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
      <div>
        <h1 style={{ fontSize:"1.9rem", fontWeight:700, color:C.primary, letterSpacing:"-0.02em", margin:0 }}>{title}</h1>
        <div style={{ display:"flex", alignItems:"center", gap:"0.5rem", fontSize:"0.88rem", color:C.muted, marginTop:"0.35rem" }}>
          <span>Home</span><span style={{ color:C.border }}>/</span><span>{breadcrumb}</span>
        </div>
      </div>
      {action}
    </div>
  );
}

function TH({ children }) {
  return (
    <th style={{ textAlign:"left", padding:"0.7rem 1rem", fontWeight:600, color:"#364152",
      textTransform:"uppercase", fontSize:"0.7rem", letterSpacing:"0.06em",
      borderBottom:`2px solid ${C.border}`, background:C.bg, whiteSpace:"nowrap" }}>{children}</th>
  );
}
function TD({ children, style = {} }) {
  return (
    <td style={{ padding:"0.8rem 1rem", borderBottom:`1px solid ${C.border}`, ...style }}>{children}</td>
  );
}
function TR({ children }) {
  return (
    <tr style={{ transition:"background 120ms" }}
      onMouseOver={e => e.currentTarget.style.background=C.bg}
      onMouseOut={e => e.currentTarget.style.background="white"}>{children}</tr>
  );
}

function Toast({ message, onClose }) {
  return (
    <div style={{ position:"fixed", bottom:24, right:24, background:"#1F2937", color:"white",
      padding:"0.75rem 1.25rem", borderRadius:"0.75rem", fontSize:"0.88rem", fontWeight:500,
      zIndex:9999, display:"flex", alignItems:"center", gap:"0.75rem",
      boxShadow:"0 8px 24px rgba(0,0,0,0.25)", animation:"slideIn 0.3s ease",
      maxWidth:340 }}>
      <span style={{ color:C.success, fontSize:"1.1rem" }}>✓</span>
      <span style={{ flex:1 }}>{message}</span>
      <button onClick={onClose} style={{ background:"none", border:"none", color:"rgba(255,255,255,0.5)",
        cursor:"pointer", fontSize:"1.1rem", lineHeight:1, padding:0, marginLeft:4 }}>×</button>
    </div>
  );
}

function FieldLabel({ children, required }) {
  return (
    <label style={{ display:"block", marginBottom:"0.4rem", fontWeight:600, color:"#364152", fontSize:"0.86rem" }}>
      {children}{required && <span style={{ color:C.danger }}> *</span>}
    </label>
  );
}
function FieldInput({ value, onChange, placeholder, type="text", style={} }) {
  return (
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      style={{ width:"100%", padding:"0.58rem 0.85rem", border:`2px solid ${C.border}`,
        borderRadius:"0.5rem", fontFamily:"inherit", fontSize:"0.9rem", outline:"none",
        boxSizing:"border-box", transition:"border-color 200ms", ...style }}
      onFocus={e => e.target.style.borderColor=C.accent}
      onBlur={e => e.target.style.borderColor=C.border} />
  );
}
function FieldSelect({ value, onChange, children, style={} }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)}
      style={{ width:"100%", padding:"0.58rem 0.85rem", border:`2px solid ${C.border}`,
        borderRadius:"0.5rem", fontFamily:"inherit", fontSize:"0.9rem", outline:"none",
        background:"white", cursor:"pointer", boxSizing:"border-box", ...style }}
      onFocus={e => e.target.style.borderColor=C.accent}
      onBlur={e => e.target.style.borderColor=C.border}>
      {children}
    </select>
  );
}

function SectionTitle({ children }) {
  return (
    <h3 style={{ fontSize:"0.95rem", fontWeight:700, color:C.primary,
      marginBottom:"1rem", marginTop:"1.5rem", paddingBottom:"0.5rem",
      borderBottom:`2px solid ${C.border}`, display:"flex", alignItems:"center", gap:"0.5rem" }}>
      {children}
    </h3>
  );
}

function InfoBox({ type = "info", children }) {
  const colors = {
    info:    { bg:"rgba(0,217,255,0.06)",    border:"rgba(0,217,255,0.25)",    icon:"ℹ️",  text:"#0a5f75" },
    warning: { bg:"rgba(255,184,0,0.06)",    border:"rgba(255,184,0,0.25)",    icon:"⚠️",  text:"#8B6914" },
    success: { bg:"rgba(0,230,118,0.06)",    border:"rgba(0,230,118,0.25)",    icon:"✅",  text:"#1a6b3c" },
    danger:  { bg:"rgba(255,61,113,0.06)",   border:"rgba(255,61,113,0.25)",   icon:"⚠️",  text:"#8B1A35" },
  };
  const s = colors[type];
  return (
    <div style={{ background:s.bg, border:`1px solid ${s.border}`, borderRadius:"0.65rem",
      padding:"0.85rem 1rem", marginBottom:"1rem", display:"flex", gap:"0.6rem", alignItems:"flex-start" }}>
      <span>{s.icon}</span>
      <div style={{ fontSize:"0.85rem", color:s.text, lineHeight:1.6 }}>{children}</div>
    </div>
  );
}


// ─── COMING SOON BANNER ───────────────────────────────────────────────────────
function ComingSoonSection({ icon, sectionTitle, breadcrumb, description, features }) {
  return (
    <div>
      <PageHeader title={sectionTitle} breadcrumb={breadcrumb} />
      <Card style={{ marginBottom:0 }}>
        <div style={{ textAlign:"center", padding:"3rem 2rem" }}>
          <div style={{ width:80, height:80, borderRadius:"1.5rem", background:"rgba(0,217,255,0.08)",
            display:"flex", alignItems:"center", justifyContent:"center", fontSize:"2.4rem",
            margin:"0 auto 1.5rem" }}>{icon}</div>
          <div style={{ display:"inline-flex", alignItems:"center", gap:"0.5rem", background:"rgba(255,184,0,0.12)",
            color:C.warning, padding:"0.35rem 1rem", borderRadius:20, fontSize:"0.8rem",
            fontWeight:700, letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:"1rem" }}>
            🚀 Activates After Website Goes Live
          </div>
          <h2 style={{ fontSize:"1.5rem", fontWeight:700, color:C.primary, margin:"0 0 0.75rem" }}>{sectionTitle}</h2>
          <p style={{ color:C.muted, fontSize:"0.95rem", maxWidth:500, margin:"0 auto 2rem", lineHeight:1.7 }}>{description}</p>
          {features && (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",
              gap:"0.75rem", maxWidth:600, margin:"0 auto" }}>
              {features.map((f,i) => (
                <div key={i} style={{ background:C.bg, borderRadius:"0.75rem", padding:"0.85rem 1rem",
                  border:`1px solid ${C.border}`, textAlign:"left", display:"flex", alignItems:"center", gap:"0.6rem" }}>
                  <span style={{ fontSize:"1.2rem" }}>{f.icon}</span>
                  <span style={{ fontSize:"0.82rem", fontWeight:600, color:"#364152" }}>{f.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function DashboardSection({ navigate }) {
  return (
    <div>
      <PageHeader title="Dashboard Overview" breadcrumb="Dashboard" />
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(215px,1fr))", gap:"1.2rem", marginBottom:"1.8rem" }}>
        {INIT_STATS.map(s => {
          const c = colorMap[s.color];
          return (
            <div key={s.label}
              style={{ background:"white", padding:"1.5rem", borderRadius:"1rem",
                border:`1px solid ${C.border}`, position:"relative", overflow:"hidden",
                cursor:"default", transition:"all 240ms" }}
              onMouseOver={e => { e.currentTarget.style.transform="translateY(-4px)"; e.currentTarget.style.boxShadow="0 12px 24px rgba(0,0,0,0.09)"; }}
              onMouseOut={e => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="none"; }}>
              <div style={{ position:"absolute", top:0, left:0, right:0, height:3,
                background:`linear-gradient(90deg,${C.accent},${C.accentDk})` }} />
              <div style={{ width:46, height:46, borderRadius:"0.5rem", display:"flex",
                alignItems:"center", justifyContent:"center", fontSize:"1.4rem",
                background:c.bg, marginBottom:"0.75rem" }}>{s.icon}</div>
              <div style={{ fontSize:"0.75rem", color:C.muted, fontWeight:600,
                textTransform:"uppercase", letterSpacing:"0.06em" }}>{s.label}</div>
              <div style={{ fontSize:"1.9rem", fontWeight:700, color:C.primary,
                letterSpacing:"-0.02em", margin:"0.2rem 0" }}>{s.value}</div>
              <div style={{ fontSize:"0.8rem", fontWeight:600, display:"flex", gap:"0.35rem",
                color: s.positive ? C.success : C.danger }}>
                <span>{s.change}</span><span style={{ color:C.muted }}>vs last month</span>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(170px,1fr))", gap:"1rem", marginBottom:"1.8rem" }}>
        {[
          { icon:"➕", label:"Add New Product",   target:"products" },
          { icon:"👥", label:"Approve Sellers",   target:"sellers" },
          { icon:"🎨", label:"Edit Homepage",     target:"homepage_editor" },
          { icon:"🚚", label:"Shipping Zones",    target:"shipping_zones" },
        ].map(a => (
          <button key={a.label} onClick={() => navigate(a.target)} style={{
            background:"white", border:`2px dashed ${C.border}`, borderRadius:"0.75rem",
            padding:"1.4rem", textAlign:"center", cursor:"pointer", transition:"all 220ms",
            fontFamily:"inherit" }}
            onMouseOver={e => { e.currentTarget.style.borderColor=C.accent; e.currentTarget.style.transform="translateY(-2px)"; }}
            onMouseOut={e => { e.currentTarget.style.borderColor=C.border; e.currentTarget.style.transform="translateY(0)"; }}>
            <div style={{ fontSize:"1.9rem", marginBottom:"0.45rem" }}>{a.icon}</div>
            <div style={{ fontWeight:600, color:C.primary, fontSize:"0.88rem" }}>{a.label}</div>
          </button>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:"1.5rem" }}>
        <Card header={<>
          <span style={{ fontSize:"1.05rem", fontWeight:600, color:C.primary }}>Recent Orders</span>
          <button onClick={() => navigate("orders")} style={{ background:"none", border:"none",
            color:C.accent, fontSize:"0.83rem", cursor:"pointer", fontFamily:"inherit", fontWeight:500 }}>View All →</button>
        </>}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead><tr>{["Order ID","Customer","Amount","Status"].map(h => <TH key={h}>{h}</TH>)}</tr></thead>
            <tbody>
              {INIT_ORDERS.slice(0,4).map(o => (
                <TR key={o.id}>
                  <TD style={{ fontFamily:"monospace", fontSize:"0.82rem" }}>{o.id}</TD>
                  <TD>{o.customer}</TD>
                  <TD style={{ fontWeight:600 }}>{o.amount}</TD>
                  <TD><Badge type={o.statusType}>{o.status}</Badge></TD>
                </TR>
              ))}
            </tbody>
          </table>
        </Card>

        <Card header={<span style={{ fontSize:"1.05rem", fontWeight:600, color:C.primary }}>Activity Feed</span>}>
          <div style={{ display:"flex", flexDirection:"column", gap:"0.85rem" }}>
            {ACTIVITY_LOG.slice(0,4).map((a,i) => (
              <div key={i} style={{ display:"flex", gap:"0.75rem", alignItems:"flex-start" }}>
                <div style={{ width:32, height:32, borderRadius:"50%", display:"flex", alignItems:"center",
                  justifyContent:"center", background:a.bg, flexShrink:0, fontSize:"0.9rem" }}>{a.icon}</div>
                <div>
                  <div style={{ fontSize:"0.82rem", color:"#364152", lineHeight:1.4 }}>{a.text}</div>
                  <div style={{ fontSize:"0.72rem", color:C.muted, marginTop:"0.15rem" }}>{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─── SELLERS ─────────────────────────────────────────────────────────────────
// ─── ADD SELLER MODAL ─────────────────────────────────────────────────────────
const EMPTY_SELLER_FORM = {
  // Store Info
  storeName:"", storeSlug:"", storeDescription:"", storeCategory:"",
  storeLogo:"", storeBanner:"",
  // Contact Person
  contactName:"", contactEmail:"", contactPhone:"", contactDesignation:"",
  // Address
  addressLine1:"", addressLine2:"", city:"", state:"", pincode:"", country:"India",
  // Business / Legal
  businessType:"", gstin:"", pan:"", businessRegNo:"",
  // Bank / Payout
  accountHolder:"", bankName:"", accountNo:"", ifsc:"", upiId:"",
  // Commission & Access
  commission:"12", status:"Pending", sendWelcomeEmail:true,
  // Social
  website:"", instagram:"", facebook:"",
};

const INDIAN_STATES = ["Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Delhi","Jammu & Kashmir","Ladakh","Chandigarh","Puducherry"];

const SELLER_STEPS = [
  { id:"store",    icon:"🏪", label:"Store Info" },
  { id:"contact",  icon:"👤", label:"Contact" },
  { id:"address",  icon:"📍", label:"Address" },
  { id:"business", icon:"🏢", label:"Business" },
  { id:"bank",     icon:"🏦", label:"Bank / Payout" },
  { id:"settings", icon:"⚙️", label:"Settings" },
];

function AddSellerModal({ onClose, onSave, showToast }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(EMPTY_SELLER_FORM);
  const [errors, setErrors] = useState({});
  const set = (k, v) => { setForm(p => ({ ...p, [k]:v })); setErrors(p => ({ ...p, [k]:"" })); };

  const validate = () => {
    const e = {};
    if (step === 0) {
      if (!form.storeName.trim())    e.storeName = "Store name is required";
      if (!form.storeCategory)       e.storeCategory = "Please select a category";
    }
    if (step === 1) {
      if (!form.contactName.trim())  e.contactName = "Contact name is required";
      if (!form.contactEmail.trim()) e.contactEmail = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(form.contactEmail)) e.contactEmail = "Enter a valid email";
      if (!form.contactPhone.trim()) e.contactPhone = "Phone number is required";
    }
    if (step === 2) {
      if (!form.addressLine1.trim()) e.addressLine1 = "Address is required";
      if (!form.city.trim())         e.city = "City is required";
      if (!form.state)               e.state = "State is required";
      if (!form.pincode.trim())      e.pincode = "Pincode is required";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validate()) setStep(s => Math.min(s + 1, SELLER_STEPS.length - 1)); };
  const prev = () => setStep(s => Math.max(s - 1, 0));

  const handleSubmit = () => {
    if (!validate()) return;
    const newSeller = {
      id: `#SEL-${String(Date.now()).slice(-3)}`,
      name: form.storeName,
      contact: form.contactName,
      revenue: "₹0",
      products: 0,
      rating: "New",
      status: form.status,
      commission: Number(form.commission) || 12,
      email: form.contactEmail,
      phone: form.contactPhone,
      city: form.city,
      state: form.state,
      gstin: form.gstin,
    };
    onSave(newSeller);
    showToast(`Seller "${form.storeName}" added successfully!`);
    onClose();
  };

  const Err = ({ field }) => errors[field]
    ? <div style={{ color:C.danger, fontSize:"0.75rem", marginTop:"0.25rem" }}>⚠ {errors[field]}</div>
    : null;

  const FI = ({ label, field, type="text", placeholder="", required=false, opts=null }) => (
    <div>
      <FieldLabel>{label}{required && <span style={{ color:C.danger }}> *</span>}</FieldLabel>
      {opts ? (
        <FieldSelect value={form[field]} onChange={v => set(field, v)}
          style={{ borderColor: errors[field] ? C.danger : undefined }}>
          <option value="">— Select —</option>
          {opts.map(o => <option key={o}>{o}</option>)}
        </FieldSelect>
      ) : (
        <FieldInput value={form[field]} onChange={v => set(field, v)} type={type}
          placeholder={placeholder}
          style={{ borderColor: errors[field] ? C.danger : undefined }} />
      )}
      <Err field={field} />
    </div>
  );

  const stepContent = [
    // Step 0 — Store Info
    <div key="store">
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem", marginBottom:"1rem" }}>
        <FI label="Store / Business Name" field="storeName" placeholder="e.g. Fashion Hub India" required />
        <FI label="Store URL Slug" field="storeSlug" placeholder="fashion-hub-india" />
      </div>
      <div style={{ marginBottom:"1rem" }}>
        <FieldLabel>Store Description</FieldLabel>
        <textarea value={form.storeDescription} onChange={e => set("storeDescription", e.target.value)}
          placeholder="Brief description of the store and products sold…"
          style={{ width:"100%", padding:"0.6rem 0.85rem", border:`2px solid ${C.border}`, borderRadius:"0.5rem",
            fontFamily:"inherit", fontSize:"0.9rem", outline:"none", resize:"vertical", minHeight:80, boxSizing:"border-box" }}
          onFocus={e => e.target.style.borderColor=C.accent} onBlur={e => e.target.style.borderColor=C.border} />
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem", marginBottom:"1rem" }}>
        <FI label="Primary Category" field="storeCategory" required
          opts={CATEGORIES} />
        <FI label="Website / Store URL" field="website" placeholder="https://yourstore.com" />
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem" }}>
        <FI label="Instagram Handle" field="instagram" placeholder="@yourstorename" />
        <FI label="Facebook Page" field="facebook" placeholder="facebook.com/yourstore" />
      </div>
    </div>,

    // Step 1 — Contact Person
    <div key="contact">
      <div style={{ background:`rgba(0,217,255,0.05)`, border:`1px solid rgba(0,217,255,0.2)`, borderRadius:"0.75rem", padding:"1rem", marginBottom:"1rem" }}>
        <div style={{ fontSize:"0.82rem", color:C.muted, fontWeight:600, marginBottom:"0.5rem" }}>👤 Primary Contact Person</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem" }}>
          <FI label="Full Name" field="contactName" placeholder="e.g. Rajesh Kumar" required />
          <FI label="Designation / Role" field="contactDesignation" placeholder="e.g. Owner, Manager" />
          <FI label="Email Address" field="contactEmail" type="email" placeholder="rajesh@example.com" required />
          <FI label="Phone Number" field="contactPhone" placeholder="+91 98765 43210" required />
        </div>
      </div>
      <InfoBox type="info">The contact person will receive login credentials and all seller-related notifications at the email address provided.</InfoBox>
    </div>,

    // Step 2 — Address
    <div key="address">
      <div style={{ display:"grid", gap:"1rem" }}>
        <FI label="Address Line 1" field="addressLine1" placeholder="Building / Street / Area" required />
        <FI label="Address Line 2" field="addressLine2" placeholder="Landmark / Floor / Unit (optional)" />
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"1rem" }}>
          <FI label="City" field="city" placeholder="e.g. Mumbai" required />
          <FI label="State" field="state" required opts={INDIAN_STATES} />
          <FI label="Pincode" field="pincode" placeholder="400001" required />
        </div>
        <FI label="Country" field="country" opts={["India"]} />
      </div>
    </div>,

    // Step 3 — Business / Legal
    <div key="business">
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem", marginBottom:"1rem" }}>
        <FI label="Business Type" field="businessType"
          opts={["Sole Proprietorship","Partnership","Private Limited (Pvt. Ltd.)","LLP","Public Limited","HUF","Trust/NGO"]} />
        <FI label="GSTIN" field="gstin" placeholder="22AAAAA0000A1Z5" />
        <FI label="PAN Number" field="pan" placeholder="ABCDE1234F" />
        <FI label="Business Registration No." field="businessRegNo" placeholder="e.g. CIN / MSME No." />
      </div>
      <InfoBox type="info">GST and PAN details are required for generating tax invoices and processing payouts above ₹50,000/year as per Indian tax regulations.</InfoBox>
    </div>,

    // Step 4 — Bank / Payout
    <div key="bank">
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem", marginBottom:"1rem" }}>
        <FI label="Account Holder Name" field="accountHolder" placeholder="As per bank records" />
        <FI label="Bank Name" field="bankName" placeholder="e.g. HDFC, SBI, ICICI" />
        <FI label="Account Number" field="accountNo" type="password" placeholder="••••••••••••" />
        <FI label="IFSC Code" field="ifsc" placeholder="HDFC0001234" />
      </div>
      <div style={{ marginBottom:"1rem" }}>
        <FieldLabel>UPI ID (optional)</FieldLabel>
        <FieldInput value={form.upiId} onChange={v => set("upiId",v)} placeholder="seller@upi" />
      </div>
      <InfoBox type="warning">Bank details are used exclusively for vendor payouts. Ensure all details match exactly to avoid payment failures.</InfoBox>
    </div>,

    // Step 5 — Settings
    <div key="settings">
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem", marginBottom:"1.25rem" }}>
        <div>
          <FieldLabel>Commission Rate (%)<span style={{ color:C.danger }}> *</span></FieldLabel>
          <FieldInput value={form.commission} onChange={v => set("commission",v)} type="number" placeholder="12" />
          <div style={{ fontSize:"0.75rem", color:C.muted, marginTop:"0.25rem" }}>Platform fee deducted from each sale</div>
        </div>
        <div>
          <FieldLabel>Initial Status</FieldLabel>
          <FieldSelect value={form.status} onChange={v => set("status",v)}>
            <option value="Pending">Pending — requires review</option>
            <option value="Active">Active — immediately live</option>
          </FieldSelect>
        </div>
      </div>

      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
        padding:"0.85rem 1rem", background:C.bg, borderRadius:"0.65rem", border:`1px solid ${C.border}`, marginBottom:"1rem" }}>
        <div>
          <div style={{ fontWeight:600, fontSize:"0.9rem", color:C.primary }}>Send Welcome Email</div>
          <div style={{ fontSize:"0.78rem", color:C.muted }}>Email seller with login link & onboarding guide</div>
        </div>
        <Toggle checked={form.sendWelcomeEmail} onChange={v => set("sendWelcomeEmail",v)} />
      </div>

      {/* Summary card */}
      <div style={{ background:`linear-gradient(135deg, rgba(0,217,255,0.06), rgba(0,217,255,0.02))`,
        border:`1.5px solid rgba(0,217,255,0.2)`, borderRadius:"0.85rem", padding:"1.25rem" }}>
        <div style={{ fontWeight:700, color:C.primary, marginBottom:"0.85rem", fontSize:"0.95rem" }}>📋 Summary</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.5rem 1.5rem", fontSize:"0.85rem" }}>
          {[
            ["Store Name",    form.storeName    || "—"],
            ["Contact",       form.contactName  || "—"],
            ["Email",         form.contactEmail || "—"],
            ["Phone",         form.contactPhone || "—"],
            ["City / State",  [form.city, form.state].filter(Boolean).join(", ") || "—"],
            ["Category",      form.storeCategory || "—"],
            ["GSTIN",         form.gstin         || "—"],
            ["Commission",    form.commission ? `${form.commission}%` : "—"],
            ["Status",        form.status],
          ].map(([label, val]) => (
            <div key={label} style={{ display:"flex", gap:"0.35rem" }}>
              <span style={{ color:C.muted, minWidth:90 }}>{label}:</span>
              <span style={{ fontWeight:600, color:C.primary }}>{val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>,
  ];

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(10,14,39,0.6)", zIndex:1000,
      display:"flex", alignItems:"flex-start", justifyContent:"center",
      paddingTop:30, paddingBottom:30, overflowY:"auto" }}>
      <div style={{ background:"white", borderRadius:"1.25rem", width:"100%", maxWidth:760,
        margin:"0 1rem", boxShadow:"0 24px 70px rgba(0,0,0,0.28)", animation:"slideIn 0.25s ease" }}>

        {/* Header */}
        <div style={{ padding:"1.3rem 1.6rem", borderBottom:`1px solid ${C.border}`,
          display:"flex", justifyContent:"space-between", alignItems:"center",
          background:`linear-gradient(135deg,${C.primary},#161d3f)`, borderRadius:"1.25rem 1.25rem 0 0" }}>
          <div>
            <h2 style={{ margin:0, fontSize:"1.2rem", fontWeight:700, color:"white" }}>➕ Add New Seller</h2>
            <div style={{ fontSize:"0.78rem", color:"rgba(255,255,255,0.55)", marginTop:"0.2rem" }}>
              Step {step + 1} of {SELLER_STEPS.length} — {SELLER_STEPS[step].label}
            </div>
          </div>
          <button onClick={onClose} style={{ background:"rgba(255,255,255,0.1)", border:"none", cursor:"pointer",
            width:36, height:36, borderRadius:"50%", color:"white", fontSize:"1.2rem", display:"flex", alignItems:"center", justifyContent:"center" }}>×</button>
        </div>

        {/* Step tabs */}
        <div style={{ display:"flex", borderBottom:`1px solid ${C.border}`, overflowX:"auto" }}>
          {SELLER_STEPS.map((s, i) => (
            <button key={s.id} onClick={() => setStep(i)}
              style={{ flex:"1 0 auto", padding:"0.75rem 0.5rem", border:"none", background:"transparent",
                fontFamily:"inherit", fontSize:"0.75rem", fontWeight: i === step ? 700 : 500, cursor:"pointer",
                color: i < step ? C.success : i === step ? C.accent : C.muted,
                borderBottom: i === step ? `2.5px solid ${C.accent}` : "2.5px solid transparent",
                transition:"all 150ms", display:"flex", flexDirection:"column", alignItems:"center", gap:"0.2rem" }}>
              <span style={{ fontSize:"1.1rem" }}>{i < step ? "✅" : s.icon}</span>
              {s.label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div style={{ padding:"1.6rem", overflowY:"auto", maxHeight:"calc(100vh - 280px)" }}>
          {stepContent[step]}
        </div>

        {/* Footer */}
        <div style={{ padding:"1rem 1.6rem", borderTop:`1px solid ${C.border}`,
          display:"flex", justifyContent:"space-between", alignItems:"center",
          background:C.bg, borderRadius:"0 0 1.25rem 1.25rem" }}>
          <SecondaryBtn onClick={prev} style={{ visibility: step === 0 ? "hidden" : "visible" }}>
            ← Previous
          </SecondaryBtn>
          <div style={{ display:"flex", gap:"0.75rem" }}>
            <SecondaryBtn onClick={onClose}>Cancel</SecondaryBtn>
            {step < SELLER_STEPS.length - 1
              ? <PrimaryBtn onClick={next}>Next →</PrimaryBtn>
              : <PrimaryBtn onClick={handleSubmit}>✅ Add Seller</PrimaryBtn>
            }
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SELLERS SECTION ─────────────────────────────────────────────────────────
function SellersSection({ showToast }) {
  const [sellers, setSellers] = useState(INIT_SELLERS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewSeller, setViewSeller] = useState(null);
  const PER_PAGE = 4;

  const filtered = useMemo(() => sellers.filter(s =>
    (s.name.toLowerCase().includes(search.toLowerCase()) ||
     s.contact.toLowerCase().includes(search.toLowerCase()) ||
     s.id.toLowerCase().includes(search.toLowerCase())) &&
    (statusFilter === "All" || s.status === statusFilter)
  ), [sellers, search, statusFilter]);

  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const rows = filtered.slice((page-1)*PER_PAGE, page*PER_PAGE);

  const toggleStatus = (id) => {
    setSellers(prev => prev.map(s => s.id === id
      ? { ...s, status: s.status === "Suspended" ? "Active" : "Suspended" }
      : s));
    showToast("Seller status updated");
  };

  const stats = [
    { label:"Total Sellers",  value:sellers.length,                        color:C.accent,  icon:"👥" },
    { label:"Active",         value:sellers.filter(s=>s.status==="Active").length,   color:C.success, icon:"✅" },
    { label:"Pending",        value:sellers.filter(s=>s.status==="Pending").length,  color:C.warning, icon:"⏳" },
    { label:"Suspended",      value:sellers.filter(s=>s.status==="Suspended").length,color:C.danger,  icon:"🚫" },
  ];

  return (
    <div>
      <PageHeader title="Sellers Management" breadcrumb="Sellers"
        action={<PrimaryBtn onClick={() => setShowAddModal(true)}>+ Add Seller</PrimaryBtn>} />

      {/* Stats row */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"1rem", marginBottom:"1.5rem" }}>
        {stats.map(s => (
          <div key={s.label} style={{ background:"white", border:`1px solid ${C.border}`, borderRadius:"0.85rem",
            padding:"1rem 1.25rem", display:"flex", alignItems:"center", gap:"0.85rem" }}>
            <div style={{ width:42, height:42, borderRadius:"0.65rem", background:`${s.color}18`,
              display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.2rem" }}>{s.icon}</div>
            <div>
              <div style={{ fontSize:"1.4rem", fontWeight:700, color:s.color, lineHeight:1 }}>{s.value}</div>
              <div style={{ fontSize:"0.75rem", color:C.muted, fontWeight:600 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display:"flex", gap:"0.75rem", marginBottom:"1.4rem", flexWrap:"wrap" }}>
        <SearchInput value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Search sellers by name, contact, ID…" />
        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
          style={{ border:`1px solid ${C.border}`, borderRadius:"0.5rem", padding:"0.42rem 0.85rem",
            fontFamily:"inherit", fontSize:"0.88rem", background:"white", cursor:"pointer", outline:"none" }}>
          {["All","Active","Pending","Suspended"].map(o => <option key={o}>{o}</option>)}
        </select>
        {(search || statusFilter !== "All") &&
          <SecondaryBtn onClick={() => { setSearch(""); setStatusFilter("All"); setPage(1); }}>↺ Reset</SecondaryBtn>}
      </div>

      <Card style={{ marginBottom:0 }}>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead><tr>{["ID","Business Name","Contact Person","Revenue","Products","Commission","Rating","Status","Actions"].map(h => <TH key={h}>{h}</TH>)}</tr></thead>
            <tbody>
              {rows.length === 0
                ? <tr><td colSpan={9} style={{ textAlign:"center", padding:"3rem", color:C.muted }}>No sellers match your filters</td></tr>
                : rows.map(s => (
                  <TR key={s.id}>
                    <TD style={{ fontFamily:"monospace", fontSize:"0.82rem" }}>{s.id}</TD>
                    <TD style={{ fontWeight:600 }}>{s.name}</TD>
                    <TD>{s.contact}</TD>
                    <TD style={{ fontWeight:600 }}>{s.revenue}</TD>
                    <TD>{s.products}</TD>
                    <TD style={{ fontWeight:600, color:C.accent }}>{s.commission}%</TD>
                    <TD>⭐ {s.rating}</TD>
                    <TD>
                      <span style={{ ...sellerStatusStyle[s.status], padding:"0.28rem 0.7rem", borderRadius:20,
                        fontSize:"0.7rem", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.05em" }}>{s.status}</span>
                    </TD>
                    <TD>
                      <div style={{ display:"flex", gap:"0.35rem" }}>
                        <ActionBtn icon="👁️" title="View details" onClick={() => setViewSeller(s)} />
                        <ActionBtn icon="✏️" title="Edit seller"  onClick={() => showToast(`Editing ${s.name}`)} />
                        <ActionBtn icon={s.status === "Suspended" ? "✅" : "🚫"} variant="danger"
                          title={s.status === "Suspended" ? "Re-activate" : "Suspend"} onClick={() => toggleStatus(s.id)} />
                      </div>
                    </TD>
                  </TR>
                ))}
            </tbody>
          </table>
        </div>
        <Pagination current={page} total={pages} onChange={setPage} />
      </Card>

      {showAddModal && (
        <AddSellerModal
          onClose={() => setShowAddModal(false)}
          onSave={s => setSellers(prev => [s, ...prev])}
          showToast={showToast} />
      )}

      {/* Quick view drawer */}
      {viewSeller && (
        <div style={{ position:"fixed", inset:0, background:"rgba(10,14,39,0.5)", zIndex:1000,
          display:"flex", justifyContent:"flex-end" }} onClick={() => setViewSeller(null)}>
          <div onClick={e => e.stopPropagation()} style={{ width:"100%", maxWidth:380, background:"white",
            boxShadow:"-8px 0 40px rgba(0,0,0,0.15)", overflowY:"auto", animation:"slideIn 0.2s ease" }}>
            <div style={{ padding:"1.25rem 1.4rem", borderBottom:`1px solid ${C.border}`,
              display:"flex", justifyContent:"space-between", alignItems:"center",
              background:`linear-gradient(135deg,${C.primary},#161d3f)` }}>
              <div>
                <div style={{ fontWeight:700, fontSize:"1rem", color:"white" }}>{viewSeller.name}</div>
                <div style={{ fontSize:"0.75rem", color:"rgba(255,255,255,0.55)", marginTop:"0.15rem" }}>{viewSeller.id}</div>
              </div>
              <button onClick={() => setViewSeller(null)} style={{ background:"rgba(255,255,255,0.1)", border:"none",
                cursor:"pointer", width:32, height:32, borderRadius:"50%", color:"white", fontSize:"1.1rem" }}>×</button>
            </div>
            <div style={{ padding:"1.25rem" }}>
              <div style={{ display:"flex", justifyContent:"center", marginBottom:"1.25rem" }}>
                <div style={{ width:72, height:72, borderRadius:"50%", background:`linear-gradient(135deg,${C.accent},${C.accentDk})`,
                  display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.8rem", color:"white", fontWeight:700 }}>
                  {viewSeller.name.charAt(0)}
                </div>
              </div>
              <div style={{ textAlign:"center", marginBottom:"1.25rem" }}>
                <div style={{ ...sellerStatusStyle[viewSeller.status], display:"inline-block",
                  padding:"0.3rem 0.85rem", borderRadius:20, fontSize:"0.72rem", fontWeight:700, textTransform:"uppercase" }}>{viewSeller.status}</div>
              </div>
              {[
                { label:"Contact Person", value:viewSeller.contact },
                { label:"Revenue (Total)", value:viewSeller.revenue },
                { label:"Products Listed", value:viewSeller.products },
                { label:"Commission Rate", value:`${viewSeller.commission}%` },
                { label:"Rating", value:`⭐ ${viewSeller.rating}` },
                ...(viewSeller.email ? [{ label:"Email", value:viewSeller.email }] : []),
                ...(viewSeller.phone ? [{ label:"Phone", value:viewSeller.phone }] : []),
                ...(viewSeller.city  ? [{ label:"Location", value:[viewSeller.city, viewSeller.state].filter(Boolean).join(", ") }] : []),
                ...(viewSeller.gstin ? [{ label:"GSTIN", value:viewSeller.gstin }] : []),
              ].map(r => (
                <div key={r.label} style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
                  padding:"0.6rem 0", borderBottom:`1px solid ${C.border}`, fontSize:"0.87rem" }}>
                  <span style={{ color:C.muted, fontWeight:500 }}>{r.label}</span>
                  <span style={{ fontWeight:600, color:C.primary }}>{r.value}</span>
                </div>
              ))}
              <div style={{ display:"flex", gap:"0.6rem", marginTop:"1.25rem" }}>
                <PrimaryBtn small onClick={() => showToast(`Editing ${viewSeller.name}`)}>✏️ Edit</PrimaryBtn>
                <DangerBtn small onClick={() => { toggleStatus(viewSeller.id); setViewSeller(null); }}>
                  {viewSeller.status === "Suspended" ? "✅ Reactivate" : "🚫 Suspend"}
                </DangerBtn>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


// ─── PRODUCTS ─────────────────────────────────────────────────────────────────
const EMPTY_PRODUCT = {
  name:"", sku:"", description:"", category:"", subCategory:"", brand:"",
  mrp:"", sellingPrice:"", stock:"", sizes:[], colors:"",
  weight:"", length:"", width:"", vendor:"", images:[],
};

function AddProductModal({ onClose, onSave, showToast }) {
  const [form, setForm] = useState(EMPTY_PRODUCT);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef();

  const set = (key, val) => setForm(p => ({ ...p, [key]:val }));
  const toggleSize = (s) => set("sizes", form.sizes.includes(s) ? form.sizes.filter(x => x !== s) : [...form.sizes, s]);
  const handleImages = (files) => {
    const previews = Array.from(files).slice(0, 10 - form.images.length).map(f => URL.createObjectURL(f));
    set("images", [...form.images, ...previews]);
  };
  const handlePublish = () => {
    if (!form.name || !form.sku || !form.mrp || !form.sellingPrice || !form.vendor) { showToast("Please fill all required fields"); return; }
    onSave({ ...form, id:`#PRD-${Date.now()}`, price:`₹${form.sellingPrice}`, status:"Active" });
    showToast(`Product "${form.name}" published to ${form.vendor}!`);
    onClose();
  };
  const handleDraft = () => {
    if (!form.name || !form.vendor) { showToast("Product name and vendor are required"); return; }
    onSave({ ...form, id:`#PRD-${Date.now()}`, price:`₹${form.sellingPrice||0}`, status:"Draft" });
    showToast(`Draft saved for "${form.name}"`);
    onClose();
  };
  const subs = form.category ? (SUB_CATEGORIES[form.category] || []) : [];

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(10,14,39,0.55)", zIndex:1000,
      display:"flex", alignItems:"flex-start", justifyContent:"center", paddingTop:40, paddingBottom:40, overflowY:"auto" }}>
      <div style={{ background:"white", borderRadius:"1.2rem", width:"100%", maxWidth:740,
        margin:"0 1rem", boxShadow:"0 20px 60px rgba(0,0,0,0.25)", animation:"slideIn 0.25s ease" }}>
        <div style={{ padding:"1.3rem 1.6rem", borderBottom:`1px solid ${C.border}`,
          display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <h2 style={{ margin:0, fontSize:"1.25rem", fontWeight:700, color:C.primary }}>Add New Product</h2>
          <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer",
            fontSize:"1.4rem", color:C.muted, lineHeight:1, padding:4 }}>×</button>
        </div>
        <div style={{ padding:"1.6rem", overflowY:"auto", maxHeight:"calc(100vh - 200px)" }}>
          <div style={{ marginBottom:"1.8rem" }}>
            <FieldLabel>Product Images</FieldLabel>
            <div onDragOver={e => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)}
              onDrop={e => { e.preventDefault(); setDragOver(false); handleImages(e.dataTransfer.files); }}
              onClick={() => fileRef.current.click()}
              style={{ border:`2px dashed ${dragOver ? C.accent : C.border}`, borderRadius:"0.75rem",
                padding:"2rem", textAlign:"center", cursor:"pointer", background: dragOver ? "rgba(0,217,255,0.04)" : C.bg,
                transition:"all 200ms", marginBottom: form.images.length ? "0.85rem" : 0 }}>
              <div style={{ fontSize:"2rem", marginBottom:"0.5rem", opacity:0.5 }}>🌁</div>
              <div style={{ fontWeight:600, color:"#364152", marginBottom:"0.25rem" }}>Click to upload or drag & drop</div>
              <div style={{ fontSize:"0.8rem", color:C.muted }}>PNG, JPG up to 5MB · Max 10 images</div>
              <input ref={fileRef} type="file" accept="image/*" multiple style={{ display:"none" }}
                onChange={e => handleImages(e.target.files)} />
            </div>
          </div>

          <div style={{ background:"rgba(0,217,255,0.05)", border:`2px solid rgba(0,217,255,0.2)`,
            borderRadius:"0.75rem", padding:"1rem 1.25rem", marginBottom:"1.8rem" }}>
            <FieldLabel required>Assign to Vendor / Seller</FieldLabel>
            <FieldSelect value={form.vendor} onChange={v => set("vendor", v)}>
              <option value="">— Select a Vendor —</option>
              {INIT_SELLERS.filter(s => s.status === "Active").map(s => (
                <option key={s.id} value={s.name}>{s.name} ({s.contact})</option>
              ))}
            </FieldSelect>
          </div>

          <div style={{ marginBottom:"1.5rem" }}>
            <h3 style={{ fontSize:"1rem", fontWeight:700, color:C.primary, marginBottom:"1rem" }}>Basic Information</h3>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem", marginBottom:"1rem" }}>
              <div><FieldLabel required>Product Name</FieldLabel><FieldInput value={form.name} onChange={v => set("name",v)} placeholder="e.g. Designer Silk Kurti" /></div>
              <div><FieldLabel required>SKU</FieldLabel><FieldInput value={form.sku} onChange={v => set("sku",v)} placeholder="e.g. WM-KUR-001" /></div>
            </div>
            <div style={{ marginBottom:"1rem" }}>
              <FieldLabel required>Description</FieldLabel>
              <textarea value={form.description} onChange={e => set("description",e.target.value)} placeholder="Detailed product description..."
                style={{ width:"100%", padding:"0.6rem 0.85rem", border:`2px solid ${C.border}`,
                  borderRadius:"0.5rem", fontFamily:"inherit", fontSize:"0.9rem", outline:"none",
                  resize:"vertical", minHeight:90, boxSizing:"border-box", transition:"border-color 200ms" }}
                onFocus={e => e.target.style.borderColor=C.accent}
                onBlur={e => e.target.style.borderColor=C.border} />
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"1rem" }}>
              <div><FieldLabel required>Category</FieldLabel>
                <FieldSelect value={form.category} onChange={v => { set("category",v); set("subCategory",""); }}>
                  <option value="">Select Category</option>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </FieldSelect>
              </div>
              <div><FieldLabel>Sub-Category</FieldLabel>
                <FieldSelect value={form.subCategory} onChange={v => set("subCategory",v)}>
                  <option value="">Select Sub-Category</option>
                  {subs.map(s => <option key={s}>{s}</option>)}
                </FieldSelect>
              </div>
              <div><FieldLabel>Brand</FieldLabel><FieldInput value={form.brand} onChange={v => set("brand",v)} placeholder="e.g. Style Store" /></div>
            </div>
          </div>

          <div style={{ marginBottom:"1.5rem" }}>
            <h3 style={{ fontSize:"1rem", fontWeight:700, color:C.primary, marginBottom:"1rem" }}>Pricing & Inventory</h3>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"1rem" }}>
              <div><FieldLabel required>MRP</FieldLabel><FieldInput value={form.mrp} onChange={v => set("mrp",v)} placeholder="2999" type="number" /></div>
              <div><FieldLabel required>Selling Price</FieldLabel><FieldInput value={form.sellingPrice} onChange={v => set("sellingPrice",v)} placeholder="1299" type="number" /></div>
              <div><FieldLabel required>Stock Quantity</FieldLabel><FieldInput value={form.stock} onChange={v => set("stock",v)} placeholder="50" type="number" /></div>
            </div>
          </div>
        </div>
        <div style={{ padding:"1.1rem 1.6rem", borderTop:`1px solid ${C.border}`,
          display:"flex", justifyContent:"flex-end", gap:"0.75rem", background:C.bg }}>
          <SecondaryBtn onClick={onClose}>Cancel</SecondaryBtn>
          <SecondaryBtn onClick={handleDraft}>💾 Save as Draft</SecondaryBtn>
          <PrimaryBtn onClick={handlePublish}>✓ Publish Product</PrimaryBtn>
        </div>
      </div>
    </div>
  );
}

function ProductsSection({ showToast }) {
  const [products, setProducts] = useState(INIT_PRODUCTS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const PER_PAGE = 5;

  const filtered = useMemo(() => products.filter(p =>
    (p.name.toLowerCase().includes(search.toLowerCase()) ||
     p.sku.toLowerCase().includes(search.toLowerCase()) ||
     p.vendor.toLowerCase().includes(search.toLowerCase())) &&
    (statusFilter === "All" || p.status === statusFilter)
  ), [products, search, statusFilter]);

  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const rows = filtered.slice((page-1)*PER_PAGE, page*PER_PAGE);

  return (
    <div>
      <PageHeader title="Product Management" breadcrumb="Products"
        action={<PrimaryBtn onClick={() => setShowModal(true)}>+ Add Product</PrimaryBtn>} />
      <div style={{ display:"flex", gap:"0.75rem", marginBottom:"1.4rem", flexWrap:"wrap" }}>
        <SearchInput value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Search by name, SKU or vendor…" />
        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
          style={{ border:`1px solid ${C.border}`, borderRadius:"0.5rem", padding:"0.42rem 0.85rem",
            fontFamily:"inherit", fontSize:"0.88rem", background:"white", cursor:"pointer", outline:"none" }}>
          {["All","Active","Inactive","Draft"].map(o => <option key={o}>{o}</option>)}
        </select>
      </div>
      <Card style={{ marginBottom:0 }}>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead><tr>{["ID","Product","SKU","Category","Vendor","Price","Stock","Status","Actions"].map(h => <TH key={h}>{h}</TH>)}</tr></thead>
            <tbody>
              {rows.length === 0
                ? <tr><td colSpan={9} style={{ textAlign:"center", padding:"3rem", color:C.muted }}>No products match your filters</td></tr>
                : rows.map(p => (
                  <TR key={p.id}>
                    <TD style={{ fontFamily:"monospace", fontSize:"0.82rem" }}>{p.id}</TD>
                    <TD style={{ fontWeight:600, maxWidth:160 }}>{p.name}</TD>
                    <TD style={{ fontFamily:"monospace", fontSize:"0.82rem", color:C.muted }}>{p.sku}</TD>
                    <TD>{p.category}</TD>
                    <TD style={{ fontSize:"0.82rem", color:C.muted }}>{p.vendor}</TD>
                    <TD style={{ fontWeight:600 }}>{p.price}</TD>
                    <TD><span style={{ color: p.stock === 0 ? C.danger : p.stock < 10 ? C.warning : C.success, fontWeight:600 }}>{p.stock === 0 ? "Out" : p.stock}</span></TD>
                    <TD><Badge type={p.status === "Active" ? "success" : p.status === "Draft" ? "info" : "neutral"}>{p.status}</Badge></TD>
                    <TD>
                      <div style={{ display:"flex", gap:"0.35rem" }}>
                        <ActionBtn icon="✏️" title="Edit" onClick={() => showToast(`Editing ${p.name}`)} />
                        <ActionBtn icon="🗑️" title="Delete" variant="danger"
                          onClick={() => { setProducts(prev => prev.filter(x => x.id !== p.id)); showToast(`${p.name} deleted`); }} />
                      </div>
                    </TD>
                  </TR>
                ))}
            </tbody>
          </table>
        </div>
        <Pagination current={page} total={pages} onChange={setPage} />
      </Card>
      {showModal && <AddProductModal onClose={() => setShowModal(false)} onSave={p => setProducts(prev => [p,...prev])} showToast={showToast} />}
    </div>
  );
}

// ─── ORDERS ──────────────────────────────────────────────────────────────────
function OrdersSection({ showToast }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);
  const PER_PAGE = 4;

  const filtered = useMemo(() => INIT_ORDERS.filter(o =>
    (o.id.toLowerCase().includes(search.toLowerCase()) ||
     o.customer.toLowerCase().includes(search.toLowerCase())) &&
    (statusFilter === "All" || o.status === statusFilter)
  ), [search, statusFilter]);

  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const rows = filtered.slice((page-1)*PER_PAGE, page*PER_PAGE);

  return (
    <div>
      <PageHeader title="Order Management" breadcrumb="Orders"
        action={<SecondaryBtn onClick={() => showToast("Exporting orders as CSV…")}>📥 Export Orders</SecondaryBtn>} />
      <div style={{ display:"flex", gap:"0.75rem", marginBottom:"1.4rem", flexWrap:"wrap" }}>
        <SearchInput value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Search by Order ID or customer…" />
        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
          style={{ border:`1px solid ${C.border}`, borderRadius:"0.5rem", padding:"0.42rem 0.85rem",
            fontFamily:"inherit", fontSize:"0.88rem", background:"white", cursor:"pointer", outline:"none" }}>
          {["All","Delivered","Shipping","Processing","Cancelled"].map(o => <option key={o}>{o}</option>)}
        </select>
      </div>
      <Card style={{ marginBottom:0 }}>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead><tr>{["Order ID","Customer","Amount","Status","Actions"].map(h => <TH key={h}>{h}</TH>)}</tr></thead>
            <tbody>
              {rows.map(o => (
                <TR key={o.id}>
                  <TD style={{ fontFamily:"monospace", fontSize:"0.82rem" }}>{o.id}</TD>
                  <TD>{o.customer}</TD>
                  <TD style={{ fontWeight:600 }}>{o.amount}</TD>
                  <TD><Badge type={o.statusType}>{o.status}</Badge></TD>
                  <TD>
                    <div style={{ display:"flex", gap:"0.35rem" }}>
                      <ActionBtn icon="👁️" title="View order"  onClick={() => showToast(`Viewing order ${o.id}`)} />
                      <ActionBtn icon="✏️" title="Edit order"  onClick={() => showToast(`Editing order ${o.id}`)} />
                      <ActionBtn icon="🖨️" title="Print label" onClick={() => showToast(`Printing label for ${o.id}`)} />
                    </div>
                  </TD>
                </TR>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination current={page} total={pages} onChange={setPage} />
      </Card>
    </div>
  );
}


// ─── CUSTOMERS ───────────────────────────────────────────────────────────────
function CustomersSection({ showToast }) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const PER_PAGE = 4;
  const filtered = useMemo(() => INIT_CUSTOMERS.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase())
  ), [search]);
  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const rows = filtered.slice((page-1)*PER_PAGE, page*PER_PAGE);
  return (
    <div>
      <PageHeader title="Customer Management" breadcrumb="Customers" />
      <div style={{ display:"flex", gap:"0.75rem", marginBottom:"1.4rem" }}>
        <SearchInput value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Search by name or email…" />
      </div>
      <Card style={{ marginBottom:0 }}>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead><tr>{["ID","Name","Email","Orders","Total Spent","Joined","Status","Actions"].map(h => <TH key={h}>{h}</TH>)}</tr></thead>
            <tbody>
              {rows.map(c => (
                <TR key={c.id}>
                  <TD style={{ fontFamily:"monospace", fontSize:"0.82rem" }}>{c.id}</TD>
                  <TD style={{ fontWeight:600 }}>{c.name}</TD>
                  <TD style={{ color:C.muted, fontSize:"0.85rem" }}>{c.email}</TD>
                  <TD>{c.orders}</TD>
                  <TD style={{ fontWeight:600 }}>{c.spent}</TD>
                  <TD style={{ color:C.muted }}>{c.joined}</TD>
                  <TD><Badge type={c.status === "Active" ? "success" : "neutral"}>{c.status}</Badge></TD>
                  <TD><div style={{ display:"flex", gap:"0.35rem" }}>
                    <ActionBtn icon="👁️" title="View" onClick={() => showToast(`Viewing ${c.name}`)} />
                    <ActionBtn icon="✉️" title="Email" onClick={() => showToast(`Emailing ${c.name}`)} />
                  </div></TD>
                </TR>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination current={page} total={pages} onChange={setPage} />
      </Card>
    </div>
  );
}

// ─── ACTIVITY LOG ─────────────────────────────────────────────────────────────
function ActivitySection() {
  return (
    <div>
      <PageHeader title="Activity Log" breadcrumb="Activity Log" />
      <Card style={{ marginBottom:0 }}>
        {ACTIVITY_LOG.map((a,i) => (
          <div key={i} style={{ display:"flex", gap:"1rem", padding:"1rem 0",
            borderBottom: i < ACTIVITY_LOG.length-1 ? `1px solid ${C.border}` : "none" }}>
            <div style={{ width:40, height:40, borderRadius:"50%", display:"flex", alignItems:"center",
              justifyContent:"center", background:a.bg, flexShrink:0, fontSize:"1.1rem" }}>{a.icon}</div>
            <div>
              <div style={{ color:"#364152", marginBottom:"0.15rem", fontSize:"0.9rem" }}>{a.text}</div>
              <div style={{ fontSize:"0.78rem", color:C.muted }}>{a.time}</div>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}


// ══════════════════════════════════════════════════════════════════════════════
// ─── WOOCOMMERCE-STYLE SHIPPING ZONES ─────────────────────────────────────────
// ══════════════════════════════════════════════════════════════════════════════
const INIT_SHIPPING_ZONES = [
  { id:1, name:"Domestic — All India", regions:["India"], methods:[
    { id:"flat_rate",    label:"Flat Rate",        cost:"₹49",  enabled:true,  taxable:true  },
    { id:"free_ship",   label:"Free Shipping",    cost:"₹0",   enabled:true,  minOrder:"₹499" },
    { id:"local_pickup",label:"Local Pickup",     cost:"₹0",   enabled:false  },
  ]},
  { id:2, name:"Express — Metro Cities", regions:["Mumbai","Delhi","Bangalore","Hyderabad","Chennai","Kolkata"], methods:[
    { id:"express",     label:"Express Delivery", cost:"₹99",  enabled:true,  delivery:"1-2 days" },
    { id:"same_day",    label:"Same Day Delivery",cost:"₹199", enabled:true,  delivery:"Same day" },
  ]},
  { id:3, name:"International", regions:["USA","UK","UAE","Singapore","Australia"], methods:[
    { id:"intl_std",    label:"Standard International", cost:"₹799", enabled:true, delivery:"10-15 days" },
    { id:"intl_exp",    label:"Express International",  cost:"₹1499",enabled:false,delivery:"5-7 days" },
  ]},
];

function ShippingZonesSection({ showToast }) {
  const [zones, setZones] = useState(INIT_SHIPPING_ZONES);
  const [selectedZone, setSelectedZone] = useState(null);
  const [editingMethod, setEditingMethod] = useState(null);
  const [addingZone, setAddingZone] = useState(false);
  const [newZoneName, setNewZoneName] = useState("");
  const [activeTab, setActiveTab] = useState("zones"); // zones | classes | settings

  const toggleMethod = (zoneId, methodId) => {
    setZones(prev => prev.map(z => z.id === zoneId ? {
      ...z, methods: z.methods.map(m => m.id === methodId ? { ...m, enabled:!m.enabled } : m)
    } : z));
    showToast("Shipping method updated");
  };

  const deleteZone = (zoneId) => {
    setZones(prev => prev.filter(z => z.id !== zoneId));
    if (selectedZone?.id === zoneId) setSelectedZone(null);
    showToast("Shipping zone deleted");
  };

  const addZone = () => {
    if (!newZoneName.trim()) return;
    const z = { id:Date.now(), name:newZoneName, regions:[], methods:[] };
    setZones(prev => [...prev, z]);
    setNewZoneName("");
    setAddingZone(false);
    showToast(`Zone "${newZoneName}" created`);
  };

  const TABS = ["zones","classes","settings"];
  const TAB_LABELS = { zones:"Shipping Zones", classes:"Shipping Classes", settings:"Shipping Options" };

  return (
    <div>
      <PageHeader title="Shipping" breadcrumb="Shipping Zones"
        action={<PrimaryBtn onClick={() => setAddingZone(true)}>+ Add Shipping Zone</PrimaryBtn>} />

      {/* Tab Bar */}
      <div style={{ display:"flex", gap:"0", marginBottom:"1.5rem", background:"white",
        border:`1px solid ${C.border}`, borderRadius:"0.75rem", padding:"0.35rem", width:"fit-content" }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setActiveTab(t)} style={{
            padding:"0.5rem 1.2rem", borderRadius:"0.5rem", border:"none", cursor:"pointer",
            fontFamily:"inherit", fontSize:"0.88rem", fontWeight:600, transition:"all 180ms",
            background: activeTab === t ? C.primary : "transparent",
            color: activeTab === t ? "white" : C.muted,
          }}>{TAB_LABELS[t]}</button>
        ))}
      </div>

      {activeTab === "zones" && (
        <div style={{ display:"grid", gridTemplateColumns: selectedZone ? "320px 1fr" : "1fr", gap:"1.5rem" }}>
          {/* Zone List */}
          <div>
            {addingZone && (
              <Card style={{ marginBottom:"1rem" }}>
                <div style={{ display:"flex", flexDirection:"column", gap:"0.75rem" }}>
                  <FieldLabel required>Zone Name</FieldLabel>
                  <FieldInput value={newZoneName} onChange={setNewZoneName} placeholder="e.g. North India" />
                  <div style={{ display:"flex", gap:"0.5rem" }}>
                    <PrimaryBtn small onClick={addZone}>Create Zone</PrimaryBtn>
                    <SecondaryBtn small onClick={() => setAddingZone(false)}>Cancel</SecondaryBtn>
                  </div>
                </div>
              </Card>
            )}
            {zones.map(zone => (
              <div key={zone.id} onClick={() => setSelectedZone(zone)}
                style={{ background:"white", border:`2px solid ${selectedZone?.id === zone.id ? C.accent : C.border}`,
                  borderRadius:"0.75rem", padding:"1rem 1.25rem", marginBottom:"0.75rem", cursor:"pointer",
                  transition:"all 180ms", boxShadow: selectedZone?.id === zone.id ? `0 0 0 3px rgba(0,217,255,0.1)` : "none" }}
                onMouseOver={e => { if(selectedZone?.id !== zone.id) e.currentTarget.style.borderColor="#AAC7D1"; }}
                onMouseOut={e => { if(selectedZone?.id !== zone.id) e.currentTarget.style.borderColor=C.border; }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                  <div>
                    <div style={{ fontWeight:700, color:C.primary, marginBottom:"0.25rem" }}>🗺️ {zone.name}</div>
                    <div style={{ fontSize:"0.8rem", color:C.muted }}>{zone.regions.length} region{zone.regions.length !== 1 ? "s" : ""} · {zone.methods.length} method{zone.methods.length !== 1 ? "s" : ""}</div>
                    <div style={{ display:"flex", gap:"0.35rem", marginTop:"0.5rem", flexWrap:"wrap" }}>
                      {zone.methods.filter(m => m.enabled).map(m => (
                        <span key={m.id} style={{ background:"rgba(0,217,255,0.1)", color:C.accentDk,
                          fontSize:"0.7rem", fontWeight:600, padding:"0.15rem 0.5rem", borderRadius:10 }}>{m.label}</span>
                      ))}
                    </div>
                  </div>
                  <ActionBtn icon="🗑️" variant="danger" title="Delete zone"
                    onClick={e => { e.stopPropagation(); deleteZone(zone.id); }} />
                </div>
              </div>
            ))}
          </div>

          {/* Zone Detail Panel */}
          {selectedZone && (() => {
            const z = zones.find(x => x.id === selectedZone.id);
            return (
              <div>
                <Card header={
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", width:"100%" }}>
                    <span style={{ fontWeight:700, fontSize:"1rem", color:C.primary }}>🗺️ {z.name}</span>
                    <div style={{ display:"flex", gap:"0.5rem" }}>
                      <SecondaryBtn small onClick={() => showToast("Edit zone name")}>✏️ Edit</SecondaryBtn>
                      <button onClick={() => setSelectedZone(null)} style={{ background:"none", border:"none",
                        cursor:"pointer", color:C.muted, fontSize:"1.2rem" }}>×</button>
                    </div>
                  </div>
                }>
                  <div style={{ marginBottom:"1.25rem" }}>
                    <div style={{ fontWeight:600, color:"#364152", fontSize:"0.88rem", marginBottom:"0.5rem" }}>Zone Regions</div>
                    <div style={{ display:"flex", gap:"0.4rem", flexWrap:"wrap" }}>
                      {z.regions.map(r => (
                        <span key={r} style={{ background:C.bg, border:`1px solid ${C.border}`,
                          padding:"0.28rem 0.7rem", borderRadius:20, fontSize:"0.8rem", fontWeight:600, display:"flex", alignItems:"center", gap:"0.3rem" }}>
                          📍 {r}
                          <button onClick={() => setZones(prev => prev.map(zn => zn.id === z.id
                            ? { ...zn, regions: zn.regions.filter(x => x !== r) } : zn))}
                            style={{ background:"none", border:"none", cursor:"pointer", color:C.danger, fontSize:"0.8rem", lineHeight:1 }}>×</button>
                        </span>
                      ))}
                      <button onClick={() => {
                        const r = prompt("Enter region name (city, state, or country):");
                        if (r?.trim()) setZones(prev => prev.map(zn => zn.id === z.id
                          ? { ...zn, regions:[...zn.regions, r.trim()] } : zn));
                      }} style={{ background:"none", border:`1.5px dashed ${C.border}`, cursor:"pointer",
                        padding:"0.28rem 0.7rem", borderRadius:20, fontSize:"0.8rem", color:C.muted, fontFamily:"inherit" }}>
                        + Add Region
                      </button>
                    </div>
                  </div>

                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"0.75rem" }}>
                    <div style={{ fontWeight:600, color:"#364152", fontSize:"0.88rem" }}>Shipping Methods</div>
                    <SecondaryBtn small onClick={() => showToast("Add shipping method")}>+ Add Method</SecondaryBtn>
                  </div>

                  {z.methods.map(method => (
                    <div key={method.id} style={{ border:`1px solid ${C.border}`, borderRadius:"0.65rem",
                      padding:"1rem", marginBottom:"0.6rem",
                      background: method.enabled ? "white" : C.bg,
                      opacity: method.enabled ? 1 : 0.7 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"0.5rem" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:"0.6rem" }}>
                          <Toggle checked={method.enabled} onChange={() => toggleMethod(z.id, method.id)} />
                          <span style={{ fontWeight:700, color:C.primary }}>{method.label}</span>
                          {!method.enabled && <Badge type="neutral">Disabled</Badge>}
                        </div>
                        <div style={{ display:"flex", alignItems:"center", gap:"0.5rem" }}>
                          <span style={{ fontWeight:700, color:C.accent, fontSize:"1.05rem" }}>{method.cost}</span>
                          <ActionBtn icon="⚙️" title="Configure" onClick={() => setEditingMethod({ zoneId:z.id, method:{ ...method } })} />
                        </div>
                      </div>
                      <div style={{ display:"flex", gap:"1rem", fontSize:"0.8rem", color:C.muted }}>
                        {method.minOrder && <span>Min. order: {method.minOrder}</span>}
                        {method.delivery && <span>⏱️ {method.delivery}</span>}
                        {method.taxable && <span>📋 Taxable</span>}
                      </div>
                    </div>
                  ))}
                </Card>
              </div>
            );
          })()}
        </div>
      )}

      {activeTab === "classes" && (
        <Card header={<span style={{ fontWeight:700, color:C.primary }}>📦 Shipping Classes</span>}>
          <InfoBox type="info">Shipping classes are used to group products of similar type, and can be used by some shipping methods to provide different rates to different products.</InfoBox>
          {[
            { name:"Heavy Items", slug:"heavy", desc:"Products over 5kg", count:12 },
            { name:"Fragile",     slug:"fragile", desc:"Handle with care items", count:8 },
            { name:"Bulky",       slug:"bulky",  desc:"Oversized products", count:5 },
          ].map(cls => (
            <div key={cls.slug} style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
              padding:"0.85rem 1rem", border:`1px solid ${C.border}`, borderRadius:"0.5rem", marginBottom:"0.6rem" }}>
              <div>
                <div style={{ fontWeight:600, color:C.primary }}>{cls.name}</div>
                <div style={{ fontSize:"0.8rem", color:C.muted }}>{cls.desc} · {cls.count} products</div>
              </div>
              <div style={{ display:"flex", gap:"0.4rem" }}>
                <ActionBtn icon="✏️" title="Edit" onClick={() => showToast(`Editing ${cls.name}`)} />
                <ActionBtn icon="🗑️" variant="danger" title="Delete" onClick={() => showToast(`Deleted ${cls.name}`)} />
              </div>
            </div>
          ))}
          <PrimaryBtn small onClick={() => showToast("Add shipping class")}>+ Add Shipping Class</PrimaryBtn>
        </Card>
      )}

      {activeTab === "settings" && (
        <Card header={<span style={{ fontWeight:700, color:C.primary }}>⚙️ Shipping Options</span>}>
          <ShippingOptionsSettings showToast={showToast} />
        </Card>
      )}

      {editingMethod && (
        <MethodEditModal method={editingMethod.method} zoneId={editingMethod.zoneId}
          onSave={(zId, updated) => {
            setZones(prev => prev.map(z => z.id === zId ? { ...z, methods: z.methods.map(m => m.id === updated.id ? updated : m) } : z));
            setEditingMethod(null);
            showToast("Shipping method saved");
          }}
          onClose={() => setEditingMethod(null)} />
      )}
    </div>
  );
}

function ShippingOptionsSettings({ showToast }) {
  const [opts, setOpts] = useState({
    calcMethod: "per_order",
    hideIfFree: true,
    debugMode: false,
    warehousePincode: "500001",
    maxWeight: "20",
  });
  return (
    <div>
      <div style={{ marginBottom:"1rem" }}>
        <FieldLabel>Shipping Calculations</FieldLabel>
        <FieldSelect value={opts.calcMethod} onChange={v => setOpts(p => ({ ...p, calcMethod:v }))} style={{ maxWidth:300 }}>
          <option value="per_order">Per order — charge once per order</option>
          <option value="per_item">Per item — charge for each item</option>
          <option value="per_class">Per class — charge per shipping class</option>
        </FieldSelect>
      </div>
      <div style={{ display:"grid", gap:"0.75rem", marginBottom:"1.25rem" }}>
        {[
          { key:"hideIfFree", label:"Hide shipping cost if free shipping available", desc:"Only show free shipping option when available" },
          { key:"debugMode",  label:"Enable shipping debug mode",                    desc:"Show shipping debug info on cart page" },
        ].map(t => (
          <div key={t.key} style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
            padding:"0.75rem 1rem", background:C.bg, borderRadius:"0.5rem", border:`1px solid ${C.border}` }}>
            <div>
              <div style={{ fontWeight:600, fontSize:"0.9rem" }}>{t.label}</div>
              <div style={{ fontSize:"0.8rem", color:C.muted }}>{t.desc}</div>
            </div>
            <Toggle checked={opts[t.key]} onChange={v => setOpts(p => ({ ...p, [t.key]:v }))} />
          </div>
        ))}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem" }}>
        <div><FieldLabel>Warehouse / Origin Pincode</FieldLabel>
          <FieldInput value={opts.warehousePincode} onChange={v => setOpts(p => ({ ...p, warehousePincode:v }))} placeholder="500001" /></div>
        <div><FieldLabel>Max Package Weight (kg)</FieldLabel>
          <FieldInput value={opts.maxWeight} onChange={v => setOpts(p => ({ ...p, maxWeight:v }))} type="number" placeholder="20" /></div>
      </div>
      <div style={{ marginTop:"1.25rem" }}>
        <PrimaryBtn onClick={() => showToast("Shipping settings saved!")}>💾 Save Settings</PrimaryBtn>
      </div>
    </div>
  );
}

function MethodEditModal({ method, zoneId, onSave, onClose }) {
  const [m, setM] = useState({ ...method });
  const set = (k, v) => setM(p => ({ ...p, [k]:v }));
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(10,14,39,0.6)", zIndex:1000,
      display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ background:"white", borderRadius:"1rem", width:"100%", maxWidth:500,
        margin:"1rem", boxShadow:"0 20px 60px rgba(0,0,0,0.25)" }}>
        <div style={{ padding:"1.1rem 1.4rem", borderBottom:`1px solid ${C.border}`,
          display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <h3 style={{ margin:0, color:C.primary }}>Configure: {m.label}</h3>
          <button onClick={onClose} style={{ background:"none", border:"none", fontSize:"1.3rem", cursor:"pointer", color:C.muted }}>×</button>
        </div>
        <div style={{ padding:"1.4rem", display:"flex", flexDirection:"column", gap:"1rem" }}>
          <div><FieldLabel>Method Title</FieldLabel><FieldInput value={m.label} onChange={v => set("label",v)} /></div>
          <div><FieldLabel>Cost (₹)</FieldLabel>
            <FieldInput value={m.cost.replace("₹","")} onChange={v => set("cost",`₹${v}`)} type="number" placeholder="0" /></div>
          {(m.id === "flat_rate" || m.id === "express" || m.id === "same_day") && (
            <div>
              <FieldLabel>Tax Status</FieldLabel>
              <FieldSelect value={m.taxable ? "taxable" : "none"} onChange={v => set("taxable", v === "taxable")}>
                <option value="taxable">Taxable</option>
                <option value="none">None</option>
              </FieldSelect>
            </div>
          )}
          {m.id === "free_ship" && (
            <div><FieldLabel>Minimum Order Amount (₹)</FieldLabel>
              <FieldInput value={(m.minOrder||"").replace("₹","")} onChange={v => set("minOrder",`₹${v}`)} type="number" placeholder="499" /></div>
          )}
          {(m.delivery !== undefined) && (
            <div><FieldLabel>Delivery Estimate</FieldLabel>
              <FieldInput value={m.delivery||""} onChange={v => set("delivery",v)} placeholder="e.g. 2-3 business days" /></div>
          )}
        </div>
        <div style={{ padding:"1rem 1.4rem", borderTop:`1px solid ${C.border}`, display:"flex", gap:"0.75rem", justifyContent:"flex-end" }}>
          <SecondaryBtn onClick={onClose}>Cancel</SecondaryBtn>
          <PrimaryBtn onClick={() => onSave(zoneId, m)}>💾 Save Changes</PrimaryBtn>
        </div>
      </div>
    </div>
  );
}


// ══════════════════════════════════════════════════════════════════════════════
// ─── WOOCOMMERCE-STYLE PAYMENT GATEWAY ────────────────────────────────────────
// ══════════════════════════════════════════════════════════════════════════════
const PAYMENT_GATEWAYS_CONFIG = [
  {
    id:"razorpay", label:"Razorpay", icon:"💳", color:"#528FF0",
    desc:"Accept payments via UPI, Cards, Net Banking, Wallets.",
    popular:true, setup:false,
    fields:[
      { key:"key_id",     label:"Key ID",        type:"text",     ph:"rzp_live_XXXXXXXXXXXX" },
      { key:"key_secret", label:"Key Secret",    type:"password", ph:"••••••••••••••••••••••" },
      { key:"webhook_secret", label:"Webhook Secret", type:"password", ph:"whsec_XXXXXXXXX" },
    ]
  },
  {
    id:"stripe", label:"Stripe", icon:"⚡", color:"#6772E5",
    desc:"Accept global card payments. Supports 3D Secure & SCA.",
    popular:false, setup:false,
    fields:[
      { key:"publishable_key", label:"Publishable Key", type:"text",     ph:"pk_live_XXXXXXXXXXXX" },
      { key:"secret_key",      label:"Secret Key",      type:"password", ph:"sk_live_XXXXXXXXXXXX" },
      { key:"webhook_secret",  label:"Webhook Secret",  type:"password", ph:"whsec_XXXXXXXXX" },
    ]
  },
  {
    id:"payu", label:"PayU", icon:"🏦", color:"#F7941D",
    desc:"India-first payment gateway with UPI, EMI, BNPL support.",
    popular:false, setup:false,
    fields:[
      { key:"merchant_key",  label:"Merchant Key",  type:"text",     ph:"XXXXXXXXXXXXX" },
      { key:"merchant_salt", label:"Merchant Salt", type:"password", ph:"••••••••••••••" },
    ]
  },
  {
    id:"cashfree", label:"Cashfree Payments", icon:"🟢", color:"#0F9D58",
    desc:"Pay securely via Card/Net Banking/Wallet via Cashfree.",
    popular:false, setup:false,
    fields:[
      { key:"app_id",     label:"App ID",     type:"text",     ph:"1029779673554eeec6c913900bb9779201" },
      { key:"secret_key", label:"Secret key", type:"password", ph:"••••••••••••••••••••••••••••••••••" },
    ]
  },
  {
    id:"cod", label:"Cash on Delivery", icon:"💵", color:"#43A047",
    desc:"Allow customers to pay when the order arrives.",
    popular:false, setup:true,
    fields:[]
  },
  {
    id:"upi", label:"UPI / QR Code", icon:"📱", color:"#5C6BC0",
    desc:"Accept direct UPI payments via QR code generation.",
    popular:false, setup:false,
    fields:[
      { key:"vpa",       label:"UPI VPA / ID", type:"text", ph:"yourshop@upi" },
      { key:"qr_name",   label:"Display Name", type:"text", ph:"AZZRO Store" },
    ]
  },
];

function PaymentGatewaySection({ showToast }) {
  const [gateways, setGateways] = useState(PAYMENT_GATEWAYS_CONFIG);
  const [selectedGw, setSelectedGw] = useState(null);
  const [gwData, setGwData] = useState({});
  const [testMode, setTestMode] = useState(true);
  const [activeMainTab, setActiveMainTab] = useState("gateways"); // gateways | transactions | settings

  const toggleGateway = (id) => {
    setGateways(prev => prev.map(g => g.id === id ? { ...g, setup:!g.setup } : g));
    showToast(gateways.find(g => g.id === id)?.setup ? "Gateway disabled" : "Gateway enabled");
  };

  const selectedConfig = gateways.find(g => g.id === selectedGw);

  const MAIN_TABS = [
    { id:"gateways",     label:"Payment Methods" },
    { id:"transactions", label:"Transaction Logs" },
    { id:"settings",     label:"Checkout Settings" },
  ];

  return (
    <div>
      <PageHeader title="Payment Gateway" breadcrumb="Payment Gateway"
        action={<div style={{ display:"flex", alignItems:"center", gap:"0.75rem" }}>
          <span style={{ fontSize:"0.85rem", color:C.muted }}>Test Mode</span>
          <Toggle checked={testMode} onChange={setTestMode} />
          {testMode && <Badge type="warning">SANDBOX</Badge>}
          {!testMode && <Badge type="danger">LIVE</Badge>}
        </div>} />

      {testMode && <InfoBox type="warning"><strong>Test Mode Active.</strong> No real transactions will be processed. Use test credentials and test card numbers.</InfoBox>}

      {/* Main Tabs */}
      <div style={{ display:"flex", gap:"0", marginBottom:"1.5rem", background:"white",
        border:`1px solid ${C.border}`, borderRadius:"0.75rem", padding:"0.35rem", width:"fit-content" }}>
        {MAIN_TABS.map(t => (
          <button key={t.id} onClick={() => setActiveMainTab(t.id)} style={{
            padding:"0.5rem 1.2rem", borderRadius:"0.5rem", border:"none", cursor:"pointer",
            fontFamily:"inherit", fontSize:"0.88rem", fontWeight:600, transition:"all 180ms",
            background: activeMainTab === t.id ? C.primary : "transparent",
            color: activeMainTab === t.id ? "white" : C.muted,
          }}>{t.label}</button>
        ))}
      </div>

      {activeMainTab === "gateways" && (
        <div style={{ display:"grid", gridTemplateColumns: selectedGw ? "340px 1fr" : "1fr", gap:"1.5rem" }}>
          <div>
            <div style={{ fontWeight:600, color:C.muted, fontSize:"0.78rem", textTransform:"uppercase",
              letterSpacing:"0.08em", marginBottom:"0.75rem" }}>Available Payment Methods</div>
            {gateways.map(gw => (
              <div key={gw.id} onClick={() => setSelectedGw(selectedGw === gw.id ? null : gw.id)}
                style={{ background:"white", border:`2px solid ${selectedGw === gw.id ? C.accent : C.border}`,
                  borderRadius:"0.85rem", padding:"1rem 1.25rem", marginBottom:"0.65rem",
                  cursor:"pointer", transition:"all 180ms",
                  boxShadow: selectedGw === gw.id ? `0 0 0 3px rgba(0,217,255,0.1)` : "none" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:"0.75rem" }}>
                    <div style={{ width:40, height:40, borderRadius:"0.5rem",
                      background:`${gw.color}18`, display:"flex", alignItems:"center", justifyContent:"center",
                      fontSize:"1.3rem" }}>{gw.icon}</div>
                    <div>
                      <div style={{ fontWeight:700, color:C.primary, display:"flex", alignItems:"center", gap:"0.5rem" }}>
                        {gw.label}
                        {gw.popular && <span style={{ background:"rgba(0,217,255,0.1)", color:C.accent,
                          fontSize:"0.65rem", fontWeight:700, padding:"0.1rem 0.45rem", borderRadius:10 }}>POPULAR</span>}
                      </div>
                      <div style={{ fontSize:"0.78rem", color:C.muted }}>{gw.desc}</div>
                    </div>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:"0.6rem" }} onClick={e => e.stopPropagation()}>
                    <span style={{ fontSize:"0.75rem", color: gw.setup ? C.success : C.muted, fontWeight:600 }}>
                      {gw.setup ? "Active" : "Inactive"}
                    </span>
                    <Toggle checked={gw.setup} onChange={() => toggleGateway(gw.id)} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {selectedGw && selectedConfig && (
            <Card header={
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", width:"100%" }}>
                <div style={{ display:"flex", alignItems:"center", gap:"0.6rem" }}>
                  <span style={{ fontSize:"1.3rem" }}>{selectedConfig.icon}</span>
                  <span style={{ fontWeight:700, fontSize:"1rem", color:C.primary }}>{selectedConfig.label} — Configuration</span>
                </div>
                <button onClick={() => setSelectedGw(null)} style={{ background:"none", border:"none", cursor:"pointer", color:C.muted, fontSize:"1.2rem" }}>×</button>
              </div>
            }>
              {selectedConfig.fields.length === 0 ? (
                <div style={{ textAlign:"center", padding:"2rem", color:C.muted }}>
                  <div style={{ fontSize:"2.5rem", marginBottom:"0.75rem" }}>{selectedConfig.icon}</div>
                  <div style={{ fontWeight:600, color:"#364152", marginBottom:"0.5rem" }}>{selectedConfig.label}</div>
                  <div style={{ fontSize:"0.88rem" }}>No API keys required. Toggle to enable/disable.</div>
                </div>
              ) : (
                <>
                  <InfoBox type="info">
                    {testMode
                      ? `Use ${selectedConfig.label} test credentials below. Do not use live keys in test mode.`
                      : `⚠️ Live mode is active. Enter your production ${selectedConfig.label} credentials.`}
                  </InfoBox>
                  <div style={{ display:"grid", gap:"1rem", marginBottom:"1.25rem" }}>
                    {selectedConfig.fields.map(f => (
                      <div key={f.key}>
                        <FieldLabel>{f.label}</FieldLabel>
                        <FieldInput
                          value={gwData[`${selectedConfig.id}_${f.key}`] || ""}
                          onChange={v => setGwData(p => ({ ...p, [`${selectedConfig.id}_${f.key}`]: v }))}
                          type={f.type} placeholder={f.ph} />
                      </div>
                    ))}
                  </div>
                  <div style={{ background:C.bg, borderRadius:"0.65rem", padding:"0.85rem 1rem",
                    border:`1px solid ${C.border}`, marginBottom:"1rem" }}>
                    <div style={{ fontWeight:600, fontSize:"0.88rem", color:"#364152", marginBottom:"0.4rem" }}>
                      📋 Webhook URL
                    </div>
                    <div style={{ fontFamily:"monospace", fontSize:"0.82rem", color:C.accent,
                      background:"white", padding:"0.5rem 0.85rem", borderRadius:"0.4rem",
                      border:`1px solid ${C.border}`, userSelect:"all" }}>
                      https://azzro.in/api/webhooks/{selectedConfig.id}
                    </div>
                    <div style={{ fontSize:"0.78rem", color:C.muted, marginTop:"0.35rem" }}>
                      Add this URL to your {selectedConfig.label} dashboard under Webhooks.
                    </div>
                  </div>
                  <div style={{ display:"flex", gap:"0.75rem" }}>
                    <PrimaryBtn onClick={() => showToast(`${selectedConfig.label} settings saved!`)}>💾 Save Settings</PrimaryBtn>
                    <SecondaryBtn onClick={() => showToast(`Testing ${selectedConfig.label} connection…`)}>🔌 Test Connection</SecondaryBtn>
                  </div>
                </>
              )}
            </Card>
          )}
        </div>
      )}

      {activeMainTab === "transactions" && (
        <Card header={<span style={{ fontWeight:700, color:C.primary }}>📊 Recent Transactions</span>}>
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead><tr>{["Transaction ID","Order","Amount","Gateway","Status","Date"].map(h => <TH key={h}>{h}</TH>)}</tr></thead>
              <tbody>
                {[
                  { txn:"TXN-RZP-8821", order:"#ORD-1234", amount:"₹2,499", gw:"Razorpay", status:"success", date:"Today, 2:30 PM" },
                  { txn:"TXN-RZP-8820", order:"#ORD-1233", amount:"₹4,999", gw:"Razorpay", status:"success", date:"Today, 11:45 AM" },
                  { txn:"TXN-STR-401",  order:"#ORD-1232", amount:"₹1,299", gw:"Stripe",   status:"pending", date:"Yesterday, 6:10 PM" },
                  { txn:"TXN-RZP-8819", order:"#ORD-1231", amount:"₹8,750", gw:"Razorpay", status:"failed",  date:"Yesterday, 3:22 PM" },
                  { txn:"TXN-RZP-8818", order:"#ORD-1230", amount:"₹3,200", gw:"Razorpay", status:"success", date:"2 days ago" },
                ].map(t => (
                  <TR key={t.txn}>
                    <TD style={{ fontFamily:"monospace", fontSize:"0.82rem" }}>{t.txn}</TD>
                    <TD style={{ color:C.accent }}>{t.order}</TD>
                    <TD style={{ fontWeight:700 }}>{t.amount}</TD>
                    <TD>{t.gw}</TD>
                    <TD><Badge type={t.status === "success" ? "success" : t.status === "pending" ? "warning" : "danger"}>{t.status}</Badge></TD>
                    <TD style={{ color:C.muted, fontSize:"0.85rem" }}>{t.date}</TD>
                  </TR>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {activeMainTab === "settings" && (
        <Card header={<span style={{ fontWeight:700, color:C.primary }}>🛒 Checkout Settings</span>}>
          <CheckoutSettings showToast={showToast} />
        </Card>
      )}
    </div>
  );
}

function CheckoutSettings({ showToast }) {
  const [s, setS] = useState({
    guestCheckout: true,
    forceLogin: false,
    couponField: true,
    orderNotes: true,
    addressValidation: true,
    gstField: true,
    partialPayment: false,
    emiEnabled: true,
    emiMinAmount: "3000",
    refundMode: "auto",
  });
  const set = (k, v) => setS(p => ({ ...p, [k]:v }));
  return (
    <div>
      <SectionTitle>Checkout Behaviour</SectionTitle>
      <div style={{ display:"grid", gap:"0.75rem", marginBottom:"1.25rem" }}>
        {[
          { key:"guestCheckout",    label:"Guest Checkout",         desc:"Allow checkout without account" },
          { key:"couponField",      label:"Show Coupon Field",       desc:"Display coupon input on cart/checkout" },
          { key:"orderNotes",       label:"Order Notes",             desc:"Show order notes text area" },
          { key:"gstField",         label:"GST Number Field",        desc:"Allow B2B customers to enter GSTIN" },
          { key:"addressValidation",label:"Address Validation",      desc:"Validate pin codes via postal API" },
          { key:"emiEnabled",       label:"EMI Option",              desc:"Show EMI plans at checkout" },
          { key:"partialPayment",   label:"Partial Payments / BNPL", desc:"Allow buy now, pay later options" },
        ].map(t => (
          <div key={t.key} style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
            padding:"0.75rem 1rem", background:C.bg, borderRadius:"0.5rem", border:`1px solid ${C.border}` }}>
            <div>
              <div style={{ fontWeight:600, fontSize:"0.9rem", color:C.primary }}>{t.label}</div>
              <div style={{ fontSize:"0.8rem", color:C.muted }}>{t.desc}</div>
            </div>
            <Toggle checked={s[t.key]} onChange={v => set(t.key, v)} />
          </div>
        ))}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem", marginBottom:"1.25rem" }}>
        <div>
          <FieldLabel>Min Order for EMI (₹)</FieldLabel>
          <FieldInput value={s.emiMinAmount} onChange={v => set("emiMinAmount",v)} type="number" placeholder="3000" />
        </div>
        <div>
          <FieldLabel>Refund Processing</FieldLabel>
          <FieldSelect value={s.refundMode} onChange={v => set("refundMode",v)}>
            <option value="auto">Automatic refund to original payment method</option>
            <option value="manual">Manual approval required</option>
            <option value="wallet">Refund to store wallet</option>
          </FieldSelect>
        </div>
      </div>
      <PrimaryBtn onClick={() => showToast("Checkout settings saved!")}>💾 Save Checkout Settings</PrimaryBtn>
    </div>
  );
}


// ══════════════════════════════════════════════════════════════════════════════
// ─── WCFM-STYLE VENDOR DASHBOARD ──────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════════════════════
function VendorDashboardSection({ showToast }) {
  const [selectedVendor, setSelectedVendor] = useState(INIT_SELLERS[0]);
  const [activeTab, setActiveTab] = useState("overview");

  const TABS = [
    { id:"overview",  label:"📊 Overview" },
    { id:"products",  label:"📦 Products" },
    { id:"orders",    label:"🛒 Orders" },
    { id:"earnings",  label:"💰 Earnings" },
    { id:"settings",  label:"⚙️ Store Settings" },
    { id:"policies",  label:"📋 Policies" },
  ];

  return (
    <div>
      <PageHeader title="Vendor Panel" breadcrumb="Vendor Dashboard"
        action={
          <select value={selectedVendor.id}
            onChange={e => setSelectedVendor(INIT_SELLERS.find(s => s.id === e.target.value))}
            style={{ border:`2px solid ${C.border}`, borderRadius:"0.5rem", padding:"0.5rem 0.85rem",
              fontFamily:"inherit", fontSize:"0.88rem", background:"white", cursor:"pointer", outline:"none",
              fontWeight:600, minWidth:200 }}>
            {INIT_SELLERS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        } />

      {/* Vendor Identity Bar */}
      <div style={{ background:C.primary, borderRadius:"1rem", padding:"1.5rem", marginBottom:"1.5rem",
        display:"flex", alignItems:"center", gap:"1.25rem" }}>
        <div style={{ width:64, height:64, borderRadius:"50%",
          background:`linear-gradient(135deg,${C.accent},${C.accentDk})`,
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:"1.6rem", fontWeight:700, color:"white", flexShrink:0 }}>
          {selectedVendor.name[0]}
        </div>
        <div style={{ flex:1, color:"white" }}>
          <div style={{ fontSize:"1.25rem", fontWeight:700 }}>{selectedVendor.name}</div>
          <div style={{ fontSize:"0.85rem", opacity:0.7, marginTop:"0.2rem" }}>Contact: {selectedVendor.contact}</div>
          <div style={{ display:"flex", gap:"1.5rem", marginTop:"0.6rem", fontSize:"0.85rem" }}>
            <span style={{ color:C.accent }}>⭐ {selectedVendor.rating} rating</span>
            <span style={{ color:"rgba(255,255,255,0.7)" }}>📦 {selectedVendor.products} products</span>
            <span style={{ color:C.success }}>💰 {selectedVendor.revenue} revenue</span>
          </div>
        </div>
        <span style={{ ...sellerStatusStyle[selectedVendor.status], padding:"0.35rem 0.85rem",
          borderRadius:20, fontSize:"0.78rem", fontWeight:700, textTransform:"uppercase" }}>
          {selectedVendor.status}
        </span>
      </div>

      {/* Tabs */}
      <div style={{ display:"flex", gap:"0.35rem", marginBottom:"1.5rem", flexWrap:"wrap" }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
            padding:"0.5rem 1rem", borderRadius:"0.5rem", border:`1.5px solid ${activeTab === t.id ? C.accent : C.border}`,
            cursor:"pointer", fontFamily:"inherit", fontSize:"0.85rem", fontWeight:600, transition:"all 180ms",
            background: activeTab === t.id ? "rgba(0,217,255,0.08)" : "white",
            color: activeTab === t.id ? C.accent : "#364152",
          }}>{t.label}</button>
        ))}
      </div>

      {activeTab === "overview" && <VendorOverview vendor={selectedVendor} navigate={setActiveTab} />}
      {activeTab === "products" && <VendorProducts vendor={selectedVendor} showToast={showToast} />}
      {activeTab === "orders"   && <VendorOrders vendor={selectedVendor} showToast={showToast} />}
      {activeTab === "earnings" && <VendorEarnings vendor={selectedVendor} showToast={showToast} />}
      {activeTab === "settings" && <VendorStoreSettings vendor={selectedVendor} showToast={showToast} />}
      {activeTab === "policies" && <VendorPolicies vendor={selectedVendor} showToast={showToast} />}
    </div>
  );
}

function VendorOverview({ vendor, navigate }) {
  const stats = [
    { icon:"💰", label:"This Month Revenue", value:"₹1.8L", change:"+14%", positive:true },
    { icon:"📦", label:"Total Orders",       value:"142",    change:"+8%",  positive:true },
    { icon:"⭐", label:"Avg Rating",          value:vendor.rating, change:"+0.2", positive:true },
    { icon:"📉", label:"Return Rate",         value:"2.3%",  change:"-0.5%", positive:true },
  ];
  return (
    <div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:"1rem", marginBottom:"1.5rem" }}>
        {stats.map(s => (
          <div key={s.label} style={{ background:"white", border:`1px solid ${C.border}`, borderRadius:"0.85rem",
            padding:"1.2rem", position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:`linear-gradient(90deg,${C.accent},${C.accentDk})` }} />
            <div style={{ fontSize:"1.4rem", marginBottom:"0.4rem" }}>{s.icon}</div>
            <div style={{ fontSize:"0.75rem", color:C.muted, textTransform:"uppercase", letterSpacing:"0.06em", fontWeight:600 }}>{s.label}</div>
            <div style={{ fontSize:"1.6rem", fontWeight:700, color:C.primary }}>{s.value}</div>
            <div style={{ fontSize:"0.78rem", color:s.positive ? C.success : C.danger, fontWeight:600 }}>{s.change}</div>
          </div>
        ))}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem" }}>
        <Card header={<span style={{ fontWeight:700, color:C.primary }}>Quick Actions</span>}>
          <div style={{ display:"grid", gap:"0.5rem" }}>
            {[
              { icon:"➕", label:"Add New Product", fn:() => navigate("products") },
              { icon:"🛒", label:"View New Orders",  fn:() => navigate("orders") },
              { icon:"💳", label:"Withdrawal Request", fn:() => navigate("earnings") },
              { icon:"⚙️", label:"Update Store Info",  fn:() => navigate("settings") },
            ].map(a => (
              <button key={a.label} onClick={a.fn} style={{ display:"flex", alignItems:"center", gap:"0.75rem",
                padding:"0.75rem 1rem", background:C.bg, border:`1px solid ${C.border}`,
                borderRadius:"0.5rem", cursor:"pointer", fontFamily:"inherit", fontSize:"0.88rem",
                fontWeight:600, color:C.primary, transition:"all 180ms", textAlign:"left" }}
                onMouseOver={e => { e.currentTarget.style.borderColor=C.accent; e.currentTarget.style.background="rgba(0,217,255,0.05)"; }}
                onMouseOut={e => { e.currentTarget.style.borderColor=C.border; e.currentTarget.style.background=C.bg; }}>
                <span style={{ fontSize:"1.1rem" }}>{a.icon}</span>{a.label}
              </button>
            ))}
          </div>
        </Card>
        <Card header={<span style={{ fontWeight:700, color:C.primary }}>Commission Summary</span>}>
          <div style={{ display:"flex", flexDirection:"column", gap:"0.75rem" }}>
            <div style={{ display:"flex", justifyContent:"space-between", padding:"0.6rem 0", borderBottom:`1px solid ${C.border}` }}>
              <span style={{ color:C.muted }}>Commission Rate</span>
              <span style={{ fontWeight:700, color:C.accent }}>{vendor.commission}%</span>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", padding:"0.6rem 0", borderBottom:`1px solid ${C.border}` }}>
              <span style={{ color:C.muted }}>Gross Revenue</span>
              <span style={{ fontWeight:600 }}>{vendor.revenue}</span>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", padding:"0.6rem 0", borderBottom:`1px solid ${C.border}` }}>
              <span style={{ color:C.muted }}>Admin Commission</span>
              <span style={{ fontWeight:600, color:C.danger }}>−₹X.XL</span>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", padding:"0.6rem 0" }}>
              <span style={{ fontWeight:700 }}>Vendor Earnings</span>
              <span style={{ fontWeight:700, color:C.success }}>₹X.XL</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function VendorProducts({ vendor, showToast }) {
  const vendorProducts = INIT_PRODUCTS.filter(p => p.vendor === vendor.name);
  return (
    <Card header={
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", width:"100%" }}>
        <span style={{ fontWeight:700, color:C.primary }}>📦 {vendor.name} — Products</span>
        <PrimaryBtn small onClick={() => showToast("Add product form — vendor specific")}>+ Add Product</PrimaryBtn>
      </div>
    }>
      {vendorProducts.length === 0
        ? <div style={{ textAlign:"center", padding:"2rem", color:C.muted }}>No products found for this vendor.</div>
        : <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead><tr>{["Product","SKU","Category","Price","Stock","Status","Actions"].map(h => <TH key={h}>{h}</TH>)}</tr></thead>
              <tbody>
                {vendorProducts.map(p => (
                  <TR key={p.id}>
                    <TD style={{ fontWeight:600 }}>{p.name}</TD>
                    <TD style={{ fontFamily:"monospace", fontSize:"0.82rem", color:C.muted }}>{p.sku}</TD>
                    <TD>{p.category}</TD>
                    <TD style={{ fontWeight:600 }}>{p.price}</TD>
                    <TD><span style={{ color: p.stock === 0 ? C.danger : C.success, fontWeight:600 }}>{p.stock || "Out"}</span></TD>
                    <TD><Badge type={p.status === "Active" ? "success" : "neutral"}>{p.status}</Badge></TD>
                    <TD><div style={{ display:"flex", gap:"0.35rem" }}>
                      <ActionBtn icon="✏️" title="Edit" onClick={() => showToast(`Editing ${p.name}`)} />
                      <ActionBtn icon="🗑️" variant="danger" title="Delete" onClick={() => showToast(`Delete ${p.name}`)} />
                    </div></TD>
                  </TR>
                ))}
              </tbody>
            </table>
          </div>
      }
    </Card>
  );
}

function VendorOrders({ vendor, showToast }) {
  return (
    <Card header={<span style={{ fontWeight:700, color:C.primary }}>🛒 {vendor.name} — Orders</span>}>
      <div style={{ overflowX:"auto" }}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead><tr>{["Order ID","Customer","Amount","Status","Date","Actions"].map(h => <TH key={h}>{h}</TH>)}</tr></thead>
          <tbody>
            {INIT_ORDERS.slice(0,4).map(o => (
              <TR key={o.id}>
                <TD style={{ fontFamily:"monospace", fontSize:"0.82rem" }}>{o.id}</TD>
                <TD>{o.customer}</TD>
                <TD style={{ fontWeight:600 }}>{o.amount}</TD>
                <TD><Badge type={o.statusType}>{o.status}</Badge></TD>
                <TD style={{ color:C.muted, fontSize:"0.82rem" }}>Today</TD>
                <TD><ActionBtn icon="👁️" title="View" onClick={() => showToast(`Viewing ${o.id}`)} /></TD>
              </TR>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function VendorEarnings({ vendor, showToast }) {
  const [withAmount, setWithAmount] = useState("");
  const [withMethod, setWithMethod] = useState("bank");
  return (
    <div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"1rem", marginBottom:"1.5rem" }}>
        {[
          { label:"Available Balance", value:"₹42,500", color:C.success, icon:"💰" },
          { label:"Pending Clearance", value:"₹12,200", color:C.warning, icon:"⏳" },
          { label:"Total Withdrawn",   value:"₹2.8L",   color:C.accent,  icon:"🏦" },
        ].map(s => (
          <div key={s.label} style={{ background:"white", border:`1px solid ${C.border}`, borderRadius:"0.85rem", padding:"1.2rem" }}>
            <div style={{ fontSize:"1.3rem", marginBottom:"0.35rem" }}>{s.icon}</div>
            <div style={{ fontSize:"0.8rem", color:C.muted, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.06em" }}>{s.label}</div>
            <div style={{ fontSize:"1.6rem", fontWeight:700, color:s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      <Card header={<span style={{ fontWeight:700, color:C.primary }}>💸 Request Withdrawal</span>}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem", marginBottom:"1rem" }}>
          <div>
            <FieldLabel required>Amount (₹)</FieldLabel>
            <FieldInput value={withAmount} onChange={setWithAmount} type="number" placeholder="Enter amount" />
          </div>
          <div>
            <FieldLabel required>Payment Method</FieldLabel>
            <FieldSelect value={withMethod} onChange={setWithMethod}>
              <option value="bank">Bank Transfer (NEFT/IMPS)</option>
              <option value="upi">UPI Transfer</option>
              <option value="razorpay">Razorpay Payout</option>
            </FieldSelect>
          </div>
        </div>
        <InfoBox type="info">Withdrawals are processed within 2-3 business days. Minimum withdrawal amount is ₹500.</InfoBox>
        <PrimaryBtn onClick={() => showToast(`Withdrawal request for ₹${withAmount} submitted!`)}>Submit Withdrawal Request</PrimaryBtn>
      </Card>

      <Card header={<span style={{ fontWeight:700, color:C.primary }}>📋 Transaction History</span>}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead><tr>{["Date","Description","Type","Amount","Balance"].map(h => <TH key={h}>{h}</TH>)}</tr></thead>
          <tbody>
            {[
              { date:"Today",         desc:"Order #ORD-1234 Commission", type:"credit",  amt:"+₹2,175", bal:"₹42,500" },
              { date:"Yesterday",     desc:"Withdrawal Processed",       type:"debit",   amt:"−₹15,000",bal:"₹40,325" },
              { date:"Dec 10",        desc:"Order #ORD-1230 Commission", type:"credit",  amt:"+₹2,784", bal:"₹55,325" },
              { date:"Dec 8",         desc:"Refund Deduction #ORD-1220", type:"debit",   amt:"−₹1,100", bal:"₹52,541" },
            ].map((t,i) => (
              <TR key={i}>
                <TD style={{ color:C.muted, fontSize:"0.82rem" }}>{t.date}</TD>
                <TD>{t.desc}</TD>
                <TD><Badge type={t.type === "credit" ? "success" : "danger"}>{t.type}</Badge></TD>
                <TD style={{ fontWeight:700, color:t.type === "credit" ? C.success : C.danger }}>{t.amt}</TD>
                <TD style={{ fontWeight:600 }}>{t.bal}</TD>
              </TR>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function VendorStoreSettings({ vendor, showToast }) {
  const [s, setS] = useState({
    storeName: vendor.name, storeSlug: vendor.name.toLowerCase().replace(/\s+/g,"-"),
    storeDesc: "Premium quality products delivered across India.",
    storeEmail: vendor.contact.toLowerCase().replace(/\s+/g,"") + "@example.com",
    storePhone: "+91 98765 43210",
    storeAddr: "Shop 12, Fashion Street, Hyderabad – 500001",
    vacationMode: false, allowReviews: true, showPhone: false,
    bankName: "SBI", accountNo: "", ifsc: "", accountName: vendor.contact,
    upiId: "",
  });
  const set = (k, v) => setS(p => ({ ...p, [k]:v }));
  return (
    <div>
      <SectionTitle>🏪 Store Information</SectionTitle>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem", marginBottom:"1rem" }}>
        <div><FieldLabel>Store Name</FieldLabel><FieldInput value={s.storeName} onChange={v => set("storeName",v)} /></div>
        <div><FieldLabel>Store URL Slug</FieldLabel>
          <div style={{ display:"flex", alignItems:"center", border:`2px solid ${C.border}`, borderRadius:"0.5rem", overflow:"hidden" }}>
            <span style={{ padding:"0 0.6rem", color:C.muted, fontSize:"0.82rem", background:C.bg, height:"100%",
              display:"flex", alignItems:"center", borderRight:`1px solid ${C.border}` }}>azzro.in/shop/</span>
            <input value={s.storeSlug} onChange={e => set("storeSlug",e.target.value)}
              style={{ flex:1, padding:"0.58rem 0.6rem", border:"none", outline:"none", fontFamily:"inherit", fontSize:"0.9rem" }} />
          </div>
        </div>
      </div>
      <div style={{ marginBottom:"1rem" }}>
        <FieldLabel>Store Description</FieldLabel>
        <textarea value={s.storeDesc} onChange={e => set("storeDesc",e.target.value)}
          style={{ width:"100%", padding:"0.6rem 0.85rem", border:`2px solid ${C.border}`, borderRadius:"0.5rem",
            fontFamily:"inherit", fontSize:"0.9rem", outline:"none", resize:"vertical", minHeight:80, boxSizing:"border-box" }}
          onFocus={e => e.target.style.borderColor=C.accent} onBlur={e => e.target.style.borderColor=C.border} />
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem", marginBottom:"1.25rem" }}>
        <div><FieldLabel>Store Email</FieldLabel><FieldInput value={s.storeEmail} onChange={v => set("storeEmail",v)} type="email" /></div>
        <div><FieldLabel>Store Phone</FieldLabel><FieldInput value={s.storePhone} onChange={v => set("storePhone",v)} /></div>
      </div>

      <SectionTitle>🏦 Bank / Payout Details</SectionTitle>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem", marginBottom:"0.75rem" }}>
        <div><FieldLabel>Account Holder Name</FieldLabel><FieldInput value={s.accountName} onChange={v => set("accountName",v)} /></div>
        <div><FieldLabel>Bank Name</FieldLabel><FieldInput value={s.bankName} onChange={v => set("bankName",v)} placeholder="e.g. SBI, HDFC" /></div>
        <div><FieldLabel>Account Number</FieldLabel><FieldInput value={s.accountNo} onChange={v => set("accountNo",v)} type="password" placeholder="••••••••••••" /></div>
        <div><FieldLabel>IFSC Code</FieldLabel><FieldInput value={s.ifsc} onChange={v => set("ifsc",v)} placeholder="SBIN0001234" /></div>
        <div><FieldLabel>UPI ID (optional)</FieldLabel><FieldInput value={s.upiId} onChange={v => set("upiId",v)} placeholder="name@upi" /></div>
      </div>

      <SectionTitle>🎛️ Store Preferences</SectionTitle>
      <div style={{ display:"grid", gap:"0.65rem", marginBottom:"1.25rem" }}>
        {[
          { key:"vacationMode",  label:"Vacation Mode",     desc:"Temporarily pause your store" },
          { key:"allowReviews",  label:"Allow Reviews",     desc:"Let customers leave product reviews" },
          { key:"showPhone",     label:"Show Phone Number", desc:"Display phone number on store page" },
        ].map(t => (
          <div key={t.key} style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
            padding:"0.7rem 1rem", background:C.bg, borderRadius:"0.5rem", border:`1px solid ${C.border}` }}>
            <div>
              <div style={{ fontWeight:600, fontSize:"0.88rem" }}>{t.label}</div>
              <div style={{ fontSize:"0.78rem", color:C.muted }}>{t.desc}</div>
            </div>
            <Toggle checked={s[t.key]} onChange={v => set(t.key, v)} />
          </div>
        ))}
      </div>
      <PrimaryBtn onClick={() => showToast("Store settings saved successfully!")}>💾 Save Store Settings</PrimaryBtn>
    </div>
  );
}

function VendorPolicies({ vendor, showToast }) {
  const [policies, setPolicies] = useState({
    return: "We accept returns within 7 days of delivery. Items must be in original condition with all tags intact.",
    shipping: "We ship pan India via Shiprocket. Orders are dispatched within 2 business days.",
    privacy: "Your personal data is safe with us. We never share your details with third parties.",
    refund: "Refunds are processed within 5-7 business days after return approval.",
  });
  const POLICY_LABELS = {
    return:"Return Policy", shipping:"Shipping Policy", privacy:"Privacy Policy", refund:"Refund Policy"
  };
  return (
    <Card header={<span style={{ fontWeight:700, color:C.primary }}>📋 Store Policies</span>}>
      <InfoBox type="info">These policies will be displayed on your store page and at checkout. Keep them clear and transparent.</InfoBox>
      {Object.keys(policies).map(k => (
        <div key={k} style={{ marginBottom:"1.25rem" }}>
          <FieldLabel>{POLICY_LABELS[k]}</FieldLabel>
          <textarea value={policies[k]} onChange={e => setPolicies(p => ({ ...p, [k]:e.target.value }))}
            style={{ width:"100%", padding:"0.6rem 0.85rem", border:`2px solid ${C.border}`, borderRadius:"0.5rem",
              fontFamily:"inherit", fontSize:"0.9rem", outline:"none", resize:"vertical", minHeight:90, boxSizing:"border-box" }}
            onFocus={e => e.target.style.borderColor=C.accent} onBlur={e => e.target.style.borderColor=C.border} />
        </div>
      ))}
      <PrimaryBtn onClick={() => showToast("Store policies saved!")}>💾 Save Policies</PrimaryBtn>
    </Card>
  );
}

// ─── VENDOR COMMISSIONS ───────────────────────────────────────────────────────
function MarketplaceCommissionSettings({ showToast }) {
  const [commFor, setCommFor] = useState("Admin");
  const [commMode, setCommMode] = useState("Percent");
  const [commPercent, setCommPercent] = useState("15");
  const [commFixed, setCommFixed] = useState("100");
  const [shippingToVendor, setShippingToVendor] = useState(true);
  const [taxToVendor, setTaxToVendor] = useState(true);
  const [afterVendorCoupon, setAfterVendorCoupon] = useState(true);
  const [afterAdminCoupon, setAfterAdminCoupon] = useState(true);
  const [taxEnabled, setTaxEnabled] = useState(true);
  const [taxLabel, setTaxLabel] = useState("Tax");
  const [taxPercent, setTaxPercent] = useState("");
  const [rules, setRules] = useState([{ id:1, cost:"299", rule:"Up to", type:"Fixed", percent:"3", fixed:"0" }]);

  const COMM_MODES = ["Percent","Fixed","Percent + Fixed","By Vendor Sales","By Product Price","By Purchase Quantity"];

  const addRule = () => setRules(prev => [...prev, { id:Date.now(), cost:"", rule:"Up to", type:"Percent", percent:"0", fixed:"0" }]);
  const removeRule = (id) => setRules(prev => prev.filter(r => r.id !== id));
  const updateRule = (id, k, v) => setRules(prev => prev.map(r => r.id === id ? { ...r, [k]:v } : r));

  const isRuleBased = ["By Vendor Sales","By Product Price","By Purchase Quantity"].includes(commMode);

  const ruleLabel = commMode === "By Vendor Sales" ? "Sales (₹)" : commMode === "By Product Price" ? "Product Cost (₹)" : "Purchase Quantity";

  return (
    <Card header={<div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", width:"100%" }}>
      <span style={{ fontWeight:700, color:C.primary, fontStyle:"italic" }}>Marketplace Commission Settings</span>
      <a href="#" onClick={e => { e.preventDefault(); showToast("Opening tutorial…"); }}
        style={{ fontSize:"0.82rem", color:C.accent, textDecoration:"none", display:"flex", alignItems:"center", gap:"0.3rem" }}>
        📹 TUTORIAL
      </a>
    </div>} style={{ marginBottom:"1.5rem" }}>

      {/* Commission For */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem", marginBottom:"1rem" }}>
        <div>
          <FieldLabel>Commission For</FieldLabel>
          <FieldSelect value={commFor} onChange={setCommFor}>
            <option>Admin</option>
            <option>Vendor</option>
          </FieldSelect>
        </div>
        <div>
          <FieldLabel>Commission Mode</FieldLabel>
          <FieldSelect value={commMode} onChange={setCommMode}>
            {COMM_MODES.map(m => <option key={m}>{m}</option>)}
          </FieldSelect>
        </div>
      </div>

      {/* Simple percent mode */}
      {commMode === "Percent" && (
        <div style={{ marginBottom:"1rem" }}>
          <FieldLabel>Commission Percent (%)</FieldLabel>
          <FieldInput value={commPercent} onChange={setCommPercent} type="number" placeholder="15" style={{ maxWidth:220 }} />
        </div>
      )}

      {/* Fixed mode */}
      {commMode === "Fixed" && (
        <div style={{ marginBottom:"1rem" }}>
          <FieldLabel>Commission Fixed (₹)</FieldLabel>
          <FieldInput value={commFixed} onChange={setCommFixed} type="number" placeholder="100" style={{ maxWidth:220 }} />
        </div>
      )}

      {/* Percent + Fixed mode */}
      {commMode === "Percent + Fixed" && (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem", marginBottom:"1rem" }}>
          <div><FieldLabel>Commission Percent (%)</FieldLabel><FieldInput value={commPercent} onChange={setCommPercent} type="number" placeholder="15" /></div>
          <div><FieldLabel>Commission Fixed (₹)</FieldLabel><FieldInput value={commFixed} onChange={setCommFixed} type="number" placeholder="100" /></div>
        </div>
      )}

      {/* Rule-based modes */}
      {isRuleBased && (
        <div style={{ marginBottom:"1rem" }}>
          <div style={{ fontWeight:700, fontSize:"0.9rem", color:C.primary, marginBottom:"0.75rem", fontStyle:"italic" }}>
            Commission By {commMode === "By Vendor Sales" ? "Sales Rule(s)" : commMode === "By Product Price" ? "Product Price" : "Purchase Quantity"}
          </div>
          {rules.map((r, idx) => (
            <div key={r.id} style={{ border:`1px solid ${C.border}`, borderRadius:"0.75rem", padding:"1rem 1.25rem",
              marginBottom:"0.75rem", position:"relative", background:"white" }}>
              <div style={{ position:"absolute", top:"0.6rem", right:"0.6rem", cursor:"grab", color:C.muted, fontSize:"1.2rem" }}>⊹</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.75rem" }}>
                <div>
                  <FieldLabel>{ruleLabel}</FieldLabel>
                  <FieldInput value={r.cost} onChange={v => updateRule(r.id,"cost",v)} type="number" placeholder="299" />
                </div>
                <div>
                  <FieldLabel>Rule</FieldLabel>
                  <FieldSelect value={r.rule} onChange={v => updateRule(r.id,"rule",v)}>
                    <option>Up to</option>
                    <option>Greater than</option>
                  </FieldSelect>
                </div>
                <div>
                  <FieldLabel>Commission Type</FieldLabel>
                  <FieldSelect value={r.type} onChange={v => updateRule(r.id,"type",v)}>
                    <option>Percent</option>
                    <option>Fixed</option>
                    <option>Percent + Fixed</option>
                  </FieldSelect>
                </div>
                <div>
                  <FieldLabel>Commission Percent (%)</FieldLabel>
                  <FieldInput value={r.percent} onChange={v => updateRule(r.id,"percent",v)} type="number" placeholder="0" />
                </div>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:"0.75rem", marginTop:"0.75rem" }}>
                <div style={{ flex:1 }}>
                  <FieldLabel>Commission Fixed (₹)</FieldLabel>
                  <FieldInput value={r.fixed} onChange={v => updateRule(r.id,"fixed",v)} type="number" placeholder="0" />
                </div>
                <button onClick={() => removeRule(r.id)} style={{ marginTop:"1.2rem", width:28, height:28, borderRadius:"50%",
                  background:"rgba(255,61,113,0.1)", border:`1px solid rgba(255,61,113,0.3)`, cursor:"pointer", color:C.danger,
                  fontSize:"1rem", display:"flex", alignItems:"center", justifyContent:"center" }}>⊗</button>
              </div>
            </div>
          ))}
          <button onClick={addRule} style={{ width:28, height:28, borderRadius:"50%", background:"rgba(0,217,255,0.1)",
            border:`1px solid ${C.accent}`, cursor:"pointer", color:C.accent, fontSize:"1.2rem",
            display:"flex", alignItems:"center", justifyContent:"center" }}>⊕</button>
          <div style={{ fontSize:"0.78rem", color:C.muted, marginTop:"0.6rem", fontStyle:"italic" }}>
            {commMode === "By Vendor Sales"
              ? "Commission rules depending upon vendors total sales. e.g 50% commission when sales ₹1000 but < ₹2000 and so on. You may define any number of such rules."
              : commMode === "By Product Price"
              ? "Commission rules depending upon product price range. e.g Fixed ₹3 when price ≤ ₹299, 5% when price ≤ ₹499 and so on."
              : "Commission rules depending upon purchased product quantity. e.g 80% commission when purchase quantity 2 and so on."}
          </div>
        </div>
      )}

      {/* Common toggles */}
      <div style={{ display:"grid", gap:"0.6rem", marginBottom:"1.25rem" }}>
        {[
          { label:"Shipping cost goes to vendor?", val:shippingToVendor, set:setShippingToVendor },
          { label:"Tax goes to vendor?",           val:taxToVendor,      set:setTaxToVendor },
          { label:"Commission after consider Vendor Coupon?", val:afterVendorCoupon, set:setAfterVendorCoupon },
          { label:"Commission after consider Admin Coupon?",  val:afterAdminCoupon,  set:setAfterAdminCoupon },
        ].map(t => (
          <div key={t.label} style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
            padding:"0.6rem 0.85rem", background:C.bg, borderRadius:"0.5rem", border:`1px solid ${C.border}` }}>
            <span style={{ fontWeight:600, fontSize:"0.88rem", color:C.primary, fontStyle:"italic" }}>{t.label}</span>
            <input type="checkbox" checked={t.val} onChange={e => t.set(e.target.checked)}
              style={{ width:18, height:18, accentColor:C.accent, cursor:"pointer" }} />
          </div>
        ))}
      </div>

      {/* Commission Tax Settings */}
      <div style={{ borderTop:`1px solid ${C.border}`, paddingTop:"1rem", marginBottom:"1.25rem" }}>
        <div style={{ fontWeight:700, fontSize:"0.95rem", color:C.primary, marginBottom:"0.85rem", fontStyle:"italic" }}>Commission Tax Settings</div>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
          padding:"0.6rem 0.85rem", background:C.bg, borderRadius:"0.5rem", border:`1px solid ${C.border}`, marginBottom:"0.75rem" }}>
          <span style={{ fontWeight:600, fontSize:"0.88rem", fontStyle:"italic" }}>Enable</span>
          <input type="checkbox" checked={taxEnabled} onChange={e => setTaxEnabled(e.target.checked)}
            style={{ width:18, height:18, accentColor:C.accent, cursor:"pointer" }} />
        </div>
        {taxEnabled && (
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem" }}>
            <div><FieldLabel>Tax Label</FieldLabel><FieldInput value={taxLabel} onChange={setTaxLabel} placeholder="Tax" /></div>
            <div><FieldLabel>Tax Percent (%)</FieldLabel><FieldInput value={taxPercent} onChange={setTaxPercent} type="number" placeholder="0" /></div>
          </div>
        )}
      </div>

      <PrimaryBtn onClick={() => showToast("Marketplace commission settings saved!")}>💾 Save Commission Settings</PrimaryBtn>
    </Card>
  );
}

function VendorCommissionsSection({ showToast }) {
  const [sellers, setSellers] = useState(INIT_SELLERS);
  return (
    <div>
      <PageHeader title="Commission Management" breadcrumb="Commissions" />
      <MarketplaceCommissionSettings showToast={showToast} />
      <Card header={<span style={{ fontWeight:700, color:C.primary }}>🏪 Vendor-Specific Rates</span>}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead><tr>{["Vendor","Commission Rate","Revenue","Status","Actions"].map(h => <TH key={h}>{h}</TH>)}</tr></thead>
          <tbody>
            {sellers.map(s => (
              <TR key={s.id}>
                <TD style={{ fontWeight:600 }}>{s.name}</TD>
                <TD>
                  <div style={{ display:"flex", alignItems:"center", gap:"0.5rem" }}>
                    <input type="number" value={s.commission} onChange={e => setSellers(prev => prev.map(v => v.id === s.id ? { ...v, commission:Number(e.target.value) } : v))}
                      style={{ width:70, padding:"0.35rem 0.5rem", border:`2px solid ${C.border}`, borderRadius:"0.4rem",
                        fontFamily:"inherit", fontSize:"0.9rem", outline:"none", textAlign:"center" }}
                      onFocus={e => e.target.style.borderColor=C.accent} onBlur={e => e.target.style.borderColor=C.border} />
                    <span style={{ color:C.muted, fontWeight:600 }}>%</span>
                  </div>
                </TD>
                <TD style={{ fontWeight:600 }}>{s.revenue}</TD>
                <TD><span style={{ ...sellerStatusStyle[s.status], padding:"0.28rem 0.6rem", borderRadius:20, fontSize:"0.7rem", fontWeight:700, textTransform:"uppercase" }}>{s.status}</span></TD>
                <TD><PrimaryBtn small onClick={() => showToast(`Commission for ${s.name} updated to ${s.commission}%`)}>Save</PrimaryBtn></TD>
              </TR>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

// ─── VENDOR PAYOUTS ────────────────────────────────────────────────────────────
function VendorPayoutsSection({ showToast }) {
  return (
    <div>
      <PageHeader title="Vendor Payouts" breadcrumb="Payouts"
        action={<PrimaryBtn onClick={() => showToast("Processing bulk payout…")}>💸 Process All Payouts</PrimaryBtn>} />
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"1rem", marginBottom:"1.5rem" }}>
        {[
          { label:"Pending Payouts",   value:"₹1.4L", color:C.warning, icon:"⏳", count:"8 vendors" },
          { label:"Processed Today",   value:"₹3.2L", color:C.success, icon:"✅", count:"12 payouts" },
          { label:"Total Paid (Month)",value:"₹18.5L",color:C.accent,  icon:"💰", count:"42 payouts" },
        ].map(s => (
          <div key={s.label} style={{ background:"white", border:`1px solid ${C.border}`, borderRadius:"0.85rem", padding:"1.2rem" }}>
            <div style={{ fontSize:"1.4rem", marginBottom:"0.35rem" }}>{s.icon}</div>
            <div style={{ fontSize:"0.75rem", color:C.muted, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.06em" }}>{s.label}</div>
            <div style={{ fontSize:"1.5rem", fontWeight:700, color:s.color }}>{s.value}</div>
            <div style={{ fontSize:"0.78rem", color:C.muted }}>{s.count}</div>
          </div>
        ))}
      </div>
      <Card header={<span style={{ fontWeight:700, color:C.primary }}>📋 Payout Queue</span>}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead><tr>{["Vendor","Amount","Method","Request Date","Status","Actions"].map(h => <TH key={h}>{h}</TH>)}</tr></thead>
          <tbody>
            {INIT_SELLERS.filter(s => s.status === "Active").map(s => (
              <TR key={s.id}>
                <TD style={{ fontWeight:600 }}>{s.name}</TD>
                <TD style={{ fontWeight:700, color:C.success }}>₹{(Math.random()*50000+5000).toFixed(0)}</TD>
                <TD>Bank Transfer</TD>
                <TD style={{ color:C.muted }}>Dec 12, 2025</TD>
                <TD><Badge type="warning">Pending</Badge></TD>
                <TD><div style={{ display:"flex", gap:"0.4rem" }}>
                  <PrimaryBtn small onClick={() => showToast(`Payout approved for ${s.name}`)}>✅ Approve</PrimaryBtn>
                  <DangerBtn small onClick={() => showToast(`Payout rejected for ${s.name}`)}>Reject</DangerBtn>
                </div></TD>
              </TR>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}


// ══════════════════════════════════════════════════════════════════════════════
// ─── WORDPRESS-STYLE HOMEPAGE EDITOR ──────────────────────────────────────────
// ══════════════════════════════════════════════════════════════════════════════
const INIT_SECTIONS = [
  { id:"hero",       type:"Hero Banner",    icon:"🖼️", enabled:true,  order:1,
    config:{ heading:"Discover Indian Fashion", subheading:"Shop from 200+ curated vendors", ctaText:"Shop Now", ctaLink:"/products", bgColor:"#0A0E27", overlay:true }},
  { id:"marquee",    type:"Marquee Strip",  icon:"📢", enabled:true,  order:2,
    config:{ text:"FREE SHIPPING on orders above ₹499  ·  NEW ARRIVALS DAILY  ·  10,000+ Happy Customers", bgColor:"#00D9FF" }},
  { id:"categories", type:"Category Grid",  icon:"📁", enabled:true,  order:3,
    config:{ title:"Shop by Category", columns:4, showAll:true }},
  { id:"featured",   type:"Featured Products", icon:"⭐", enabled:true, order:4,
    config:{ title:"Trending Now", productCount:8, layout:"grid", showBadge:true }},
  { id:"banner_1",   type:"Promo Banner",   icon:"🎁", enabled:true,  order:5,
    config:{ heading:"Flat 40% OFF", subheading:"On all ethnic wear", ctaText:"Grab Offer", bgGradient:true }},
  { id:"vendors",    type:"Top Vendors",    icon:"🏪", enabled:false, order:6,
    config:{ title:"Our Trusted Sellers", showCount:6 }},
  { id:"new_arr",    type:"New Arrivals",   icon:"✨", enabled:true,  order:7,
    config:{ title:"Just Dropped", productCount:6, layout:"scroll" }},
  { id:"testimonials",type:"Testimonials", icon:"💬", enabled:true,  order:8,
    config:{ title:"What Our Customers Say", showCount:3 }},
  { id:"newsletter", type:"Newsletter",    icon:"📧", enabled:true,  order:9,
    config:{ heading:"Stay in the Loop", subheading:"Get exclusive deals straight to your inbox", ctaText:"Subscribe" }},
];

function HomepageEditor({ showToast }) {
  const [sections, setSections] = useState(INIT_SECTIONS.sort((a,b) => a.order - b.order));
  const [editingSection, setEditingSection] = useState(null);
  const [preview, setPreview] = useState(false);
  const [activeTab, setActiveTab] = useState("sections"); // sections | seo | header | footer

  const toggleSection = (id) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, enabled:!s.enabled } : s));
    showToast("Section visibility updated");
  };

  const moveSection = (id, dir) => {
    setSections(prev => {
      const sorted = [...prev].sort((a,b) => a.order - b.order);
      const idx = sorted.findIndex(s => s.id === id);
      const swapIdx = dir === "up" ? idx - 1 : idx + 1;
      if (swapIdx < 0 || swapIdx >= sorted.length) return prev;
      const newArr = [...sorted];
      [newArr[idx].order, newArr[swapIdx].order] = [newArr[swapIdx].order, newArr[idx].order];
      return newArr;
    });
  };

  const TABS = [
    { id:"sections", label:"🧩 Page Sections" },
    { id:"header",   label:"🏠 Header & Nav" },
    { id:"footer",   label:"📄 Footer" },
    { id:"seo",      label:"🔍 SEO & Meta" },
  ];

  return (
    <div>
      <PageHeader title="Homepage Editor" breadcrumb="Storefront"
        action={<div style={{ display:"flex", gap:"0.75rem" }}>
          <SecondaryBtn onClick={() => { setPreview(p => !p); showToast(preview ? "Edit mode" : "Preview mode activated"); }}>
            {preview ? "✏️ Edit" : "👁️ Preview"}
          </SecondaryBtn>
          <PrimaryBtn onClick={() => showToast("Homepage changes published live!")}>🚀 Publish Changes</PrimaryBtn>
        </div>} />

      {/* Tabs */}
      <div style={{ display:"flex", gap:"0.35rem", marginBottom:"1.5rem", flexWrap:"wrap" }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
            padding:"0.5rem 1.1rem", borderRadius:"0.5rem", border:`1.5px solid ${activeTab === t.id ? C.accent : C.border}`,
            cursor:"pointer", fontFamily:"inherit", fontSize:"0.85rem", fontWeight:600, transition:"all 180ms",
            background: activeTab === t.id ? "rgba(0,217,255,0.08)" : "white",
            color: activeTab === t.id ? C.accent : "#364152",
          }}>{t.label}</button>
        ))}
      </div>

      {activeTab === "sections" && (
        <div style={{ display:"grid", gridTemplateColumns:preview ? "1fr 380px" : "1fr", gap:"1.5rem" }}>
          {/* Section List — WordPress Block Editor style */}
          <div>
            <InfoBox type="info">Drag sections to reorder (use arrows). Toggle visibility. Click ⚙️ to edit content.</InfoBox>
            {[...sections].sort((a,b) => a.order - b.order).map((s, idx, arr) => (
              <div key={s.id} style={{
                background:"white", border:`2px solid ${editingSection?.id === s.id ? C.accent : s.enabled ? C.border : "#E3E8EF"}`,
                borderRadius:"0.85rem", padding:"1rem 1.25rem", marginBottom:"0.6rem",
                opacity: s.enabled ? 1 : 0.6, transition:"all 180ms",
                boxShadow: editingSection?.id === s.id ? `0 0 0 3px rgba(0,217,255,0.1)` : "none"
              }}>
                <div style={{ display:"flex", alignItems:"center", gap:"0.75rem" }}>
                  {/* Reorder arrows */}
                  <div style={{ display:"flex", flexDirection:"column", gap:"2px" }}>
                    <button onClick={() => moveSection(s.id, "up")} disabled={idx === 0}
                      style={{ background:"none", border:"none", cursor:idx === 0 ? "not-allowed" : "pointer",
                        fontSize:"0.8rem", color: idx === 0 ? "#CDD5DF" : C.muted, padding:"1px", lineHeight:1 }}>▲</button>
                    <button onClick={() => moveSection(s.id, "down")} disabled={idx === arr.length - 1}
                      style={{ background:"none", border:"none", cursor:idx === arr.length-1 ? "not-allowed" : "pointer",
                        fontSize:"0.8rem", color: idx === arr.length-1 ? "#CDD5DF" : C.muted, padding:"1px", lineHeight:1 }}>▼</button>
                  </div>

                  <div style={{ width:40, height:40, borderRadius:"0.5rem",
                    background: s.enabled ? "rgba(0,217,255,0.1)" : C.bg,
                    display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.2rem", flexShrink:0 }}>
                    {s.icon}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:700, color:C.primary, fontSize:"0.95rem" }}>{s.type}</div>
                    <div style={{ fontSize:"0.78rem", color:C.muted, marginTop:"0.1rem" }}>
                      Position {s.order} · {s.enabled ? "Visible" : "Hidden"}
                      {s.config?.heading && ` · "${s.config.heading}"`}
                    </div>
                  </div>

                  <div style={{ display:"flex", alignItems:"center", gap:"0.5rem" }}>
                    <Toggle checked={s.enabled} onChange={() => toggleSection(s.id)} />
                    <ActionBtn icon="⚙️" title="Edit section" onClick={() => setEditingSection(s.id === editingSection?.id ? null : s)} />
                  </div>
                </div>

                {/* Inline editor for selected section */}
                {editingSection?.id === s.id && (
                  <div style={{ marginTop:"1rem", paddingTop:"1rem", borderTop:`1px solid ${C.border}` }}>
                    <SectionConfigEditor section={s} onUpdate={(updated) => {
                      setSections(prev => prev.map(x => x.id === s.id ? { ...x, config:updated } : x));
                      showToast("Section updated");
                    }} />
                  </div>
                )}
              </div>
            ))}

            <div style={{ display:"flex", gap:"0.75rem", marginTop:"1rem" }}>
              <SecondaryBtn onClick={() => showToast("Add Section — choose from Hero, Banner, Grid, Products, Text, Video…")}>
                + Add New Section
              </SecondaryBtn>
              <SecondaryBtn onClick={() => setSections(INIT_SECTIONS.sort((a,b) => a.order - b.order))}>
                ↺ Reset to Default
              </SecondaryBtn>
            </div>
          </div>

          {/* Preview Panel */}
          {preview && (
            <div style={{ position:"sticky", top:90, height:"calc(100vh - 140px)" }}>
              <div style={{ background:"white", border:`1px solid ${C.border}`, borderRadius:"1rem", overflow:"hidden", height:"100%" }}>
                <div style={{ padding:"0.75rem 1rem", borderBottom:`1px solid ${C.border}`,
                  display:"flex", alignItems:"center", gap:"0.5rem", background:C.bg }}>
                  <div style={{ display:"flex", gap:"0.35rem" }}>
                    {["#FF5F56","#FFBE2E","#27C93F"].map(c => (
                      <div key={c} style={{ width:12, height:12, borderRadius:"50%", background:c }} />
                    ))}
                  </div>
                  <div style={{ flex:1, background:"white", borderRadius:6, padding:"0.2rem 0.6rem",
                    fontSize:"0.75rem", color:C.muted, border:`1px solid ${C.border}`, textAlign:"center" }}>
                    azzro.in
                  </div>
                </div>
                <div style={{ overflowY:"auto", height:"calc(100% - 50px)", padding:"0" }}>
                  <HomepagePreview sections={[...sections].sort((a,b) => a.order - b.order).filter(s => s.enabled)} />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "header" && <HeaderEditor showToast={showToast} />}
      {activeTab === "footer" && <FooterEditor showToast={showToast} />}
      {activeTab === "seo" && <SEOEditor showToast={showToast} />}
    </div>
  );
}

function SectionConfigEditor({ section, onUpdate }) {
  const [cfg, setCfg] = useState({ ...section.config });
  const set = (k, v) => setCfg(p => ({ ...p, [k]:v }));

  const renderField = (key, label, type="text", opts=null) => (
    <div key={key} style={{ marginBottom:"0.75rem" }}>
      <FieldLabel>{label}</FieldLabel>
      {type === "categories" ? (
        <div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:"0.4rem", marginBottom:"0.4rem" }}>
            {CATEGORIES.map(cat => {
              const selected = (cfg[key] || []).includes(cat);
              return (
                <button key={cat} onClick={() => {
                  const current = cfg[key] || [];
                  set(key, selected ? current.filter(c => c !== cat) : [...current, cat]);
                }} style={{
                  padding:"0.3rem 0.75rem", borderRadius:20, border:`1.5px solid ${selected ? C.accent : C.border}`,
                  background: selected ? "rgba(0,217,255,0.12)" : "white",
                  color: selected ? C.accent : "#364152",
                  fontFamily:"inherit", fontSize:"0.8rem", fontWeight: selected ? 700 : 500,
                  cursor:"pointer", transition:"all 150ms"
                }}>{cat}</button>
              );
            })}
          </div>
          <div style={{ fontSize:"0.75rem", color:C.muted }}>{(cfg[key]||[]).length > 0 ? `${(cfg[key]||[]).length} categories selected` : "Click to select categories to display"}</div>
        </div>
      ) : type === "textarea" ? (
        <textarea value={cfg[key]||""} onChange={e => set(key,e.target.value)}
          style={{ width:"100%", padding:"0.5rem 0.7rem", border:`2px solid ${C.border}`, borderRadius:"0.4rem",
            fontFamily:"inherit", fontSize:"0.85rem", outline:"none", resize:"vertical", minHeight:70, boxSizing:"border-box" }}
          onFocus={e => e.target.style.borderColor=C.accent} onBlur={e => e.target.style.borderColor=C.border} />
      ) : type === "select" ? (
        <FieldSelect value={cfg[key]||""} onChange={v => set(key,v)}>
          {opts.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </FieldSelect>
      ) : type === "toggle" ? (
        <div style={{ display:"flex", alignItems:"center", gap:"0.75rem" }}>
          <Toggle checked={!!cfg[key]} onChange={v => set(key,v)} />
          <span style={{ fontSize:"0.82rem", color:C.muted }}>{cfg[key] ? "Enabled" : "Disabled"}</span>
        </div>
      ) : type === "color" ? (
        <div style={{ display:"flex", gap:"0.75rem", alignItems:"center" }}>
          <input type="color" value={cfg[key]||"#0A0E27"} onChange={e => set(key,e.target.value)}
            style={{ width:44, height:36, border:`2px solid ${C.border}`, borderRadius:"0.375rem", cursor:"pointer", padding:"2px" }} />
          <FieldInput value={cfg[key]||""} onChange={v => set(key,v)} placeholder="#000000" style={{ flex:1 }} />
        </div>
      ) : (
        <FieldInput value={cfg[key]||""} onChange={v => set(key,v)} placeholder={label} />
      )}
    </div>
  );

  const fieldsByType = {
    "Hero Banner":    [["heading","Heading"], ["subheading","Subheading","textarea"], ["ctaText","Button Text"], ["ctaLink","Button Link"], ["bgColor","Background Color","color"], ["overlay","Dark Overlay","toggle"]],
    "Marquee Strip":  [["text","Marquee Text","textarea"], ["bgColor","Background Color","color"]],
    "Category Grid":  [["title","Section Title"], ["columns","Columns","select",[{value:"3",label:"3 columns"},{value:"4",label:"4 columns"},{value:"5",label:"5 columns"}]], ["showAll","Show 'All Categories' link","toggle"], ["selectedCategories","Select Categories to Show","categories"]],
    "Featured Products":[["title","Section Title"], ["productCount","Number of Products"], ["showBadge","Show Sale Badge","toggle"]],
    "Promo Banner":   [["heading","Main Heading"], ["subheading","Subheading"], ["ctaText","Button Text"]],
    "Top Vendors":    [["title","Section Title"], ["showCount","Vendors to Show"]],
    "New Arrivals":   [["title","Section Title"], ["productCount","Number of Products"]],
    "Testimonials":   [["title","Section Title"], ["showCount","Testimonials to Show"]],
    "Newsletter":     [["heading","Heading"], ["subheading","Subheading","textarea"], ["ctaText","Button Text"]],
  };

  const fields = fieldsByType[section.type] || [];

  return (
    <div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.75rem" }}>
        {fields.map(([k, label, type="text", opts]) => renderField(k, label, type, opts))}
      </div>
      <div style={{ display:"flex", gap:"0.5rem", marginTop:"0.75rem" }}>
        <PrimaryBtn small onClick={() => onUpdate(cfg)}>✓ Apply Changes</PrimaryBtn>
      </div>
    </div>
  );
}

function HomepagePreview({ sections }) {
  return (
    <div style={{ fontFamily:"sans-serif" }}>
      {sections.map(s => (
        <div key={s.id}>
          {s.type === "Hero Banner" && (
            <div style={{ background: s.config.bgColor || "#0A0E27", padding:"2.5rem 1.5rem", textAlign:"center", color:"white" }}>
              <div style={{ fontSize:"1.4rem", fontWeight:700, marginBottom:"0.4rem" }}>{s.config.heading}</div>
              <div style={{ fontSize:"0.85rem", opacity:0.8, marginBottom:"1rem" }}>{s.config.subheading}</div>
              <div style={{ background:"#00D9FF", color:"white", display:"inline-block",
                padding:"0.45rem 1.2rem", borderRadius:20, fontSize:"0.8rem", fontWeight:700 }}>{s.config.ctaText}</div>
            </div>
          )}
          {s.type === "Marquee Strip" && (
            <div style={{ background:s.config.bgColor||"#00D9FF", padding:"0.5rem 1rem",
              fontSize:"0.75rem", fontWeight:600, color:"white", textAlign:"center", overflow:"hidden" }}>
              {s.config.text}
            </div>
          )}
          {s.type === "Category Grid" && (
            <div style={{ padding:"1rem", background:"white" }}>
              <div style={{ fontWeight:700, textAlign:"center", marginBottom:"0.6rem", fontSize:"0.88rem" }}>{s.config.title}</div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"0.4rem" }}>
                {["Women","Men","Kids","Electronics"].map(c => (
                  <div key={c} style={{ background:"#F8FAFB", borderRadius:"0.4rem", padding:"0.4rem",
                    textAlign:"center", fontSize:"0.7rem", fontWeight:600, border:"1px solid #E3E8EF" }}>{c}</div>
                ))}
              </div>
            </div>
          )}
          {(s.type === "Featured Products" || s.type === "New Arrivals") && (
            <div style={{ padding:"1rem", background:s.type === "New Arrivals" ? "#F8FAFB" : "white" }}>
              <div style={{ fontWeight:700, fontSize:"0.88rem", marginBottom:"0.6rem" }}>{s.config.title}</div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"0.4rem" }}>
                {[1,2,3].map(i => (
                  <div key={i} style={{ background:"white", border:"1px solid #E3E8EF", borderRadius:"0.4rem", padding:"0.5rem" }}>
                    <div style={{ height:50, background:"#E3E8EF", borderRadius:"0.3rem", marginBottom:"0.3rem" }} />
                    <div style={{ fontSize:"0.65rem", fontWeight:600, color:"#1F2937" }}>Product {i}</div>
                    <div style={{ fontSize:"0.65rem", color:"#00D9FF", fontWeight:700 }}>₹1,299</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {s.type === "Promo Banner" && (
            <div style={{ background:"linear-gradient(135deg,#FF6B6B,#FF3D71)", padding:"1.5rem", textAlign:"center", color:"white" }}>
              <div style={{ fontSize:"1.1rem", fontWeight:700 }}>{s.config.heading}</div>
              <div style={{ fontSize:"0.75rem", opacity:0.9, marginBottom:"0.6rem" }}>{s.config.subheading}</div>
              <div style={{ background:"white", color:"#FF3D71", display:"inline-block",
                padding:"0.3rem 0.9rem", borderRadius:20, fontSize:"0.72rem", fontWeight:700 }}>{s.config.ctaText}</div>
            </div>
          )}
          {s.type === "Newsletter" && (
            <div style={{ padding:"1.5rem", background:"#0A0E27", textAlign:"center", color:"white" }}>
              <div style={{ fontWeight:700, marginBottom:"0.3rem" }}>{s.config.heading}</div>
              <div style={{ fontSize:"0.75rem", opacity:0.7, marginBottom:"0.75rem" }}>{s.config.subheading}</div>
              <div style={{ display:"flex", gap:"0.4rem", maxWidth:260, margin:"0 auto" }}>
                <div style={{ flex:1, background:"rgba(255,255,255,0.1)", borderRadius:6, padding:"0.35rem 0.5rem",
                  fontSize:"0.7rem", color:"rgba(255,255,255,0.5)" }}>Enter your email</div>
                <div style={{ background:"#00D9FF", color:"white", padding:"0.35rem 0.6rem",
                  borderRadius:6, fontSize:"0.7rem", fontWeight:700 }}>{s.config.ctaText}</div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function HeaderEditor({ showToast }) {
  const [h, setH] = useState({
    logoText:"AZZRO", logoTagline:"Fashion for Everyone", bgColor:"#ffffff",
    showSearch:true, showCart:true, showWishlist:true, showAccount:true,
    stickyHeader:true, showTopBar:true,
    topBarText:"🎉 New users get 10% off with code AZZRONEW · Free returns on all orders",
    nav:["Home","Women","Men","Kids","Electronics","Beauty","Sale"],
  });
  const set = (k,v) => setH(p => ({ ...p, [k]:v }));
  return (
    <div>
      <SectionTitle>🏠 Site Identity</SectionTitle>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem", marginBottom:"1.25rem" }}>
        <div><FieldLabel>Logo Text / Name</FieldLabel><FieldInput value={h.logoText} onChange={v => set("logoText",v)} /></div>
        <div><FieldLabel>Tagline</FieldLabel><FieldInput value={h.logoTagline} onChange={v => set("logoTagline",v)} /></div>
        <div><FieldLabel>Header Background</FieldLabel>
          <div style={{ display:"flex", gap:"0.75rem", alignItems:"center" }}>
            <input type="color" value={h.bgColor} onChange={e => set("bgColor",e.target.value)}
              style={{ width:44, height:36, border:`2px solid ${C.border}`, borderRadius:"0.375rem", cursor:"pointer", padding:"2px" }} />
            <FieldInput value={h.bgColor} onChange={v => set("bgColor",v)} placeholder="#ffffff" style={{ flex:1 }} />
          </div>
        </div>
      </div>
      <SectionTitle>🔔 Top Announcement Bar</SectionTitle>
      <div style={{ marginBottom:"0.75rem" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"0.5rem" }}>
          <FieldLabel>Announcement Text</FieldLabel>
          <Toggle checked={h.showTopBar} onChange={v => set("showTopBar",v)} />
        </div>
        <FieldInput value={h.topBarText} onChange={v => set("topBarText",v)} />
      </div>
      <SectionTitle>⚙️ Header Options</SectionTitle>
      <div style={{ display:"grid", gap:"0.6rem", marginBottom:"1.25rem" }}>
        {[
          { key:"showSearch",   label:"Show Search Bar" },
          { key:"showCart",     label:"Show Cart Icon" },
          { key:"showWishlist", label:"Show Wishlist Icon" },
          { key:"showAccount",  label:"Show Account Button" },
          { key:"stickyHeader", label:"Sticky Header (fixed on scroll)" },
        ].map(t => (
          <div key={t.key} style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
            padding:"0.6rem 1rem", background:C.bg, borderRadius:"0.5rem", border:`1px solid ${C.border}` }}>
            <span style={{ fontWeight:600, fontSize:"0.88rem" }}>{t.label}</span>
            <Toggle checked={h[t.key]} onChange={v => set(t.key,v)} />
          </div>
        ))}
      </div>
      <SectionTitle>🧭 Navigation Menu</SectionTitle>
      <div style={{ display:"flex", gap:"0.4rem", flexWrap:"wrap", marginBottom:"1rem" }}>
        {h.nav.map((item, i) => (
          <div key={i} style={{ display:"flex", alignItems:"center", gap:"0.3rem",
            background:C.bg, border:`1px solid ${C.border}`, padding:"0.3rem 0.6rem", borderRadius:6 }}>
            <span style={{ fontSize:"0.85rem", fontWeight:600 }}>{item}</span>
            <button onClick={() => setH(p => ({ ...p, nav:p.nav.filter((_,j) => j !== i) }))}
              style={{ background:"none", border:"none", cursor:"pointer", color:C.danger, fontSize:"0.8rem", lineHeight:1 }}>×</button>
          </div>
        ))}
        <button onClick={() => { const item = prompt("Menu item name:"); if(item?.trim()) setH(p => ({ ...p, nav:[...p.nav, item.trim()] })); }}
          style={{ background:"none", border:`1.5px dashed ${C.border}`, cursor:"pointer",
            padding:"0.3rem 0.6rem", borderRadius:6, fontSize:"0.82rem", color:C.muted, fontFamily:"inherit" }}>
          + Add Item
        </button>
      </div>
      <PrimaryBtn onClick={() => showToast("Header settings saved!")}>💾 Save Header</PrimaryBtn>
    </div>
  );
}

function FooterEditor({ showToast }) {
  const [f, setF] = useState({
    about:"AZZRO is India's premium multi-vendor fashion marketplace. Discover styles from 200+ curated sellers.",
    copyright:"© 2025 AZZRO.in · All rights reserved",
    showSocial:true, showNewsletter:false,
    links:[
      { heading:"Shop", items:["Women","Men","Kids","Electronics","Beauty"] },
      { heading:"Help", items:["Contact Us","Returns","Track Order","FAQ"] },
      { heading:"Company", items:["About Us","Careers","Press","Blog"] },
    ]
  });
  return (
    <div>
      <SectionTitle>📝 Footer About Text</SectionTitle>
      <div style={{ marginBottom:"1.25rem" }}>
        <textarea value={f.about} onChange={e => setF(p => ({ ...p, about:e.target.value }))}
          style={{ width:"100%", padding:"0.6rem 0.85rem", border:`2px solid ${C.border}`, borderRadius:"0.5rem",
            fontFamily:"inherit", fontSize:"0.9rem", outline:"none", resize:"vertical", minHeight:80, boxSizing:"border-box" }}
          onFocus={e => e.target.style.borderColor=C.accent} onBlur={e => e.target.style.borderColor=C.border} />
      </div>
      <SectionTitle>🔗 Footer Links</SectionTitle>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"1rem", marginBottom:"1.25rem" }}>
        {f.links.map((col, ci) => (
          <div key={ci}>
            <FieldLabel>{col.heading}</FieldLabel>
            {col.items.map((item, ii) => (
              <div key={ii} style={{ display:"flex", alignItems:"center", gap:"0.4rem", marginBottom:"0.35rem" }}>
                <input value={item} onChange={e => setF(p => ({ ...p, links: p.links.map((c,cj) => cj === ci
                  ? { ...c, items: c.items.map((x,ij) => ij === ii ? e.target.value : x) } : c) }))}
                  style={{ flex:1, padding:"0.35rem 0.5rem", border:`1px solid ${C.border}`, borderRadius:"0.375rem",
                    fontFamily:"inherit", fontSize:"0.82rem", outline:"none" }}
                  onFocus={e => e.target.style.borderColor=C.accent} onBlur={e => e.target.style.borderColor=C.border} />
                <button onClick={() => setF(p => ({ ...p, links: p.links.map((c,cj) => cj === ci
                  ? { ...c, items:c.items.filter((_,ij) => ij !== ii) } : c) }))}
                  style={{ background:"none", border:"none", cursor:"pointer", color:C.danger, fontSize:"1rem" }}>×</button>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div style={{ marginBottom:"1.25rem" }}>
        <FieldLabel>Copyright Text</FieldLabel>
        <FieldInput value={f.copyright} onChange={v => setF(p => ({ ...p, copyright:v }))} />
      </div>
      <PrimaryBtn onClick={() => showToast("Footer saved!")}>💾 Save Footer</PrimaryBtn>
    </div>
  );
}

function SEOEditor({ showToast }) {
  const [seo, setSeo] = useState({
    title:"AZZRO — India's Fashion Marketplace",
    description:"Shop ethnic wear, western wear, electronics and more from 200+ sellers on AZZRO.in. Free shipping above ₹499.",
    keywords:"indian fashion, ethnic wear, kurti, saree, buy online, marketplace",
    ogImage:"", googleAnalytics:"G-XXXXXXXXXX", fbPixel:"", tawkId:"",
    robotsMeta:"index,follow", canonicalUrl:"https://azzro.in",
    schemaOrg: true,
  });
  const set = (k,v) => setSeo(p => ({ ...p, [k]:v }));
  return (
    <div>
      <SectionTitle>🔍 Homepage SEO</SectionTitle>
      <div style={{ display:"grid", gap:"1rem", marginBottom:"1.25rem" }}>
        <div><FieldLabel>Page Title (55-65 chars recommended)</FieldLabel>
          <FieldInput value={seo.title} onChange={v => set("title",v)} />
          <div style={{ fontSize:"0.75rem", color: seo.title.length > 65 ? C.danger : C.muted, marginTop:"0.2rem" }}>{seo.title.length}/65 chars</div>
        </div>
        <div><FieldLabel>Meta Description (150-160 chars)</FieldLabel>
          <textarea value={seo.description} onChange={e => set("description",e.target.value)}
            style={{ width:"100%", padding:"0.6rem 0.85rem", border:`2px solid ${C.border}`, borderRadius:"0.5rem",
              fontFamily:"inherit", fontSize:"0.9rem", outline:"none", resize:"vertical", minHeight:70, boxSizing:"border-box" }}
            onFocus={e => e.target.style.borderColor=C.accent} onBlur={e => e.target.style.borderColor=C.border} />
          <div style={{ fontSize:"0.75rem", color: seo.description.length > 160 ? C.danger : C.muted, marginTop:"0.2rem" }}>{seo.description.length}/160 chars</div>
        </div>
        <div><FieldLabel>Keywords (comma-separated)</FieldLabel><FieldInput value={seo.keywords} onChange={v => set("keywords",v)} /></div>
        <div><FieldLabel>Canonical URL</FieldLabel><FieldInput value={seo.canonicalUrl} onChange={v => set("canonicalUrl",v)} /></div>
        <div><FieldLabel>Robots Meta</FieldLabel>
          <FieldSelect value={seo.robotsMeta} onChange={v => set("robotsMeta",v)} style={{ maxWidth:250 }}>
            <option value="index,follow">index, follow</option>
            <option value="noindex,nofollow">noindex, nofollow</option>
            <option value="index,nofollow">index, nofollow</option>
          </FieldSelect>
        </div>
      </div>
      <SectionTitle>📊 Analytics & Tracking</SectionTitle>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem", marginBottom:"1.25rem" }}>
        <div><FieldLabel>Google Analytics ID</FieldLabel><FieldInput value={seo.googleAnalytics} onChange={v => set("googleAnalytics",v)} placeholder="G-XXXXXXXXXX" /></div>
        <div><FieldLabel>Meta / Facebook Pixel ID</FieldLabel><FieldInput value={seo.fbPixel} onChange={v => set("fbPixel",v)} placeholder="123456789012345" /></div>
        <div><FieldLabel>Tawk.to Property ID</FieldLabel><FieldInput value={seo.tawkId} onChange={v => set("tawkId",v)} placeholder="xxxxxxxxxxxxxxxxxxxxxxxx/default" /></div>
      </div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"0.75rem 1rem",
        background:C.bg, borderRadius:"0.5rem", border:`1px solid ${C.border}`, marginBottom:"1.25rem" }}>
        <div>
          <div style={{ fontWeight:600, fontSize:"0.9rem" }}>Structured Data / Schema.org</div>
          <div style={{ fontSize:"0.8rem", color:C.muted }}>Adds JSON-LD markup for rich search results</div>
        </div>
        <Toggle checked={seo.schemaOrg} onChange={v => set("schemaOrg",v)} />
      </div>
      <PrimaryBtn onClick={() => showToast("SEO settings saved!")}>💾 Save SEO Settings</PrimaryBtn>
    </div>
  );
}


// ─── SETTINGS (original preserved) ───────────────────────────────────────────
function SettingsSection({ showToast }) {
  const [activeTab, setActiveTab] = useState(0);
  const [general, setGeneral] = useState({ storeName:"Azzro.in", storeEmail:"admin@azzro.in", phone:"+91 98765 43210", address:"Hyderabad, Telangana", currency:"INR (₹)", timezone:"IST (UTC+5:30)" });
  const [toggles, setToggles] = useState({ sellers:true, approval:true, notifications:true, maintenance:false });
  const [payment, setPayment] = useState({ gateway:"Razorpay", testMode:true, razorpayKey:"", razorpaySecret:"", webhookSecret:"", stripeKey:"", stripeSecret:"" });
  const [shipping, setShipping] = useState({ provider:"Shiprocket", shiprocketEmail:"", shiprocketPass:"", delhiveryToken:"", freeShippingAbove:"499", defaultWeight:"0.5" });
  const [tax, setTax] = useState({ gstin:"", panNumber:"", gstRate:"18", hsnCode:"", pricesIncludeTax:false });
  const [emailCfg, setEmailCfg] = useState({ smtpHost:"smtp.gmail.com", smtpPort:"587", smtpUser:"", smtpPass:"", fromName:"Azzro.in", fromEmail:"noreply@azzro.in" });
  const [security, setSecurity] = useState({ twoFA:false, forceHttps:true, sessionTimeout:"60", loginAttempts:"5", ipWhitelist:"" });

  const setG = (k,v) => setGeneral(p => ({ ...p,[k]:v }));
  const setP = (k,v) => setPayment(p => ({ ...p,[k]:v }));
  const setSh = (k,v) => setShipping(p => ({ ...p,[k]:v }));
  const setT = (k,v) => setTax(p => ({ ...p,[k]:v }));
  const setE = (k,v) => setEmailCfg(p => ({ ...p,[k]:v }));
  const setSec = (k,v) => setSecurity(p => ({ ...p,[k]:v }));

  return (
    <div>
      <PageHeader title="Platform Settings" breadcrumb="Settings" />
      <div style={{ display:"grid", gridTemplateColumns:"220px 1fr", gap:"1.5rem" }}>
        <div style={{ background:"white", borderRadius:"1rem", border:`1px solid ${C.border}`, padding:"0.5rem", alignSelf:"start" }}>
          {SETTINGS_TABS.map((tab,i) => (
            <button key={i} onClick={() => setActiveTab(i)} style={{
              width:"100%", display:"block", padding:"0.7rem 1rem", border:"none", cursor:"pointer",
              borderRadius:"0.5rem", fontFamily:"inherit", fontSize:"0.88rem", fontWeight:activeTab===i?700:500,
              color:activeTab===i?C.accent:"#364152", background:activeTab===i?"rgba(0,217,255,0.08)":"transparent",
              textAlign:"left", transition:"all 150ms", marginBottom:"2px" }}
              onMouseOver={e => { if(activeTab!==i) e.currentTarget.style.background=C.bg; }}
              onMouseOut={e => { if(activeTab!==i) e.currentTarget.style.background="transparent"; }}>
              {tab}
            </button>
          ))}
        </div>

        <Card style={{ marginBottom:0 }}>
          {activeTab === 0 && <>
            <SectionTitle>Store Information</SectionTitle>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem", marginBottom:"1.5rem" }}>
              {[{label:"Store Name",key:"storeName"},{label:"Store Email",key:"storeEmail",type:"email"},{label:"Support Phone",key:"phone"},{label:"Office Address",key:"address"}].map(f => (
                <div key={f.key}><FieldLabel>{f.label}</FieldLabel><FieldInput value={general[f.key]} onChange={v => setG(f.key,v)} type={f.type||"text"} placeholder={`Enter ${f.label}`} /></div>
              ))}
              {[{label:"Currency",key:"currency",opts:["INR (₹)","USD ($)","EUR (€)"]},{label:"Time Zone",key:"timezone",opts:["IST (UTC+5:30)","PST (UTC-8)","EST (UTC-5)","GMT (UTC+0)"]}].map(f => (
                <div key={f.key}><FieldLabel>{f.label}</FieldLabel><FieldSelect value={general[f.key]} onChange={v => setG(f.key,v)}>{f.opts.map(o => <option key={o}>{o}</option>)}</FieldSelect></div>
              ))}
            </div>
            <SectionTitle>Feature Toggles</SectionTitle>
            <div style={{ display:"grid", gap:"0.85rem", marginBottom:"1.5rem" }}>
              {[
                {key:"sellers",label:"Enable Seller Registration",desc:"Allow new sellers to register"},
                {key:"approval",label:"Require Product Approval",desc:"Review products before going live"},
                {key:"notifications",label:"Email Notifications",desc:"Send automated emails"},
                {key:"maintenance",label:"Maintenance Mode",desc:"Take the platform offline temporarily"},
              ].map(t => (
                <div key={t.key} style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"0.75rem 1rem",background:C.bg,borderRadius:"0.5rem",border:`1px solid ${C.border}` }}>
                  <div><div style={{ fontWeight:600,color:C.primary,fontSize:"0.9rem" }}>{t.label}</div><div style={{ fontSize:"0.8rem",color:C.muted }}>{t.desc}</div></div>
                  <Toggle checked={toggles[t.key]} onChange={() => setToggles(p => ({ ...p,[t.key]:!p[t.key] }))} />
                </div>
              ))}
            </div>
          </>}

          {activeTab === 1 && <>
            <SectionTitle>Payment Gateway Configuration</SectionTitle>
            <InfoBox type="info">For detailed gateway configuration with multi-gateway support, use the dedicated <strong>Payment Gateway</strong> section in Operations.</InfoBox>
            <div style={{ marginBottom:"1.2rem" }}>
              <FieldLabel>Primary Gateway</FieldLabel>
              <FieldSelect value={payment.gateway} onChange={v => setP("gateway",v)} style={{ maxWidth:300 }}>
                {["Razorpay","Stripe","PayU","CCAvenue"].map(g => <option key={g}>{g}</option>)}
              </FieldSelect>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:"0.75rem", marginBottom:"1rem" }}>
              <span style={{ fontSize:"0.88rem" }}>Test Mode: <strong>{payment.testMode ? "ON" : "OFF"}</strong></span>
              <Toggle checked={payment.testMode} onChange={v => setP("testMode",v)} />
            </div>
            {payment.gateway === "Razorpay" && (
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem" }}>
                {[{label:"Key ID",key:"razorpayKey",ph:"rzp_test_XXXX"},{label:"Key Secret",key:"razorpaySecret",ph:"••••"},{label:"Webhook Secret",key:"webhookSecret",ph:"whsec_XXXX"}].map(f => (
                  <div key={f.key}><FieldLabel>{f.label}</FieldLabel><FieldInput value={payment[f.key]} onChange={v => setP(f.key,v)} type="password" placeholder={f.ph} /></div>
                ))}
              </div>
            )}
          </>}

          {activeTab === 2 && <>
            <SectionTitle>Shipping Provider Setup</SectionTitle>
            <InfoBox type="info">For full shipping zone management, use the dedicated <strong>Shipping Zones</strong> section in Operations.</InfoBox>
            <div style={{ marginBottom:"1.2rem" }}>
              <FieldLabel>Default Shipping Provider</FieldLabel>
              <FieldSelect value={shipping.provider} onChange={v => setSh("provider",v)} style={{ maxWidth:300 }}>
                {["Shiprocket","Delhivery","Blue Dart","DTDC","India Post"].map(p => <option key={p}>{p}</option>)}
              </FieldSelect>
            </div>
            {shipping.provider === "Shiprocket" && (
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem", marginBottom:"1.5rem" }}>
                <div><FieldLabel>Shiprocket Email</FieldLabel><FieldInput value={shipping.shiprocketEmail} onChange={v => setSh("shiprocketEmail",v)} type="email" placeholder="your@email.com" /></div>
                <div><FieldLabel>Shiprocket Password</FieldLabel><FieldInput value={shipping.shiprocketPass} onChange={v => setSh("shiprocketPass",v)} type="password" placeholder="••••••••" /></div>
              </div>
            )}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem" }}>
              <div><FieldLabel>Free Shipping Above (₹)</FieldLabel><FieldInput value={shipping.freeShippingAbove} onChange={v => setSh("freeShippingAbove",v)} type="number" placeholder="499" /></div>
              <div><FieldLabel>Default Package Weight (kg)</FieldLabel><FieldInput value={shipping.defaultWeight} onChange={v => setSh("defaultWeight",v)} type="number" placeholder="0.5" /></div>
            </div>
          </>}

          {activeTab === 3 && <>
            <SectionTitle>GST Configuration</SectionTitle>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem", marginBottom:"1.5rem" }}>
              {[{label:"GSTIN Number",key:"gstin",ph:"22AAAAA0000A1Z5"},{label:"PAN Number",key:"panNumber",ph:"AAAAA9999A"},{label:"Default GST Rate (%)",key:"gstRate",ph:"18"},{label:"Default HSN Code",key:"hsnCode",ph:"6204"}].map(f => (
                <div key={f.key}><FieldLabel>{f.label}</FieldLabel><FieldInput value={tax[f.key]} onChange={v => setT(f.key,v)} placeholder={f.ph} /></div>
              ))}
            </div>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"0.75rem 1rem",background:C.bg,borderRadius:"0.5rem",border:`1px solid ${C.border}`,marginBottom:"1.5rem" }}>
              <div><div style={{ fontWeight:600,color:C.primary,fontSize:"0.9rem" }}>Prices Include Tax</div><div style={{ fontSize:"0.8rem",color:C.muted }}>When ON, displayed price includes GST</div></div>
              <Toggle checked={tax.pricesIncludeTax} onChange={v => setT("pricesIncludeTax",v)} />
            </div>
          </>}

          {activeTab === 4 && <>
            <SectionTitle>SMTP / Email Configuration</SectionTitle>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem", marginBottom:"1.5rem" }}>
              {[{label:"SMTP Host",key:"smtpHost",ph:"smtp.gmail.com"},{label:"SMTP Port",key:"smtpPort",ph:"587"},{label:"SMTP Username",key:"smtpUser",ph:"your@gmail.com"},{label:"SMTP Password",key:"smtpPass",ph:"app-password",type:"password"},{label:"From Name",key:"fromName",ph:"Azzro.in"},{label:"From Email",key:"fromEmail",ph:"noreply@azzro.in"}].map(f => (
                <div key={f.key}><FieldLabel>{f.label}</FieldLabel><FieldInput value={emailCfg[f.key]} onChange={v => setE(f.key,v)} type={f.type||"text"} placeholder={f.ph} /></div>
              ))}
            </div>
            <SecondaryBtn onClick={() => showToast("Test email sent to " + emailCfg.smtpUser)}>📧 Send Test Email</SecondaryBtn>
          </>}

          {activeTab === 5 && <>
            <SectionTitle>Authentication & Access</SectionTitle>
            <div style={{ display:"grid", gap:"0.85rem", marginBottom:"1.5rem" }}>
              {[{key:"twoFA",label:"Two-Factor Authentication (2FA)",desc:"Require OTP for admin logins"},{key:"forceHttps",label:"Force HTTPS",desc:"Redirect all HTTP to HTTPS"}].map(t => (
                <div key={t.key} style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"0.75rem 1rem",background:C.bg,borderRadius:"0.5rem",border:`1px solid ${C.border}` }}>
                  <div><div style={{ fontWeight:600,color:C.primary,fontSize:"0.9rem" }}>{t.label}</div><div style={{ fontSize:"0.8rem",color:C.muted }}>{t.desc}</div></div>
                  <Toggle checked={security[t.key]} onChange={v => setSec(t.key,v)} />
                </div>
              ))}
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem" }}>
              <div><FieldLabel>Session Timeout (minutes)</FieldLabel><FieldInput value={security.sessionTimeout} onChange={v => setSec("sessionTimeout",v)} type="number" /></div>
              <div><FieldLabel>Max Failed Login Attempts</FieldLabel><FieldInput value={security.loginAttempts} onChange={v => setSec("loginAttempts",v)} type="number" /></div>
            </div>
          </>}

          <div style={{ display:"flex", gap:"1rem", marginTop:"1.5rem", paddingTop:"1.25rem", borderTop:`1px solid ${C.border}` }}>
            <PrimaryBtn onClick={() => showToast("Settings saved successfully!")}>💾 Save Changes</PrimaryBtn>
            <SecondaryBtn onClick={() => showToast("Settings reverted to last saved")}>↺ Revert</SecondaryBtn>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─── REST API KEYS ────────────────────────────────────────────────────────────
const INIT_API_KEYS = [
  { id:1, description:"Shiprocket - API (2026-02-19 03:09:12)", keyEnd:"***48a04f6", user:"admin", permissions:"Read/Write", lastAccess:"March 13, 2026 at 9:02 am" },
  { id:2, description:"Flux",        keyEnd:"***2539105", user:"admin", permissions:"Read/Write", lastAccess:"January 20, 2026 at 10:40 am" },
  { id:3, description:"app mysite",  keyEnd:"***98cea23", user:"admin", permissions:"Read/Write", lastAccess:"January 22, 2026 at 2:54 am" },
  { id:4, description:"Tidio Live Chat - API (2025-12-02 09:40:48)", keyEnd:"***60b3c94", user:"admin", permissions:"Read",       lastAccess:"December 2, 2025 at 9:40 am" },
  { id:5, description:"AZZRO",       keyEnd:"***273e6dd", user:"admin", permissions:"Read/Write", lastAccess:"Unknown" },
];

function RestApiSection({ showToast }) {
  const [keys, setKeys] = useState(INIT_API_KEYS);
  const [search, setSearch] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newKey, setNewKey] = useState({ description:"", user:"admin (#1 – azzrostore@gmail.com)", permissions:"Read/Write" });
  const [generatedKey, setGeneratedKey] = useState(null);
  const [activeSubTab, setActiveSubTab] = useState("keys");
  const [copied, setCopied] = useState("");

  const SUB_TABS = [
    { id:"keys",    label:"REST API keys" },
    { id:"webhooks",label:"Webhooks" },
    { id:"legacy",  label:"Legacy API" },
  ];

  const filtered = keys.filter(k => k.description.toLowerCase().includes(search.toLowerCase()));

  const generateKey = () => {
    const ck = "ck_" + Math.random().toString(36).substring(2,30) + Math.random().toString(36).substring(2,15);
    const cs = "cs_" + Math.random().toString(36).substring(2,30) + Math.random().toString(36).substring(2,15);
    const newEntry = {
      id: Date.now(),
      description: newKey.description || `API Key (${new Date().toLocaleDateString()})`,
      keyEnd: "***" + ck.slice(-8),
      user: "admin",
      permissions: newKey.permissions,
      lastAccess: "Unknown",
    };
    setKeys(prev => [newEntry, ...prev]);
    setGeneratedKey({ ck, cs });
    showToast("API Key generated successfully!");
  };

  const copyText = (text, label) => {
    navigator.clipboard?.writeText(text).catch(() => {});
    setCopied(label);
    setTimeout(() => setCopied(""), 2000);
    showToast(`${label} copied to clipboard!`);
  };

  const revokeKey = (id) => {
    setKeys(prev => prev.filter(k => k.id !== id));
    showToast("API key revoked");
  };

  return (
    <div>
      <PageHeader title="REST API" breadcrumb="REST API Keys"
        action={!showAddForm && !generatedKey && <PrimaryBtn onClick={() => { setShowAddForm(true); setGeneratedKey(null); }}>+ Add key</PrimaryBtn>} />

      {/* Sub-tabs */}
      <div style={{ display:"flex", gap:"0.5rem", marginBottom:"1.5rem", borderBottom:`1px solid ${C.border}`, paddingBottom:"0.75rem" }}>
        {SUB_TABS.map(t => (
          <button key={t.id} onClick={() => setActiveSubTab(t.id)} style={{
            padding:"0.4rem 1rem", border:"none", background:"transparent", cursor:"pointer",
            fontFamily:"inherit", fontSize:"0.9rem", fontWeight: activeSubTab===t.id ? 700 : 500,
            color: activeSubTab===t.id ? C.accent : C.muted,
            borderBottom: activeSubTab===t.id ? `2px solid ${C.accent}` : "2px solid transparent",
            transition:"all 150ms" }}>{t.label}</button>
        ))}
      </div>

      {activeSubTab !== "keys" && (
        <Card style={{ marginBottom:0 }}>
          <div style={{ textAlign:"center", padding:"3rem", color:C.muted }}>
            <div style={{ fontSize:"3rem", marginBottom:"0.75rem" }}>🔗</div>
            <div style={{ fontWeight:600, color:"#364152" }}>{activeSubTab === "webhooks" ? "Webhooks" : "Legacy API"}</div>
            <div style={{ fontSize:"0.88rem" }}>Configure {activeSubTab === "webhooks" ? "webhook endpoints" : "legacy API v1 credentials"} here.</div>
          </div>
        </Card>
      )}

      {activeSubTab === "keys" && (
        <>
          {/* Key details — add form */}
          {(showAddForm || generatedKey) && (
            <Card header={<span style={{ fontWeight:700, color:C.primary }}>Key details</span>} style={{ marginBottom:"1.5rem" }}>
              {generatedKey ? (
                <>
                  <InfoBox type="success">✅ API Key generated successfully. Make sure to copy your new keys now as the secret key will be hidden once you leave this page.</InfoBox>
                  <div style={{ background:"rgba(255,61,113,0.05)", border:`1px solid rgba(255,61,113,0.2)`, borderRadius:"0.5rem",
                    padding:"0.85rem 1.1rem", marginBottom:"1.25rem", fontSize:"0.84rem", color:"#364152" }}>
                    <div style={{ marginBottom:"0.4rem" }}>■ API keys open up access to potentially sensitive information. Only share them with organizations you trust.</div>
                    <div>■ Stick to one key per client: this makes it easier to revoke access in the future for a single client, without causing disruption for others.</div>
                  </div>

                  {[
                    { label:"Consumer key",    val:generatedKey.ck,  id:"ck" },
                    { label:"Consumer secret", val:generatedKey.cs,  id:"cs" },
                  ].map(f => (
                    <div key={f.id} style={{ display:"grid", gridTemplateColumns:"160px 1fr auto", alignItems:"center", gap:"0.85rem", marginBottom:"1.25rem" }}>
                      <div style={{ fontWeight:600, color:C.primary, fontSize:"0.9rem" }}>{f.label}</div>
                      <div style={{ fontFamily:"monospace", fontSize:"0.82rem", background:C.bg, padding:"0.5rem 0.85rem",
                        border:`1px solid ${C.border}`, borderRadius:"0.4rem", userSelect:"all", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{f.val}</div>
                      <PrimaryBtn small onClick={() => copyText(f.val, f.label)}>
                        {copied === f.label ? "✓ Copied" : "Copy"}
                      </PrimaryBtn>
                    </div>
                  ))}

                  <div style={{ marginBottom:"1.25rem" }}>
                    <div style={{ fontWeight:600, color:C.primary, fontSize:"0.9rem", marginBottom:"0.6rem" }}>QRCode</div>
                    <div style={{ width:100, height:100, background:"#111", borderRadius:"0.5rem", display:"flex", alignItems:"center", justifyContent:"center", color:"white", fontSize:"0.7rem", textAlign:"center", padding:6 }}>
                      [QR Code]
                    </div>
                  </div>
                  <button onClick={() => { setGeneratedKey(null); setShowAddForm(false); setNewKey({ description:"", user:"admin (#1 – azzrostore@gmail.com)", permissions:"Read/Write" }); }}
                    style={{ background:"none", border:"none", color:C.danger, fontFamily:"inherit", fontSize:"0.88rem", cursor:"pointer", fontWeight:600 }}>
                    ← Back to key list
                  </button>
                </>
              ) : (
                <>
                  <InfoBox type="info">
                    <div style={{ marginBottom:"0.35rem" }}>■ API keys open up access to potentially sensitive information. Only share them with organizations you trust.</div>
                    <div>■ Stick to one key per client: this makes it easier to revoke access in the future for a single client, without causing disruption for others.</div>
                  </InfoBox>
                  <div style={{ display:"grid", gap:"1rem", marginBottom:"1.25rem" }}>
                    <div>
                      <FieldLabel>Description</FieldLabel>
                      <FieldInput value={newKey.description} onChange={v => setNewKey(p => ({ ...p, description:v }))} placeholder="Add a meaningful description, including a note of the person, company or app you are sharing the key with." />
                      <div style={{ fontSize:"0.78rem", color:C.muted, marginTop:"0.25rem" }}>Add a meaningful description, including a note of the person, company or app you are sharing the key with.</div>
                    </div>
                    <div>
                      <FieldLabel>User</FieldLabel>
                      <FieldSelect value={newKey.user} onChange={v => setNewKey(p => ({ ...p, user:v }))}>
                        <option>admin (#1 – azzrostore@gmail.com)</option>
                        <option>editor (#2 – editor@azzro.in)</option>
                      </FieldSelect>
                    </div>
                    <div>
                      <FieldLabel>Permissions</FieldLabel>
                      <FieldSelect value={newKey.permissions} onChange={v => setNewKey(p => ({ ...p, permissions:v }))}>
                        <option>Read</option>
                        <option>Write</option>
                        <option>Read/Write</option>
                      </FieldSelect>
                    </div>
                  </div>
                  <div style={{ display:"flex", gap:"0.75rem" }}>
                    <PrimaryBtn onClick={generateKey}>🔑 Generate API key</PrimaryBtn>
                    <SecondaryBtn onClick={() => setShowAddForm(false)}>Cancel</SecondaryBtn>
                  </div>
                </>
              )}
            </Card>
          )}

          {/* Keys table */}
          {!generatedKey && (
            <Card style={{ marginBottom:0 }}
              header={<div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", width:"100%" }}>
                <span style={{ fontWeight:700, color:C.primary }}>🔗 API Keys ({filtered.length})</span>
                <div style={{ display:"flex", gap:"0.5rem", alignItems:"center" }}>
                  <SearchInput value={search} onChange={setSearch} placeholder="Search key…" />
                </div>
              </div>}>
              <div style={{ overflowX:"auto" }}>
                <table style={{ width:"100%", borderCollapse:"collapse" }}>
                  <thead><tr>{["Description","Consumer key ending in","User","Permissions","Last access","Actions"].map(h => <TH key={h}>{h}</TH>)}</tr></thead>
                  <tbody>
                    {filtered.length === 0
                      ? <tr><td colSpan={6} style={{ textAlign:"center", padding:"2.5rem", color:C.muted }}>No API keys found</td></tr>
                      : filtered.map(k => (
                        <TR key={k.id}>
                          <TD style={{ fontWeight:600, color:C.accent }}>{k.description}</TD>
                          <TD style={{ fontFamily:"monospace", fontSize:"0.82rem" }}>{k.keyEnd}</TD>
                          <TD style={{ color:C.accent }}>{k.user}</TD>
                          <TD><Badge type={k.permissions === "Read/Write" ? "success" : k.permissions === "Write" ? "warning" : "info"}>{k.permissions}</Badge></TD>
                          <TD style={{ fontSize:"0.82rem", color:C.muted }}>{k.lastAccess}</TD>
                          <TD>
                            <div style={{ display:"flex", gap:"0.35rem" }}>
                              <ActionBtn icon="✏️" title="Edit" onClick={() => showToast(`Editing key: ${k.description}`)} />
                              <ActionBtn icon="🗑️" title="Revoke" variant="danger" onClick={() => revokeKey(k.id)} />
                            </div>
                          </TD>
                        </TR>
                      ))}
                  </tbody>
                </table>
              </div>
              <div style={{ textAlign:"right", fontSize:"0.82rem", color:C.muted, marginTop:"0.75rem" }}>{filtered.length} items</div>
            </Card>
          )}
        </>
      )}
    </div>
  );
}

// ─── GENERIC PLACEHOLDER ──────────────────────────────────────────────────────
function GenericSection({ icon, sectionTitle, breadcrumb, title, description }) {
  return (
    <div>
      <PageHeader title={sectionTitle} breadcrumb={breadcrumb} />
      <Card style={{ marginBottom:0 }}>
        <div style={{ textAlign:"center", padding:"3.5rem 1.5rem", color:C.muted }}>
          <div style={{ fontSize:"4rem", marginBottom:"1rem", opacity:0.25 }}>{icon}</div>
          <div style={{ fontSize:"1.2rem", fontWeight:600, color:"#364152", marginBottom:"0.5rem" }}>{title}</div>
          <p style={{ fontSize:"0.9rem" }}>{description}</p>
        </div>
      </Card>
    </div>
  );
}

// ─── SECTION ROUTER ──────────────────────────────────────────────────────────
function SectionRouter({ section, navigate, showToast }) {
  const G = (props) => <GenericSection {...props} />;
  const CS = (props) => <ComingSoonSection {...props} />;

  switch(section) {
    case "dashboard":   return <DashboardSection navigate={navigate} />;
    case "sellers":     return <SellersSection showToast={showToast} />;
    case "orders":      return <OrdersSection showToast={showToast} />;
    case "customers":   return <CustomersSection showToast={showToast} />;
    case "products":    return <ProductsSection showToast={showToast} />;
    case "settings":    return <SettingsSection showToast={showToast} />;
    case "activity":    return <ActivitySection />;

    // NEW: Operations
    case "shipping_zones": return <ShippingZonesSection showToast={showToast} />;
    case "payment_gw":     return <PaymentGatewaySection showToast={showToast} />;

    // NEW: Vendor
    case "vendor_dashboard":   return <VendorDashboardSection showToast={showToast} />;
    case "vendor_commissions": return <VendorCommissionsSection showToast={showToast} />;
    case "vendor_payouts":     return <VendorPayoutsSection showToast={showToast} />;

    // NEW: Storefront
    case "homepage_editor": return <HomepageEditor showToast={showToast} />;

    // Commerce placeholders
    case "inventory": return <G icon="📊" sectionTitle="Inventory Management" breadcrumb="Inventory" title="Inventory Management Module" description="Stock tracking, warehouse management, low stock alerts, and inventory analytics." />;

    // Finance
    case "payments":  return <CS icon="💳" sectionTitle="Payment Management" breadcrumb="Payments" description="Full payment processing, reconciliation, and refund management will activate once payment gateway is configured." features={[{icon:"💰",label:"Transaction History"},{icon:"↩️",label:"Refund Management"},{icon:"📊",label:"Revenue Reports"},{icon:"🔗",label:"Gateway Webhooks"}]} />;
    case "finances":  return <CS icon="💰" sectionTitle="Finances" breadcrumb="Finances" description="Revenue tracking, payout management, financial statements, and tax summaries." features={[{icon:"📈",label:"Revenue Trends"},{icon:"🏦",label:"Seller Payouts"},{icon:"🧾",label:"Financial Reports"},{icon:"📉",label:"Expense Tracking"}]} />;
    case "invoices":  return <CS icon="📄" sectionTitle="Invoices" breadcrumb="Invoices" description="Auto-generated GST-compliant invoices will be issued for every order." features={[{icon:"🧾",label:"GST Invoices"},{icon:"📧",label:"Email Delivery"},{icon:"📥",label:"Bulk Download"},{icon:"🔍",label:"Invoice Search"}]} />;

    // Marketing
    case "marketing":  return <CS icon="📣" sectionTitle="Marketing Campaigns" breadcrumb="Campaigns" description="Email, SMS, and push notification campaigns." features={[{icon:"✉️",label:"Email Campaigns"},{icon:"📱",label:"SMS Marketing"},{icon:"🔔",label:"Push Notifications"},{icon:"📊",label:"Campaign Analytics"}]} />;
    case "promotions": return <CS icon="🎁" sectionTitle="Promotions" breadcrumb="Promotions" description="Flash sales, bundle deals, and seasonal discount campaigns." features={[{icon:"⚡",label:"Flash Sales"},{icon:"📦",label:"Bundle Deals"},{icon:"🛒",label:"Cart Rules"},{icon:"📅",label:"Scheduled Offers"}]} />;
    case "coupons":    return <CS icon="🎫" sectionTitle="Coupons" breadcrumb="Coupons" description="Coupon code engine, usage tracking and redemption analytics." features={[{icon:"🎁",label:"Discount Codes"},{icon:"📊",label:"Usage Analytics"},{icon:"⏰",label:"Expiry Control"},{icon:"👤",label:"User-specific Coupons"}]} />;

    // Operations
    case "returns":   return <CS icon="↩️" sectionTitle="Returns" breadcrumb="Returns" description="Return request processing, refund initiation, and reverse logistics." features={[{icon:"📋",label:"Return Requests"},{icon:"🚚",label:"Reverse Logistics"},{icon:"💳",label:"Refund Processing"},{icon:"📊",label:"Return Reports"}]} />;

    // Content
    case "cms":        return <G icon="📝" sectionTitle="Content Management" breadcrumb="CMS" title="CMS Module" description="Manage pages, banners, SEO, blog posts, and website content." />;
    case "media":      return <G icon="🖼️" sectionTitle="Media Library" breadcrumb="Media" title="Media Library Module" description="Upload, organise, and manage all images, videos, and documents." />;
    case "categories": return <G icon="📁" sectionTitle="Categories" breadcrumb="Categories" title="Categories Module" description="Manage product categories, subcategories, and category attributes." />;

    // Support
    case "tickets":   return <G icon="🎫" sectionTitle="Support Tickets" breadcrumb="Tickets" title="Support Module" description="Customer support tickets, helpdesk, live chat, and knowledge base." />;
    case "reviews":   return <G icon="⭐" sectionTitle="Reviews" breadcrumb="Reviews" title="Reviews Module" description="Moderate customer reviews, seller ratings, and product feedback." />;
    case "reports":   return <G icon="📊" sectionTitle="Reports" breadcrumb="Reports" title="Reports Module" description="Download and schedule custom reports for sales, inventory, and customer data." />;

    // System
    case "analytics": return <G icon="📈" sectionTitle="Analytics" breadcrumb="Analytics" title="Analytics Module" description="Real-time data insights, sales analytics, customer behavior, and performance reports." />;
    case "users":     return <G icon="👨‍💼" sectionTitle="Users & Role Management" breadcrumb="Users" title="User Management Module" description="Admin users, roles, permissions, and access control lists." />;
    case "rest_api":  return <RestApiSection showToast={showToast} />;

    default: return <DashboardSection navigate={navigate} />;
  }
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function AzzroAdminDashboard() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3200);
  };

  const navigate = (id) => {
    setActiveSection(id);
    setSidebarOpen(false);
    if (typeof window !== "undefined") window.scrollTo({ top:0, behavior:"smooth" });
  };

  const handleGlobalSearch = (e) => {
    if (e.key !== "Enter" || !searchQuery.trim()) return;
    const q = searchQuery.toLowerCase();
    const allItems = NAV_SECTIONS.flatMap(s => s.items);
    const match = allItems.find(item => item.label.toLowerCase().includes(q));
    if (match) { navigate(match.id); setSearchQuery(""); }
    else showToast(`No section found for "${searchQuery}"`);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        body{font-family:'Bricolage Grotesque',sans-serif;background:${C.bg};color:${C.text};line-height:1.6}
        @keyframes slideIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        .sb-scroll::-webkit-scrollbar{width:4px}
        .sb-scroll::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.15);border-radius:4px}
        @media(max-width:1024px){.sb{transform:translateX(-100%)!important}.sb.open{transform:translateX(0)!important}.ml{margin-left:0!important}.hbg{display:flex!important}}
        @media(max-width:768px){.srch{display:none!important}.uname{display:none!important}}
      `}</style>

      <div style={{ display:"flex", minHeight:"100vh" }}>
        {/* SIDEBAR */}
        <aside className={`sb sb-scroll${sidebarOpen ? " open" : ""}`} style={{
          position:"fixed", top:0, left:0, bottom:0, width:280,
          background:C.primary, color:"white", padding:"1.5rem 0",
          overflowY:"auto", zIndex:100, boxShadow:"2px 0 20px rgba(0,0,0,0.15)",
          transition:"transform 280ms ease" }}>

          <div style={{ padding:"0 1.5rem", marginBottom:"2rem", display:"flex", alignItems:"center", gap:"0.85rem" }}>
            <div style={{ width:42, height:42, background:`linear-gradient(135deg,${C.accent},${C.accentDk})`,
              borderRadius:"0.75rem", display:"flex", alignItems:"center", justifyContent:"center",
              fontWeight:700, fontSize:"1.1rem", boxShadow:`0 4px 12px rgba(0,217,255,0.3)` }}>Az</div>
            <div style={{ fontSize:"1.4rem", fontWeight:700, letterSpacing:"-0.02em" }}>Azzro Admin</div>
          </div>

          <nav>
            {NAV_SECTIONS.map(sec => (
              <div key={sec.title} style={{ marginBottom:"1.2rem" }}>
                <div style={{ fontSize:"0.68rem", textTransform:"uppercase", letterSpacing:"0.12em",
                  color:"#9AA4B2", padding:"0 1.5rem", marginBottom:"0.25rem", fontWeight:600 }}>{sec.title}</div>
                {sec.items.map(item => {
                  const active = activeSection === item.id;
                  return (
                    <button key={item.id} onClick={() => navigate(item.id)}
                      style={{ width:"100%", display:"flex", alignItems:"center", gap:"0.7rem",
                        padding:"0.65rem 1.5rem",
                        color: active ? C.accent : "rgba(255,255,255,0.72)",
                        background: active ? "rgba(0,217,255,0.1)" : "transparent",
                        border:"none", borderLeft:`3px solid ${active ? C.accent : "transparent"}`,
                        fontFamily:"inherit", fontSize:"0.9rem", fontWeight: active ? 600 : 400,
                        cursor:"pointer", transition:"all 180ms", textAlign:"left" }}
                      onMouseOver={e => { if(!active){ e.currentTarget.style.background="rgba(255,255,255,0.05)"; e.currentTarget.style.color="white"; }}}
                      onMouseOut={e => { if(!active){ e.currentTarget.style.background="transparent"; e.currentTarget.style.color="rgba(255,255,255,0.72)"; }}}>
                      <span style={{ fontSize:"1rem" }}>{item.icon}</span>
                      <span style={{ flex:1 }}>{item.label}</span>
                      {item.badge && <span style={{ background:C.danger, color:"white", fontSize:"0.67rem",
                        padding:"0.1rem 0.42rem", borderRadius:10, fontWeight:700 }}>{item.badge}</span>}
                    </button>
                  );
                })}
              </div>
            ))}
          </nav>
        </aside>

        {/* MAIN */}
        <div className="ml" style={{ marginLeft:280, flex:1, display:"flex", flexDirection:"column", minHeight:"100vh" }}>
          <header style={{ height:70, background:"white", padding:"0 2rem",
            display:"flex", alignItems:"center", justifyContent:"space-between",
            borderBottom:`1px solid ${C.border}`, position:"sticky", top:0, zIndex:90,
            boxShadow:"0 1px 3px rgba(0,0,0,0.06)" }}>

            <button className="hbg" onClick={() => setSidebarOpen(p => !p)}
              style={{ display:"none", background:"none", border:"none", cursor:"pointer",
                fontSize:"1.3rem", marginRight:"0.75rem", color:C.muted, padding:4 }}>☰</button>

            <div className="srch" style={{ display:"flex", alignItems:"center", background:C.bg,
              borderRadius:"0.75rem", padding:"0.48rem 1rem", width:370, border:`1px solid ${C.border}` }}>
              <span style={{ color:C.muted, marginRight:"0.5rem", fontSize:"0.9rem" }}>🔍</span>
              <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={handleGlobalSearch}
                placeholder="Search sections… press Enter to navigate"
                style={{ border:"none", background:"transparent", outline:"none",
                  width:"100%", fontFamily:"inherit", fontSize:"0.88rem" }} />
            </div>

            <div style={{ display:"flex", alignItems:"center", gap:"0.55rem" }}>
              {[
                { icon:"🕐", tip:"Activity Log",  fn:() => navigate("activity") },
                { icon:"🔔", tip:"Notifications", fn:() => showToast("3 new notifications"), badge:true },
                { icon:"✉️", tip:"Messages",      fn:() => showToast("No new messages") },
              ].map((b,i) => (
                <button key={i} title={b.tip} onClick={b.fn}
                  style={{ width:42, height:42, borderRadius:"0.5rem", border:"none",
                    background:C.bg, cursor:"pointer", display:"flex", alignItems:"center",
                    justifyContent:"center", fontSize:"1rem", position:"relative", transition:"background 150ms" }}
                  onMouseOver={e => e.currentTarget.style.background=C.border}
                  onMouseOut={e => e.currentTarget.style.background=C.bg}>
                  {b.icon}
                  {b.badge && <div style={{ position:"absolute", top:7, right:7,
                    width:8, height:8, background:C.danger, borderRadius:"50%", border:"2px solid white" }} />}
                </button>
              ))}

              <button onClick={() => navigate("settings")}
                style={{ display:"flex", alignItems:"center", gap:"0.6rem",
                  padding:"0.38rem 0.7rem", borderRadius:"0.75rem", cursor:"pointer",
                  border:"none", background:"transparent", fontFamily:"inherit", transition:"background 150ms" }}
                onMouseOver={e => e.currentTarget.style.background=C.bg}
                onMouseOut={e => e.currentTarget.style.background="transparent"}>
                <div style={{ width:36, height:36, borderRadius:"50%",
                  background:`linear-gradient(135deg,${C.accent},${C.accentDk})`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontWeight:700, color:"white", fontSize:"0.88rem" }}>AK</div>
                <div className="uname" style={{ textAlign:"left" }}>
                  <div style={{ fontWeight:600, fontSize:"0.87rem", color:C.primary }}>Admin User</div>
                  <div style={{ fontSize:"0.71rem", color:C.muted }}>Super Admin</div>
                </div>
                <span style={{ color:C.muted, fontSize:"0.65rem" }}>▼</span>
              </button>
            </div>
          </header>

          <main style={{ flex:1, padding:"2.5rem", overflowY:"auto" }}>
            <SectionRouter section={activeSection} navigate={navigate} showToast={showToast} />
          </main>
        </div>
      </div>

      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)}
          style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", zIndex:99 }} />
      )}

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </>
  );
}
