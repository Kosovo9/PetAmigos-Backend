'use client';

import React, { useState } from 'react';
import { Users, Copy, QrCode, DollarSign, TrendingUp, Gift } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AffiliatesPage() {
    const [promoCode, setPromoCode] = useState('');
    const [earnings, setEarnings] = useState(0);
    const [referrals, setReferrals] = useState(0);

    const generatePromoCode = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/affiliates/create-code`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    code: `PET${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
                    discount: 20
                })
            });

            const data = await response.json();
            if (data.success) {
                setPromoCode(data.code);
            }
        } catch (error) {
            console.error('Error generating code:', error);
        }
    };

    const copyCode = () => {
        navigator.clipboard.writeText(promoCode);
        alert('¡Código copiado!');
    };

    return (
        <div className="min-h-screen pt-32 pb-20 px-4">
            <div className="container mx-auto max-w-6xl">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 bg-purple-500/20 text-purple-300 px-4 py-2 rounded-full text-sm font-bold mb-4">
                        <Users className="w-4 h-4" />
                        PROGRAMA DE AFILIADOS
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
                        Gana con PetMatch
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                        Comparte el amor por las mascotas y gana comisiones increíbles
                    </p>
                </motion.div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-xl p-6 rounded-2xl border border-white/10"
                    >
                        <DollarSign className="w-10 h-10 text-green-400 mb-4" />
                        <h3 className="text-3xl font-black text-white mb-2">${earnings}</h3>
                        <p className="text-gray-400">Ganancias Totales</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-xl p-6 rounded-2xl border border-white/10"
                    >
                        <Users className="w-10 h-10 text-blue-400 mb-4" />
                        <h3 className="text-3xl font-black text-white mb-2">{referrals}</h3>
                        <p className="text-gray-400">Referidos Activos</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="bg-gradient-to-br from-pink-600/20 to-red-600/20 backdrop-blur-xl p-6 rounded-2xl border border-white/10"
                    >
                        <TrendingUp className="w-10 h-10 text-pink-400 mb-4" />
                        <h3 className="text-3xl font-black text-white mb-2">30%</h3>
                        <p className="text-gray-400">Comisión por Venta</p>
                    </motion.div>
                </div>

                {/* Promo Code Generator */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 backdrop-blur-xl p-8 rounded-3xl border border-white/10 mb-12"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <Gift className="w-8 h-8 text-yellow-400" />
                        <h2 className="text-2xl font-black text-white">Tu Código de Afiliado</h2>
                    </div>

                    {!promoCode ? (
                        <button
                            onClick={generatePromoCode}
                            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:scale-105 transition-transform w-full md:w-auto"
                        >
                            Generar Mi Código
                        </button>
                    ) : (
                        <div className="flex flex-col md:flex-row gap-4 items-center">
                            <div className="flex-1 bg-black/50 p-4 rounded-xl border border-purple-500/50">
                                <p className="text-3xl font-black text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                                    {promoCode}
                                </p>
                            </div>
                            <button
                                onClick={copyCode}
                                className="bg-white/10 hover:bg-white/20 text-white px-6 py-4 rounded-xl font-bold flex items-center gap-2 transition-colors"
                            >
                                <Copy className="w-5 h-5" />
                                Copiar
                            </button>
                        </div>
                    )}
                </motion.div>

                {/* Benefits */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                        { icon: '💰', title: 'Comisión del 30%', desc: 'Por cada venta que generes' },
                        { icon: '🎁', title: 'Bonos Especiales', desc: 'Al alcanzar metas mensuales' },
                        { icon: '📊', title: 'Dashboard Completo', desc: 'Sigue tus estadísticas en tiempo real' },
                        { icon: '🚀', title: 'Retiros Rápidos', desc: 'Recibe tus ganancias en 24-48hrs' }
                    ].map((benefit, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 + idx * 0.1 }}
                            className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors"
                        >
                            <div className="text-4xl mb-3">{benefit.icon}</div>
                            <h3 className="text-xl font-bold text-white mb-2">{benefit.title}</h3>
                            <p className="text-gray-400">{benefit.desc}</p>
                        </motion.div>
                    ))}
                </div>

            </div>
        </div>
    );
}
