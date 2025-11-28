'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    DollarSign,
    Link as LinkIcon,
    Settings,
    LogOut,
    Menu,
    X,
    TrendingUp,
    Shield,
    Award
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function AffiliateLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        // Verificar auth
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login?redirect=/affiliates');
        }
    }, []);

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', href: '/affiliates/dashboard' },
        { icon: LinkIcon, label: 'Mis Enlaces', href: '/affiliates/links' },
        { icon: DollarSign, label: 'Pagos & Wallet', href: '/affiliates/payouts' },
        { icon: TrendingUp, label: 'Analíticas', href: '/affiliates/analytics' },
        { icon: Settings, label: 'Configuración', href: '/affiliates/settings' },
    ];

    return (
        <div className="min-h-screen bg-black text-white flex font-sans">
            {/* Sidebar */}
            <motion.aside
                initial={{ width: 280 }}
                animate={{ width: isSidebarOpen ? 280 : 80 }}
                className="bg-[#0a0a0a] border-r border-white/10 flex flex-col fixed h-full z-50 transition-all duration-300"
            >
                {/* Logo */}
                <div className="h-20 flex items-center justify-between px-6 border-b border-white/10">
                    {isSidebarOpen ? (
                        <div className="flex flex-col">
                            <span className="text-xl font-black bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">
                                PETMATCH
                            </span>
                            <span className="text-xs text-gray-500 tracking-widest uppercase">Affiliate Partner</span>
                        </div>
                    ) : (
                        <span className="text-xl font-black text-green-500">PM</span>
                    )}
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                {/* Menu */}
                <nav className="flex-1 py-8 px-4 space-y-2">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link key={item.href} href={item.href}>
                                <div className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                        ? 'bg-green-500/10 text-green-400 border border-green-500/30'
                                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                    }`}>
                                    <item.icon size={24} />
                                    {isSidebarOpen && (
                                        <span className="font-medium whitespace-nowrap">{item.label}</span>
                                    )}
                                </div>
                            </Link>
                        );
                    })}
                </nav>

                {/* Tier Badge */}
                {isSidebarOpen && (
                    <div className="p-4 mx-4 mb-4 bg-gradient-to-br from-yellow-600/20 to-yellow-900/20 border border-yellow-600/30 rounded-xl">
                        <div className="flex items-center gap-3 mb-2">
                            <Award className="text-yellow-500" size={24} />
                            <div>
                                <p className="text-xs text-yellow-500 font-bold uppercase">Nivel Actual</p>
                                <p className="text-sm font-bold text-white">GOLD PARTNER</p>
                            </div>
                        </div>
                        <div className="w-full bg-black/50 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-yellow-500 h-full w-[75%]" />
                        </div>
                        <p className="text-[10px] text-gray-400 mt-1 text-right">75% para Platinum</p>
                    </div>
                )}

                {/* User Profile */}
                <div className="p-4 border-t border-white/10">
                    <div className={`flex items-center gap-3 ${!isSidebarOpen && 'justify-center'}`}>
                        <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center font-bold border border-white/10">
                            U
                        </div>
                        {isSidebarOpen && (
                            <div className="flex-1 overflow-hidden">
                                <p className="text-sm font-bold truncate">Usuario</p>
                                <button
                                    onClick={() => {
                                        localStorage.removeItem('token');
                                        router.push('/login');
                                    }}
                                    className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
                                >
                                    <LogOut size={12} /> Cerrar Sesión
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </motion.aside>

            {/* Main Content */}
            <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-[280px]' : 'ml-[80px]'}`}>
                {children}
            </main>
        </div>
    );
}
