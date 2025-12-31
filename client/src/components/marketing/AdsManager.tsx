import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area
} from 'recharts';
import {
    ShieldCheck, Zap, Globe, Cpu, Target, Rocket, AlertTriangle, CheckCircle2
} from 'lucide-react';

/**
 * AdsManager Dashboard 1000X - Marketing Intelligence & Transparency
 * Visualizes AI insights, real-time metrics, and blockchain proofs.
 */
const AdsManager: React.FC = () => {
    const [stats, setStats] = useState({
        roi: 420.69,
        fraudBlocked: 12450,
        blockchainVerified: 99.8,
        activeCampaigns: 4
    });

    const [chartData] = useState([
        { name: 'Mon', impressions: 4000, conv: 240, roi: 5.2 },
        { name: 'Tue', impressions: 3000, conv: 198, roi: 4.8 },
        { name: 'Wed', impressions: 6000, conv: 580, roi: 7.1 },
        { name: 'Thu', impressions: 8000, conv: 1200, roi: 9.4 },
        { name: 'Fri', impressions: 12000, conv: 3400, roi: 12.5 },
        { name: 'Sat', impressions: 15000, conv: 4200, roi: 14.2 },
        { name: 'Sun', impressions: 18000, conv: 5100, roi: 15.9 },
    ]);

    return (
        <div className="min-h-screen bg-[#06060c] text-white p-4 md:p-8 font-outfit">
            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-center mb-12">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <h1 className="text-4xl font-black bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                        ADS INTELLIGENCE 300X
                    </h1>
                    <p className="text-slate-400 mt-2 flex items-center gap-2">
                        <Globe size={16} /> Global Nexus Real-Time Control
                    </p>
                </motion.div>

                <div className="flex gap-4 mt-6 md:mt-0">
                    <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-full flex items-center gap-3 backdrop-blur-xl">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-sm font-bold">BLOCKCHAIN ACTIVE</span>
                    </div>
                    <button className="px-6 py-3 bg-blue-600 hover:bg-blue-500 transition-all rounded-full font-bold shadow-lg shadow-blue-500/20">
                        LAUNCH GLOBAL AI
                    </button>
                </div>
            </header>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                {[
                    { label: 'Ecom ROI', value: `${stats.roi}%`, icon: <Zap className="text-yellow-400" />, trend: '+12.5%' },
                    { label: 'Fraud Shield', value: stats.fraudBlocked.toLocaleString(), icon: <ShieldCheck className="text-green-400" />, trend: '99.9% Eff' },
                    { label: 'Verified', value: `${stats.blockchainVerified}%`, icon: <CheckCircle2 className="text-blue-400" />, trend: 'On-Chain' },
                    { label: 'AI Prediction', value: '0.8s', icon: <Cpu className="text-purple-400" />, trend: 'Ultra-Low' },
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-xl group hover:border-blue-500/50 transition-all"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-white/10 rounded-2xl group-hover:scale-110 transition-transform">
                                {stat.icon}
                            </div>
                            <span className="text-xs font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded-lg">
                                {stat.trend}
                            </span>
                        </div>
                        <h3 className="text-3xl font-black">{stat.value}</h3>
                        <p className="text-slate-400 text-sm mt-1">{stat.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <Card title="Traffic & Conversion Flow" subtitle="AI-Augmented Path Analysis">
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorImp" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                                <XAxis dataKey="name" stroke="#64748b" />
                                <YAxis stroke="#64748b" />
                                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '15px' }} />
                                <Area type="monotone" dataKey="impressions" stroke="#3b82f6" fillOpacity={1} fill="url(#colorImp)" />
                                <Area type="monotone" dataKey="conv" stroke="#8b5cf6" fillOpacity={0.2} fill="#8b5cf6" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card title="Revenue Growth Strategy" subtitle="Predictive Forecasting (Next 30 Days)">
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                                <XAxis dataKey="name" stroke="#64748b" />
                                <YAxis stroke="#64748b" />
                                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '15px' }} />
                                <Bar dataKey="roi" fill="#3b82f6" radius={[10, 10, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>

            {/* AI Insights & Transparency */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
                    <h3 className="text-xl font-bold flex items-center gap-3 mb-6">
                        <Rocket className="text-blue-400" /> AI Optimization Feed
                    </h3>
                    <div className="space-y-4">
                        {[
                            { msg: "Subject line 'Love your pet' optimized for 14.5% higher open rate.", type: 'success' },
                            { msg: "High traffic detected from Mexico City. Increasing bid by 20%.", type: 'info' },
                            { msg: "Detected 34 bot attempts. Auto-blocked on blockchain.", type: 'warning' },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                                <div className={`w-2 h-2 rounded-full ${item.type === 'success' ? 'bg-green-500' : item.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'}`} />
                                <p className="text-sm text-slate-300">{item.msg}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-8 shadow-2xl shadow-purple-500/20">
                    <h3 className="text-2xl font-black mb-4">ULTIMATE SCALING</h3>
                    <p className="text-purple-100 mb-8 leading-relaxed">
                        Nuestra IA ha detectado un patrón de crecimiento exponencial en el segmento Dog Lovers.
                    </p>
                    <div className="space-y-4">
                        <button className="w-full py-4 bg-white text-[#0f0f23] rounded-2xl font-black hover:scale-105 transition-transform">
                            DEPLOY AUTO-CAMPAIGN
                        </button>
                        <button className="w-full py-4 bg-white/10 border border-white/20 rounded-2xl font-bold hover:bg-white/20 transition-all">
                            VIEW TRANSCRIPT
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Card: React.FC<{ title: string; subtitle: string; children: React.ReactNode }> = ({ title, subtitle, children }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl"
    >
        <div className="mb-8">
            <h3 className="text-xl font-bold">{title}</h3>
            <p className="text-slate-400 text-sm mt-1">{subtitle}</p>
        </div>
        {children}
    </motion.div>
);

export default AdsManager;
