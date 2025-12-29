
import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, Users, Globe } from 'lucide-react';
import { useIPOReadiness } from '../hooks/useIPOReadiness';

export const IPOReadinessDashboard: React.FC = () => {
    const { readiness, metrics } = useIPOReadiness();

    const ipoStages = [
        { stage: 'Pre-Seed', completed: true, date: '2024 Q1' },
        { stage: 'Series A ($50M)', completed: true, date: '2024 Q2' },
        { stage: 'Series B ($150M)', completed: false, date: '2024 Q3' },
        { stage: 'Series C ($250M)', completed: false, date: '2024 Q4' },
        { stage: 'IPO ($350M)', completed: false, date: '2025 Q1' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 space-y-6"
        >
            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    IPO Readiness Dashboard
                </h1>
                <p className="text-xl text-gray-600">
                    Camino a Nasdaq: <span className="font-bold">$350M USD</span>
                </p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <motion.div className="bg-gradient-to-r from-green-400 to-green-600 rounded-2xl p-6 text-white">
                    <DollarSign className="w-10 h-10 mb-4" />
                    <h3 className="text-white/80 text-sm mb-2">Valuación Actual</h3>
                    <p className="text-3xl font-bold">${metrics.currentValuation.toLocaleString()}</p>
                </motion.div>

                <motion.div className="bg-gradient-to-r from-blue-400 to-blue-600 rounded-2xl p-6 text-white">
                    <Users className="w-10 h-10 mb-4" />
                    <h3 className="text-white/80 text-sm mb-2">Usuarios Activos</h3>
                    <p className="text-3xl font-bold">{metrics.activeUsers.toLocaleString()}</p>
                </motion.div>

                <motion.div className="bg-gradient-to-r from-purple-400 to-purple-600 rounded-2xl p-6 text-white">
                    <TrendingUp className="w-10 h-10 mb-4" />
                    <h3 className="text-white/80 text-sm mb-2">Crecimiento</h3>
                    <p className="text-3xl font-bold">+{metrics.growthRate}%</p>
                </motion.div>

                <motion.div className="bg-gradient-to-r from-orange-400 to-orange-600 rounded-2xl p-6 text-white">
                    <Globe className="w-10 h-10 mb-4" />
                    <h3 className="text-white/80 text-sm mb-2">Países</h3>
                    <p className="text-3xl font-bold">{metrics.countries}+</p>
                </motion.div>
            </div>

            {/* IPO Timeline */}
            <div className="bg-white rounded-2xl p-6 shadow-xl">
                <h2 className="text-2xl font-bold mb-6">Cronograma IPO</h2>
                <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-green-500 to-purple-500"></div>

                    {ipoStages.map((stage, index) => (
                        <motion.div
                            key={stage.stage}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="relative flex items-center mb-8 last:mb-0"
                        >
                            {/* Timeline dot */}
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold z-10 ${stage.completed ? 'bg-green-500' : 'bg-gray-300'
                                }`}>
                                {stage.completed ? '✓' : index + 1}
                            </div>

                            {/* Content */}
                            <div className="ml-6 flex-1">
                                <h3 className="font-bold text-lg">{stage.stage}</h3>
                                <p className="text-gray-600">{stage.date}</p>
                                {stage.completed && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="mt-2 text-green-600 font-medium"
                                    >
                                        ✓ Completado
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Financial Projections */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6">
                <h2 className="text-2xl font-bold mb-4">Proyección Financiera 5 Años</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600 mb-2">$50M</div>
                        <p className="text-gray-600">Año 1</p>
                        <p className="text-sm text-green-600">+400% Growth</p>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-purple-600 mb-2">$150M</div>
                        <p className="text-gray-600">Año 2</p>
                        <p className="text-sm text-green-600">+200% Growth</p>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-pink-600 mb-2">$350M</div>
                        <p className="text-gray-600">Año 3</p>
                        <p className="text-sm text-green-600">IPO Ready</p>
                    </div>
                </div>
            </div>

            {/* Next Steps */}
            <div className="bg-white rounded-2xl p-6 shadow-xl">
                <h2 className="text-2xl font-bold mb-4">Próximos Pasos</h2>
                <div className="space-y-3">
                    {[
                        'Completar auditoría financiera Big 4',
                        'Contratar banco de inversión (Goldman Sachs/JP Morgan)',
                        'Preparar S-1 filing con SEC',
                        'Realizar roadshow con inversores',
                        'Determinar rango de precio por acción',
                        'Listar en Nasdaq como $PETM',
                    ].map((step, index) => (
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 + index * 0.1 }}
                            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                        >
                            <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                {index + 1}
                            </div>
                            <span>{step}</span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};
