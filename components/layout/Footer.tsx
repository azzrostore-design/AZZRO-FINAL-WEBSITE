import Link from "next/link";
import { Facebook, Instagram, Twitter, Youtube, Smartphone, Mail, MapPin, ShieldCheck, RefreshCw } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-white border-t border-gray-100 pt-16 pb-8 text-sm">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    {/* Column 1: Online Shopping */}
                    <div>
                        <h5 className="font-bold text-gray-900 uppercase tracking-widest mb-4 text-xs">Online Shopping</h5>
                        <ul className="flex flex-col gap-2 text-gray-500">
                            <li className="hover:text-black hover:font-semibold transition-all cursor-pointer">Men</li>
                            <li className="hover:text-black hover:font-semibold transition-all cursor-pointer">Women</li>
                            <li className="hover:text-black hover:font-semibold transition-all cursor-pointer">Kids</li>
                            <li className="hover:text-black hover:font-semibold transition-all cursor-pointer">Home & Living</li>
                            <li className="hover:text-black hover:font-semibold transition-all cursor-pointer">Beauty</li>
                            <li className="hover:text-black hover:font-semibold transition-all cursor-pointer">Gift Cards</li>
                        </ul>
                    </div>

                    {/* Column 2: Customer Policies */}
                    <div>
                        <h5 className="font-bold text-gray-900 uppercase tracking-widest mb-4 text-xs">Customer Policies</h5>
                        <ul className="flex flex-col gap-2 text-gray-500">
                            <li className="hover:text-black hover:font-semibold transition-all cursor-pointer">Contact Us</li>
                            <li className="hover:text-black hover:font-semibold transition-all cursor-pointer">FAQ</li>
                            <li className="hover:text-black hover:font-semibold transition-all cursor-pointer">T&C</li>
                            <li className="hover:text-black hover:font-semibold transition-all cursor-pointer">Terms Of Use</li>
                            <li className="hover:text-black hover:font-semibold transition-all cursor-pointer">Track Orders</li>
                            <li className="hover:text-black hover:font-semibold transition-all cursor-pointer">Shipping</li>
                            <li className="hover:text-black hover:font-semibold transition-all cursor-pointer">Cancellations</li>
                            <li className="hover:text-black hover:font-semibold transition-all cursor-pointer">Returns</li>
                        </ul>
                    </div>

                    {/* Column 3: Experience App */}
                    <div>
                        <h5 className="font-bold text-gray-900 uppercase tracking-widest mb-4 text-xs">Experience AZZRO App On Mobile</h5>
                        <div className="flex gap-4 mb-6">
                            <Link href="#" className="flex-1 bg-black text-white py-2 px-3 rounded flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors">
                                <Smartphone className="w-5 h-5" />
                                <div className="text-left leading-none">
                                    <span className="block text-[8px] uppercase">Get it on</span>
                                    <span className="font-bold text-sm">Google Play</span>
                                </div>
                            </Link>
                            <Link href="#" className="flex-1 bg-black text-white py-2 px-3 rounded flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors">
                                <Smartphone className="w-5 h-5" />
                                <div className="text-left leading-none">
                                    <span className="block text-[8px] uppercase">Download on the</span>
                                    <span className="font-bold text-sm">App Store</span>
                                </div>
                            </Link>
                        </div>

                        <h5 className="font-bold text-gray-900 uppercase tracking-widest mb-4 text-xs">Keep In Touch</h5>
                        <div className="flex gap-4">
                            <Link href="#" className="p-2 bg-white shadow-sm rounded-full border border-gray-100 hover:border-gray-300 hover:text-pink-600 transition-all text-gray-500">
                                <Instagram className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="p-2 bg-white shadow-sm rounded-full border border-gray-100 hover:border-gray-300 hover:text-blue-400 transition-all text-gray-500">
                                <Twitter className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="p-2 bg-white shadow-sm rounded-full border border-gray-100 hover:border-gray-300 hover:text-red-600 transition-all text-gray-500">
                                <Youtube className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="p-2 bg-white shadow-sm rounded-full border border-gray-100 hover:border-gray-300 hover:text-blue-800 transition-all text-gray-500">
                                <Facebook className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>

                    {/* Column 4: Quality Promise */}
                    <div>
                        <div className="flex items-start gap-4 mb-6">
                            <div className="w-12 h-12 flex-shrink-0 bg-gray-50 rounded-full flex items-center justify-center text-black">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <div>
                                <h6 className="font-bold text-gray-900 text-sm">100% ORIGINAL guarantee</h6>
                                <p className="text-gray-500 text-xs mt-1">for all products at AZZRO</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 flex-shrink-0 bg-gray-50 rounded-full flex items-center justify-center text-black">
                                <RefreshCw className="w-6 h-6" />
                            </div>
                            <div>
                                <h6 className="font-bold text-gray-900 text-sm">Return within 14 days</h6>
                                <p className="text-gray-500 text-xs mt-1">of receiving your order</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Popular Searches (SEO) */}
                <div className="border-t border-gray-100 py-6">
                    <h5 className="font-bold text-gray-900 text-xs mb-3 flex items-center gap-2">
                        POPULAR SEARCHES <span className="h-px bg-gray-200 flex-1"></span>
                    </h5>
                    <p className="text-gray-400 text-[11px] leading-relaxed">
                        Makeup | Dresses For Girls | T-Shirts | Sandals | Headphones | Babydolls | Blazers For Men | Handbags | Ladies Watches | Bags | Sport Shoes | Reebok Shoes | Puma Shoes | Boxers | Wallets | Tops | Earrings | Fastrack Watches | Kurtis | Nike | Smart Watches | Titan Watches | Designer Blouse | Gowns | Rings | Cricket Shoes | Forever 21 | Eye Makeup | Photo Frames | Punjabi Suits | Bikini | Myntra Fashion Show | Lipstick | Saree | Watches | Dresses | Lehenga | Nike Shoes | Goggles | Bras | Suit | Chinos | Shoes | Adidas Shoes | Woodland Shoes | Jewellery | Designers Sarees
                    </p>
                </div>

                {/* Bottom Footer */}
                <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row items-center justify-between text-gray-500 text-xs gap-4">
                    <div>
                        In case of any concern, <Link href="/contact" className="text-blue-600 font-bold hover:underline">Contact Us</Link>
                    </div>
                    <div>
                        © 2026 www.azzro.com. All rights reserved.
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-400">AZZRO</span>
                        <div className="w-px h-3 bg-gray-300"></div>
                        <span>CIN: U12345KA2026PTC123456</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
