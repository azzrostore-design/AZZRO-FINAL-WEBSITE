import { MOCK_CMS_DATA } from "@/lib/cms-data";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductSidebar } from "@/components/product/ProductSidebar";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export default async function CategoryPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {

    const { slug } = await params;

    // Demo products
    const products = [
        ...MOCK_CMS_DATA.trendingCollections,
        ...MOCK_CMS_DATA.bestSellers,
    ];

    return (
        <div className="bg-white min-h-screen">

            {/* Breadcrumb */}
            <div className="container mx-auto px-4 py-4 text-xs text-gray-500 flex items-center gap-1">
                <Link href="/" className="hover:text-black">
                    Home
                </Link>

                <ChevronRight className="w-3 h-3" />

                <span className="capitalize text-black font-bold">
                    {slug}
                </span>
            </div>

            <div className="container mx-auto px-4 pb-20 flex items-start gap-8">

                {/* Sidebar */}
                <ProductSidebar />

                {/* Product Section */}
                <main className="flex-1">

                    {/* Top Bar */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 pb-4 border-b border-gray-100 gap-4">

                        <div>
                            <h1 className="text-xl font-bold capitalize text-gray-900 leading-none mb-1">
                                {slug} Collection
                                <span className="text-gray-400 font-light text-base">
                                    {" "}
                                    ({products.length} items)
                                </span>
                            </h1>
                        </div>

                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-500">
                                Sort by:
                            </span>

                            <select className="text-sm font-bold border-none bg-transparent focus:ring-0 cursor-pointer">
                                <option>Recommended</option>
                                <option>Price: Low to High</option>
                                <option>Price: High to Low</option>
                                <option>Newest First</option>
                            </select>
                        </div>

                    </div>

                    {/* Product Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8">

                        {products.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                            />
                        ))}

                    </div>

                </main>

            </div>

        </div>
    );
}