
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';
import { useSecurityMetrics } from '../hooks/useSecurityMetrics';
import { ThreatMap, SecurityEvents } from './SecurityComponents';

export const SecurityDashboard: React.FC = () => {
    const { metrics, events, loading } = useSecurityMetrics();
    const [threatLevel, setThreatLevel] = useState<'low' | 'medium' | 'high'>('low');

    useEffect(() => {
        // Calcular nivel de amenaza
        if (metrics.blockedAttempts > 100 || metrics.suspiciousLogins > 10) {
            setThreatLevel('high');
        } else if (metrics.blockedAttempts > 50 || metrics.suspiciousLogins > 5) {
            setThreatLevel('medium');
        } else {
            setThreatLevel('low');
        }
    }, [metrics]);

    const threatColors = {
        low: 'from-green-400 to-green-600',
        medium: 'from-yellow-400 to-orange-500',
        high: 'from-red-400 to-red-600',
    };

    const securityStats = [
        {
            title: 'Intentos Bloqueados',
            value: metrics.blockedAttempts.toLocaleString(),
            icon: Shield,
            color: 'bg-red-500',
            trend: '+12%',
        },
        {
            title: 'Logins Sospechosos',
            value: metrics.suspiciousLogins.toLocaleString(),
            icon: AlertTriangle,
            color: 'bg-orange-500',
            trend: '+8%',
        },
        {
            title: 'Tokens Revocados',
            value: metrics.revokedTokens.toLocaleString(),
            icon: CheckCircle,
            color: 'bg-green-500',
            trend: '+5%',
        },
        {
            title: 'Ataques Mitigados',
            value: metrics.mitigatedAttacks.toLocaleString(),
            icon: TrendingUp,
            color: 'bg-blue-500',
            trend: '+15%',
        },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 space-y-6"
        >
            {/* Header with Threat Level */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Centro de Seguridad</h1>
                    <p className="text-gray-600">Monitoreo y protección 24/7</p>
                </div>

                <motion.div
                    animate={{
                        scale: threatLevel === 'high' ? [1, 1.05, 1] : 1,
                    }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className={`bg-gradient-to-r ${threatColors[threatLevel]} rounded-2xl p-4 text-white text-center`}
                >
                    <Shield className="w-8 h-8 mx-auto mb-2" />
                    <p className="font-bold">NIVEL DE AMENAZA</p>
                    <p className="text-2xl font-bold">{threatLevel.toUpperCase()}</p>
                </motion.div>
            </div>

            {/* Security Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {securityStats.map((stat, index) => (
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
                            <span className="text-sm text-green-500 font-medium">{stat.trend}</span>
                        </div>
                        <h3 className="text-gray-600 text-sm mb-2">{stat.title}</h3>
                        <p className="text-2xl font-bold">{stat.value}</p>
                    </motion.div>
                ))}
            </div>

            {/* Threat Map */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h2 className="text-xl font-bold mb-4">Mapa de Amenazas en Tiempo Real</h2>
                <ThreatMap threats={metrics.geographicThreats} />
            </div>

            {/* Recent Security Events */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h2 className="text-xl font-bold mb-4">Eventos de Seguridad Recientes</h2>
                <SecurityEvents events={events} />
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="p-4 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors"
                >
                    🔄 Forzar Renovación de Tokens
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="p-4 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-colors"
                >
                    ✅ Verificar Integridad de Datos
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="p-4 bg-purple-50 text-purple-600 rounded-xl hover:bg-purple-100 transition-colors"
                >
                    🛡️ Ejecutar Auditoría Completa
                </motion.button>
            </div>
        </motion.div>
    );
};
