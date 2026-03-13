'use client';

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, Tag, ArrowRight } from "lucide-react";

export default function CartPage() {
    // Mock Cart Data
    const cartItems = [
        { id: 1, brand: "Nike", name: "Air Max System Running Shoes", price: 8495, originalPrice: 9995, discount: 15, size: "UK 9", image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&auto=format&fit=crop", qty: 1 },
        { id: 2, brand: "H&M", name: "Oversized Cotton T-shirt", price: 799, originalPrice: 1299, discount: 38, size: "M", image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&auto=format&fit=crop", qty: 2 },
    ];

    return (
        <div className="bg-gray-50 min-h-screen py-8 pb-20">
            <div className="container mx-auto px-4 max-w-6xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl font-bold uppercase tracking-wide">Shopping Bag <span className="text-gray-500 text-sm normal-case font-normal">(2 Items)</span></h1>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left: Cart Items */}
                    <div className="flex-1 space-y-4">
                        {/* Offer Banner */}
                        <div className="bg-white p-4 border border-gray-100 rounded-lg flex items-center justify-between shadow-sm">
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                                <Tag className="w-4 h-4 text-accent" />
                                <span>Available Offers: <span className="font-bold">10% Instant Discount on SBI Cards</span></span>
                            </div>
                            <span className="text-xs font-bold text-accent cursor-pointer uppercase">View More</span>
                        </div>

                        {/* Items List */}
                        {cartItems.map((item) => (
                            <div key={item.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex gap-4 relative group">
                                <button className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors">
                                    <Trash2 className="w-5 h-5" />
                                </button>

                                {/* Image */}
                                <div className="w-24 h-32 flex-shrink-0 relative bg-gray-50 rounded overflow-hidden">
                                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                                </div>

                                {/* Details */}
                                <div className="flex-1 flex flex-col justify-between py-1">
                                    <div>
                                        <h3 className="font-bold text-gray-900 leading-tight mb-1">{item.brand}</h3>
                                        <p className="text-sm text-gray-600 mb-2 truncate max-w-[200px] md:max-w-md">{item.name}</p>
                                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                                            <span className="bg-gray-100 px-2 py-1 rounded">Size: {item.size}</span>
                                            <span className="bg-gray-100 px-2 py-1 rounded">Qty: {item.qty}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-base">₹{item.price * item.qty}</span>
                                            <span className="text-xs text-gray-400 line-through">₹{item.originalPrice * item.qty}</span>
                                            <span className="text-xs font-bold text-accent">{item.discount}% OFF</span>
                                        </div>
                                    </div>

                                    {/* Qty Edit (Visual) */}
                                    {/* <div className="flex items-center gap-3">
                                        <button className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200"><Minus className="w-3 h-3" /></button>
                                        <span className="text-sm font-bold">{item.qty}</span>
                                        <button className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200"><Plus className="w-3 h-3" /></button>
                                    </div> */}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right: Price Details */}
                    <div className="lg:w-96 flex-shrink-0">
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 sticky top-24">
                            <h2 className="font-bold text-xs uppercase text-gray-500 mb-4 tracking-widest">Price Details (2 Items)</h2>
                            <div className="space-y-3 text-sm text-gray-600 mb-6">
                                <div className="flex justify-between">
                                    <span>Total MRP</span>
                                    <span>₹11,294</span>
                                </div>
                                <div className="flex justify-between text-green-600">
                                    <span>Discount on MRP</span>
                                    <span>-₹2,000</span>
                                </div>
                                <div className="flex justify-between text-green-600">
                                    <span>Coupon Discount</span>
                                    <span>-₹400</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Platform Fee</span>
                                    <span>₹20</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping Fee</span>
                                    <span className="text-green-600">FREE</span>
                                </div>
                            </div>
                            <div className="h-px bg-gray-200 w-full mb-4"></div>
                            <div className="flex justify-between font-bold text-lg text-gray-900 mb-6">
                                <span>Total Amount</span>
                                <span>₹8,914</span>
                            </div>

                            <Link href="/checkout" className="w-full bg-accent hover:bg-accent/90 text-white font-bold py-3.5 rounded-md flex items-center justify-center gap-2 uppercase tracking-wide transition-all shadow-lg hover:shadow-xl">
                                Place Order
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
