
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, DollarSign, Users, Target } from 'lucide-react';
import { useValuation } from '../hooks/useValuation';
import { ValuationChart, MonthlyProgression } from './ValuationComponents';

export const ValuationDashboard: React.FC = () => {
    const { valuation, loading } = useValuation();
    const [showDetails, setShowDetails] = useState(false);

    if (loading || !valuation) return <div>Cargando valuación...</div>;

    const metrics = [
        {
            title: 'Valuación Actual',
            value: `$${valuation.adjusted_valuation.toLocaleString()}`,
            subtitle: 'USD',
            icon: DollarSign,
            color: 'from-green-400 to-green-600',
            growth: '+85%',
        },
        {
            title: 'Target 12 meses',
            value: '$350,000,000',
            subtitle: 'USD',
            icon: Target,
            color: 'from-purple-400 to-purple-600',
            growth: 'Meta',
        },
        {
            title: 'Crecimiento Mensual',
            value: '85%',
            subtitle: 'CAGR',
            icon: TrendingUp,
            color: 'from-blue-400 to-blue-600',
            growth: '+5%',
        },
        {
            title: 'Usuarios Valuados',
            value: valuation.user_metrics.total_users.toLocaleString(),
            subtitle: 'MAU',
            icon: Users,
            color: 'from-orange-400 to-orange-600',
            growth: '+42%',
        },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 space-y-6"
        >
            {/* Hero Section */}
            <div className="text-center mb-8">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
                >
                    Valuación PetMatch Global
                </motion.h1>
                <p className="text-xl text-gray-600">
                    Camino a los <span className="font-bold text-green-600">$350 millones</span>
                </p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {metrics.map((metric, index) => (
                    <motion.div
                        key={metric.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`bg-gradient-to-r ${metric.color} rounded-2xl p-6 text-white shadow-xl`}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <metric.icon className="w-10 h-10 text-white/80" />
                            <span className="text-sm text-white/80">{metric.growth}</span>
                        </div>
                        <h3 className="text-white/80 text-sm mb-2">{metric.title}</h3>
                        <p className="text-3xl font-bold mb-1">{metric.value}</p>
                        <p className="text-white/70 text-sm">{metric.subtitle}</p>
                    </motion.div>
                ))}
            </div>

            {/* Progression Timeline */}
            <MonthlyProgression data={valuation.monthly_progression} />

            {/* Valuation Methodology */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white rounded-2xl p-6 shadow-xl"
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Metodología de Valuación</h2>
                    <button
                        onClick={() => setShowDetails(!showDetails)}
                        className="text-blue-500 hover:text-blue-600"
                    >
                        {showDetails ? 'Ocultar' : 'Ver'} detalles
                    </button>
                </div>

                <ValuationChart
                    revenue={valuation.methodology.revenue}
                    users={valuation.methodology.users}
                    engagement={valuation.methodology.engagement}
                    dcf={valuation.methodology.dcf}
                />

                <AnimatePresence>
                    {showDetails && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-6 p-4 bg-gray-50 rounded-lg"
                        >
                            <pre className="text-sm whitespace-pre-wrap">{valuation.methodology.report}</pre>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Achievement Badges */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-6 text-white"
            >
                <h2 className="text-xl font-bold mb-4">🏆 Logros de Valuación</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                        <div className="text-3xl mb-2">🦄</div>
                        <p className="font-bold">Unicornio en Camino</p>
                        <p className="text-sm text-white/80">Valuación >$1B próximo año</p>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl mb-2">📈</div>
                        <p className="font-bold">Crecimiento Exponencial</p>
                        <p className="text-sm text-white/80">85% CAGR mensual</p>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl mb-2">🌍</div>
                        <p className="font-bold">Impacto Global</p>
                        <p className="text-sm text-white/80">Mercado $261B mascotas</p>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};
