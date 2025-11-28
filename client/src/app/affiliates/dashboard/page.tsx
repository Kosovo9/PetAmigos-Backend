'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, MousePointer, Users, ArrowUpRight, Copy, Check, ShieldCheck } from 'lucide-react';

export default function AffiliateDashboard() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/affiliates/dashboard`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const json = await res.json();
            setData(json);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const copyLink = (code: string) => {
        navigator.clipboard.writeText(`https://petmatch.fun?ref=${code}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (loading) return <div className="p-8 text-white">Cargando tu imperio...</div>;

    const StatCard = ({ title, value, icon: Icon, trend }: any) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#111] border border-white/10 p-6 rounded-2xl relative overflow-hidden group hover:border-green-500/30 transition-all"
        >
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-white/5 rounded-xl text-green-400 group-hover:bg-green-500/20 transition-colors">
                    <Icon size={24} />
                </div>
                {trend && (
                    <span className="text-xs font-bold text-green-400 bg-green-500/10 px-2 py-1 rounded-full flex items-center gap-1">
                        <ArrowUpRight size={12} /> {trend}
                    </span>
                )}
            </div>
            <h3 className="text-gray-400 text-sm font-medium mb-1">{title}</h3>
            <p className="text-3xl font-black text-white">{value}</p>
        </motion.div>
    );

    return (
        <div className="p-8 space-y-8">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Panel de Control</h1>
                    <p className="text-gray-400">Bienvenido de vuelta, Partner. Aquí están tus métricas de hoy.</p>
                </div>
                <div className="flex gap-3">
                    <button className="bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-lg border border-white/10 transition-all text-sm font-medium">
                        Ver Reporte Completo
                    </button>
                    <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-all text-sm font-medium shadow-lg shadow-green-600/20">
                        Solicitar Pago
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Ganancias Totales"
                    value={`$${data?.dashboard?.lifetimeEarnings?.toFixed(2) || '0.00'}`}
                    icon={DollarSign}
                    trend="+12.5%"
                />
                <StatCard
                    title="Saldo Disponible"
                    value={`$${data?.dashboard?.balance?.toFixed(2) || '0.00'}`}
                    icon={ShieldCheck}
                />
                <StatCard
                    title="Clics Totales"
                    value={data?.dashboard?.totalClicks || '0'}
                    icon={MousePointer}
                    trend="+5.2%"
                />
                <StatCard
                    title="Conversiones"
                    value={data?.dashboard?.activeCodes || '0'}
                    icon={Users}
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Links Section */}
                <div className="lg:col-span-2 bg-[#111] border border-white/10 rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-white mb-6">Tus Enlaces Activos</h3>
                    <div className="space-y-4">
                        {data?.codes?.map((code: any, i: number) => (
                            <div key={i} className="bg-black/50 border border-white/5 rounded-xl p-4 flex items-center justify-between group hover:border-white/10 transition-all">
                                <div>
                                    <p className="text-white font-mono font-bold text-lg">{code.code}</p>
                                    <p className="text-sm text-gray-500">Comisión: 20% • Descuento: 10%</p>
                                </div>
                                <button
                                    onClick={() => copyLink(code.code)}
                                    className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-gray-300 transition-all"
                                >
                                    {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                                    {copied ? 'Copiado' : 'Copiar Link'}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tier Progress */}
                <div className="bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-white mb-2">Tu Nivel: {data?.dashboard?.tier?.toUpperCase()}</h3>
                    <p className="text-gray-400 text-sm mb-6">Sube de nivel para desbloquear mayores comisiones.</p>

                    <div className="relative pt-4 pb-8">
                        <div className="flex justify-between text-xs text-gray-500 mb-2 font-mono">
                            <span>BRONZE</span>
                            <span>PLATINUM</span>
                        </div>
                        <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${data?.dashboard?.nextTierProgress || 0}%` }}
                                className="bg-gradient-to-r from-yellow-600 to-yellow-400 h-full"
                            />
                        </div>
                    </div>

                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
                        <h4 className="text-yellow-500 font-bold text-sm mb-2 flex items-center gap-2">
                            <Award size={16} /> Próxima Recompensa
                        </h4>
                        <p className="text-gray-300 text-xs">
                            Al llegar a Platinum, obtendrás comisiones del 30% y pagos instantáneos.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
