'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import {
    Home, Shield, Target, Heart, Bell, LogOut, User, Settings
} from 'lucide-react';

export function Navigation() {
    const { user, logout } = useAuth();
    const pathname = usePathname();
    const [showUserMenu, setShowUserMenu] = useState(false);

    if (!user) return null;

    const navItems = [
        { href: '/', label: 'Inicio', icon: Home, roles: ['user', 'admin', 'advertiser', 'shelter'] },
        { href: '/admin/dashboard', label: 'Admin', icon: Shield, roles: ['admin'] },
        { href: '/advertiser/dashboard', label: 'Dashboard', icon: Target, roles: ['advertiser'] },
        { href: '/shelter/dashboard', label: 'Dashboard', icon: Heart, roles: ['shelter'] },
    ].filter(item => item.roles.includes(user.role));

    return (
        <nav className="bg-white border-b shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-8">
                        <Link href="/" className="text-xl font-bold text-blue-600">
                            PetMatch
                        </Link>

                        <div className="hidden md:flex items-center space-x-1">
                            {navItems.map(item => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`px-3 py-2 rounded-lg flex items-center space-x-2 transition ${pathname === item.href
                                            ? 'bg-blue-50 text-blue-600'
                                            : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    <item.icon className="h-4 w-4" />
                                    <span>{item.label}</span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <button className="p-2 rounded-lg hover:bg-gray-100 relative">
                            <Bell className="h-5 w-5 text-gray-600" />
                            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
                        </button>

                        <div className="relative">
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100"
                            >
                                <img
                                    src={user.avatar || 'https://i.pravatar.cc/150?img=1'}
                                    alt={user.name}
                                    className="h-8 w-8 rounded-full"
                                />
                                <div className="hidden md:block text-left">
                                    <p className="text-sm font-medium">{user.name}</p>
                                    <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                                </div>
                            </button>

                            {showUserMenu && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-2 z-50">
                                    <Link
                                        href="/settings"
                                        className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100"
                                    >
                                        <Settings className="h-4 w-4" />
                                        <span>Configuración</span>
                                    </Link>
                                    <button
                                        onClick={() => {
                                            logout();
                                            window.location.href = '/login';
                                        }}
                                        className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 w-full text-left text-red-600"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        <span>Cerrar Sesión</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
