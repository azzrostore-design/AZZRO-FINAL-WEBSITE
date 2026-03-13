'use client';

import { useState } from "react";
import Image from "next/image";
import { Check, Truck, CreditCard, User } from "lucide-react";

export default function CheckoutPage() {
    const [step, setStep] = useState(1);

    return (
        <div className="bg-gray-50 min-h-screen py-8 pb-32">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Stepper Header */}
                <div className="flex items-center justify-between mb-10 px-4 md:px-12">
                    {[
                        { id: 1, label: "Account", icon: User },
                        { id: 2, label: "Address", icon: Truck },
                        { id: 3, label: "Payment", icon: CreditCard },
                    ].map((s, i) => (
                        <div key={s.id} className="flex flex-col items-center relative z-10">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${step >= s.id ? 'bg-primary text-white shadow-lg' : 'bg-gray-200 text-gray-500'}`}>
                                {step > s.id ? <Check className="w-5 h-5" /> : <s.icon className="w-5 h-5" />}
                            </div>
                            <span className={`text-xs font-bold uppercase mt-2 ${step >= s.id ? 'text-black' : 'text-gray-400'}`}>{s.label}</span>

                            {/* Line connector */}
                            {i < 2 && (
                                <div className={`absolute top-5 left-full w-[calc(100vw/3-20px)] md:w-64 h-0.5 -z-10 -translate-y-1/2 ${step > s.id ? 'bg-primary' : 'bg-gray-200'}`}></div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="flex gap-8">
                    {/* Main Form Area */}
                    <div className="flex-1 space-y-6">

                        {/* Step 1: Account */}
                        <div className={`bg-white p-6 rounded-lg shadow-sm border ${step === 1 ? 'border-primary ring-1 ring-primary/5' : 'border-gray-100 opacity-60'}`}>
                            <h3 className="text-lg font-bold uppercase tracking-wide flex items-center gap-2 mb-4">
                                <span className="text-primary">01</span>
                                Account
                            </h3>
                            {step === 1 && (
                                <div>
                                    <p className="text-sm text-gray-500 mb-4">To place your order, log in to your account or continue as a guest.</p>
                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => setStep(2)}
                                            className="flex-1 bg-primary text-white py-3 rounded font-bold uppercase hover:bg-primary/90 transition-all"
                                        >
                                            Login / Sign Up
                                        </button>
                                        <button
                                            onClick={() => setStep(2)}
                                            className="flex-1 border border-primary text-primary py-3 rounded font-bold uppercase hover:bg-primary/5 transition-all"
                                        >
                                            Continue as Guest
                                        </button>
                                    </div>
                                </div>
                            )}
                            {step > 1 && <p className="text-sm font-bold text-black">Logged in as Guest (guest@azzro.com)</p>}
                        </div>

                        {/* Step 2: Address */}
                        <div className={`bg-white p-6 rounded-lg shadow-sm border ${step === 2 ? 'border-primary ring-1 ring-primary/5' : 'border-gray-100 opacity-60'}`}>
                            <h3 className="text-lg font-bold uppercase tracking-wide flex items-center gap-2 mb-4">
                                <span className={step === 2 ? "text-primary" : "text-gray-400"}>02</span>
                                Shipping Address
                            </h3>
                            {step === 2 && (
                                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setStep(3); }}>
                                    <div className="grid grid-cols-2 gap-4">
                                        <input type="text" placeholder="First Name *" className="w-full border border-gray-200 p-3 rounded text-sm focus:outline-none focus:border-black" required />
                                        <input type="text" placeholder="Last Name *" className="w-full border border-gray-200 p-3 rounded text-sm focus:outline-none focus:border-black" required />
                                    </div>
                                    <input type="text" placeholder="Address (House No, Building, Street) *" className="w-full border border-gray-200 p-3 rounded text-sm focus:outline-none focus:border-black" required />
                                    <div className="grid grid-cols-2 gap-4">
                                        <input type="text" placeholder="City *" className="w-full border border-gray-200 p-3 rounded text-sm focus:outline-none focus:border-black" required />
                                        <input type="text" placeholder="Pincode *" className="w-full border border-gray-200 p-3 rounded text-sm focus:outline-none focus:border-black" required />
                                    </div>
                                    <input type="tel" placeholder="Mobile Number *" className="w-full border border-gray-200 p-3 rounded text-sm focus:outline-none focus:border-black" required />

                                    <button type="submit" className="w-full bg-accent text-white py-3 rounded font-bold uppercase hover:bg-accent/90 transition-all mt-4">
                                        Proceed to Payment
                                    </button>
                                </form>
                            )}
                            {step > 2 && <p className="text-sm font-bold text-black">Home: 123, Fashion Street, Bangalore - 560001</p>}
                        </div>

                        {/* Step 3: Payment */}
                        <div className={`bg-white p-6 rounded-lg shadow-sm border ${step === 3 ? 'border-primary ring-1 ring-primary/5' : 'border-gray-100 opacity-60'}`}>
                            <h3 className="text-lg font-bold uppercase tracking-wide flex items-center gap-2 mb-4">
                                <span className={step === 3 ? "text-primary" : "text-gray-400"}>03</span>
                                Payment
                            </h3>
                            {step === 3 && (
                                <div className="space-y-3">
                                    {['UPI (Google Pay / PhonePe)', 'Credit / Debit Card', 'Net Banking', 'Cash on Delivery'].map(method => (
                                        <label key={method} className="flex items-center gap-4 p-4 border border-gray-100 rounded-lg cursor-pointer hover:border-black transition-colors">
                                            <input type="radio" name="payment" className="w-5 h-5 text-accent focus:ring-accent" />
                                            <span className="font-bold text-sm text-gray-800">{method}</span>
                                        </label>
                                    ))}
                                    <button className="w-full bg-black text-white py-4 rounded font-bold uppercase hover:bg-gray-800 transition-all mt-4 text-lg tracking-widest shadow-xl">
                                        Pay ₹8,914
                                    </button>
                                </div>
                            )}
                        </div>

                    </div>

                    {/* Order Summary (Right Rail) */}
                    <div className="hidden lg:block w-80">
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 sticky top-24">
                            <h4 className="font-bold text-sm uppercase mb-4">Order Summary</h4>
                            <div className="flex gap-4 mb-4">
                                <div className="w-16 h-20 bg-gray-100 rounded relative overflow-hidden">
                                    <Image src="https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=200" alt="Shoe" fill className="object-cover" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-bold">Nike Air Max</p>
                                    <p className="text-[10px] text-gray-500">Qty: 1</p>
                                    <p className="text-xs font-bold mt-1">₹8,495</p>
                                </div>
                            </div>
                            <div className="border-t border-gray-100 pt-4 mt-4 space-y-2 text-sm text-gray-600">
                                <div className="flex justify-between"><span>Subtotal</span><span>₹8,914</span></div>
                                <div className="flex justify-between"><span>Shipping</span><span className="text-green-600 font-bold">FREE</span></div>
                                <div className="border-t border-gray-100 pt-2 mt-2 flex justify-between font-bold text-black text-lg">
                                    <span>Total</span><span>₹8,914</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
