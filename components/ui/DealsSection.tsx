'use client';

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock } from "lucide-react";

const DEALS = [
    { id: 1, title: "Flat 50% Off", image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&auto=format&fit=crop", link: "/sale/50", timeLeft: 36000 },
    { id: 2, title: "Under ₹999", image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&auto=format&fit=crop", link: "/sale/999", timeLeft: 72000 },
    { id: 3, title: "Buy 1 Get 1", image: "https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=500&auto=format&fit=crop", link: "/sale/bogo", timeLeft: 18000 },
    { id: 4, title: "Sneaker Fest", image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=500&auto=format&fit=crop", link: "/sale/sneakers", timeLeft: 90000 },
    { id: 5, title: "Ethnic Sale", image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&auto=format&fit=crop", link: "/sale/ethnic", timeLeft: 45000 },
];

export function DealsSection() {
    return (
        <section className="py-8 bg-gradient-to-r from-rose-50 to-orange-50 mb-8">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-full shadow-sm animate-bounce">
                            <Clock className="w-5 h-5 text-accent" />
                        </div>
                        <h3 className="text-2xl font-bold uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-accent to-orange-500">
                            Deal of the Day
                        </h3>
                    </div>
                    <Link href="/deals" className="text-xs font-bold text-accent border border-accent rounded-full px-4 py-1 hover:bg-accent hover:text-white transition-all">
                        View All
                    </Link>
                </div>

                <div className="flex overflow-x-auto gap-4 scrollbar-hide pb-4">
                    {DEALS.map((deal) => (
                        <Link
                            href={deal.link}
                            key={deal.id}
                            className="flex-shrink-0 w-[200px] md:w-[280px] h-[250px] md:h-[320px] relative rounded-xl overflow-hidden group shadow-md hover:shadow-xl transition-all"
                        >
                            <Image
                                src={deal.image}
                                alt={deal.title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4 text-white">
                                <h4 className="text-2xl font-black uppercase leading-none mb-1">{deal.title}</h4>
                                <div className="flex items-center gap-2 text-xs font-bold bg-yellow-400 text-black w-fit px-2 py-0.5 rounded">
                                    <Clock className="w-3 h-3" />
                                    <span>Ending Soon</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
