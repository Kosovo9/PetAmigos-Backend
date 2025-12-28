'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, X } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

export default function LanguageSelector() {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    const languages = [
        { code: 'en-US', name: 'English (US)', flag: '🇺🇸', nativeName: 'English (US)' },
        { code: 'en-GB', name: 'English (UK)', flag: '🇬🇧', nativeName: 'English (UK)' },
        { code: 'es-MX', name: 'Spanish (MX)', flag: '🇲🇽', nativeName: 'Español (MX)' },
        { code: 'es-ES', name: 'Spanish (ES)', flag: '🇪🇸', nativeName: 'Español (ES)' },
        { code: 'pt-BR', name: 'Portuguese (BR)', flag: '🇧🇷', nativeName: 'Português (BR)' },
        { code: 'fr-FR', name: 'French (FR)', flag: '🇫🇷', nativeName: 'Français (FR)' },
        { code: 'de-DE', name: 'German (DE)', flag: '🇩🇪', nativeName: 'Deutsch (DE)' },
        { code: 'ja-JP', name: 'Japanese (JP)', flag: '🇯🇵', nativeName: '日本語 (JP)' },
        { code: 'it-IT', name: 'Italian (IT)', flag: '🇮🇹', nativeName: 'Italiano (IT)' },
        { code: 'zh-CN', name: 'Chinese (CN)', flag: '🇨🇳', nativeName: '简体中文' },
        { code: 'ru-RU', name: 'Russian (RU)', flag: '🇷🇺', nativeName: 'Русский (RU)' },
        { code: 'ko-KR', name: 'Korean (KR)', flag: '🇰🇷', nativeName: '한국어 (KR)' },
        { code: 'ar-SA', name: 'Arabic (SA)', flag: '🇸🇦', nativeName: 'العربية (SA)' },
        { code: 'es-AR', name: 'Spanish (AR)', flag: '🇦🇷', nativeName: 'Español (AR)' },
        { code: 'es-CO', name: 'Spanish (CO)', flag: '🇨🇴', nativeName: 'Español (CO)' },
        { code: 'en-CA', name: 'English (CA)', flag: '🇨🇦', nativeName: 'English (CA)' },
        { code: 'en-AU', name: 'English (AU)', flag: '🇦🇺', nativeName: 'English (AU)' },
        { code: 'fr-CA', name: 'French (CA)', flag: '🇨🇦', nativeName: 'Français (CA)' },
        { code: 'pt-PT', name: 'Portuguese (PT)', flag: '🇵🇹', nativeName: 'Português (PT)' },
        { code: 'es-CL', name: 'Spanish (CL)', flag: '🇨🇱', nativeName: 'Español (CL)' }
    ];

    const getCurrentLanguage = () => {
        const currentLocale = pathname.split('/')[1];
        return languages.find(lang => lang.code === currentLocale) || languages[0];
    };

    const changeLanguage = (langCode: string) => {
        const currentPath = pathname.split('/').slice(2).join('/') || '';
        router.push(`/${langCode}/${currentPath}`);
        setIsOpen(false);
    };

    return (
        <>
            {/* Floating Language Button */}
            <motion.div
                className="fixed top-8 left-8 z-50"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.5, type: "spring" }}
            >
                <motion.button
                    onClick={() => setIsOpen(!isOpen)}
                    className="relative group"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    title={`Current: ${getCurrentLanguage().nativeName}`}
                >
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-xl opacity-60 group-hover:opacity-100 transition-opacity" />

                    {/* Main button */}
                    <div className="relative bg-gradient-to-br from-blue-600 to-purple-600 p-4 rounded-full shadow-2xl border-4 border-white/20">
                        <Globe className="w-8 h-8 text-white" />
                    </div>
                </motion.button>

                {/* Floating stars around button */}
                {[...Array(3)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-yellow-300 rounded-full pointer-events-none"
                        style={{
                            top: Math.random() * 100 - 50,
                            left: Math.random() * 100 - 50
                        }}
                        animate={{
                            rotate: 360,
                            scale: [1, 1.5, 1],
                            opacity: [0.5, 1, 0.5]
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            delay: i * 0.5
                        }}
                    />
                ))}
            </motion.div>

            {/* Language Selection Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: -100, scale: 0.8 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -100, scale: 0.8 }}
                        transition={{ type: "spring", damping: 20 }}
                        className="fixed top-28 left-8 z-40 bg-gradient-to-br from-blue-900/95 to-purple-900/95 backdrop-blur-xl p-6 rounded-2xl shadow-2xl border-2 border-white/20 min-w-[350px] max-h-[500px] overflow-y-auto"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <Globe className="w-6 h-6 text-white" />
                                <div>
                                    <h3 className="text-white font-bold text-lg">Choose Language</h3>
                                    <p className="text-white/60 text-xs">Select your preferred language</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-white/60 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Current Selection */}
                        <div className="bg-white/10 rounded-lg p-3 mb-4">
                            <p className="text-white/50 text-xs mb-1">Current:</p>
                            <div className="flex items-center gap-2">
                                <span className="text-2xl">{getCurrentLanguage().flag}</span>
                                <div>
                                    <p className="text-white font-semibold">{getCurrentLanguage().nativeName}</p>
                                    <p className="text-white/60 text-xs">{getCurrentLanguage().name}</p>
                                </div>
                            </div>
                        </div>

                        {/* Language Grid */}
                        <div className="grid grid-cols-2 gap-3">
                            {languages.map((lang) => {
                                const isCurrent = getCurrentLanguage().code === lang.code;
                                return (
                                    <motion.button
                                        key={lang.code}
                                        onClick={() => changeLanguage(lang.code)}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className={`p-4 rounded-xl transition-all ${isCurrent
                                            ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-black shadow-lg shadow-yellow-500/50'
                                            : 'bg-white/10 hover:bg-white/20 text-white'
                                            }`}
                                    >
                                        <div className="flex flex-col items-center gap-2">
                                            <span className="text-3xl">{lang.flag}</span>
                                            <div className="text-center">
                                                <p className={`font-bold text-sm ${isCurrent ? 'text-black' : 'text-white'}`}>
                                                    {lang.nativeName}
                                                </p>
                                                <p className={`text-xs ${isCurrent ? 'text-black/70' : 'text-white/60'}`}>
                                                    {lang.name}
                                                </p>
                                            </div>
                                            {isCurrent && (
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    className="text-black text-xs font-bold"
                                                >
                                                    ✓ Active
                                                </motion.div>
                                            )}
                                        </div>
                                    </motion.button>
                                );
                            })}
                        </div>

                        {/* Footer */}
                        <div className="mt-4 pt-4 border-t border-white/10">
                            <p className="text-white/40 text-xs text-center">
                                🌍 20 Regional Locales • Universal Access
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
