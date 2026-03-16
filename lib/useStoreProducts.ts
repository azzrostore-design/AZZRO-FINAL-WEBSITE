// lib/useStoreProducts.ts
// Fetches products from your Azzro Next.js API
// Replace the API endpoint to match your actual products route

export interface StoreProduct {
  id: string;
  name: string;
  price: number;
  image: string;       // URL
  category: string;    // "tops" | "bottoms" | "dresses" | "ethnic" | etc.
  brand?: string;
  slug?: string;
}

// ── Fetch products from your store API ──────────────────────────
export async function fetchStoreProducts(params?: {
  category?: string;
  search?: string;
  limit?: number;
}): Promise<StoreProduct[]> {
  try {
    const qs = new URLSearchParams();
    if (params?.category) qs.set("category", params.category);
    if (params?.search)   qs.set("search", params.search);
    if (params?.limit)    qs.set("limit", String(params.limit));

    const res = await fetch(`/api/products?${qs.toString()}`);
    if (!res.ok) throw new Error("Failed to fetch products");
    const data = await res.json();

    // Normalize — adjust field names to match your actual API response
    const products: StoreProduct[] = (data.products || data.data || data || []).map((p: any) => ({
      id:       p.id || p._id,
      name:     p.name || p.title,
      price:    p.price || p.sale_price || 0,
      image:    p.image || p.images?.[0]?.url || p.thumbnail || "",
      category: p.category?.name || p.category || "",
      brand:    p.brand?.name || p.brand || "",
      slug:     p.slug || p.id,
    }));

    return products;
  } catch {
    // Return mock products if API not available yet
    return MOCK_PRODUCTS;
  }
}

// ── Convert product image URL → base64 for fal.ai ───────────────
export async function imageUrlToBase64(url: string): Promise<string> {
  const res  = await fetch(url);
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror   = reject;
    reader.readAsDataURL(blob);
  });
}

// ── Mock products for development ───────────────────────────────
export const MOCK_PRODUCTS: StoreProduct[] = [
  { id:"1", name:"Floral Anarkali Kurta",    price:1499, category:"ethnic",   image:"https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=300&h=400&fit=crop" },
  { id:"2", name:"White Linen Shirt",        price:899,  category:"tops",     image:"https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=300&h=400&fit=crop" },
  { id:"3", name:"High-Waist Jeans",         price:1299, category:"bottoms",  image:"https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=300&h=400&fit=crop" },
  { id:"4", name:"Silk Saree - Royal Blue",  price:3499, category:"ethnic",   image:"https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=300&h=400&fit=crop" },
  { id:"5", name:"Printed Maxi Dress",       price:1799, category:"dresses",  image:"https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=300&h=400&fit=crop" },
  { id:"6", name:"Crop Blazer - Beige",      price:2199, category:"tops",     image:"https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=300&h=400&fit=crop" },
  { id:"7", name:"Palazzo Pants - Black",    price:999,  category:"bottoms",  image:"https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?w=300&h=400&fit=crop" },
  { id:"8", name:"Embroidered Kurti",        price:1199, category:"ethnic",   image:"https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=300&h=400&fit=crop" },
  { id:"9", name:"Lehenga Set - Maroon",     price:4999, category:"ethnic",   image:"https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=300&h=400&fit=crop" },
  { id:"10",name:"Striped Co-ord Set",       price:1899, category:"dresses",  image:"https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=300&h=400&fit=crop" },
  { id:"11",name:"Denim Shorts",             price:799,  category:"bottoms",  image:"https://images.unsplash.com/photo-1591195853828-11db59a44f43?w=300&h=400&fit=crop" },
  { id:"12",name:"Flowy Boho Top",           price:699,  category:"tops",     image:"https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=300&h=400&fit=crop" },
];

export const CATEGORIES = ["All","tops","bottoms","dresses","ethnic"];
