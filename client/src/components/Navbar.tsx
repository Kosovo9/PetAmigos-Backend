'use client';

import { Search, Bell, MessageSquare, Plus, Menu, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { UserButton, useUser } from "@clerk/nextjs";

export function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { isSignedIn, user } = useUser();

    // Detectar scroll para efecto glassmorphism
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav
            className={`fixed top-0 z-50 w-full transition-all duration-300 ${scrolled
                    ? 'bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm'
                    : 'bg-transparent border-transparent'
                }`}
        >
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex h-20 items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="relative">
                            <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
                            <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                <Sparkles className="h-5 w-5 text-white" />
                            </div>
                        </div>
                        <span className="text-2xl font-black bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent tracking-tight">
                            PetMatch<span className="text-blue-600">.</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1 bg-white/50 backdrop-blur-md px-2 py-1.5 rounded-full border border-gray-200/50 shadow-sm">
                        {[
                            { name: 'Descubrir', href: '/feed' },
                            { name: 'Adoptar', href: '/adopt' },
                            { name: 'Citas', href: '/dating' },
                            { name: 'Comunidad', href: '/community' }
                        ].map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="px-5 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-white rounded-full transition-all duration-200"
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 text-white text-sm font-bold shadow-lg hover:shadow-xl hover:bg-slate-800 transition-all border border-slate-700"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Publicar</span>
                        </motion.button>

                        {isSignedIn ? (
                            <div className="flex items-center gap-3 pl-2 border-l border-gray-200">
                                <button className="hidden sm:flex relative p-2 rounded-full hover:bg-gray-100 transition-colors text-slate-600">
                                    <Bell className="w-5 h-5" />
                                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                                </button>
                                <UserButton afterSignOutUrl="/" />
                            </div>
                        ) : (
                            <Link href="/sign-in">
                                <Button variant="ghost" className="font-semibold text-slate-700">Ingresar</Button>
                            </Link>
                        )}

                        <button
                            className="md:hidden p-2 rounded-xl bg-white shadow-sm border border-gray-100 text-slate-700"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: '100vh' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden fixed inset-0 top-20 bg-white z-40 overflow-y-auto"
                    >
                        <div className="container mx-auto px-4 py-8 flex flex-col gap-6">
                            {['Descubrir', 'Adoptar', 'Citas', 'Comunidad', 'Donar'].map((item, idx) => (
                                <motion.a
                                    key={item}
                                    href="#"
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="text-2xl font-bold text-slate-900 border-b border-gray-100 pb-4"
                                >
                                    {item}
                                </motion.a>
                            ))}
                            <motion.button
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="mt-4 w-full py-4 rounded-2xl bg-blue-600 text-white font-bold text-lg shadow-xl shadow-blue-500/30"
                            >
                                Publicar Mascota
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
