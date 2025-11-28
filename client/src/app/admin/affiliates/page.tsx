'use client';

import React, { useState, useEffect } from 'react';
import { DollarSign, Users, TrendingUp, Clock, CheckCircle, XCircle } from 'lucide-react';

export default function AdminAffiliatesPage() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/affiliates/stats`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setStats(data.stats);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-white">Cargando...</div>;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Gestión de Afiliados</h1>
                <p className="text-gray-400">Panel de control para el programa de partners.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-[#111] border border-white/10 p-6 rounded-2xl">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-green-500/10 rounded-xl text-green-400">
                            <Users size={24} />
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">Total Afiliados</p>
                            <p className="text-2xl font-bold text-white">{stats?.totalAffiliates || 0}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-[#111] border border-white/10 p-6 rounded-2xl">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400">
                            <DollarSign size={24} />
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">Comisiones Pagadas</p>
                            <p className="text-2xl font-bold text-white">${stats?.totalCommissionsPaid?.toFixed(2) || '0.00'}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-[#111] border border-white/10 p-6 rounded-2xl">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-orange-500/10 rounded-xl text-orange-400">
                            <Clock size={24} />
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">Pagos Pendientes</p>
                            <p className="text-2xl font-bold text-white">${stats?.pendingPayouts?.toFixed(2) || '0.00'}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-[#111] border border-white/10 p-6 rounded-2xl">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400">
                            <TrendingUp size={24} />
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">Tasa de Conversión</p>
                            <p className="text-2xl font-bold text-white">4.2%</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Top Affiliates */}
            <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-6">Top 10 Afiliados</h3>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-white/5 text-gray-400 text-xs uppercase">
                            <tr>
                                <th className="px-4 py-3 text-left">Rank</th>
                                <th className="px-4 py-3 text-left">Nombre</th>
                                <th className="px-4 py-3 text-left">Email</th>
                                <th className="px-4 py-3 text-left">Tier</th>
                                <th className="px-4 py-3 text-right">Ganancias Totales</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {stats?.topAffiliates?.map((aff: any, i: number) => (
                                <tr key={i} className="hover:bg-white/5">
                                    <td className="px-4 py-4 text-white font-bold">#{i + 1}</td>
                                    <td className="px-4 py-4 text-white">{aff.name}</td>
                                    <td className="px-4 py-4 text-gray-400 font-mono text-sm">{aff.email}</td>
                                    <td className="px-4 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${aff.affiliate.tier === 'platinum' ? 'bg-purple-500/20 text-purple-400' :
                                                aff.affiliate.tier === 'gold' ? 'bg-yellow-500/20 text-yellow-400' :
                                                    aff.affiliate.tier === 'silver' ? 'bg-gray-500/20 text-gray-400' :
                                                        'bg-orange-500/20 text-orange-400'
                                            }`}>
                                            {aff.affiliate.tier.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 text-right text-green-400 font-bold">
                                        ${aff.affiliate.lifetimeEarnings.toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Tier Distribution */}
            <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-6">Distribución por Nivel</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {stats?.tierDistribution?.map((tier: any) => (
                        <div key={tier._id} className="bg-black/50 p-4 rounded-xl border border-white/5">
                            <p className="text-gray-400 text-sm mb-1">{tier._id.toUpperCase()}</p>
                            <p className="text-2xl font-bold text-white">{tier.count}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
