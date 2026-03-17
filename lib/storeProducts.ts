// lib/storeProducts.ts
// Central product catalog — replace with your real API/DB calls

export interface StoreProduct {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  category: "Tops" | "Bottoms" | "Outerwear" | "Footwear" | "Headwear" | "Accessories" | "Dresses";
  color: string;
  colorHex: string;
  image: string;
  tags: string[];        // e.g. ["casual", "summer", "minimal"]
  occasions: string[];   // e.g. ["date", "office", "party"]
  seasons: string[];
  rating: number;
  inStock: boolean;
  slug: string;
}

export const STORE_PRODUCTS: StoreProduct[] = [
  // ── Tops ──
  {
    id: "top-001",
    name: "Ivory Linen Shirt",
    brand: "Azzro Basics",
    price: 1299,
    category: "Tops",
    color: "Ivory",
    colorHex: "#F5F0E8",
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=300&h=380&fit=crop&crop=top",
    tags: ["minimal", "classic", "office", "casual"],
    occasions: ["office", "casual", "coffee", "date"],
    seasons: ["spring", "summer"],
    rating: 4.5,
    inStock: true,
    slug: "/products/ivory-linen-shirt",
  },
  {
    id: "top-002",
    name: "Black Turtleneck",
    brand: "Azzro Premium",
    price: 1599,
    category: "Tops",
    color: "Black",
    colorHex: "#1A1A1A",
    image: "https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=300&h=380&fit=crop&crop=top",
    tags: ["minimal", "timeless", "office", "elegant"],
    occasions: ["office", "date", "party", "interview"],
    seasons: ["autumn", "winter"],
    rating: 4.8,
    inStock: true,
    slug: "/products/black-turtleneck",
  },
  {
    id: "top-003",
    name: "Floral Chiffon Blouse",
    brand: "Azzro Bloom",
    price: 1199,
    category: "Tops",
    color: "Multicolor",
    colorHex: "#E8B4C4",
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=300&h=380&fit=crop&crop=top",
    tags: ["bohemian", "trendy", "feminine"],
    occasions: ["date", "party", "coffee", "casual"],
    seasons: ["spring", "summer"],
    rating: 4.3,
    inStock: true,
    slug: "/products/floral-chiffon-blouse",
  },
  {
    id: "top-004",
    name: "Mustard Crop Top",
    brand: "Azzro Street",
    price: 799,
    category: "Tops",
    color: "Mustard",
    colorHex: "#D4A017",
    image: "https://images.unsplash.com/photo-1503342394128-c104d54dba01?w=300&h=380&fit=crop&crop=top",
    tags: ["streetwear", "trendy", "casual"],
    occasions: ["casual", "coffee", "beach"],
    seasons: ["summer"],
    rating: 4.1,
    inStock: true,
    slug: "/products/mustard-crop-top",
  },
  // ── Bottoms ──
  {
    id: "bot-001",
    name: "Wide Leg White Trousers",
    brand: "Azzro Basics",
    price: 1899,
    category: "Bottoms",
    color: "White",
    colorHex: "#F5F5F5",
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4b4f0a?w=300&h=380&fit=crop&crop=top",
    tags: ["minimal", "elegant", "summer"],
    occasions: ["office", "date", "casual", "party"],
    seasons: ["spring", "summer"],
    rating: 4.6,
    inStock: true,
    slug: "/products/wide-leg-white-trousers",
  },
  {
    id: "bot-002",
    name: "Indigo Wide-Leg Jeans",
    brand: "Azzro Denim",
    price: 2299,
    category: "Bottoms",
    color: "Indigo",
    colorHex: "#4A6FA5",
    image: "https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=300&h=380&fit=crop&crop=top",
    tags: ["casual", "streetwear", "classic"],
    occasions: ["casual", "coffee", "date"],
    seasons: ["autumn", "winter", "spring"],
    rating: 4.7,
    inStock: true,
    slug: "/products/indigo-wide-leg-jeans",
  },
  {
    id: "bot-003",
    name: "Pleated Midi Skirt",
    brand: "Azzro Bloom",
    price: 1699,
    category: "Bottoms",
    color: "Dusty Rose",
    colorHex: "#D4A0A0",
    image: "https://images.unsplash.com/photo-1583496661160-fb5106ade5fe?w=300&h=380&fit=crop&crop=top",
    tags: ["feminine", "elegant", "trendy"],
    occasions: ["date", "party", "coffee"],
    seasons: ["spring", "summer"],
    rating: 4.4,
    inStock: true,
    slug: "/products/pleated-midi-skirt",
  },
  {
    id: "bot-004",
    name: "Olive Cargo Pants",
    brand: "Azzro Street",
    price: 1999,
    category: "Bottoms",
    color: "Olive",
    colorHex: "#6B7A3A",
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=300&h=380&fit=crop&crop=top",
    tags: ["streetwear", "casual", "utilitarian"],
    occasions: ["casual", "travel", "coffee"],
    seasons: ["autumn", "spring"],
    rating: 4.2,
    inStock: true,
    slug: "/products/olive-cargo-pants",
  },
  // ── Outerwear ──
  {
    id: "out-001",
    name: "Camel Wool Coat",
    brand: "Azzro Premium",
    price: 5999,
    originalPrice: 7499,
    category: "Outerwear",
    color: "Camel",
    colorHex: "#C19A6B",
    image: "https://images.unsplash.com/photo-1548624313-0396c75e4b1a?w=300&h=380&fit=crop&crop=top",
    tags: ["classic", "elegant", "timeless"],
    occasions: ["office", "date", "party"],
    seasons: ["autumn", "winter"],
    rating: 4.9,
    inStock: true,
    slug: "/products/camel-wool-coat",
  },
  {
    id: "out-002",
    name: "White Denim Jacket",
    brand: "Azzro Denim",
    price: 2499,
    category: "Outerwear",
    color: "White",
    colorHex: "#F0EDE7",
    image: "https://images.unsplash.com/photo-1601333144130-8cbb312386b6?w=300&h=380&fit=crop&crop=top",
    tags: ["casual", "streetwear", "trendy"],
    occasions: ["casual", "coffee", "beach"],
    seasons: ["spring", "summer"],
    rating: 4.3,
    inStock: true,
    slug: "/products/white-denim-jacket",
  },
  // ── Footwear ──
  {
    id: "sho-001",
    name: "Tan Block Heels",
    brand: "Azzro Steps",
    price: 2999,
    category: "Footwear",
    color: "Tan",
    colorHex: "#C4955A",
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=300&h=380&fit=crop",
    tags: ["elegant", "classic", "office"],
    occasions: ["office", "date", "party"],
    seasons: ["spring", "summer", "autumn"],
    rating: 4.6,
    inStock: true,
    slug: "/products/tan-block-heels",
  },
  {
    id: "sho-002",
    name: "White Sneakers",
    brand: "Azzro Sport",
    price: 1999,
    category: "Footwear",
    color: "White",
    colorHex: "#F5F5F5",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=380&fit=crop",
    tags: ["casual", "streetwear", "minimal"],
    occasions: ["casual", "coffee", "travel"],
    seasons: ["spring", "summer"],
    rating: 4.8,
    inStock: true,
    slug: "/products/white-sneakers",
  },
  {
    id: "sho-003",
    name: "Brown Strappy Sandals",
    brand: "Azzro Steps",
    price: 1799,
    category: "Footwear",
    color: "Brown",
    colorHex: "#8B6914",
    image: "https://images.unsplash.com/photo-1562273138-f46be4ebdf33?w=300&h=380&fit=crop",
    tags: ["bohemian", "casual", "summer"],
    occasions: ["beach", "casual", "date"],
    seasons: ["summer"],
    rating: 4.4,
    inStock: true,
    slug: "/products/brown-strappy-sandals",
  },
  // ── Accessories ──
  {
    id: "acc-001",
    name: "Gold Chain Necklace",
    brand: "Azzro Jewels",
    price: 899,
    category: "Accessories",
    color: "Gold",
    colorHex: "#D4AF37",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=300&h=380&fit=crop",
    tags: ["elegant", "minimal", "classic"],
    occasions: ["date", "party", "office"],
    seasons: ["all"],
    rating: 4.7,
    inStock: true,
    slug: "/products/gold-chain-necklace",
  },
  {
    id: "acc-002",
    name: "Leather Tote Bag",
    brand: "Azzro Carry",
    price: 3499,
    category: "Accessories",
    color: "Black",
    colorHex: "#2A2A2A",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=300&h=380&fit=crop",
    tags: ["classic", "office", "minimal"],
    occasions: ["office", "casual", "travel"],
    seasons: ["all"],
    rating: 4.8,
    inStock: true,
    slug: "/products/leather-tote-bag",
  },
  {
    id: "acc-003",
    name: "Silk Scarf",
    brand: "Azzro Bloom",
    price: 699,
    category: "Accessories",
    color: "Multicolor",
    colorHex: "#E8B4D0",
    image: "https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?w=300&h=380&fit=crop",
    tags: ["bohemian", "trendy", "feminine"],
    occasions: ["casual", "date", "coffee"],
    seasons: ["spring", "summer"],
    rating: 4.3,
    inStock: true,
    slug: "/products/silk-scarf",
  },
  // ── Dresses ──
  {
    id: "drs-001",
    name: "Sage Wrap Dress",
    brand: "Azzro Bloom",
    price: 2499,
    category: "Dresses",
    color: "Sage",
    colorHex: "#8A9E7A",
    image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=300&h=380&fit=crop&crop=top",
    tags: ["feminine", "elegant", "minimal"],
    occasions: ["date", "party", "coffee"],
    seasons: ["spring", "summer"],
    rating: 4.7,
    inStock: true,
    slug: "/products/sage-wrap-dress",
  },
  {
    id: "drs-002",
    name: "Black Midi Dress",
    brand: "Azzro Premium",
    price: 2999,
    category: "Dresses",
    color: "Black",
    colorHex: "#1A1A1A",
    image: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=300&h=380&fit=crop&crop=top",
    tags: ["classic", "elegant", "timeless"],
    occasions: ["party", "date", "office"],
    seasons: ["autumn", "winter"],
    rating: 4.9,
    inStock: true,
    slug: "/products/black-midi-dress",
  },
];

