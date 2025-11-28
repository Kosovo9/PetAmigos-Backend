'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiActivity, FiImage, FiHardDrive, FiClock, FiRefreshCw } from 'react-icons/fi';

export default function GenerationDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/admin/generation-stats', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setStats(data.stats);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
        const interval = setInterval(fetchStats, 5000);
        return () => clearInterval(interval);
    }, []);

    if (loading) return <div className="p-8 text-white">Cargando dashboard...</div>;

    return (
        <div className="p-8 bg-gray-900 min-h-screen text-white">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                    🚀 Generation Command Center
                </h1>
                <button
                    onClick={fetchStats}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
                >
                    <FiRefreshCw /> Refresh
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <KPICard
                    icon={<FiImage className="w-6 h-6 text-blue-400" />}
                    label="Total Images"
                    value={stats?.totalImages || 0}
                    subtext="Generated in batch"
                />
                <KPICard
                    icon={<FiHardDrive className="w-6 h-6 text-green-400" />}
                    label="Total Size"
                    value={`${stats?.totalSizeMB || 0} MB`}
                    subtext="Disk usage"
                />
                <KPICard
                    icon={<FiActivity className="w-6 h-6 text-yellow-400" />}
                    label="Speed"
                    value="~0.5s"
                    subtext="Per image (Avg)"
                />
                <KPICard
                    icon={<FiClock className="w-6 h-6 text-pink-400" />}
                    label="Last Active"
                    value={stats?.lastGenerated ? new Date(stats.lastGenerated).toLocaleTimeString() : 'N/A'}
                    subtext="Real-time update"
                />
            </div>

            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <FiActivity /> Live Generation Feed
                </h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-gray-400 border-b border-gray-700">
                                <th className="p-3">File Name</th>
                                <th className="p-3">Size</th>
                                <th className="p-3">Quality</th>
                                <th className="p-3">Engine</th>
                                <th className="p-3">Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats?.files?.map((file: any, index: number) => (
                                <motion.tr
                                    key={file.name}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="border-b border-gray-700/50 hover:bg-gray-700/30"
                                >
                                    <td className="p-3 font-mono text-sm text-blue-300">{file.name}</td>
                                    <td className="p-3 text-sm">{file.size}</td>
                                    <td className="p-3">
                                        <span className="px-2 py-1 bg-green-900/50 text-green-400 text-xs rounded-full border border-green-700">
                                            {file.quality}
                                        </span>
                                    </td>
                                    <td className="p-3 text-sm text-gray-300">{file.engine}</td>
                                    <td className="p-3 text-sm text-gray-400">
                                        {new Date(file.created).toLocaleTimeString()}
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function KPICard({ icon, label, value, subtext }: any) {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg"
        >
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-gray-700/50 rounded-lg">{icon}</div>
                <span className="text-xs text-gray-400 bg-gray-900 px-2 py-1 rounded">{subtext}</span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">{value}</h3>
            <p className="text-gray-400 text-sm">{label}</p>
        </motion.div>
    );
}
