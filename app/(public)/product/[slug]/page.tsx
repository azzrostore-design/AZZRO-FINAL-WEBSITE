import { Star, Truck, RefreshCw, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { FitMeProductButton } from "@/components/product/fitme";
import { MOCK_CMS_DATA } from "@/lib/cms-data";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const allProducts = [
    ...MOCK_CMS_DATA.trendingCollections,
    ...MOCK_CMS_DATA.bestSellers,
  ];

  const found = allProducts.find((p) => p.id === slug);

  const product = {
    id: slug,
    name:
      found?.name ??
      slug.replace(/-/g, " ").replace(/(^\w|\s\w)/g, (m) => m.toUpperCase()),
    brand: found?.brand ?? "AZZRO",
    price: found?.price ?? 2499,
    originalPrice: found?.originalPrice ?? 4999,
    discount: found?.discount ?? 50,
    rating: found?.rating ?? 4.5,
    ratingCount: 1200,
    sizes: ["S", "M", "L", "XL", "XXL"],
    imageUrl:
      found?.imageUrl ??
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80",
    hoverImageUrl: found?.hoverImageUrl,
  };

  const galleryImages = [
    product.imageUrl,
    ...(product.hoverImageUrl ? [product.hoverImageUrl] : []),
  ];

  while (galleryImages.length < 4) {
    galleryImages.push(product.imageUrl);
  }

  return (
    <div className="container mx-auto px-4 py-8 pb-20">
      {/* Breadcrumb */}
      <div className="text-xs text-gray-500 mb-6 flex items-center gap-1">
        <span>Home</span> / <span>Men</span> /{" "}
        <span className="text-black font-bold">{product.name}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Left: Image Gallery */}
        <div className="grid grid-cols-2 gap-2 h-fit sticky top-24">
          {galleryImages.map((imgUrl, i) => (
            <div
              key={i}
              className="group/img aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden relative"
            >
              <Image
                src={imgUrl}
                alt={`${product.name} view ${i + 1}`}
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
              />

              {/* ✅ FIT ME button ONLY on first image */}
              {i === 0 && (
                <FitMeProductButton
                  product={product}
                  variant="image-overlay"
                />
              )}
            </div>
          ))}
        </div>

        {/* Right: Product Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold uppercase tracking-wide text-gray-900 mb-1">
              {product.brand}
            </h1>
            <p className="text-lg text-gray-500 font-light mb-3">
              {product.name}
            </p>

            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1 bg-white border border-gray-200 px-2 py-0.5 rounded shadow-sm text-xs font-bold">
                <span>{product.rating}</span>
                <Star className="w-3 h-3 text-green-500 fill-green-500" />
                <span className="text-gray-300">|</span>
                <span className="text-gray-500 font-normal">
                  {product.ratingCount} Ratings
                </span>
              </div>
            </div>
          </div>

          <div className="h-px bg-gray-100 w-full" />

          {/* Price */}
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="text-3xl font-bold">₹{product.price}</span>

              {product.originalPrice && (
                <span className="text-lg text-gray-400 line-through font-light">
                  MRP ₹{product.originalPrice}
                </span>
              )}

              {product.discount && (
                <span className="text-lg font-bold text-accent">
                  ({product.discount}% OFF)
                </span>
              )}
            </div>

            <p className="text-xs text-green-600 font-bold">
              inclusive of all taxes
            </p>
          </div>

          {/* Size Selector */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="font-bold text-sm uppercase">
                Select Size
              </span>
              <button className="text-accent text-xs font-bold uppercase">
                Size Chart
              </button>
            </div>

            <div className="flex gap-3 mb-6">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:border-accent hover:text-accent font-bold text-xs transition-all"
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button className="flex-1 bg-primary text-white py-4 rounded font-bold uppercase tracking-wider hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg">
              Add to Bag
            </button>

            <button className="flex-1 border border-gray-300 bg-white text-black py-4 rounded font-bold uppercase tracking-wider hover:border-black transition-all">
              Wishlist
            </button>
          </div>

          {/* Delivery & Services */}
          <div className="pt-6 space-y-4">
            <div className="flex items-center gap-4">
              <Truck className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-600">
                Get it by <span className="font-bold text-black">Tue, Feb 10</span>
              </span>
            </div>

            <div className="flex items-center gap-4">
              <RefreshCw className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-600">
                14 Days Easy Return
              </span>
            </div>

            <div className="flex items-center gap-4">
              <ShieldCheck className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-600">
                100% Original Products
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}