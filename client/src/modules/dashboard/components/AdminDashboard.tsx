
import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, DollarSign, Activity } from 'lucide-react';
import { useAdminStats } from '../hooks/useAdminStats';
import { RevenueChart } from './RevenueChart';
import { UserGrowthChart } from './UserGrowthChart';
import { RealTimeActivity } from './RealTimeActivity';

export const AdminDashboard: React.FC = () => {
    const { stats, loading } = useAdminStats();

    const cards = [
        { title: 'Ingresos Mensuales', value: `$${stats.monthlyRevenue}`, icon: DollarSign, color: 'from-green-400 to-green-600' },
        { title: 'Usuarios Activos', value: stats.activeUsers.toLocaleString(), icon: Users, color: 'from-blue-400 to-blue-600' },
        { title: 'Crecimiento', value: `+${stats.growthRate}%`, icon: TrendingUp, color: 'from-purple-400 to-purple-600' },
        { title: 'Actividad Real-time', value: stats.realtimeActivity, icon: Activity, color: 'from-orange-400 to-orange-600' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 space-y-6"
        >
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, index) => (
                    <motion.div
                        key={card.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`bg-gradient-to-r ${card.color} rounded-2xl p-6 text-white shadow-xl`}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white/80 text-sm">{card.title}</p>
                                <p className="text-3xl font-bold mt-2">{card.value}</p>
                            </div>
                            <card.icon className="w-10 h-10 text-white/80" />
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RevenueChart data={stats.revenueData} />
                <UserGrowthChart data={stats.userGrowth} />
            </div>

            {/* Real-time Activity */}
            <RealTimeActivity activities={stats.realtimeActivities} />
        </motion.div>
    );
};
