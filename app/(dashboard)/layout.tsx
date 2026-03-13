'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { LayoutDashboard, ShoppingBag, Settings, LogOut, Users, ShieldCheck, User, Package, Heart, MapPin } from "lucide-react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const isVendor = pathname.startsWith('/vendor');
    const isAdmin = pathname.startsWith('/admin');
    const isAccount = pathname.startsWith('/account');

    const dashboardType = isVendor ? 'Vendor' : isAdmin ? 'Admin' : 'Account';
    const accentColor = isAdmin ? 'text-purple-600 bg-purple-50' : 'text-primary bg-gray-100';

    // ✅ Load voice.js
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "/voice.js";
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return (
        <>
            <div className="min-h-screen flex bg-gray-50">
                {/* Sidebar */}
                <aside className="w-64 bg-white border-r border-gray-200 fixed h-full hidden md:flex flex-col z-20">
                    <div className="h-16 flex items-center px-6 border-b border-gray-100">
                        <Link href="/" className="text-2xl font-bold tracking-tighter hover:text-primary transition-colors">
                            AZZRO
                            <span className={`text-xs font-normal ml-2 px-2 py-0.5 rounded-full ${accentColor}`}>
                                {dashboardType}
                            </span>
                        </Link>
                    </div>

                    <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
                        {isVendor && (
                            <>
                                <NavItem href="/vendor" icon={LayoutDashboard} label="Overview" active={pathname === '/vendor'} />
                                <NavItem href="/vendor/products" icon={ShoppingBag} label="Products" active={pathname.includes('/products')} />
                                <NavItem href="/vendor/orders" icon={Package} label="Orders" active={pathname.includes('/orders')} />
                                <NavItem href="/vendor/settings" icon={Settings} label="Settings" active={pathname.includes('/settings')} />
                            </>
                        )}

                        {isAdmin && (
                            <>
                                <NavItem href="/admin" icon={LayoutDashboard} label="Overview" active={pathname === '/admin'} />
                                <NavItem href="/admin/users" icon={Users} label="Users Management" active={pathname.includes('/users')} />
                                <NavItem href="/admin/approvals" icon={ShieldCheck} label="Vendor Approvals" active={pathname.includes('/approvals')} />
                                <NavItem href="/admin/settings" icon={Settings} label="Platform Settings" active={pathname.includes('/settings')} />
                            </>
                        )}

                        {isAccount && (
                            <>
                                <NavItem href="/account" icon={User} label="My Profile" active={pathname === '/account'} />
                                <NavItem href="/account/orders" icon={Package} label="My Orders" active={pathname.includes('/orders')} />
                                <NavItem href="/account/wishlist" icon={Heart} label="Wishlist" active={pathname.includes('/wishlist')} />
                                <NavItem href="/account/addresses" icon={MapPin} label="Saved Addresses" active={pathname.includes('/addresses')} />
                            </>
                        )}
                    </nav>

                    <div className="p-4 border-t border-gray-100">
                        <button className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg w-full transition-colors">
                            <LogOut className="w-4 h-4" />
                            Logout
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 md:ml-64 p-8">
                    {children}
                </main>
            </div>

            {/* ✅ VOICE MODAL */}
            <div id="azzro-voice-overlay" className="azzro-voice-overlay">
                <div className="azzro-voice-modal">
                    <div className="azzro-voice-header">
                        <h2 className="azzro-voice-title">🎙️ Azzro Voice Assistant</h2>
                        <button id="azzro-close-btn" className="azzro-voice-close">
                            &times;
                        </button>
                    </div>

                    <div id="azzro-mic-visual" className="azzro-mic-visual"></div>
                    <div id="speaking-indicator" className="speaking-indicator"></div>

                    <div id="azzro-status" className="azzro-status-message">
                        Hi! I'm your shopping assistant.
                    </div>

                    <div id="azzro-transcript" className="azzro-transcript">
                        Your command will appear here...
                    </div>

                    <div id="azzro-response" className="azzro-response"></div>
                </div>
            </div>
        </>
    );
}

function NavItem({ href, icon: Icon, label, active }: { href: string; icon: any; label: string; active: boolean }) {
    return (
        <Link
            href={href}
            className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                active
                    ? 'text-black bg-gray-100'
                    : 'text-gray-500 hover:text-black hover:bg-gray-50'
            }`}
        >
            <Icon className={`w-4 h-4 ${active ? 'text-black' : 'text-gray-400'}`} />
            {label}
        </Link>
    );
}