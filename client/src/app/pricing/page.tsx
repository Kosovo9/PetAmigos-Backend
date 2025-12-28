'use client';

import React from 'react';
import { Check, Sparkles, Zap, Globe } from 'lucide-react';
import Link from 'next/link';
import { config } from '../../lib/config';

export default function PricingPage() {
    const handleCheckout = async (type: string) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                window.location.href = '/signup';
                return;
            }

            const res = await fetch(`${config.apiUrl}/pay/create-checkout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ type })
            });

            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            }
        } catch (error) {
            console.error('Checkout error:', error);
            alert('Error starting checkout. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-black text-white py-24 px-4">
            <div className="container mx-auto max-w-6xl">
                <div className="text-center mb-16">
                    <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent mb-6">
                        Unlock the Universe
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Premium AI generation, global lost pet tracking, and exclusive Christmas themes.
                        Monetize your pet's cuteness at lightspeed.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Basic Plan */}
                    <div className="bg-[#111] border border-white/10 rounded-3xl p-8 flex flex-col hover:border-white/30 transition-all">
                        <div className="mb-4">
                            <span className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Explorer</span>
                        </div>
                        <h3 className="text-3xl font-bold mb-2">Free</h3>
                        <div className="text-4xl font-black mb-6">$0<span className="text-lg text-gray-500 font-normal">/mo</span></div>
                        <ul className="space-y-4 mb-8 flex-1">
                            <li className="flex items-center gap-3 text-gray-300">
                                <Check className="text-green-500" size={20} />
                                3 AI Photos / day (Watermarked)
                            </li>
                            <li className="flex items-center gap-3 text-gray-300">
                                <Check className="text-green-500" size={20} />
                                View Lost Pets
                            </li>
                            <li className="flex items-center gap-3 text-gray-300">
                                <Check className="text-green-500" size={20} />
                                Basic Chat Support
                            </li>
                        </ul>
                        <Link href="/signup" className="w-full bg-white/10 hover:bg-white/20 text-white py-4 rounded-xl font-bold text-center transition-all">
                            Start Free
                        </Link>
                    </div>

                    {/* Pro Plan - Highlighted */}
                    <div className="bg-gradient-to-b from-purple-900/50 to-[#111] border border-purple-500 rounded-3xl p-8 flex flex-col relative transform md:-translate-y-4 shadow-[0_0_50px_rgba(168,85,247,0.3)]">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                            MOST POPULAR
                        </div>
                        <div className="mb-4">
                            <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Pro Creator</span>
                        </div>
                        <h3 className="text-3xl font-bold mb-2">Pro</h3>
                        <div className="text-4xl font-black mb-6">$9.99<span className="text-lg text-gray-500 font-normal">/mo</span></div>
                        <ul className="space-y-4 mb-8 flex-1">
                            <li className="flex items-center gap-3 text-white">
                                <Sparkles className="text-purple-400" size={20} />
                                <span className="font-bold">Unlimited AI Photos</span>
                            </li>
                            <li className="flex items-center gap-3 text-white">
                                <Check className="text-purple-400" size={20} />
                                No Watermarks
                            </li>
                            <li className="flex items-center gap-3 text-white">
                                <Check className="text-purple-400" size={20} />
                                8K Ultra-HD Downloads
                            </li>
                            <li className="flex items-center gap-3 text-white">
                                <Check className="text-purple-400" size={20} />
                                Priority Generation (Fast Lane)
                            </li>
                            <li className="flex items-center gap-3 text-white">
                                <Globe className="text-purple-400" size={20} />
                                Global Lost Pet Alerts
                            </li>
                        </ul>
                        <button
                            onClick={() => handleCheckout('pack_starter')} // Using pack_starter as proxy for Pro for now
                            className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white py-4 rounded-xl font-bold text-center transition-all shadow-lg shadow-purple-600/25"
                        >
                            Get Pro Access
                        </button>
                    </div>

                    {/* Enterprise Plan */}
                    <div className="bg-[#111] border border-white/10 rounded-3xl p-8 flex flex-col hover:border-white/30 transition-all">
                        <div className="mb-4">
                            <span className="bg-blue-900/30 text-blue-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Agency</span>
                        </div>
                        <h3 className="text-3xl font-bold mb-2">Agency</h3>
                        <div className="text-4xl font-black mb-6">$49<span className="text-lg text-gray-500 font-normal">/mo</span></div>
                        <ul className="space-y-4 mb-8 flex-1">
                            <li className="flex items-center gap-3 text-gray-300">
                                <Zap className="text-blue-400" size={20} />
                                API Access
                            </li>
                            <li className="flex items-center gap-3 text-gray-300">
                                <Check className="text-blue-400" size={20} />
                                Commercial License
                            </li>
                            <li className="flex items-center gap-3 text-gray-300">
                                <Check className="text-blue-400" size={20} />
                                Dedicated Support
                            </li>
                            <li className="flex items-center gap-3 text-gray-300">
                                <Check className="text-blue-400" size={20} />
                                Custom Branding
                            </li>
                        </ul>
                        <button
                            onClick={() => handleCheckout('lifetime')} // Agency maps to lifetime for now
                            className="w-full bg-white/10 hover:bg-white/20 text-white py-4 rounded-xl font-bold text-center transition-all"
                        >
                            Contact Sales
                        </button>
                    </div>
                </div>

                <div className="mt-20 text-center">
                    <p className="text-gray-500 text-sm">
                        Secure payments processed by Stripe & Lemon Squeezy. Cancel anytime.
                        <br />
                        100% Satisfaction Guarantee.
                    </p>
                </div>
            </div>
        </div>
    );
}
