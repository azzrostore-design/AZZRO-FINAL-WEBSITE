// lib/useStoreProducts.ts

export interface StoreProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
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
    if (params?.search)   qs.set("search",   params.search);
    if (params?.limit)    qs.set("limit",     String(params.limit));

    const res = await fetch(`/api/products?${qs.toString()}`);
    if (!res.ok) throw new Error("Failed to fetch products");
    const data = await res.json();

    const products: StoreProduct[] = (data.products || data.data || data || []).map((p: any) => ({
      id:       p.id || p._id,
      name:     p.name || p.title,
      price:    p.price || p.sale_price || 0,
      image:    p.image || p.images?.[0] || p.thumbnail || "",
      category: p.category?.name || p.category || "",
      brand:    p.brand?.name || p.brand || "",
      slug:     p.slug || p.id || p._id,
    }));

    return products;
  } catch {
    return MOCK_PRODUCTS;
  }
}

// ── Convert product image URL → base64 for fal.ai ───────────────
// Uses /api/image-proxy to avoid CORS issues with external URLs.
// Also validates the response is actually an image before converting,
// preventing the "No number after minus sign" JSON error in /api/tryon.
export async function imageUrlToBase64(url: string): Promise<string> {
  if (!url) throw new Error("No image URL provided");

  // Route through our proxy to avoid CORS blocks on external images
  const proxyUrl = `/api/image-proxy?url=${encodeURIComponent(url)}`;
  const res = await fetch(proxyUrl);

  if (!res.ok) {
    throw new Error(`Image fetch failed (${res.status}) for: ${url}`);
  }

  const contentType = res.headers.get("content-type") || "";
  if (!contentType.startsWith("image/")) {
    throw new Error(`URL did not return an image (got: ${contentType})`);
  }

  const blob = await res.blob();
  if (blob.size === 0) {
    throw new Error(`Empty image response for: ${url}`);
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      if (!result || !result.startsWith("data:image/")) {
        reject(new Error("FileReader did not produce a valid image data URL"));
        return;
      }
      resolve(result);
    };
    reader.onerror = () => reject(new Error("FileReader failed to read image"));
    reader.readAsDataURL(blob);
  });
}

// ── Mock products — picsum.photos (always works, no auth needed) ─
export const MOCK_PRODUCTS: StoreProduct[] = [
  { id:"1",  name:"Floral Anarkali Kurta",  price:1499, category:"ethnic",  image:"https://picsum.photos/seed/anarkali/300/400"  },
  { id:"2",  name:"White Linen Shirt",       price:899,  category:"tops",    image:"https://picsum.photos/seed/shirt/300/400"     },
  { id:"3",  name:"High-Waist Jeans",        price:1299, category:"bottoms", image:"https://picsum.photos/seed/jeans/300/400"     },
  { id:"4",  name:"Silk Saree - Royal Blue", price:3499, category:"ethnic",  image:"https://picsum.photos/seed/saree/300/400"     },
  { id:"5",  name:"Printed Maxi Dress",      price:1799, category:"dresses", image:"https://picsum.photos/seed/maxi/300/400"      },
  { id:"6",  name:"Crop Blazer - Beige",     price:2199, category:"tops",    image:"https://picsum.photos/seed/blazer/300/400"    },
  { id:"7",  name:"Palazzo Pants - Black",   price:999,  category:"bottoms", image:"https://picsum.photos/seed/palazzo/300/400"   },
  { id:"8",  name:"Embroidered Kurti",       price:1199, category:"ethnic",  image:"https://picsum.photos/seed/kurti/300/400"     },
  { id:"9",  name:"Lehenga Set - Maroon",    price:4999, category:"ethnic",  image:"https://picsum.photos/seed/lehenga/300/400"   },
  { id:"10", name:"Striped Co-ord Set",      price:1899, category:"dresses", image:"https://picsum.photos/seed/coord/300/400"     },
  { id:"11", name:"Denim Shorts",            price:799,  category:"bottoms", image:"https://picsum.photos/seed/shorts/300/400"    },
  { id:"12", name:"Flowy Boho Top",          price:699,  category:"tops",    image:"https://picsum.photos/seed/boho/300/400"      },
];

export const CATEGORIES = ["All", "tops", "bottoms", "dresses", "ethnic"];