// ── Helper functions ──────────────────────────────────────────────────────────

export function getProductsByCategory(category: StoreProduct["category"]) {
  return STORE_PRODUCTS.filter((p) => p.category === category && p.inStock);
}

export function getProductsByOccasion(occasion: string, limit = 6) {
  return STORE_PRODUCTS
    .filter((p) => p.occasions.includes(occasion.toLowerCase()) && p.inStock)
    .slice(0, limit);
}

export function getProductsByTags(tags: string[], limit = 8) {
  return STORE_PRODUCTS
    .filter((p) => tags.some((t) => p.tags.includes(t)) && p.inStock)
    .slice(0, limit);
}

export function buildOutfitFromOccasion(occasion: string): {
  top?: StoreProduct;
  bottom?: StoreProduct;
  outer?: StoreProduct;
  shoes?: StoreProduct;
  accessory?: StoreProduct;
} {
  const occ = occasion.toLowerCase();
  const tops = STORE_PRODUCTS.filter(p => p.category === "Tops" && p.occasions.includes(occ) && p.inStock);
  const bottoms = STORE_PRODUCTS.filter(p => p.category === "Bottoms" && p.occasions.includes(occ) && p.inStock);
  const dresses = STORE_PRODUCTS.filter(p => p.category === "Dresses" && p.occasions.includes(occ) && p.inStock);
  const outers = STORE_PRODUCTS.filter(p => p.category === "Outerwear" && p.occasions.includes(occ) && p.inStock);
  const shoes = STORE_PRODUCTS.filter(p => p.category === "Footwear" && p.occasions.includes(occ) && p.inStock);
  const accessories = STORE_PRODUCTS.filter(p => p.category === "Accessories" && p.occasions.includes(occ) && p.inStock);

  const pick = <T>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

  // If dress available for occasion, skip top+bottom
  const dress = pick(dresses);
  if (dress) {
    return {
      top: dress as unknown as StoreProduct,
      shoes: pick(shoes),
      accessory: pick(accessories),
    };
  }

  return {
    top: pick(tops) ?? STORE_PRODUCTS.find(p => p.category === "Tops"),
    bottom: pick(bottoms) ?? STORE_PRODUCTS.find(p => p.category === "Bottoms"),
    outer: occ === "party" || occ === "office" ? pick(outers) : undefined,
    shoes: pick(shoes) ?? STORE_PRODUCTS.find(p => p.category === "Footwear"),
    accessory: pick(accessories),
  };
}
