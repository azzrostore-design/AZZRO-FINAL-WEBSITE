'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Banner } from "@/lib/cms-data";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function HeroBanner({ banners }: { banners: Banner[] }) {
    const [current, setCurrent] = useState(0);

    // Auto-play
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % banners.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [banners.length]);

    const nextSlide = () => setCurrent((prev) => (prev + 1) % banners.length);
    const prevSlide = () => setCurrent((prev) => (prev - 1 + banners.length) % banners.length);

    if (banners.length === 0) return null;

    return (
        <section className="relative w-full h-[500px] md:h-[600px] overflow-hidden group">
            {banners.map((banner, index) => (
                <div
                    key={banner.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === current ? 'opacity-100' : 'opacity-0'}`}
                >
                    <Image
                        src={banner.desktopUrl}
                        alt={banner.title}
                        fill
                        className="object-cover object-center"
                        priority={index === 0}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end pb-16 px-6 md:px-20 text-white">
                        <div className={`transition-all duration-700 delay-300 transform ${index === current ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                            <h2 className="text-4xl md:text-6xl font-bold mb-2 tracking-tighter drop-shadow-md">{banner.title}</h2>
                            <p className="text-lg md:text-2xl mb-8 font-light drop-shadow-md max-w-lg">{banner.subtitle}</p>
                            <Link
                                href={banner.link}
                                className="inline-block bg-accent hover:bg-accent/90 text-white px-8 py-4 text-xs font-bold uppercase tracking-widest transition-all hover:scale-105 shadow-lg"
                            >
                                {banner.ctaText}
                            </Link>
                        </div>
                    </div>
                </div>
            ))}

            {/* Navigation Arrows */}
            <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/30 backdrop-blur-md p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all">
                <ChevronLeft className="w-6 h-6" />
            </button>
            <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/30 backdrop-blur-md p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all">
                <ChevronRight className="w-6 h-6" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                {banners.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrent(idx)}
                        className={`w-2 h-2 rounded-full transition-all ${idx === current ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/80'}`}
                    />
                ))}
            </div>
        </section>
    );
}

