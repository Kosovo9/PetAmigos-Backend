'use client';

import React, { useState } from 'react';
import { Trophy, Users, DollarSign, Share2, Award, Copy } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AffiliateDashboard() {
    const [copied, setCopied] = useState(false);
    const referralLink = "https://petmatch.global/ref/PETMASTER2025";

    const copyLink = () => {
        navigator.clipboard.writeText(referralLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Header */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Affiliate Portal</h1>
                        <p className="text-green-600 font-medium">Level 5 - Platinum Ambassador</p>
                    </div>
                    <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-xl border border-gray-200 w-full md:w-auto">
                        <code className="text-sm flex-1 md:flex-none truncate text-gray-600 font-mono px-2">{referralLink}</code>
                        <button
                            onClick={copyLink}
                            className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            {copied ? <Award size={18} /> : <Copy size={18} />}
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Earnings Card */}
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                    <div className="relative z-10">
                        <p className="opacity-80 mb-1">Total Earnings</p>
                        <h2 className="text-4xl font-bold mb-4">$15,420</h2>
                        <div className="flex gap-2">
                            <span className="bg-white/20 px-2 py-1 rounded-lg text-sm">+ $1,200 this week</span>
                        </div>
                    </div>
                    <DollarSign className="absolute -bottom-4 -right-4 w-32 h-32 opacity-10 rotate-12" />
                </div>

                {/* Referrals Card */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                            <Users size={24} />
                        </div>
                        <span className="text-green-500 text-sm font-bold">+24 today</span>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-1">5,842</h3>
                    <p className="text-gray-500">Total Referrals</p>
                </div>

                {/* Rank Card */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-yellow-50 text-yellow-600 rounded-xl">
                            <Trophy size={24} />
                        </div>
                        <span className="text-purple-500 text-sm font-bold">Top 1%</span>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-1">#42</h3>
                    <p className="text-gray-500">Global Leaderboard Rank</p>
                </div>
            </div>

            {/* Network Visualization Placeholder */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100 min-h-[300px] flex items-center justify-center">
                <p className="text-gray-400">Viral Network Graph Visualization (D3.js) Loading...</p>
            </div>
        </div>
    );
}
