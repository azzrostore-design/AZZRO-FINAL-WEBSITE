'use client';

import { useState } from 'react';
import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { ProductSummary } from "@/lib/cms-data";
import { FitMeTryOn } from "@/components/product/FitMeTryOn";

interface ProductCardProps {
    product: ProductSummary;
}

export function ProductCard({ product }: ProductCardProps) {
    const [fitMeOpen, setFitMeOpen] = useState(false);

    return (
        <>
            <Link
                href={`/product/${product.id}`}
                className="group block relative border border-transparent hover:shadow-lg hover:border-gray-100 transition-all rounded-lg overflow-hidden bg-white"
            >
                {/* Image Container */}
                <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">

                    {/* Primary Image */}
                    <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className={`object-cover transition-opacity duration-300 ${product.hoverImageUrl ? 'group-hover:opacity-0' : ''}`}
                    />

                    {/* Secondary Image (Hover) */}
                    {product.hoverImageUrl && (
                        <Image
                            src={product.hoverImageUrl}
                            alt={`${product.name} alternate view`}
                            fill
                            sizes="(max-width: 768px) 50vw, 25vw"
                            className="object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        />
                    )}

                    {/* Wishlist Button */}
                    <button
                        className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:text-accent shadow-sm z-20"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                        }}
                    >
                        <Heart className="w-4 h-4" />
                    </button>

                    {/* Discount Badge */}
                    {product.discount && (
                        <span className="absolute top-3 left-3 bg-accent/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-sm z-20">
                            {product.discount}% OFF
                        </span>
                    )}

                    {/* ── FIT ME Button — ALWAYS visible bottom-left, no hover needed ── */}
                    <button
                        className="absolute bottom-2 left-2 z-30 flex items-center gap-1.5 bg-black text-white px-3 py-1.5 text-[9px] font-bold tracking-[2px] uppercase hover:bg-[#c8a96e] hover:text-black transition-all duration-200 rounded-sm shadow-md"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setFitMeOpen(true);
                        }}
                    >
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                            <circle cx="12" cy="4" r="2.5"/>
                            <path d="M12 8c-3 0-5 1.5-5 4v4h2v6h2v-6h2v6h2v-6h2v-4c0-2.5-2-4-5-4z"/>
                        </svg>
                        FIT ME
                    </button>

                    {/* Add to Cart Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm py-3 px-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 border-t border-gray-100 hidden md:block z-10">
                        <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-700 hover:text-black">
                            Add to Cart
                        </div>
                    </div>
                </div>

                {/* Product Details */}
                <div className="p-3">
                    <h4 className="font-bold text-sm text-gray-900 leading-tight mb-1">{product.brand}</h4>
                    <p className="text-xs text-gray-500 truncate mb-1.5 font-light">{product.name}</p>
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-black">₹{product.price}</span>
                        {product.originalPrice && (
                            <span className="text-xs text-gray-400 line-through font-light">₹{product.originalPrice}</span>
                        )}
                    </div>
                </div>
            </Link>

            {/* FIT ME Modal */}
            {fitMeOpen && (
                <FitMeTryOn
                    product={product}
                    onClose={() => setFitMeOpen(false)}
                />
            )}
        </>
    );
}
