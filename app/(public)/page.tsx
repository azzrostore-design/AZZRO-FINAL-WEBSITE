import { MOCK_CMS_DATA } from "@/lib/cms-data";
import { HeroBanner } from "@/components/ui/HeroBanner";
import { CategoryRail } from "@/components/ui/CategoryRail";
import { ProductGrid } from "@/components/ui/ProductGrid";
import { DealsSection } from "@/components/ui/DealsSection";
import AIFeaturesSection from "@/components/AISuggestionSection";
import Image from "next/image";

async function getProducts() {
  const res = await fetch("http://localhost:3000/api/products", {
    cache: "no-store",
  });

  if (!res.ok) {
    return [];
  }

  return res.json();
}

export default async function Home() {

  const products = await getProducts();

  const { heroBanners, categories, brandHighlights, seasonalOffers } = MOCK_CMS_DATA;

  return (
    <div className="min-h-screen bg-white pb-20">

      {/* 1️⃣ Hero Banner */}
      <HeroBanner banners={heroBanners} />

      {/* 2️⃣ Category Rail */}
      <CategoryRail categories={categories} />

      {/* 3️⃣ Deals Section */}
      <DealsSection />

      {/* 4️⃣ Seasonal Banner */}
      <section className="py-6 px-4 container mx-auto">
        {seasonalOffers.length > 0 && (
          <div className="relative w-full h-40 md:h-64 overflow-hidden cursor-pointer group">

            <Image
              src={seasonalOffers[0].imageUrl}
              alt="Offer"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />

            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter drop-shadow-xl">
                {seasonalOffers[0].title}
              </h2>
            </div>

          </div>
        )}
      </section>

      {/* 5️⃣ Products From MongoDB */}
      <ProductGrid title="Trending Products" products={products} />

      {/* 6️⃣ AI Fashion Features */}
      <AIFeaturesSection />

      {/* 7️⃣ Brand Highlights */}
      <section className="py-12 bg-gray-50">

        <div className="container mx-auto px-4">

          <h3 className="text-2xl font-bold mb-8 uppercase tracking-wide text-center">
            Grand Brands
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {brandHighlights.map((brand) => (

              <div
                key={brand.id}
                className="relative h-64 md:h-80 group overflow-hidden cursor-pointer"
              >

                <Image
                  src={brand.bannerUrl}
                  alt={brand.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-8">

                  <div className="bg-white text-black px-4 py-2 w-fit font-bold uppercase text-sm tracking-widest hover:bg-accent hover:text-white transition-colors">
                    Shop {brand.name}
                  </div>

                </div>

              </div>

            ))}

          </div>

        </div>

      </section>

    </div>
  );
}
