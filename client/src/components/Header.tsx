'use client';
import Link from 'next/link';
import { Menu, X, Sparkles, MessageCircle, MapPin, Heart, DollarSign, Users, LogOut, User as UserIcon } from 'lucide-react';
import { useState } from 'react';
import { useMockAuth } from './MockAuthProvider';

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const { isSignedIn, user, signOut } = useMockAuth();

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-lg border-b border-white/10">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 bg-gradient-to-tr from-purple-600 to-pink-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(168,85,247,0.5)]">
                            <Sparkles className="text-white w-6 h-6" />
                        </div>
                        <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                            PetMatch<span className="text-purple-400">.fun</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        <Link href="/christmas" className="text-white/80 hover:text-white font-medium transition-colors flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-pink-400" />
                            Studio
                        </Link>
                        <Link href="/chat" className="text-white/80 hover:text-white font-medium transition-colors flex items-center gap-2">
                            <MessageCircle className="w-4 h-4 text-purple-400" />
                            Chat
                        </Link>
                        <Link href="/app/en/dog-walking/miami" className="text-white/80 hover:text-white font-medium transition-colors flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-green-400" />
                            Paseos
                        </Link>
                        <Link href="/love-stories" className="text-white/80 hover:text-white font-medium transition-colors flex items-center gap-2">
                            <Heart className="w-4 h-4 text-red-400" />
                            Historias
                        </Link>
                        <Link href="/affiliates" className="text-white/80 hover:text-white font-medium transition-colors flex items-center gap-2">
                            <Users className="w-4 h-4 text-blue-400" />
                            Afiliaciones
                        </Link>
                        <Link href="/pricing" className="text-white/80 hover:text-white font-medium transition-colors flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-yellow-400" />
                            Precios
                        </Link>
                    </nav>

                    {/* Auth Buttons */}
                    <div className="hidden md:flex items-center gap-3">
                        {!isSignedIn ? (
                            <>
                                <Link
                                    href="/sign-in"
                                    className="text-white/80 hover:text-white font-medium transition-colors px-4 py-2"
                                >
                                    Iniciar Sesión
                                </Link>
                                <Link
                                    href="/sign-up"
                                    className="bg-white text-black px-6 py-2.5 rounded-full font-bold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                                >
                                    Empezar Gratis
                                </Link>
                            </>
                        ) : (
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2 text-white/90">
                                    <UserIcon className="w-5 h-5" />
                                    <span className="text-sm">{user?.firstName}</span>
                                </div>
                                <button
                                    onClick={signOut}
                                    className="text-white/80 hover:text-white font-medium transition-colors px-4 py-2 flex items-center gap-2"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Salir
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-white p-2"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-black/95 backdrop-blur-xl border-t border-white/10 absolute w-full">
                    <div className="container mx-auto px-4 py-6 flex flex-col gap-4">
                        <Link href="/christmas" className="text-lg text-white/90 py-2 border-b border-white/5">🎄 AI Studio</Link>
                        <Link href="/chat" className="text-lg text-white/90 py-2 border-b border-white/5">💬 Chat</Link>
                        <Link href="/walks" className="text-lg text-white/90 py-2 border-b border-white/5">🐕 Paseos</Link>
                        <Link href="/love-stories" className="text-lg text-white/90 py-2 border-b border-white/5">❤️ Historias</Link>
                        <Link href="/affiliates" className="text-lg text-white/90 py-2 border-b border-white/5">👥 Afiliaciones</Link>
                        <Link href="/pricing" className="text-lg text-white/90 py-2 border-b border-white/5">💲 Precios</Link>
                        <Link href="/signup" className="bg-purple-600 text-white text-center py-3 rounded-xl font-bold mt-4">
                            Crear Cuenta Gratis
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
}
