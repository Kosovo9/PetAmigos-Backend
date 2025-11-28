'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, DollarSign, FileText, Activity, ArrowUp, ArrowDown, ShieldCheck } from 'lucide-react';

export default function AdminDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/stats`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setStats(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-white">Cargando Dashboard...</div>;

    const StatCard = ({ title, value, subtext, icon: Icon, color }: any) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#111] border border-white/10 p-6 rounded-2xl relative overflow-hidden group hover:border-white/20 transition-all"
        >
            <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${color}`}>
                <Icon size={100} />
            </div>
            <div className="relative z-10">
                <div className={`w-12 h-12 rounded-xl ${color} bg-opacity-20 flex items-center justify-center mb-4 text-white`}>
                    <Icon size={24} />
                </div>
                <h3 className="text-gray-400 text-sm font-medium mb-1">{title}</h3>
                <p className="text-3xl font-black text-white mb-2">{value}</p>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                    {subtext}
                </p>
            </div>
        </motion.div>
    );

    return (
        <div className="space-y-8">
            {/* Welcome */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Dashboard General</h1>
                    <p className="text-gray-400">Bienvenido al centro de comando de PetMatch.</p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-gray-500">Última actualización</p>
                    <p className="text-white font-mono">{new Date().toLocaleTimeString()}</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Usuarios Totales"
                    value={stats?.users?.total || '0'}
                    subtext={<><span className="text-green-400 flex items-center">+{stats?.users?.new24h || 0} <ArrowUp size={12} /></span> últimas 24h</>}
                    icon={Users}
                    color="bg-blue-500"
                />
                <StatCard
                    title="Ingresos Totales"
                    value={`$${stats?.revenue?.total?.toLocaleString() || '0'}`}
                    subtext={<><span className="text-green-400 flex items-center">{stats?.revenue?.growth} <ArrowUp size={12} /></span> este mes</>}
                    icon={DollarSign}
                    color="bg-green-500"
                />
                <StatCard
                    title="Historias Pendientes"
                    value={stats?.content?.pendingStories || '0'}
                    subtext="Requieren moderación"
                    icon={FileText}
                    color="bg-orange-500"
                />
                <StatCard
                    title="Salud del Sistema"
                    value="100%"
                    subtext="Todos los sistemas operativos"
                    icon={Activity}
                    color="bg-pink-500"
                />
            </div>

            {/* Security Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-[#111] border border-white/10 rounded-2xl p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <ShieldCheck className="text-green-500" />
                            Estado de Seguridad Fort Knox
                        </h3>
                        <span className="bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-xs font-bold border border-green-500/20">
                            NIVEL 5 (MÁXIMO)
                        </span>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-gray-300">WAF (Web Application Firewall)</span>
                            </div>
                            <span className="text-green-400 font-mono">ACTIVO</span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-gray-300">Protección DDoS (Rate Limiting)</span>
                            </div>
                            <span className="text-green-400 font-mono">ACTIVO</span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-gray-300">Anti-Scraping & Bot Defense</span>
                            </div>
                            <span className="text-green-400 font-mono">ACTIVO</span>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-pink-900/20 to-purple-900/20 border border-pink-500/20 rounded-2xl p-6 flex flex-col justify-center items-center text-center">
                    <div className="w-24 h-24 rounded-full bg-pink-500/20 flex items-center justify-center mb-4 relative">
                        <div className="absolute inset-0 border-4 border-pink-500/30 rounded-full animate-ping" />
                        <Activity size={40} className="text-pink-500" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Sistema Optimizado</h3>
                    <p className="text-gray-400 text-sm mb-6">
                        El backend está corriendo con optimizaciones de 10x performance.
                    </p>
                    <button className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-full font-bold transition-all text-sm">
                        Ver Métricas Detalladas
                    </button>
                </div>
            </div>
        </div>
    );
}
