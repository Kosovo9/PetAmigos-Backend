'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Share2, X, Copy, Check } from 'lucide-react';

export default function NanoBananaShield() {
    const [isOpen, setIsOpen] = useState(false);
    const [referralData, setReferralData] = useState<any>(null);
    const [copied, setCopied] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if we should show the popup automatically (e.g., first visit)
        const hasSeenPopup = localStorage.getItem('hasSeenNanoBanana');
        if (!hasSeenPopup) {
            setTimeout(() => setIsOpen(true), 5000); // Show after 5s
            localStorage.setItem('hasSeenNanoBanana', 'true');
        }

        fetchReferralData();
    }, []);

    const fetchReferralData = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                return;
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/referrals/dashboard`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                setReferralData(data.data);
            }
        } catch (error) {
            console.error('Error fetching referral data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleShare = async (platform: string) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            // Call API to reward user
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/referrals/social-share`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ platform })
            });

            // Actual share logic
            const text = `¡Mira las fotos navideñas de mi mascota creadas con IA! 🎄✨ Usa mi código ${referralData?.referralCode} para obtener 3 fotos gratis en PetMatch.fun`;
            const url = referralData?.shareUrl || 'https://www.petmatch.fun';

            if (platform === 'whatsapp') {
                window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
            } else if (platform === 'facebook') {
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
            } else if (platform === 'twitter') {
                window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
            }

            // Refresh data to show new credits
            fetchReferralData();

        } catch (error) {
            console.error('Error sharing:', error);
        }
    };

    const copyToClipboard = () => {
        if (referralData?.referralCode) {
            navigator.clipboard.writeText(referralData.referralCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (loading || !referralData) return null; // Don't show if not logged in or loading

    return (
        <>
            {/* Floating Trigger Button */}
            <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-4 rounded-full shadow-[0_0_20px_rgba(251,191,36,0.6)] flex items-center justify-center"
            >
                <Gift className="w-8 h-8 animate-bounce" />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full border-2 border-white">
                    FREE
                </span>
            </motion.button>

            {/* Modal Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />

                        <motion.div
                            initial={{ scale: 0.5, opacity: 0, y: 100 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.5, opacity: 0, y: 100 }}
                            className="relative bg-gradient-to-br from-indigo-900 to-purple-900 border border-white/20 rounded-3xl p-8 max-w-md w-full shadow-2xl overflow-hidden"
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setIsOpen(false)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            {/* Content */}
                            <div className="text-center relative z-10">
                                <div className="w-20 h-20 bg-yellow-400 rounded-full mx-auto mb-6 flex items-center justify-center shadow-[0_0_30px_rgba(250,204,21,0.5)]">
                                    <Gift className="w-10 h-10 text-orange-600" />
                                </div>

                                <h2 className="text-3xl font-black text-white mb-2">
                                    ¡Gana Créditos Gratis!
                                </h2>
                                <p className="text-gray-300 mb-8">
                                    Invita amigos y gana <span className="text-yellow-400 font-bold">10 créditos</span> por cada uno. Ellos reciben 3 créditos extra.
                                </p>

                                {/* Referral Code Box */}
                                <div className="bg-white/10 rounded-xl p-4 mb-8 flex items-center justify-between border border-white/10">
                                    <div className="text-left">
                                        <p className="text-xs text-gray-400 uppercase tracking-wider">Tu Código</p>
                                        <p className="text-2xl font-mono font-bold text-white tracking-widest">
                                            {referralData.referralCode}
                                        </p>
                                    </div>
                                    <button
                                        onClick={copyToClipboard}
                                        className="bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-colors"
                                    >
                                        {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5 text-white" />}
                                    </button>
                                </div>

                                {/* Share Buttons */}
                                <div className="space-y-3">
                                    <button
                                        onClick={() => handleShare('whatsapp')}
                                        className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
                                    >
                                        <Share2 className="w-5 h-5" />
                                        Compartir en WhatsApp
                                    </button>

                                    <button
                                        onClick={() => handleShare('facebook')}
                                        className="w-full bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
                                    >
                                        <Share2 className="w-5 h-5" />
                                        Compartir en Facebook
                                    </button>
                                </div>

                                {/* Stats Footer */}
                                <div className="mt-8 pt-6 border-t border-white/10 flex justify-between text-sm text-gray-400">
                                    <span>Referidos: <strong className="text-white">{referralData.totalReferrals}</strong></span>
                                    <span>Créditos: <strong className="text-yellow-400">{referralData.credits}</strong></span>
                                </div>
                            </div>

                            {/* Background decoration */}
                            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                                <div className="absolute -top-20 -left-20 w-60 h-60 bg-purple-500/20 rounded-full blur-3xl"></div>
                                <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-blue-500/20 rounded-full blur-3xl"></div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
