export interface Banner {
    id: string;
    imageUrl: string;
    desktopUrl: string;
    mobileUrl: string;
    title: string;
    subtitle?: string;
    ctaText: string;
    link: string;
}

export interface CategoryTile {
    id: string;
    name: string;
    imageUrl: string;
    link: string;
}

export interface ProductSummary {
    id: string;
    brand: string;
    name: string;
    price: number;
    originalPrice?: number;
    discount?: number;
    imageUrl: string;
    hoverImageUrl?: string;
    rating?: number;
}

export interface CMSData {
    heroBanners: Banner[];
    categories: CategoryTile[];
    trendingCollections: ProductSummary[];
    bestSellers: ProductSummary[];
    brandHighlights: { id: string; name: string; logoUrl: string; bannerUrl: string }[];
    seasonalOffers: Banner[];
}

export const MOCK_CMS_DATA: CMSData = {
    heroBanners: [
        {
            id: "hero-1",
            imageUrl: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop",
            desktopUrl: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop",
            mobileUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop",
            title: "Summer 2026 Collection",
            subtitle: "Fresh vibes for the new season",
            ctaText: "Explore Now",
            link: "/category/summer",
        },
        {
            id: "hero-2",
            imageUrl: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=2074&auto=format&fit=crop",
            desktopUrl: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=2074&auto=format&fit=crop",
            mobileUrl: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1000&auto=format&fit=crop",
            title: "Denim Days",
            subtitle: "Flat 40% Off on Top Brands",
            ctaText: "Shop Denim",
            link: "/category/denim",
        }
    ],
    categories: [
        { id: "cat-1", name: "Men",         imageUrl: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=500&auto=format&fit=crop",  link: "/category/men" },
        { id: "cat-2", name: "Women",        imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop",  link: "/category/women" },
        { id: "cat-3", name: "Kids",         imageUrl: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=500&auto=format&fit=crop",  link: "/category/kids" },
        { id: "cat-4", name: "Footwear",     imageUrl: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&auto=format&fit=crop",  link: "/category/footwear" },
        { id: "cat-5", name: "BANJARA",      imageUrl: "https://images.unsplash.com/photo-1612817288484-96916a0816a9?w=500&auto=format&fit=crop",  link: "/category/banjara" },
        { id: "cat-6", name: "Accessories",  imageUrl: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500&auto=format&fit=crop",  link: "/category/accessories" },
    ],
    trendingCollections: [
        // ✅ NAZARA TEST PRODUCT — appears first so it's easy to find
        {
            id: "nazara-test-1",
            brand: "BANJARA by AZZRO",
            name: "Bandhani Silk Saree",
            price: 4299,
            originalPrice: 7999,
            discount: 46,
            imageUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&auto=format&fit=crop",
            hoverImageUrl: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=500&auto=format&fit=crop",
            rating: 4.8,
        },
        { id: "p-1", brand: "H&M",   name: "Oversized Cotton T-shirt", price: 799,  originalPrice: 1299, discount: 38, imageUrl: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&auto=format&fit=crop", hoverImageUrl: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=500&auto=format&fit=crop" },
        { id: "p-2", brand: "Levis", name: "511 Slim Fit Jeans",        price: 2499, originalPrice: 3999, discount: 37, imageUrl: "https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=500&auto=format&fit=crop", hoverImageUrl: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500&auto=format&fit=crop" },
        { id: "p-3", brand: "Zara",  name: "Textured Shirt",            price: 2290, imageUrl: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&auto=format&fit=crop" },
        { id: "p-4", brand: "Nike",  name: "Air Max System",            price: 8495, imageUrl: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&auto=format&fit=crop", hoverImageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop" },
    ],
    bestSellers: [
        { id: "p-5", brand: "Puma",   name: "Essential Logo T-shirt",  price: 699,  originalPrice: 1499, discount: 53, imageUrl: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500&auto=format&fit=crop" },
        { id: "p-6", brand: "Adidas", name: "Ultraboost Light",        price: 11999, imageUrl: "https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=500&auto=format&fit=crop" },
        { id: "p-7", brand: "Biba",   name: "Printed Anarkali Suit",   price: 3499, originalPrice: 5999, discount: 41, imageUrl: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&auto=format&fit=crop" },
    ],
    brandHighlights: [
        { id: "b-1", name: "Nike", logoUrl: "/brands/nike.png", bannerUrl: "https://images.unsplash.com/photo-1556906781-9a412961d289?w=800&auto=format&fit=crop" },
        { id: "b-2", name: "H&M",  logoUrl: "/brands/hm.png",  bannerUrl: "https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?w=800&auto=format&fit=crop" },
    ],
    seasonalOffers: [
        {
            id: "season-1",
            imageUrl: "https://images.unsplash.com/photo-1555529771-83ae9289fd6e?w=800&auto=format&fit=crop",
            desktopUrl: "",
            mobileUrl: "",
            title: "Monsoon Madness",
            ctaText: "Up to 70% Off",
            link: "/sale/monsoon",
        },
        {
            id: "season-2",
            imageUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop",
            desktopUrl: "",
            mobileUrl: "",
            title: "Wedding Edit",
            ctaText: "Shop Ethnic",
            link: "/sale/wedding",
        }
    ]
};
export type MegaMenu = {
  [key: string]: {
    [section: string]: string[]
  }
}

export const AZZRO_MEGA_MENU: MegaMenu = {
MEN: {
Topwear: ["T-Shirts","Casual Shirts","Formal Shirts","Polos"],
Bottomwear: ["Jeans","Trousers & Chinos","Shorts"],
"Ethnic Wear": ["Kurtas","Kurta Sets"],
Footwear: ["Casual Shoes","Sports Shoes","Sandals & Slippers"],
"Innerwear & Active": ["Innerwear","Loungewear","Activewear"],
Accessories: ["Belts","Wallets","Caps"]
},

WOMEN: {
"Indian & Fusion": ["Kurtis","Kurta Sets","Sarees","Ethnic Dresses"],
Western: ["Tops","Dresses","Jeans","Skirts & Palazzos"],
Footwear: ["Flats","Heels","Sandals"],
"Innerwear & Active": ["Lingerie","Nightwear","Activewear"],
Accessories: ["Handbags","Fashion Jewellery","Scarves & Stoles"]
},

KIDS: {
Boys: ["T-Shirts","Shirts","Jeans & Pants","Ethnic Wear"],
Girls: ["Dresses","Tops","Ethnic Wear","Skirts & Leggings"],
Infant: ["Rompers","Clothing Sets","Winter Wear"],
Footwear: ["School Shoes","Sandals","Casual Shoes"]
},

HOME: {
"Home Furnishing": ["Bedsheets","Curtains","Cushion Covers","Rugs & Mats"],
"Home Decor": ["Wall Decor","Lamps","Plants","Clocks"],
"Kitchen & Dining": ["Dinner Sets","Storage","Bottles"],
"Home Organization": ["Storage Boxes","Bathroom Accessories","Laundry Organizers"]
},

ACCESSORIES: {
"Fashion Accessories": ["Handbags","Wallets","Belts"],
"Jewellery & Watches": ["Earrings","Necklaces","Bracelets","Watches"],
Lifestyle: ["Sunglasses","Travel & Fitness Accessories"]
},

BANJARA: {
Women: ["Dresses","Blouses","Dupattas","Skirts","Jewellery","Handmade Bags"],
Men: ["Kurtas","Ethnic Jackets","Shawls","Traditional Accessories"],
Unisex: ["Handmade Jewellery","Embroidered Sling Bags","Tribal Wallets"]
}

}