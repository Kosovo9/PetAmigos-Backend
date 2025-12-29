
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, DollarSign, Share2, TrendingUp } from 'lucide-react';
import { useAffiliateSystem } from '../hooks/useAffiliateSystem';

export const AffiliateSystem: React.FC = () => {
    const {
        affiliateLink,
        referrals,
        earnings,
        generateLink,
        copyLink,
        shareOnSocial
    } = useAffiliateSystem();

    const stats = [
        { title: 'Referencias Totales', value: referrals.total, icon: Users, color: 'bg-blue-500' },
        { title: 'Referencias Activas', value: referrals.active, icon: TrendingUp, color: 'bg-green-500' },
        { title: 'Ganancias', value: `$${earnings.total}`, icon: DollarSign, color: 'bg-purple-500' },
        { title: 'Tasa de Conversión', value: `${earnings.conversionRate}%`, icon: Share2, color: 'bg-orange-500' },
    ];

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2">Sistema de Afiliados</h1>
                <p className="text-gray-600">Gana dinero compartiendo PetMatch con otros amantes de mascotas</p>
            </div>

            {/* Affiliate Link Generator */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-8 text-white"
            >
                <h2 className="text-2xl font-bold mb-4">Tu Link de Afiliado</h2>

                <div className="flex gap-4 mb-6">
                    <input
                        value={affiliateLink}
                        readOnly
                        className="flex-1 px-4 py-3 bg-white/20 rounded-lg text-white placeholder-white/70"
                        placeholder="Genera tu link único"
                    />
                    <button
                        onClick={copyLink}
                        className="px-6 py-3 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                    >
                        Copiar
                    </button>
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={() => shareOnSocial('twitter')}
                        className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                    >
                        Compartir en Twitter
                    </button>
                    <button
                        onClick={() => shareOnSocial('facebook')}
                        className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                    >
                        Compartir en Facebook
                    </button>
                    <button
                        onClick={() => shareOnSocial('whatsapp')}
                        className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                    >
                        Compartir en WhatsApp
                    </button>
                </div>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-2xl p-6 shadow-lg"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                                <stat.icon className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-sm text-gray-500">{stat.title}</span>
                        </div>
                        <p className="text-2xl font-bold">{stat.value}</p>
                    </motion.div>
                ))}
            </div>

            {/* Referral Tracking */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-2xl p-6 shadow-lg"
            >
                <h3 className="text-xl font-bold mb-4">Seguimiento de Referencias</h3>

                <div className="space-y-4">
                    {referrals.recent.map((referral: any) => (
                        <div key={referral.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                                <p className="font-medium">{referral.name}</p>
                                <p className="text-sm text-gray-500">{referral.email}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-medium">{referral.status}</p>
                                <p className="text-xs text-gray-500">{referral.date}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Commission Structure */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6"
            >
                <h3 className="text-xl font-bold mb-4">Estructura de Comisiones</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600">10%</div>
                        <p className="text-sm text-gray-600">Primer mes</p>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-purple-600">5%</div>
                        <p className="text-sm text-gray-600">Meses 2-6</p>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-pink-600">2.5%</div>
                        <p className="text-sm text-gray-600">Por vida</p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
