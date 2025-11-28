'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Battery, Utensils, Sparkles, Activity, Zap } from 'lucide-react';

interface DigitalTwinProps {
    petId: string;
    petName: string;
    species: string; // 'dog' | 'cat'
}

export default function DigitalTwinAvatar({ petId, petName, species }: DigitalTwinProps) {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [actionMessage, setActionMessage] = useState('');

    useEffect(() => {
        fetchStats();
        // Poll for updates every 30s
        const interval = setInterval(fetchStats, 30000);
        return () => clearInterval(interval);
    }, [petId]);

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/digital-twin/${petId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            setStats(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching twin stats:', error);
        }
    };

    const performAction = async (action: string) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/digital-twin/${petId}/action`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ action })
            });
            const data = await response.json();

            if (data.success) {
                setStats(data.twin);
                setActionMessage(data.message);
                setTimeout(() => setActionMessage(''), 2000);
            } else {
                alert(data.error);
            }
        } catch (error) {
            console.error('Error performing action:', error);
        }
    };

    if (loading) return <div className="animate-pulse bg-white/10 h-64 rounded-xl"></div>;

    // Determine avatar image based on species and status
    const getAvatarImage = () => {
        // Placeholder logic - in real app use 3D model or sprite sheet
        if (stats.status === 'sleeping') return '/avatars/sleeping.png';
        if (stats.happiness > 80) return '/avatars/happy.png';
        if (stats.hunger > 70) return '/avatars/hungry.png';
        return '/avatars/neutral.png';
    };

    return (
        <div className="bg-gradient-to-br from-indigo-900/80 to-purple-900/80 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-2xl relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-10 left-10 w-32 h-32 bg-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            {/* Header: Level & Name */}
            <div className="flex justify-between items-center mb-6 relative z-10">
                <div>
                    <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                        {petName} <span className="text-xs bg-yellow-500 text-black px-2 py-0.5 rounded-full">Lvl {stats.level}</span>
                    </h3>
                    <p className="text-gray-400 text-xs">Digital Twin • {stats.status}</p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-gray-400">XP</p>
                    <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-yellow-400 to-orange-500"
                            style={{ width: `${(stats.xp % 100)}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* Avatar Display Area */}
            <div className="relative h-64 flex items-center justify-center mb-8 group">
                {/* This would be the 3D model or Lottie animation */}
                <motion.div
                    animate={{
                        y: [0, -10, 0],
                        scale: stats.status === 'sleeping' ? 1 : [1, 1.02, 1]
                    }}
                    transition={{
                        repeat: Infinity,
                        duration: stats.status === 'sleeping' ? 4 : 2
                    }}
                    className="relative z-10"
                >
                    <div className="text-9xl filter drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]">
                        {species === 'dog' ? '🐕' : '🐈'}
                    </div>
                </motion.div>

                {/* Status Indicators (Floating) */}
                <AnimatePresence>
                    {actionMessage && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: -40 }}
                            exit={{ opacity: 0 }}
                            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white text-purple-900 px-4 py-2 rounded-full font-bold shadow-lg z-20 whitespace-nowrap"
                        >
                            {actionMessage}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6 relative z-10">
                <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                    <div className="flex justify-between text-xs text-gray-300 mb-1">
                        <span className="flex items-center gap-1"><Heart className="w-3 h-3 text-pink-500" /> Felicidad</span>
                        <span>{Math.round(stats.happiness)}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/10 rounded-full">
                        <div className="h-full bg-pink-500 rounded-full transition-all duration-500" style={{ width: `${stats.happiness}%` }}></div>
                    </div>
                </div>

                <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                    <div className="flex justify-between text-xs text-gray-300 mb-1">
                        <span className="flex items-center gap-1"><Battery className="w-3 h-3 text-green-500" /> Energía</span>
                        <span>{Math.round(stats.energy)}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/10 rounded-full">
                        <div className="h-full bg-green-500 rounded-full transition-all duration-500" style={{ width: `${stats.energy}%` }}></div>
                    </div>
                </div>

                <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                    <div className="flex justify-between text-xs text-gray-300 mb-1">
                        <span className="flex items-center gap-1"><Utensils className="w-3 h-3 text-orange-500" /> Hambre</span>
                        <span>{Math.round(stats.hunger)}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/10 rounded-full">
                        <div className="h-full bg-orange-500 rounded-full transition-all duration-500" style={{ width: `${stats.hunger}%` }}></div>
                    </div>
                </div>

                <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                    <div className="flex justify-between text-xs text-gray-300 mb-1">
                        <span className="flex items-center gap-1"><Sparkles className="w-3 h-3 text-blue-500" /> Higiene</span>
                        <span>{Math.round(stats.hygiene)}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/10 rounded-full">
                        <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${stats.hygiene}%` }}></div>
                    </div>
                </div>
            </div>

            {/* Actions Bar */}
            <div className="flex justify-between gap-2 relative z-10">
                <button
                    onClick={() => performAction('feed')}
                    className="flex-1 bg-white/10 hover:bg-orange-500/20 hover:text-orange-400 text-white py-3 rounded-xl flex flex-col items-center gap-1 transition-all"
                >
                    <Utensils className="w-5 h-5" />
                    <span className="text-xs font-semibold">Alimentar</span>
                </button>

                <button
                    onClick={() => performAction('play')}
                    className="flex-1 bg-white/10 hover:bg-pink-500/20 hover:text-pink-400 text-white py-3 rounded-xl flex flex-col items-center gap-1 transition-all"
                >
                    <Activity className="w-5 h-5" />
                    <span className="text-xs font-semibold">Jugar</span>
                </button>

                <button
                    onClick={() => performAction('clean')}
                    className="flex-1 bg-white/10 hover:bg-blue-500/20 hover:text-blue-400 text-white py-3 rounded-xl flex flex-col items-center gap-1 transition-all"
                >
                    <Sparkles className="w-5 h-5" />
                    <span className="text-xs font-semibold">Limpiar</span>
                </button>

                <button
                    onClick={() => performAction(stats.status === 'sleeping' ? 'wake' : 'sleep')}
                    className="flex-1 bg-white/10 hover:bg-purple-500/20 hover:text-purple-400 text-white py-3 rounded-xl flex flex-col items-center gap-1 transition-all"
                >
                    <Zap className="w-5 h-5" />
                    <span className="text-xs font-semibold">{stats.status === 'sleeping' ? 'Despertar' : 'Dormir'}</span>
                </button>
            </div>
        </div>
    );
}
