'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function CountdownOverlay() {
    const [timeLeft, setTimeLeft] = useState({
        hours: 47,
        minutes: 59,
        seconds: 59
    });

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
                if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
                if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
                return prev;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (val: number) => val.toString().padStart(2, '0');

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none overflow-hidden">
            <motion.div
                initial={{ scale: 0.8, opacity: 0, rotate: -5 }}
                animate={{ scale: 1, opacity: 1, rotate: -5 }}
                transition={{ duration: 1, type: "spring" }}
                className="relative w-[120%] bg-blue-900/80 backdrop-blur-sm border-y-8 border-red-600 py-20 flex flex-col items-center justify-center transform -rotate-6 shadow-[0_0_50px_rgba(220,38,38,0.5)]"
            >
                <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-200 to-white drop-shadow-[0_2px_2px_rgba(220,38,38,0.8)] text-center mb-4 uppercase tracking-widest">
                    Working on it...
                </h1>

                <div className="text-2xl md:text-3xl font-bold text-white mb-8 flex gap-4">
                    <span>🇺🇸 Opening Soon</span>
                    <span>🇲🇽 Abriendo Pronto</span>
                    <span>🇫🇷 Ouverture Bientôt</span>
                </div>

                <div className="flex gap-4 md:gap-8 text-white font-mono font-black text-5xl md:text-8xl drop-shadow-[0_0_10px_rgba(255,0,0,0.8)]">
                    <div className="flex flex-col items-center">
                        <span>{formatTime(timeLeft.hours)}</span>
                        <span className="text-sm md:text-xl font-sans font-normal opacity-80">HRS</span>
                    </div>
                    <span className="animate-pulse">:</span>
                    <div className="flex flex-col items-center">
                        <span>{formatTime(timeLeft.minutes)}</span>
                        <span className="text-sm md:text-xl font-sans font-normal opacity-80">MIN</span>
                    </div>
                    <span className="animate-pulse">:</span>
                    <div className="flex flex-col items-center">
                        <span className="text-red-400">{formatTime(timeLeft.seconds)}</span>
                        <span className="text-sm md:text-xl font-sans font-normal opacity-80 text-red-400">SEC</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
