import Link from "next/link";
import { CheckCircle2, TrendingUp, Truck, ShieldCheck, Clock, HelpCircle, Phone, Mail, MapPin } from "lucide-react";

export default function SellerPage() {
    return (
        <div className="bg-white min-h-screen pb-20">
            {/* Hero Section */}
            <section className="relative bg-[#1A1A1A] text-white py-20 px-4 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
                <div className="container mx-auto max-w-6xl relative z-10 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Grow Your Fashion Business with AZZRO</h1>
                    <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto font-light">India's Fastest-Growing Multi-Vendor Marketplace for Fashion, Ethnic Wear & Lifestyle</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                        <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
                            <h3 className="text-3xl font-bold text-accent mb-1">5-15%</h3>
                            <p className="text-sm text-gray-300 uppercase tracking-wider">Commission Rate</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
                            <h3 className="text-3xl font-bold text-accent mb-1">7 Days</h3>
                            <p className="text-sm text-gray-300 uppercase tracking-wider">Payment Cycle</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
                            <h3 className="text-3xl font-bold text-accent mb-1">200+</h3>
                            <p className="text-sm text-gray-300 uppercase tracking-wider">Active Buyers</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
                            <h3 className="text-3xl font-bold text-accent mb-1">₹49</h3>
                            <p className="text-sm text-gray-300 uppercase tracking-wider">Listing Fee</p>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                        <Link href="/auth/register?type=vendor" className="bg-accent hover:bg-accent/90 text-white px-8 py-4 rounded-full font-bold text-lg uppercase tracking-wider transition-all hover:scale-105 shadow-xl">
                            Start Selling in 48 Hours
                        </Link>
                        <div className="flex items-center gap-2">
                            <Phone className="w-5 h-5 text-gray-400" />
                            <span className="font-bold text-lg">Call: +91-95537-65363</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Choose AZZRO */}
            <section className="py-20 container mx-auto px-4 max-w-6xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose AZZRO?</h2>
                    <p className="text-gray-500 max-w-2xl mx-auto">Join 20+ successful vendors already selling on India's most vendor-friendly marketplace</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <FeatureCard
                        icon={TrendingUp}
                        title="Industry-Low Commissions"
                        desc="Pay only 5-15% commission - significantly lower than other major platforms. More profit stays in your pocket, helping you grow faster."
                    />
                    <FeatureCard
                        icon={Clock}
                        title="Fast 7-Day Payments"
                        desc="Get paid within 7 days of delivery confirmation. No long waiting periods. Better cash flow means better business growth."
                    />
                    <FeatureCard
                        icon={TrendingUp}
                        title="Targeted Buyers"
                        desc="Access India's largest collection of ethnic wear shoppers actively searching for sarees, kurtas, lehengas, and traditional fashion."
                    />
                    <FeatureCard
                        icon={CheckCircle2}
                        title="Zero Listing Fees"
                        desc="Upload unlimited products across all categories. Pay commission only when you make a sale. No hidden charges or monthly fees."
                    />
                    <FeatureCard
                        icon={ShieldCheck}
                        title="Real-Time Dashboard"
                        desc="Track sales, inventory, payments, and customer reviews 24/7 from your vendor portal. Complete transparency and control."
                    />
                    <FeatureCard
                        icon={HelpCircle}
                        title="Dedicated Support"
                        desc="Personal account manager for all vendors. Get help with onboarding, marketing, and growing your sales. We succeed when you succeed."
                    />
                </div>
            </section>

            {/* Commission Table */}
            <section className="py-20 bg-gray-50 px-4">
                <div className="container mx-auto max-w-5xl">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">Transparent Commission Structure</h2>
                    <p className="text-gray-500 text-center mb-12 max-w-2xl mx-auto">We believe in transparent pricing. No hidden fees, no surprises. Pay only when you sell.</p>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-100 border-b border-gray-200">
                                    <th className="p-4 font-bold text-gray-700">Category</th>
                                    <th className="p-4 font-bold text-primary">AZZRO Commission</th>
                                    <th className="p-4 font-bold text-gray-400">Other Platforms</th>
                                    <th className="p-4 font-bold text-green-600">Your Savings</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm">
                                {[
                                    { cat: "Sarees & Ethnic Wear", az: "5-10%", oth: "12-18%", save: "2-8%" },
                                    { cat: "Fashion & Apparel", az: "5-15%", oth: "14-25%", save: "8-9%" },
                                    { cat: "Western Wear", az: "8-15%", oth: "15-23%", save: "8%" },
                                    { cat: "Kids Wear", az: "7-14%", oth: "13-20%", save: "6%" },
                                    { cat: "Footwear", az: "5-13%", oth: "11-17%", save: "5%" },
                                    { cat: "Accessories & Jewelry", az: "5-13%", oth: "12-20%", save: "7%" },
                                    { cat: "Home & Furniture", az: "5-13%", oth: "8-18%", save: "6%" },
                                    { cat: "Beauty Products", az: "5-13%", oth: "10-18%", save: "6%" },
                                ].map((row, i) => (
                                    <tr key={i} className="hover:bg-gray-50">
                                        <td className="p-4 font-medium">{row.cat}</td>
                                        <td className="p-4 font-bold text-black">{row.az}</td>
                                        <td className="p-4 text-gray-400">{row.oth}</td>
                                        <td className="p-4 font-bold text-green-600">{row.save}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Fees Breakdown Grid */}
                    <div className="grid md:grid-cols-2 gap-8 mt-12">
                        <div className="bg-white p-6 rounded-xl border border-gray-100">
                            <h4 className="font-bold text-lg mb-4 flex items-center gap-2"><span className="text-xl">💡</span> Additional Fees Breakdown</h4>
                            <ul className="space-y-3 text-sm text-gray-600">
                                <li className="flex justify-between border-b border-gray-50 pb-2"><span>Fixed Fee:</span> <span className="font-bold text-black">₹5-80 per order (tier-based)</span></li>
                                <li className="flex justify-between border-b border-gray-50 pb-2"><span>Payment Processing:</span> <span className="font-bold text-black">2% (Prepaid) / 2.5% + ₹15 (COD)</span></li>
                                <li className="flex justify-between border-b border-gray-50 pb-2"><span>Shipping:</span> <span className="font-bold text-black">FREE under 300g (local)</span></li>
                                <li className="flex justify-between border-b border-gray-50 pb-2"><span>Closing Charges:</span> <span className="font-bold text-black text-green-600">ZERO (with AZZRO fulfillment)</span></li>
                                <li className="flex justify-between pt-2"><span>Listing Fee:</span> <span className="font-bold text-black">₹49 (Unlimited)</span></li>
                            </ul>
                        </div>
                        <div className="bg-primary text-white p-6 rounded-xl shadow-lg relative overflow-hidden">
                            <div className="relative z-10">
                                <h4 className="font-bold text-lg mb-4 flex items-center gap-2"><span className="text-xl">📈</span> Savings Example (₹1,000 Saree)</h4>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-sm opacity-90">
                                        <span>AZZRO Commission (8%)</span>
                                        <span className="font-bold text-lg">₹80</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm opacity-90">
                                        <span>Other Platforms (15%)</span>
                                        <span className="font-bold text-lg">₹150</span>
                                    </div>
                                    <div className="h-px bg-white/20 my-2"></div>
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold text-accent text-lg">Your Savings Per Sale</span>
                                        <span className="font-bold text-3xl text-accent">₹70</span>
                                    </div>
                                    <p className="text-xs text-center opacity-70 mt-4">Annual Savings (100 sales/month): ₹84,000</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Shipping Section */}
            <section className="py-20 container mx-auto px-4 max-w-4xl">
                <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center flex items-center justify-center gap-3"><Truck className="w-8 h-8" /> Shipping Charges</h2>
                <div className="border border-gray-200 rounded-xl overflow-hidden mb-8">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-3">Delivery Distance</th>
                                <th className="p-3">Weight</th>
                                <th className="p-3">Fee (₹)</th>
                                <th className="p-3">Remarks</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            <tr><td className="p-3">0 – 50 KM (Local)</td><td className="p-3">Up to 500g</td><td className="p-3 font-bold">₹30</td><td className="p-3 text-gray-500">Same city / nearby</td></tr>
                            <tr><td className="p-3">51 – 200 KM (Zonal)</td><td className="p-3">Up to 500g</td><td className="p-3 font-bold">₹40</td><td className="p-3 text-gray-500">Within state</td></tr>
                            <tr><td className="p-3">201 – 800 KM</td><td className="p-3">Up to 500g</td><td className="p-3 font-bold">₹60</td><td className="p-3 text-gray-500">Inter-state</td></tr>
                            <tr><td className="p-3">800+ KM (National)</td><td className="p-3">Up to 500g</td><td className="p-3 font-bold">₹80</td><td className="p-3 text-gray-500">Remote locations</td></tr>
                        </tbody>
                    </table>
                    <div className="bg-gray-50 p-3 text-xs text-gray-500 text-center">Additional Weight: ₹20 per extra 500g</div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-6 border border-gray-100 rounded-xl">
                        <h4 className="font-bold mb-3 flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-green-600" /> Closing Fees (Per Order)</h4>
                        <ul className="text-sm space-y-2 text-gray-600">
                            <li className="flex justify-between"><span>₹0 – ₹499</span> <span className="font-bold">₹10</span></li>
                            <li className="flex justify-between"><span>₹500 – ₹999</span> <span className="font-bold">₹20</span></li>
                            <li className="flex justify-between"><span>₹1,000 – ₹2,999</span> <span className="font-bold">₹40</span></li>
                            <li className="flex justify-between"><span>₹3,000+</span> <span className="font-bold">₹65</span></li>
                        </ul>
                    </div>
                    <div className="p-6 border border-gray-100 rounded-xl bg-gray-50/50">
                        <h4 className="font-bold mb-3">Shipping & Logistics</h4>
                        <ul className="text-sm space-y-3 text-gray-600 list-disc list-inside">
                            <li><span className="font-bold text-black">Self-Ship:</span> Use own courier. Upload tracking in 24h.</li>
                            <li><span className="font-bold text-black">AZZRO Fulfillment (AFS):</span> We handle everything for 3-5% extra fee.</li>
                            <li><span className="font-bold text-black">Insurance:</span> Shipments &gt; ₹2,000 automatically insured.</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Steps to Start */}
            <section className="py-20 bg-black text-white px-4">
                <div className="container mx-auto max-w-6xl">
                    <h2 className="text-3xl font-bold mb-12 text-center">Start Selling in 4 Easy Steps</h2>
                    <div className="grid md:grid-cols-4 gap-8">
                        {[
                            { step: "01", title: "Register Business", desc: "Fill simple form with GST & Bank details. Takes 5 mins." },
                            { step: "02", title: "Upload Docs", desc: "Submit GST, Cancelled Cheque & Business Proof." },
                            { step: "03", title: "List Products", desc: "Bulk upload via Excel or manually add products." },
                            { step: "04", title: "Start Selling", desc: "Go live immediately. Receive orders in 48 hours." }
                        ].map((s) => (
                            <div key={s.step} className="relative p-6 border border-white/10 rounded-xl hover:bg-white/5 transition-colors group">
                                <span className="text-6xl font-black text-white/5 absolute -top-4 -right-2 group-hover:text-accent/20 transition-colors">{s.step}</span>
                                <h3 className="text-xl font-bold mb-3 text-accent">{s.title}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 container mx-auto px-4 max-w-4xl">
                <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">Frequently Asked Questions</h2>
                <div className="space-y-6">
                    <FAQItem q="What documents do I need to register?" a="You need: (1) Valid GST registration, (2) Cancelled cheque/bank statement, (3) Business proof, and (4) PAN card of business owner." />
                    <FAQItem q="How quickly will I receive payments?" a="Payments are processed within 7 days of delivery for top-tier vendors. New vendors receive payments within 10-14 days initially, reducing to 7 days as you build rating." />
                    <FAQItem q="Can I sell branded products?" a="Yes, if you have proper authorization/invoices. Selling counterfeit items leads to immediate suspension." />
                    <FAQItem q="Who handles customer service?" a="AZZRO handles general queries. Product-specific questions are routed to you via the vendor portal (respond within 12h)." />
                    <FAQItem q="What if I don't have warehousing?" a="Use AZZRO Fulfillment Service (AFS). We store, pack, and ship for an additional 3-5% fee. No minimums." />
                </div>
            </section>

            {/* Footer Contact */}
            <section className="py-12 bg-gray-100 border-t border-gray-200">
                <div className="container mx-auto max-w-6xl px-4 flex flex-col md:flex-row justify-between gap-8">
                    <div>
                        <h4 className="font-bold text-lg mb-4">Ready to Start Selling?</h4>
                        <p className="text-gray-600 mb-4">Join 1,000+ vendors growing their fashion business on AZZRO.</p>
                        <Link href="/auth/register?type=vendor" className="bg-black text-white px-6 py-3 rounded font-bold uppercase hover:bg-gray-800 transition-colors">Register Now</Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
                        <div className="flex gap-3">
                            <Mail className="w-5 h-5 text-accent flex-shrink-0" />
                            <div>
                                <p className="font-bold">Email Support</p>
                                <p className="text-gray-500">vendor-support@azzro.in</p>
                                <p className="text-xs text-gray-400 mt-1">Response within 4 business hours</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <Phone className="w-5 h-5 text-accent flex-shrink-0" />
                            <div>
                                <p className="font-bold">WhatsApp Business</p>
                                <p className="text-gray-500">+91-95537-65363</p>
                                <p className="text-xs text-gray-400 mt-1">Mon-Sat, 10 AM - 7 PM IST</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <MapPin className="w-5 h-5 text-accent flex-shrink-0" />
                            <div>
                                <p className="font-bold">Visit Us</p>
                                <p className="text-gray-500">VIP Hills, Madhapur<br />Hyderabad, Telangana 500081</p>
                                <p className="text-xs text-gray-400 mt-1">By appointment only</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

function FeatureCard({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) {
    return (
        <div className="p-6 rounded-xl border border-gray-100 hover:shadow-lg transition-all group hover:border-accent/20 bg-white">
            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-accent group-hover:text-white transition-colors">
                <Icon className="w-6 h-6 text-gray-700 group-hover:text-white" />
            </div>
            <h3 className="font-bold text-xl mb-3">{title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
        </div>
    );
}

function FAQItem({ q, a }: { q: string, a: string }) {
    return (
        <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
            <h4 className="font-bold text-lg mb-2 text-gray-800">{q}</h4>
            <p className="text-gray-600 text-sm">{a}</p>
        </div>
    );
}
