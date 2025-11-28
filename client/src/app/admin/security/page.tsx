'use client';

import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, Lock, Globe, Search } from 'lucide-react';

export default function SecurityPage() {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/security-logs`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setLogs(data.logs || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                        <Shield className="text-pink-500" size={32} />
                        Fort Knox Security Center
                    </h1>
                    <p className="text-gray-400">Monitoreo de amenazas y logs de seguridad en tiempo real.</p>
                </div>
                <button
                    onClick={fetchLogs}
                    className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-all"
                >
                    Refrescar Logs
                </button>
            </div>

            {/* Threat Map Placeholder */}
            <div className="bg-[#111] border border-white/10 rounded-2xl p-8 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/10 to-purple-900/10" />
                <Globe className="w-24 h-24 text-gray-700 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Mapa de Amenazas Global</h3>
                <p className="text-gray-500 mb-6">Visualización de ataques bloqueados en tiempo real</p>
                <div className="flex justify-center gap-4">
                    <div className="bg-black/50 px-4 py-2 rounded-lg border border-white/10">
                        <span className="text-red-500 font-bold block">0</span>
                        <span className="text-xs text-gray-500">Ataques Críticos</span>
                    </div>
                    <div className="bg-black/50 px-4 py-2 rounded-lg border border-white/10">
                        <span className="text-orange-500 font-bold block">12</span>
                        <span className="text-xs text-gray-500">Intentos Bloqueados</span>
                    </div>
                    <div className="bg-black/50 px-4 py-2 rounded-lg border border-white/10">
                        <span className="text-green-500 font-bold block">100%</span>
                        <span className="text-xs text-gray-500">Uptime</span>
                    </div>
                </div>
            </div>

            {/* Logs Table */}
            <div className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-white/10 flex justify-between items-center">
                    <h3 className="font-bold text-white">Registro de Auditoría (Audit Logs)</h3>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                        <input
                            type="text"
                            placeholder="Buscar IP, evento..."
                            className="bg-black border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-pink-500"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-white/5 text-gray-400 text-xs uppercase">
                            <tr>
                                <th className="px-6 py-4">Timestamp</th>
                                <th className="px-6 py-4">Nivel</th>
                                <th className="px-6 py-4">Código</th>
                                <th className="px-6 py-4">IP Origen</th>
                                <th className="px-6 py-4">Mensaje</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {logs.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                        No hay eventos de seguridad registrados recientemente.
                                    </td>
                                </tr>
                            ) : (
                                logs.map((log, index) => (
                                    <tr key={index} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 text-gray-400 font-mono text-xs">
                                            {new Date(log.timestamp).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${log.level === 'CRITICAL' ? 'bg-red-500/20 text-red-400' :
                                                    log.level === 'WARNING' ? 'bg-orange-500/20 text-orange-400' :
                                                        'bg-blue-500/20 text-blue-400'
                                                }`}>
                                                {log.level || 'INFO'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-white font-mono text-xs">
                                            {log.code}
                                        </td>
                                        <td className="px-6 py-4 text-gray-300 font-mono text-xs">
                                            {log.ip}
                                        </td>
                                        <td className="px-6 py-4 text-gray-300 text-sm">
                                            {log.message}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
