'use client';

import React, { useState, useEffect } from 'react';
import { Activity, Zap, HardDrive, TrendingUp, Eye, AlertTriangle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface GenerationStats {
    totalGenerations: number;
    averageGenerationTime: number;
    fastestGeneration: number;
    slowestGeneration: number;
    toolsUsage: Record<string, { count: number; percentage: string }>;
    averageImageSize: string;
    totalStorageUsed: string;
    qualityDistribution: Record<string, number>;
    averageQualityScore: string;
    enginePerformance: Record<string, any>;
    recentGenerations: any[];
    hourlyBreakdown: { hour: string; count: number }[];
    successRate: string;
}

interface EngineHealth {
    'google-ai': EngineHealthData;
    'higgsfield': EngineHealthData;
    'huggingface': EngineHealthData;
}

interface EngineHealthData {
    total: number;
    success: number;
    failed: number;
    successRate: string;
    status: 'healthy' | 'degraded' | 'critical';
}

export default function GenerationCommandCenter() {
    const [stats, setStats] = useState<GenerationStats | null>(null);
    const [health, setHealth] = useState<EngineHealth | null>(null);
    const [queue, setQueue] = useState<any>(null);
    const [timeRange, setTimeRange] = useState('24h');
    const [loading, setLoading] = useState(true);
    const [autoRefresh, setAutoRefresh] = useState(true);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');

            // Fetch all data in parallel
            const [statsRes, healthRes, queueRes] = await Promise.all([
                fetch(`/api/admin/generation/dashboard?timeRange=${timeRange}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                fetch('/api/admin/generation/health', {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                fetch('/api/admin/generation/queue', {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
            ]);

            if (statsRes.ok) {
                const data = await statsRes.json();
                setStats(data.stats);
            }

            if (healthRes.ok) {
                const data = await healthRes.json();
                setHealth(data.engines);
            }

            if (queueRes.ok) {
                const data = await queueRes.json();
                setQueue(data.queue);
            }

            setLoading(false);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();

        // Auto-refresh every 5 seconds if enabled
        let interval: NodeJS.Timeout;
        if (autoRefresh) {
            interval = setInterval(fetchData, 5000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [timeRange, autoRefresh]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
                <div className="text-white text-2xl">Loading Command Center...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2">
                            🎯 Generation Command Center
                        </h1>
                        <p className="text-gray-300">Real-time AI Photo Generation Monitoring</p>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Time Range Selector */}
                        <select
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value)}
                            className="bg-white/10 text-white border border-white/20 rounded-lg px-4 py-2 backdrop-blur-sm"
                        >
                            <option value="1h">Last Hour</option>
                            <option value="24h">Last 24 Hours</option>
                            <option value="7d">Last 7 Days</option>
                            <option value="30d">Last 30 Days</option>
                            <option value="all">All Time</option>
                        </select>

                        {/* Auto-refresh Toggle */}
                        <button
                            onClick={() => setAutoRefresh(!autoRefresh)}
                            className={`px-4 py-2 rounded-lg font-semibold transition-all ${autoRefresh
                                    ? 'bg-green-500 text-white'
                                    : 'bg-gray-600 text-gray-300'
                                }`}
                        >
                            {autoRefresh ? '🔄 Auto-Refresh ON' : '⏸️ Auto-Refresh OFF'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Total Generations */}
                <StatCard
                    title="Total Generations"
                    value={stats?.totalGenerations || 0}
                    icon={<Activity className="w-8 h-8" />}
                    gradient="from-blue-500 to-cyan-500"
                />

                {/* Average Speed */}
                <StatCard
                    title="Avg. Generation Time"
                    value={`${stats?.averageGenerationTime || 0}ms`}
                    icon={<Zap className="w-8 h-8" />}
                    gradient="from-yellow-500 to-orange-500"
                    subtitle={`Fastest: ${stats?.fastestGeneration || 0}ms`}
                />

                {/* Storage Used */}
                <StatCard
                    title="Total Storage"
                    value={stats?.totalStorageUsed || '0 MB'}
                    icon={<HardDrive className="w-8 h-8" />}
                    gradient="from-purple-500 to-pink-500"
                    subtitle={`Avg: ${stats?.averageImageSize || '0 KB'}`}
                />

                {/* Success Rate */}
                <StatCard
                    title="Success Rate"
                    value={`${stats?.successRate || 0}%`}
                    icon={<TrendingUp className="w-8 h-8" />}
                    gradient="from-green-500 to-emerald-500"
                />
            </div>

            {/* Engine Health Status */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {health && Object.entries(health).map(([engine, data]) => (
                    <EngineCard key={engine} engine={engine} data={data} />
                ))}
            </div>

            {/* Tools Usage Chart */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">🛠️ AI Tools Usage</h2>
                <div className="space-y-4">
                    {stats?.toolsUsage && Object.entries(stats.toolsUsage).map(([tool, data]) => (
                        <div key={tool}>
                            <div className="flex justify-between text-white mb-2">
                                <span className="font-semibold capitalize">{tool}</span>
                                <span>{data.count} ({data.percentage}%)</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-3">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${data.percentage}%` }}
                                    transition={{ duration: 1, ease: 'easeOut' }}
                                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quality Distribution */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">💎 Quality Distribution</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {stats?.qualityDistribution && Object.entries(stats.qualityDistribution).map(([quality, count]) => (
                        <div key={quality} className="bg-white/5 rounded-lg p-4 text-center">
                            <div className="text-3xl font-bold text-white">{count}</div>
                            <div className="text-gray-300 text-sm mt-1">{quality}</div>
                        </div>
                    ))}
                </div>
                <div className="mt-4 text-center">
                    <span className="text-gray-300">Average Quality Score: </span>
                    <span className="text-white font-bold text-xl">{stats?.averageQualityScore || 0}/4</span>
                </div>
            </div>

            {/* Recent Generations */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6">
                <h2 className="text-2xl font-bold text-white mb-4">
                    <Eye className="inline mr-2" />
                    Recent Generations
                </h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-gray-300 border-b border-white/10">
                                <th className="pb-3">Time</th>
                                <th className="pb-3">Engine</th>
                                <th className="pb-3">Quality</th>
                                <th className="pb-3">Size</th>
                                <th className="pb-3">Speed</th>
                                <th className="pb-3">Status</th>
                            </tr>
                        </thead>
                        <tbody className="text-white">
                            {stats?.recentGenerations.map((gen, idx) => (
                                <tr key={gen.id} className="border-b border-white/5 hover:bg-white/5">
                                    <td className="py-3">{new Date(gen.timestamp).toLocaleTimeString()}</td>
                                    <td className="py-3">
                                        <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-sm">
                                            {gen.engine}
                                        </span>
                                    </td>
                                    <td className="py-3">{gen.quality}</td>
                                    <td className="py-3">{gen.size}</td>
                                    <td className="py-3">{gen.generationTime}</td>
                                    <td className="py-3">
                                        {gen.status === 'completed' ? (
                                            <CheckCircle className="w-5 h-5 text-green-400" />
                                        ) : (
                                            <AlertTriangle className="w-5 h-5 text-yellow-400" />
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

// Sub-components
function StatCard({ title, value, icon, gradient, subtitle }: any) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 hover:border-white/40 transition-all"
        >
            <div className="flex items-center justify-between mb-4">
                <div className={`bg-gradient-to-r ${gradient} p-3 rounded-xl`}>
                    {icon}
                </div>
            </div>
            <h3 className="text-gray-300 text-sm mb-1">{title}</h3>
            <div className="text-3xl font-bold text-white">{value}</div>
            {subtitle && <div className="text-gray-400 text-xs mt-1">{subtitle}</div>}
        </motion.div>
    );
}

function EngineCard({ engine, data }: { engine: string; data: EngineHealthData }) {
    const statusColors = {
        healthy: 'from-green-500 to-emerald-500',
        degraded: 'from-yellow-500 to-orange-500',
        critical: 'from-red-500 to-pink-500'
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6"
        >
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white capitalize">{engine}</h3>
                <div
                    className={`px-3 py-1 rounded-full text-sm font-bold bg-gradient-to-r ${statusColors[data.status]
                        } text-white`}
                >
                    {data.status.toUpperCase()}
                </div>
            </div>
            <div className="space-y-2 text-gray-300">
                <div className="flex justify-between">
                    <span>Success Rate:</span>
                    <span className="text-white font-bold">{data.successRate}%</span>
                </div>
                <div className="flex justify-between">
                    <span>Total:</span>
                    <span className="text-white">{data.total}</span>
                </div>
                <div className="flex justify-between">
                    <span>Success:</span>
                    <span className="text-green-400">{data.success}</span>
                </div>
                <div className="flex justify-between">
                    <span>Failed:</span>
                    <span className="text-red-400">{data.failed}</span>
                </div>
            </div>
        </motion.div>
    );
}
