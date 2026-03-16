import Image from "next/image";
import Link from "next/link";
import { ProductSummary } from "@/lib/cms-data";
import { Heart } from "lucide-react";

export function ProductGrid({ title, products }: { title: string; products: ProductSummary[] }) {

    return (
        <section className="py-12 bg-white container mx-auto px-4">

            <div className="flex justify-between items-end mb-8">
                <h3 className="text-2xl md:text-3xl font-bold tracking-tight uppercase">
                    <span className="text-accent">#</span> {title}
                </h3>

                <Link
                    href="/collections/trending"
                    className="text-sm font-bold border-b border-black pb-0.5 hover:text-accent hover:border-accent transition-colors"
                >
                    View All
                </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-y-8 gap-x-4">

                {products.map((product, index) => {

                    const imageSrc =
                        product.imageUrl && product.imageUrl.trim() !== ""
                            ? product.imageUrl
                            : "/images/placeholder.png";

                    return (

                        <Link
                            href={`/product/${product.id}`}
                            key={product.id || index}
                            className="group relative block"
                        >

                            {/* Product Image */}
                            <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-3">

                                <Image
                                    src={imageSrc}
                                    alt={product.name || "product image"}
                                    fill
                                    sizes="(max-width:768px) 50vw, 20vw"
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />

                                {/* Wishlist Button */}
                                <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white text-primary">
                                    <Heart className="w-4 h-4" />
                                </button>

                                {/* Discount Badge */}
                                {product.discount && (
                                    <span className="absolute bottom-2 left-2 bg-white text-black text-[10px] font-bold px-2 py-1 border border-gray-200">
                                        {product.discount}% OFF
                                    </span>
                                )}

                            </div>

                            {/* Product Info */}
                            <div className="space-y-1">

                                <h4 className="font-bold text-sm text-gray-900 group-hover:text-primary leading-none">
                                    {product.brand}
                                </h4>

                                <p className="text-xs text-gray-500 truncate">
                                    {product.name}
                                </p>

                                <div className="flex items-center gap-2 mt-1">

                                    <span className="font-bold text-sm">
                                        ₹{product.price}
                                    </span>

                                    {product.originalPrice && (
                                        <span className="text-xs text-gray-400 line-through">
                                            ₹{product.originalPrice}
                                        </span>
                                    )}

                                </div>

                            </div>

                        </Link>

                    );

                })}

            </div>

        </section>
    );
}
