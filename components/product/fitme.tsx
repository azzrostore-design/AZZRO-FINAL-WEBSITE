'use client';

import { useState } from 'react';
import { FitMeTryOn } from '@/components/product/FitMeTryOn';

// ─── Types ────────────────────────────────────────────────────────────────
interface Product {
    id: string;
    name: string;
    brand: string;
    price: number;
    imageUrl: string;
    [key: string]: any;
}

interface FitMeProductButtonProps {
    product: Product;
    // 'card' = on product listing card (shown on hover, bottom-right)
    // 'image-overlay' = on product detail page first image (always visible, bottom-left)
    variant: 'card' | 'image-overlay';
}

// ─── FIT ME Button — used in ProductCard AND ProductDetail ────────────────
export function FitMeProductButton({ product, variant }: FitMeProductButtonProps) {
    const [open, setOpen] = useState(false);

    return (
        <>
            {variant === 'card' ? (
                // ── On product listing card: shows on hover, bottom-right ──
                <button
                    className="absolute bottom-2 right-2 z-10 flex items-center gap-1.5 bg-black/85 backdrop-blur-sm text-white px-3 py-1.5 text-[10px] font-semibold tracking-[2px] uppercase opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300 hover:bg-[#c8a96e] hover:text-black rounded-sm"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setOpen(true);
                    }}
                >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                        <circle cx="2" cy="6" r="1.5"/>
                        <circle cx="6" cy="6" r="1.5"/>
                        <circle cx="10" cy="6" r="1.5"/>
                    </svg>
                    FIT ME
                </button>
            ) : (
                // ── On product detail page first image: always visible, bottom-left ──
                <button
                    className="absolute bottom-4 left-4 z-10 flex items-center gap-2 bg-white/95 backdrop-blur-sm text-black px-4 py-2.5 text-[11px] font-bold tracking-[2.5px] uppercase shadow-lg hover:bg-[#c8a96e] hover:text-white transition-all duration-200 rounded-sm border border-black/10"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setOpen(true);
                    }}
                >
                    {/* Body silhouette icon */}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <circle cx="12" cy="4" r="2.5"/>
                        <path d="M12 8c-3 0-5 1.5-5 4v4h2v6h2v-6h2v6h2v-6h2v-4c0-2.5-2-4-5-4z"/>
                    </svg>
                    FIT ME
                </button>
            )}

            {/* ── FIT ME Modal ── */}
            {open && (
                <FitMeTryOn
                    product={product}
                    onClose={() => setOpen(false)}
                />
            )}
        </>
    );
}
