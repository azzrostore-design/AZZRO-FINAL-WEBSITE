import Image from "next/image";
import { Package, User, MapPin, Heart } from "lucide-react";

export default function CustomerAccount() {
    return (
        <div className="p-8 max-w-5xl mx-auto">
            <h1 className="text-2xl font-bold mb-8">My Account</h1>

            <div className="flex gap-6 mb-8">
                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                    <User className="w-8 h-8 text-gray-400" />
                </div>
                <div>
                    <h2 className="text-xl font-bold">Rahul Sharma</h2>
                    <p className="text-gray-500">rahul.sharma@example.com</p>
                    <p className="text-gray-500 text-sm mt-1">+91 98765 43210</p>
                    <button className="text-accent text-sm font-bold mt-2">Edit Profile</button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <DashboardCard icon={Package} title="Orders" desc="Check your order status" href="/account/orders" />
                <DashboardCard icon={Heart} title="Wishlist" desc="Your favorite items" href="/account/wishlist" />
                <DashboardCard icon={MapPin} title="Addresses" desc="Save addresses for checkout" href="/account/addresses" />
            </div>

            <div className="mt-12">
                <h3 className="text-lg font-bold mb-4">Recent Orders</h3>
                <div className="border border-gray-200 rounded-lg p-4 flex gap-4 bg-white relative">
                    <div className="w-20 h-20 bg-gray-100 rounded relative overflow-hidden">
                        <Image src="https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=200" alt="Product" fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                        <h4 className="font-bold flex justify-between">
                            <span>Levis 511 Slim Fit Jeans</span>
                            <span className="text-sm text-green-600">Delivered on 5 Feb</span>
                        </h4>
                        <p className="text-sm text-gray-500 mt-1">Order #AZ782312</p>
                        <p className="text-sm font-bold mt-2">₹2,499</p>
                    </div>
                    <div className="absolute top-4 right-4 flex flex-col gap-2">
                        <button className="text-xs font-bold text-accent border border-accent px-3 py-1 rounded hover:bg-accent hover:text-white transition-colors">Track Order</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function DashboardCard({ icon: Icon, title, desc, href }: { icon: any, title: string, desc: string, href: string }) {
    return (
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
            <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-black group-hover:text-white transition-colors">
                <Icon className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg mb-1">{title}</h3>
            <p className="text-sm text-gray-500">{desc}</p>
        </div>
    );
}
