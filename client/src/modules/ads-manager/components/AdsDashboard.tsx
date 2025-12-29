
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, TrendingUp, DollarSign, Eye } from 'lucide-react';
import { useAdsStats } from '../hooks/useAdsStats';
import { CampaignCreator } from './CampaignCreator';
import { AdsAnalytics } from './AdsAnalytics';

export const AdsDashboard: React.FC = () => {
    const { stats, campaigns } = useAdsStats();
    const [showCreator, setShowCreator] = useState(false);

    const metrics = [
        { title: 'ROAS', value: `${stats.roas}x`, icon: TrendingUp, color: 'text-green-500' },
        { title: 'Gasto Total', value: `$${stats.totalSpend}`, icon: DollarSign, color: 'text-blue-500' },
        { title: 'Impresiones', value: stats.impressions.toLocaleString(), icon: Eye, color: 'text-purple-500' },
        { title: 'CTR', value: `${stats.ctr}%`, icon: Target, color: 'text-orange-500' },
    ];

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">PetAds Manager</h1>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowCreator(true)}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl font-medium shadow-lg"
                >
                    Crear Campaña
                </motion.button>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {metrics.map((metric, index) => (
                    <motion.div
                        key={metric.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-2xl p-6 shadow-lg"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <metric.icon className={`w-8 h-8 ${metric.color}`} />
                            <span className="text-sm text-gray-500">{metric.title}</span>
                        </div>
                        <p className="text-2xl font-bold">{metric.value}</p>
                    </motion.div>
                ))}
            </div>

            {/* Analytics */}
            <AdsAnalytics data={stats.analytics} />

            {/* Campaign Creator Modal */}
            {showCreator && (
                <CampaignCreator onClose={() => setShowCreator(false)} />
            )}
        </div>
    );
};
